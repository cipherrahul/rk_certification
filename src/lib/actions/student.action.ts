"use server";

import { createClient } from "@/lib/supabase/server";
import { StudentFormValues } from "@/lib/schemas/student";
import { revalidatePath } from "next/cache";

// ── helpers ────────────────────────────────────────────────
function generateStudentId(count: number): string {
    const year = new Date().getFullYear();
    const seq = (count + 1).toString().padStart(3, "0");
    return `RK${year}STU${seq}`;
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

// ── createStudentAction ─────────────────────────────────────
export async function createStudentAction(
    data: StudentFormValues,
    photoBase64?: string
) {
    try {
        const { supabase } = await verifyAdmin();

        // Count existing students to sequence ID
        const { count } = await supabase
            .from("students")
            .select("*", { count: "exact", head: true });

        const studentId = generateStudentId(count || 0);

        // Upload photo if provided
        let photoUrl: string | null = null;
        if (photoBase64) {
            const base64Data = photoBase64.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, "base64");
            const ext = photoBase64.split(";")[0].split("/")[1] || "jpg";
            const filePath = `photos/${studentId}.${ext}`;

            const { error: uploadError } = await supabase.storage
                .from("students")
                .upload(filePath, buffer, { contentType: `image/${ext}`, upsert: true });

            if (!uploadError) {
                const { data: urlData } = supabase.storage
                    .from("students")
                    .getPublicUrl(filePath);
                photoUrl = urlData.publicUrl;
            }
        }

        const { error: insertError } = await supabase.from("students").insert({
            student_id: studentId,
            first_name: data.firstName,
            last_name: data.lastName,
            date_of_birth: data.dateOfBirth.toISOString().split("T")[0],
            father_name: data.fatherName,
            mobile: data.mobile,
            course: data.course,
            academic_session: data.academicSession,
            student_class: data.studentClass,
            total_course_fee: data.totalCourseFee,
            admission_fee: data.admissionFee,
            monthly_fee_amount: data.monthlyFeeAmount,
            payment_start_date: data.paymentStartDate.toISOString().split("T")[0],
            payment_mode: data.paymentMode,
            photo_url: photoUrl,
            branch_id: data.branchId,
            class_id: data.classId,
        });

        if (insertError) {
            console.error("Insert error:", insertError);
            return { success: false, error: "Failed to save student." };
        }

        revalidatePath("/admin/students");
        return { success: true, studentId };
    } catch (err: unknown) {
        let msg = "Unexpected error.";
        if (err instanceof Error) msg = err.message;
        return { success: false, error: msg };
    }
}

// ── getStudentsAction ───────────────────────────────────────
export async function getStudentsAction(filters?: {
    course?: string;
    academicSession?: string;
    search?: string;
}) {
    try {
        const { supabase } = await verifyAdmin();

        let query = supabase
            .from("students")
            .select(`*, fee_payments(paid_amount, total_fees, remaining_amount)`)
            .order("created_at", { ascending: false });

        if (filters?.course) query = query.eq("course", filters.course);
        if (filters?.academicSession)
            query = query.eq("academic_session", filters.academicSession);

        const { data, error } = await query;
        if (error) return { success: false, error: error.message, data: [] };

        let result = data || [];

        // Client-side search filter
        if (filters?.search) {
            const s = filters.search.toLowerCase();
            result = result.filter(
                (st: { first_name: string; last_name: string; student_id: string; mobile: string }) =>
                    st.first_name.toLowerCase().includes(s) ||
                    st.last_name.toLowerCase().includes(s) ||
                    st.student_id.toLowerCase().includes(s) ||
                    st.mobile.includes(s)
            );
        }

        return { success: true, data: result };
    } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : "Unexpected error", data: [] };
    }
}

// ── getStudentByIdAction ────────────────────────────────────
export async function getStudentByIdAction(id: string) {
    try {
        const { supabase } = await verifyAdmin();

        const { data, error } = await supabase
            .from("students")
            .select(`*, fee_payments(*)`)
            .eq("id", id)
            .single();

        if (error || !data) return { success: false, error: "Student not found." };
        return { success: true, data };
    } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : "Unexpected error" };
    }
}

// ── updateStudentAction ─────────────────────────────────────
export async function updateStudentAction(
    id: string,
    data: StudentFormValues,
    photoBase64?: string
) {
    try {
        const { supabase } = await verifyAdmin();

        // Upload photo if provided
        let photoUrl: string | undefined = undefined;
        if (photoBase64 && photoBase64.startsWith("data:image")) {
            const base64Data = photoBase64.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, "base64");
            const ext = photoBase64.split(";")[0].split("/")[1] || "jpg";
            const filePath = `photos/${id}_${Date.now()}.${ext}`;

            const { error: uploadError } = await supabase.storage
                .from("students")
                .upload(filePath, buffer, { contentType: `image/${ext}`, upsert: true });

            if (!uploadError) {
                const { data: urlData } = supabase.storage
                    .from("students")
                    .getPublicUrl(filePath);
                photoUrl = urlData.publicUrl;
            }
        }

        const updateData: any = {
            first_name: data.firstName,
            last_name: data.lastName,
            date_of_birth: data.dateOfBirth.toISOString().split("T")[0],
            father_name: data.fatherName,
            mobile: data.mobile,
            course: data.course,
            academic_session: data.academicSession,
            student_class: data.studentClass,
            total_course_fee: data.totalCourseFee,
            admission_fee: data.admissionFee,
            monthly_fee_amount: data.monthlyFeeAmount,
            payment_start_date: data.paymentStartDate.toISOString().split("T")[0],
            payment_mode: data.paymentMode,
            branch_id: data.branchId,
            class_id: data.classId,
        };

        if (photoUrl) updateData.photo_url = photoUrl;

        const { error: updateError } = await supabase
            .from("students")
            .update(updateData)
            .eq("id", id);

        if (updateError) {
            console.error("Update error:", updateError);
            return { success: false, error: "Failed to update student." };
        }

        revalidatePath("/admin/students");
        revalidatePath(`/admin/students/${id}`);
        return { success: true };
    } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : "Unexpected error" };
    }
}

// ── deleteStudentAction ─────────────────────────────────────
export async function deleteStudentAction(id: string) {
    try {
        const { supabase } = await verifyAdmin();

        const { error: deleteError } = await supabase
            .from("students")
            .delete()
            .eq("id", id);

        if (deleteError) {
            console.error("Delete error:", deleteError);
            return { success: false, error: "Failed to delete student. They might have linked records (fees, exams)." };
        }

        revalidatePath("/admin/students");
        return { success: true };
    } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : "Unexpected error" };
    }
}

// ── updateStudentPasswordAction ─────────────────────────────
export async function updateStudentPasswordAction(id: string, newPasswordHash: string) {
    try {
        const { supabase } = await verifyAdmin();

        const { error } = await supabase
            .from("students")
            .update({ password_hash: newPasswordHash })
            .eq("id", id);

        if (error) throw error;

        revalidatePath("/admin/students");
        return { success: true };
    } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : "Failed to update password" };
    }
}
