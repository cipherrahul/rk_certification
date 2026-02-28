"use client";

import { useState, useEffect, useRef } from "react";
import {
    MessageCircle, Send, RefreshCw, CheckCircle2, Loader2,
    ChevronRight, Search, Circle, Clock, ShieldCheck, GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
    getAllTeacherAdminThreads,
    getTeacherAdminMessages,
    sendTeacherAdminMessage,
    updateTeacherAdminThreadStatus
} from "@/app/actions/teacher-portal";

interface TeacherThread {
    id: string;
    teacher_id: string;
    subject: string;
    status: 'Open' | 'Resolved';
    created_at: string;
    updated_at: string;
    teachers?: {
        name: string;
        teacher_id: string;
        department: string;
        photo_url: string | null;
    };
}

interface TeacherMessage {
    id: string;
    thread_id: string;
    sender_role: 'teacher' | 'admin';
    message: string;
    created_at: string;
}

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
    const initials = name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'T';
    const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : size === "lg" ? "w-12 h-12 text-base" : "w-9 h-9 text-sm";
    return (
        <div className={`${sizeClass} rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black shrink-0 shadow-md`}>
            {initials}
        </div>
    );
}

export default function AdminTeacherSupport() {
    const { toast } = useToast();
    const [threads, setThreads] = useState<TeacherThread[]>([]);
    const [activeThread, setActiveThread] = useState<TeacherThread | null>(null);
    const [messages, setMessages] = useState<TeacherMessage[]>([]);
    const [reply, setReply] = useState("");
    const [isLoadingThreads, setIsLoadingThreads] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => { loadThreads(); }, []);
    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const loadThreads = async () => {
        setIsLoadingThreads(true);
        try {
            const data = await getAllTeacherAdminThreads();
            setThreads(data || []);
        } catch (e: any) {
            toast({ title: "Error loading threads", description: e.message, variant: "destructive" });
        }
        setIsLoadingThreads(false);
    };

    const openThread = async (thread: TeacherThread) => {
        setActiveThread(thread);
        setIsLoadingMessages(true);
        try {
            const msgs = await getTeacherAdminMessages(thread.id);
            setMessages(msgs || []);
        } catch (e: any) {
            toast({ title: "Error loading messages", description: e.message, variant: "destructive" });
        }
        setIsLoadingMessages(false);
    };

    const handleSendReply = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!reply.trim() || !activeThread || isSending) return;
        setIsSending(true);
        try {
            await sendTeacherAdminMessage(activeThread.id, 'admin', reply);
            setReply("");
            const msgs = await getTeacherAdminMessages(activeThread.id);
            setMessages(msgs || []);
            loadThreads();
        } catch (e: any) {
            toast({ title: "Error sending reply", description: e.message, variant: "destructive" });
        }
        setIsSending(false);
    };

    const toggleStatus = async () => {
        if (!activeThread) return;
        const newStatus: 'Open' | 'Resolved' = activeThread.status === 'Open' ? 'Resolved' : 'Open';
        try {
            await updateTeacherAdminThreadStatus(activeThread.id, newStatus);
            setActiveThread({ ...activeThread, status: newStatus });
            loadThreads();
            toast({ title: `Thread marked as ${newStatus}` });
        } catch (e: any) {
            toast({ title: "Error updating status", description: e.message, variant: "destructive" });
        }
    };

    const filteredThreads = threads.filter(t => {
        const name = t.teachers?.name?.toLowerCase() ?? '';
        const dept = t.teachers?.department?.toLowerCase() ?? '';
        const q = searchQuery.toLowerCase();
        return name.includes(q) || dept.includes(q) || t.teachers?.teacher_id?.toLowerCase().includes(q);
    });

    const openCount = threads.filter(t => t.status === 'Open').length;
    const resolvedCount = threads.filter(t => t.status === 'Resolved').length;

    return (
        <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">

            {/* ─── Top Bar ─────────────────────────────────────── */}
            <div className="shrink-0 px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-violet-500" />
                        Teacher Communications
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">Internal institutional messaging with faculty members</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400">
                            <span className="text-base font-black">{openCount}</span> Open
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400">
                            <span className="text-base font-black">{resolvedCount}</span> Resolved
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={loadThreads} disabled={isLoadingThreads} className="h-8 px-3 text-xs gap-1.5">
                        <RefreshCw className={`w-3.5 h-3.5 ${isLoadingThreads ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* ─── Main Panel ──────────────────────────────────── */}
            <div className="flex-1 flex overflow-hidden">

                {/* Thread List */}
                <div className="w-80 shrink-0 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    {/* Search */}
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                            <input
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search teachers..."
                                className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-violet-400 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Thread Items */}
                    <div className="flex-1 overflow-y-auto">
                        {isLoadingThreads ? (
                            <div className="p-8 flex justify-center">
                                <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
                            </div>
                        ) : filteredThreads.length === 0 ? (
                            <div className="p-8 text-center text-sm text-slate-400">
                                {searchQuery ? "No matching teachers" : "No conversations found"}
                            </div>
                        ) : (
                            filteredThreads.map(thread => {
                                const isActive = activeThread?.id === thread.id;
                                const isOpen = thread.status === 'Open';
                                return (
                                    <button
                                        key={thread.id}
                                        onClick={() => openThread(thread)}
                                        className={`w-full text-left px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 group ${isActive ? 'bg-violet-50 dark:bg-violet-900/20 border-l-2 border-l-violet-500' : ''}`}
                                    >
                                        <Avatar name={thread.teachers?.name ?? 'T'} size="sm" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-1 mb-0.5">
                                                <span className={`text-sm font-bold truncate ${isActive ? 'text-violet-700 dark:text-violet-300' : 'text-slate-800 dark:text-slate-200'}`}>
                                                    {thread.teachers?.name ?? 'Unknown Teacher'}
                                                </span>
                                                <span className="text-[10px] text-slate-400 shrink-0">
                                                    {new Date(thread.updated_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Circle className={`w-1.5 h-1.5 shrink-0 fill-current ${isOpen ? 'text-amber-400' : 'text-emerald-500'}`} />
                                                <span className={`text-[11px] font-semibold ${isOpen ? 'text-amber-600' : 'text-emerald-600'}`}>{thread.status}</span>
                                                <span className="text-[10px] text-slate-400 truncate">· {thread.teachers?.department ?? 'Faculty'}</span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 shrink-0 transition-colors" />
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 min-w-0">
                    {!activeThread ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                            <div className="w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-4">
                                <MessageCircle className="w-8 h-8 text-violet-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">No Conversation Selected</h3>
                            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                                Select a teacher thread from the list to view or respond to their message.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <div className="shrink-0 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                    <Avatar name={activeThread.teachers?.name ?? 'T'} />
                                    <div className="min-w-0">
                                        <div className="font-bold text-slate-900 dark:text-white text-sm truncate">
                                            {activeThread.teachers?.name}
                                        </div>
                                        <div className="text-xs text-slate-400 font-mono truncate">
                                            {activeThread.teachers?.teacher_id} · {activeThread.teachers?.department}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className={`h-8 text-xs font-bold gap-1.5 ${activeThread.status === 'Open' ? 'text-emerald-600 border-emerald-200 hover:bg-emerald-50' : 'text-amber-600 border-amber-200 hover:bg-amber-50'}`}
                                        onClick={toggleStatus}
                                    >
                                        {activeThread.status === 'Open'
                                            ? <><CheckCircle2 className="w-3.5 h-3.5" /> Mark Resolved</>
                                            : <><RefreshCw className="w-3.5 h-3.5" /> Reopen</>
                                        }
                                    </Button>
                                    <Button
                                        variant="ghost" size="sm"
                                        className="h-8 w-8 p-0 text-slate-400 hover:text-slate-700"
                                        onClick={() => openThread(activeThread)}
                                    >
                                        <RefreshCw className={`w-4 h-4 ${isLoadingMessages ? 'animate-spin' : ''}`} />
                                    </Button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                                {isLoadingMessages ? (
                                    <div className="flex justify-center pt-12">
                                        <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 text-sm">
                                        <Clock className="w-8 h-8 mb-3 opacity-30" />
                                        No messages in this thread yet.
                                    </div>
                                ) : (
                                    <>
                                        {messages.map(m => {
                                            const isAdmin = m.sender_role === 'admin';
                                            return (
                                                <div key={m.id} className={`flex items-end gap-2.5 ${isAdmin ? 'flex-row-reverse' : 'flex-row'}`}>
                                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mb-1 ${isAdmin ? 'bg-violet-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                                                        {isAdmin
                                                            ? <ShieldCheck className="w-3.5 h-3.5 text-white" />
                                                            : <GraduationCap className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300" />
                                                        }
                                                    </div>
                                                    <div className={`max-w-[68%] space-y-1 flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                                                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${isAdmin
                                                            ? 'bg-violet-600 text-white rounded-br-sm'
                                                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-sm'
                                                            }`}>
                                                            {m.message}
                                                        </div>
                                                        <span className="text-[10px] text-slate-400 px-1">
                                                            {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={bottomRef} />
                                    </>
                                )}
                            </div>

                            {/* Reply Bar */}
                            <div className="shrink-0 px-5 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                                {activeThread.status === 'Resolved' ? (
                                    <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 rounded-xl px-4 py-3 border border-emerald-200 dark:border-emerald-800">
                                        <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400 font-semibold">
                                            <CheckCircle2 className="w-4 h-4" /> Thread marked as Resolved
                                        </div>
                                        <Button size="sm" variant="outline"
                                            className="h-7 text-xs border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                                            onClick={toggleStatus}>
                                            Reopen
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSendReply} className="flex items-center gap-3">
                                        <input
                                            className="flex-1 h-11 rounded-xl px-4 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-violet-400 transition-colors text-slate-900 dark:text-white placeholder:text-slate-400"
                                            placeholder="Type your reply and press Enter..."
                                            value={reply}
                                            onChange={e => setReply(e.target.value)}
                                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendReply(); } }}
                                        />
                                        <Button
                                            type="submit"
                                            className="h-11 w-11 p-0 rounded-xl bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-600/20 shrink-0"
                                            disabled={isSending || !reply.trim()}
                                        >
                                            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
