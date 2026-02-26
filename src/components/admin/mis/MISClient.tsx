"use client";

import { useState } from "react";
import {
    TrendingUp,
    TrendingDown,
    IndianRupee,
    UserPlus,
    BarChart3,
    PieChart as PieIcon,
    Download,
    FileSpreadsheet,
    ArrowUpRight,
    Target,
    Loader2
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generateMISReportPDF } from "@/lib/pdf/mis-report-pdf";
import { useToast } from "@/hooks/use-toast";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

interface MISClientProps {
    initialGrowth: any;
    initialAcquisition: any[];
    initialConversion: any;
    initialRevenue: any[];
}

export function MISClient({
    initialGrowth,
    initialAcquisition,
    initialConversion,
    initialRevenue
}: MISClientProps) {
    const [isExporting, setIsExporting] = useState(false);
    const { toast } = useToast();

    const handleExportCSV = () => {
        setIsExporting(true);
        try {
            const headers = ["Month", "Revenue", "New Students", "Enquiries"];
            const rows = initialAcquisition.map((item, index) => [
                item.month,
                initialRevenue[index]?.revenue || 0,
                item.students,
                item.enquiries
            ]);

            const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `MIS_Report_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } finally {
            setIsExporting(false);
        }
    };

    const handleDownloadPDF = async () => {
        setIsExporting(true);
        try {
            const url = await generateMISReportPDF();
            if (url) {
                window.open(url, "_blank");
                toast({ title: "Success", description: "MIS Report generated successfully!" });
            } else {
                toast({ variant: "destructive", title: "Error", description: "Failed to generate PDF. Please try again." });
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "An error occurred." });
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        MIS & Growth Analytics
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Comprehensive institutional performance and student acquisition reporting.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={handleExportCSV}
                        disabled={isExporting}
                        className="border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 transition-all font-medium"
                    >
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        Export Excel
                    </Button>
                    <Button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md transition-all"
                        onClick={handleDownloadPDF}
                        disabled={isExporting}
                    >
                        {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                        {isExporting ? "Generating..." : "Download PDF"}
                    </Button>
                </div>
            </div>

            {/* Growth Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-500 to-indigo-600 text-white overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transition-transform group-hover:scale-110">
                        <UserPlus className="w-20 h-20" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-indigo-100 font-medium">New Enrolments</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-extrabold">{initialGrowth?.students?.current || 0}</div>
                        <div className="flex items-center gap-1.5 mt-3">
                            <Badge variant="outline" className="bg-white/20 text-white border-none py-0.5 px-2">
                                {Number(initialGrowth?.students?.growth) >= 0 ? "+" : ""}{initialGrowth?.students?.growth}%
                            </Badge>
                            <span className="text-xs text-indigo-100 italic">vs last month</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-indigo-50 dark:bg-slate-900 overflow-hidden relative group">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-slate-500 dark:text-slate-400 font-medium">Current Revenue</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-extrabold text-slate-900 dark:text-white">
                            ₹{initialGrowth?.revenue?.current?.toLocaleString() || "0"}
                        </div>
                        <div className="flex items-center gap-1.5 mt-3">
                            <span className={`flex items-center text-xs font-bold ${Number(initialGrowth?.revenue?.growth) >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                                {Number(initialGrowth?.revenue?.growth) >= 0 ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                                {initialGrowth?.revenue?.growth}%
                            </span>
                            <span className="text-xs text-muted-foreground italic">Growth trend</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-indigo-50 dark:bg-slate-900 overflow-hidden relative group">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-slate-500 dark:text-slate-400 font-medium">Total Inquiries</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-extrabold text-slate-900 dark:text-white">
                            {initialConversion?.totalEnquiries || 0}
                        </div>
                        <div className="flex items-center gap-1.5 mt-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center">
                            <Target className="w-3.5 h-3.5 mr-1" />
                            Growth Potential
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-indigo-50 dark:bg-slate-900 overflow-hidden relative group">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-slate-500 dark:text-slate-400 font-medium">Conversion Rate</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                            {initialConversion?.conversionRate || 0}%
                        </div>
                        <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground italic px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 rounded-full w-fit">
                            Leads to Admissions
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 1: Student Acquisition & Revenue Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-none shadow-md bg-white dark:bg-slate-900">
                    <CardHeader className="pb-0">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-indigo-500" /> Student Acquisition Trend
                                </CardTitle>
                                <CardDescription>Inquiries vs Registered Students (Last 6 Months)</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[350px] p-6 pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={initialAcquisition} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', background: '#fff' }}
                                    cursor={{ fill: '#f1f5f9' }}
                                />
                                <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
                                <Bar dataKey="enquiries" name="Leads/Inquiries" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="students" name="Admissions" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md bg-white dark:bg-slate-900">
                    <CardHeader className="pb-0">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <IndianRupee className="w-5 h-5 text-emerald-500" /> Revenue Growth Trend
                        </CardTitle>
                        <CardDescription>Monthly fee collection trajectory.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] p-6 pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={initialRevenue} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                    tickFormatter={(value) => `₹${value / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', background: '#fff' }}
                                    formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Revenue']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRev)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 2: Conversion Sources & Strategy */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                <Card className="border-none shadow-md bg-white dark:bg-slate-900 lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <PieIcon className="w-5 h-5 text-amber-500" /> Channel Insights
                        </CardTitle>
                        <CardDescription>Where your admissions are coming from.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex flex-col items-center justify-center p-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={initialConversion?.sourceBreakdown || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="converted"
                                >
                                    {initialConversion?.sourceBreakdown?.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md bg-white dark:bg-slate-900 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <ArrowUpRight className="w-5 h-5 text-indigo-500" /> Channel Performance Metrics
                        </CardTitle>
                        <CardDescription>Detailed conversion rates by acquisition channel.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase text-[10px] font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Source Channel</th>
                                        <th className="px-6 py-4">Total Leads</th>
                                        <th className="px-6 py-4">Conversions</th>
                                        <th className="px-6 py-4">Conversion Rate</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {(initialConversion?.sourceBreakdown || []).map((row: any, i: number) => (
                                        <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                                {row.name}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{row.total}</td>
                                            <td className="px-6 py-4 font-semibold text-emerald-600 dark:text-emerald-400">{row.converted}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-indigo-500" style={{ width: `${row.rate}%` }}></div>
                                                    </div>
                                                    <span className="font-bold">{row.rate}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
