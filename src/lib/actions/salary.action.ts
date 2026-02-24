"use server";

import { createClient } from "@/lib/supabase/server";
import { SalaryRecordFormValues } from "@/lib/schemas/salary.schema";
import { revalidatePath } from "next/cache";

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

function generateSlipNumber(count: number): string {
    const year = new Date().getFullYear();
    const seq = (count + 1).toString().padStart(5, "0");
    return `RK-SAL-${year}-${seq}`;
}

// ── createSalaryRecordAction ────────────────────────────────
export async function createSalaryRecordAction(
    teacherId: string,
    data: SalaryRecordFormValues
) {
    try {
        const { supabase } = await verifyAdmin();

        const { count } = await supabase
            .from("salary_records")
            .select("*", { count: "exact", head: true });

        const slipNumber = generateSlipNumber(count || 0);
        const netSalary = Number(data.basicSalary) + Number(data.allowances) - Number(data.deductions);

        const { data: record, error } = await supabase
            .from("salary_records")
            .insert({
                slip_number: slipNumber,
                teacher_id: teacherId,
                month: data.month,
                year: data.year,
                basic_salary: data.basicSalary,
                allowances: data.allowances,
                deductions: data.deductions,
                net_salary: netSalary,
                payment_status: data.paymentStatus,
                payment_date: data.paymentDate
                    ? data.paymentDate.toISOString().split("T")[0]
                    : null,
                slip_notes: data.slipNotes || null,
            })
            .select("id, teachers(name, contact)")
            .single();

        if (error || !record) {
            console.error("Salary record error:", error);
            return { success: false, error: "Failed to create salary record." };
        }

        // ── WhatsApp & PDF Automation ────────────────────────
        // Triggered asynchronously
        (async () => {
            try {
                const { generateSalarySlipPDF } = await import("@/lib/pdf/salary-slip-pdf");
                const { sendWhatsAppNotification, updateWhatsAppStatus } = await import("@/lib/services/whatsapp");

                // 1. Generate & Upload PDF
                const pdfUrl = await generateSalarySlipPDF(record.id);
                if (pdfUrl) {
                    await updateWhatsAppStatus("salary_records", record.id, {
                        whatsapp_status: "processing",
                        pdf_url: pdfUrl
                    });

                    // 2. Send WhatsApp
                    const teacher = record.teachers as any;
                    const message = `Hello ${teacher.name}, your salary slip for ${data.month} ${data.year} has been generated. Please find the attached copy. \n\nRegards, \nRK Institution`;

                    const waResult = await sendWhatsAppNotification({
                        phone: teacher.contact,
                        message,
                        mediaUrl: pdfUrl,
                        fileName: `SalarySlip_${slipNumber}.pdf`
                    });

                    // 3. Update Result
                    await updateWhatsAppStatus("salary_records", record.id, {
                        whatsapp_status: waResult.success ? "sent" : "failed",
                        whatsapp_message_id: waResult.messageId,
                        whatsapp_error: waResult.error
                    });
                }
            } catch (err) {
                console.error("Async salary automation error:", err);
            }
        })();

        revalidatePath(`/admin/teachers/${teacherId}`);
        return { success: true, slipNumber };

        revalidatePath(`/admin/teachers/${teacherId}`);
        return { success: true, slipNumber };
    } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : "Unexpected error." };
    }
}

// ── getSalaryRecordsByTeacherAction ─────────────────────────
export async function getSalaryRecordsByTeacherAction(teacherId: string) {
    try {
        const { supabase } = await verifyAdmin();

        const { data, error } = await supabase
            .from("salary_records")
            .select("*")
            .eq("teacher_id", teacherId)
            .order("year", { ascending: false })
            .order("month", { ascending: false });

        if (error) return { success: false, error: error.message, data: [] };
        return { success: true, data: data || [] };
    } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : "Unexpected error", data: [] };
    }
}

// ── updateSalaryPaymentStatus ───────────────────────────────
export async function updateSalaryPaymentStatus(
    recordId: string,
    teacherId: string,
    status: "Pending" | "Paid",
    paymentDate?: Date
) {
    try {
        const { supabase } = await verifyAdmin();

        const { error } = await supabase
            .from("salary_records")
            .update({
                payment_status: status,
                payment_date: paymentDate
                    ? paymentDate.toISOString().split("T")[0]
                    : null,
            })
            .eq("id", recordId);

        if (error) return { success: false, error: "Failed to update payment status." };

        revalidatePath(`/admin/teachers/${teacherId}`);
        return { success: true };
    } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : "Unexpected error" };
    }
}

// ── deleteSalaryRecordAction ────────────────────────────────
export async function deleteSalaryRecordAction(recordId: string, teacherId: string) {
    try {
        const { supabase } = await verifyAdmin();

        const { error } = await supabase
            .from("salary_records")
            .delete()
            .eq("id", recordId);

        if (error) return { success: false, error: "Failed to delete record." };

        revalidatePath(`/admin/teachers/${teacherId}`);
        return { success: true };
    } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : "Unexpected error" };
    }
}
