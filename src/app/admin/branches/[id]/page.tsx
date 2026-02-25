"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    Building,
    Users,
    TrendingUp,
    TrendingDown,
    DollarSign,
    PieChart,
    LayoutDashboard,
    UserPlus,
    BookOpen,
    Receipt,
    Plus,
    Loader2,
    Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getBranchByIdAction, getBranchAnalyticsAction } from "@/lib/actions/branch.action";
import { getStudentsAction } from "@/lib/actions/student.action";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function BranchDetailPage() {
    const { id } = useParams();
    const [branch, setBranch] = useState<any>(null);
    const [analytics, setAnalytics] = useState<any>(null);
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const [branchRes, analyticRes, studentRes] = await Promise.all([
                getBranchByIdAction(id as string),
                getBranchAnalyticsAction(id as string),
                getStudentsAction() // Need to filter this server-side or client-side for the branch
            ]);

            if (branchRes.success) setBranch(branchRes.data);
            if (analyticRes.success) setAnalytics(analyticRes.data);
            if (studentRes.success) {
                // Filter students for this branch
                setStudents(studentRes.data.filter((s: any) => s.branch_id === id));
            }
            setLoading(false);
        }
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="h-[80vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-brand" />
            </div>
        );
    }

    if (!branch) {
        return (
            <div className="p-6 text-center">
                <h1 className="text-2xl font-bold">Branch not found</h1>
                <p className="text-muted-foreground">The branch you are looking for does not exist.</p>
            </div>
        );
    }

    const stats = [
        { name: "Total Students", value: analytics?.totalStudents || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { name: "Total Revenue", value: `₹${analytics?.totalRevenue || 0}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
        { name: "Total Expenses", value: `₹${analytics?.totalExpenses || 0}`, icon: Receipt, color: "text-rose-600", bg: "bg-rose-50" },
        { name: "Net Profit", value: `₹${analytics?.netProfit || 0}`, icon: TrendingUp, color: "text-brand", bg: "bg-brand/5" },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
                        <Building className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold tracking-tight">{branch.name}</h1>
                            <Badge variant="outline" className="font-mono">{branch.code}</Badge>
                        </div>
                        <p className="text-muted-foreground">{branch.city}, {branch.state}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge className={analytics?.netProfit >= 0 ? "bg-emerald-500" : "bg-rose-500"}>
                        {analytics?.profitMargin}% Margin
                    </Badge>
                </div>
            </div>

            {/* Analytics Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.name} className="border-border/60">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">{stat.name}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="dashboard" className="space-y-6">
                <TabsList className="bg-muted/50 p-1 border border-border/60">
                    <TabsTrigger value="dashboard" className="gap-2">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </TabsTrigger>
                    <TabsTrigger value="team" className="gap-2">
                        <UserPlus className="w-4 h-4" /> Team
                    </TabsTrigger>
                    <TabsTrigger value="classes" className="gap-2">
                        <BookOpen className="w-4 h-4" /> Classes
                    </TabsTrigger>
                    <TabsTrigger value="students" className="gap-2">
                        <Users className="w-4 h-4" /> Students
                    </TabsTrigger>
                    <TabsTrigger value="expenses" className="gap-2">
                        <Receipt className="w-4 h-4" /> Expenses
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                                    Revenue Insights
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm">Detailed revenue breakdown and student payment status will appear here after data submission.</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <TrendingDown className="w-5 h-5 text-rose-500" />
                                    Expense Breakdown
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm">Operational vs Salary expense trends will be visualized here.</p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="team">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Branch Team</CardTitle>
                                <CardDescription>Manage teachers, branch head, and staff</CardDescription>
                            </div>
                            <Button size="sm" className="bg-brand text-white gap-2">
                                <Plus className="w-4 h-4" /> Add Member
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-10 text-muted-foreground">
                                List of team members assigned to this branch.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="classes">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Class Management</CardTitle>
                                <CardDescription>Configure courses and fee structures for this branch</CardDescription>
                            </div>
                            <Button size="sm" className="bg-brand text-white gap-2">
                                <Plus className="w-4 h-4" /> Create Class
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-10 text-muted-foreground">
                                No classes created yet for this branch.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="students">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Branch Students</CardTitle>
                                <CardDescription>Manage students enrolled in this branch</CardDescription>
                            </div>
                            <Link href="/admin/students/new">
                                <Button size="sm" className="bg-brand text-white gap-2">
                                    <Plus className="w-4 h-4" /> Add Student
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {students.length === 0 ? (
                                <div className="text-center py-10 text-muted-foreground">
                                    No students assigned to this branch.
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Course</TableHead>
                                            <TableHead>Fees Paid</TableHead>
                                            <TableHead>Pending</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {students.map((student) => {
                                            const totalPaid = student.fee_payments?.reduce((acc: number, curr: any) => acc + Number(curr.paid_amount), 0) || 0;
                                            const remaining = Number(student.total_course_fee) - totalPaid;
                                            return (
                                                <TableRow key={student.id}>
                                                    <TableCell className="font-mono text-xs">{student.student_id}</TableCell>
                                                    <TableCell className="font-medium">{student.first_name} {student.last_name}</TableCell>
                                                    <TableCell>{student.course}</TableCell>
                                                    <TableCell className="text-emerald-600 font-medium">₹{totalPaid}</TableCell>
                                                    <TableCell className="text-rose-600 font-medium">₹{remaining}</TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="expenses">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Operational Expenses</CardTitle>
                                <CardDescription>Rent, Electricity, Marketing, etc.</CardDescription>
                            </div>
                            <Button size="sm" className="bg-brand text-white gap-2">
                                <Plus className="w-4 h-4" /> Log Expense
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-10 text-muted-foreground">
                                No operational expenses logged.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
