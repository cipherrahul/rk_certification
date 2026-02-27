"use server";

import { createClient } from "@/lib/supabase/server";
import { FeePaymentFormValues } from "@/lib/schemas/fee";
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

function generateReceiptNumber(count: number): string {
    const year = new Date().getFullYear();
    const seq = (count + 1).toString().padStart(5, "0");
    return `RK-FEE-${year}-${seq}`;
}

// ── createFeePaymentAction ──────────────────────────────────
export async function createFeePaymentAction(
    studentId: string,
    data: FeePaymentFormValues
) {
    try {
        const { supabase } = await verifyAdmin();

        // Get total existing receipts for sequencing
        const { count } = await supabase
            .from("fee_payments")
            .select("*", { count: "exact", head: true });

        const receiptNumber = generateReceiptNumber(count || 0);
        const remainingAmount = Number(data.totalFees) - Number(data.paidAmount);

        const { data: record, error } = await supabase
            .from("fee_payments")
            .insert({
                receipt_number: receiptNumber,
                student_id: studentId,
                month: data.month,
                total_fees: data.totalFees,
                paid_amount: data.paidAmount,
                remaining_amount: remainingAmount,
                payment_date: data.paymentDate.toISOString().split("T")[0],
                payment_mode: data.paymentMode,
                notes: data.notes || null,
            })
            .select("id, students(first_name, last_name, mobile)")
            .single();

        if (error || !record) {
            console.error("Fee payment error:", error);
            return { success: false, error: "Failed to record payment." };
        }

        // ── WhatsApp & PDF Automation ────────────────────────
        // Triggered asynchronously to not block the response
        (async () => {
            try {
                const { generateFeeReceiptPDF } = await import("@/lib/pdf/receipt-pdf");
                const { sendWhatsAppNotification, updateWhatsAppStatus } = await import("@/lib/services/whatsapp");

                // 1. Generate & Upload PDF
                const pdfUrl = await generateFeeReceiptPDF(record.id);
                if (pdfUrl) {
                    await updateWhatsAppStatus("fee_payments", record.id, {
                        whatsapp_status: "processing",
                        pdf_url: pdfUrl
                    });

                    // 2. Send WhatsApp
                    const student = record.students as any;
                    const message = `Hello ${student.first_name} ${student.last_name}, your fee payment of ${data.paidAmount} for ${data.month} has been received. Please find your receipt attached. \n\nThank you, \nRK Institution`;

                    const waResult = await sendWhatsAppNotification({
                        phone: student.mobile,
                        message,
                        mediaUrl: pdfUrl,
                        fileName: `Receipt_${receiptNumber}.pdf`
                    });

                    // 3. Update Result
                    await updateWhatsAppStatus("fee_payments", record.id, {
                        whatsapp_status: waResult.success ? "sent" : "failed",
                        whatsapp_message_id: waResult.messageId,
                        whatsapp_error: waResult.error
                    });
                }
            } catch (err) {
                console.error("Async fee automation error:", err);
            }
        })();

        revalidatePath(`/admin/students/${studentId}`);
        return { success: true, receiptNumber };

        revalidatePath(`/admin/students/${studentId}`);
        return { success: true, receiptNumber };
    } catch (err: any) {
        return { success: false, error: err.message || "Unexpected error." };
    }
}

// ── getFeePaymentsByStudentAction ───────────────────────────
export async function getFeePaymentsByStudentAction(studentId: string) {
    try {
        const { supabase } = await verifyAdmin();

        const { data, error } = await supabase
            .from("fee_payments")
            .select("*")
            .eq("student_id", studentId)
            .order("payment_date", { ascending: false });

        if (error) return { success: false, error: error.message, data: [] };
        return { success: true, data: data || [] };
    } catch (err: any) {
        return { success: false, error: err.message, data: [] };
    }
}

// ── getPaymentByReceiptNumberAction (PUBLIC) ────────────────
export async function getPaymentByReceiptNumberAction(receiptNo: string) {
    try {
        // Use browser client for public query — no admin check needed
        const { createClient: createServerClient } = await import(
            "@/lib/supabase/server"
        );
        const supabase = createServerClient();

        const { data, error } = await supabase
            .from("fee_payments")
            .select(`*, students(first_name, last_name, course, student_id, academic_session, branches(*))`)
            .eq("receipt_number", receiptNo.trim().toUpperCase())
            .single();

        if (error || !data) return { success: false, error: "Receipt not found." };
        return { success: true, data };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
