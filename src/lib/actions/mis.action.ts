"use server";

import { createClient } from "@/lib/supabase/server";
import { startOfMonth, subMonths, endOfMonth, format } from "date-fns";

async function verifyAdmin() {
    const supabase = createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Unauthorized");

    const { data } = await supabase
        .from("admins")
        .select("role")
        .eq("id", user.id)
        .single();
    if (!data) throw new Error("Not an admin");

    return { supabase, user };
}

export async function getMISGrowthStatsAction() {
    try {
        const { supabase } = await verifyAdmin();

        const now = new Date();
        const currentMonthStart = startOfMonth(now).toISOString();
        const lastMonthStart = startOfMonth(subMonths(now, 1)).toISOString();
        const lastMonthEnd = endOfMonth(subMonths(now, 1)).toISOString();

        // 1. Student Growth (New Enrolments)
        const { count: currentStudents } = await supabase
            .from("students")
            .select("*", { count: "exact", head: true })
            .gte("created_at", currentMonthStart);

        const { count: lastMonthStudents } = await supabase
            .from("students")
            .select("*", { count: "exact", head: true })
            .gte("created_at", lastMonthStart)
            .lte("created_at", lastMonthEnd);

        const studentGrowth = lastMonthStudents && lastMonthStudents > 0
            ? ((Number(currentStudents) - Number(lastMonthStudents)) / Number(lastMonthStudents)) * 100
            : 0;

        // 2. Revenue Growth
        const { data: currentRevenueData } = await supabase
            .from("fee_payments")
            .select("paid_amount")
            .gte("payment_date", currentMonthStart);

        const { data: lastMonthRevenueData } = await supabase
            .from("fee_payments")
            .select("paid_amount")
            .gte("payment_date", lastMonthStart)
            .lte("payment_date", lastMonthEnd);

        const currentRevenue = currentRevenueData?.reduce((sum, p) => sum + Number(p.paid_amount), 0) || 0;
        const lastMonthRevenue = lastMonthRevenueData?.reduce((sum, p) => sum + Number(p.paid_amount), 0) || 0;

        const revenueGrowth = lastMonthRevenue > 0
            ? ((currentRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
            : 0;

        return {
            success: true,
            data: {
                students: {
                    current: currentStudents || 0,
                    lastMonth: lastMonthStudents || 0,
                    growth: studentGrowth.toFixed(1)
                },
                revenue: {
                    current: currentRevenue,
                    lastMonth: lastMonthRevenue,
                    growth: revenueGrowth.toFixed(1)
                }
            }
        };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function getAcquisitionTrendAction() {
    try {
        const { supabase } = await verifyAdmin();

        // Get data for last 6 months
        const trend = [];
        for (let i = 5; i >= 0; i--) {
            const date = subMonths(new Date(), i);
            const start = startOfMonth(date).toISOString();
            const end = endOfMonth(date).toISOString();
            const monthLabel = format(date, "MMM yyyy");

            const { count: students } = await supabase
                .from("students")
                .select("*", { count: "exact", head: true })
                .gte("created_at", start)
                .lte("created_at", end);

            const { count: enquiries } = await supabase
                .from("enquiries")
                .select("*", { count: "exact", head: true })
                .gte("created_at", start)
                .lte("created_at", end);

            trend.push({
                month: monthLabel,
                students: students || 0,
                enquiries: enquiries || 0
            });
        }

        return { success: true, data: trend };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function getConversionStatsAction() {
    try {
        const { supabase } = await verifyAdmin();

        const { count: totalEnquiries } = await supabase
            .from("enquiries")
            .select("*", { count: "exact", head: true });

        const { count: admittedEnquiries } = await supabase
            .from("enquiries")
            .select("*", { count: "exact", head: true })
            .eq("status", "admitted");

        const conversionRate = totalEnquiries && totalEnquiries > 0
            ? (Number(admittedEnquiries) / Number(totalEnquiries)) * 100
            : 0;

        // Source-wise Breakdown
        const { data: sourceData } = await supabase
            .from("enquiries")
            .select("source, status");

        const sources: Record<string, { total: number; converted: number }> = {};
        sourceData?.forEach(item => {
            const src = item.source || "Unknown";
            if (!sources[src]) sources[src] = { total: 0, converted: 0 };
            sources[src].total++;
            if (item.status === "admitted") sources[src].converted++;
        });

        const sourceBreakdown = Object.entries(sources).map(([name, stats]) => ({
            name,
            total: stats.total,
            converted: stats.converted,
            rate: stats.total > 0 ? ((stats.converted / stats.total) * 100).toFixed(1) : "0"
        }));

        return {
            success: true,
            data: {
                totalEnquiries: totalEnquiries || 0,
                admittedEnquiries: admittedEnquiries || 0,
                conversionRate: conversionRate.toFixed(1),
                sourceBreakdown
            }
        };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function getRevenueTrendAction() {
    try {
        const { supabase } = await verifyAdmin();

        const trend = [];
        for (let i = 5; i >= 0; i--) {
            const date = subMonths(new Date(), i);
            const start = startOfMonth(date).toISOString();
            const end = endOfMonth(date).toISOString();
            const monthLabel = format(date, "MMM yyyy");

            const { data } = await supabase
                .from("fee_payments")
                .select("paid_amount")
                .gte("payment_date", start)
                .lte("payment_date", end);

            const total = data?.reduce((sum, p) => sum + Number(p.paid_amount), 0) || 0;

            trend.push({
                month: monthLabel,
                revenue: total
            });
        }

        return { success: true, data: trend };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
