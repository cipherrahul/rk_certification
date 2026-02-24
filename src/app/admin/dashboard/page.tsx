import { redirect } from "next/navigation";
import { Plus, Search, Download, Trash2, FileText, Award, GraduationCap, Users, UserCog } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

    const recentCount = certificates?.filter(
        c => new Date(c.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length || 0;

    return (
        <div className="container px-4 py-8 mx-auto max-w-7xl space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Overview</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Welcome back! Here is what&apos;s happening today.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
                    <Link href="/admin/students" className="hidden sm:inline-block">
                        <Button variant="outline" className="shadow-sm">
                            <Users className="w-4 h-4 mr-2" />
                            Students
                        </Button>
                    </Link>
                    <Link href="/admin/teachers" className="hidden sm:inline-block">
                        <Button variant="outline" className="shadow-sm">
                            <UserCog className="w-4 h-4 mr-2" />
                            Teachers
                        </Button>
                    </Link>
                    <Link href="/admin/certifications" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                            <Plus className="w-4 h-4 mr-2" />
                            New Certificate
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="shadow-sm border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Certificates</CardTitle>
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                            <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">{totalCertificates || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            <span className="text-emerald-500 font-medium">+{recentCount}</span> from last month
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">{totalStudents || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            <Link href="/admin/students" className="text-indigo-600 dark:text-indigo-400 hover:underline">View student directory →</Link>
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Recent Activity</CardTitle>
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                            <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">{recentCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Certificates issued in last 30 days
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Teachers</CardTitle>
                        <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                            <UserCog className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">{totalTeachers || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            <Link href="/admin/teachers" className="text-teal-600 dark:text-teal-400 hover:underline">Manage faculty →</Link>
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Table Area */}
            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800/50">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="text-lg">Recent Certificates</CardTitle>
                            <CardDescription>A list of the latest certificates generated.</CardDescription>
                        </div>
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search records..."
                                className="pl-9 h-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/50 dark:bg-slate-900/20">
                            <TableRow className="border-slate-100 dark:border-slate-800/50">
                                <TableHead className="w-[140px] font-semibold text-slate-600 pl-6">Certificate ID</TableHead>
                                <TableHead className="font-semibold text-slate-600">Student Name</TableHead>
                                <TableHead className="font-semibold text-slate-600">Course</TableHead>
                                <TableHead className="font-semibold text-slate-600">Issue Date</TableHead>
                                <TableHead className="font-semibold text-slate-600">Status</TableHead>
                                <TableHead className="text-right font-semibold text-slate-600 pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {certificates && certificates.length > 0 ? (
                                certificates.map((cert) => (
                                    <TableRow key={cert.id} className="border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                        <TableCell className="font-mono text-xs font-medium text-slate-500 pl-6">{cert.certificate_id}</TableCell>
                                        <TableCell className="font-medium text-slate-900 dark:text-slate-100">{cert.first_name} {cert.last_name}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                                {cert.certificate_type}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-500">{new Date(cert.issue_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800 shadow-sm font-medium px-2.5 py-0.5">
                                                Active
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex justify-end gap-1">
                                                {cert.pdf_url && (
                                                    <a href={cert.pdf_url} target="_blank" rel="noopener noreferrer">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors" title="Download PDF">
                                                            <Download className="w-4 h-4" />
                                                        </Button>
                                                    </a>
                                                )}
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors" title="Revoke">
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
                                            <FileText className="w-8 h-8 mb-2 opacity-50 text-slate-400" />
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
        </div>
    );
}
