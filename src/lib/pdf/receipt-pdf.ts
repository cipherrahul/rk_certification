"use server";

import { PDFDocument, rgb, StandardFonts, PageSizes } from "pdf-lib";
import { createClient } from "@/lib/supabase/server";

const INSTITUTE_NAME = "RK INSTITUTION";
const INSTITUTE_ADDRESS = "A-9 Adarsh Nagar, Delhi 110033";
const INSTITUTE_PHONE = "+91 7533042633";

// Colors
const INDIGO = rgb(0.31, 0.36, 0.91); // Indigo-600 approx
const DARK = rgb(0.1, 0.12, 0.18);
const GRAY = rgb(0.45, 0.45, 0.45);
const LIGHT_GRAY = rgb(0.96, 0.97, 0.98);
const EMERALD = rgb(0.06, 0.63, 0.45);
const WHITE = rgb(1, 1, 1);

function formatCurrency(amount: number): string {
    return `INR ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export async function generateFeeReceiptPDF(paymentId: string): Promise<string | null> {
    const supabase = createClient();

    // 1. Fetch payment and student details
    const { data: receipt, error } = await supabase
        .from("fee_payments")
        .select(`*, students(*)`)
        .eq("id", paymentId)
        .single();

    if (error || !receipt) {
        console.error("Error fetching receipt for PDF:", error);
        return null;
    }

    const student = receipt.students;

    try {
        // 2. Create PDF
        const pdfDoc = await PDFDocument.create();
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

        const page = pdfDoc.addPage(PageSizes.A4);
        const { width, height } = page.getSize();

        // Background / Watermark (Simple version)
        page.drawText("RK INSTITUTION", {
            x: width / 2 - 100,
            y: height / 2,
            size: 40,
            font: boldFont,
            color: rgb(0.9, 0.9, 0.9),
            opacity: 0.1,
            rotate: { angle: 45, type: 'degrees' as any }
        });

        // Header Accent
        page.drawRectangle({
            x: 0,
            y: height - 10,
            width,
            height: 10,
            color: INDIGO
        });

        // Logo / Brand
        page.drawRectangle({
            x: 50,
            y: height - 80,
            width: 50,
            height: 50,
            color: INDIGO,
            opacity: 0.9
        });
        page.drawText("RK", {
            x: 60,
            y: height - 65,
            size: 24,
            font: boldFont,
            color: WHITE
        });

        page.drawText(INSTITUTE_NAME, {
            x: 115,
            y: height - 55,
            size: 22,
            font: boldFont,
            color: DARK
        });
        page.drawText(`${INSTITUTE_ADDRESS}  |  ${INSTITUTE_PHONE}`, {
            x: 115,
            y: height - 72,
            size: 10,
            font: regularFont,
            color: GRAY
        });

        // Receipt Label & Number
        const receiptNoText = `RECEIPT: ${receipt.receipt_number}`;
        const receiptNoWidth = boldFont.widthOfTextAtSize(receiptNoText, 14);
        page.drawText(receiptNoText, {
            x: width - 50 - receiptNoWidth,
            y: height - 55,
            size: 14,
            font: boldFont,
            color: INDIGO
        });

        const dateText = `Date: ${formatDate(receipt.payment_date)}`;
        const dateWidth = regularFont.widthOfTextAtSize(dateText, 10);
        page.drawText(dateText, {
            x: width - 50 - dateWidth,
            y: height - 72,
            size: 10,
            font: regularFont,
            color: GRAY
        });

        // Horizontal Line
        page.drawLine({
            start: { x: 50, y: height - 100 },
            end: { x: width - 50, y: height - 100 },
            thickness: 1,
            color: rgb(0.9, 0.9, 0.9)
        });

        // Student Section
        let y = height - 130;
        page.drawText("STUDENT DETAILS", { x: 50, y, size: 10, font: boldFont, color: GRAY });
        y -= 25;

        page.drawText("Name:", { x: 50, y, size: 10, font: regularFont, color: GRAY });
        page.drawText(`${student.first_name} ${student.last_name}`, { x: 120, y, size: 12, font: boldFont, color: DARK });

        y -= 20;
        page.drawText("Student ID:", { x: 50, y, size: 10, font: regularFont, color: GRAY });
        page.drawText(student.student_id, { x: 120, y, size: 11, font: boldFont, color: INDIGO });

        y -= 20;
        page.drawText("Course:", { x: 50, y, size: 10, font: regularFont, color: GRAY });
        page.drawText(student.course, { x: 120, y, size: 11, font: regularFont, color: DARK });

        // Payment Summary Box
        y -= 50;
        page.drawRectangle({
            x: 50,
            y: y - 160,
            width: width - 100,
            height: 180,
            color: LIGHT_GRAY,
            opacity: 0.5
        });

        let boxY = y;
        page.drawText(`PAYMENT SUMMARY - ${receipt.month}`, { x: 70, y: boxY - 20, size: 11, font: boldFont, color: DARK });

        boxY -= 50;
        page.drawText("Total Course Fee:", { x: 70, y: boxY, size: 10, font: regularFont, color: GRAY });
        page.drawText(formatCurrency(receipt.total_fees), { x: width - 180, y: boxY, size: 10, font: boldFont, color: DARK });

        boxY -= 30;
        page.drawText("Paid Amount:", { x: 70, y: boxY, size: 11, font: boldFont, color: DARK });
        page.drawText(formatCurrency(receipt.paid_amount), { x: width - 180, y: boxY, size: 14, font: boldFont, color: EMERALD });

        boxY -= 30;
        page.drawText("Remaining Balance:", { x: 70, y: boxY, size: 10, font: regularFont, color: GRAY });
        const balanceColor = Number(receipt.remaining_amount) > 0 ? rgb(0.8, 0.2, 0.2) : GRAY;
        page.drawText(formatCurrency(receipt.remaining_amount), { x: width - 180, y: boxY, size: 10, font: boldFont, color: balanceColor });

        boxY -= 30;
        page.drawText("Payment Mode:", { x: 70, y: boxY, size: 10, font: regularFont, color: GRAY });
        page.drawText(receipt.payment_mode, { x: width - 180, y: boxY, size: 10, font: regularFont, color: DARK });

        // Notes
        if (receipt.notes) {
            y = boxY - 60;
            page.drawText("Notes:", { x: 50, y, size: 9, font: boldFont, color: GRAY });
            page.drawText(receipt.notes, { x: 90, y, size: 9, font: regularFont, color: DARK });
        }

        // Footer
        page.drawRectangle({
            x: 0,
            y: 0,
            width,
            height: 40,
            color: DARK
        });
        page.drawText("This is a computer generated document. Digitally Verified.", {
            x: 50,
            y: 15,
            size: 8,
            font: regularFont,
            color: rgb(0.8, 0.8, 0.8)
        });

        // 3. Save PDF to bytes
        const pdfBytes = await pdfDoc.save();

        // 4. Upload to Supabase Storage
        const fileName = `${receipt.receipt_number}_${Date.now()}.pdf`;
        const filePath = `receipts/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from("fee-receipts")
            .upload(filePath, pdfBytes, {
                contentType: "application/pdf",
                upsert: true
            });

        if (uploadError) {
            console.error("PDF upload error:", uploadError);
            return null;
        }

        // 5. Return Public URL
        const { data: publicUrlData } = supabase.storage
            .from("fee-receipts")
            .getPublicUrl(filePath);

        return publicUrlData.publicUrl;
    } catch (err) {
        console.error("PDF Generation error:", err);
        return null;
    }
}
