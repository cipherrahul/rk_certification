"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Send, RefreshCw, CheckCircle2, Clock, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getAllSupportThreads, getSupportMessages, sendSupportMessage, updateSupportThreadStatus } from "@/app/actions/learning";

const statusColors: Record<string, string> = {
    'Open': 'bg-amber-100 text-amber-700 border-amber-200',
    'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
    'Resolved': 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export default function AdminSupportPage() {
    const { toast } = useToast();
    const [threads, setThreads] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedThread, setSelectedThread] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [isSending, setIsSending] = useState(false);

    const fetchThreads = async () => {
        setIsLoading(true);
        try {
            const data = await getAllSupportThreads();
            setThreads(data || []);
        } catch (e) {
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
        } catch (e) {
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
        } catch (e) {
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
        } catch (e) {
            toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
        }
    };

    useEffect(() => {
        fetchThreads();
    }, []);

    const statusCounts = {
        Open: threads.filter(t => t.status === 'Open').length,
        'In Progress': threads.filter(t => t.status === 'In Progress').length,
        Resolved: threads.filter(t => t.status === 'Resolved').length,
    };

    return (
        <div className="container px-4 py-8 mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">Student Support</h1>
                    <p className="text-muted-foreground text-sm font-medium">Manage and reply to student queries and issues.</p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchThreads} disabled={isLoading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
                </Button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-amber-700">{statusCounts.Open}</div>
                    <div className="text-xs font-bold text-amber-500 uppercase tracking-widest mt-1">Open</div>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-blue-700">{statusCounts['In Progress']}</div>
                    <div className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-1">In Progress</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-emerald-700">{statusCounts.Resolved}</div>
                    <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest mt-1">Resolved</div>
                </div>
            </div>

            {/* Main Layout */}
            <div className="grid lg:grid-cols-5 gap-6 h-[calc(100vh-330px)] min-h-[500px]">
                {/* Thread List */}
                <Card className="lg:col-span-2 flex flex-col shadow-sm overflow-hidden">
                    <CardHeader className="border-b border-border/40 pb-4">
                        <CardTitle className="text-base">All Conversations</CardTitle>
                        <CardDescription>{threads.length} student threads</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 overflow-y-auto">
                        {isLoading ? (
                            <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-300" /></div>
                        ) : threads.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground text-sm">No student threads yet.</div>
                        ) : (
                            threads.map(thread => (
                                <button
                                    key={thread.id}
                                    onClick={() => openThread(thread)}
                                    className={`w-full text-left p-4 border-b border-border/30 hover:bg-accent/50 flex items-center justify-between gap-3 transition-colors group ${selectedThread?.id === thread.id ? 'bg-indigo-50' : ''}`}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
                                                {thread.students?.first_name?.[0]}{thread.students?.last_name?.[0]}
                                            </div>
                                            <span className="font-bold text-sm text-slate-900 truncate">
                                                {thread.students?.first_name} {thread.students?.last_name}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-600 font-mono font-semibold mb-1.5 pl-9">{thread.students?.student_id}</div>
                                        <div className="pl-9 flex items-center gap-2">
                                            <Badge variant="outline" className={`text-xs font-semibold ${statusColors[thread.status]}`}>{thread.status}</Badge>
                                            <span className="text-xs font-medium text-slate-600">
                                                {new Date(thread.updated_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0 group-hover:text-indigo-500 transition-colors" />
                                </button>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Chat Panel */}
                <Card className="lg:col-span-3 flex flex-col shadow-sm overflow-hidden">
                    {!selectedThread ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
                            <MessageCircle className="w-12 h-12 text-indigo-200 mb-4 opacity-50" />
                            <h3 className="font-semibold text-lg text-slate-600">Select a Conversation</h3>
                            <p className="text-sm opacity-70 max-w-[240px] mt-2">Click a student thread from the list to view and reply to their messages.</p>
                        </div>
                    ) : (
                        <>
                            {/* Thread Header */}
                            <div className="p-4 border-b border-border/40 flex items-center justify-between shrink-0 bg-muted/20">
                                <div>
                                    <div className="font-bold text-foreground">{selectedThread.students?.first_name} {selectedThread.students?.last_name}</div>
                                    <div className="text-xs font-mono text-muted-foreground">{selectedThread.students?.student_id} · {selectedThread.students?.course}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Select value={selectedThread.status} onValueChange={(v: any) => handleStatusChange(v)}>
                                        <SelectTrigger className={`h-8 w-36 text-xs font-bold ${statusColors[selectedThread.status]} border`}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Open">Open</SelectItem>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                            <SelectItem value="Resolved">Resolved</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openThread(selectedThread)}>
                                        <RefreshCw className={`w-4 h-4 ${isLoadingMessages ? 'animate-spin' : ''}`} />
                                    </Button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30">
                                {isLoadingMessages ? (
                                    <div className="text-center p-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-300" /></div>
                                ) : messages.length === 0 ? (
                                    <div className="text-center p-8 text-muted-foreground text-sm">No messages in this thread yet.</div>
                                ) : (
                                    messages.map(msg => (
                                        <div key={msg.id} className={`flex ${msg.sender_role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${msg.sender_role === 'admin'
                                                ? 'bg-indigo-600 text-white rounded-br-sm'
                                                : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm'
                                                }`}>
                                                <div className="text-sm leading-relaxed">{msg.message}</div>
                                                <div className={`text-xs mt-1.5 ${msg.sender_role === 'admin' ? 'text-indigo-200' : 'text-slate-400'}`}>
                                                    {msg.sender_role === 'student' && <span className="font-bold mr-1">Student •</span>}
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(msg.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Reply Input */}
                            <div className="p-4 border-t border-border/40 shrink-0 bg-background">
                                {selectedThread.status === 'Resolved' ? (
                                    <div className="flex items-center justify-between bg-emerald-50 rounded-xl px-4 py-3 border border-emerald-100">
                                        <div className="flex items-center gap-2 text-sm text-emerald-700 font-semibold">
                                            <CheckCircle2 className="w-4 h-4" /> Issue marked as resolved
                                        </div>
                                        <Button size="sm" variant="outline" className="h-8 text-xs border-emerald-200 text-emerald-600" onClick={() => handleStatusChange('Open')}>Reopen</Button>
                                    </div>
                                ) : (
                                    <div className="flex gap-3">
                                        <Input
                                            className="flex-1 h-12 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                                            placeholder="Type your reply..."
                                            value={replyText}
                                            onChange={e => setReplyText(e.target.value)}
                                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply(); } }}
                                        />
                                        <Button
                                            className="h-12 w-12 p-0 bg-indigo-600 hover:bg-indigo-700 shrink-0"
                                            onClick={handleReply}
                                            disabled={isSending || !replyText.trim()}
                                        >
                                            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </Card>
            </div>
        </div>
    );
}
