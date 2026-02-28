"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Video, Loader2, Link as LinkIcon, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getLiveClasses, createLiveClass, deleteLiveClass } from "@/app/actions/learning";
import { getAllCoursesAction } from "@/lib/actions/course.action";

export default function AdminLiveClassesPage() {
    const { toast } = useToast();
    const [liveClasses, setLiveClasses] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [courseId, setCourseId] = useState("");
    const [subject, setSubject] = useState("");
    const [topic, setTopic] = useState("");
    const [scheduledAt, setScheduledAt] = useState("");
    const [duration, setDuration] = useState("60");
    const [platform, setPlatform] = useState("Zoom");
    const [meetingUrl, setMeetingUrl] = useState("");

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [classesRes, coursesRes] = await Promise.all([
                getLiveClasses(),
                getAllCoursesAction()
            ]);
            setLiveClasses(classesRes || []);
            if (coursesRes.success) setCourses(coursesRes.data || []);
        } catch (error) {
            toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async () => {
        if (!courseId || !subject || !topic || !scheduledAt || !meetingUrl) {
            toast({ title: "Validation Error", description: "Please fill all required fields", variant: "destructive" });
            return;
        }

        setIsSaving(true);
        try {
            await createLiveClass({
                course_id: courseId,
                subject,
                topic,
                scheduled_at: new Date(scheduledAt).toISOString(),
                duration_minutes: parseInt(duration),
                platform,
                meeting_url: meetingUrl
            });
            toast({ title: "Success", description: "Live class scheduled successfully" });
            // Reset form
            setSubject("");
            setTopic("");
            setMeetingUrl("");
            fetchData();
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Failed to schedule class", variant: "destructive" });
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this live class?")) return;
        try {
            await deleteLiveClass(id);
            toast({ title: "Success", description: "Class deleted successfully" });
            fetchData();
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Failed to delete", variant: "destructive" });
        }
    };

    return (
        <div className="container px-4 py-8 mx-auto space-y-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">Live Classes</h1>
                <p className="text-muted-foreground text-sm font-medium">Schedule and manage online live sessions for courses.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Create Form */}
                <Card className="lg:col-span-1 shadow-sm h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg">Schedule Class</CardTitle>
                        <CardDescription>Setup a new Zoom or Meet session.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Course</label>
                            <Select value={courseId} onValueChange={setCourseId}>
                                <SelectTrigger><SelectValue placeholder="Select Course" /></SelectTrigger>
                                <SelectContent>
                                    {courses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Subject</label>
                            <Input placeholder="e.g. Mathematics" value={subject} onChange={e => setSubject(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Topic</label>
                            <Input placeholder="e.g. Algebra Basics" value={topic} onChange={e => setTopic(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Date & Time</label>
                                <Input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Duration (Min)</label>
                                <Input type="number" value={duration} onChange={e => setDuration(e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Platform</label>
                            <Select value={platform} onValueChange={setPlatform}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Zoom">Zoom</SelectItem>
                                    <SelectItem value="Google Meet">Google Meet</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Meeting URL</label>
                            <Input placeholder="https://..." value={meetingUrl} onChange={e => setMeetingUrl(e.target.value)} />
                        </div>

                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 mt-4" onClick={handleCreate} disabled={isSaving}>
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                            Schedule Class
                        </Button>
                    </CardContent>
                </Card>

                {/* List */}
                <Card className="lg:col-span-2 shadow-sm">
                    <CardHeader className="border-b border-border/40">
                        <CardTitle className="text-lg">Scheduled Classes</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="p-12 text-center text-muted-foreground"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" /></div>
                        ) : liveClasses.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="pl-6">Class Info</TableHead>
                                        <TableHead>Schedule</TableHead>
                                        <TableHead>Link</TableHead>
                                        <TableHead className="text-right pr-6">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {liveClasses.map((cls) => (
                                        <TableRow key={cls.id}>
                                            <TableCell className="pl-6">
                                                <div className="font-bold text-gray-900">{cls.subject}</div>
                                                <div className="text-xs font-medium text-indigo-600 mb-1">{cls.courses?.name}</div>
                                                <div className="text-sm text-gray-500">{cls.topic}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm font-medium mb-1">
                                                    <Calendar className="w-3 h-3 text-gray-400" />
                                                    {new Date(cls.scheduled_at).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Clock className="w-3 h-3 text-gray-400" />
                                                    {new Date(cls.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({cls.duration_minutes}m)
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`
                                                    ${cls.platform === 'Zoom' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                                                    ${cls.platform === 'Google Meet' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                                                    mb-2
                                                `}>
                                                    {cls.platform}
                                                </Badge>
                                                <a href={cls.meeting_url} target="_blank" rel="noreferrer" className="flex items-center text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                                                    <LinkIcon className="w-3 h-3 mr-1" /> Join Link
                                                </a>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button variant="ghost" size="sm" className="text-rose-500" onClick={() => handleDelete(cls.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="p-12 text-center text-muted-foreground">
                                <Video className="w-8 h-8 mx-auto mb-4 opacity-20" />
                                No live classes scheduled.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
