import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { StudentEnrollmentForm } from "@/components/students/StudentEnrollmentForm";

export default async function NewStudentPage() {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) redirect("/admin/login");

    return (
        <div className="container px-4 py-8 mx-auto max-w-3xl">
            <div className="mb-8">
                <Link href="/admin/students">
                    <Button variant="ghost" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Students
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Enroll New Student</h1>
                <p className="text-muted-foreground mt-1">Fill in the details below to add a new student to the system.</p>
            </div>

            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                <CardHeader>
                    <CardTitle>Student Information</CardTitle>
                    <CardDescription>All fields except photo are required.</CardDescription>
                </CardHeader>
                <CardContent>
                    <StudentEnrollmentForm />
                </CardContent>
            </Card>
        </div>
    );
}
