"use server";

import { createClient } from "@/lib/supabase/server";
import { courseSchema, CourseFormValues } from "@/lib/schemas/course";
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

export async function createCourseAction(data: CourseFormValues) {
    try {
        const { supabase } = await verifyAdmin();
        const validated = courseSchema.parse(data);

        const { error } = await supabase
            .from("courses")
            .insert({
                name: validated.name,
                code: validated.code || null,
            });

        if (error) throw error;
        revalidatePath("/admin/academic");
        return { success: true };
    } catch (err: any) {
        console.error("Create course error:", err);
        return { success: false, error: err.message };
    }
}

export async function getAllCoursesAction() {
    try {
        const { supabase } = await verifyAdmin();
        const { data, error } = await supabase
            .from("courses")
            .select("*")
            .order("name", { ascending: true });

        if (error) throw error;
        return { success: true, data };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function deleteCourseAction(id: string) {
    try {
        const { supabase } = await verifyAdmin();
        const { error } = await supabase
            .from("courses")
            .delete()
            .eq("id", id);

        if (error) throw error;
        revalidatePath("/admin/academic");
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
