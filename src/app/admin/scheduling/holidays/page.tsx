"use client"

import React, { useState, useEffect } from 'react'
import { getHolidays, createHoliday, deleteHoliday } from '@/app/actions/timetable'
import { getBranchesAction } from '@/lib/actions/branch.action'
import { Plus, Trash2, TentTree } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function HolidaysPage() {
    const [holidays, setHolidays] = useState<any[]>([])
    const [branches, setBranches] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)

    const [formData, setFormData] = useState({
        branch_id: '',
        date: '',
        description: '',
        type: 'Public'
    })

    useEffect(() => {
        fetchData()
    }, [])

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
            const data = await getHolidays()
            setHolidays(data || [])
        } catch (e) {
            console.error("Failed to fetch holidays:", e)
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        try {
            await createHoliday({
                ...formData,
                branch_id: formData.branch_id === 'global' ? null : formData.branch_id
            })
            setIsAdding(false)
            fetchData()
            setFormData({ branch_id: '', date: '', description: '', type: 'Public' })
        } catch (e) {
            console.error(e)
            alert("Error adding holiday")
        }
    }

    async function handleDelete(id: string) {
        if (confirm("Are you sure you want to delete this holiday?")) {
            await deleteHoliday(id)
            fetchData()
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Holidays & Events</h1>
                    <p className="text-muted-foreground mt-1">Manage campus holidays.</p>
                </div>
                <Button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-brand hover:bg-brand/90 text-white gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Holiday
                </Button>
            </div>

            {isAdding && (
                <Card className="shadow-sm border-border/60">
                    <CardHeader className="pb-4 border-b border-border/40">
                        <CardTitle className="text-lg">Add New Holiday</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Branch Scope</label>
                                <select required className="w-full border p-2 rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={formData.branch_id} onChange={e => setFormData({ ...formData, branch_id: e.target.value })}>
                                    <option value="">Select Scope...</option>
                                    <option value="global">ALL BRANCHES (Global)</option>
                                    {branches.map(b => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Date</label>
                                <input required type="date" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                            </div>
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                                <input required type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="e.g. Diwali Break" />
                            </div>
                            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                                Save Holiday
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card className="shadow-sm border-border/60 bg-card">
                <CardHeader className="pb-4 border-b border-border/40">
                    <CardTitle className="text-lg text-foreground flex items-center gap-2">
                        <TentTree className="w-5 h-5 text-muted-foreground" />
                        Holidays Directory
                    </CardTitle>
                    <CardDescription>A list of all planned holidays and events.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-accent/40">
                            <TableRow className="border-border/40 hover:bg-transparent">
                                <TableHead className="font-semibold pl-6">Date</TableHead>
                                <TableHead className="font-semibold">Description</TableHead>
                                <TableHead className="font-semibold">Type</TableHead>
                                <TableHead className="font-semibold">Scope</TableHead>
                                <TableHead className="text-right font-semibold pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">Loading...</TableCell></TableRow>
                            ) : holidays.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                        No holidays found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                holidays.map(holiday => (
                                    <TableRow key={holiday.id} className="border-border/40 hover:bg-accent/50 transition-colors">
                                        <TableCell className="font-medium pl-6">{new Date(holiday.date).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-muted-foreground">{holiday.description}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                {holiday.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{holiday.branch_id ? holiday.branches?.name : 'Global (All Branches)'}</TableCell>
                                        <TableCell className="text-right pr-6">
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(holiday.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                                                <Trash2 size={16} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
