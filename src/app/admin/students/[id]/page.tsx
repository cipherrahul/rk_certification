import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { PaymentHistoryTable } from "@/components/students/PaymentHistoryTable";
import { StudentProfile } from "@/components/students/StudentProfile";

export default async function StudentProfilePage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) redirect("/admin/login");

    const { data: student, error } = await supabase
        .from("students")
        .select("*, fee_payments(*)")
        .eq("id", params.id)
        .single();

    if (error || !student) notFound();

    const payments = student.fee_payments || [];
    const totalPaid = payments.reduce((s: number, p: { paid_amount: number | string }) => s + Number(p.paid_amount), 0);
    const totalDue = payments.reduce((s: number, p: { remaining_amount: number | string }) => s + Number(p.remaining_amount), 0);
    const totalFees = payments.reduce((s: number, p: { total_fees: number | string }) => s + Number(p.total_fees), 0);

    const dob = new Date(student.date_of_birth).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
    });

    return (
        <div className="container px-4 py-8 mx-auto max-w-6xl">
            <Link href="/admin/students">
                <Button variant="ghost" className="mb-6 -ml-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Students
                </Button>
            </Link>

            <StudentProfile
                student={student}
                totalFees={totalFees}
                totalPaid={totalPaid}
                totalDue={totalDue}
                dob={dob}
            />

            {/* Payment History */}
            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Payment History</CardTitle>
                    <Link href={`/admin/students/${student.id}/fee`}>
                        <Button variant="outline" size="sm">
                            <PlusCircle className="w-4 h-4 mr-2" /> Add Payment
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    <PaymentHistoryTable payments={payments} />
                </CardContent>
            </Card>
        </div>
    );
}
