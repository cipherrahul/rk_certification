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
    const { data: record, error } = await supabase
        .from("salary_records")
        .select(`*, teachers(*)`)
        .eq("id", recordId)
        .single();

    if (error || !record) {
        console.error("Error fetching salary record for PDF:", error);
        return null;
    }

    const teacher = record.teachers;

    try {
        const pdfDoc = await PDFDocument.create();
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

        const page = pdfDoc.addPage(PageSizes.A4);
        const { width, height } = page.getSize();

        // Header Background
        page.drawRectangle({
            x: 40,
            y: height - 120,
            width: width - 80,
            height: 80,
            color: DARK_NAVY
        });

        // RK Logo
        page.drawRectangle({
            x: 60,
            y: height - 100,
            width: 40,
            height: 40,
            color: rgb(0.7, 0.18, 0), // #b32d00
        });
        page.drawText("RK", { x: 68, y: height - 85, size: 16, font: boldFont, color: WHITE });

        page.drawText(INSTITUTE_NAME, { x: 115, y: height - 75, size: 18, font: boldFont, color: WHITE });
        page.drawText(`${INSTITUTE_ADDRESS} | ${WEBSITE}`, { x: 115, y: height - 90, size: 8, font: regularFont, color: rgb(0.7, 0.7, 0.7) });

        page.drawText("SALARY SLIP", { x: width - 160, y: height - 75, size: 14, font: boldFont, color: rgb(0.94, 0.75, 0.44) });
        page.drawText(record.slip_number, { x: width - 160, y: height - 90, size: 9, font: regularFont, color: rgb(0.8, 0.8, 0.8) });

        // Pay Period
        page.drawText(`Pay Period: ${record.month} ${record.year}`, { x: width - 180, y: height - 110, size: 10, font: boldFont, color: rgb(0.94, 0.75, 0.44) });

        // Employee Details Section
        let y = height - 160;
        page.drawText("EMPLOYEE DETAILS", { x: 60, y, size: 9, font: boldFont, color: GRAY });

        y -= 25;
        const details = [
            { label: "Employee Name", value: teacher.name },
            { label: "Employee ID", value: teacher.teacher_id },
            { label: "Department", value: teacher.department },
            { label: "Assigned Class", value: teacher.assigned_class },
            { label: "Joining Date", value: new Date(teacher.joining_date).toLocaleDateString("en-IN") },
            { label: "Payment Status", value: record.payment_status }
        ];

        let col1Y = y;
        details.forEach((item, idx) => {
            const currentY = col1Y - (Math.floor(idx / 2) * 25);
            const x = idx % 2 === 0 ? 60 : 300;
            page.drawText(item.label, { x, y: currentY, size: 8, font: regularFont, color: GRAY });
            page.drawText(String(item.value), { x, y: currentY - 12, size: 10, font: boldFont, color: DARK_NAVY });
        });

        // Earnings and Deductions Table
        y -= 80;
        page.drawRectangle({ x: 40, y: y - 100, width: width - 80, height: 120, color: LIGHT_GRAY, opacity: 0.5 });

        page.drawText("EARNINGS", { x: 60, y: y - 15, size: 9, font: boldFont, color: GRAY });
        page.drawText("Basic Salary:", { x: 60, y: y - 40, size: 10, font: regularFont, color: DARK_NAVY });
        page.drawText(formatCurrency(record.basic_salary), { x: width - 250, y: y - 40, size: 10, font: boldFont, color: DARK_NAVY });

        page.drawText("Allowances:", { x: 60, y: y - 60, size: 10, font: regularFont, color: DARK_NAVY });
        page.drawText(formatCurrency(record.allowances), { x: width - 250, y: y - 60, size: 10, font: boldFont, color: DARK_NAVY });

        y -= 120;
        page.drawText("DEDUCTIONS", { x: 60, y: y + 15, size: 9, font: boldFont, color: GRAY });
        page.drawText("Total Deductions:", { x: 60, y: y - 10, size: 10, font: regularFont, color: DARK_NAVY });
        page.drawText(formatCurrency(record.deductions), { x: width - 250, y: y - 10, size: 10, font: boldFont, color: rgb(0.75, 0.22, 0.17) });

        // Net Pay Box
        y -= 60;
        page.drawRectangle({ x: 40, y, width: width - 80, height: 50, color: DARK_NAVY });
        page.drawText("NET PAY:", { x: 60, y: y + 20, size: 10, font: boldFont, color: rgb(0.8, 0.8, 0.8) });
        page.drawText(formatCurrency(record.net_salary), { x: 130, y: y + 15, size: 18, font: boldFont, color: rgb(0.94, 0.75, 0.44) });

        // Footer
        page.drawText("Authorized Signatory: RK Institution", { x: width - 250, y: y - 40, size: 9, font: boldFont, color: DARK_NAVY });
        page.drawText("This is a computer generated document.", { x: 60, y: y - 40, size: 8, font: regularFont, color: GRAY });

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
