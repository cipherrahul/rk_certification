"use server";

import { createClient } from "@/lib/supabase/server";
import { subjectSchema, SubjectFormValues } from "@/lib/schemas/subject";
import { revalidatePath } from "next/cache";

async function verifyAdmin() {
    const supabase = createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Unauthorized");

    const { data } = await supabase
        .from("admins")
        .select("role")
        .eq("id", user.id)
        .single();
    if (!data) throw new Error("Not an admin");

    return { supabase, user };
}

export async function createSubjectAction(data: SubjectFormValues) {
    try {
        const { supabase } = await verifyAdmin();
        const validated = subjectSchema.parse(data);

        const { error } = await supabase
            .from("subjects")
            .insert({
                name: validated.name,
                course: validated.course,
            });

        if (error) throw error;
        revalidatePath("/admin/academic");
        return { success: true };
    } catch (err: any) {
        console.error("Create subject error:", err);
        return { success: false, error: err.message };
    }
}

export async function getSubjectsByCourseAction(course: string) {
    try {
        const { supabase } = await verifyAdmin();
        const { data, error } = await supabase
            .from("subjects")
            .select("*")
            .eq("course", course)
            .order("name", { ascending: true });

        if (error) throw error;
        return { success: true, data };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function getAllSubjectsAction() {
    try {
        const { supabase } = await verifyAdmin();
        const { data, error } = await supabase
            .from("subjects")
            .select("*")
            .order("course", { ascending: true })
            .order("name", { ascending: true });

        if (error) throw error;
        return { success: true, data };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function deleteSubjectAction(id: string) {
    try {
        const { supabase } = await verifyAdmin();
        const { error } = await supabase
            .from("subjects")
            .delete()
            .eq("id", id);

        if (error) throw error;
        revalidatePath("/admin/academic");
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
