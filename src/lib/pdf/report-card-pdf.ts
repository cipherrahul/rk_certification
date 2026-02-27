"use server";

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { createClient } from "@/lib/supabase/server";

const DARK = rgb(0.1, 0.12, 0.18);
const WHITE = rgb(1, 1, 1);
const SLATE_500 = rgb(0.4, 0.45, 0.5);

export async function generateReportCardPDF(resultId: string): Promise<string | null> {
    const supabase = createClient();

    const { data: result, error } = await supabase
        .from("exam_marks")
        .select(`*, exams(*, branches(*)), students(*)`)
        .eq("id", resultId)
        .single();

    if (error || !result) {
        console.error("Error fetching result for PDF:", error);
        return null;
    }

    const exam = result.exams;
    const student = result.students;
    const branch = exam.branches;

    try {
        const pdfDoc = await PDFDocument.create();
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

        const page = pdfDoc.addPage([842, 595]); // A4 Landscape
        const { width, height } = page.getSize();

        // 0. Watermark
        const watermarkText = "RK INSTITUTION";
        for (let x = -50; x < width + 100; x += 180) {
            for (let y = -50; y < height + 100; y += 120) {
                page.drawText(watermarkText, {
                    x, y, size: 12, font: boldFont, color: DARK, opacity: 0.04, rotate: { angle: 45, type: 'degrees' as any }
                });
            }
        }

        // 1. Header
        page.drawRectangle({ x: 40, y: 40, width: width - 80, height: height - 80, borderWidth: 2, borderColor: DARK });

        // Brand Box
        page.drawRectangle({ x: 65, y: height - 130, width: 70, height: 70, borderWidth: 2, borderColor: DARK });
        page.drawText("RK", { x: 82, y: height - 100, size: 30, font: boldFont, color: DARK });

        page.drawText("RK INSTITUTION", { x: 150, y: height - 95, size: 28, font: boldFont, color: DARK });
        page.drawText(branch?.address || "A-9 Adarsh Nagar, Delhi 110033", { x: 150, y: height - 115, size: 10, font: regularFont, color: DARK });
        page.drawText(`Tel: ${branch?.contact_number || "+91 7533042633"} | Email: ${branch?.email || "info@rkinstitution.com"}`, { x: 150, y: height - 130, size: 9, font: regularFont, color: DARK });

        page.drawText("ACADEMIC REPORT CARD", { x: width - 300, y: height - 95, size: 18, font: boldFont, color: DARK });
        page.drawText(`Academic Session: ${exam.academic_session}`, { x: width - 300, y: height - 115, size: 12, font: boldFont, color: DARK });

        // Horizontal Line
        page.drawLine({ start: { x: 65, y: height - 150 }, end: { x: width - 65, y: height - 150 }, thickness: 2, color: DARK });

        // 2. Student Info Header
        let InfoY = height - 185;
        const drawHField = (label: string, value: string, x: number) => {
            page.drawText(label.toUpperCase(), { x, y: InfoY, size: 8, font: boldFont, color: SLATE_500 });
            page.drawText(value, { x, y: InfoY - 18, size: 12, font: boldFont, color: DARK });
        };

        drawHField("Full Name", `${student.first_name} ${student.last_name}`, 65);
        drawHField("Enrollment ID", student.student_id, 250);
        drawHField("Program of Study", exam.course, 430);
        drawHField("Examination Unit", exam.title, 650);

        // 3. Performance Breakdown
        let tableY = height - 260;
        // Table Header
        page.drawRectangle({ x: 65, y: tableY - 35, width: width - 130, height: 35, color: DARK });
        const drawTableHeader = (text: string, x: number, align = "left") => {
            page.drawText(text.toUpperCase(), { x, y: tableY - 22, size: 9, font: boldFont, color: WHITE });
        };
        drawTableHeader("Assessment Module / Subject", 80);
        drawTableHeader("Max Marks", 330);
        drawTableHeader("Min Marks", 450);
        drawTableHeader("Obtained", 580);
        drawTableHeader("Result Status", 720);

        // Single Row Logic
        let rowY = tableY - 70;
        page.drawText(exam.title, { x: 80, y: rowY, size: 11, font: boldFont, color: DARK });
        page.drawText(exam.total_marks.toString(), { x: 350, y: rowY, size: 11, font: regularFont, color: DARK });
        page.drawText(exam.passing_marks.toString(), { x: 470, y: rowY, size: 11, font: regularFont, color: DARK });

        const marksObtainedStr = result.is_absent ? "ABS" : Number(result.marks_obtained).toFixed(0);
        page.drawText(marksObtainedStr, { x: 600, y: rowY, size: 14, font: boldFont, color: DARK });

        const isPass = !result.is_absent && Number(result.marks_obtained) >= exam.passing_marks;
        const statusText = result.is_absent ? "ABSENT" : (isPass ? "PASSED" : "FAILED");
        page.drawText(statusText, { x: 740, y: rowY, size: 10, font: boldFont, color: DARK });

        // Bottom Border of table
        page.drawLine({ start: { x: 65, y: tableY - 90 }, end: { x: width - 65, y: tableY - 90 }, thickness: 1.5, color: DARK });

        // 4. Aggregated Performance & Footer
        let footerY = 160;
        // Percentage box
        page.drawRectangle({ x: 65, y: footerY, width: 220, height: 60, color: DARK });
        page.drawText("FINAL PERCENTAGE", { x: 80, y: footerY + 38, size: 8, font: boldFont, color: rgb(0.7, 0.7, 0.7) });
        const percentage = ((result.marks_obtained / exam.total_marks) * 100).toFixed(1);
        page.drawText(`${percentage}%`, { x: 80, y: footerY + 12, size: 24, font: boldFont, color: WHITE });

        // Remarks box
        page.drawText("REMARKS / NOTES:", { x: 300, y: footerY + 50, size: 8, font: boldFont, color: SLATE_500 });
        const remarksText = result.remarks || "Performance verified. Recommended for further advancement.";
        page.drawText(remarksText, { x: 300, y: footerY + 35, size: 10, font: regularFont, color: DARK });

        // Signatory
        page.drawText("Controller of Examinations", { x: width - 210, y: footerY + 10, size: 9, font: boldFont, color: DARK });
        page.drawLine({ start: { x: width - 230, y: footerY + 25 }, end: { x: width - 65, y: footerY + 25 }, thickness: 1, color: DARK });

        // System Footer
        const issueDate = new Date().toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' });
        page.drawText(`Issued on: ${issueDate}`, { x: width - 150, y: 70, size: 7, font: regularFont, color: SLATE_500 });
        page.drawText("Secure Digital Document - Verification available at RK Institution Portal", { x: 65, y: 70, size: 7, font: regularFont, color: SLATE_500 });

        const pdfBytes = await pdfDoc.save();
        const fileName = `RC_${student.student_id}_${Date.now()}.pdf`;
        const filePath = `report-cards/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from("fee-receipts") // Using same bucket to start
            .upload(filePath, pdfBytes, { contentType: "application/pdf", upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from("fee-receipts").getPublicUrl(filePath);
        return publicUrlData.publicUrl;
    } catch (err) {
        console.error("PDF Generate Error:", err);
        return null;
    }
}
