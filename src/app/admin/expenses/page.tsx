"use client";

import { useEffect, useState } from "react";
import { getExpenseAnalyticsDataAction, processRecurringExpensesAction } from "@/lib/actions/expense.action";
import { getBranchesAction, getCompanyWideAnalyticsAction } from "@/lib/actions/branch.action";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, TrendingUp, TrendingDown, IndianRupee, PieChart as PieIcon, LineChart as LineIcon, Building2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export default function ExpenseDashboard() {
    const [analytics, setAnalytics] = useState<any>(null);
    const [companyAnalytics, setCompanyAnalytics] = useState<any>(null);
    const [branches, setBranches] = useState<any[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<string>("all");
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Run automation in parallel or separately to avoid blocking critical metrics
            // We don't await it here to ensure the dashboard loads fast
            processRecurringExpensesAction().catch(console.error);

            const [analyticRes, companyRes, branchRes] = await Promise.all([
                getExpenseAnalyticsDataAction(selectedBranch === "all" ? undefined : selectedBranch),
                getCompanyWideAnalyticsAction(),
                getBranchesAction()
            ]);

            if (analyticRes.success) setAnalytics(analyticRes.data);
            if (companyRes.success) setCompanyAnalytics(companyRes.data);
            if (branchRes.success) setBranches(branchRes.data);
        } catch (error) {
            console.error("Dashboard error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedBranch]);

    if (isLoading && !analytics) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-brand" />
            </div>
        );
    }

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Expense Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Analytics and insights for institutional spending.</p>
                </div>

                <div className="w-full md:w-64">
                    <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                        <SelectTrigger>
                            <Building2 className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Overall Overview" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Overall Overview</SelectItem>
                            {branches.map((b) => (
                                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <p className="text-indigo-100 text-sm font-medium">Total Revenue</p>
                            <IndianRupee className="w-8 h-8 opacity-20" />
                        </div>
                        <h2 className="text-3xl font-bold mt-2">₹{companyAnalytics?.totalRevenue?.toLocaleString() || "0"}</h2>
                        <div className="flex items-center gap-1 mt-4 text-xs font-medium bg-white/10 w-fit px-2 py-1 rounded">
                            <TrendingUp className="w-3 h-3" /> All Time
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-900 border-none shadow-md">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <p className="text-muted-foreground text-sm font-medium">Total Expenses</p>
                            <IndianRupee className="w-8 h-8 text-rose-500 opacity-20" />
                        </div>
                        <h2 className="text-3xl font-bold mt-2">₹{companyAnalytics?.totalExpenses?.toLocaleString() || "0"}</h2>
                        <div className="mt-4 h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-rose-500"
                                style={{ width: `${(companyAnalytics?.totalExpenses / companyAnalytics?.totalRevenue) * 100 || 0}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-900 border-none shadow-md">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <p className="text-muted-foreground text-sm font-medium">Net Profit</p>
                            <IndianRupee className="w-8 h-8 text-emerald-500 opacity-20" />
                        </div>
                        <h2 className="text-3xl font-bold mt-2">₹{companyAnalytics?.totalProfit?.toLocaleString() || "0"}</h2>
                        <div className={`flex items-center gap-1 mt-4 text-xs font-medium ${companyAnalytics?.totalProfit >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                            {companyAnalytics?.totalProfit >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {((companyAnalytics?.totalProfit / companyAnalytics?.totalRevenue) * 100 || 0).toFixed(1)}% Profit Margin
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Category Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieIcon className="w-5 h-5 text-brand" /> Category Breakdown
                        </CardTitle>
                        <CardDescription>Spending distribution across different categories.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                        {analytics?.categoryBreakdown?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={analytics.categoryBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={120}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                    >
                                        {analytics.categoryBreakdown.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: any) => `₹${Number(value).toLocaleString()}`}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground">
                                No spending data available for this selection.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Profit Trend */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LineIcon className="w-5 h-5 text-indigo-500" /> Net Profit Trend
                        </CardTitle>
                        <CardDescription>Monthly profit margin over the last 6 months.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics?.trendData || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => `₹${v / 1000}k`} />
                                <Tooltip
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    formatter={(value: any) => `₹${Number(value).toLocaleString()}`}
                                />
                                <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
