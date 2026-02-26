"use server";

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { createClient } from "@/lib/supabase/server";
import {
    getMISGrowthStatsAction,
    getAcquisitionTrendAction,
    getConversionStatsAction,
    getRevenueTrendAction
} from "@/lib/actions/mis.action";

export async function generateMISReportPDF() {
    try {
        const [growthRes, acquisitionRes, conversionRes, revenueRes] = await Promise.all([
            getMISGrowthStatsAction(),
            getAcquisitionTrendAction(),
            getConversionStatsAction(),
            getRevenueTrendAction()
        ]);

        if (!growthRes.success || !acquisitionRes.success || !conversionRes.success || !revenueRes.success ||
            !growthRes.data || !acquisitionRes.data || !conversionRes.data || !revenueRes.data) {
            throw new Error("Failed to fetch complete MIS data for report");
        }

        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        let page = pdfDoc.addPage([600, 800]);
        const { width, height } = page.getSize();

        // Header
        page.drawRectangle({
            x: 0,
            y: height - 100,
            width: width,
            height: 100,
            color: rgb(0.388, 0.4, 0.945), // Indigo 500
        });

        page.drawText("RK INSTITUTION - MIS REPORT", {
            x: 50,
            y: height - 50,
            size: 24,
            font: boldFont,
            color: rgb(1, 1, 1),
        });

        page.drawText(`Generated on: ${new Date().toLocaleDateString()}`, {
            x: 50,
            y: height - 75,
            size: 10,
            font: font,
            color: rgb(0.9, 0.9, 0.9),
        });

        // 1. Growth Summary
        let y = height - 150;
        page.drawText("GROWTH SUMMARY (Last 30 Days)", {
            x: 50,
            y: y,
            size: 16,
            font: boldFont,
            color: rgb(0.1, 0.1, 0.1),
        });
        y -= 30;

        const growthData = growthRes.data;
        const metrics = [
            { label: "New Admissions", value: growthData.students.current, growth: growthData.students.growth + "%" },
            { label: "Current Revenue", value: `INR ${growthData.revenue.current.toLocaleString()}`, growth: growthData.revenue.growth + "%" },
            { label: "Conversion Rate", value: `${conversionRes.data.conversionRate}%`, growth: "Target: 25%+" }
        ];

        metrics.forEach((m, i) => {
            page.drawRectangle({
                x: 50 + (i * 180),
                y: y - 60,
                width: 170,
                height: 60,
                color: rgb(0.96, 0.97, 1),
            });
            page.drawText(m.label, { x: 60 + (i * 180), y: y - 15, size: 10, font: font, color: rgb(0.4, 0.4, 0.4) });
            page.drawText(String(m.value), { x: 60 + (i * 180), y: y - 35, size: 14, font: boldFont, color: rgb(0.2, 0.2, 0.2) });
            page.drawText(m.growth, { x: 60 + (i * 180), y: y - 52, size: 9, font: font, color: m.growth.includes("-") ? rgb(0.8, 0.2, 0.2) : rgb(0.1, 0.6, 0.4) });
        });

        y -= 100;

        // 2. Acquisition Trend Table
        page.drawText("STUDENT ACQUISITION TREND", { x: 50, y, size: 14, font: boldFont });
        y -= 25;

        // Table Header
        page.drawRectangle({ x: 50, y: y - 20, width: 500, height: 20, color: rgb(0.9, 0.9, 0.9) });
        page.drawText("Month", { x: 60, y: y - 13, size: 10, font: boldFont });
        page.drawText("Inquiries", { x: 200, y: y - 13, size: 10, font: boldFont });
        page.drawText("Admissions", { x: 350, y: y - 13, size: 10, font: boldFont });
        page.drawText("Revenue (INR)", { x: 480, y: y - 13, size: 10, font: boldFont });

        y -= 20;

        acquisitionRes.data.forEach((item, i) => {
            if (y < 100) {
                page = pdfDoc.addPage([600, 800]);
                y = 750;
            }
            const rowRevenue = (revenueRes.data as any)[i]?.revenue || 0;
            page.drawText(item.month, { x: 60, y: y - 15, size: 10, font });
            page.drawText(String(item.enquiries), { x: 200, y: y - 15, size: 10, font });
            page.drawText(String(item.students), { x: 350, y: y - 15, size: 10, font });
            page.drawText(rowRevenue.toLocaleString(), { x: 480, y: y - 15, size: 10, font });
            y -= 20;
            page.drawLine({ start: { x: 50, y }, end: { x: 550, y }, thickness: 0.5, color: rgb(0.9, 0.9, 0.9) });
        });

        y -= 40;

        // 3. Conversion Insights
        page.drawText("CONVERSION INSIGHTS BY CHANNEL", { x: 50, y, size: 14, font: boldFont });
        y -= 25;

        conversionRes.data.sourceBreakdown.forEach((s: any) => {
            if (y < 100) {
                page = pdfDoc.addPage([600, 800]);
                y = 750;
            }
            page.drawText(`${s.name}: ${s.total} Leads | ${s.converted} Admitted (${s.rate}%)`, { x: 60, y: y - 15, size: 10, font });
            y -= 20;
        });

        // Save and upload
        const pdfBytes = await pdfDoc.save();
        const supabase = createClient();
        const fileName = `MIS_Report_${Date.now()}.pdf`;
        const filePath = `mis/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from("reports")
            .upload(filePath, pdfBytes, { contentType: "application/pdf" });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("reports").getPublicUrl(filePath);
        return urlData.publicUrl;

    } catch (err: any) {
        console.error("PDF Gen Error:", err);
        return null;
    }
}
