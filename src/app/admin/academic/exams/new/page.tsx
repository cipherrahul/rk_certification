import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExamForm } from "@/components/academic/ExamForm";

export default function NewExamPage() {
    return (
        <div className="container px-4 py-8 mx-auto max-w-4xl space-y-8">
            <Link href="/admin/academic">
                <Button variant="ghost" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Academic
                </Button>
            </Link>

            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Schedule New Exam</h1>
                <p className="text-muted-foreground text-sm">Fill in the details below to create a new exam for a specific course and branch.</p>
            </div>

            <ExamForm />
        </div>
    );
}
