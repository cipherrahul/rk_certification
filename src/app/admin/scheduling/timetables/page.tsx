"use client"

import React, { useState, useEffect } from 'react'
import { getTimetables, createTimetable, deleteTimetable } from '@/app/actions/timetable'
import { getBranchesAction } from '@/lib/actions/branch.action'
import { getAllCoursesAction } from '@/lib/actions/course.action'
import { Plus, Trash2, ArrowRight, CalendarDays } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function TimetablesPage() {
    const [timetables, setTimetables] = useState<any[]>([])
    const [branches, setBranches] = useState<any[]>([])
    const [courses, setCourses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)

    const [formData, setFormData] = useState({
        branch_id: '',
        course_id: '',
        name: '',
        valid_from: '',
        status: 'Active'
    })

    useEffect(() => {
        fetchData()
    }, [])
    useEffect(() => {
        fetchData()
        fetchCourses()
    }, [])

    async function fetchCourses() {
        const res = await getAllCoursesAction()
        if (res.success) setCourses(res.data || [])
    }

    async function fetchData() {
        setLoading(true)
        try {
            const branchesRes = await getBranchesAction()
            if (branchesRes.success) {
                setBranches(branchesRes.data)
            } else {
                console.error("Failed to fetch branches:", branchesRes.error)
            }
        } catch (e) {
            console.error(e)
        }

        try {
            const data = await getTimetables()
            setTimetables(data || [])
        } catch (e) {
            console.error("Failed to fetch timetables:", e)
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        try {
            await createTimetable(formData)
            setIsAdding(false)
            fetchData()
            setFormData({ branch_id: '', course_id: '', name: '', valid_from: '', status: 'Active' })
        } catch (e) {
            console.error(e)
            alert("Error adding timetable")
        }
    }

    async function handleDelete(id: string) {
        if (confirm("Are you sure you want to delete this timetable? This will remove all class schedules inside it.")) {
            await deleteTimetable(id)
            fetchData()
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Timetables Directory</h1>
                    <p className="text-muted-foreground mt-1">Manage class/course timetables across branches.</p>
                </div>
                <Button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-brand hover:bg-brand/90 text-white gap-2"
                >
                    <Plus className="w-4 h-4" /> Create Timetable
                </Button>
            </div>

            {isAdding && (
                <Card className="shadow-sm border-border/60">
                    <CardHeader className="pb-4 border-b border-border/40">
                        <CardTitle className="text-lg">Create New Timetable</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Branch</label>
                                <select required className="w-full border p-2 rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={formData.branch_id} onChange={e => setFormData({ ...formData, branch_id: e.target.value })}>
                                    <option value="">Select Branch...</option>
                                    {branches.map(b => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Course</label>
                                <select required className="w-full border p-2 rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={formData.course_id} onChange={e => setFormData({ ...formData, course_id: e.target.value })}>
                                    <option value="">Select Course...</option>
                                    {courses.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Timetable Name</label>
                                <input required type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Summer 2026 Shift A" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Valid From</label>
                                <input required type="date" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={formData.valid_from} onChange={e => setFormData({ ...formData, valid_from: e.target.value })} />
                            </div>
                            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                                Save Timetable
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold text-foreground">Active Timetables</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full text-center text-muted-foreground py-10">Loading timetables...</div>
                    ) : timetables.length === 0 ? (
                        <div className="col-span-full text-center text-muted-foreground py-10">No timetables found.</div>
                    ) : (
                        timetables.map(tt => (
                            <Card key={tt.id} className="relative shadow-sm border-border/60 hover:shadow-md transition-shadow group overflow-hidden">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(tt.id)}
                                    className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors z-10"
                                >
                                    <Trash2 size={16} />
                                </Button>

                                <CardHeader className="pb-3 border-b border-border/40 bg-accent/30">
                                    <div className="text-xs font-bold text-brand mb-1 uppercase tracking-wider">{tt.branches?.name}</div>
                                    <CardTitle className="text-xl">{tt.name}</CardTitle>
                                    <CardDescription className="text-sm font-medium text-foreground/80 mt-1">Course: {tt.courses?.name}</CardDescription>
                                </CardHeader>

                                <CardContent className="pt-4 flex flex-col gap-4">
                                    <div className="flex items-center text-xs text-muted-foreground bg-accent/50 p-2.5 rounded-md border border-border/50">
                                        <span className="font-semibold text-foreground mr-2">Valid From:</span>
                                        {new Date(tt.valid_from).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </div>

                                    <Link href={`/admin/scheduling/timetables/${tt.id}`} className="mt-2 w-full">
                                        <Button className="w-full group/btn hover:bg-brand/90 transition-all">
                                            Manage Schedule
                                            <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
