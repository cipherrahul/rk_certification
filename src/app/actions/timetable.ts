'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Helper to create Supabase client in server actions
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
// Rooms
// ------------------------------------------------------------------

export async function getRooms(branchId?: string) {
    const supabase = await getSupabase()
    let query = supabase.from('rooms').select('*, branches(name)').order('name')
    if (branchId) {
        query = query.eq('branch_id', branchId)
    }
    const { data, error } = await query
    if (error) throw error
    return data
}

export async function createRoom(data: { branch_id: string; name: string; capacity: number; status: string }) {
    const supabase = await getSupabase()
    const { data: room, error } = await supabase.from('rooms').insert([data]).select().single()
    if (error) throw error
    return { success: true, data: room }
}

export async function updateRoom(id: string, data: any) {
    const supabase = await getSupabase()
    const { data: room, error } = await supabase.from('rooms').update(data).eq('id', id).select().single()
    if (error) throw error
    return { success: true, data: room }
}

export async function deleteRoom(id: string) {
    const supabase = await getSupabase()
    const { error } = await supabase.from('rooms').delete().eq('id', id)
    if (error) throw error
    return { success: true }
}

// ------------------------------------------------------------------
// Holidays
// ------------------------------------------------------------------

export async function getHolidays(branchId?: string) {
    const supabase = await getSupabase()
    let query = supabase.from('holidays').select('*, branches(name)').order('date')

    if (branchId) {
        query = query.or(`branch_id.eq.${branchId},branch_id.is.null`)
    }
    const { data, error } = await query
    if (error) throw error
    return data
}

export async function createHoliday(data: { branch_id?: string | null; date: string; description: string; type: string }) {
    const supabase = await getSupabase()
    const { data: holiday, error } = await supabase.from('holidays').insert([data]).select().single()
    if (error) throw error
    return { success: true, data: holiday }
}

export async function deleteHoliday(id: string) {
    const supabase = await getSupabase()
    const { error } = await supabase.from('holidays').delete().eq('id', id)
    if (error) throw error
    return { success: true }
}

// ------------------------------------------------------------------
// Timetables
// ------------------------------------------------------------------

export async function getTimetables(branchId?: string) {
    const supabase = await getSupabase()
    let query = supabase.from('timetables').select('*, branches(name), courses(name)').order('created_at', { ascending: false })
    if (branchId) {
        query = query.eq('branch_id', branchId)
    }
    const { data, error } = await query
    if (error) throw error
    return data
}

export async function getTimetableById(id: string) {
    const supabase = await getSupabase()
    const { data, error } = await supabase.from('timetables').select('*, branches(name), courses(name)').eq('id', id).single()
    if (error) throw error
    return data
}

export async function createTimetable(data: { branch_id: string; course_id: string; name: string; valid_from: string; valid_until?: string | null; status: string }) {
    const supabase = await getSupabase()
    const { data: timetable, error } = await supabase.from('timetables').insert([data]).select().single()
    if (error) throw error
    return { success: true, data: timetable }
}

export async function updateTimetable(id: string, data: any) {
    const supabase = await getSupabase()
    const { data: timetable, error } = await supabase.from('timetables').update(data).eq('id', id).select().single()
    if (error) throw error
    return { success: true, data: timetable }
}

export async function deleteTimetable(id: string) {
    const supabase = await getSupabase()
    const { error } = await supabase.from('timetables').delete().eq('id', id)
    if (error) throw error
    return { success: true }
}

// ------------------------------------------------------------------
// Teachers (Utility for Schedules)
// ------------------------------------------------------------------

export async function getTeachersForBranch(branchId: string) {
    const supabase = await getSupabase()
    const { data, error } = await supabase.from('teachers').select('*').eq('branch_id', branchId).order('name')
    if (error) throw error
    return data
}

// ------------------------------------------------------------------
// Class Schedules
// ------------------------------------------------------------------

export async function getClassSchedules(timetableId: string) {
    const supabase = await getSupabase()
    const { data, error } = await supabase
        .from('class_schedules')
        .select('*, teachers(name), rooms(name)')
        .eq('timetable_id', timetableId)
        .order('start_time')

    if (error) throw error
    return data
}

export async function checkScheduleConflict(
    timetableId: string,
    dayOfWeek: string,
    startTime: string,
    endTime: string,
    teacherId: string,
    roomId: string,
    excludeScheduleId?: string
) {
    const supabase = await getSupabase()

    // High-level accuracy conflict detection
    // A conflict occurs if another class schedule on the same day has overlapping times
    // AND shares the same teacher, room, or timetable (which implicitly represents the class).

    let query = supabase
        .from('class_schedules')
        .select(`
      id, 
      subject, 
      start_time, 
      end_time, 
      day_of_week, 
      teacher_id, 
      room_id, 
      timetable_id,
      timetables(course_id)
    `)
        .eq('day_of_week', dayOfWeek)
        // Basic time overlap check: (StartA < EndB) AND (EndA > StartB)
        .lt('start_time', endTime)
        .gt('end_time', startTime)

    if (excludeScheduleId) {
        query = query.neq('id', excludeScheduleId)
    }

    const { data: potentialConflicts, error } = await query

    if (error) throw error

    if (!potentialConflicts || potentialConflicts.length === 0) return { conflict: false }

    // Verify specific entity conflicts
    const timetableCourseId = (await getTimetableById(timetableId)).course_id

    for (const schedule of potentialConflicts) {
        // Check Teacher Conflict
        if (schedule.teacher_id === teacherId) {
            return { conflict: true, message: `Teacher double-booked with subject ${schedule.subject}` }
        }
        // Check Room Conflict
        if (schedule.room_id === roomId) {
            return { conflict: true, message: `Room double-booked with subject ${schedule.subject}` }
        }
        // Check Class Conflict
        if (schedule.timetable_id === timetableId) {
            return { conflict: true, message: `Class is already taking ${schedule.subject} at this time` }
        }
        // Advanced Class Conflict: Even if diff timetable, might be same class
        // In our schema, timetable_id translates one-to-one or many-to-one to course_id
        if (schedule.timetables && (schedule.timetables as any).course_id === timetableCourseId) {
            return { conflict: true, message: `Course is already taking ${schedule.subject} at this time (via different timetable)` }
        }
    }

    return { conflict: false }
}

export async function createClassSchedule(data: {
    timetable_id: string;
    subject: string;
    teacher_id: string;
    room_id: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
    is_special_class?: boolean;
    special_date?: string | null;
}) {
    // First run conflict detection
    const conflictCheck = await checkScheduleConflict(
        data.timetable_id,
        data.day_of_week,
        data.start_time,
        data.end_time,
        data.teacher_id,
        data.room_id
    )

    if (conflictCheck.conflict) {
        return { success: false, error: conflictCheck.message }
    }

    const supabase = await getSupabase()
    const { data: schedule, error } = await supabase.from('class_schedules').insert([data]).select().single()

    if (error) {
        return { success: false, error: error.message }
    }

    return { success: true, data: schedule }
}

export async function updateClassSchedule(id: string, data: any) {
    if (data.day_of_week && data.start_time && data.end_time && data.teacher_id && data.room_id && data.timetable_id) {
        const conflictCheck = await checkScheduleConflict(
            data.timetable_id,
            data.day_of_week,
            data.start_time,
            data.end_time,
            data.teacher_id,
            data.room_id,
            id
        )
        if (conflictCheck.conflict) {
            return { success: false, error: conflictCheck.message }
        }
    }

    const supabase = await getSupabase()
    const { data: schedule, error } = await supabase.from('class_schedules').update(data).eq('id', id).select().single()

    if (error) return { success: false, error: error.message }
    return { success: true, data: schedule }
}

export async function deleteClassSchedule(id: string) {
    const supabase = await getSupabase()
    const { error } = await supabase.from('class_schedules').delete().eq('id', id)
    if (error) throw error
    return { success: true }
}

// ------------------------------------------------------------------
// Public Timetable Fetcher by Student UID
// ------------------------------------------------------------------

export async function getStudentTimetableByUid(studentIdStr: string) {
    const supabase = await getSupabase()

    // 1. Fetch Student
    const { data: student, error: studentError } = await supabase
        .from('students')
        .select('id, student_id, first_name, last_name, class_id, branch_id, course')
        .ilike('student_id', studentIdStr) // Case-insensitive matching
        .single()

    if (studentError || !student) {
        return { success: false, error: 'Student not found.' }
    }

    if (!student.course) {
        return { success: false, error: 'Student is not enrolled in any specific course.' }
    }

    // First fetch the course by name to get its ID
    const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('id')
        .eq('name', student.course)
        .single();

    if (courseError || !courseData) {
        return { success: false, error: 'Student course not found in database.' }
    }

    // 2. Fetch Active Timetable for that course
    const { data: timetables, error: ttError } = await supabase
        .from('timetables')
        .select('id, name, valid_from, valid_until')
        .eq('course_id', courseData.id)
        .eq('status', 'Active')
        .order('created_at', { ascending: false })
        .limit(1)

    if (ttError || !timetables || timetables.length === 0) {
        return { success: false, error: 'No active timetable found for your course.' }
    }

    const activeTimetable = timetables[0]

    // 3. Fetch Class Schedules for that timetable
    const { data: schedules, error: schedError } = await supabase
        .from('class_schedules')
        .select('*, teachers(name), rooms(name)')
        .eq('timetable_id', activeTimetable.id)
        .order('start_time')

    if (schedError) {
        return { success: false, error: 'Failed to fetch schedules.' }
    }

    // 4. Group by Day for easy UI rendering
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const formattedSchedule: Record<string, any[]> = {}
    daysOfWeek.forEach(day => {
        formattedSchedule[day] = schedules.filter(s => s.day_of_week === day)
    })

    return {
        success: true,
        data: {
            student_name: `${student.first_name} ${student.last_name}`,
            student_id: student.student_id,
            timetable_name: activeTimetable.name,
            valid_from: activeTimetable.valid_from,
            schedule: formattedSchedule
        }
    }
}
