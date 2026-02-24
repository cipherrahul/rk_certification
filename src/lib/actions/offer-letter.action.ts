"use server";

import { createClient } from "@/lib/supabase/server";
import { offerLetterSchema, type OfferLetterFormValues } from "@/lib/schemas/offer-letter.schema";
import { generateOfferLetterPDF } from "@/lib/pdf/offer-letter-pdf";

export async function createOfferLetterAction(data: OfferLetterFormValues) {
    // 1. Server-side validation
    const parsed = offerLetterSchema.safeParse(data);
    if (!parsed.success) {
        const msgs = parsed.error.issues.map((i) => i.message).join(", ");
        return { success: false, error: `Validation failed: ${msgs}` };
    }

    const supabase = createClient();
    const grossSalary = parsed.data.basicSalary + parsed.data.hra + parsed.data.ta + parsed.data.otherAllowance;

    // 2. Insert record first to get an ID
    const { data: record, error: insertError } = await supabase
        .from("offer_letters")
        .insert({
            full_name: parsed.data.fullName,
            father_name: parsed.data.fatherName,
            address: parsed.data.address,
            employee_email: parsed.data.employeeEmail,
            position: parsed.data.position,
            department: parsed.data.department,
            work_location: parsed.data.workLocation,
            employment_type: parsed.data.employmentType,
            joining_date: parsed.data.joiningDate,
            probation_period: parsed.data.probationPeriod,
            working_hours: parsed.data.workingHours,
            basic_salary: parsed.data.basicSalary,
            hra: parsed.data.hra,
            ta: parsed.data.ta,
            other_allowance: parsed.data.otherAllowance,
            gross_salary: grossSalary,
            status: "generating",
        })
        .select("id")
        .single();

    if (insertError || !record) {
        console.error("Insert error:", insertError);
        return { success: false, error: "Failed to save offer letter. Please try again." };
    }

    // 3. Generate PDF
    const pdfUrl = await generateOfferLetterPDF(parsed.data, record.id);

    if (!pdfUrl) {
        // Clean up the record if PDF generation failed
        await supabase.from("offer_letters").delete().eq("id", record.id);
        return { success: false, error: "PDF generation failed. Please try again." };
    }

    // 4. Update record with pdf_url and status
    await supabase
        .from("offer_letters")
        .update({ pdf_url: pdfUrl, status: "generated" })
        .eq("id", record.id);

    return { success: true, pdfUrl, id: record.id };
}

export async function getOfferLettersAction() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("offer_letters")
        .select("id, full_name, position, department, employment_type, joining_date, gross_salary, pdf_url, status, created_at")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Fetch error:", error);
        return [];
    }
    return data ?? [];
}
