import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MISClient } from "@/components/admin/mis/MISClient";
import {
    getMISGrowthStatsAction,
    getAcquisitionTrendAction,
    getConversionStatsAction,
    getRevenueTrendAction
} from "@/lib/actions/mis.action";

export const metadata = {
    title: "MIS & Growth Dashboard | RK Admin",
    description: "Institutional growth analytics and performance reporting",
};

export default async function MISDashboardPage() {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) redirect("/admin/login");

    const [growthRes, acquisitionRes, conversionRes, revenueRes] = await Promise.all([
        getMISGrowthStatsAction(),
        getAcquisitionTrendAction(),
        getConversionStatsAction(),
        getRevenueTrendAction()
    ]);

    return (
        <div className="container px-4 py-8 mx-auto max-w-7xl">
            <MISClient
                initialGrowth={growthRes.success ? growthRes.data : null}
                initialAcquisition={acquisitionRes.success ? acquisitionRes.data : []}
                initialConversion={conversionRes.success ? conversionRes.data : null}
                initialRevenue={revenueRes.success ? revenueRes.data : []}
            />
        </div>
    );
}
