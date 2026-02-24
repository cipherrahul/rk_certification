import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTeachersAction } from "@/lib/actions/teacher.action";
import { TeacherTable } from "@/components/teachers/TeacherTable";
import { UserCog } from "lucide-react";

export const metadata = {
    title: "Teachers | RK Admin",
    description: "Manage faculty and teaching staff",
};

export default async function TeachersPage() {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) redirect("/admin/login");

    const result = await getTeachersAction();
    const teachers = result.success ? result.data : [];

    return (
        <div className="container px-4 py-8 mx-auto max-w-7xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/10 dark:bg-indigo-600/20 flex items-center justify-center">
                        <UserCog className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Teacher & Faculty
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage staff profiles, ID cards, and salaries
                        </p>
                    </div>
                </div>
            </div>

            <TeacherTable teachers={teachers} />
        </div>
    );
}
