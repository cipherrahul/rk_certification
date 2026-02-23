"use client";

import Link from "next/link";
import { CreditCard, PlusCircle, User, Phone, BookOpen, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StudentProfileProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    student: any;
    totalFees: number;
    totalPaid: number;
    totalDue: number;
    dob: string;
}

export function StudentProfile({ student, totalFees, totalPaid, totalDue, dob }: StudentProfileProps) {
    return (
        <>
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
                <Card className="shadow-sm border-slate-200 dark:border-slate-800 flex-1">
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                            {/* Photo */}
                            <div className="w-24 h-24 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center flex-shrink-0">
                                {student.photo_url ? (
                                    <img src={student.photo_url} alt={student.first_name} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-10 h-10 text-indigo-300" />
                                )}
                            </div>
                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1 flex-wrap">
                                    <h1 className="text-2xl font-bold">{student.first_name} {student.last_name}</h1>
                                    <Badge className="font-mono">{student.student_id}</Badge>
                                    <Badge variant="outline">{student.academic_session}</Badge>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 text-indigo-500" />
                                        {student.course}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-indigo-500" />
                                        {student.mobile}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-indigo-500" />
                                        S/O, D/O: {student.father_name}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-indigo-500" />
                                        DOB: {dob}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex flex-col gap-3 md:w-56">
                    <Link href={`/admin/students/${student.id}/fee`}>
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                            <PlusCircle className="w-4 h-4 mr-2" /> Record Fee Payment
                        </Button>
                    </Link>
                    <Link href={`/admin/students/${student.id}/id-card`}>
                        <Button variant="outline" className="w-full">
                            <CreditCard className="w-4 h-4 mr-2" /> Generate ID Card
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Fee Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground font-medium">Total Fees</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">₹{totalFees.toLocaleString("en-IN")}</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground font-medium">Amount Paid</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{totalPaid.toLocaleString("en-IN")}
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground font-medium">Pending Dues</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className={`text-2xl font-bold ${totalDue > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600"}`}>
                            ₹{totalDue.toLocaleString("en-IN")}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
