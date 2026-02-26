import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEnquiriesAction } from "@/lib/actions/enquiry_management.action";
import { InquiriesClient } from "@/components/admin/inquiries/InquiriesClient";

export const metadata = {
    title: "Inquiry Management | RK Admin",
    description: "Manage student admission inquiries and leads.",
};

export default async function InquiriesPage({
    searchParams
}: {
    searchParams: { status?: string; search?: string }
}) {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) redirect("/admin/login");

    const result = await getEnquiriesAction({
        status: searchParams.status,
        search: searchParams.search
    });

    return (
        <div className="container px-4 py-8 mx-auto max-w-7xl">
            <InquiriesClient initialEnquiries={result.success ? result.data : []} />
        </div>
    );
}
