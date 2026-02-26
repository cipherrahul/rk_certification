import { redirect } from "next/navigation";
import { Plus, Download, Trash2, FileText, Award, GraduationCap, Users, UserCog, FileBadge, Building, TrendingUp, BarChart3, MessageSquare, Phone, Bell, AlertCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { FinancialActions } from "@/components/admin/FinancialActions";
import { getRevenueProjectionAction } from "@/lib/actions/financial.action";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
    const supabase = createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        redirect("/admin/login");
    }

    // Fetch Revenue Projection
    const { data: projectionData } = await getRevenueProjectionAction();

    // Fetch certificates
    const { data: certificates } = await supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

    // Fetch real stats
    const { count: totalCertificates } = await supabase
        .from('certificates')
        .select('*', { count: 'exact', head: true });

    const { count: totalStudents } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });

    const { count: totalTeachers } = await supabase
        .from('teachers')
        .select('*', { count: 'exact', head: true });

    // Fetch recent fee payments for notifications
    const { data: recentFees } = await supabase
        .from('fee_payments')
        .select('id, receipt_number, month, paid_amount, whatsapp_status, pdf_url, created_at, students(first_name, last_name)')
        .order('created_at', { ascending: false })
        .limit(10);

    // Fetch recent salary records for notifications
    const { data: recentSalaries } = await supabase
        .from('salary_records')
        .select('id, slip_number, month, year, net_salary, whatsapp_status, pdf_url, created_at, teachers(name)')
        .order('created_at', { ascending: false })
        .limit(10);

    // Fetch recent inquiries for dashboard widget
    const { data: recentInquiries } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    // Fetch pending fees for dashboard card
    const currentMonth = format(new Date(), "MMMM yyyy");
    const { data: pendingFeesData } = await supabase
        .from('fee_payments')
        .select('remaining_amount')
        .eq('month', currentMonth);

    const totalPendingFees = (pendingFeesData || []).reduce((acc, p) => acc + Number(p.remaining_amount), 0);

    // Combine and sort notifications
    const notifications = [
        ...(recentFees || []).map(f => {
            const student = f.students as any;
            return {
                id: f.id,
                type: "Fee Receipt",
                identifier: f.receipt_number,
                recipient: student ? `${student.first_name} ${student.last_name}` : "Unknown",
                amount: f.paid_amount,
                status: f.whatsapp_status,
                pdf_url: f.pdf_url,
                created_at: f.created_at
            };
        }),
        ...(recentSalaries || []).map(s => {
            const teacher = s.teachers as any;
            return {
                id: s.id,
                type: "Salary Slip",
                identifier: s.slip_number,
                recipient: teacher ? teacher.name : "Unknown",
                amount: s.net_salary,
                status: s.whatsapp_status,
                pdf_url: s.pdf_url,
                created_at: s.created_at
            };
        })
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 15);

    const recentCount = certificates?.filter(
        c => new Date(c.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length || 0;

    return (
        <div className="container px-4 py-8 mx-auto max-w-7xl space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Overview</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Welcome back! Here is what&apos;s happening today.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
                    <Link href="/admin/branches" className="hidden sm:inline-block">
                        <Button variant="outline" className="shadow-sm border-border/60 hover:bg-accent hover:text-foreground">
                            <Building className="w-4 h-4 mr-2" />
                            Branches
                        </Button>
                    </Link>
                    <Link href="/admin/branches/analytics" className="hidden sm:inline-block">
                        <Button variant="outline" className="shadow-sm border-border/60 hover:bg-accent hover:text-foreground">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Analytics
                        </Button>
                    </Link>
                    <Link href="/admin/students" className="hidden sm:inline-block">
                        <Button variant="outline" className="shadow-sm border-border/60 hover:bg-accent hover:text-foreground">
                            <Users className="w-4 h-4 mr-2" />
                            Students
                        </Button>
                    </Link>
                    <Link href="/admin/teachers" className="hidden sm:inline-block">
                        <Button variant="outline" className="shadow-sm border-border/60 hover:bg-accent hover:text-foreground">
                            <UserCog className="w-4 h-4 mr-2" />
                            Teachers
                        </Button>
                    </Link>
                    <Link href="/admin/certifications" className="hidden sm:inline-block">
                        <Button variant="outline" className="shadow-sm border-border/60 hover:bg-accent hover:text-foreground">
                            <FileBadge className="w-4 h-4 mr-2" />
                            Certifications
                        </Button>
                    </Link>
                    <Link href="/admin/offer-letter" className="hidden sm:inline-block">
                        <Button variant="outline" className="shadow-sm border-border/60 hover:bg-accent hover:text-foreground">
                            <FileText className="w-4 h-4 mr-2" />
                            Offer Letters
                        </Button>
                    </Link>
                    <Link href="/admin/inquiries" className="hidden sm:inline-block">
                        <Button variant="outline" className="shadow-sm border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 transition-all font-semibold">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Inquiries & CRM
                        </Button>
                    </Link>
                    <Link href="/admin/fees/reminders" className="hidden sm:inline-block">
                        <Button variant="outline" className="shadow-sm border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-all font-semibold">
                            <Bell className="w-4 h-4 mr-2" />
                            Fee Reminders
                        </Button>
                    </Link>
                    <Link href="/admin/certifications" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto bg-brand hover:bg-brand/90 text-brand-foreground shadow-sm">
                            <Plus className="w-4 h-4 mr-2" />
                            New Certificate
                        </Button>
                    </Link>
                    <Link href="/admin/mis" className="hidden sm:inline-block">
                        <Button variant="outline" className="shadow-sm border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 transition-all font-semibold">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            MIS & Growth
                        </Button>
                    </Link>
                    <FinancialActions />
                </div>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="shadow-sm border-border/60 bg-card transition-all hover:shadow-md hover:border-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Certificates</CardTitle>
                        <div className="p-2 bg-brand/10 rounded-lg">
                            <Award className="w-4 h-4 text-brand" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{totalCertificates || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            <span className="text-brand font-medium">+{recentCount}</span> from last month
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-border/60 bg-card transition-all hover:shadow-md hover:border-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
                        <div className="p-2 bg-accent rounded-lg">
                            <GraduationCap className="w-4 h-4 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{totalStudents || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            <Link href="/admin/students" className="text-brand hover:underline">View student directory →</Link>
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-none bg-rose-50 dark:bg-slate-900 transition-all hover:shadow-md hover:border-border overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-bold text-rose-700 dark:text-rose-400">Monthly Pending Fees</CardTitle>
                        <div className="p-2 bg-rose-100 rounded-lg group-hover:bg-rose-200 transition-colors">
                            <Bell className="w-4 h-4 text-rose-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold text-rose-600">
                            ₹{totalPendingFees.toLocaleString() || "0"}
                        </div>
                        <p className="text-xs text-rose-600/70 mt-1 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Outstanding for {currentMonth.split(' ')[0]}
                        </p>
                        <Link href="/admin/fees/reminders" className="text-[10px] text-rose-700 hover:underline mt-3 block font-bold transition-all">
                            Send Reminders →
                        </Link>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-border/60 bg-card transition-all hover:shadow-md hover:border-border overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Revenue Projection (3m)</CardTitle>
                        <div className="p-2 bg-indigo-50 rounded-lg">
                            <BarChart3 className="w-4 h-4 text-indigo-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-indigo-600">
                            ₹{projectionData?.threeMonthTotal?.toLocaleString("en-IN") || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Estimated based on monthly fees
                        </p>
                        <div className="mt-3 flex gap-1 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-400 w-1/3"></div>
                            <div className="h-full bg-indigo-500 w-1/3"></div>
                            <div className="h-full bg-indigo-600 w-1/3"></div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Table Area */}
            <Card className="shadow-sm border-border/60 bg-card">
                <CardHeader className="pb-4 border-b border-border/40">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="text-lg text-foreground">Recent Certificates</CardTitle>
                            <CardDescription className="text-muted-foreground">A list of the latest certificates generated.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-accent/40">
                            <TableRow className="border-border/40 hover:bg-transparent">
                                <TableHead className="w-[140px] font-semibold text-muted-foreground pl-6">Certificate ID</TableHead>
                                <TableHead className="font-semibold text-muted-foreground">Student Name</TableHead>
                                <TableHead className="font-semibold text-muted-foreground">Course</TableHead>
                                <TableHead className="font-semibold text-muted-foreground">Issue Date</TableHead>
                                <TableHead className="font-semibold text-muted-foreground">Status</TableHead>
                                <TableHead className="text-right font-semibold text-muted-foreground pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {certificates && certificates.length > 0 ? (
                                certificates.map((cert) => (
                                    <TableRow key={cert.id} className="border-border/40 hover:bg-accent/50 transition-colors">
                                        <TableCell className="font-mono text-xs font-medium text-muted-foreground pl-6">{cert.certificate_id}</TableCell>
                                        <TableCell className="font-medium text-foreground">{cert.first_name} {cert.last_name}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand"></div>
                                                {cert.certificate_type}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{new Date(cert.issue_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-brand/10 text-brand border-brand/20 shadow-sm font-medium px-2.5 py-0.5">
                                                Active
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex justify-end gap-1">
                                                {cert.pdf_url && (
                                                    <a href={cert.pdf_url} target="_blank" rel="noopener noreferrer">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-brand hover:bg-brand/10 transition-colors" title="Download PDF">
                                                            <Download className="w-4 h-4" />
                                                        </Button>
                                                    </a>
                                                )}
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Revoke">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <FileText className="w-8 h-8 mb-2 opacity-50" />
                                            <p className="text-sm font-medium">No certificates found</p>
                                            <p className="text-xs mt-1">Generated certificates will appear here.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* WhatsApp Notifications Section */}
            <Card className="shadow-sm border-border/60 bg-card mt-8">
                <CardHeader className="pb-4 border-b border-border/40">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="text-lg text-foreground">Recent WhatsApp Notifications</CardTitle>
                            <CardDescription className="text-muted-foreground">Status of automatically sent receipts and salary slips.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-accent/40">
                            <TableRow className="border-border/40 hover:bg-transparent">
                                <TableHead className="w-[120px] font-semibold text-muted-foreground pl-6">Type</TableHead>
                                <TableHead className="font-semibold text-muted-foreground">Recipient</TableHead>
                                <TableHead className="font-semibold text-muted-foreground">ID / Slip No.</TableHead>
                                <TableHead className="font-semibold text-muted-foreground">Date</TableHead>
                                <TableHead className="font-semibold text-muted-foreground">WA Status</TableHead>
                                <TableHead className="text-right font-semibold text-muted-foreground pr-6">PDF</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {notifications.length > 0 ? (
                                notifications.map((notif) => (
                                    <TableRow key={notif.id} className="border-border/40 hover:bg-accent/50 transition-colors">
                                        <TableCell className="pl-6">
                                            <Badge variant="outline" className={notif.type === "Fee Receipt" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-purple-50 text-purple-700 border-purple-200"}>
                                                {notif.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-medium text-foreground">{notif.recipient}</TableCell>
                                        <TableCell className="font-mono text-xs">{notif.identifier}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{new Date(notif.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    notif.status === "sent" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                        notif.status === "failed" ? "bg-red-50 text-red-700 border-red-200" :
                                                            "bg-slate-50 text-slate-500 border-slate-200"
                                                }
                                            >
                                                {notif.status?.toUpperCase() || "PENDING"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            {notif.pdf_url ? (
                                                <a href={notif.pdf_url} target="_blank" rel="noopener noreferrer">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600 hover:bg-indigo-50">
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                </a>
                                            ) : (
                                                <span className="text-[10px] text-muted-foreground italic">Pending...</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        No recent notifications found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Recent Inquiries Widget */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <Card className="shadow-sm border-border/60 bg-card lg:col-span-2">
                    <CardHeader className="pb-4 border-b border-border/40">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-lg text-foreground flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-indigo-500" /> Recent Admission Enquiries
                                </CardTitle>
                                <CardDescription className="text-muted-foreground">Latest leads from the website.</CardDescription>
                            </div>
                            <Link href="/admin/inquiries">
                                <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">View CRM →</Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-accent/40">
                                <TableRow className="border-border/40">
                                    <TableHead className="pl-6">Student</TableHead>
                                    <TableHead>Course</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right pr-6">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentInquiries && recentInquiries.length > 0 ? (
                                    recentInquiries.map((enquiry) => (
                                        <TableRow key={enquiry.id} className="border-border/40 hover:bg-accent/20">
                                            <TableCell className="pl-6 py-3">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-900">{enquiry.student_name}</span>
                                                    <span className="text-xs text-slate-500">{enquiry.mobile_number}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm font-medium">{enquiry.course_interested}</TableCell>
                                            <TableCell className="text-xs text-muted-foreground">{new Date(enquiry.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Badge variant="outline" className={`
                                                    ${enquiry.status === "new" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                                        enquiry.status === "contacted" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                            enquiry.status === "admitted" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                                "bg-slate-50 text-slate-700 border-slate-200"}
                                                    capitalize px-2 py-0 border-none font-semibold
                                                `}>
                                                    {enquiry.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground italic text-sm">
                                            No recent inquiries found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Quick Growth Insight */}
                <Card className="shadow-sm border-indigo-100 dark:border-indigo-900 bg-indigo-50/30 dark:bg-slate-900/50 overflow-hidden relative">
                    <div className="absolute -right-4 -bottom-4 opacity-5 dark:opacity-10">
                        <TrendingUp className="w-32 h-32 text-indigo-600" />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-indigo-900 dark:text-indigo-300 text-lg flex items-center gap-2">
                            Growth Strategy
                        </CardTitle>
                        <CardDescription className="text-indigo-700/70 dark:text-indigo-400">Conversion Optimization</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-indigo-900/80 dark:text-indigo-200 leading-relaxed">
                            Track website leads to boost enrollment. High conversion happens within <strong>24 hours</strong> of inquiry.
                        </p>
                        <Link href="/admin/mis">
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                                <TrendingUp className="w-4 h-4 mr-2" />
                                Growth Analysis
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
