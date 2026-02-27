"use server";

import { PDFDocument, rgb, StandardFonts, PageSizes } from "pdf-lib";
import { createClient } from "@/lib/supabase/server";

const INSTITUTE_NAME = "RK INSTITUTION";
const INSTITUTE_ADDRESS = "New Delhi, India";
const WEBSITE = "rkinstitution.com";

// Colors
const DARK_NAVY = rgb(0.1, 0.1, 0.18);
const ORANGE_ACCENT = rgb(0.88, 0.35, 0);
const WHITE = rgb(1, 1, 1);
const GRAY = rgb(0.5, 0.5, 0.5);
const LIGHT_GRAY = rgb(0.97, 0.98, 0.99);

function formatCurrency(amount: number): string {
    return `INR ${Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

export async function generateSalarySlipPDF(recordId: string): Promise<string | null> {
    const supabase = createClient();

    // 1. Fetch record and teacher details
    // 1. Fetch record and teacher details with branch info
    const { data: record, error } = await supabase
        .from("salary_records")
        .select(`*, teachers(*, branches(*))`)
        .eq("id", recordId)
        .single();

    if (error || !record) {
        console.error("Error fetching salary record for PDF:", error);
        return null;
    }

    const teacher = record.teachers;
    const branch = teacher.branches;

    try {
        const pdfDoc = await PDFDocument.create();
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

        const page = pdfDoc.addPage([842, 595]); // A4 Landscape
        const { width, height } = page.getSize();

        // 0. Repeating Background Watermark
        const watermarkText = "RK INSTITUTION";
        const spacingX = 180;
        const spacingY = 120;

        for (let x = -50; x < width + 100; x += spacingX) {
            for (let y = -50; y < height + 100; y += spacingY) {
                page.drawText(watermarkText, {
                    x, y, size: 14, font: boldFont, color: DARK_NAVY, opacity: 0.05,
                    rotate: { angle: 45, type: 'degrees' as any }
                });
            }
        }

        // 1. Outer Border
        page.drawRectangle({
            x: 40, y: 60, width: width - 80, height: height - 120,
            borderWidth: 2, borderColor: DARK_NAVY, color: WHITE
        });

        // 2. Header Section
        page.drawRectangle({ x: 60, y: height - 150, width: 80, height: 80, borderWidth: 2, borderColor: DARK_NAVY });
        page.drawText("RK", { x: 75, y: height - 110, size: 32, font: boldFont, color: DARK_NAVY });

        page.drawText(INSTITUTE_NAME, { x: 160, y: height - 100, size: 28, font: boldFont, color: DARK_NAVY });

        const branchAddress = branch?.address || "A-9 Adarsh Nagar, Delhi 110033";
        const branchContact = branch?.contact_number || "+91 7533042633";
        const branchEmail = branch?.email || "info@rkinstitution.com";

        page.drawText(branchAddress, { x: 160, y: height - 120, size: 10, font: regularFont, color: DARK_NAVY });
        page.drawText(`Tel: ${branchContact} | Email: ${branchEmail}`, { x: 160, y: height - 135, size: 10, font: regularFont, color: DARK_NAVY });

        const title = "SALARY SLIP";
        const titleWidth = boldFont.widthOfTextAtSize(title, 20);
        page.drawText(title, { x: width - 60 - titleWidth, y: height - 100, size: 20, font: boldFont, color: DARK_NAVY });
        page.drawText(`No: ${record.slip_number}`, { x: width - 180, y: height - 125, size: 14, font: boldFont, color: DARK_NAVY });
        page.drawText(`${record.month} ${record.year}`, { x: width - 180, y: height - 145, size: 11, font: boldFont, color: DARK_NAVY });

        page.drawLine({ start: { x: 60, y: height - 170 }, end: { x: width - 60, y: height - 170 }, thickness: 2, color: DARK_NAVY });

        // 3. Main Body
        let leftX = 60;
        let rightX = width / 2 + 20;
        let bodyY = height - 210;

        // Left: Employee Info
        page.drawText("EMPLOYEE INFORMATION", { x: leftX, y: bodyY, size: 12, font: boldFont, color: DARK_NAVY });
        page.drawLine({ start: { x: leftX, y: bodyY - 5 }, end: { x: leftX + 160, y: bodyY - 5 }, thickness: 1, color: DARK_NAVY });

        const drawField = (label: string, value: string, currentY: number) => {
            page.drawText(label, { x: leftX, y: currentY, size: 10, font: boldFont, color: DARK_NAVY });
            page.drawText(value, { x: leftX + 100, y: currentY, size: 10, font: regularFont, color: DARK_NAVY });
            page.drawLine({ start: { x: leftX, y: currentY - 10 }, end: { x: rightX - 60, y: currentY - 10 }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) });
        };

        drawField("Name:", teacher.name, bodyY - 40);
        drawField("Emp ID:", teacher.teacher_id, bodyY - 70);
        drawField("Dept:", teacher.department, bodyY - 100);
        drawField("Subject:", teacher.subject, bodyY - 130);
        drawField("Joining:", new Date(teacher.joining_date).toLocaleDateString("en-IN"), bodyY - 160);

        // Right: Salary Summary
        page.drawText("SALARY SUMMARY", { x: rightX, y: bodyY, size: 12, font: boldFont, color: DARK_NAVY });
        page.drawLine({ start: { x: rightX, y: bodyY - 5 }, end: { x: rightX + 130, y: bodyY - 5 }, thickness: 1, color: DARK_NAVY });

        page.drawRectangle({ x: rightX, y: bodyY - 180, width: width - rightX - 60, height: 160, borderWidth: 1.5, borderColor: DARK_NAVY });

        const drawRow = (label: string, value: string, currentY: number, isTotal = false) => {
            page.drawText(label, { x: rightX + 15, y: currentY, size: 10, font: isTotal ? boldFont : regularFont, color: DARK_NAVY });
            page.drawText(value, { x: width - 180, y: currentY, size: isTotal ? 14 : 10, font: boldFont, color: DARK_NAVY });
        };

        drawRow("Basic Salary:", formatCurrency(record.basic_salary), bodyY - 40);
        drawRow("Allowances:", formatCurrency(record.allowances), bodyY - 70);
        drawRow("Deductions:", `-${formatCurrency(record.deductions)}`, bodyY - 100);

        page.drawLine({ start: { x: rightX + 10, y: bodyY - 125 }, end: { x: width - 70, y: bodyY - 125 }, thickness: 2, color: DARK_NAVY });
        drawRow("NET TAKE HOME:", formatCurrency(record.net_salary), bodyY - 145, true);
        page.drawLine({ start: { x: rightX + 10, y: bodyY - 155 }, end: { x: width - 70, y: bodyY - 155 }, thickness: 2, color: DARK_NAVY });

        // 4. Footer
        const footerY = 100;
        page.drawLine({ start: { x: 60, y: footerY + 20 }, end: { x: width - 60, y: footerY + 20 }, thickness: 2, color: DARK_NAVY });

        page.drawRectangle({ x: 60, y: footerY - 15, width: 180, height: 25, borderWidth: 1.5, borderColor: DARK_NAVY });
        page.drawText("VERIFIED DIGITAL PAY SLIP", { x: 80, y: footerY - 5, size: 8, font: boldFont, color: DARK_NAVY });

        page.drawText("Authorized Signatory — RK Institution", { x: width - 250, y: footerY - 5, size: 9, font: boldFont, color: DARK_NAVY });
        page.drawText("Computer Generated document. Valid without signature.", { x: 60, y: 75, size: 7, font: regularFont, color: GRAY });

        const pdfBytes = await pdfDoc.save();

        const fileName = `${record.slip_number}_${Date.now()}.pdf`;
        const filePath = `salaries/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from("salary-slips")
            .upload(filePath, pdfBytes, {
                contentType: "application/pdf",
                upsert: true
            });

        if (uploadError) return null;

        const { data: publicUrlData } = supabase.storage
            .from("salary-slips")
            .getPublicUrl(filePath);

        return publicUrlData.publicUrl;
    } catch (err) {
        console.error("PDF error:", err);
        return null;
    }
}
