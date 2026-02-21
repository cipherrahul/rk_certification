"use server";

import { createClient } from "@/lib/supabase/server";
import { CertificateFormValues, certificateFormSchema } from "../schemas/certificate";

function generateCourseCode(courseName: string): string {
    // Generate a simple 3-4 letter code based on course name
    const words = courseName.split(' ');
    if (words.length === 1) {
        return words[0].substring(0, 4).toUpperCase();
    }
    return words.map(w => w[0]).join('').substring(0, 4).toUpperCase();
}

export async function createCertificateAction(data: CertificateFormValues, pdfPath: string) {
    const supabase = createClient();

    // 1. Verify Authentication & Role
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: "Unauthorized access. Please login." };
    }

    // Check if admin
    const { data: adminData } = await supabase
        .from('admins')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!adminData) {
        return { success: false, error: "Only admins can create certificates." };
    }

    // 2. Validate Data
    const validationResult = certificateFormSchema.safeParse(data);
    if (!validationResult.success) {
        return { success: false, error: "Invalid form data" };
    }

    const validData = validationResult.data;

    // 3. Generate Unique Certificate ID (e.g. RK2026PROG001)
    const year = new Date().getFullYear().toString();
    const courseCode = generateCourseCode(validData.courseName);

    // Get next val from sequence (Supabase RPC or count)
    // For simplicity since we don't have RPC setup, we'll count existing records
    const { count } = await supabase
        .from('certificates')
        .select('*', { count: 'exact', head: true })
        .like('certificate_id', `RK${year}${courseCode}%`);

    const nextNum = ((count || 0) + 1).toString().padStart(3, '0');
    const certificateId = `RK${year}${courseCode}${nextNum}`;

    // 4. Insert Record
    const { error: insertError } = await supabase
        .from('certificates')
        .insert({
            certificate_id: certificateId,
            first_name: validData.firstName,
            last_name: validData.lastName,
            father_name: validData.fatherName,
            email: validData.email,
            mobile: validData.mobile,
            certificate_type: validData.courseName,
            issue_date: new Date().toISOString(),
            completion_date: validData.completionDate.toISOString(),
            grade: validData.grade,
            duration: validData.duration,
            pdf_url: pdfPath
        });

    if (insertError) {
        console.error("Supabase insert error:", insertError);
        return { success: false, error: "Failed to save certificate in database." };
    }

    return { success: true, certificateId };
}
