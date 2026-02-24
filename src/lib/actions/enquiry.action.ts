"use server";

import { createClient } from "@/lib/supabase/server";
import { enquiryFormSchema, type EnquiryFormValues } from "@/lib/schemas/enquiry";

export async function submitEnquiryAction(data: EnquiryFormValues) {
    // 1. Server-side validation
    const parsed = enquiryFormSchema.safeParse(data);
    if (!parsed.success) {
        const errorMessages = parsed.error.issues.map((issue) => issue.message).join(", ");
        return { success: false, error: `Validation failed: ${errorMessages}` };
    }

    const supabase = createClient();

    // 2. Insert into Supabase
    const { error } = await supabase.from("enquiries").insert({
        student_name: parsed.data.studentName,
        parent_name: parsed.data.parentName,
        class: parsed.data.class_,
        course_interested: parsed.data.courseInterested,
        mobile_number: parsed.data.mobileNumber,
        email: parsed.data.email,
        message: parsed.data.message,
        status: "new",
    });

    if (error) {
        console.error("Enquiry insert error:", error);
        return {
            success: false,
            error: "Failed to submit your enquiry. Please try again or call us directly.",
        };
    }

    return { success: true };
}
