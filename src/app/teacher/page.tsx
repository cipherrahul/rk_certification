"use client";

import { useState, useEffect, useCallback } from "react";
import {
    GraduationCap, LogOut, Video, Library, ClipboardList, Plus,
    Trash2, Loader2, Lock, ChevronRight, Calendar, Link as LinkIcon, FileText, BookOpen, Target,
    MessageCircle, Send, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
    loginTeacher, logoutTeacher, getTeacherSession,
    createTeacherMaterial, getTeacherMaterials, deleteTeacherMaterial,
    createTeacherAssignment, getTeacherAssignments, deleteTeacherAssignment,
    createTeacherLiveClass, getTeacherLiveClasses, deleteTeacherLiveClass,
    getOrCreateTeacherAdminThread, getTeacherAdminMessages, sendTeacherAdminMessage
} from "@/app/actions/teacher-portal";

interface Teacher {
    id: string;
    name: string;
    teacher_id: string;
    subject: string;
    assigned_class: string;
    department: string;
    photo_url: string | null;
    bio?: string;
}

interface ChatMessage {
    id: string;
    thread_id: string;
    sender_role: 'teacher' | 'admin';
    message: string;
    created_at: string;
}

export default function TeacherPortal() {
    const { toast } = useToast();

    const [isLoadingInit, setIsLoadingInit] = useState(true);
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [idInput, setIdInput] = useState("");
    const [passInput, setPassInput] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Data
    const [materials, setMaterials] = useState<any[]>([]);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [liveClasses, setLiveClasses] = useState<any[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    // Material form
    const [matClass, setMatClass] = useState("");
    const [matSubject, setMatSubject] = useState("");
    const [matTitle, setMatTitle] = useState("");
    const [matDesc, setMatDesc] = useState("");
    const [matType, setMatType] = useState("Video");
    const [matUrl, setMatUrl] = useState("");
    const [isSavingMat, setIsSavingMat] = useState(false);

    // Assignment form
    const [astClass, setAstClass] = useState("");
    const [astSubject, setAstSubject] = useState("");
    const [astTitle, setAstTitle] = useState("");
    const [astDesc, setAstDesc] = useState("");
    const [astDue, setAstDue] = useState("");
    const [astMarks, setAstMarks] = useState("100");
    const [astUrl, setAstUrl] = useState("");
    const [isSavingAst, setIsSavingAst] = useState(false);

    // Live class form
    const [lcClass, setLcClass] = useState("");
    const [lcSubject, setLcSubject] = useState("");
    const [lcTopic, setLcTopic] = useState("");
    const [lcTime, setLcTime] = useState("");
    const [lcDuration, setLcDuration] = useState("60");
    const [lcPlatform, setLcPlatform] = useState("Google Meet");
    const [lcUrl, setLcUrl] = useState("");
    const [isSavingLc, setIsSavingLc] = useState(false);

    // Chat
    const [chatThread, setChatThread] = useState<any>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState("");
    const [isSendingMsg, setIsSendingMsg] = useState(false);
    const [isLoadingChat, setIsLoadingChat] = useState(false);

    const fetchData = useCallback(async () => {
        if (!teacher) return;
        setIsLoadingData(true);
        try {
            const [matRes, astRes, lcRes] = await Promise.all([
                getTeacherMaterials(teacher.id),
                getTeacherAssignments(teacher.id),
                getTeacherLiveClasses(teacher.id),
            ]);
            setMaterials(matRes || []);
            setAssignments(astRes || []);
            setLiveClasses(lcRes || []);
        } catch (e) { console.error(e); }
        setIsLoadingData(false);
    }, [teacher]);

    const loadChat = useCallback(async () => {
        if (!teacher) return;
        setIsLoadingChat(true);
        try {
            const thread = await getOrCreateTeacherAdminThread(teacher.id);
            setChatThread(thread);
            const msgs = await getTeacherAdminMessages(thread.id);
            setChatMessages(msgs);
        } catch (e) { console.error(e); }
        setIsLoadingChat(false);
    }, [teacher]);

    useEffect(() => {
        getTeacherSession().then(res => {
            if (res.success && res.data) setTeacher(res.data);
            setIsLoadingInit(false);
        });
    }, []);

    useEffect(() => {
        if (teacher) fetchData();
    }, [teacher, fetchData]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoggingIn(true);
        const res = await loginTeacher(idInput, passInput);
        if (res.success && res.data) {
            const sess = await getTeacherSession();
            if (sess.success && sess.data) setTeacher(sess.data as Teacher);
            toast({ title: `Welcome, ${res.data.name}!` });
        } else {
            toast({ title: "Login Failed", description: res.error, variant: "destructive" });
        }
        setIsLoggingIn(false);
    };

    const handleLogout = async () => {
        await logoutTeacher();
        setTeacher(null);
        setMaterials([]); setAssignments([]); setLiveClasses([]);
    };

    // Pre-fill class from teacher profile
    const myClass = teacher?.assigned_class || "";
    const mySubject = teacher?.subject || "";

    const handlePostMaterial = async () => {
        if (!teacher) return;
        if (!matClass || !matTitle || !matUrl || !matSubject) {
            toast({ title: "Fill all required fields", variant: "destructive" }); return;
        }
        setIsSavingMat(true);
        try {
            await createTeacherMaterial({
                teacher_id: teacher.id, class_name: matClass, subject: matSubject,
                title: matTitle, description: matDesc, material_type: matType as any, file_url: matUrl
            });
            toast({ title: "Material posted!" });
            setMatTitle(""); setMatDesc(""); setMatUrl("");
            fetchData();
        } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
        setIsSavingMat(false);
    };

    const handlePostAssignment = async () => {
        if (!teacher) return;
        if (!astClass || !astTitle || !astDue || !astSubject) {
            toast({ title: "Fill all required fields", variant: "destructive" }); return;
        }
        setIsSavingAst(true);
        try {
            await createTeacherAssignment({
                teacher_id: teacher.id, class_name: astClass, subject: astSubject,
                title: astTitle, description: astDesc, due_date: new Date(astDue).toISOString(),
                max_marks: parseInt(astMarks), attachment_url: astUrl
            });
            toast({ title: "Assignment created!" });
            setAstTitle(""); setAstDesc(""); setAstUrl(""); setAstDue("");
            fetchData();
        } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
        setIsSavingAst(false);
    };

    const handlePostLiveClass = async () => {
        if (!teacher) return;
        if (!lcClass || !lcTopic || !lcTime || !lcUrl || !lcSubject) {
            toast({ title: "Fill all required fields", variant: "destructive" }); return;
        }
        setIsSavingLc(true);
        try {
            await createTeacherLiveClass({
                teacher_id: teacher.id, class_name: lcClass, subject: lcSubject,
                topic: lcTopic, scheduled_at: new Date(lcTime).toISOString(),
                duration_minutes: parseInt(lcDuration), platform: lcPlatform, meeting_url: lcUrl
            });
            toast({ title: "Live class scheduled!" });
            setLcTopic(""); setLcTime(""); setLcUrl("");
            fetchData();
        } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
        setIsSavingLc(false);
    };



    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!chatInput.trim() || !chatThread || isSendingMsg) return;
        setIsSendingMsg(true);
        const msg = chatInput;
        setChatInput("");
        try {
            await sendTeacherAdminMessage(chatThread.id, 'teacher', msg);
            loadChat(); // Reload to get the new message
        } catch (e: any) {
            toast({ title: "Error sending message", description: e.message, variant: "destructive" });
        }
        setIsSendingMsg(false);
    };

    if (isLoadingInit) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    // ── LOGIN ──────────────────────────────────
    if (!teacher) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl border-0 bg-white/5 backdrop-blur-sm ring-1 ring-white/10">
                <CardHeader className="text-center space-y-3 pb-8">
                    <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto ring-1 ring-indigo-500/30">
                        <Lock className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl font-black text-white">Teacher Portal</CardTitle>
                    <CardDescription className="text-slate-400">Login with your Teacher ID and password</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input className="h-12 bg-white/10 border-white/10 text-white placeholder:text-slate-500 uppercase" placeholder="Teacher ID (e.g. RK-TCH-001)" value={idInput} onChange={e => setIdInput(e.target.value.toUpperCase())} />
                        <Input className="h-12 bg-white/10 border-white/10 text-white placeholder:text-slate-500" type="password" placeholder="Password" value={passInput} onChange={e => setPassInput(e.target.value)} />
                        <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-base font-bold" type="submit" disabled={isLoggingIn}>
                            {isLoggingIn ? "Authenticating..." : "Sign In"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );

    // ── DASHBOARD ──────────────────────────────
    const tabs = [
        { id: "dashboard", icon: BookOpen, label: "Overview" },
        { id: "materials", icon: Library, label: "Materials" },
        { id: "assignments", icon: ClipboardList, label: "Assignments" },
        { id: "live", icon: Video, label: "Live Classes" },
        { id: "chat", icon: MessageCircle, label: "Admin Chat" },
    ];

    const ClassInput = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
        <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-muted-foreground">Class / Course</label>
            <Input placeholder={`e.g. ${myClass || 'Class 11'}`} value={value} onChange={e => onChange(e.target.value)} />
            {myClass && !value && <p className="text-xs text-indigo-500 cursor-pointer hover:underline" onClick={() => onChange(myClass)}>Click to use your class: <strong>{myClass}</strong></p>}
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-slate-900 text-slate-300 md:min-h-screen shrink-0 flex flex-col">
                <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center gap-3">
                    <GraduationCap className="h-7 w-7 text-indigo-400" />
                    <span className="text-base font-black tracking-tight text-white">Teacher Portal</span>
                </div>
                <div className="p-5 border-b border-slate-800">
                    {teacher.photo_url ? (
                        <img src={teacher.photo_url} alt={teacher.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-500/40 mb-3" />
                    ) : (
                        <div className="w-14 h-14 rounded-full bg-indigo-500/20 text-indigo-400 font-black text-xl flex items-center justify-center mb-3">{teacher.name[0]}</div>
                    )}
                    <div className="font-bold text-white">{teacher.name}</div>
                    <div className="text-xs font-mono text-indigo-400 mt-0.5">{teacher.teacher_id}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                        <Badge variant="outline" className="text-xs bg-slate-800 text-slate-300 border-slate-700">{teacher.subject}</Badge>
                        {myClass && <Badge variant="outline" className="text-xs bg-indigo-900/40 text-indigo-300 border-indigo-700">{myClass}</Badge>}
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {tabs.map(tab => (
                        <button key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                if (tab.id === 'chat') loadChat();
                            }}
                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-medium ${activeTab === tab.id ? "bg-indigo-600 text-white" : "hover:bg-slate-800 text-slate-400 hover:text-white"}`}>
                            <div className="flex items-center gap-3"><tab.icon className="w-5 h-5" /> {tab.label}</div>
                            {activeTab === tab.id && <ChevronRight className="w-4 h-4 opacity-50" />}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors font-medium">
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
                {isLoadingData && <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>}

                {/* ── Overview ── */}
                {!isLoadingData && activeTab === "dashboard" && (
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Good day, {teacher.name.split(' ')[0]}! 👋</h1>
                            <p className="text-slate-500 mt-1">Manage your class content and assignments from here.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            {[
                                { label: "Materials Posted", count: materials.length, icon: Library, color: "bg-emerald-600" },
                                { label: "Assignments Created", count: assignments.length, icon: ClipboardList, color: "bg-amber-500" },
                                { label: "Live Classes Scheduled", count: liveClasses.length, icon: Video, color: "bg-indigo-600" },
                            ].map(s => (
                                <Card key={s.label} className={`${s.color} text-white border-0 shadow-lg`}>
                                    <CardContent className="p-6">
                                        <s.icon className="w-7 h-7 opacity-70 mb-3" />
                                        <div className="text-3xl font-black">{s.count}</div>
                                        <div className="text-sm font-medium opacity-80 mt-1">{s.label}</div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Recent Materials */}
                        <Card className="shadow-sm">
                            <CardHeader><CardTitle className="text-base">Recent Materials</CardTitle></CardHeader>
                            <CardContent className="divide-y">
                                {materials.slice(0, 5).map(m => (
                                    <div key={m.id} className="py-3 flex items-center justify-between gap-4">
                                        <div>
                                            <div className="font-semibold text-sm text-slate-900">{m.title}</div>
                                            <div className="text-xs text-slate-500">{m.class_name} · {m.subject} · {m.material_type}</div>
                                        </div>
                                        <a href={m.file_url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800">
                                            <LinkIcon className="w-4 h-4" />
                                        </a>
                                    </div>
                                ))}
                                {materials.length === 0 && <p className="text-sm text-slate-400 py-4 text-center">No materials yet.</p>}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* ── Materials ── */}
                {!isLoadingData && activeTab === "materials" && (
                    <div className="grid lg:grid-cols-5 gap-8">
                        <Card className="lg:col-span-2 h-fit shadow-sm">
                            <CardHeader><CardTitle>Post New Material</CardTitle><CardDescription>Video, PDF, or Link for your class</CardDescription></CardHeader>
                            <CardContent className="space-y-4">
                                <ClassInput value={matClass} onChange={setMatClass} />
                                <div className="space-y-1"><label className="text-xs font-bold uppercase text-muted-foreground">Subject</label>
                                    <Input placeholder={mySubject || "Subject"} value={matSubject} onChange={e => setMatSubject(e.target.value)} /></div>
                                <div className="space-y-1"><label className="text-xs font-bold uppercase text-muted-foreground">Title</label>
                                    <Input placeholder="e.g. Chapter 3 - Integration" value={matTitle} onChange={e => setMatTitle(e.target.value)} /></div>
                                <div className="space-y-1"><label className="text-xs font-bold uppercase text-muted-foreground">Description</label>
                                    <Input placeholder="Brief notes (optional)" value={matDesc} onChange={e => setMatDesc(e.target.value)} /></div>
                                <div className="space-y-1"><label className="text-xs font-bold uppercase text-muted-foreground">Type</label>
                                    <Select value={matType} onValueChange={setMatType}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {['Video', 'PDF', 'Link', 'Notes'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1"><label className="text-xs font-bold uppercase text-muted-foreground">URL / Link</label>
                                    <Input placeholder="YouTube, Drive, or PDF link" value={matUrl} onChange={e => setMatUrl(e.target.value)} /></div>
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={handlePostMaterial} disabled={isSavingMat}>
                                    {isSavingMat ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />} Post Material
                                </Button>
                            </CardContent>
                        </Card>
                        <div className="lg:col-span-3 space-y-4">
                            <h2 className="font-bold text-xl text-slate-900">Your Materials ({materials.length})</h2>
                            {materials.map(m => (
                                <Card key={m.id} className="shadow-sm">
                                    <CardContent className="p-5 flex items-center justify-between gap-4">
                                        <div className="flex gap-4 flex-1 min-w-0">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                                {m.material_type === 'Video' ? <Video className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-slate-900 truncate">{m.title}</div>
                                                <div className="flex gap-2 mt-1 flex-wrap">
                                                    <Badge variant="outline" className="text-xs">{m.class_name}</Badge>
                                                    <Badge variant="outline" className="text-xs bg-slate-50">{m.subject}</Badge>
                                                    <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700">{m.material_type}</Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <a href={m.file_url} target="_blank" rel="noreferrer">
                                                <Button variant="outline" size="sm" className="h-8 text-indigo-600"><LinkIcon className="w-4 h-4" /></Button>
                                            </a>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-rose-500" onClick={async () => { if (confirm("Delete this material?")) { await deleteTeacherMaterial(m.id); fetchData(); } }}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {materials.length === 0 && <div className="text-center p-12 text-slate-400 bg-white border-2 border-dashed rounded-2xl">No materials posted yet.</div>}
                        </div>
                    </div>
                )}

                {/* ── Assignments ── */}
                {!isLoadingData && activeTab === "assignments" && (
                    <div className="grid lg:grid-cols-5 gap-8">
                        <Card className="lg:col-span-2 h-fit shadow-sm">
                            <CardHeader><CardTitle>Create Assignment</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <ClassInput value={astClass} onChange={setAstClass} />
                                <div className="space-y-1"><label className="text-xs font-bold uppercase text-muted-foreground">Subject</label>
                                    <Input placeholder={mySubject || "Subject"} value={astSubject} onChange={e => setAstSubject(e.target.value)} /></div>
                                <div className="space-y-1"><label className="text-xs font-bold uppercase text-muted-foreground">Title</label>
                                    <Input placeholder="Assignment Title" value={astTitle} onChange={e => setAstTitle(e.target.value)} /></div>
                                <div className="space-y-1"><label className="text-xs font-bold uppercase text-muted-foreground">Instructions</label>
                                    <Input placeholder="What students need to do" value={astDesc} onChange={e => setAstDesc(e.target.value)} /></div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1"><label className="text-xs font-bold uppercase text-muted-foreground">Due Date</label>
                                        <Input type="datetime-local" value={astDue} onChange={e => setAstDue(e.target.value)} /></div>
                                    <div className="space-y-1"><label className="text-xs font-bold uppercase text-muted-foreground">Marks</label>
                                        <Input type="number" value={astMarks} onChange={e => setAstMarks(e.target.value)} /></div>
                                </div>
                                <div className="space-y-1"><label className="text-xs font-bold uppercase text-muted-foreground">Attachment (Optional)</label>
                                    <Input placeholder="PDF or Drive link" value={astUrl} onChange={e => setAstUrl(e.target.value)} /></div>
                                <Button className="w-full bg-amber-500 hover:bg-amber-600" onClick={handlePostAssignment} disabled={isSavingAst}>
                                    {isSavingAst ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />} Create Assignment
                                </Button>
                            </CardContent>
                        </Card>
                        <div className="lg:col-span-3 space-y-4">
                            <h2 className="font-bold text-xl text-slate-900">Your Assignments ({assignments.length})</h2>
                            {assignments.map(ast => (
                                <Card key={ast.id} className="shadow-sm">
                                    <CardContent className="p-5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="font-bold text-slate-900">{ast.title}</div>
                                                <div className="text-sm text-slate-600 mt-1">{ast.description}</div>
                                                <div className="flex gap-2 mt-2 flex-wrap">
                                                    <Badge variant="outline" className="text-xs">{ast.class_name}</Badge>
                                                    <Badge variant="outline" className="text-xs">{ast.subject}</Badge>
                                                    <Badge variant="outline" className="text-xs text-rose-600">Due: {new Date(ast.due_date).toLocaleDateString()}</Badge>
                                                    <Badge variant="outline" className="text-xs">{ast.max_marks} pts</Badge>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-rose-500 shrink-0" onClick={async () => { if (confirm("Delete?")) { await deleteTeacherAssignment(ast.id); fetchData(); } }}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {assignments.length === 0 && <div className="text-center p-12 text-slate-400 bg-white border-2 border-dashed rounded-2xl">No assignments created yet.</div>}
                        </div>
                    </div>
                )}

                {/* ── Live Classes ── */}
                {!isLoadingData && activeTab === "live" && (
                    <div className="grid lg:grid-cols-5 gap-8">
                        <Card className="lg:col-span-2 h-fit shadow-sm">
                            <CardHeader><CardTitle>Schedule Live Class</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <ClassInput value={lcClass} onChange={setLcClass} />
                                <div className="space-y-1"><label className="text-xs font-bold uppercase text-muted-foreground">Subject</label>
                                    <Input placeholder={mySubject || "Subject"} value={lcSubject} onChange={e => setLcSubject(e.target.value)} /></div>
                                <div className="space-y-1"><label className="text-xs font-bold uppercase text-muted-foreground">Topic</label>
                                    <Input placeholder="e.g. Algebra Basics" value={lcTopic} onChange={e => setLcTopic(e.target.value)} /></div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1"><label className="text-xs font-bold uppercase text-muted-foreground">Date & Time</label>
                                        <Input type="datetime-local" value={lcTime} onChange={e => setLcTime(e.target.value)} /></div>
                                    <div className="space-y-1"><label className="text-xs font-bold uppercase text-muted-foreground">Duration (min)</label>
                                        <Input type="number" value={lcDuration} onChange={e => setLcDuration(e.target.value)} /></div>
                                </div>
                                <div className="space-y-1"><label className="text-xs font-bold uppercase text-muted-foreground">Platform</label>
                                    <Select value={lcPlatform} onValueChange={setLcPlatform}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {['Zoom', 'Google Meet', 'Microsoft Teams', 'Other'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1"><label className="text-xs font-bold uppercase text-muted-foreground">Meeting Link</label>
                                    <Input placeholder="Zoom or Meet URL" value={lcUrl} onChange={e => setLcUrl(e.target.value)} /></div>
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={handlePostLiveClass} disabled={isSavingLc}>
                                    {isSavingLc ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />} Schedule Class
                                </Button>
                            </CardContent>
                        </Card>
                        <div className="lg:col-span-3 space-y-4">
                            <h2 className="font-bold text-xl text-slate-900">Scheduled Classes ({liveClasses.length})</h2>
                            {liveClasses.map(lc => (
                                <Card key={lc.id} className="shadow-sm">
                                    <CardContent className="p-5 flex items-center justify-between gap-4">
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                                <Video className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">{lc.subject}: {lc.topic}</div>
                                                <div className="flex gap-2 mt-1 flex-wrap">
                                                    <Badge variant="outline" className="text-xs">{lc.class_name}</Badge>
                                                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">{lc.platform}</Badge>
                                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" /> {new Date(lc.scheduled_at).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <a href={lc.meeting_url} target="_blank" rel="noreferrer">
                                                <Button size="sm" className="h-8 bg-indigo-600 hover:bg-indigo-700">Join</Button>
                                            </a>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-rose-500" onClick={async () => { if (confirm("Delete?")) { await deleteTeacherLiveClass(lc.id); fetchData(); } }}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {liveClasses.length === 0 && <div className="text-center p-12 text-slate-400 bg-white border-2 border-dashed rounded-2xl">No live classes scheduled yet.</div>}
                        </div>
                    </div>
                )}
                {/* ── Admin Chat ── */}
                {!isLoadingData && activeTab === "chat" && (
                    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[800px]">
                        <div className="flex items-center justify-between mb-4 pb-4 border-b">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                                    <MessageCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-slate-900">Admin Chat</h2>
                                    <p className="text-xs text-slate-500">Internal communication with institutional administrators</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={loadChat} disabled={isLoadingChat}>
                                <RefreshCw className={`w-4 h-4 ${isLoadingChat ? 'animate-spin' : ''}`} />
                            </Button>
                        </div>

                        <div className="flex-1 bg-white rounded-2xl border shadow-sm flex flex-col overflow-hidden">
                            {/* Messages area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {isLoadingChat ? (
                                    <div className="flex items-center justify-center h-full"><Loader2 className="w-6 h-6 animate-spin text-slate-300" /></div>
                                ) : chatMessages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
                                        <MessageCircle className="w-12 h-12 opacity-20" />
                                        <p className="text-sm font-medium">No institutional messages yet.</p>
                                        <p className="text-xs">Start a conversation with admin regarding academic or administrative matters.</p>
                                    </div>
                                ) : (
                                    chatMessages.map(m => (
                                        <div key={m.id} className={`flex ${m.sender_role === 'teacher' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${m.sender_role === 'teacher'
                                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                                : 'bg-slate-100 text-slate-800 rounded-tl-none'
                                                }`}>
                                                <div className="font-bold text-[10px] uppercase opacity-70 mb-1">
                                                    {m.sender_role === 'teacher' ? 'You' : 'Admin'}
                                                </div>
                                                <div className="leading-relaxed whitespace-pre-wrap">{m.message}</div>
                                                <div className="text-[9px] mt-1 opacity-50 text-right">
                                                    {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Input area */}
                            <div className="p-4 bg-slate-50 border-t">
                                <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
                                    <Input
                                        className="h-12 bg-white border-slate-200 text-slate-900 rounded-xl pr-14"
                                        placeholder="Type your message to admin..."
                                        value={chatInput}
                                        onChange={e => setChatInput(e.target.value)}
                                        disabled={isSendingMsg || !chatThread}
                                    />
                                    <Button
                                        size="icon"
                                        className="absolute right-1.5 h-9 w-9 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                                        type="submit"
                                        disabled={isSendingMsg || !chatInput.trim() || !chatThread}
                                    >
                                        {isSendingMsg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    </Button>
                                </form>
                                <p className="text-[10px] text-slate-400 mt-2 text-center uppercase tracking-wider font-bold">Press Enter to Send</p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
