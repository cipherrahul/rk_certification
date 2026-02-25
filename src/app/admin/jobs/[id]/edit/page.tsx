import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { JobForm } from "@/components/admin/JobForm";
import { getJobById } from "@/lib/actions/jobs";

export default async function EditJobPage({ params }: { params: { id: string } }) {
    const job = await getJobById(params.id);

    if (!job) notFound();

    return (
        <div className="container px-4 py-8 mx-auto max-w-4xl">
            <div className="mb-8">
                <Link href="/admin/jobs">
                    <Button variant="ghost" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Jobs
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Edit Job Posting</h1>
                <p className="text-muted-foreground mt-1">Update the details of your job opportunity.</p>
            </div>

            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                    <CardDescription>Update the information as needed.</CardDescription>
                </CardHeader>
                <CardContent>
                    <JobForm initialData={job} isEditing />
                </CardContent>
            </Card>
        </div>
    );
}
