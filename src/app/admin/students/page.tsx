import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Users, GraduationCap, IndianRupee } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { StudentTable } from "@/components/students/StudentTable";

export default async function StudentsPage() {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) redirect("/admin/login");

    // Fetch students with their fee_payments
    const { data: students } = await supabase
        .from("students")
        .select("*, fee_payments(paid_amount, total_fees, remaining_amount)")
        .order("created_at", { ascending: false });

    const totalStudents = students?.length || 0;

    // Calculate fee stats
    const feeSummary = students?.reduce(
        (acc: { totalPaid: number; totalDue: number }, s: { fee_payments: Array<{ paid_amount: number | string; remaining_amount: number | string }> }) => {
            const payments = s.fee_payments || [];
            const totalPaid = payments.reduce((sum: number, p: { paid_amount: number | string }) => sum + Number(p.paid_amount), 0);
            const totalDue = payments.reduce((sum: number, p: { remaining_amount: number | string }) => sum + Number(p.remaining_amount), 0);
            return {
                totalPaid: acc.totalPaid + totalPaid,
                totalDue: acc.totalDue + totalDue,
            };
        },
        { totalPaid: 0, totalDue: 0 }
    );

    return (
        <div className="container px-4 py-8 mx-auto max-w-7xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Students</h1>
                    <p className="text-muted-foreground mt-1">Manage enrolled students, fees, and ID cards.</p>
                </div>
                <Link href="/admin/students/new">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Plus className="w-4 h-4 mr-2" /> Enroll New Student
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-indigo-600">{totalStudents}</div>
                        <p className="text-xs text-muted-foreground mt-1">Currently enrolled</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
                        <IndianRupee className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-600">
                            ₹{feeSummary?.totalPaid?.toLocaleString("en-IN") || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Across all students</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Pending Dues</CardTitle>
                        <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-600">
                            ₹{feeSummary?.totalDue?.toLocaleString("en-IN") || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Outstanding balance</p>
                    </CardContent>
                </Card>
            </div>

            {/* Students Table */}
            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                <CardHeader>
                    <CardTitle>All Students</CardTitle>
                </CardHeader>
                <CardContent>
                    <StudentTable students={students || []} />
                </CardContent>
            </Card>
        </div>
    );
}
