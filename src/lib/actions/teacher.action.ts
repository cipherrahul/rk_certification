"use server";

import { createClient } from "@/lib/supabase/server";
import { TeacherFormValues } from "@/lib/schemas/teacher.schema";
import { revalidatePath } from "next/cache";

// ── helpers ────────────────────────────────────────────────
function generateTeacherId(count: number): string {
    const year = new Date().getFullYear();
    const seq = (count + 1).toString().padStart(3, "0");
    return `RK${year}TCH${seq}`;
}

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

// ── createTeacherAction ─────────────────────────────────────
export async function createTeacherAction(
    data: TeacherFormValues,
    photoBase64?: string
) {
    try {
        const { supabase } = await verifyAdmin();

        // Count existing teachers to sequence ID
        const { count } = await supabase
            .from("teachers")
            .select("*", { count: "exact", head: true });

        const teacherId = generateTeacherId(count || 0);

        // Upload photo if provided
        let photoUrl: string | null = null;
        if (photoBase64) {
            const base64Data = photoBase64.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, "base64");
            const ext = photoBase64.split(";")[0].split("/")[1] || "jpg";
            const filePath = `photos/${teacherId}.${ext}`;

            const { error: uploadError } = await supabase.storage
                .from("teachers")
                .upload(filePath, buffer, { contentType: `image/${ext}`, upsert: true });

            if (!uploadError) {
                const { data: urlData } = supabase.storage
                    .from("teachers")
                    .getPublicUrl(filePath);
                photoUrl = urlData.publicUrl;
            }
        }

        const { error: insertError } = await supabase.from("teachers").insert({
            teacher_id: teacherId,
            name: data.name,
            branch: data.branch,
            department: data.department,
            assigned_class: data.assignedClass,
            subject: data.subject,
            qualification: data.qualification,
            experience: data.experience,
            contact: data.contact,
            joining_date: data.joiningDate.toISOString().split("T")[0],
            basic_salary: data.basicSalary,
            allowances: data.allowances,
            photo_url: photoUrl,
            branch_id: data.branchId,
            role: data.role,
        });

        if (insertError) {
            console.error("Insert error:", insertError);
            return { success: false, error: "Failed to save teacher." };
        }

        revalidatePath("/admin/teachers");
        return { success: true, teacherId };
    } catch (err: unknown) {
        let msg = "Unexpected error.";
        if (err instanceof Error) msg = err.message;
        return { success: false, error: msg };
    }
}

// ── getTeachersAction ───────────────────────────────────────
export async function getTeachersAction(filters?: {
    department?: string;
    search?: string;
}) {
    try {
        const { supabase } = await verifyAdmin();

        let query = supabase
            .from("teachers")
            .select("*")
            .order("created_at", { ascending: false });

        if (filters?.department) query = query.eq("department", filters.department);

        const { data, error } = await query;
        if (error) return { success: false, error: error.message, data: [] };

        let result = data || [];

        if (filters?.search) {
            const s = filters.search.toLowerCase();
            result = result.filter(
                (t: { name: string; teacher_id: string; subject: string; department: string; assigned_class: string; branch: string }) =>
                    t.name.toLowerCase().includes(s) ||
                    t.teacher_id.toLowerCase().includes(s) ||
                    t.subject.toLowerCase().includes(s) ||
                    t.department.toLowerCase().includes(s) ||
                    t.branch.toLowerCase().includes(s) ||
                    t.assigned_class.toLowerCase().includes(s)
            );
        }

        return { success: true, data: result };
    } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : "Unexpected error", data: [] };
    }
}

// ── getTeacherByIdAction ────────────────────────────────────
export async function getTeacherByIdAction(id: string) {
    try {
        const { supabase } = await verifyAdmin();

        const { data, error } = await supabase
            .from("teachers")
            .select(`*, branches(*), salary_records(*)`)
            .eq("id", id)
            .single();

        if (error || !data) return { success: false, error: "Teacher not found." };
        return { success: true, data };
    } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : "Unexpected error" };
    }
}

// ── updateTeacherAction ─────────────────────────────────────
export async function updateTeacherAction(
    id: string,
    data: TeacherFormValues,
    photoBase64?: string
) {
    try {
        const { supabase } = await verifyAdmin();

        // Fetch existing record to get teacher_id for photo naming
        const { data: existing } = await supabase
            .from("teachers")
            .select("teacher_id, photo_url")
            .eq("id", id)
            .single();

        let photoUrl = existing?.photo_url || null;

        if (photoBase64) {
            const base64Data = photoBase64.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, "base64");
            const ext = photoBase64.split(";")[0].split("/")[1] || "jpg";
            const filePath = `photos/${existing?.teacher_id}.${ext}`;

            const { error: uploadError } = await supabase.storage
                .from("teachers")
                .upload(filePath, buffer, { contentType: `image/${ext}`, upsert: true });

            if (!uploadError) {
                const { data: urlData } = supabase.storage
                    .from("teachers")
                    .getPublicUrl(filePath);
                photoUrl = urlData.publicUrl;
            }
        }

        const { error: updateError } = await supabase
            .from("teachers")
            .update({
                name: data.name,
                branch: data.branch,
                department: data.department,
                assigned_class: data.assignedClass,
                subject: data.subject,
                qualification: data.qualification,
                experience: data.experience,
                contact: data.contact,
                joining_date: data.joiningDate.toISOString().split("T")[0],
                basic_salary: data.basicSalary,
                allowances: data.allowances,
                photo_url: photoUrl,
                branch_id: data.branchId,
                role: data.role,
            })
            .eq("id", id);

        if (updateError) {
            return { success: false, error: "Failed to update teacher." };
        }

        revalidatePath("/admin/teachers");
        revalidatePath(`/admin/teachers/${id}`);
        return { success: true };
    } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : "Unexpected error" };
    }
}

// ── deleteTeacherAction ─────────────────────────────────────
export async function deleteTeacherAction(id: string) {
    try {
        const { supabase } = await verifyAdmin();

        const { error } = await supabase.from("teachers").delete().eq("id", id);
        if (error) return { success: false, error: "Failed to delete teacher." };

        revalidatePath("/admin/teachers");
        return { success: true };
    } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : "Unexpected error" };
    }
}

// ── updateTeacherPasswordAction ──────────────────────────
export async function updateTeacherPasswordAction(id: string, newPasswordHash: string) {
    try {
        const { supabase } = await verifyAdmin();
        const { error } = await supabase
            .from("teachers")
            .update({ password_hash: newPasswordHash })
            .eq("id", id);
        if (error) throw error;
        return { success: true };
    } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : "Failed to update password" };
    }
}
