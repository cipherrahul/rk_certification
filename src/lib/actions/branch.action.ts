"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { BranchFormValues, BranchClassFormValues, BranchExpenseFormValues } from "@/lib/schemas/branch";

// ── helpers ────────────────────────────────────────────────
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

// ── Branch Actions ──────────────────────────────────────────
export async function createBranchAction(data: BranchFormValues) {
    try {
        const { supabase } = await verifyAdmin();
        const { error } = await supabase.from("branches").insert({
            name: data.name,
            code: data.code,
            city: data.city,
            state: data.state,
            address: data.address,
            contact_number: data.contactNumber,
            email: data.email,
            opening_date: data.openingDate.toISOString().split("T")[0],
            status: data.status,
        });

        if (error) throw error;
        revalidatePath("/admin/branches");
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function getBranchesAction() {
    try {
        const { supabase } = await verifyAdmin();
        const { data, error } = await supabase
            .from("branches")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return { success: true, data };
    } catch (err: any) {
        return { success: false, error: err.message, data: [] };
    }
}

export async function getBranchByIdAction(id: string) {
    try {
        const { supabase } = await verifyAdmin();
        const { data, error } = await supabase
            .from("branches")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

// ── Class Actions ───────────────────────────────────────────
export async function createBranchClassAction(data: BranchClassFormValues) {
    try {
        const { supabase } = await verifyAdmin();
        const { error } = await supabase.from("branch_classes").insert({
            branch_id: data.branchId,
            name: data.name,
            course_type: data.courseType,
            duration: data.duration,
            fee_structure: data.feeStructure,
        });

        if (error) throw error;
        revalidatePath(`/admin/branches/${data.branchId}`);
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function getBranchClassesAction(branchId: string) {
    try {
        const { supabase } = await verifyAdmin();
        const { data, error } = await supabase
            .from("branch_classes")
            .select("*")
            .eq("branch_id", branchId);

        if (error) throw error;
        return { success: true, data };
    } catch (err: any) {
        return { success: false, error: err.message, data: [] };
    }
}

// ── Expense Actions ─────────────────────────────────────────
export async function createBranchExpenseAction(data: BranchExpenseFormValues) {
    try {
        const { supabase } = await verifyAdmin();
        const { error } = await supabase.from("branch_expenses").insert({
            branch_id: data.branchId,
            type: data.type,
            amount: data.amount,
            date: data.date.toISOString().split("T")[0],
            description: data.description,
        });

        if (error) throw error;
        revalidatePath(`/admin/branches/${data.branchId}`);
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

// ── Analytics Actions ───────────────────────────────────────
export async function getBranchAnalyticsAction(branchId: string) {
    try {
        const { supabase } = await verifyAdmin();

        // 1. Revenue: Total fees collected from students in this branch
        const { data: feeData, error: feeError } = await supabase
            .from("fee_payments")
            .select("paid_amount, students!inner(branch_id)")
            .eq("students.branch_id", branchId);

        if (feeError) throw feeError;
        const totalRevenue = feeData.reduce((acc, curr) => acc + Number(curr.paid_amount), 0);

        // 2. Expenses: Operational Expenses + Team Salaries
        // Operational Expenses
        const { data: expData, error: expError } = await supabase
            .from("branch_expenses")
            .select("amount")
            .eq("branch_id", branchId);

        if (expError) throw expError;
        const operationalExpenses = expData.reduce((acc, curr) => acc + Number(curr.amount), 0);

        // Team Salaries (from salary_records for teachers in this branch)
        const { data: salData, error: salError } = await supabase
            .from("salary_records")
            .select("net_salary, teachers!inner(branch_id)")
            .eq("teachers.branch_id", branchId);

        if (salError) throw salError;
        const salaryExpenses = salData.reduce((acc, curr) => acc + Number(curr.net_salary), 0);

        const totalExpenses = operationalExpenses + salaryExpenses;
        const netProfit = totalRevenue - totalExpenses;
        const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

        // 3. Student Count
        const { count: studentCount } = await supabase
            .from("students")
            .select("*", { count: "exact", head: true })
            .eq("branch_id", branchId);

        const { count: teacherCount } = await supabase
            .from("teachers")
            .select("*", { count: "exact", head: true })
            .eq("branch_id", branchId);

        return {
            success: true,
            data: {
                totalRevenue,
                totalExpenses,
                netProfit,
                profitMargin: totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0,
                totalStudents: studentCount || 0,
                totalTeachers: teacherCount || 0,
            }
        };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function getCompanyWideAnalyticsAction() {
    try {
        const { supabase } = await verifyAdmin();

        // Total Revenue
        const { data: feeData, error: feeError } = await supabase
            .from("fee_payments")
            .select("paid_amount");
        if (feeError) throw feeError;
        const totalRevenue = feeData.reduce((acc, curr) => acc + Number(curr.paid_amount), 0);

        // Total Operating Expenses
        const { data: expData, error: expError } = await supabase
            .from("branch_expenses")
            .select("amount");
        if (expError) throw expError;
        const totalOpExpenses = expData.reduce((acc, curr) => acc + Number(curr.amount), 0);

        // Total Salary Expenses
        const { data: salData, error: salError } = await supabase
            .from("salary_records")
            .select("net_salary");
        if (salError) throw salError;
        const totalSalaryExpenses = salData.reduce((acc, curr) => acc + Number(curr.net_salary), 0);

        const totalExpenses = totalOpExpenses + totalSalaryExpenses;
        const totalProfit = totalRevenue - totalExpenses;

        return {
            success: true,
            data: {
                totalRevenue,
                totalProfit,
                totalExpenses
            }
        };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function updateBranchAction(id: string, data: BranchFormValues) {
    try {
        const { supabase } = await verifyAdmin();
        const { error } = await supabase
            .from("branches")
            .update({
                name: data.name,
                code: data.code,
                city: data.city,
                state: data.state,
                address: data.address,
                contact_number: data.contactNumber,
                email: data.email,
                opening_date: data.openingDate.toISOString().split("T")[0],
                status: data.status,
            })
            .eq("id", id);

        if (error) throw error;
        revalidatePath("/admin/branches");
        revalidatePath(`/admin/branches/${id}`);
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function deleteBranchAction(id: string) {
    try {
        const { supabase } = await verifyAdmin();
        const { error } = await supabase
            .from("branches")
            .delete()
            .eq("id", id);

        if (error) throw error;
        revalidatePath("/admin/branches");
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
