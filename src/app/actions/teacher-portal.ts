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
// Teacher Authentication
// ------------------------------------------------------------------

export async function loginTeacher(teacherIdStr: string, password: string) {
    const supabase = await getSupabase()
    const { data: teacher, error } = await supabase
        .from('teachers')
        .select('id, name, teacher_id, subject, assigned_class, department, photo_url')
        .ilike('teacher_id', teacherIdStr)
        .eq('password_hash', password)
        .single()

    if (error || !teacher) {
        return { success: false, error: 'Invalid Teacher ID or Password' }
    }

    cookies().set('teacher_session_id', teacher.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
    })

    return { success: true, data: teacher }
}

export async function logoutTeacher() {
    cookies().delete('teacher_session_id')
    return { success: true }
}

export async function getTeacherSession() {
    const sessionId = cookies().get('teacher_session_id')?.value
    if (!sessionId) return { success: false }

    const supabase = await getSupabase()
    const { data: teacher } = await supabase
        .from('teachers')
        .select('id, name, teacher_id, subject, assigned_class, department, photo_url, bio, contact, qualification, experience, joining_date, basic_salary, allowances')
        .eq('id', sessionId)
        .single()

    if (!teacher) return { success: false }
    return { success: true, data: teacher }
}

// ------------------------------------------------------------------
// Teacher Salary Records
// ------------------------------------------------------------------

export async function getTeacherSalaryRecords(teacherId: string) {
    const supabase = await getSupabase()
    const { data, error } = await supabase
        .from('salary_records')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('year', { ascending: false })
        .order('month', { ascending: false })

    if (error) throw error
    return data
}

// ------------------------------------------------------------------
// Teacher Materials (class-specific)
// ------------------------------------------------------------------

export async function createTeacherMaterial(data: {
    teacher_id: string
    class_name: string
    subject: string
    title: string
    description?: string
    material_type: 'Video' | 'PDF' | 'Link' | 'Notes'
    file_url: string
}) {
    const supabase = await getSupabase()
    const { data: result, error } = await supabase
        .from('teacher_materials')
        .insert([data])
        .select()
        .single()
    if (error) throw error
    return { success: true, data: result }
}

export async function getTeacherMaterials(teacherId?: string, className?: string) {
    const supabase = await getSupabase()
    let query = supabase
        .from('teacher_materials')
        .select('*, teachers(name, photo_url, subject)')
        .order('created_at', { ascending: false })
    if (teacherId) query = query.eq('teacher_id', teacherId)
    if (className) query = query.ilike('class_name', className)
    const { data, error } = await query
    if (error) throw error
    return data
}

export async function deleteTeacherMaterial(id: string) {
    const supabase = await getSupabase()
    const { error } = await supabase.from('teacher_materials').delete().eq('id', id)
    if (error) throw error
    return { success: true }
}

// ------------------------------------------------------------------
// Teacher Assignments (class-specific)
// ------------------------------------------------------------------

export async function createTeacherAssignment(data: {
    teacher_id: string
    class_name: string
    subject: string
    title: string
    description?: string
    due_date: string
    max_marks: number
    attachment_url?: string
}) {
    const supabase = await getSupabase()
    const { data: result, error } = await supabase
        .from('teacher_assignments')
        .insert([data])
        .select()
        .single()
    if (error) throw error
    return { success: true, data: result }
}

export async function getTeacherAssignments(teacherId?: string, className?: string) {
    const supabase = await getSupabase()
    let query = supabase
        .from('teacher_assignments')
        .select('*, teachers(name, photo_url)')
        .order('due_date', { ascending: true })
    if (teacherId) query = query.eq('teacher_id', teacherId)
    if (className) query = query.ilike('class_name', className)
    const { data, error } = await query
    if (error) throw error
    return data
}

export async function deleteTeacherAssignment(id: string) {
    const supabase = await getSupabase()
    const { error } = await supabase.from('teacher_assignments').delete().eq('id', id)
    if (error) throw error
    return { success: true }
}

// ------------------------------------------------------------------
// Teacher Live Classes (class-specific)
// ------------------------------------------------------------------

export async function createTeacherLiveClass(data: {
    teacher_id: string
    class_name: string
    subject: string
    topic: string
    scheduled_at: string
    duration_minutes: number
    platform: string
    meeting_url: string
}) {
    const supabase = await getSupabase()
    const { data: result, error } = await supabase
        .from('teacher_live_classes')
        .insert([data])
        .select()
        .single()
    if (error) throw error
    return { success: true, data: result }
}

export async function getTeacherLiveClasses(teacherId?: string, className?: string) {
    const supabase = await getSupabase()
    let query = supabase
        .from('teacher_live_classes')
        .select('*, teachers(name, photo_url)')
        .order('scheduled_at', { ascending: true })
    if (teacherId) query = query.eq('teacher_id', teacherId)
    if (className) query = query.ilike('class_name', className)
    const { data, error } = await query
    if (error) throw error
    return data
}

export async function deleteTeacherLiveClass(id: string) {
    const supabase = await getSupabase()
    const { error } = await supabase.from('teacher_live_classes').delete().eq('id', id)
    if (error) throw error
    return { success: true }
}

// ------------------------------------------------------------------
// Public: All teachers (for public faculty page)
// ------------------------------------------------------------------

export async function getPublicTeachers() {
    const supabase = await getSupabase()
    const { data, error } = await supabase
        .from('teachers')
        .select('id, name, subject, department, assigned_class, qualification, experience, photo_url, bio, specializations')
        .order('name', { ascending: true })
    if (error) throw error
    return data
}

// ------------------------------------------------------------------
// Internal: Admin-Teacher Chat
// ------------------------------------------------------------------

export async function getOrCreateTeacherAdminThread(teacherId: string, subject: string = 'Institutional Talk') {
    const supabase = await getSupabase()

    // Check if an open thread already exists for this teacher
    let { data: thread } = await supabase
        .from('teacher_admin_threads')
        .select('*')
        .eq('teacher_id', teacherId)
        .eq('status', 'Open')
        .single()

    if (thread) return thread

    // If not, create a new one
    const { data: newThread, error } = await supabase
        .from('teacher_admin_threads')
        .insert([{ teacher_id: teacherId, subject }])
        .select()
        .single()

    if (error) throw error
    return newThread
}

export async function getTeacherAdminMessages(threadId: string) {
    const supabase = await getSupabase()
    const { data, error } = await supabase
        .from('teacher_admin_messages')
        .select('*')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true })
    if (error) throw error
    return data
}

export async function sendTeacherAdminMessage(threadId: string, senderRole: 'teacher' | 'admin', message: string) {
    const supabase = await getSupabase()

    // Add the message
    const { data: msg, error } = await supabase
        .from('teacher_admin_messages')
        .insert([{ thread_id: threadId, sender_role: senderRole, message }])
        .select()
        .single()

    if (error) throw error

    // Update the thread's updated_at timestamp
    await supabase
        .from('teacher_admin_threads')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', threadId)

    return msg
}

export async function getAllTeacherAdminThreads() {
    const supabase = await getSupabase()
    const { data, error } = await supabase
        .from('teacher_admin_threads')
        .select('*, teachers(name, teacher_id, department, photo_url)')
        .order('updated_at', { ascending: false })
    if (error) throw error
    return data
}

export async function updateTeacherAdminThreadStatus(threadId: string, status: 'Open' | 'Resolved') {
    const supabase = await getSupabase()
    const { error } = await supabase
        .from('teacher_admin_threads')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', threadId)
    if (error) throw error
    return { success: true }
}
// ------------------------------------------------------------------
// Internal: Teacher-Student Chat
// ------------------------------------------------------------------

export async function getOrCreateTeacherStudentThread(teacherId: string, studentId: string, subject: string = 'Academic Query') {
    const supabase = await getSupabase()

    let { data: thread } = await supabase
        .from('teacher_student_threads')
        .select('*')
        .eq('teacher_id', teacherId)
        .eq('student_id', studentId)
        .eq('status', 'Open')
        .single()

    if (thread) return thread

    const { data: newThread, error } = await supabase
        .from('teacher_student_threads')
        .insert([{ teacher_id: teacherId, student_id: studentId, subject }])
        .select()
        .single()

    if (error) throw error
    return newThread
}

export async function getTeacherStudentMessages(threadId: string) {
    const supabase = await getSupabase()
    const { data, error } = await supabase
        .from('teacher_student_messages')
        .select('*')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true })
    if (error) throw error
    return data
}

export async function sendTeacherStudentMessage(threadId: string, senderRole: 'teacher' | 'student', message: string) {
    const supabase = await getSupabase()

    const { data: msg, error } = await supabase
        .from('teacher_student_messages')
        .insert([{ thread_id: threadId, sender_role: senderRole, message }])
        .select()
        .single()

    if (error) throw error

    await supabase
        .from('teacher_student_threads')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', threadId)

    return msg
}

export async function getStudentsInTeacherClass(className: string) {
    const supabase = await getSupabase()

    // Get students
    const { data: students, error: studentError } = await supabase
        .from('students')
        .select('id, first_name, last_name, student_id, photo_url, course, is_restricted')
        .ilike('course', className)
        .order('first_name', { ascending: true })

    if (studentError) throw studentError
    if (!students || students.length === 0) return []

    // Get latest fee payment for each student to determine status
    const studentIds = students.map(s => s.id)
    const { data: payments, error: paymentError } = await supabase
        .from('fee_payments')
        .select('student_id, remaining_amount, payment_date')
        .in('student_id', studentIds)
        .order('payment_date', { ascending: false })

    if (paymentError) throw paymentError

    // Map fee status to students
    const studentsWithFee = students.map(student => {
        const studentPayments = payments?.filter(p => p.student_id === student.id) || []
        const latestPayment = studentPayments[0]

        let feeStatus: 'Paid' | 'Pending' | 'No Record' = 'No Record'
        if (latestPayment) {
            feeStatus = Number(latestPayment.remaining_amount) <= 0 ? 'Paid' : 'Pending'
        }

        return {
            ...student,
            fee_status: feeStatus
        }
    })

    return studentsWithFee
}

export async function toggleStudentRestriction(studentId: string, restricted: boolean) {
    const supabase = await getSupabase()
    const { error } = await supabase
        .from('students')
        .update({ is_restricted: restricted })
        .eq('id', studentId)

    if (error) throw error
    return { success: true }
}
