"use server";

import { createClient } from "@/lib/supabase/server";
import { examSchema, bulkMarkEntrySchema, ExamFormValues, MarkEntryValues } from "@/lib/schemas/exam";
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

export async function createExamAction(data: ExamFormValues) {
    try {
        const { supabase } = await verifyAdmin();
        const validated = examSchema.parse(data);

        const { error } = await supabase
            .from("exams")
            .insert({
                title: validated.title,
                exam_date: validated.examDate.toISOString().split("T")[0],
                course: validated.course,
                academic_session: validated.academicSession,
                total_marks: validated.totalMarks,
                passing_marks: validated.passingMarks,
                branch_id: validated.branchId || null,
            });

        if (error) throw error;
        revalidatePath("/admin/academic/exams");
        return { success: true };
    } catch (err: any) {
        console.error("Create exam error:", err);
        return { success: false, error: err.message };
    }
}

export async function getExamsAction(filters?: { branchId?: string; course?: string }) {
    try {
        const { supabase } = await verifyAdmin();
        let query = supabase
            .from("exams")
            .select("*, branches(name)")
            .order("exam_date", { ascending: false });

        if (filters?.branchId) query = query.eq("branch_id", filters.branchId);
        if (filters?.course) query = query.eq("course", filters.course);

        const { data, error } = await query;
        if (error) throw error;
        return { success: true, data };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function recordMarksAction(bulkData: MarkEntryValues[]) {
    try {
        const { supabase } = await verifyAdmin();
        const validated = bulkMarkEntrySchema.parse(bulkData);

        const payload = validated.map(m => ({
            exam_id: m.examId,
            student_id: m.studentId,
            subject_name: m.subjectName,
            marks_obtained: m.marksObtained,
            is_absent: m.isAbsent,
            remarks: m.remarks || null,
        }));

        const { error } = await supabase
            .from("exam_marks")
            .upsert(payload, { onConflict: "exam_id, student_id, subject_name" });

        if (error) throw error;
        return { success: true };
    } catch (err: any) {
        console.error("Record marks error:", err);
        return { success: false, error: err.message };
    }
}

export async function getExamResultsAction(examId: string) {
    try {
        const { supabase } = await verifyAdmin();
        const { data, error } = await supabase
            .from("exam_marks")
            .select("*, students(first_name, last_name, student_id)")
            .eq("exam_id", examId);

        if (error) throw error;
        return { success: true, data };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function getStudentsForExamAction(course: string, branchId?: string) {
    try {
        const { supabase } = await verifyAdmin();
        let query = supabase
            .from("students")
            .select("id, first_name, last_name, student_id, course")
            .eq("course", course);

        if (branchId) query = query.eq("branch_id", branchId);

        const { data, error } = await query;
        if (error) throw error;
        return { success: true, data };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function getExamByIdAction(id: string) {
    try {
        const { supabase } = await verifyAdmin();
        const { data, error } = await supabase
            .from("exams")
            .select("*, branches(*)")
            .eq("id", id)
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function getGradeAnalyticsAction() {
    try {
        const { supabase } = await verifyAdmin();
        const { data, error } = await supabase
            .from("exam_marks")
            .select(`
                marks_obtained,
                is_absent,
                exams (
                    id,
                    title,
                    passing_marks,
                    course
                )
            `);

        if (error) throw error;

        // Group by exam
        const analyticsRaw: Record<string, any> = {};
        (data as any[]).forEach((row) => {
            const exam = row.exams;
            if (!exam) return;
            if (!analyticsRaw[exam.id]) {
                analyticsRaw[exam.id] = {
                    id: exam.id,
                    title: exam.title,
                    course: exam.course,
                    total: 0,
                    passed: 0,
                    failed: 0,
                    absent: 0
                };
            }
            const stats = analyticsRaw[exam.id];
            stats.total++;
            if (row.is_absent) {
                stats.absent++;
            } else if (Number(row.marks_obtained) >= exam.passing_marks) {
                stats.passed++;
            } else {
                stats.failed++;
            }
        });

        return { success: true, data: Object.values(analyticsRaw) };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
export async function deleteMarkAction(examId: string, studentId: string, subjectName: string) {
    try {
        const { supabase } = await verifyAdmin();

        const { error } = await supabase
            .from("exam_marks")
            .delete()
            .match({
                exam_id: examId,
                student_id: studentId,
                subject_name: subjectName
            });

        if (error) throw error;
        return { success: true };
    } catch (err: any) {
        console.error("Delete mark error:", err);
        return { success: false, error: err.message };
    }
}
