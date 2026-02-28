"use client";

import { useState, useEffect, useRef } from "react";
import {
    MessageCircle, Send, RefreshCw, CheckCircle2, Loader2,
    ChevronRight, Search, Circle, Clock, User, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getAllSupportThreads, getSupportMessages, sendSupportMessage, updateSupportThreadStatus } from "@/app/actions/learning";

const statusStyles: Record<string, { dot: string; badge: string }> = {
    'Open': { dot: 'bg-amber-400', badge: 'bg-amber-100 text-amber-700 border-amber-200' },
    'In Progress': { dot: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700 border-blue-200' },
    'Resolved': { dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
};

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
    const initials = name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'S';
    const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : size === "lg" ? "w-12 h-12 text-base" : "w-9 h-9 text-sm";
    return (
        <div className={`${sizeClass} rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black shrink-0 shadow-md`}>
            {initials}
        </div>
    );
}

export default function AdminSupportPage() {
    const { toast } = useToast();
    const [threads, setThreads] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedThread, setSelectedThread] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    const fetchThreads = async () => {
        setIsLoading(true);
        try {
            const data = await getAllSupportThreads();
            setThreads(data || []);
        } catch {
            toast({ title: "Error", description: "Failed to load threads", variant: "destructive" });
        }
        setIsLoading(false);
    };

    const openThread = async (thread: any) => {
        setSelectedThread(thread);
        setIsLoadingMessages(true);
        try {
            const msgs = await getSupportMessages(thread.id);
            setMessages(msgs || []);
        } catch {
            toast({ title: "Error", description: "Failed to load messages", variant: "destructive" });
        }
        setIsLoadingMessages(false);
    };

    const handleReply = async () => {
        if (!replyText.trim() || !selectedThread) return;
        setIsSending(true);
        const tempText = replyText;
        setReplyText("");
        try {
            await sendSupportMessage(selectedThread.id, 'admin', tempText);
            const msgs = await getSupportMessages(selectedThread.id);
            setMessages(msgs || []);
        } catch {
            toast({ title: "Error", description: "Failed to send reply", variant: "destructive" });
            setReplyText(tempText);
        }
        setIsSending(false);
    };

    const handleStatusChange = async (status: 'Open' | 'In Progress' | 'Resolved') => {
        if (!selectedThread) return;
        try {
            await updateSupportThreadStatus(selectedThread.id, status);
            setSelectedThread({ ...selectedThread, status });
            setThreads(prev => prev.map(t => t.id === selectedThread.id ? { ...t, status } : t));
            toast({ title: "Status Updated", description: `Thread marked as ${status}` });
        } catch {
            toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
        }
    };

    useEffect(() => { fetchThreads(); }, []);
    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const filteredThreads = threads.filter(t => {
        const name = `${t.students?.first_name} ${t.students?.last_name}`.toLowerCase();
        return name.includes(searchQuery.toLowerCase()) || t.students?.student_id?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const statusCounts = {
        Open: threads.filter(t => t.status === 'Open').length,
        'In Progress': threads.filter(t => t.status === 'In Progress').length,
        Resolved: threads.filter(t => t.status === 'Resolved').length,
    };

    return (
        <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">

            {/* ─── Top Bar ─────────────────────────────────────── */}
            <div className="shrink-0 px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-indigo-500" />
                        Student Support
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">Reply to student queries and manage ticket status</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                        {[
                            { label: 'Open', count: statusCounts.Open, color: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400' },
                            { label: 'In Progress', count: statusCounts['In Progress'], color: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400' },
                            { label: 'Resolved', count: statusCounts.Resolved, color: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400' },
                        ].map(s => (
                            <div key={s.label} className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${s.color}`}>
                                <span className="text-base font-black">{s.count}</span>
                                {s.label}
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={fetchThreads} disabled={isLoading} className="h-8 px-3 text-xs gap-1.5">
                        <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
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
                                placeholder="Search students..."
                                className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-400 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Thread Items */}
                    <div className="flex-1 overflow-y-auto">
                        {isLoading ? (
                            <div className="p-8 flex justify-center">
                                <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                            </div>
                        ) : filteredThreads.length === 0 ? (
                            <div className="p-8 text-center text-sm text-slate-400">
                                {searchQuery ? "No matching students" : "No threads yet"}
                            </div>
                        ) : (
                            filteredThreads.map(thread => {
                                const isActive = selectedThread?.id === thread.id;
                                const style = statusStyles[thread.status] ?? statusStyles['Open'];
                                return (
                                    <button
                                        key={thread.id}
                                        onClick={() => openThread(thread)}
                                        className={`w-full text-left px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 group ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-2 border-l-indigo-500' : ''}`}
                                    >
                                        <Avatar name={`${thread.students?.first_name} ${thread.students?.last_name}`} size="sm" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-1 mb-0.5">
                                                <span className={`text-sm font-bold truncate ${isActive ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-800 dark:text-slate-200'}`}>
                                                    {thread.students?.first_name} {thread.students?.last_name}
                                                </span>
                                                <span className="text-[10px] text-slate-400 shrink-0">
                                                    {new Date(thread.updated_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Circle className={`w-1.5 h-1.5 shrink-0 fill-current ${style.dot}`} />
                                                <span className={`text-[11px] font-semibold ${style.dot.replace('bg-', 'text-')}`}>{thread.status}</span>
                                                <span className="text-[10px] text-slate-400 font-mono truncate">· {thread.students?.student_id}</span>
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
                    {!selectedThread ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                                <MessageCircle className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">No Conversation Selected</h3>
                            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                                Select a student thread from the list to view and respond to their support request.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <div className="shrink-0 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                    <Avatar name={`${selectedThread.students?.first_name} ${selectedThread.students?.last_name}`} />
                                    <div className="min-w-0">
                                        <div className="font-bold text-slate-900 dark:text-white text-sm truncate">
                                            {selectedThread.students?.first_name} {selectedThread.students?.last_name}
                                        </div>
                                        <div className="text-xs text-slate-400 font-mono truncate">
                                            {selectedThread.students?.student_id} · {selectedThread.students?.course}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Select value={selectedThread.status} onValueChange={(v: any) => handleStatusChange(v)}>
                                        <SelectTrigger className="h-8 w-36 text-xs font-bold border rounded-lg">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Open">Open</SelectItem>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                            <SelectItem value="Resolved">Resolved</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        variant="ghost" size="sm"
                                        className="h-8 w-8 p-0 text-slate-400 hover:text-slate-700"
                                        onClick={() => openThread(selectedThread)}
                                    >
                                        <RefreshCw className={`w-4 h-4 ${isLoadingMessages ? 'animate-spin' : ''}`} />
                                    </Button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                                {isLoadingMessages ? (
                                    <div className="flex justify-center pt-12">
                                        <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 text-sm">
                                        <Clock className="w-8 h-8 mb-3 opacity-30" />
                                        No messages in this thread yet.
                                    </div>
                                ) : (
                                    <>
                                        {messages.map(msg => {
                                            const isAdmin = msg.sender_role === 'admin';
                                            return (
                                                <div key={msg.id} className={`flex items-end gap-2.5 ${isAdmin ? 'flex-row-reverse' : 'flex-row'}`}>
                                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mb-1 ${isAdmin ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                                                        {isAdmin
                                                            ? <ShieldCheck className="w-3.5 h-3.5 text-white" />
                                                            : <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300" />
                                                        }
                                                    </div>
                                                    <div className={`max-w-[68%] space-y-1 ${isAdmin ? 'items-end' : 'items-start'} flex flex-col`}>
                                                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${isAdmin
                                                            ? 'bg-indigo-600 text-white rounded-br-sm'
                                                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-sm'
                                                            }`}>
                                                            {msg.message}
                                                        </div>
                                                        <span className="text-[10px] text-slate-400 px-1">
                                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                                {selectedThread.status === 'Resolved' ? (
                                    <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 rounded-xl px-4 py-3 border border-emerald-200 dark:border-emerald-800">
                                        <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400 font-semibold">
                                            <CheckCircle2 className="w-4 h-4" /> Thread marked as Resolved
                                        </div>
                                        <Button size="sm" variant="outline" className="h-7 text-xs border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                                            onClick={() => handleStatusChange('Open')}>
                                            Reopen
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <input
                                            className="flex-1 h-11 rounded-xl px-4 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-400 transition-colors text-slate-900 dark:text-white placeholder:text-slate-400"
                                            placeholder="Type your reply and press Enter..."
                                            value={replyText}
                                            onChange={e => setReplyText(e.target.value)}
                                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply(); } }}
                                        />
                                        <Button
                                            className="h-11 w-11 p-0 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 shrink-0"
                                            onClick={handleReply}
                                            disabled={isSending || !replyText.trim()}
                                        >
                                            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
