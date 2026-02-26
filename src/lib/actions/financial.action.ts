"use server";

import { createClient } from "@/lib/supabase/server";

async function verifyAdmin() {
    const supabase = createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Unauthorized");

    const { data } = await supabase
        .from("admins")
        .select("role")
        .eq("id", user.id)
        .single();
    if (!data) throw new Error("Not an admin");

    return { supabase, user };
}

export async function getRevenueProjectionAction() {
    try {
        const { supabase } = await verifyAdmin();

        // Fetch all students who have a monthly fee configured
        const { data: students, error } = await supabase
            .from("students")
            .select("monthly_fee_amount")
            .not("monthly_fee_amount", "is", null);

        if (error) throw error;

        const monthlyRevenue = students.reduce((sum, student) => sum + (Number(student.monthly_fee_amount) || 0), 0);

        // Simple projection for the next 3 months
        const projection = [
            { month: "Month 1", amount: monthlyRevenue },
            { month: "Month 2", amount: monthlyRevenue },
            { month: "Month 3", amount: monthlyRevenue },
        ];

        return {
            success: true,
            data: {
                monthlyBase: monthlyRevenue,
                threeMonthTotal: monthlyRevenue * 3,
                projection
            }
        };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function getFinancialSummaryAction(startDate?: string, endDate?: string) {
    try {
        const { supabase } = await verifyAdmin();

        // 1. Fetch Income (Fee Payments)
        let incomeQuery = supabase.from("fee_payments").select("paid_amount, payment_date");
        if (startDate) incomeQuery = incomeQuery.gte("payment_date", startDate);
        if (endDate) incomeQuery = incomeQuery.lte("payment_date", endDate);
        
        const { data: incomeData, error: incomeError } = await incomeQuery;
        if (incomeError) throw incomeError;

        const totalIncome = incomeData.reduce((sum, item) => sum + Number(item.paid_amount), 0);

        // 2. Fetch Operational Expenses
        let expenseQuery = supabase.from("branch_expenses").select("amount, date, type");
        if (startDate) expenseQuery = expenseQuery.gte("date", startDate);
        if (endDate) expenseQuery = expenseQuery.lte("date", endDate);

        const { data: expenseData, error: expenseError } = await expenseQuery;
        if (expenseError) throw expenseError;

        const totalOpExpenses = expenseData.reduce((sum, item) => sum + Number(item.amount), 0);

        // 3. Fetch Salary Expenses
        // Note: salary_records use 'month' and 'year' strings, which makes range filtering tricky.
        // For now we'll fetch all or filter by year if provided in endDate
        let salaryQuery = supabase.from("salary_records").select("net_salary, month, year, created_at");
        const { data: salaryData, error: salaryError } = await salaryQuery;
        if (salaryError) throw salaryError;

        // Filter salaries by created_at if range specified
        const filteredSalaries = salaryData.filter(s => {
            if (!startDate && !endDate) return true;
            const createdAt = new Date(s.created_at).toISOString().split('T')[0];
            if (startDate && createdAt < startDate) return false;
            if (endDate && createdAt > endDate) return false;
            return true;
        });

        const totalSalaries = filteredSalaries.reduce((sum, item) => sum + Number(item.net_salary), 0);

        const totalExpenses = totalOpExpenses + totalSalaries;
        const netProfit = totalIncome - totalExpenses;

        return {
            success: true,
            data: {
                totalIncome,
                totalOpExpenses,
                totalSalaries,
                totalExpenses,
                netProfit,
                incomeCount: incomeData.length,
                expenseCount: expenseData.length,
                salaryCount: filteredSalaries.length
            }
        };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
