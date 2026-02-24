"use server";

import { createClient } from "@/lib/supabase/server";

interface WhatsAppPayload {
    phone: string;
    message: string;
    mediaUrl?: string;
    fileName?: string;
}

/**
 * WhatsApp Service for sending notifications.
 * This implementation uses a generic structure that can be easily connected to
 * Meta Cloud API or a third-party gateway like Interakt / Twilio.
 */
export async function sendWhatsAppNotification({
    phone,
    message,
    mediaUrl,
    fileName
}: WhatsAppPayload) {
    // 1. Clean phone number (remove +, spaces, ensure country code)
    const cleanPhone = phone.replace(/\D/g, "");
    const finalPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;

    console.log(`[WhatsApp] Sending message to ${finalPhone}...`);

    try {
        // NOTE: In a real production environment, you would call your API here:
        /*
        const response = await fetch("https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to: finalPhone,
                type: mediaUrl ? "document" : "text",
                document: mediaUrl ? {
                    link: mediaUrl,
                    filename: fileName || "Document.pdf"
                } : undefined,
                text: !mediaUrl ? { body: message } : undefined,
            }),
        });
        */

        // For now, we will simulate a successful API call.
        // In a real project, replace this with the actual API logic.

        const success = true; // Simulation
        const messageId = `wa_msg_${Math.random().toString(36).substr(2, 9)}`;

        return {
            success,
            messageId,
            error: null
        };
    } catch (err: any) {
        console.error("WhatsApp API Error:", err);
        return {
            success: false,
            messageId: null,
            error: err.message || "Failed to send WhatsApp message"
        };
    }
}

/**
 * Update the WhatsApp status in the database
 */
export async function updateWhatsAppStatus(
    table: "fee_payments" | "salary_records",
    id: string,
    status: {
        whatsapp_status: string;
        whatsapp_message_id?: string | null;
        whatsapp_error?: string | null;
        pdf_url?: string;
    }
) {
    const supabase = createClient();
    const { error } = await supabase
        .from(table)
        .update(status)
        .eq("id", id);

    if (error) {
        console.error(`Error updating whatsapp status for ${table}:`, error);
    }
}
