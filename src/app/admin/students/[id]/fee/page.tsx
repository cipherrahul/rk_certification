import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { FeePaymentForm } from "@/components/students/FeePaymentForm";

export default async function FeePaymentPage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) redirect("/admin/login");

    const { data: student, error } = await supabase
        .from("students")
        .select("id, first_name, last_name, student_id")
        .eq("id", params.id)
        .single();

    if (error || !student) notFound();

    return (
        <div className="container px-4 py-8 mx-auto max-w-3xl">
            <Link href={`/admin/students/${params.id}`}>
                <Button variant="ghost" className="mb-6 -ml-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Profile
                </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Record Fee Payment</h1>
            <p className="text-muted-foreground mb-8">A unique receipt number will be generated automatically.</p>

            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                    <CardDescription>
                        Student: <span className="font-semibold text-foreground">{student.first_name} {student.last_name}</span>{" "}
                        <span className="font-mono text-xs">({student.student_id})</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <FeePaymentForm
                        studentId={student.id}
                        studentName={`${student.first_name} ${student.last_name}`}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
