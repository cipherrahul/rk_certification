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

        const page = pdfDoc.addPage([842, 595]); // A4 Landscape
        const { width, height } = page.getSize();

        // 0. Repeating Background Watermark
        const watermarkText = "RK INSTITUTION";
        const watermarkSize = 14;
        const opacity = 0.05;
        const spacingX = 180;
        const spacingY = 120;

        for (let x = -50; x < width + 100; x += spacingX) {
            for (let y = -50; y < height + 100; y += spacingY) {
                page.drawText(watermarkText, {
                    x,
                    y,
                    size: watermarkSize,
                    font: boldFont,
                    color: DARK,
                    opacity: opacity,
                    rotate: { angle: 45, type: 'degrees' as any }
                });
            }
        }

        // 1. Header Section (Horizontal)
        // Outer Border
        page.drawRectangle({
            x: 40,
            y: 60,
            width: width - 80,
            height: height - 120,
            borderWidth: 2,
            borderColor: DARK,
            color: WHITE
        });

        // Brand Box
        page.drawRectangle({
            x: 60,
            y: height - 150,
            width: 80,
            height: 80,
            borderWidth: 2,
            borderColor: DARK
        });
        page.drawText("RK", {
            x: 75,
            y: height - 110,
            size: 32,
            font: boldFont,
            color: DARK
        });

        // Institution Details
        page.drawText(INSTITUTE_NAME, {
            x: 160,
            y: height - 100,
            size: 28,
            font: boldFont,
            color: DARK
        });
        page.drawText(`${INSTITUTE_ADDRESS}  |  Tel: ${INSTITUTE_PHONE}`, {
            x: 160,
            y: height - 125,
            size: 11,
            font: regularFont,
            color: DARK
        });

        // Receipt Meta (Right Side of Header)
        const receiptTitle = "FEE RECEIPT";
        const titleWidth = boldFont.widthOfTextAtSize(receiptTitle, 20);
        page.drawText(receiptTitle, {
            x: width - 60 - titleWidth,
            y: height - 100,
            size: 20,
            font: boldFont,
            color: DARK
        });

        const receiptNo = `No: ${receipt.receipt_number}`;
        const noWidth = boldFont.widthOfTextAtSize(receiptNo, 14);
        page.drawText(receiptNo, {
            x: width - 60 - noWidth,
            y: height - 125,
            size: 14,
            font: boldFont,
            color: DARK
        });

        const dateText = `Date: ${formatDate(receipt.payment_date)}`;
        const dateWidth = regularFont.widthOfTextAtSize(dateText, 11);
        page.drawText(dateText, {
            x: width - 60 - dateWidth,
            y: height - 145,
            size: 11,
            font: regularFont,
            color: DARK
        });

        // Horizontal Separator
        page.drawLine({
            start: { x: 60, y: height - 170 },
            end: { x: width - 60, y: height - 170 },
            thickness: 2,
            color: DARK
        });

        // 2. Main Body (Two Columns)
        let leftColX = 60;
        let rightColX = width / 2 + 20;
        let bodyY = height - 210;

        // Left Column: Student Details
        page.drawText("STUDENT INFORMATION", { x: leftColX, y: bodyY, size: 12, font: boldFont, color: DARK });
        page.drawLine({ start: { x: leftColX, y: bodyY - 5 }, end: { x: leftColX + 150, y: bodyY - 5 }, thickness: 1, color: DARK });

        let y = bodyY - 40;
        const drawField = (label: string, value: string, currentY: number) => {
            page.drawText(label, { x: leftColX, y: currentY, size: 10, font: boldFont, color: DARK });
            page.drawText(value, { x: leftColX + 100, y: currentY, size: 10, font: regularFont, color: DARK });
            page.drawLine({ start: { x: leftColX, y: currentY - 10 }, end: { x: rightColX - 60, y: currentY - 10 }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) });
        };

        drawField("Name:", `${student.first_name} ${student.last_name}`, y);
        y -= 30;
        drawField("Student ID:", student.student_id, y);
        y -= 30;
        drawField("Course:", student.course, y);
        y -= 30;
        drawField("Session:", student.academic_session || "N/A", y);

        // Right Column: Payment Details
        page.drawText("PAYMENT SUMMARY", { x: rightColX, y: bodyY, size: 12, font: boldFont, color: DARK });
        page.drawLine({ start: { x: rightColX, y: bodyY - 5 }, end: { x: rightColX + 130, y: bodyY - 5 }, thickness: 1, color: DARK });

        page.drawRectangle({
            x: rightColX,
            y: bodyY - 180,
            width: width - rightColX - 60,
            height: 160,
            borderWidth: 1.5,
            borderColor: DARK
        });

        let py = bodyY - 40;
        const drawPayRow = (label: string, value: string, currentY: number, isTotal = false) => {
            page.drawText(label, { x: rightColX + 15, y: currentY, size: 10, font: isTotal ? boldFont : regularFont, color: DARK });
            page.drawText(value, { x: width - 180, y: currentY, size: isTotal ? 14 : 10, font: boldFont, color: DARK });
        };

        drawPayRow("Month/Installment:", receipt.month, py);
        py -= 30;
        drawPayRow("Payment Mode:", receipt.payment_mode, py);
        py -= 30;
        drawPayRow("Full Fee Amount:", formatCurrency(receipt.total_fees), py);
        py -= 40;

        // Impactful Amount Paid Row
        page.drawLine({ start: { x: rightColX + 10, y: py + 25 }, end: { x: width - 70, y: py + 25 }, thickness: 2, color: DARK });
        drawPayRow("AMOUNT RECEIVED:", formatCurrency(receipt.paid_amount), py, true);
        page.drawLine({ start: { x: rightColX + 10, y: py - 10 }, end: { x: width - 70, y: py - 10 }, thickness: 2, color: DARK });

        py -= 30;
        drawPayRow("Balance Outstanding:", formatCurrency(receipt.remaining_amount), py);

        // 3. Remarks
        if (receipt.notes) {
            page.drawText("REMARKS:", { x: 60, y: 125, size: 10, font: boldFont, color: DARK });
            page.drawText(receipt.notes, { x: 130, y: 125, size: 10, font: regularFont, color: DARK });
        }

        // 4. Footer (Spacious with Boxed Badge)
        const footerY = 100;
        page.drawLine({ start: { x: 60, y: footerY + 20 }, end: { x: width - 60, y: footerY + 20 }, thickness: 2, color: DARK });

        // Verified Badge Box
        const badgeWidth = 180;
        const badgeHeight = 25;
        page.drawRectangle({
            x: 60,
            y: footerY - 15,
            width: badgeWidth,
            height: badgeHeight,
            borderWidth: 1.5,
            borderColor: DARK
        });

        // Simple check icon (custom drawn)
        page.drawLine({ start: { x: 68, y: footerY - 2 }, end: { x: 72, y: footerY - 8 }, thickness: 1.5, color: DARK });
        page.drawLine({ start: { x: 72, y: footerY - 8 }, end: { x: 78, y: footerY + 2 }, thickness: 1.5, color: DARK });

        page.drawText("VERIFIED DIGITAL DOCUMENT", {
            x: 85,
            y: footerY - 5,
            size: 8,
            font: boldFont,
            color: DARK
        });

        page.drawText("ISO 9001:2015 Educational Standard Compliant", { x: width - 300, y: footerY + 2, size: 8, font: boldFont, color: DARK });
        page.drawText("Computer Generated Receipt — Valid without signature.", { x: width - 300, y: footerY - 10, size: 8, font: regularFont, color: DARK });

        // 5. Save PDF to bytes
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
