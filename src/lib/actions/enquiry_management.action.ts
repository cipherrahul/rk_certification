"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

export async function getEnquiriesAction(filters?: { status?: string; search?: string }) {
    try {
        const { supabase } = await verifyAdmin();

        let query = supabase
            .from("enquiries")
            .select("*")
            .order("created_at", { ascending: false });

        if (filters?.status) {
            query = query.eq("status", filters.status);
        }

        const { data, error } = await query;
        if (error) throw error;

        let result = data || [];
        if (filters?.search) {
            const s = filters.search.toLowerCase();
            result = result.filter(e =>
                e.student_name?.toLowerCase().includes(s) ||
                e.parent_name?.toLowerCase().includes(s) ||
                e.mobile_number?.includes(s) ||
                e.email?.toLowerCase().includes(s)
            );
        }

        return { success: true, data: result };
    } catch (err: any) {
        return { success: false, error: err.message, data: [] };
    }
}

export async function updateEnquiryStatusAction(id: string, status: string) {
    try {
        const { supabase } = await verifyAdmin();

        const { error } = await supabase
            .from("enquiries")
            .update({ status, updated_at: new Date().toISOString() })
            .eq("id", id);

        if (error) throw error;

        revalidatePath("/admin/inquiries");
        revalidatePath("/admin/mis");
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function deleteEnquiryAction(id: string) {
    try {
        const { supabase } = await verifyAdmin();

        const { error } = await supabase
            .from("enquiries")
            .delete()
            .eq("id", id);

        if (error) throw error;

        revalidatePath("/admin/inquiries");
        revalidatePath("/admin/mis");
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
