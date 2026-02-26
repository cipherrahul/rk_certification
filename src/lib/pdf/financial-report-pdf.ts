"use server";

import { PDFDocument, rgb, StandardFonts, PageSizes } from "pdf-lib";
import { createClient } from "@/lib/supabase/server";

const INSTITUTE_NAME = "RK INSTITUTION";
const INSTITUTE_ADDRESS = "A-9 Adarsh Nagar, Delhi 110033";
const INSTITUTE_PHONE = "+91 7533042633";

// Colors
const INDIGO = rgb(0.31, 0.36, 0.91);
const DARK = rgb(0.1, 0.12, 0.18);
const GRAY = rgb(0.45, 0.45, 0.45);
const LIGHT_GRAY = rgb(0.96, 0.97, 0.98);
const EMERALD = rgb(0.06, 0.63, 0.45);
const ROSE = rgb(0.88, 0.27, 0.27);
const WHITE = rgb(1, 1, 1);

function formatCurrency(amount: number): string {
    return `INR ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

function formatDate(date: Date = new Date()): string {
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export async function generateFinancialReportPDF(): Promise<string | null> {
    const supabase = createClient();

    try {
        // 1. Fetch Data
        // Income
        const { data: incomeData } = await supabase.from("fee_payments").select("paid_amount, payment_date, students(first_name, last_name)");
        // Expenses
        const { data: expenseData } = await supabase.from("branch_expenses").select("amount, date, type, description");
        // Salaries
        const { data: salaryData } = await supabase.from("salary_records").select("net_salary, month, year, teachers(name)");

        const totalIncome = incomeData?.reduce((sum, item) => sum + Number(item.paid_amount), 0) || 0;
        const totalOpExpenses = expenseData?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
        const totalSalaries = salaryData?.reduce((sum, item) => sum + Number(item.net_salary), 0) || 0;
        const totalExpenses = totalOpExpenses + totalSalaries;
        const netProfit = totalIncome - totalExpenses;

        // 2. Create PDF
        const pdfDoc = await PDFDocument.create();
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

        const page = pdfDoc.addPage(PageSizes.A4);
        const { width, height } = page.getSize();

        // Header
        page.drawRectangle({ x: 0, y: height - 10, width, height: 10, color: INDIGO });

        page.drawText(INSTITUTE_NAME, { x: 50, y: height - 60, size: 24, font: boldFont, color: DARK });
        page.drawText("FINANCIAL PERFORMANCE REPORT", { x: 50, y: height - 85, size: 14, font: boldFont, color: INDIGO });
        page.drawText(`Generated on: ${formatDate()}`, { x: width - 200, y: height - 60, size: 10, font: regularFont, color: GRAY });

        // Summary Cards
        let y = height - 150;
        const cardWidth = (width - 120) / 3;

        // Income Card
        page.drawRectangle({ x: 50, y: y - 60, width: cardWidth, height: 60, color: LIGHT_GRAY });
        page.drawText("TOTAL INCOME", { x: 60, y: y - 20, size: 9, font: boldFont, color: GRAY });
        page.drawText(formatCurrency(totalIncome), { x: 60, y: y - 45, size: 12, font: boldFont, color: EMERALD });

        // Expenses Card
        page.drawRectangle({ x: 50 + cardWidth + 10, y: y - 60, width: cardWidth, height: 60, color: LIGHT_GRAY });
        page.drawText("TOTAL EXPENSES", { x: 60 + cardWidth + 10, y: y - 20, size: 9, font: boldFont, color: GRAY });
        page.drawText(formatCurrency(totalExpenses), { x: 60 + cardWidth + 10, y: y - 45, size: 12, font: boldFont, color: ROSE });

        // Profit Card
        page.drawRectangle({ x: 50 + (cardWidth + 10) * 2, y: y - 60, width: cardWidth, height: 60, color: INDIGO });
        page.drawText("NET PROFIT", { x: 60 + (cardWidth + 10) * 2, y: y - 20, size: 9, font: boldFont, color: WHITE });
        page.drawText(formatCurrency(netProfit), { x: 60 + (cardWidth + 10) * 2, y: y - 45, size: 12, font: boldFont, color: WHITE });

        // Breakdown Section
        y -= 100;
        page.drawText("EXPENSE BREAKDOWN", { x: 50, y, size: 12, font: boldFont, color: DARK });
        y -= 25;

        // Table Header
        page.drawRectangle({ x: 50, y: y - 20, width: width - 100, height: 20, color: DARK });
        page.drawText("Type", { x: 60, y: y - 13, size: 9, font: boldFont, color: WHITE });
        page.drawText("Description", { x: 180, y: y - 13, size: 9, font: boldFont, color: WHITE });
        page.drawText("Date", { x: width - 180, y: y - 13, size: 9, font: boldFont, color: WHITE });
        page.drawText("Amount", { x: width - 100, y: y - 13, size: 9, font: boldFont, color: WHITE });

        y -= 40;
        // Salaries Item
        page.drawText("Salaries", { x: 60, y, size: 9, font: regularFont, color: DARK });
        page.drawText("Consolidated Staff Salaries", { x: 180, y, size: 9, font: regularFont, color: DARK });
        page.drawText("-", { x: width - 180, y, size: 9, font: regularFont, color: DARK });
        page.drawText(formatCurrency(totalSalaries), { x: width - 100, y, size: 9, font: boldFont, color: DARK });
        y -= 20;

        // Operation Expenses items (limited to 10 for space)
        if (expenseData) {
            for (const exp of expenseData.slice(0, 10)) {
                if (y < 100) break; // Simple page overflow protection
                page.drawText(exp.type || "Other", { x: 60, y, size: 9, font: regularFont, color: DARK });
                page.drawText(exp.description?.substring(0, 40) || "-", { x: 180, y, size: 9, font: regularFont, color: DARK });
                page.drawText(exp.date || "-", { x: width - 180, y, size: 9, font: regularFont, color: DARK });
                page.drawText(formatCurrency(Number(exp.amount)), { x: width - 100, y, size: 9, font: regularFont, color: DARK });
                y -= 15;
            }
        }

        // Footer
        page.drawRectangle({ x: 0, y: 0, width, height: 40, color: DARK });
        page.drawText("Confidential Institutional Financial Statement. Digitalized by RK Institution System.", {
            x: 50, y: 15, size: 8, font: regularFont, color: rgb(0.8, 0.8, 0.8)
        });

        // Save & Upload
        const pdfBytes = await pdfDoc.save();
        const fileName = `financial_report_${Date.now()}.pdf`;
        const filePath = `reports/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from("reports") // Ensure this bucket exists or use an existing one
            .upload(filePath, pdfBytes, { contentType: "application/pdf" });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from("reports").getPublicUrl(filePath);
        return publicUrlData.publicUrl;

    } catch (err) {
        console.error("PDF Report error:", err);
        return null;
    }
}
