"use client";

import { useState } from "react";
import {
    Bell,
    Send,
    Search,
    Calendar,
    IndianRupee,
    Users,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Loader2,
    RefreshCw,
    MessageSquare,
    ChevronDown,
    Building
} from "lucide-react";
import { format, subMonths, addMonths } from "date-fns";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
    sendFeeReminderAction,
    sendBatchRemindersAction
} from "@/lib/actions/fee-reminders.action";

interface FeeReminderClientProps {
    initialData: any[];
    currentMonth: string;
}

export function FeeReminderClient({ initialData, currentMonth }: FeeReminderClientProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isProcessing, setIsProcessing] = useState<string | null>(null);
    const [isBatchProcessing, setIsBatchProcessing] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const filteredData = initialData.filter(s =>
        `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.mobile.includes(searchTerm)
    );

    const totalOutstanding = filteredData.reduce((acc, s) => acc + s.balance, 0);

    const handleSingleReminder = async (student: any) => {
        setIsProcessing(student.id);
        try {
            const res = await sendFeeReminderAction({
                ...student,
                month: currentMonth
            });
            if (res.success) {
                toast({ title: "Reminder Sent", description: `WhatsApp notification sent to ${student.first_name}.` });
                router.refresh();
            } else {
                toast({ variant: "destructive", title: "Failed", description: res.error });
            }
        } finally {
            setIsProcessing(null);
        }
    };

    const handleBatchReminders = async () => {
        if (!confirm(`Are you sure you want to send reminders to all ${filteredData.length} students?`)) return;

        setIsBatchProcessing(true);
        try {
            const res = await sendBatchRemindersAction(filteredData, currentMonth);
            if (res.success) {
                toast({
                    title: "Batch Reminders Sent",
                    description: `Successfully sent ${res.summary.successCount} reminders. ${res.summary.failCount} failed.`
                });
                router.refresh();
            } else {
                toast({ variant: "destructive", title: "Error", description: res.error });
            }
        } finally {
            setIsBatchProcessing(false);
        }
    };

    const changeMonth = (offset: number) => {
        const currentDate = new Date(currentMonth);
        const nextDate = offset > 0 ? addMonths(currentDate, 1) : subMonths(currentDate, 1);
        router.push(`/admin/fees/reminders?month=${encodeURIComponent(format(nextDate, "MMMM yyyy"))}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Fee Reminders</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Automated WhatsApp payment notifications for outstanding dues.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                        <Button variant="ghost" className="rounded-none h-10 px-4 border-r" onClick={() => changeMonth(-1)}>
                            Prev
                        </Button>
                        <div className="flex items-center px-4 font-semibold text-slate-700 min-w-[140px] justify-center text-sm">
                            <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                            {currentMonth}
                        </div>
                        <Button variant="ghost" className="rounded-none h-10 px-4 border-l" onClick={() => changeMonth(1)}>
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            {/* Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-gradient-to-br from-rose-500 to-rose-600 text-white">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-rose-100">Overdue Students</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-extrabold flex items-baseline gap-2">
                            {filteredData.length}
                            <span className="text-lg font-medium opacity-80">Students</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-indigo-50 dark:bg-slate-900">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-slate-500 font-medium">Outstanding Balance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-extrabold text-slate-900">
                            ₹{totalOutstanding.toLocaleString()}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-indigo-600 text-white flex flex-col justify-center items-center pointer-events-none opacity-90">
                    <div className="text-center p-4">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-100" />
                        <p className="text-sm font-medium">Reminders help collect fees 40% faster on average.</p>
                    </div>
                </Card>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Filter by student name or mobile..."
                        className="pl-9 bg-white border-slate-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button
                    variant="default"
                    className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-md font-semibold"
                    onClick={handleBatchReminders}
                    disabled={isBatchProcessing || filteredData.length === 0}
                >
                    {isBatchProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Bell className="w-4 h-4 mr-2" />}
                    {isBatchProcessing ? "Sending All..." : `Remind All (${filteredData.length})`}
                </Button>
            </div>

            <Card className="border-none shadow-sm bg-white overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow className="border-slate-100">
                            <TableHead className="w-[220px] font-semibold text-slate-600 pl-6">Student</TableHead>
                            <TableHead className="font-semibold text-slate-600">Course / Branch</TableHead>
                            <TableHead className="font-semibold text-slate-600">Monthly Fee</TableHead>
                            <TableHead className="font-semibold text-slate-600">Pending</TableHead>
                            <TableHead className="font-semibold text-slate-600 text-center">Last Reminder</TableHead>
                            <TableHead className="text-right font-semibold text-slate-600 pr-6">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length > 0 ? (
                            filteredData.map((student) => {
                                return (
                                    <TableRow key={student.id} className="border-slate-50 hover:bg-slate-50 transition-colors">
                                        <TableCell className="pl-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900">{student.first_name} {student.last_name}</span>
                                                <span className="text-xs text-slate-500 flex items-center mt-1">
                                                    <MessageSquare className="w-3 h-3 mr-1" /> +91 {student.mobile}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-700">{student.course}</span>
                                                <span className="text-[10px] text-indigo-600 font-bold uppercase flex items-center mt-0.5">
                                                    <Building className="w-2.5 h-2.5 mr-1" /> {student.branches?.name || "Main Branch"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-600 font-medium italic">₹{Number(student.monthly_fee_amount).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <span className="text-rose-600 font-extrabold text-base">₹{student.balance.toLocaleString()}</span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {student.lastReminderAt ? (
                                                <div className="flex flex-col items-center">
                                                    <Badge className={`${student.reminderStatus === 'sent' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'} border-none px-2 py-0 text-[10px]`}>
                                                        {student.reminderStatus === 'sent' ? 'Success' : 'Failed'}
                                                    </Badge>
                                                    <span className="text-[9px] text-slate-400 mt-1">{format(new Date(student.lastReminderAt), "dd MMM, HH:mm")}</span>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-slate-400 italic">Never Sent</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                                                onClick={() => handleSingleReminder(student)}
                                                disabled={isProcessing === student.id || isBatchProcessing}
                                            >
                                                {isProcessing === student.id ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Send className="h-3 w-3 mr-1" />}
                                                Remind
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-48 text-center text-slate-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <CheckCircle2 className="w-10 h-10 mb-2 text-emerald-500 opacity-20" />
                                        <p className="font-medium text-lg text-slate-400">All Clear!</p>
                                        <p className="text-sm">No pending fees found for {currentMonth}.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
