"use client";

import { useEffect, useState } from "react";
import {
    Building,
    TrendingUp,
    BarChart3,
    DollarSign,
    ArrowUpRight,
    Loader2,
    PieChart,
    ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getCompanyWideAnalyticsAction, getBranchesAction } from "@/lib/actions/branch.action";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AnalyticsDashboard() {
    const [analytics, setAnalytics] = useState<any>(null);
    const [branches, setBranches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const [anaRes, branchRes] = await Promise.all([
                getCompanyWideAnalyticsAction(),
                getBranchesAction()
            ]);

            if (anaRes.success) setAnalytics(anaRes.data);
            if (branchRes.success) setBranches(branchRes.data);
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="h-[80vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-brand" />
            </div>
        );
    }

    const profitMargin = analytics?.totalRevenue > 0
        ? ((analytics.totalProfit / analytics.totalRevenue) * 100).toFixed(2)
        : "0.00";

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Company Analytics</h1>
                <p className="text-muted-foreground">Aggregated financial performance across all branches</p>
            </div>

            {/* High Level Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-brand text-white border-none shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 rounded-lg bg-white/20">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <Badge className="bg-white/20 text-white border-none">Overall Profit</Badge>
                        </div>
                        <p className="text-white/80 text-sm font-medium">Net Company Profit</p>
                        <h2 className="text-4xl font-bold mt-1">₹{analytics?.totalProfit || 0}</h2>
                        <div className="mt-4 flex items-center gap-1 text-sm text-white/90">
                            <TrendingUp className="w-4 h-4" />
                            <span>Average Margin: {profitMargin}%</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/60">
                    <CardHeader className="pb-2">
                        <CardDescription>Total Gross Revenue</CardDescription>
                        <CardTitle className="text-3xl font-bold">₹{analytics?.totalRevenue || 0}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-2 w-full bg-accent rounded-full mt-4 overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[70%]" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Sum of all student fees collected</p>
                    </CardContent>
                </Card>

                <Card className="border-border/60">
                    <CardHeader className="pb-2">
                        <CardDescription>Total Operating Expenses</CardDescription>
                        <CardTitle className="text-3xl font-bold">₹{analytics?.totalExpenses || 0}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-2 w-full bg-accent rounded-full mt-4 overflow-hidden">
                            <div className="h-full bg-rose-500 w-[30%]" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Salaries + Operational costs</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-border/60">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Building className="w-5 h-5 text-brand" />
                            Branch Performance
                        </CardTitle>
                        <CardDescription>Quick overview of active branches</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {branches.slice(0, 5).map((branch) => (
                                <div key={branch.id} className="flex items-center justify-between p-3 rounded-lg border border-border/40 hover:bg-accent/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-brand/10 flex items-center justify-center text-brand text-xs font-bold">
                                            {branch.code.substring(0, 2)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">{branch.name}</p>
                                            <p className="text-xs text-muted-foreground">{branch.city}</p>
                                        </div>
                                    </div>
                                    <Link href={`/admin/branches/${branch.id}`}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                            {branches.length > 5 && (
                                <Link href="/admin/branches" className="text-sm text-brand font-medium hover:underline block text-center pt-2">
                                    View all {branches.length} branches
                                </Link>
                            )}
                            {branches.length === 0 && (
                                <p className="text-center py-6 text-muted-foreground text-sm italic">No branch data available yet.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/60">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-brand" />
                            Financial Trends
                        </CardTitle>
                        <CardDescription>Revenue vs Profit analysis</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px] flex items-center justify-center border-2 border-dashed rounded-lg bg-accent/5">
                        <div className="text-center text-muted-foreground">
                            <PieChart className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">Interactive charts will appear here as transaction data accumulates.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
