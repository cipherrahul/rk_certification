import { redirect } from "next/navigation";
import { LogOut, Plus, Search, Download, Trash2, FileText, Users, Award } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

    // Fetch stats (simplified for boilerplate)
    const { count: totalCertificates } = await supabase
        .from('certificates')
        .select('*', { count: 'exact', head: true });

    const recentCount = certificates?.filter(
        c => new Date(c.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length || 0;

    return (
        <div className="container px-4 py-8 mx-auto max-w-7xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Manage certificates, track issuance, and control access.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/certifications">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            New Certificate
                        </Button>
                    </Link>
                    <form action="/auth/signout" method="post">
                        <Button variant="outline" type="submit">
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </form>
                </div>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-indigo-600 dark:text-indigo-400">
                        <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
                        <Award className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalCertificates || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1 text-slate-500">
                            +{recentCount} from last month
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-emerald-600 dark:text-emerald-400">
                        <CardTitle className="text-sm font-medium">Verified Scans</CardTitle>
                        <Search className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">1,240</div>
                        <p className="text-xs text-muted-foreground mt-1 text-slate-500">
                            +15% from last week
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-blue-600 dark:text-blue-400">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">890</div>
                        <p className="text-xs text-muted-foreground mt-1 text-slate-500">
                            Enrolled in platform
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Table Area */}
            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <CardTitle>Recent Certificates</CardTitle>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search by ID or Name..."
                                    className="pl-8 bg-slate-50 dark:bg-slate-900"
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-slate-200 dark:border-slate-800">
                        <Table>
                            <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                                <TableRow>
                                    <TableHead className="w-[120px]">Certificate ID</TableHead>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Course</TableHead>
                                    <TableHead>Issue Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {certificates && certificates.length > 0 ? (
                                    certificates.map((cert) => (
                                        <TableRow key={cert.id}>
                                            <TableCell className="font-mono font-medium">{cert.certificate_id}</TableCell>
                                            <TableCell>{cert.first_name} {cert.last_name}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-indigo-500" />
                                                    {cert.certificate_type}
                                                </div>
                                            </TableCell>
                                            <TableCell>{new Date(cert.issue_date).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800">
                                                    Active
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {cert.pdf_url && (
                                                        <a href={cert.pdf_url} target="_blank" rel="noopener noreferrer">
                                                            <Button variant="ghost" size="icon" title="View/Download PDF">
                                                                <Download className="w-4 h-4 text-slate-500" />
                                                            </Button>
                                                        </a>
                                                    )}
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50" title="Revoke Certificate">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                            No certificates found. Create one to get started.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
