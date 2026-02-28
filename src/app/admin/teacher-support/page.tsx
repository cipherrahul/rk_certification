"use client";

import { useState, useEffect } from "react";
import {
    MessageCircle, Send, RefreshCw, CheckCircle2, Clock,
    Loader2, ChevronRight, UserCircle2, BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

export default function AdminTeacherSupport() {
    const { toast } = useToast();
    const [threads, setThreads] = useState<TeacherThread[]>([]);
    const [activeThread, setActiveThread] = useState<TeacherThread | null>(null);
    const [messages, setMessages] = useState<TeacherMessage[]>([]);
    const [reply, setReply] = useState("");
    const [isLoadingThreads, setIsLoadingThreads] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        loadThreads();
    }, []);

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

    const openThread = async (thread: any) => {
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
            // Refresh messages
            const msgs = await getTeacherAdminMessages(activeThread.id);
            setMessages(msgs || []);
            // Refresh threads list to update 'updated_at'
            loadThreads();
        } catch (e: any) {
            toast({ title: "Error sending reply", description: e.message, variant: "destructive" });
        }
        setIsSending(false);
    };

    const toggleStatus = async () => {
        if (!activeThread) return;
        const newStatus = activeThread.status === 'Open' ? 'Resolved' : 'Open';
        try {
            await updateTeacherAdminThreadStatus(activeThread.id, newStatus);
            setActiveThread({ ...activeThread, status: newStatus });
            loadThreads();
            toast({ title: `Thread marked as ${newStatus}` });
        } catch (e: any) {
            toast({ title: "Error updating status", description: e.message, variant: "destructive" });
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] container mx-auto p-4">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-black text-foreground tracking-tight">Teacher Communications</h1>
                    <p className="text-sm text-muted-foreground">Internal institutional talk with faculty members</p>
                </div>
                <Button variant="outline" size="sm" onClick={loadThreads} disabled={isLoadingThreads}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingThreads ? 'animate-spin' : ''}`} /> Refresh
                </Button>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Threads Sidebar */}
                <div className="w-80 flex flex-col gap-4">
                    <div className="bg-white rounded-2xl border shadow-sm flex-1 overflow-y-auto">
                        {isLoadingThreads ? (
                            <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-slate-300" /></div>
                        ) : threads.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-sm italic">No conversations found.</div>
                        ) : (
                            <div className="divide-y">
                                {threads.map(thread => (
                                    <button
                                        key={thread.id}
                                        onClick={() => openThread(thread)}
                                        className={`w-full text-left p-4 hover:bg-slate-50 transition-colors flex flex-col gap-1 ${activeThread?.id === thread.id ? 'bg-indigo-50/50 border-l-4 border-indigo-600' : ''}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-slate-900 truncate">
                                                {thread.teachers?.name || 'Unknown Teacher'}
                                            </span>
                                            <Badge variant="outline" className={`text-[10px] h-5 ${thread.status === 'Open' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-slate-400 bg-slate-50 border-slate-100'}`}>
                                                {thread.status}
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                            <BookOpen className="w-3 h-3" /> {thread.teachers?.department || 'Faculty'}
                                        </div>
                                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                                            <Clock className="w-3 h-3" /> Updated {new Date(thread.updated_at).toLocaleDateString()}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-white rounded-2xl border shadow-sm overflow-hidden">
                    {activeThread ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                        <UserCircle2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">{activeThread.teachers?.name}</div>
                                        <div className="text-xs text-slate-500">{activeThread.teachers?.teacher_id} · {activeThread.teachers?.department}</div>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={`h-8 font-bold ${activeThread.status === 'Open' ? 'text-emerald-600' : 'text-amber-600'}`}
                                    onClick={toggleStatus}
                                >
                                    {activeThread.status === 'Open' ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                                    Mark as {activeThread.status === 'Open' ? 'Resolved' : 'Open'}
                                </Button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/20">
                                {isLoadingMessages ? (
                                    <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-slate-300" /></div>
                                ) : (
                                    messages.map(m => (
                                        <div key={m.id} className={`flex ${m.sender_role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow-sm ${m.sender_role === 'admin'
                                                ? 'bg-slate-900 text-white rounded-tr-none'
                                                : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                                                }`}>
                                                <div className="font-bold text-[10px] uppercase opacity-70 mb-1">
                                                    {m.sender_role === 'admin' ? 'You (Admin)' : activeThread.teachers?.name}
                                                </div>
                                                <div className="leading-relaxed whitespace-pre-wrap">{m.message}</div>
                                                <div className="text-[9px] mt-1 opacity-50 text-right">
                                                    {new Date(m.created_at).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Reply Input */}
                            <div className="p-4 border-t bg-white">
                                <form onSubmit={handleSendReply} className="relative flex items-center gap-2">
                                    <Input
                                        className="h-14 bg-slate-50 border-slate-200 text-slate-900 rounded-xl pr-16 focus-visible:ring-indigo-500"
                                        placeholder="Type your reply to the teacher..."
                                        value={reply}
                                        onChange={e => setReply(e.target.value)}
                                        disabled={isSending || activeThread.status === 'Resolved'}
                                    />
                                    <Button
                                        size="icon"
                                        className="absolute right-2 h-10 w-10 bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-lg"
                                        type="submit"
                                        disabled={isSending || !reply.trim() || activeThread.status === 'Resolved'}
                                    >
                                        {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                    </Button>
                                </form>
                                {activeThread.status === 'Resolved' && (
                                    <p className="text-xs text-amber-600 mt-2 text-center font-medium">This thread is marked as resolved. Reopen to send messages.</p>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-12 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <MessageCircle className="w-8 h-8 opacity-20" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-600">Institutional Messenger</h3>
                            <p className="text-sm max-w-xs mt-2">Select a teacher from the left to view or start an institutional conversation.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
