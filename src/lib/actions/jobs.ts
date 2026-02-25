"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type JobStatus = "Draft" | "Published";

export interface JobInput {
    title: string;
    department: string;
    location: string;
    employment_type: string;
    experience_required: string;
    salary_range: string;
    description: string;
    requirements: string;
    status: JobStatus;
}

export async function createJob(data: JobInput) {
    const supabase = createClient();
    const { error } = await supabase.from("jobs").insert([data]);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/jobs");
    revalidatePath("/careers");
    return { success: true };
}

export async function updateJob(id: string, data: Partial<JobInput>) {
    const supabase = createClient();
    const { error } = await supabase
        .from("jobs")
        .update(data)
        .eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/jobs");
    revalidatePath(`/admin/jobs/${id}`);
    revalidatePath("/careers");
    revalidatePath(`/careers/${id}`);
    return { success: true };
}

export async function deleteJob(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("jobs").delete().eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/jobs");
    revalidatePath("/careers");
    return { success: true };
}

export async function toggleJobStatus(id: string, currentStatus: JobStatus) {
    const newStatus: JobStatus = currentStatus === "Draft" ? "Published" : "Draft";
    return updateJob(id, { status: newStatus });
}

export async function getJobs(publishedOnly = false) {
    const supabase = createClient();
    let query = supabase.from("jobs").select("*").order("created_at", { ascending: false });

    if (publishedOnly) {
        query = query.eq("status", "Published");
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    return data;
}

export async function getJobById(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase.from("jobs").select("*").eq("id", id).single();

    if (error) throw new Error(error.message);
    return data;
}
