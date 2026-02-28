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
        .select('id, name, teacher_id, subject, assigned_class, department, photo_url, bio')
        .eq('id', sessionId)
        .single()

    if (!teacher) return { success: false }
    return { success: true, data: teacher }
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
