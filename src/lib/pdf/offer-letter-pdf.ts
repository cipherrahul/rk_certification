"use server";

import { PDFDocument, rgb, StandardFonts, PageSizes } from "pdf-lib";
import { createClient } from "@/lib/supabase/server";
import type { OfferLetterFormValues } from "@/lib/schemas/offer-letter.schema";

const INSTITUTE_NAME = "RK INSTITUTION";
const INSTITUTE_EMAIL = "info.rkinstitution2016@gmail.com";
const INSTITUTE_ADDRESS = "A-9 Nanda Road, Adarsh Nagar, Delhi - 110033";
const DIRECTOR_NAME = "Manish";

// Colors
const GREEN = rgb(0.047, 0.502, 0.353);   // brand green
const DARK = rgb(0.1, 0.1, 0.1);
const GRAY = rgb(0.45, 0.45, 0.45);
const LIGHT_GRAY = rgb(0.95, 0.95, 0.95);
const WHITE = rgb(1, 1, 1);

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

function formatCurrency(amount: number): string {
    return `INR ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

export async function generateOfferLetterPDF(data: OfferLetterFormValues, offerId: string): Promise<string | null> {
    const grossSalary = data.basicSalary + data.hra + data.ta + data.otherAllowance;
    const issueDate = formatDate(new Date().toISOString());
    const joiningDate = formatDate(data.joiningDate);

    // ─── Create PDF Document ───────────────────────────────────────────────
    const pdfDoc = await PDFDocument.create();
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    // Helper to add a page
    function addPage() {
        const page = pdfDoc.addPage(PageSizes.A4);
        const { width, height } = page.getSize();
        return { page, width, height };
    }

    // Helper to draw a divider line
    function drawDivider(page: ReturnType<typeof pdfDoc.addPage>, y: number, width: number, color = GREEN) {
        page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 1, color });
    }

    // Helper to draw header on each page
    function drawHeader(page: ReturnType<typeof pdfDoc.addPage>, width: number, height: number) {
        // Green top bar
        page.drawRectangle({ x: 0, y: height - 60, width, height: 60, color: GREEN });
        // Institute name
        page.drawText(INSTITUTE_NAME, {
            x: 50, y: height - 38,
            size: 20, font: boldFont, color: WHITE,
        });
        // Tagline
        page.drawText("Empowering Education | Shaping Futures", {
            x: 50, y: height - 52,
            size: 8, font: italicFont, color: rgb(0.8, 0.95, 0.88),
        });
        // Contact info top right
        page.drawText(`${INSTITUTE_EMAIL}  |  ${INSTITUTE_ADDRESS}`, {
            x: width - 380, y: height - 44,
            size: 7, font: regularFont, color: WHITE,
        });
        // Grey sub-bar
        page.drawRectangle({ x: 0, y: height - 75, width, height: 15, color: LIGHT_GRAY });
    }

    // Helper to draw footer on each page
    function drawFooter(page: ReturnType<typeof pdfDoc.addPage>, width: number, pageNum: number, total: number) {
        // Footer bar
        page.drawRectangle({ x: 0, y: 0, width, height: 40, color: LIGHT_GRAY });
        page.drawLine({ start: { x: 0, y: 40 }, end: { x: width, y: 40 }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) });
        page.drawText(`${INSTITUTE_NAME}  –  Confidential Document`, {
            x: 50, y: 15, size: 7, font: italicFont, color: GRAY,
        });
        page.drawText(`Page ${pageNum} of ${total}`, {
            x: width - 100, y: 15, size: 7, font: regularFont, color: GRAY,
        });
    }

    // ─── PAGE 1: Offer Details ─────────────────────────────────────────────
    const p1 = addPage();
    drawHeader(p1.page, p1.width, p1.height);

    let y = p1.height - 100;

    // Offer Letter title
    p1.page.drawText("OFFER LETTER", {
        x: 50, y, size: 18, font: boldFont, color: GREEN,
    });
    y -= 20;
    drawDivider(p1.page, y, p1.width);
    y -= 18;

    // Date and Ref
    p1.page.drawText(`Date: ${issueDate}`, { x: 50, y, size: 9, font: regularFont, color: GRAY });
    p1.page.drawText(`Ref: RKI-OL-${offerId.substring(0, 8).toUpperCase()}`, {
        x: p1.width - 200, y, size: 9, font: regularFont, color: GRAY,
    });
    y -= 25;

    // Salutation
    p1.page.drawText(`Dear ${data.fullName},`, { x: 50, y, size: 11, font: boldFont, color: DARK });
    y -= 20;

    // Opening paragraph
    const opening = `We are pleased to extend this offer of employment to you at ${INSTITUTE_NAME}. After careful evaluation of your qualifications and interview performance, we are confident that you will be a valuable addition to our team. This letter outlines the terms and conditions of your employment.`;
    const openingLines = wrapText(opening, 83);
    for (const line of openingLines) {
        p1.page.drawText(line, { x: 50, y, size: 10, font: regularFont, color: DARK });
        y -= 16;
    }
    y -= 10;

    // ── Employment Details Box ──
    p1.page.drawRectangle({ x: 45, y: y - 170, width: p1.width - 90, height: 185, color: rgb(0.97, 0.99, 0.97), borderColor: GREEN, borderWidth: 0.5 });
    p1.page.drawText("EMPLOYMENT DETAILS", { x: 58, y: y - 5, size: 10, font: boldFont, color: GREEN });
    y -= 22;

    const details: [string, string][] = [
        ["Employee Name", data.fullName],
        ["Father's Name", data.fatherName],
        ["Designation / Position", data.position],
        ["Department", data.department],
        ["Work Location", data.workLocation],
        ["Employment Type", data.employmentType],
        ["Date of Joining", joiningDate],
        ["Probation Period", data.probationPeriod],
        ["Working Hours", data.workingHours],
    ];

    for (const [label, value] of details) {
        p1.page.drawText(`${label}:`, { x: 60, y, size: 9, font: boldFont, color: DARK });
        p1.page.drawText(value, { x: 230, y, size: 9, font: regularFont, color: DARK });
        y -= 17;
    }
    y -= 15;

    // Conditional paragraph
    p1.page.drawText("This offer is conditional upon:", { x: 50, y, size: 10, font: boldFont, color: DARK });
    y -= 16;
    const conditions = [
        "1. Submission of all original educational and identity documents.",
        "2. Satisfactory background verification.",
        "3. Signing of the Employment Agreement on or before your joining date.",
    ];
    for (const c of conditions) {
        p1.page.drawText(c, { x: 60, y, size: 10, font: regularFont, color: DARK });
        y -= 14;
    }
    y -= 10;

    // Closing
    p1.page.drawText("We look forward to welcoming you to our team.", { x: 50, y, size: 10, font: italicFont, color: DARK });
    y -= 30;

    // Signature
    p1.page.drawText("Yours sincerely,", { x: 50, y, size: 10, font: regularFont, color: DARK });
    y -= 35;
    p1.page.drawText(DIRECTOR_NAME, { x: 50, y, size: 13, font: boldFont, color: GREEN });
    y -= 14;
    p1.page.drawText("Director", { x: 50, y, size: 9, font: regularFont, color: GRAY });
    y -= 12;
    p1.page.drawText(INSTITUTE_NAME, { x: 50, y, size: 9, font: regularFont, color: GRAY });

    drawFooter(p1.page, p1.width, 1, 3);

    // ─── PAGE 2: Salary Structure ──────────────────────────────────────────
    const p2 = addPage();
    drawHeader(p2.page, p2.width, p2.height);

    let y2 = p2.height - 100;

    p2.page.drawText("SALARY STRUCTURE", { x: 50, y: y2, size: 16, font: boldFont, color: GREEN });
    y2 -= 18;
    drawDivider(p2.page, y2, p2.width);
    y2 -= 20;

    p2.page.drawText(`Employee: ${data.fullName}  |  Designation: ${data.position}  |  Effective From: ${joiningDate}`, {
        x: 50, y: y2, size: 9, font: regularFont, color: GRAY,
    });
    y2 -= 25;

    // Table header
    p2.page.drawRectangle({ x: 50, y: y2 - 5, width: p2.width - 100, height: 22, color: GREEN });
    p2.page.drawText("Salary Component", { x: 60, y: y2 + 4, size: 10, font: boldFont, color: WHITE });
    p2.page.drawText("Monthly (INR)", { x: p2.width - 220, y: y2 + 4, size: 10, font: boldFont, color: WHITE });
    p2.page.drawText("Annual (INR)", { x: p2.width - 120, y: y2 + 4, size: 10, font: boldFont, color: WHITE });
    y2 -= 22;

    const salaryRows: [string, number][] = [
        ["Basic Salary", data.basicSalary],
        ["House Rent Allowance (HRA)", data.hra],
        ["Travel Allowance (TA)", data.ta],
        ["Other Allowances", data.otherAllowance],
    ];

    let rowAlt = false;
    for (const [label, amount] of salaryRows) {
        if (rowAlt) p2.page.drawRectangle({ x: 50, y: y2 - 5, width: p2.width - 100, height: 20, color: LIGHT_GRAY });
        p2.page.drawText(label, { x: 60, y: y2 + 3, size: 10, font: regularFont, color: DARK });
        p2.page.drawText(formatCurrency(amount), { x: p2.width - 220, y: y2 + 3, size: 10, font: regularFont, color: DARK });
        p2.page.drawText(formatCurrency(amount * 12), { x: p2.width - 120, y: y2 + 3, size: 10, font: regularFont, color: DARK });
        y2 -= 22;
        rowAlt = !rowAlt;
    }

    // Gross row
    p2.page.drawRectangle({ x: 50, y: y2 - 5, width: p2.width - 100, height: 22, color: rgb(0.9, 0.98, 0.93) });
    p2.page.drawLine({ start: { x: 50, y: y2 + 17 }, end: { x: p2.width - 50, y: y2 + 17 }, thickness: 1, color: GREEN });
    p2.page.drawText("GROSS SALARY (CTC)", { x: 60, y: y2 + 3, size: 10, font: boldFont, color: GREEN });
    p2.page.drawText(formatCurrency(grossSalary), { x: p2.width - 220, y: y2 + 3, size: 10, font: boldFont, color: GREEN });
    p2.page.drawText(formatCurrency(grossSalary * 12), { x: p2.width - 120, y: y2 + 3, size: 10, font: boldFont, color: GREEN });
    y2 -= 30;

    p2.page.drawText("* Salary in Indian Rupees (INR). Subject to applicable deductions as per law.", {
        x: 50, y: y2, size: 8, font: italicFont, color: GRAY,
    });

    drawFooter(p2.page, p2.width, 2, 3);

    // ─── PAGE 3: Terms & Conditions ────────────────────────────────────────
    const p3 = addPage();
    drawHeader(p3.page, p3.width, p3.height);

    let y3 = p3.height - 100;

    p3.page.drawText("TERMS & CONDITIONS OF EMPLOYMENT", { x: 50, y: y3, size: 14, font: boldFont, color: GREEN });
    y3 -= 15;
    drawDivider(p3.page, y3, p3.width);
    y3 -= 12;

    const sections: [string, string][] = [
        ["1. PROBATION PERIOD",
            `The employee will be on probation for ${data.probationPeriod} from the date of joining (${joiningDate}). During this period, either party may terminate employment with 7 days' written notice. Upon successful completion of the probation, the employment will be confirmed in writing.`],
        ["2. CONFIDENTIALITY",
            "The employee shall maintain strict confidentiality of all Institute information, student data, examination materials, financial records, and proprietary methodologies during and after employment. Any breach shall result in immediate termination and legal action."],
        ["3. TERMINATION CLAUSE",
            "Post confirmation, either party may terminate employment with 30 days' written notice. The Institute reserves the right to terminate without notice in cases of misconduct, negligence, fraud, insubordination, or violation of Institute policies. No notice pay shall be due in such cases."],
        ["4. CODE OF CONDUCT",
            "The employee is expected to uphold the highest standards of professional conduct, dress code, punctuality, and integrity. Consumption of alcohol, tobacco, or any prohibited substance on Institute premises is strictly prohibited. Harassment of any kind towards students, colleagues, or staff will result in immediate dismissal."],
        ["5. JOINING INSTRUCTIONS",
            `You are required to report to ${data.workLocation} on ${joiningDate} at 9:00 AM. Please carry original educational certificates, two recent passport photographs, Aadhaar card, and PAN card. Failure to report on the stipulated date without prior written approval will render this offer null and void.`],
        ["6. INTELLECTUAL PROPERTY",
            "All content, lesson plans, course material, research, or any intellectual work created in the course and scope of employment shall be the exclusive property of RK INSTITUTION. No such material may be reproduced or distributed without express written consent."],
        ["7. GOVERNING LAW",
            "This offer letter and the employment relationship shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Delhi, India."],
    ];

    for (const [title, body] of sections) {
        if (y3 < 80) break; // safety: don't overflow footer
        p3.page.drawText(title, { x: 50, y: y3, size: 9.5, font: boldFont, color: DARK });
        y3 -= 14;
        const lines = wrapText(body, 90);
        for (const line of lines) {
            if (y3 < 80) break;
            p3.page.drawText(line, { x: 55, y: y3, size: 8.5, font: regularFont, color: rgb(0.25, 0.25, 0.25) });
            y3 -= 12;
        }
        y3 -= 8;
    }

    // Acceptance line
    if (y3 > 120) {
        drawDivider(p3.page, y3 - 5, p3.width, GRAY);
        y3 -= 20;
        p3.page.drawText("By joining on the specified date, you confirm acceptance of all terms stated in this letter.", {
            x: 50, y: y3, size: 9, font: italicFont, color: GRAY,
        });
    }

    drawFooter(p3.page, p3.width, 3, 3);

    // ─── Serialize PDF ─────────────────────────────────────────────────────
    const pdfBytes = await pdfDoc.save();

    // ─── Encrypt PDF (RC4 128-bit, no editing/copying) ─────────────────────
    let finalBytes: Uint8Array;
    try {
        const { encryptPDF } = await import("@pdfsmaller/pdf-encrypt-lite");
        finalBytes = await encryptPDF(
            pdfBytes,
            "",       // userPassword: no password to open
            "RKI-OWNER-2026-SECURE" // ownerPassword
        );
    } catch {
        // Fallback: if encryption fails, use plain PDF
        finalBytes = pdfBytes;
    }

    // ─── Upload to Supabase Storage ────────────────────────────────────────
    const supabase = createClient();
    const fileName = `offer-letters/${offerId}_${data.fullName.replace(/\s+/g, "_")}.pdf`;

    const { error: uploadError } = await supabase.storage
        .from("offer-letters")
        .upload(fileName, finalBytes, {
            contentType: "application/pdf",
            upsert: true,
        });

    if (uploadError) {
        console.error("PDF upload error:", uploadError);
        return null;
    }

    const { data: urlData } = supabase.storage.from("offer-letters").getPublicUrl(fileName);
    return urlData.publicUrl;
}

// ─── Text Wrapping Utility ─────────────────────────────────────────────────
function wrapText(text: string, maxChars: number): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let current = "";
    for (const word of words) {
        if ((current + " " + word).trim().length > maxChars) {
            if (current) lines.push(current.trim());
            current = word;
        } else {
            current = current ? current + " " + word : word;
        }
    }
    if (current) lines.push(current.trim());
    return lines;
}
