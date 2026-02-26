"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendWhatsAppNotification } from "@/lib/services/whatsapp";

export async function submitApplicationAction(
    formData: {
        fullName: string;
        email: string;
        phone: string;
        jobId: string;
        jobTitle: string;
        currentLocation: string;
        highestQualification: string;
        experienceYears: string;
        coverLetter: string;
    },
    resumeBase64: string,
    resumeFileName: string
) {
    const supabase = createClient();

    // 1. Upload resume to Supabase Storage
    const resumeBuffer = Buffer.from(resumeBase64, "base64");

    // Check file size (50KB limit = 51200 bytes)
    if (resumeBuffer.byteLength > 51200) {
        return { success: false, error: "Resume file size exceeds 50KB limit." };
    }

    const fileExt = resumeFileName.split(".").pop();
    const uniqueFileName = `${formData.jobId}/${Date.now()}_${formData.fullName.replace(/\s+/g, "_")}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(uniqueFileName, resumeBuffer, {
            contentType: fileExt === "pdf" ? "application/pdf" : "application/msword",
            upsert: false,
        });

    if (uploadError) {
        console.error("Resume upload error:", uploadError);
        return { success: false, error: "Failed to upload resume. Please try again." };
    }

    // 2. Insert application record into database
    const { error: insertError } = await supabase
        .from("job_applications")
        .insert({
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            job_id: formData.jobId,
            job_title: formData.jobTitle,
            current_location: formData.currentLocation,
            highest_qualification: formData.highestQualification,
            experience_years: formData.experienceYears,
            cover_letter: formData.coverLetter,
            resume_url: uploadData.path,
            applied_at: new Date().toISOString(),
            status: "pending",
        });

    if (insertError) {
        console.error("Application insert error:", insertError);
        return { success: false, error: "Failed to save your application. Please try again." };
    }

    return { success: true };
}

export async function getJobApplicationsAction() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("job_applications")
        .select("*")
        .order("applied_at", { ascending: false });

    if (error) {
        console.error("Error fetching applications:", error);
        return [];
    }
    return data;
}

export async function updateApplicationStatusAction(
    id: string,
    status: string,
    message?: string
) {
    const supabase = createClient();

    // 1. Update status
    const { data: application, error: updateError } = await supabase
        .from("job_applications")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

    if (updateError) {
        console.error("Error updating application status:", updateError);
        return { success: false, error: updateError.message };
    }

    // 2. Send WhatsApp notification if requested
    if (message && application.phone) {
        await sendWhatsAppNotification({
            phone: application.phone,
            message: message
        });
    }

    revalidatePath("/admin/jobs/applications");
    return { success: true };
}

export async function deleteApplicationAction(id: string, resumeUrl: string) {
    const supabase = createClient();

    // 1. Delete resume from storage
    if (resumeUrl) {
        const { error: storageError } = await supabase.storage
            .from("resumes")
            .remove([resumeUrl]);

        if (storageError) {
            console.error("Error deleting resume:", storageError);
            // We continue anyway to try and delete the DB record
        }
    }

    // 2. Delete application record
    const { error: dbError } = await supabase
        .from("job_applications")
        .delete()
        .eq("id", id);

    if (dbError) {
        console.error("Error deleting application:", dbError);
        return { success: false, error: dbError.message };
    }

    revalidatePath("/admin/jobs/applications");
    return { success: true };
}
