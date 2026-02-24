import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TeacherForm } from "@/components/teachers/TeacherForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "Add Teacher | RK Admin",
};

export default async function NewTeacherPage() {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) redirect("/admin/login");

    return (
        <div className="container px-4 py-8 mx-auto max-w-7xl">
            <div className="flex items-center gap-3 mb-6">
                <Link href="/admin/teachers">
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Add New Teacher
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Fill in the details below to register a new faculty member
                    </p>
                </div>
            </div>

            <TeacherForm mode="create" />
        </div>
    );
}
