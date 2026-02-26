import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOutstandingFeesAction } from "@/lib/actions/fee-reminders.action";
import { FeeReminderClient } from "@/components/admin/fees/FeeReminderClient";
import { format } from "date-fns";

export const metadata = {
    title: "Fee Reminders | RK Admin",
    description: "Automated fee reminders for students.",
};

export default async function FeeRemindersPage({
    searchParams
}: {
    searchParams: { month?: string }
}) {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) redirect("/admin/login");

    // Default to current month if not provided
    const currentMonth = searchParams.month || format(new Date(), "MMMM yyyy");

    const result = await getOutstandingFeesAction(currentMonth);

    return (
        <div className="container px-4 py-8 mx-auto max-w-7xl">
            <FeeReminderClient
                initialData={result.success ? result.data : []}
                currentMonth={currentMonth}
            />
        </div>
    );
}
