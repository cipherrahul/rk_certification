"use server";

import { createClient } from "@/lib/supabase/server";

export async function getStudentResultsPublicAction(studentId: string) {
    try {
        const supabase = createClient();

        // 1. Find the student by their public Student ID
        const { data: student, error: studentError } = await supabase
            .from("students")
            .select("id, first_name, last_name, student_id, course")
            .eq("student_id", studentId.trim().toUpperCase())
            .single();

        if (studentError || !student) {
            return { success: false, error: "Invalid Student ID or student not found." };
        }

        // 2. Fetch all exam marks for this student
        const { data: results, error: resultsError } = await supabase
            .from("exam_marks")
            .select("*, exams(*, branches(*))")
            .eq("student_id", student.id)
            .order("created_at", { ascending: false });

        if (resultsError) throw resultsError;

        return {
            success: true,
            data: {
                student,
                results: results || []
            }
        };
    } catch (err: any) {
        console.error("Public result search error:", err);
        return { success: false, error: "An unexpected error occurred during search." };
    }
}
