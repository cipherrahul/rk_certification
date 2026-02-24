import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTeacherByIdAction } from "@/lib/actions/teacher.action";
import { getSalaryRecordsByTeacherAction } from "@/lib/actions/salary.action";
import { TeacherProfile } from "@/components/teachers/TeacherProfile";

export async function generateMetadata({ params }: { params: { id: string } }) {
    return { title: "Teacher Profile | RK Admin" };
}

export default async function TeacherDetailPage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) redirect("/admin/login");

    const [teacherResult, salaryResult] = await Promise.all([
        getTeacherByIdAction(params.id),
        getSalaryRecordsByTeacherAction(params.id),
    ]);

    if (!teacherResult.success || !teacherResult.data) {
        redirect("/admin/teachers");
    }

    const teacher = teacherResult.data;
    const salaryRecords = salaryResult.success ? salaryResult.data : [];

    return (
        <div className="container px-4 py-8 mx-auto max-w-7xl">
            <TeacherProfile teacher={teacher} salaryRecords={salaryRecords} />
        </div>
    );
}
