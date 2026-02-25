import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { JobForm } from "@/components/admin/JobForm";

export default function NewJobPage() {
    return (
        <div className="container px-4 py-8 mx-auto max-w-4xl">
            <div className="mb-8">
                <Link href="/admin/jobs">
                    <Button variant="ghost" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Jobs
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Post New Job</h1>
                <p className="text-muted-foreground mt-1">Create a new job opportunity for your institution.</p>
            </div>

            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                    <CardDescription>All fields are required to provide complete information to candidates.</CardDescription>
                </CardHeader>
                <CardContent>
                    <JobForm />
                </CardContent>
            </Card>
        </div>
    );
}
