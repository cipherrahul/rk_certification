"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    getJobApplicationsAction,
    updateApplicationStatusAction
} from "@/lib/actions/application.action";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
    Search, FileText, MessageSquare, CheckCircle2, XCircle, Clock, ExternalLink, Loader2, ArrowLeft, DownloadCloud
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function JobApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedApp, setSelectedApp] = useState<any>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const { toast } = useToast();
    const supabase = createClient();

    const fetchApplications = async () => {
        const data = await getJobApplicationsAction();
        setApplications(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchApplications();

        // Subscribe to real-time updates
        const channel = supabase
            .channel("job_applications_changes")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "job_applications" },
                () => {
                    fetchApplications();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleStatusUpdate = async (id: string, status: string, name: string, phone: string) => {
        setIsUpdating(true);
        let message = "";

        if (status === "shortlisted") {
            message = `Hi ${name}, Great news! Your application for the position at RK Institution has been shortlisted. We will contact you soon for the next steps.`;
        } else if (status === "rejected") {
            message = `Hi ${name}, Thank you for your interest in RK Institution. After careful consideration, we have decided to move forward with other candidates at this time. We wish you the best in your search.`;
        }

        const res = await updateApplicationStatusAction(id, status, message);

        if (res.success) {
            toast({
                title: "Status Updated",
                description: `Application for ${name} marked as ${status}. WhatsApp notification sent.`,
            });
            if (selectedApp?.id === id) setSelectedApp(null);
            fetchApplications();
        } else {
            toast({
                title: "Update Failed",
                description: res.error,
                variant: "destructive",
            });
        }
        setIsUpdating(false);
    };

    const getResumeUrl = async (path: string) => {
        const { data, error } = await supabase.storage
            .from("resumes")
            .createSignedUrl(path, 3600);

        if (error) {
            toast({ title: "Error", description: "Could not generate resume link", variant: "destructive" });
            return;
        }
        window.open(data.signedUrl, "_blank");
    };

    const filteredApps = applications.filter(app =>
        app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending": return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Pending</Badge>;
            case "shortlisted": return <Badge className="bg-emerald-500 text-white">Shortlisted</Badge>;
            case "rejected": return <Badge variant="destructive">Rejected</Badge>;
            default: return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/admin/jobs">
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Job Applications</h1>
                        <p className="text-muted-foreground text-sm">Review resumes and manage candidate status in real-time.</p>
                    </div>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search candidates..."
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="border border-border/60 rounded-xl bg-card overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-accent/40">
                        <TableRow className="hover:bg-transparent">
                            <TableHead>Candidate</TableHead>
                            <TableHead>Job Role</TableHead>
                            <TableHead>Applied Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-40 text-center">
                                    <Loader2 className="w-8 h-8 text-brand animate-spin mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">Loading applications...</p>
                                </TableCell>
                            </TableRow>
                        ) : filteredApps.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-40 text-center text-muted-foreground">
                                    No applications found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredApps.map((app) => (
                                <TableRow key={app.id} className="hover:bg-accent/20 transition-colors">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-foreground">{app.full_name}</span>
                                            <span className="text-xs text-muted-foreground">{app.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium text-slate-700">{app.job_title}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {format(new Date(app.applied_at), "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-brand hover:text-brand hover:bg-brand/10 gap-2"
                                                    onClick={() => setSelectedApp(app)}
                                                >
                                                    <FileText className="w-4 h-4" /> View Details
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle className="text-xl">Application Details</DialogTitle>
                                                    <DialogDescription>
                                                        Review candidate information and take action.
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <div className="grid grid-cols-2 gap-6 py-4">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Candidate Name</label>
                                                            <p className="font-semibold">{app.full_name}</p>
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Email & Phone</label>
                                                            <p className="text-sm">{app.email}</p>
                                                            <p className="text-sm">{app.phone}</p>
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Qualifications</label>
                                                            <p className="text-sm font-medium">{app.highest_qualification}</p>
                                                            <p className="text-xs text-muted-foreground">{app.experience_years} Experience</p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Applied For</label>
                                                            <p className="font-semibold text-brand">{app.job_title}</p>
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Current Location</label>
                                                            <p className="text-sm">{app.current_location}</p>
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Resume</label>
                                                            <Button
                                                                variant="outline"
                                                                className="w-full mt-1 border-brand/30 text-brand hover:bg-brand/5 gap-2"
                                                                onClick={() => getResumeUrl(app.resume_url)}
                                                            >
                                                                <DownloadCloud className="w-4 h-4" /> Download Resume
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-accent/30 p-4 rounded-xl space-y-2">
                                                    <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Cover Letter</label>
                                                    <p className="text-sm text-slate-600 leading-relaxed italic whitespace-pre-wrap">
                                                        "{app.cover_letter}"
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t gap-3">
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            disabled={isUpdating}
                                                            onClick={() => handleStatusUpdate(app.id, "rejected", app.full_name, app.phone)}
                                                        >
                                                            <XCircle className="w-4 h-4 mr-2" /> Reject
                                                        </Button>
                                                        <Button
                                                            variant="brand"
                                                            size="sm"
                                                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                                            disabled={isUpdating}
                                                            onClick={() => handleStatusUpdate(app.id, "shortlisted", app.full_name, app.phone)}
                                                        >
                                                            <CheckCircle2 className="w-4 h-4 mr-2" /> Shortlist
                                                        </Button>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => window.open(`https://wa.me/${app.phone.replace(/\+/g, "")}`, "_blank")}
                                                    >
                                                        <MessageSquare className="w-4 h-4 mr-2" /> Manual WA
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
