"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { BranchExpenseFormValues, ExpenseCategoryFormValues } from "@/lib/schemas/branch";
import { format } from "date-fns";

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

// ── Category Actions ─────────────────────────────────────────
export async function createExpenseCategoryAction(data: ExpenseCategoryFormValues) {
    try {
        const { supabase } = await verifyAdmin();
        const { error } = await supabase.from("expense_categories").insert({
            name: data.name,
            description: data.description,
            color: data.color,
        });

        if (error) throw error;
        revalidatePath("/admin/expenses/categories");
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function getExpenseCategoriesAction() {
    try {
        const { supabase } = await verifyAdmin();
        const { data, error } = await supabase
            .from("expense_categories")
            .select("*")
            .order("name", { ascending: true });

        if (error) throw error;
        return { success: true, data };
    } catch (err: any) {
        return { success: false, error: err.message, data: [] };
    }
}

export async function updateExpenseCategoryAction(id: string, data: ExpenseCategoryFormValues) {
    try {
        const { supabase } = await verifyAdmin();
        const { error } = await supabase
            .from("expense_categories")
            .update({
                name: data.name,
                description: data.description,
                color: data.color,
            })
            .eq("id", id);

        if (error) throw error;
        revalidatePath("/admin/expenses/categories");
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function deleteExpenseCategoryAction(id: string) {
    try {
        const { supabase } = await verifyAdmin();
        const { error } = await supabase
            .from("expense_categories")
            .delete()
            .eq("id", id);

        if (error) throw error;
        revalidatePath("/admin/expenses/categories");
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

// ── Expense Actions ─────────────────────────────────────────
export async function createEnhancedExpenseAction(data: BranchExpenseFormValues) {
    try {
        const { supabase } = await verifyAdmin();
        const { error } = await supabase.from("branch_expenses").insert({
            branch_id: data.branchId,
            category_id: data.categoryId,
            amount: data.amount,
            date: data.date.toISOString().split("T")[0],
            description: data.description,
            is_recurring: data.isRecurring,
            recurring_interval: data.recurringInterval,
        });

        if (error) throw error;
        revalidatePath("/admin/expenses/list");
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function getExpensesAction(filters?: { branchId?: string; categoryId?: string; startDate?: string; endDate?: string }) {
    try {
        const { supabase } = await verifyAdmin();
        let query = supabase
            .from("branch_expenses")
            .select("*, branches(name), expense_categories(*)")
            .order("date", { ascending: false });

        if (filters?.branchId) query = query.eq("branch_id", filters.branchId);
        if (filters?.categoryId) query = query.eq("category_id", filters.categoryId);
        if (filters?.startDate) query = query.gte("date", filters.startDate);
        if (filters?.endDate) query = query.lte("date", filters.endDate);

        const { data, error } = await query;
        if (error) throw error;
        return { success: true, data };
    } catch (err: any) {
        return { success: false, error: err.message, data: [] };
    }
}

// ── Analytics Actions ───────────────────────────────────────
export async function getExpenseAnalyticsDataAction(branchId?: string) {
    try {
        const { supabase } = await verifyAdmin();

        // 1. Get Expenses grouped by category
        let expQuery = supabase
            .from("branch_expenses")
            .select("amount, expense_categories(name, color)");

        if (branchId) expQuery = expQuery.eq("branch_id", branchId);

        const { data: expData, error: expError } = await expQuery;
        if (expError) throw expError;

        const categorySummary: Record<string, { name: string; value: number; color: string }> = {};
        expData.forEach((exp: any) => {
            const catName = exp.expense_categories?.name || "Uncategorized";
            const catColor = exp.expense_categories?.color || "#94a3b8";
            if (!categorySummary[catName]) {
                categorySummary[catName] = { name: catName, value: 0, color: catColor };
            }
            categorySummary[catName].value += Number(exp.amount);
        });

        // 2. Trend Data (Last 6 Months)
        const trendMonths = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            trendMonths.push({
                name: format(d, "MMM"),
                month: d.getMonth(),
                year: d.getFullYear(),
                profit: 0,
                revenue: 0
            });
        }

        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 5);
        startDate.setDate(1);

        // Fetch Expenses for trend
        const { data: trendExpenses, error: trendExpError } = await supabase
            .from("branch_expenses")
            .select("amount, date")
            .gte("date", startDate.toISOString().split("T")[0]);

        if (trendExpError) throw trendExpError;

        // Fetch Revenue for trend
        const { data: trendRevenue, error: trendRevError } = await supabase
            .from("fee_payments")
            .select("paid_amount, payment_date")
            .gte("payment_date", startDate.toISOString().split("T")[0]);

        if (trendRevError) throw trendRevError;

        // Map trend data
        trendMonths.forEach(m => {
            const monthExpenses = trendExpenses
                ?.filter(e => {
                    const d = new Date(e.date);
                    return d.getMonth() === m.month && d.getFullYear() === m.year;
                })
                .reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

            const monthRevenue = trendRevenue
                ?.filter(r => {
                    const d = new Date(r.payment_date);
                    return d.getMonth() === m.month && d.getFullYear() === m.year;
                })
                .reduce((acc, curr) => acc + Number(curr.paid_amount), 0) || 0;

            m.profit = monthRevenue - monthExpenses;
            m.revenue = monthRevenue;
        });

        return {
            success: true,
            data: {
                categoryBreakdown: Object.values(categorySummary),
                trendData: trendMonths
            }
        };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

// ── Automation Logic ────────────────────────────────────────
export async function processRecurringExpensesAction() {
    try {
        const { supabase } = await verifyAdmin();
        const today = new Date();

        // 1. Fetch all recurring expenses
        const { data: recurring, error } = await supabase
            .from("branch_expenses")
            .select("*")
            .eq("is_recurring", true);

        if (error) throw error;

        let generatedCount = 0;
        for (const item of recurring) {
            const lastRun = item.last_automated_at ? new Date(item.last_automated_at) : new Date(item.date);
            let shouldRun = false;
            let nextRun = new Date(lastRun);

            if (item.recurring_interval === "Monthly") {
                nextRun.setMonth(nextRun.getMonth() + 1);
            } else if (item.recurring_interval === "Weekly") {
                nextRun.setDate(nextRun.getDate() + 7);
            } else if (item.recurring_interval === "Quarterly") {
                nextRun.setMonth(nextRun.getMonth() + 3);
            } else if (item.recurring_interval === "Yearly") {
                nextRun.setFullYear(nextRun.getFullYear() + 1);
            }

            if (today >= nextRun) {
                shouldRun = true;
            }

            if (shouldRun) {
                // Create new expense record
                const { error: insError } = await supabase.from("branch_expenses").insert({
                    branch_id: item.branch_id,
                    category_id: item.category_id,
                    amount: item.amount,
                    date: nextRun.toISOString().split("T")[0],
                    description: `[Auto-Generated] ${item.description || ""}`,
                    is_recurring: true,
                    recurring_interval: item.recurring_interval,
                    last_automated_at: nextRun.toISOString()
                });

                if (!insError) {
                    // Update original record's last_automated_at
                    await supabase
                        .from("branch_expenses")
                        .update({ last_automated_at: nextRun.toISOString() })
                        .eq("id", item.id);
                    generatedCount++;
                }
            }
        }

        if (generatedCount > 0) revalidatePath("/admin/expenses/list");
        return { success: true, count: generatedCount };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
