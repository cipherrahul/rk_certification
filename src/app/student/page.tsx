"use client";

import { useState, useEffect, useRef } from "react";
import {
    GraduationCap, LogOut, Video, Library, ClipboardList, Target,
    Calendar, Clock, Link as LinkIcon, FileText, ChevronRight, Lock, MessageCircle, Send, RefreshCw, BookOpen, Download, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { StudentIDCard } from "@/components/students/StudentIDCard";
import { FeeReceiptView } from "@/components/students/FeeReceiptView";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
    loginStudent, logoutStudent, getStudentSession,
    getLiveClasses, getStudyMaterials, getAssignments, getOnlineTests,
    getOrCreateSupportThread, getSupportMessages, sendSupportMessage,
    getStudentFeePayments,
    getTeachersForStudent
} from "@/app/actions/learning";
import {
    getTeacherMaterials, getTeacherAssignments, getTeacherLiveClasses,
    getOrCreateTeacherStudentThread, getTeacherStudentMessages, sendTeacherStudentMessage
} from "@/app/actions/teacher-portal";

export default function StudentPortal() {
    const { toast } = useToast();

    // Auth State
    const [isLoadingInit, setIsLoadingInit] = useState(true);
    const [student, setStudent] = useState<any>(null);
    const [studentIdInput, setStudentIdInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // active tab
    const [activeTab, setActiveTab] = useState("dashboard");

    // Data state
    const [liveClasses, setLiveClasses] = useState<any[]>([]);
    const [materials, setMaterials] = useState<any[]>([]);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [tests, setTests] = useState<any[]>([]);
    const [feePayments, setFeePayments] = useState<any[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [isDownloading, setIsDownloading] = useState<string | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    // Support Chat State
    const [supportThread, setSupportThread] = useState<any>(null);
    const [supportMessages, setSupportMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const [isLoadingChat, setIsLoadingChat] = useState(false);

    // Teacher Class Content State
    const [classMaterials, setClassMaterials] = useState<any[]>([]);
    const [classAssignments, setClassAssignments] = useState<any[]>([]);
    const [classLiveClasses, setClassLiveClasses] = useState<any[]>([]);

    // Teacher Chat State
    const [teachers, setTeachers] = useState<any[]>([]);
    const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
    const [teacherChatThread, setTeacherChatThread] = useState<any>(null);
    const [teacherChatMessages, setTeacherChatMessages] = useState<any[]>([]);
    const [teacherChatInput, setTeacherChatInput] = useState("");
    const [isSendingTeacherMsg, setIsSendingTeacherMsg] = useState(false);
    const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);
    const [isLoadingTeacherChat, setIsLoadingTeacherChat] = useState(false);

    // Initialization: check session
    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await getStudentSession();
                if (res.success && res.data) {
                    setStudent(res.data);
                }
            } catch (e) {
                console.error(e);
            }
            setIsLoadingInit(false);
        };
        checkSession();
    }, []);

    // Fetch data when student changes
    useEffect(() => {
        if (student) {
            const fetchPortalData = async () => {
                setIsLoadingData(true);
                try {
                    // Use course_id if available, otherwise load all and let students see everything
                    const courseFilter = student.course_id || null;
                    const [liveRes, matRes, assignRes, testRes, feeRes] = await Promise.all([
                        getLiveClasses(courseFilter),
                        getStudyMaterials(courseFilter),
                        getAssignments(courseFilter),
                        getOnlineTests(courseFilter),
                        getStudentFeePayments(student.id)
                    ]);
                    setLiveClasses(liveRes || []);
                    setMaterials(matRes || []);
                    setAssignments(assignRes || []);
                    setTests(testRes || []);
                    setFeePayments(feeRes || []);

                    // Teacher class-specific content
                    const studentClass = student.course || null;
                    if (studentClass) {
                        const [tMat, tAst, tLc] = await Promise.all([
                            getTeacherMaterials(undefined, studentClass),
                            getTeacherAssignments(undefined, studentClass),
                            getTeacherLiveClasses(undefined, studentClass),
                        ]);
                        setClassMaterials(tMat || []);
                        setClassAssignments(tAst || []);
                        setClassLiveClasses(tLc || []);

                        setIsLoadingTeachers(true);
                        const tchrs = await getTeachersForStudent(studentClass);
                        setTeachers(tchrs || []);
                        setIsLoadingTeachers(false);
                    }
                } catch (error) {
                    console.error(error);
                }
                setIsLoadingData(false);
            };
            fetchPortalData();
        }
    }, [student]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentIdInput || !passwordInput) {
            toast({ title: "Error", description: "Enter Student ID and Password", variant: "destructive" });
            return;
        }
        setIsLoggingIn(true);
        try {
            const res = await loginStudent(studentIdInput, passwordInput);
            if (res.success && res.data) {
                toast({ title: "Welcome back!", description: `Logged in as ${res.data.first_name}` });
                // We need to fetch course_id explicitly to populate the session perfectly
                const sessionRes = await getStudentSession();
                if (sessionRes.success) setStudent(sessionRes.data);
            } else {
                toast({ title: "Login Failed", description: res.error, variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "An unexpected error occurred", variant: "destructive" });
        }
        setIsLoggingIn(false);
    };

    const loadSupportChat = async (studentDbId: string) => {
        setIsLoadingChat(true);
        try {
            const thread = await getOrCreateSupportThread(studentDbId);
            setSupportThread(thread);
            const msgs = await getSupportMessages(thread.id);
            setSupportMessages(msgs || []);
        } catch (error) {
            console.error("Chat load error:", error);
        }
        setIsLoadingChat(false);
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !supportThread) return;
        setIsSendingMessage(true);
        const tempMsg = newMessage;
        setNewMessage("");
        try {
            await sendSupportMessage(supportThread.id, 'student', tempMsg);
            const msgs = await getSupportMessages(supportThread.id);
            setSupportMessages(msgs || []);
        } catch (error) {
            toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
            setNewMessage(tempMsg);
        }
        setIsSendingMessage(false);
    };

    const loadTeacherChat = async (teacherId: string) => {
        if (!student) return;
        setIsLoadingTeacherChat(true);
        try {
            const thread = await getOrCreateTeacherStudentThread(teacherId, student.id);
            setTeacherChatThread(thread);
            const msgs = await getTeacherStudentMessages(thread.id);
            setTeacherChatMessages(msgs || []);
        } catch (e) { console.error(e); }
        setIsLoadingTeacherChat(false);
    };

    const handleSendTeacherMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!teacherChatInput.trim() || !teacherChatThread || isSendingTeacherMsg) return;
        setIsSendingTeacherMsg(true);
        const msg = teacherChatInput;
        setTeacherChatInput("");
        try {
            await sendTeacherStudentMessage(teacherChatThread.id, 'student', msg);
            const msgs = await getTeacherStudentMessages(teacherChatThread.id);
            setTeacherChatMessages(msgs || []);
        } catch (e: any) {
            toast({ title: "Error sending message", description: e.message, variant: "destructive" });
            setTeacherChatInput(msg);
        }
        setIsSendingTeacherMsg(false);
    };

    const handleDownloadIDCard = async () => {
        if (!cardRef.current || !student) return;
        setIsDownloading("idcard");
        try {
            const canvas = await html2canvas(cardRef.current, {
                scale: 3,
                useCORS: true,
                backgroundColor: null,
            });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: [340, 210] });
            pdf.addImage(imgData, "PNG", 0, 0, 340, 210);
            pdf.save(`IDCard-${student.student_id}-${student.first_name}.pdf`);
            toast({ title: "Downloaded!", description: "ID Card saved as PDF." });
        } catch (e) {
            console.error("ID Card PDF generation failed:", e);
            toast({ title: "Download Failed", variant: "destructive" });
        }
        setIsDownloading(null);
    };

    const handleDownloadReceipt = async (paymentId: string) => {
        const el = document.getElementById(`receipt-${paymentId}`);
        if (!el || !student) return;
        // The FeeReceiptView already has a download button inside it,
        // but it's hidden or we can trigger it.
        // Actually FeeReceiptView has its own internal download logic.
        // We'll just let the user click the button in the view if they want,
        // BUT for better UX in "Downloads" tab, we should provide a direct button.
        // Let's just find the button inside it and click it or use its logic.
        const btn = el.querySelector('button');
        if (btn) (btn as HTMLButtonElement).click();
    };

    const handleLogout = async () => {
        setIsLoadingInit(true); // show loader
        await logoutStudent();
        setStudent(null);
        setLiveClasses([]);
        setMaterials([]);
        setAssignments([]);
        setTests([]);
        setIsLoadingInit(false);
        toast({ title: "Logged out successfully" });
    };

    if (isLoadingInit) {
        return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>;
    }

    // LOGIN SCREEN
    if (!student) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-xl border-0 ring-1 ring-slate-100">
                    <CardHeader className="text-center space-y-2 pb-8">
                        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Lock className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-2xl font-black tracking-tight text-slate-900">Student Portal</CardTitle>
                        <CardDescription>Sign in to access your classes and assignments</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500">Student ID</label>
                                <Input
                                    className="h-12 bg-slate-50 border-slate-200 uppercase"
                                    placeholder="e.g. RK2026STU001"
                                    value={studentIdInput}
                                    onChange={e => setStudentIdInput(e.target.value.toUpperCase())}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500">Password</label>
                                <Input
                                    className="h-12 bg-slate-50 border-slate-200"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={passwordInput}
                                    onChange={e => setPasswordInput(e.target.value)}
                                />
                            </div>
                            <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-base font-bold" type="submit" disabled={isLoggingIn}>
                                {isLoggingIn ? "Authenticating..." : "Sign In to Portal"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // DASHBOARD APPLICATION
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Restriction Overlay */}
            {student?.is_restricted && (
                <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-6 text-center">
                    <Card className="max-w-md border-0 shadow-2xl bg-white animate-in zoom-in-95 duration-300">
                        <CardContent className="p-8 pt-10 flex flex-col items-center">
                            <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <Lock className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Access Restricted</h2>
                            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                                Your access to the student portal has been temporarily restricted by the academic administration.
                                Please contact your course teacher or the administration office for more information.
                            </p>
                            <Button
                                variant="outline"
                                className="w-full border-2 hover:bg-slate-50 font-bold"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-4 h-4 mr-2" /> Sign Out
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-slate-900 text-slate-300 md:min-h-screen shrink-0 flex flex-col">
                <div className="p-6 bg-slate-950 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <GraduationCap className="h-8 w-8 text-indigo-500" />
                        <span className="text-lg font-black tracking-tight text-white">RK Portal</span>
                    </div>
                </div>

                <div className="p-6 border-b border-slate-800">
                    {student.photo_url ? (
                        <img src={student.photo_url} alt={student.first_name} className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-500/40 mb-3" />
                    ) : (
                        <div className="w-14 h-14 rounded-full bg-indigo-500/20 text-indigo-400 font-black text-xl flex items-center justify-center mb-3">{student.first_name[0]}</div>
                    )}
                    <div className="font-bold text-white text-lg">{student.first_name} {student.last_name}</div>
                    <div className="text-sm font-mono text-indigo-400 mt-1">{student.student_id}</div>
                    <Badge variant="outline" className="mt-3 bg-slate-800 text-slate-300 border-slate-700">Course: {student.course || 'Unassigned'}</Badge>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {[
                        { id: "dashboard", icon: GraduationCap, label: "Dashboard" },
                        { id: "live", icon: Video, label: "Live Classes" },
                        { id: "materials", icon: Library, label: "Study Materials" },
                        { id: "assignments", icon: ClipboardList, label: "Assignments" },
                        { id: "tests", icon: Target, label: "Online Tests" },
                        { id: "class", icon: BookOpen, label: "My Class Content" },
                        { id: "teacher-chat", icon: MessageCircle, label: "Teacher Chat" },
                        { id: "fees", icon: Clock, label: "Fee Status" },
                        { id: "downloads", icon: Download, label: "Downloads" },
                        { id: "support", icon: RefreshCw, label: "Support Chat" },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                if (tab.id === 'support' && student && !supportThread) {
                                    loadSupportChat(student.id);
                                }
                            }}
                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-medium ${activeTab === tab.id
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/20"
                                : "hover:bg-slate-800 text-slate-400 hover:text-white"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <tab.icon className="w-5 h-5" /> {tab.label}
                            </div>
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

            {/* Main Content Area */}
            <main className="flex-1 p-6 md:p-10 max-h-screen overflow-y-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight capitalize">
                        {activeTab.replace('-', ' ')}
                    </h1>
                    <p className="text-slate-500 font-medium">Your learning hub for {student.course || 'this session'}.</p>
                </header>

                {isLoadingData && (
                    <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>
                )}

                {!isLoadingData && activeTab === "dashboard" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="bg-indigo-600 text-white border-0 shadow-lg shadow-indigo-600/20">
                            <CardContent className="p-6">
                                <Video className="w-8 h-8 text-indigo-300 mb-4" />
                                <div className="text-3xl font-black mb-1">{liveClasses.length}</div>
                                <div className="text-sm font-medium text-indigo-200">Upcoming Live Classes</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-emerald-600 text-white border-0 shadow-lg shadow-emerald-600/20">
                            <CardContent className="p-6">
                                <Library className="w-8 h-8 text-emerald-300 mb-4" />
                                <div className="text-3xl font-black mb-1">{materials.length}</div>
                                <div className="text-sm font-medium text-emerald-200">Study Materials</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-amber-500 text-white border-0 shadow-lg shadow-amber-500/20">
                            <CardContent className="p-6">
                                <ClipboardList className="w-8 h-8 text-amber-200 mb-4" />
                                <div className="text-3xl font-black mb-1">{assignments.length}</div>
                                <div className="text-sm font-medium text-amber-100">Assignments</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-purple-600 text-white border-0 shadow-lg shadow-purple-600/20">
                            <CardContent className="p-6">
                                <Target className="w-8 h-8 text-purple-300 mb-4" />
                                <div className="text-3xl font-black mb-1">{tests.length}</div>
                                <div className="text-sm font-medium text-purple-200">Online Tests</div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {!isLoadingData && activeTab === "live" && (
                    <div className="grid gap-6">
                        {liveClasses.length === 0 ? (
                            <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-100">No scheduled live classes.</div>
                        ) : (
                            liveClasses.map(cls => (
                                <Card key={cls.id} className="shadow-sm hover:shadow-md transition-shadow">
                                    <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                                                <Video className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">{cls.subject}: {cls.topic}</h3>
                                                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500 font-medium">
                                                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(cls.scheduled_at).toLocaleDateString()}</span>
                                                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(cls.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    <Badge variant="outline">{cls.duration_minutes}m</Badge>
                                                    <Badge variant="outline" className="bg-blue-50 text-blue-700">{cls.platform}</Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <a href={cls.meeting_url} target="_blank" rel="noreferrer" className="w-full md:w-auto">
                                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold whitespace-nowrap">Join Class</Button>
                                        </a>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                )}

                {!isLoadingData && activeTab === "materials" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {materials.length === 0 ? (
                            <div className="col-span-full p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-100">No study materials uploaded yet.</div>
                        ) : (
                            materials.map(mat => (
                                <Card key={mat.id} className="shadow-sm hover:shadow-md transition-shadow group cursor-pointer bg-white" onClick={() => window.open(mat.file_url, '_blank')}>
                                    <div className="h-32 bg-slate-50 border-b flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-300 transition-colors">
                                        {mat.material_type === 'Video' ? <Video className="w-12 h-12" /> : <FileText className="w-12 h-12" />}
                                    </div>
                                    <CardContent className="p-5">
                                        <Badge variant="outline" className="mb-3 bg-slate-50">{mat.subject}</Badge>
                                        <h3 className="font-bold text-slate-900 line-clamp-2 mb-1 group-hover:text-indigo-600 transition-colors">{mat.title}</h3>
                                        <p className="text-sm text-slate-500 line-clamp-2 h-10">{mat.description}</p>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                )}

                {!isLoadingData && activeTab === "assignments" && (
                    <div className="grid gap-6">
                        {assignments.length === 0 ? (
                            <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-100">No assignments active. Relax!</div>
                        ) : (
                            assignments.map(ast => (
                                <Card key={ast.id} className="shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row justify-between gap-6 mb-6 pb-6 border-b border-slate-100">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-0">{ast.subject}</Badge>
                                                    <span className="text-sm font-semibold text-rose-500 flex items-center gap-1">
                                                        <Clock className="w-4 h-4" /> Due: {new Date(ast.due_date).toLocaleString()}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-900 mb-2">{ast.title}</h3>
                                                <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">{ast.description}</p>
                                            </div>
                                            <div className="flex flex-col items-end shrink-0">
                                                <div className="text-3xl font-black text-slate-800">{ast.max_marks}</div>
                                                <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Total Points</div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                            {ast.attachment_url ? (
                                                <a href={ast.attachment_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                                                    <FileText className="w-4 h-4" /> Download Prompt / Worksheet
                                                </a>
                                            ) : <div />}

                                            {/* Submission handling in UI (Simplified placeholder) */}
                                            <Button className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto" onClick={() => {
                                                const url = prompt("Enter your Google Drive / Doc link for submission:");
                                                if (url) {
                                                    toast({ title: "Feature simulated", description: "Submission flow will connect to actions API" });
                                                }
                                            }}>
                                                Submit Assignment Link
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                )}

                {!isLoadingData && activeTab === "tests" && (
                    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                        {tests.length === 0 ? (
                            <div className="col-span-full p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-100">No upcoming tests.</div>
                        ) : (
                            tests.map(test => (
                                <Card key={test.id} className="shadow-sm hover:border-purple-300 transition-colors border-2 border-transparent">
                                    <CardContent className="p-6">
                                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                                            <Target className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-1">{test.title}</h3>
                                        {test.description && <p className="text-sm text-slate-500 mb-4">{test.description}</p>}

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-slate-50 p-3 rounded-xl border">
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Time Limit</div>
                                                <div className="font-semibold text-slate-900">{test.duration_minutes} Mins</div>
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-xl border">
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pass Marks</div>
                                                <div className="font-semibold text-slate-900">{test.passing_marks} / {test.max_marks}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-pt-4 border-t border-slate-100 pt-4">
                                            <div className="text-xs font-medium text-slate-500">
                                                Avail: {new Date(test.start_time).toLocaleDateString()}
                                            </div>
                                            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => alert("Test UI taking interface will open here. Connecting to questions... ")}>
                                                Launch Test
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                )}

                {!isLoadingData && activeTab === "class" && (
                    <div className="space-y-10">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="font-black text-slate-900 text-lg">Class Content from Teachers</h2>
                                <p className="text-sm text-slate-500">Materials, assignments & classes uploaded by your teachers for <strong>{student.course}</strong></p>
                            </div>
                        </div>

                        {/* Teacher Live Classes */}
                        <section>
                            <h3 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2"><Video className="w-4 h-4 text-indigo-400" /> Teacher Live Classes</h3>
                            {classLiveClasses.length === 0 ? (
                                <div className="p-6 text-center text-slate-400 bg-white rounded-2xl border border-slate-100 text-sm">No live classes scheduled by teachers yet.</div>
                            ) : (
                                <div className="grid gap-4">
                                    {classLiveClasses.map(cls => (
                                        <Card key={cls.id} className="shadow-sm">
                                            <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div>
                                                    <div className="font-bold text-slate-900">{cls.subject}: {cls.topic}</div>
                                                    <div className="flex gap-2 mt-2 flex-wrap items-center text-xs text-slate-500">
                                                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">{cls.platform}</Badge>
                                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(cls.scheduled_at).toLocaleString()}</span>
                                                        {cls.teachers && <span className="text-indigo-600 font-semibold">· by {cls.teachers.name}</span>}
                                                    </div>
                                                </div>
                                                <a href={cls.meeting_url} target="_blank" rel="noreferrer" className="shrink-0">
                                                    <Button className="bg-indigo-600 hover:bg-indigo-700 w-full md:w-auto font-bold">Join Class</Button>
                                                </a>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Teacher Materials */}
                        <section>
                            <h3 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2"><Library className="w-4 h-4 text-emerald-500" /> Teacher Study Materials</h3>
                            {classMaterials.length === 0 ? (
                                <div className="p-6 text-center text-slate-400 bg-white rounded-2xl border border-slate-100 text-sm">No materials uploaded by teachers yet.</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {classMaterials.map(mat => (
                                        <Card key={mat.id} className="shadow-sm hover:shadow-md cursor-pointer group transition-shadow" onClick={() => window.open(mat.file_url, '_blank')}>
                                            <div className="h-24 bg-slate-50 border-b flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-300 transition-colors">
                                                {mat.material_type === 'Video' ? <Video className="w-9 h-9" /> : <FileText className="w-9 h-9" />}
                                            </div>
                                            <CardContent className="p-4">
                                                <Badge variant="outline" className="text-xs mb-2">{mat.subject}</Badge>
                                                <h4 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-indigo-600 transition-colors">{mat.title}</h4>
                                                {mat.teachers && <p className="text-xs text-indigo-500 font-semibold mt-1">by {mat.teachers.name}</p>}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Teacher Assignments */}
                        <section>
                            <h3 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2"><ClipboardList className="w-4 h-4 text-amber-500" /> Teacher Assignments</h3>
                            {classAssignments.length === 0 ? (
                                <div className="p-6 text-center text-slate-400 bg-white rounded-2xl border border-slate-100 text-sm">No assignments posted by teachers yet.</div>
                            ) : (
                                <div className="grid gap-4">
                                    {classAssignments.map(ast => (
                                        <Card key={ast.id} className="shadow-sm">
                                            <CardContent className="p-5 flex flex-col md:flex-row justify-between gap-4">
                                                <div>
                                                    <div className="flex gap-2 items-center mb-1">
                                                        <Badge className="bg-amber-100 text-amber-800 border-0 hover:bg-amber-100 text-xs">{ast.subject}</Badge>
                                                        <span className="text-xs text-rose-500 font-semibold flex items-center gap-1"><Clock className="w-3 h-3" /> Due: {new Date(ast.due_date).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="font-bold text-slate-900">{ast.title}</div>
                                                    {ast.description && <p className="text-sm text-slate-600 mt-1">{ast.description}</p>}
                                                    {ast.teachers && <p className="text-xs text-indigo-500 font-semibold mt-1">by {ast.teachers.name}</p>}
                                                </div>
                                                <div className="flex flex-col items-end gap-2 shrink-0">
                                                    <div className="text-xl font-black text-slate-800">{ast.max_marks}<span className="text-xs font-bold text-slate-400 ml-1">pts</span></div>
                                                    {ast.attachment_url && (
                                                        <a href={ast.attachment_url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
                                                            <FileText className="w-3 h-3" /> Download
                                                        </a>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                )}

                {!isLoadingData && activeTab === "downloads" && (
                    <div className="space-y-8">
                        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                            <Card className="shadow-lg border-0 bg-white p-6 flex flex-col items-center gap-4 shrink-0">
                                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">Student ID Card</h3>
                                <div className="border shadow-md rounded-xl overflow-hidden">
                                    <StudentIDCard ref={cardRef} student={student} />
                                </div>
                                <Button
                                    onClick={handleDownloadIDCard}
                                    disabled={isDownloading === "idcard"}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                                >
                                    {isDownloading === "idcard" ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                                    Download ID Card (PDF)
                                </Button>
                            </Card>

                            <div className="flex-1 space-y-4 w-full">
                                <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl">
                                    <h4 className="font-bold text-indigo-900 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-indigo-500" />
                                        Downloads Center
                                    </h4>
                                    <p className="text-sm text-indigo-700 mt-1">
                                        Access your institutional documents including your digital identity card and official fee receipts.
                                    </p>
                                </div>

                                <Card className="shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-xl">Fee Receipts</CardTitle>
                                        <CardDescription>View and download receipts for all your processed fee payments.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {feePayments.length === 0 ? (
                                            <div className="text-center py-12 text-slate-400">No fee payment records found.</div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Receipt No.</TableHead>
                                                            <TableHead>Date</TableHead>
                                                            <TableHead>Amount</TableHead>
                                                            <TableHead>Status</TableHead>
                                                            <TableHead className="text-right">Action</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {feePayments.map((payment: any) => (
                                                            <TableRow key={payment.id}>
                                                                <TableCell className="font-mono text-xs font-bold">{payment.receipt_number}</TableCell>
                                                                <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                                                                <TableCell className="font-bold text-indigo-600">₹{Number(payment.paid_amount).toLocaleString("en-IN")}</TableCell>
                                                                <TableCell>
                                                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                                                        Success
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleDownloadReceipt(payment.id)}
                                                                        className="text-indigo-600 hover:bg-indigo-50 font-bold"
                                                                    >
                                                                        <Download className="w-4 h-4 mr-2" />
                                                                        Receipt
                                                                    </Button>
                                                                    {/* Hidden Receipt for generation */}
                                                                    <div style={{ position: "absolute", left: "-9999px", top: "0", pointerEvents: "none" }}>
                                                                        <div id={`receipt-${payment.id}`}>
                                                                            <FeeReceiptView receipt={{ ...payment, students: student }} />
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                )}

                {!isLoadingData && activeTab === "teacher-chat" && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-140px)] max-h-[800px]">
                        <Card className="md:col-span-1 overflow-hidden flex flex-col">
                            <CardHeader className="p-4 border-b">
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Your Teachers ({teachers.length})</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 flex-1 overflow-y-auto">
                                {isLoadingTeachers ? (
                                    <div className="p-8 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-slate-300" /></div>
                                ) : (
                                    <div className="divide-y">
                                        {teachers.map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => {
                                                    setSelectedTeacher(t);
                                                    loadTeacherChat(t.id);
                                                }}
                                                className={`w-full p-4 flex items-center gap-3 transition-colors text-left ${selectedTeacher?.id === t.id ? 'bg-indigo-50 border-r-2 border-indigo-600' : 'hover:bg-slate-50'}`}
                                            >
                                                {t.photo_url ? (
                                                    <img src={t.photo_url} alt={t.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 uppercase font-bold text-slate-400 text-xs">{t.name[0]}</div>
                                                )}
                                                <div className="min-w-0">
                                                    <div className="font-bold text-sm text-slate-900 truncate">{t.name}</div>
                                                    <div className="text-[10px] text-slate-500 font-medium truncate">{t.subject}</div>
                                                </div>
                                            </button>
                                        ))}
                                        {teachers.length === 0 && <p className="p-8 text-center text-xs text-slate-400">No teachers assigned to your course.</p>}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="md:col-span-3 flex flex-col bg-white rounded-2xl border shadow-sm overflow-hidden">
                            {!selectedTeacher ? (
                                <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400 text-center">
                                    <MessageCircle className="w-16 h-16 opacity-10 mb-4" />
                                    <h3 className="font-bold text-lg text-slate-600">Ask Your Doubt</h3>
                                    <p className="max-w-xs text-sm">Select a teacher from the list to start chatting and clear your academic doubts directly.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="p-4 border-b flex items-center justify-between bg-slate-50/50">
                                        <div className="flex items-center gap-3">
                                            {selectedTeacher.photo_url ? (
                                                <img src={selectedTeacher.photo_url} alt={selectedTeacher.name} className="w-8 h-8 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">{selectedTeacher.name[0]}</div>
                                            )}
                                            <div>
                                                <div className="font-bold text-slate-900 text-sm">{selectedTeacher.name}</div>
                                                <div className="text-[10px] text-slate-500 uppercase font-black">{selectedTeacher.subject}</div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => loadTeacherChat(selectedTeacher.id)} disabled={isLoadingTeacherChat}>
                                            <RefreshCw className={`w-3 h-3 ${isLoadingTeacherChat ? 'animate-spin' : ''}`} />
                                        </Button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                        {isLoadingTeacherChat && teacherChatMessages.length === 0 ? (
                                            <div className="flex items-center justify-center h-full"><Loader2 className="w-6 h-6 animate-spin text-slate-200" /></div>
                                        ) : (
                                            teacherChatMessages.map(m => (
                                                <div key={m.id} className={`flex ${m.sender_role === 'student' ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${m.sender_role === 'student' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'}`}>
                                                        <div className="font-bold text-[9px] uppercase opacity-70 mb-1">{m.sender_role === 'student' ? 'You' : selectedTeacher.name}</div>
                                                        <div className="whitespace-pre-wrap leading-relaxed">{m.message}</div>
                                                        <div className="text-[9px] mt-1 opacity-50 text-right">{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                        {teacherChatMessages.length === 0 && !isLoadingTeacherChat && (
                                            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-40">
                                                <MessageCircle className="w-12 h-12 mb-2" />
                                                <p className="text-xs">No messages yet with this teacher.</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 bg-slate-50 border-t">
                                        <form onSubmit={handleSendTeacherMessage} className="relative flex items-center gap-2">
                                            <Input
                                                className="h-11 bg-white border-slate-200 text-slate-900 rounded-xl pr-12 text-sm"
                                                placeholder={`Ask a doubt to ${selectedTeacher.name}...`}
                                                value={teacherChatInput}
                                                onChange={e => setTeacherChatInput(e.target.value)}
                                                disabled={isSendingTeacherMsg}
                                            />
                                            <Button
                                                size="icon"
                                                className="absolute right-1.5 h-8 w-8 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                                                type="submit"
                                                disabled={isSendingTeacherMsg || !teacherChatInput.trim()}
                                            >
                                                {isSendingTeacherMsg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                            </Button>
                                        </form>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "support" && (
                    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[700px]">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                                    <MessageCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-slate-900">Support Chat</h2>
                                    <p className="text-xs text-slate-500">Ask questions or raise academic issues directly with admin</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {supportThread && (
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${supportThread.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                                        supportThread.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                            'bg-amber-100 text-amber-700'
                                        }`}>{supportThread.status}</span>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-slate-500"
                                    onClick={() => student && loadSupportChat(student.id)}
                                    disabled={isLoadingChat}
                                >
                                    <RefreshCw className={`w-4 h-4 ${isLoadingChat ? 'animate-spin' : ''}`} />
                                </Button>
                            </div>
                        </div>

                        {/* Chat Window */}
                        <div className="flex-1 bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
                            {isLoadingChat ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : !supportThread ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                                    <MessageCircle className="w-12 h-12 text-indigo-200 mb-4" />
                                    <h3 className="font-bold text-slate-700 text-lg mb-2">Start a Conversation</h3>
                                    <p className="text-slate-500 text-sm max-w-xs mb-6">Have a question for the admin? Send a message and they'll reply as soon as possible.</p>
                                    <Button
                                        className="bg-indigo-600 hover:bg-indigo-700"
                                        onClick={() => student && loadSupportChat(student.id)}
                                    >
                                        Open Support Chat
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    {/* Messages Area */}
                                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                                        {supportMessages.length === 0 ? (
                                            <div className="text-center p-8 text-slate-400 text-sm">
                                                No messages yet. Send your first message below!
                                            </div>
                                        ) : (
                                            supportMessages.map((msg) => (
                                                <div key={msg.id} className={`flex ${msg.sender_role === 'student' ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${msg.sender_role === 'student'
                                                        ? 'bg-indigo-600 text-white rounded-br-sm'
                                                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm'
                                                        }`}>
                                                        <div className="text-sm leading-relaxed">{msg.message}</div>
                                                        <div className={`text-xs mt-1.5 ${msg.sender_role === 'student' ? 'text-indigo-200' : 'text-slate-400'}`}>
                                                            {msg.sender_role === 'admin' && <span className="font-bold mr-1">Admin •</span>}
                                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(msg.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Input Area */}
                                    <div className="p-4 border-t border-slate-100 bg-white">
                                        {supportThread.status === 'Resolved' ? (
                                            <div className="text-center text-sm text-emerald-600 font-semibold py-2 bg-emerald-50 rounded-xl">
                                                ✓ This issue has been marked as resolved by admin.
                                            </div>
                                        ) : (
                                            <div className="flex gap-3">
                                                <Input
                                                    className="flex-1 h-12 bg-slate-50 border-slate-200 rounded-xl"
                                                    placeholder="Type your message here..."
                                                    value={newMessage}
                                                    onChange={e => setNewMessage(e.target.value)}
                                                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                                                />
                                                <Button
                                                    className="h-12 w-12 p-0 bg-indigo-600 hover:bg-indigo-700 rounded-xl shrink-0"
                                                    onClick={handleSendMessage}
                                                    disabled={isSendingMessage || !newMessage.trim()}
                                                >
                                                    <Send className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
