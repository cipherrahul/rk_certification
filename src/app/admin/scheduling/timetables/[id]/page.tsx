"use client"

import React, { useState, useEffect } from 'react'
import { getTimetableById, getClassSchedules, createClassSchedule, deleteClassSchedule, getRooms, getTeachersForBranch } from '@/app/actions/timetable'
import { ArrowLeft, Plus, Trash2, Clock, MapPin, User, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TimetableDetail({ params }: { params: { id: string } }) {
    const timetableId = params.id
    const [timetable, setTimetable] = useState<any>(null)
    const [schedules, setSchedules] = useState<any[]>([])
    const [rooms, setRooms] = useState<any[]>([])
    const [teachers, setTeachers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const [formData, setFormData] = useState({
        timetable_id: timetableId,
        subject: '',
        teacher_id: '',
        room_id: '',
        day_of_week: 'Monday',
        start_time: '09:00',
        end_time: '10:00'
    })

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        setLoading(true)
        try {
            const data = await getTimetableById(timetableId)
            setTimetable(data)

            if (data?.branch_id) {
                const [schedRes, roomsRes, teachRes] = await Promise.all([
                    getClassSchedules(timetableId),
                    getRooms(data.branch_id),
                    getTeachersForBranch(data.branch_id)
                ])

                setSchedules(schedRes || [])
                setRooms(roomsRes || [])
                setTeachers(teachRes || [])
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setErrorMsg('')
        try {
            // Input formatting to time for DB: Ensure HH:MM
            const res = await createClassSchedule({
                ...formData,
                start_time: formData.start_time.length === 5 ? `${formData.start_time}:00` : formData.start_time,
                end_time: formData.end_time.length === 5 ? `${formData.end_time}:00` : formData.end_time
            })

            if (!res.success) {
                setErrorMsg(res.error || 'Conflict detected or unable to save schedule.')
                return
            }

            setIsAdding(false)
            fetchData()
            setFormData({ ...formData, subject: '', start_time: formData.end_time, end_time: '' })
        } catch (e: any) {
            setErrorMsg(e.message || "An unexpected error occurred.")
        }
    }

    async function handleDelete(id: string) {
        if (confirm("Remove this class from the schedule?")) {
            await deleteClassSchedule(id)
            fetchData()
        }
    }

    function formatTime(timeStr: string) {
        // 09:00:00 to 09:00 AM
        if (!timeStr) return ''
        const [h, m] = timeStr.split(':')
        const hours = parseInt(h)
        const ampm = hours >= 12 ? 'PM' : 'AM'
        const displayHours = hours % 12 || 12
        return `${displayHours}:${m} ${ampm}`
    }

    if (loading) return <div className="p-10 text-center text-muted-foreground">Loading Timetable Details...</div>
    if (!timetable) return <div className="p-10 text-center text-muted-foreground">Timetable not found.</div>

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/scheduling/timetables">
                        <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <div className="text-xs font-semibold text-brand mb-1 uppercase tracking-wider">{timetable.branches?.name} &bull; {timetable.courses?.name}</div>
                        <h1 className="text-3xl font-bold tracking-tight">{timetable.name}</h1>
                    </div>
                </div>
                <Button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-brand hover:bg-brand/90 text-white gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Class
                </Button>
            </div>

            {errorMsg && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg flex items-center gap-3">
                    <AlertCircle size={20} />
                    <p className="font-medium text-sm">{errorMsg}</p>
                </div>
            )}

            {isAdding && (
                <Card className="shadow-sm border-border/60">
                    <CardHeader className="pb-4 border-b border-border/40">
                        <CardTitle className="text-lg">Add Class to Schedule</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Day</label>
                                <select required className="w-full border p-2 rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={formData.day_of_week} onChange={e => setFormData({ ...formData, day_of_week: e.target.value })}>
                                    {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Subject</label>
                                <input required type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} placeholder="e.g. Mathematics" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Teacher</label>
                                <select required className="w-full border p-2 rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={formData.teacher_id} onChange={e => setFormData({ ...formData, teacher_id: e.target.value })}>
                                    <option value="">Select Teacher...</option>
                                    {teachers.map(t => <option key={t.id} value={t.id}>{t.name} ({t.subject})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Room</label>
                                <select required className="w-full border p-2 rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={formData.room_id} onChange={e => setFormData({ ...formData, room_id: e.target.value })}>
                                    <option value="">Select Room...</option>
                                    {rooms.map(r => <option key={r.id} value={r.id}>{r.name} (Cap: {r.capacity})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Time</label>
                                <div className="flex items-center gap-2">
                                    <input required type="time" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={formData.start_time} onChange={e => setFormData({ ...formData, start_time: e.target.value })} />
                                    <span className="text-muted-foreground">-</span>
                                    <input required type="time" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={formData.end_time} onChange={e => setFormData({ ...formData, end_time: e.target.value })} />
                                </div>
                            </div>
                            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                                Save Class
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {daysOfWeek.map(day => {
                    const daySchedules = schedules.filter(s => s.day_of_week === day)
                    // Optional: Sort chronologically
                    daySchedules.sort((a, b) => a.start_time.localeCompare(b.start_time))

                    return (
                        <Card key={day} className="shadow-sm border-border/60 bg-card overflow-hidden flex flex-col h-full">
                            <div className="bg-accent/40 border-b border-border/40 p-3 px-5 font-bold text-foreground">
                                {day}
                            </div>
                            <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
                                {daySchedules.length === 0 ? (
                                    <div className="flex-1 flex items-center justify-center">
                                        <p className="text-muted-foreground text-sm py-6">No classes scheduled</p>
                                    </div>
                                ) : (
                                    daySchedules.map(slot => (
                                        <div key={slot.id} className="group flex flex-col p-3.5 rounded-lg border border-border/50 bg-accent/20 hover:border-brand/30 hover:bg-brand/5 shadow-sm transition-all relative">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(slot.id)}
                                                className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                            <div className="font-bold text-foreground mb-1.5 pr-6">{slot.subject}</div>
                                            <div className="flex flex-col gap-1.5">
                                                <div className="text-xs text-muted-foreground flex items-center gap-2"><Clock size={13} className="text-brand/70" /> {formatTime(slot.start_time)} - {formatTime(slot.end_time)}</div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-2"><MapPin size={13} className="text-brand/70" /> {slot.rooms?.name}</div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-2"><User size={13} className="text-brand/70" /> {slot.teachers?.name}</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
