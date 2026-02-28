import Link from 'next/link'
import { CalendarDays, MapPin, TentTree, Clock, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata = {
    title: 'Scheduling Management | Admin Dashboard',
}

const schedulingLinks = [
    {
        title: 'Rooms & Resources',
        description: 'Manage campus rooms, labs, and capacities',
        href: '/admin/scheduling/rooms',
        icon: MapPin,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
    },
    {
        title: 'Holidays & Events',
        description: 'Mark holidays, internal events, and school off-days',
        href: '/admin/scheduling/holidays',
        icon: TentTree,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-100',
    },
    {
        title: 'Timetables',
        description: 'Create and manage class schedules & teacher timetables',
        href: '/admin/scheduling/timetables',
        icon: CalendarDays,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
    },
    {
        title: 'Special Classes',
        description: 'Schedule one-off makeup or special classes',
        href: '/admin/scheduling/timetables?special=true',
        icon: Clock,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
    }
]

export default function SchedulingDashboard() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Scheduling Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Manage rooms, holidays, and timetables efficiently.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {schedulingLinks.map((link) => {
                    const Icon = link.icon
                    return (
                        <Link key={link.title} href={link.href} className="block group h-full">
                            <Card className="h-full hover:shadow-md transition-all border-border/60 hover:border-brand/50">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-4 rounded-xl ${link.bgColor} ${link.color}`}>
                                            <Icon size={24} />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl group-hover:text-brand transition-colors">{link.title}</CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex flex-col flex-grow pt-4">
                                    <p className="text-muted-foreground mb-6 flex-grow">{link.description}</p>
                                    <div className="flex items-center text-sm font-medium text-brand group-hover:translate-x-1 transition-transform">
                                        Manage {link.title} <ArrowRight size={16} className="ml-1" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
