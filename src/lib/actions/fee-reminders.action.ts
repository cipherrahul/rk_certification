"use server";

import { createClient } from "@/lib/supabase/server";
import { sendWhatsAppNotification } from "@/lib/services/whatsapp";
import { revalidatePath } from "next/cache";

async function verifyAdmin() {
    const supabase = createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Unauthorized");

    const { data: admin } = await supabase
        .from("admins")
        .select("role")
        .eq("id", user.id)
        .single();
    if (!admin) throw new Error("Not an admin");

    return { supabase, user };
}

export async function getOutstandingFeesAction(month: string) {
    try {
        const { supabase } = await verifyAdmin();

        // 1. Fetch all active students
        const { data: students, error: studentError } = await supabase
            .from("students")
            .select("id, first_name, last_name, mobile, monthly_fee_amount, course, branch_id, branches(name)");

        if (studentError) throw studentError;

        // 2. Fetch fee payments for this specific month
        const { data: payments, error: paymentError } = await supabase
            .from("fee_payments")
            .select("student_id, paid_amount, remaining_amount, month")
            .eq("month", month);

        if (paymentError) throw paymentError;

        // 3. Fetch recent reminders to avoid duplicates
        const { data: reminders, error: reminderError } = await supabase
            .from("fee_reminders")
            .select("student_id, month, last_sent_at, whatsapp_status")
            .eq("month", month);

        if (reminderError) throw reminderError;

        // 4. Cross-reference
        const results = students.map(student => {
            const studentPayments = (payments || []).filter(p => p.student_id === student.id);
            const totalPaid = studentPayments.reduce((acc, p) => acc + Number(p.paid_amount), 0);
            const expectedFee = Number(student.monthly_fee_amount) || 0;
            const balance = expectedFee - totalPaid;

            const lastReminder = (reminders || []).find(r => r.student_id === student.id);

            return {
                ...student,
                totalPaid,
                balance: balance > 0 ? balance : 0,
                isOverdue: balance > 0,
                lastReminderAt: lastReminder?.last_sent_at || null,
                reminderStatus: lastReminder?.whatsapp_status || null
            };
        }).filter(s => s.isOverdue);

        return { success: true, data: results };
    } catch (err: any) {
        console.error("Error fetching outstanding fees:", err);
        return { success: false, error: err.message, data: [] };
    }
}

export async function sendFeeReminderAction(student: {
    id: string;
    first_name: string;
    last_name: string;
    mobile: string;
    balance: number;
    month: string;
}) {
    try {
        const { supabase } = await verifyAdmin();

        const message = `Dear Parent,\n\nThis is a friendly reminder from RK Institution. The fee for ${student.first_name} ${student.last_name} for the month of ${student.month} is pending.\n\nAmount Due: ₹${student.balance.toLocaleString()}\n\nPlease clear the balance at your earliest convenience to avoid interruptions.\n\nThank you,\nRK Institution`;

        const result = await sendWhatsAppNotification({
            phone: student.mobile,
            message: message
        });

        // Track the reminder in history
        const { error: historyError } = await supabase
            .from("fee_reminders")
            .upsert({
                student_id: student.id,
                month: student.month,
                amount_due: student.balance,
                whatsapp_status: result.success ? "sent" : "failed",
                whatsapp_message_id: result.messageId,
                whatsapp_error: result.error,
                last_sent_at: new Date().toISOString()
            }, { onConflict: "student_id,month" });

        if (historyError) console.error("History Tracking Error:", historyError);

        return { success: true, messageId: result.messageId };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export type BatchReminderResponse =
    | { success: true; summary: { successCount: number; failCount: number } }
    | { success: false; error: string };

export async function sendBatchRemindersAction(students: any[], month: string): Promise<BatchReminderResponse> {
    try {
        let successCount = 0;
        let failCount = 0;

        for (const student of students) {
            const res = await sendFeeReminderAction({ ...student, month });
            if (res.success) successCount++;
            else failCount++;
        }

        revalidatePath("/admin/fees/reminders");
        return { success: true, summary: { successCount, failCount } };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
