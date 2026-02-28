'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function getSupabase() {
    const cookieStore = cookies()
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    )
}

// ------------------------------------------------------------------
// Live Classes
// ------------------------------------------------------------------

export async function getLiveClasses(courseId?: string, branchId?: string) {
    const supabase = await getSupabase()
    let query = supabase.from('live_classes').select('*, branches(name), courses(name), teachers(name)').order('scheduled_at', { ascending: true })
    if (courseId) query = query.eq('course_id', courseId)
    if (branchId) query = query.eq('branch_id', branchId)
    const { data, error } = await query
    if (error) throw error
    return data
}

export async function createLiveClass(data: any) {
    const supabase = await getSupabase()
    const { data: result, error } = await supabase.from('live_classes').insert([data]).select().single()
    if (error) throw error
    return { success: true, data: result }
}

export async function updateLiveClass(id: string, data: any) {
    const supabase = await getSupabase()
    const { data: result, error } = await supabase.from('live_classes').update(data).eq('id', id).select().single()
    if (error) throw error
    return { success: true, data: result }
}

export async function deleteLiveClass(id: string) {
    const supabase = await getSupabase()
    const { error } = await supabase.from('live_classes').delete().eq('id', id)
    if (error) throw error
    return { success: true }
}

// ------------------------------------------------------------------
// Study Materials
// ------------------------------------------------------------------

export async function getStudyMaterials(courseId?: string) {
    const supabase = await getSupabase()
    let query = supabase.from('study_materials').select('*, branches(name), courses(name)').order('created_at', { ascending: false })
    if (courseId) query = query.eq('course_id', courseId)
    const { data, error } = await query
    if (error) throw error
    return data
}

export async function createStudyMaterial(data: any) {
    const supabase = await getSupabase()
    const { data: result, error } = await supabase.from('study_materials').insert([data]).select().single()
    if (error) throw error
    return { success: true, data: result }
}

export async function deleteStudyMaterial(id: string) {
    const supabase = await getSupabase()
    const { error } = await supabase.from('study_materials').delete().eq('id', id)
    if (error) throw error
    return { success: true }
}

// ------------------------------------------------------------------
// Assignments
// ------------------------------------------------------------------

export async function getAssignments(courseId?: string) {
    const supabase = await getSupabase()
    let query = supabase.from('assignments').select('*, branches(name), courses(name)').order('due_date', { ascending: true })
    if (courseId) query = query.eq('course_id', courseId)
    const { data, error } = await query
    if (error) throw error
    return data
}

export async function createAssignment(data: any) {
    const supabase = await getSupabase()
    const { data: result, error } = await supabase.from('assignments').insert([data]).select().single()
    if (error) throw error
    return { success: true, data: result }
}

export async function updateAssignment(id: string, data: any) {
    const supabase = await getSupabase()
    const { data: result, error } = await supabase.from('assignments').update(data).eq('id', id).select().single()
    if (error) throw error
    return { success: true, data: result }
}

export async function deleteAssignment(id: string) {
    const supabase = await getSupabase()
    const { error } = await supabase.from('assignments').delete().eq('id', id)
    if (error) throw error
    return { success: true }
}

// Assignment Submissions
export async function getAssignmentSubmissions(assignmentId: string) {
    const supabase = await getSupabase()
    const { data, error } = await supabase.from('assignment_submissions').select('*, students(first_name, last_name, student_id)').eq('assignment_id', assignmentId)
    if (error) throw error
    return data
}

export async function submitAssignment(assignmentId: string, studentId: string, submissionUrl: string) {
    const supabase = await getSupabase()
    const { data, error } = await supabase.from('assignment_submissions').upsert({
        assignment_id: assignmentId,
        student_id: studentId,
        submission_url: submissionUrl,
        status: 'Pending'
    }, { onConflict: 'assignment_id,student_id' }).select().single()
    if (error) throw error
    return { success: true, data }
}

export async function gradeAssignmentSubmission(submissionId: string, marks: number) {
    const supabase = await getSupabase()
    const { data, error } = await supabase.from('assignment_submissions').update({
        marks_obtained: marks,
        status: 'Graded'
    }).eq('id', submissionId).select().single()
    if (error) throw error
    return { success: true, data }
}

// ------------------------------------------------------------------
// Online Tests
// ------------------------------------------------------------------

export async function getOnlineTests(courseId?: string) {
    const supabase = await getSupabase()
    let query = supabase.from('online_tests').select('*, branches(name), courses(name)').order('start_time', { ascending: true })
    if (courseId) query = query.eq('course_id', courseId)
    const { data, error } = await query
    if (error) throw error
    return data
}

// Basic CRUD for Tests
export async function createOnlineTest(data: any) {
    const supabase = await getSupabase()
    const { data: result, error } = await supabase.from('online_tests').insert([data]).select().single()
    if (error) throw error
    return { success: true, data: result }
}

export async function deleteOnlineTest(id: string) {
    const supabase = await getSupabase()
    const { error } = await supabase.from('online_tests').delete().eq('id', id)
    if (error) throw error
    return { success: true }
}

// Test Questions
export async function getTestQuestions(testId: string) {
    const supabase = await getSupabase()
    const { data, error } = await supabase.from('test_questions').select('*').eq('test_id', testId).order('created_at', { ascending: true })
    if (error) throw error
    return data
}

export async function addTestQuestion(data: any) {
    const supabase = await getSupabase()
    const { data: result, error } = await supabase.from('test_questions').insert([data]).select().single()
    if (error) throw error
    return { success: true, data: result }
}

export async function deleteTestQuestion(id: string) {
    const supabase = await getSupabase()
    const { error } = await supabase.from('test_questions').delete().eq('id', id)
    if (error) throw error
    return { success: true }
}

// Test Submissions / Getting Results
export async function submitOnlineTest(testId: string, studentId: string, answers: any, score: number) {
    const supabase = await getSupabase()
    const { data, error } = await supabase.from('test_submissions').upsert({
        test_id: testId,
        student_id: studentId,
        answers: answers,
        start_time: new Date().toISOString(), // In reality we'd track start separately
        end_time: new Date().toISOString(),
        score: score,
        status: 'Submitted'
    }, { onConflict: 'test_id,student_id' }).select().single()
    if (error) throw error
    return { success: true, data }
}

export async function getTestResults(testId: string) {
    const supabase = await getSupabase()
    const { data, error } = await supabase.from('test_submissions').select('*, students(first_name, last_name, student_id)').eq('test_id', testId)
    if (error) throw error
    return data
}

// ------------------------------------------------------------------
// Student Authentication
// ------------------------------------------------------------------

export async function loginStudent(studentIdStr: string, passwordHash: string) {
    const supabase = await getSupabase()
    // Find student by UID and match password. Ensure your DB has password_hash populated.
    const { data: student, error } = await supabase
        .from('students')
        .select('id, first_name, last_name, course')
        .ilike('student_id', studentIdStr)
        .eq('password_hash', passwordHash)
        .single()

    if (error || !student) {
        return { success: false, error: 'Invalid Student ID or Password' }
    }

    // Set secure cookie for simple session
    const cookieStore = cookies()
    cookieStore.set('student_session_id', student.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    })

    return { success: true, data: student }
}

export async function logoutStudent() {
    cookies().delete('student_session_id')
    return { success: true }
}

export async function getStudentSession() {
    const sessionId = cookies().get('student_session_id')?.value
    if (!sessionId) return { success: false }

    const supabase = await getSupabase()
    const { data: student } = await supabase
        .from('students')
        .select('id, student_id, first_name, last_name, course')
        .eq('id', sessionId)
        .single()

    if (!student) return { success: false }

    // Get course details for the student
    const { data: courseData } = await supabase
        .from('courses')
        .select('id, name')
        .eq('name', student.course)
        .single();

    return {
        success: true,
        data: {
            ...student,
            course_id: courseData?.id
        }
    }
}
