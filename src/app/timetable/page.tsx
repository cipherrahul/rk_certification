"use client"

import React, { useState } from 'react'
import { getStudentTimetableByUid } from '@/app/actions/timetable'
import { Search, MapPin, Clock, User, CalendarDays, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PublicTimetablePage() {
    const [studentId, setStudentId] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [errorMsg, setErrorMsg] = useState('')

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        if (!studentId.trim()) return

        setLoading(true)
        setErrorMsg('')
        setResult(null)

        try {
            const res = await getStudentTimetableByUid(studentId)
            if (!res.success) {
                setErrorMsg(res.error || 'Schedule not found.')
            } else {
                setResult(res.data)
            }
        } catch (err: any) {
            setErrorMsg('An unexpected error occurred.')
        } finally {
            setLoading(false)
        }
    }

    function formatTime(timeStr: string) {
        if (!timeStr) return ''
        const [h, m] = timeStr.split(':')
        const hours = parseInt(h)
        const ampm = hours >= 12 ? 'PM' : 'AM'
        const displayHours = hours % 12 || 12
        return `${displayHours}:${m} ${ampm}`
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
            <div className="w-full max-w-4xl space-y-8">
                {/* Header / Search Area */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6">
                        <CalendarDays size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Timetable</h1>
                    <p className="text-gray-500 mb-8 max-w-md">
                        Enter your Student ID (UID) below to view your personalized class schedule for the current session.
                    </p>

                    <form onSubmit={handleSearch} className="w-full max-w-md relative flex items-center group">
                        <input
                            type="text"
                            placeholder="e.g. RK2026STU001"
                            className="w-full pl-6 pr-16 py-4 rounded-full border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-purple-600 focus:outline-none transition-all text-lg font-medium text-gray-900 uppercase"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                        />
                        <button
                            type="submit"
                            disabled={loading || !studentId.trim()}
                            className="absolute right-2 top-2 bottom-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white p-2 w-12 rounded-full flex items-center justify-center transition-colors"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Search size={20} />
                            )}
                        </button>
                    </form>

                    {errorMsg && (
                        <p className="mt-4 text-red-600 font-medium bg-red-50 px-4 py-2 rounded-lg">{errorMsg}</p>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-100 w-full flex items-center justify-center">
                        <Link href="/" className="text-gray-500 hover:text-purple-600 flex items-center gap-2 font-medium transition-colors">
                            <ArrowLeft size={16} /> Back to Home
                        </Link>
                    </div>
                </div>

                {/* Results Area */}
                {result && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Student Info Header */}
                        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-8 text-white">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold mb-1">{result.student_name}</h2>
                                    <p className="text-purple-200 font-medium tracking-wide">{result.student_id}</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                                    <p className="text-xs text-purple-200 uppercase font-bold tracking-wider mb-1">Active Timetable</p>
                                    <p className="font-semibold">{result.timetable_name}</p>
                                    <p className="text-xs mt-1 text-purple-200">Valid From: {new Date(result.valid_from).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Timetable Grid */}
                        <div className="p-6 md:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {daysOfWeek.map(day => {
                                    const daySchedules = result.schedule?.[day] || []
                                    return (
                                        <div key={day} className="flex flex-col h-full rounded-xl border border-gray-100 overflow-hidden">
                                            <div className="bg-gray-50 border-b border-gray-100 p-4 font-bold text-gray-900 text-center uppercase tracking-wide">
                                                {day}
                                            </div>
                                            <div className="p-4 space-y-3 flex-1 bg-white">
                                                {daySchedules.length === 0 ? (
                                                    <div className="h-full flex items-center justify-center text-gray-400 text-sm py-6">
                                                        No classes
                                                    </div>
                                                ) : (
                                                    daySchedules.map((slot: any) => (
                                                        <div key={slot.id} className="p-3 rounded-xl border border-purple-100 bg-purple-50/50 shadow-sm relative overflow-hidden group">
                                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 rounded-l-xl" />
                                                            <div className="font-bold text-gray-900 mb-1 pl-2">{slot.subject}</div>
                                                            <div className="pl-2 space-y-1">
                                                                <div className="text-xs text-gray-600 flex items-center gap-2">
                                                                    <Clock size={12} className="text-purple-500" />
                                                                    <span className="font-medium text-gray-800">{formatTime(slot.start_time)}</span> - <span>{formatTime(slot.end_time)}</span>
                                                                </div>
                                                                <div className="text-xs text-gray-600 flex items-center gap-2">
                                                                    <MapPin size={12} className="text-purple-500" /> {slot.rooms?.name}
                                                                </div>
                                                                <div className="text-xs text-gray-600 flex items-center gap-2">
                                                                    <User size={12} className="text-purple-500" /> {slot.teachers?.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    )
}
