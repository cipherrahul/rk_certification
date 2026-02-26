"use client";

import { useState } from "react";
import {
    Search,
    Filter,
    MoreHorizontal,
    Mail,
    Phone,
    MessageSquare,
    CheckCircle2,
    Clock,
    XCircle,
    Trash2,
    Calendar,
    User,
    GraduationCap,
    ExternalLink,
    Loader2,
    FileText
} from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    updateEnquiryStatusAction,
    deleteEnquiryAction
} from "@/lib/actions/enquiry_management.action";
import { useToast } from "@/hooks/use-toast";

interface InquiriesClientProps {
    initialEnquiries: any[];
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    new: { label: "New", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Clock },
    contacted: { label: "Contacted", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Phone },
    admitted: { label: "Admitted", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
    closed: { label: "Closed", color: "bg-slate-100 text-slate-700 border-slate-200", icon: XCircle },
};

export function InquiriesClient({ initialEnquiries }: InquiriesClientProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    const filteredEnquiries = initialEnquiries.filter(e =>
        e.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.parent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.mobile_number.includes(searchTerm)
    );

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        setIsUpdating(id);
        try {
            const res = await updateEnquiryStatusAction(id, newStatus);
            if (res.success) {
                toast({ title: "Status Updated", description: `Enquiry marked as ${newStatus}.` });
                router.refresh();
            } else {
                toast({ variant: "destructive", title: "Update Failed", description: res.error });
            }
        } finally {
            setIsUpdating(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this enquiry?")) return;

        setIsUpdating(id);
        try {
            const res = await deleteEnquiryAction(id);
            if (res.success) {
                toast({ title: "Enquiry Deleted", description: "The enquiry has been removed." });
                router.refresh();
            } else {
                toast({ variant: "destructive", title: "Delete Failed", description: res.error });
            }
        } finally {
            setIsUpdating(null);
        }
    };

    const openWhatsApp = (number: string, studentName: string) => {
        const message = `Hello, this is RK Institution. We received your admission enquiry for ${studentName}. How can we help you?`;
        const url = `https://wa.me/91${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-100 leading-tight">Admissions CRM</h1>
                    <p className="text-slate-400 mt-1 text-sm">Track and manage student enquiries from the website.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search by student, parent or mobile..."
                            className="pl-9 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <Card className="border-none shadow-sm bg-white overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow className="border-slate-100">
                            <TableHead className="w-[200px] font-semibold text-slate-600 pl-6">Student & Parent</TableHead>
                            <TableHead className="font-semibold text-slate-600">Course & Class</TableHead>
                            <TableHead className="font-semibold text-slate-600">Contact Details</TableHead>
                            <TableHead className="font-semibold text-slate-600">Source</TableHead>
                            <TableHead className="font-semibold text-slate-600 text-center">Status</TableHead>
                            <TableHead className="text-right font-semibold text-slate-600 pr-6">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredEnquiries.length > 0 ? (
                            filteredEnquiries.map((enquiry) => {
                                const StatusIcon = statusConfig[enquiry.status as keyof typeof statusConfig]?.icon || Clock;
                                const config = statusConfig[enquiry.status as keyof typeof statusConfig] || statusConfig.new;

                                return (
                                    <TableRow key={enquiry.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="pl-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900">{enquiry.student_name}</span>
                                                <span className="text-xs text-slate-500 flex items-center mt-1">
                                                    <User className="w-3 h-3 mr-1" /> {enquiry.parent_name}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-700">{enquiry.course_interested}</span>
                                                <span className="text-xs text-indigo-600 font-semibold mt-0.5">{enquiry.class}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <button
                                                    onClick={() => openWhatsApp(enquiry.mobile_number, enquiry.student_name)}
                                                    className="text-sm font-medium text-emerald-600 hover:underline flex items-center"
                                                >
                                                    <MessageSquare className="w-3.5 h-3.5 mr-1" /> +91 {enquiry.mobile_number}
                                                </button>
                                                <span className="text-xs text-slate-500 truncate max-w-[150px]">{enquiry.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 font-medium">
                                                {enquiry.source}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge className={`${config.color} border-none font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5`}>
                                                <StatusIcon className="w-3 h-3" />
                                                {config.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-6 flex items-center justify-end gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 gap-2"
                                                        onClick={() => setSelectedEnquiry(enquiry)}
                                                    >
                                                        <FileText className="w-4 h-4" /> View Details
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-lg">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-xl">Enquiry Details</DialogTitle>
                                                        <DialogDescription>
                                                            Full enquiry information from {enquiry.student_name}.
                                                        </DialogDescription>
                                                    </DialogHeader>

                                                    <div className="grid grid-cols-2 gap-4 py-4">
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-slate-400">Student Name</label>
                                                            <p className="font-semibold text-slate-900">{enquiry.student_name}</p>
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-slate-400">Parent Name</label>
                                                            <p className="font-semibold text-slate-900">{enquiry.parent_name}</p>
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-slate-400">Course & Class</label>
                                                            <p className="text-sm font-medium text-slate-700">{enquiry.course_interested}</p>
                                                            <p className="text-xs text-indigo-600 font-bold uppercase">{enquiry.class}</p>
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-slate-400">Contact Number</label>
                                                            <p className="text-sm font-medium">+91 {enquiry.mobile_number}</p>
                                                            <p className="text-xs text-slate-500">{enquiry.email}</p>
                                                        </div>
                                                    </div>

                                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                                                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Message / Requirements</label>
                                                        <p className="text-sm text-slate-700 leading-relaxed italic whitespace-pre-wrap">
                                                            "{enquiry.message || "No message provided."}"
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-4 border-t gap-3">
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                                                onClick={() => openWhatsApp(enquiry.mobile_number, enquiry.student_name)}
                                                            >
                                                                <MessageSquare className="w-4 h-4 mr-2" /> WhatsApp
                                                            </Button>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-rose-600 hover:bg-rose-50"
                                                                onClick={() => handleDelete(enquiry.id)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isUpdating === enquiry.id}>
                                                        {isUpdating === enquiry.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <MoreHorizontal className="h-4 w-4 text-slate-600" />
                                                        )}
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(enquiry.id, "contacted")}>
                                                        <Phone className="w-4 h-4 mr-2 text-amber-500" /> Mark Contacted
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(enquiry.id, "admitted")}>
                                                        <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> Mark Admitted
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(enquiry.id, "closed")}>
                                                        <XCircle className="w-4 h-4 mr-2 text-slate-500" /> Close Entry
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(enquiry.id)}
                                                        className="text-rose-600 focus:text-rose-600"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" /> Delete Lead
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-48 text-center text-slate-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <Clock className="w-10 h-10 mb-2 opacity-20" />
                                        <p className="font-medium text-lg text-slate-400">No Inquiries Found</p>
                                        <p className="text-sm">Enquiries from the website will appear here.</p>
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
