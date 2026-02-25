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
import { getTeachersAction } from "@/lib/actions/teacher.action";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createBranchClassAction, createBranchExpenseAction } from "@/lib/actions/branch.action";
import { useToast } from "@/hooks/use-toast";

export default function BranchDetailPage() {
    const { id } = useParams();
    const [branch, setBranch] = useState<any>(null);
    const [analytics, setAnalytics] = useState<any>(null);
    const [students, setStudents] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [expenses, setExpenses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    // Dialog States
    const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
    const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const [branchRes, analyticRes, studentRes, teacherRes] = await Promise.all([
                getBranchByIdAction(id as string),
                getBranchAnalyticsAction(id as string),
                getStudentsAction(),
                getTeachersAction()
            ]);

            if (branchRes.success) {
                setBranch(branchRes.data);
                setClasses(branchRes.data.branch_classes || []);
                setExpenses(branchRes.data.branch_expenses || []);
            }
            if (analyticRes.success) setAnalytics(analyticRes.data);
            if (studentRes.success) {
                setStudents(studentRes.data.filter((s: any) => s.branch_id === id));
            }
            if (teacherRes.success) {
                setTeachers(teacherRes.data.filter((t: any) => t.branch_id === id));
            }
            setLoading(false);
        }
        fetchData();
    }, [id]);

    const handleCreateClass = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const data = {
            branchId: id as string,
            name: formData.get("name") as string,
            courseType: formData.get("courseType") as string,
            duration: formData.get("duration") as string,
            feeStructure: {
                admission: Number(formData.get("admission")),
                monthly: Number(formData.get("monthly")),
                exam: Number(formData.get("exam")),
            }
        };

        const res = await createBranchClassAction(data as any);
        if (res.success) {
            toast({ title: "Success", description: "Class created successfully" });
            setIsClassDialogOpen(false);
            // Refresh data
            window.location.reload();
        } else {
            toast({ title: "Error", description: res.error, variant: "destructive" });
        }
        setIsSubmitting(false);
    };

    const handleLogExpense = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const data = {
            branchId: id as string,
            type: formData.get("type") as string,
            amount: Number(formData.get("amount")),
            date: formData.get("date") as string,
            description: formData.get("description") as string,
        };

        const res = await createBranchExpenseAction(data as any);
        if (res.success) {
            toast({ title: "Success", description: "Expense logged successfully" });
            setIsExpenseDialogOpen(false);
            window.location.reload();
        } else {
            toast({ title: "Error", description: res.error, variant: "destructive" });
        }
        setIsSubmitting(false);
    };

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
        { name: "Total Team", value: analytics?.totalTeachers || 0, icon: UserPlus, color: "text-purple-600", bg: "bg-purple-50" },
        { name: "Total Revenue", value: `₹${analytics?.totalRevenue || 0}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
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
                            <Link href={`/admin/teachers/new?branchId=${id}`}>
                                <Button size="sm" className="bg-brand text-white gap-2">
                                    <Plus className="w-4 h-4" /> Add Member
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {teachers.length === 0 ? (
                                <div className="text-center py-10 text-muted-foreground">
                                    No team members assigned to this branch.
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Dept.</TableHead>
                                            <TableHead>Contact</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {teachers.map((t) => (
                                            <TableRow key={t.id}>
                                                <TableCell className="font-medium text-sm">{t.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="text-[10px]">{t.role || "Teacher"}</Badge>
                                                </TableCell>
                                                <TableCell className="text-xs">{t.department}</TableCell>
                                                <TableCell className="text-xs">{t.contact}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
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
                            <Button onClick={() => setIsClassDialogOpen(true)} size="sm" className="bg-brand text-white gap-2">
                                <Plus className="w-4 h-4" /> Create Class
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {classes.length === 0 ? (
                                <div className="text-center py-10 text-muted-foreground">
                                    No classes created yet for this branch.
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Class Name</TableHead>
                                            <TableHead>Course Type</TableHead>
                                            <TableHead>Duration</TableHead>
                                            <TableHead>Fee Structure</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {classes.map((cls) => (
                                            <TableRow key={cls.id}>
                                                <TableCell className="font-medium">{cls.name}</TableCell>
                                                <TableCell>{cls.course_type}</TableCell>
                                                <TableCell>{cls.duration}</TableCell>
                                                <TableCell className="text-xs">
                                                    Adm: ₹{cls.fee_structure.admission}, Mon: ₹{cls.fee_structure.monthly}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
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
                            <Link href={`/admin/students/new?branchId=${id}`}>
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
                            <Button onClick={() => setIsExpenseDialogOpen(true)} size="sm" className="bg-brand text-white gap-2">
                                <Plus className="w-4 h-4" /> Log Expense
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {expenses.length === 0 ? (
                                <div className="text-center py-10 text-muted-foreground">
                                    No operational expenses logged.
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Description</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {expenses.map((exp) => (
                                            <TableRow key={exp.id}>
                                                <TableCell className="text-sm font-mono">{new Date(exp.date).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{exp.type}</Badge>
                                                </TableCell>
                                                <TableCell className="text-rose-600 font-bold">₹{exp.amount}</TableCell>
                                                <TableCell className="text-muted-foreground text-xs">{exp.description}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Dialogs */}
            <Dialog open={isClassDialogOpen} onOpenChange={setIsClassDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Class</DialogTitle>
                        <DialogDescription>Add a new course offering to this branch.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateClass} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Class Name</Label>
                                <Input name="name" placeholder="e.g. Web Dev Batch A" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Course Type</Label>
                                <Input name="courseType" placeholder="e.g. Full Stack" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Duration</Label>
                                <Input name="duration" placeholder="e.g. 6 Months" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Admission Fee (₹)</Label>
                                <Input name="admission" type="number" defaultValue="0" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Monthly Fee (₹)</Label>
                                <Input name="monthly" type="number" defaultValue="0" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Exam Fee (₹)</Label>
                                <Input name="exam" type="number" defaultValue="0" required />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsClassDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" className="bg-brand" disabled={isSubmitting}>
                                {isSubmitting ? "Creating..." : "Create Class"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Log Operational Expense</DialogTitle>
                        <DialogDescription>Record bills, rent, or other costs.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleLogExpense} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Expense Type</Label>
                                <Select name="type" defaultValue="Other">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Rent">Rent</SelectItem>
                                        <SelectItem value="Electricity">Electricity</SelectItem>
                                        <SelectItem value="Marketing">Marketing</SelectItem>
                                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Amount (₹)</Label>
                                <Input name="amount" type="number" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Input name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Input name="description" placeholder="e.g. Feb Month Rent" />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsExpenseDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" className="bg-brand" disabled={isSubmitting}>
                                {isSubmitting ? "Logging..." : "Log Expense"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
