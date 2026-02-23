import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { IDCardClient } from "./IDCardClient";

export default async function IDCardPage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) redirect("/admin/login");

    const { data: student, error } = await supabase
        .from("students")
        .select("id, student_id, first_name, last_name, father_name, course, academic_session, mobile, photo_url")
        .eq("id", params.id)
        .single();

    if (error || !student) notFound();

    return <IDCardClient student={student} />;
}
