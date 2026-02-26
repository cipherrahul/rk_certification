"use server";

import { createClient } from "@/lib/supabase/server";
import { offerLetterSchema, type OfferLetterFormValues } from "@/lib/schemas/offer-letter.schema";
import { generateOfferLetterPDF } from "@/lib/pdf/offer-letter-pdf";
import { revalidatePath } from "next/cache";

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
    let pdfUrl: string | null = null;
    try {
        pdfUrl = await generateOfferLetterPDF(parsed.data, record.id);
    } catch (err: any) {
        console.error("PDF generation crash:", err);
        await supabase.from("offer_letters").update({ status: "failed" }).eq("id", record.id);
        return { success: false, error: `PDF generation failed: ${err.message}` };
    }

    if (!pdfUrl) {
        await supabase.from("offer_letters").update({ status: "failed" }).eq("id", record.id);
        return { success: false, error: "PDF generation failed. Please try again." };
    }

    // 4. Update record with pdf_url and status
    console.log("PDF generated successfully, updating database record:", record.id);
    const { error: updateError } = await supabase
        .from("offer_letters")
        .update({
            pdf_url: pdfUrl,
            status: "generated",
            updated_at: new Date().toISOString()
        })
        .eq("id", record.id);

    if (updateError) {
        console.error("Final update error:", updateError);
        return { success: false, error: `Failed to update status: ${updateError.message}` };
    }

    console.log("Offer letter generation complete for ID:", record.id);
    revalidatePath("/admin/offer-letter");
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

export async function deleteOfferLetterAction(id: string) {
    const supabase = createClient();

    // 1. Get the record to find the PDF URL if it exists
    const { data: record } = await supabase.from("offer_letters").select("pdf_url").eq("id", id).single();

    // 2. Delete from storage if PDF exists
    if (record?.pdf_url) {
        try {
            const url = new URL(record.pdf_url);
            const pathParts = url.pathname.split("/");
            const path = pathParts.slice(pathParts.indexOf("offer-letters")).join("/");
            await supabase.storage.from("offer-letters").remove([path.replace("offer-letters/", "")]);
        } catch (e) {
            console.error("Failed to delete storage file:", e);
        }
    }

    // 3. Delete from database
    const { error } = await supabase.from("offer_letters").delete().eq("id", id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/offer-letter");
    return { success: true };
}
