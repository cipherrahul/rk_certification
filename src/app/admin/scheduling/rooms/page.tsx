"use client"

import React, { useState, useEffect } from 'react'
import { getRooms, createRoom, deleteRoom } from '@/app/actions/timetable'
import { getBranchesAction } from '@/lib/actions/branch.action'
import { Plus, Trash2, DoorOpen } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function RoomsPage() {
    const [rooms, setRooms] = useState<any[]>([])
    const [branches, setBranches] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)

    const [formData, setFormData] = useState({
        branch_id: '',
        name: '',
        capacity: 30,
        status: 'Active'
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
            const roomsData = await getRooms()
            setRooms(roomsData || [])
        } catch (e) {
            console.error("Failed to fetch rooms:", e)
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        try {
            await createRoom(formData)
            setIsAdding(false)
            fetchData()
            setFormData({ branch_id: '', name: '', capacity: 30, status: 'Active' })
        } catch (e) {
            console.error(e)
            alert("Error adding room")
        }
    }

    async function handleDelete(id: string) {
        if (confirm("Are you sure you want to delete this room?")) {
            await deleteRoom(id)
            fetchData()
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Rooms & Resources</h1>
                    <p className="text-muted-foreground mt-1">Manage campus rooms and capacities.</p>
                </div>
                <Button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-brand hover:bg-brand/90 text-white gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Room
                </Button>
            </div>

            {isAdding && (
                <Card className="shadow-sm border-border/60">
                    <CardHeader className="pb-4 border-b border-border/40">
                        <CardTitle className="text-lg">Add New Room</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
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
                                <label className="block text-sm font-medium text-foreground mb-1">Room Name / Number</label>
                                <input required type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Lab 1" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Capacity</label>
                                <input required type="number" min="1" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })} />
                            </div>
                            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                                Save Room
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card className="shadow-sm border-border/60 bg-card">
                <CardHeader className="pb-4 border-b border-border/40">
                    <CardTitle className="text-lg text-foreground flex items-center gap-2">
                        <DoorOpen className="w-5 h-5 text-muted-foreground" />
                        Room Directory
                    </CardTitle>
                    <CardDescription>A list of all physical rooms and laboratories.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-accent/40">
                            <TableRow className="border-border/40 hover:bg-transparent">
                                <TableHead className="font-semibold pl-6">Room Name</TableHead>
                                <TableHead className="font-semibold">Branch</TableHead>
                                <TableHead className="font-semibold">Capacity</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                                <TableHead className="text-right font-semibold pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">Loading...</TableCell></TableRow>
                            ) : rooms.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                        No rooms found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rooms.map(room => (
                                    <TableRow key={room.id} className="border-border/40 hover:bg-accent/50 transition-colors">
                                        <TableCell className="font-medium pl-6">{room.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{room.branches?.name || 'N/A'}</TableCell>
                                        <TableCell className="text-muted-foreground">{room.capacity} students</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={room.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-700 border-slate-200'}>
                                                {room.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(room.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
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
