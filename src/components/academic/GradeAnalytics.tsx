"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Users, TrendingDown, TrendingUp } from "lucide-react";

interface AnalyticsData {
    id: string;
    title: string;
    course: string;
    total: number;
    passed: number;
    failed: number;
    absent: number;
}

export function GradeAnalytics({ data }: { data: AnalyticsData[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border-2 border-dashed rounded-2xl bg-slate-50/50 dark:bg-slate-900/20">
                <AlertCircle className="w-10 h-10 mb-4 opacity-20" />
                <p className="text-sm font-medium">Insufficient performance data.</p>
                <p className="text-[10px] uppercase tracking-widest mt-1">Analytics will appear once marks are recorded.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item) => {
                const passRate = ((item.passed / item.total) * 100);
                const isStruggling = passRate < 60;

                return (
                    <Card key={item.id} className={`shadow-sm border-border/60 transition-all hover:shadow-md group ${isStruggling ? "border-rose-200 bg-rose-50/10" : "hover:border-brand/40"}`}>
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-sm font-black uppercase tracking-tight line-clamp-1 text-slate-900 dark:text-white">{item.title}</CardTitle>
                                {isStruggling ? (
                                    <TrendingDown className="w-4 h-4 text-rose-500 shrink-0" />
                                ) : (
                                    <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
                                )}
                            </div>
                            <CardDescription className="text-[10px] uppercase font-bold text-slate-500 tracking-wider line-clamp-1">{item.course}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                    <p className={`text-4xl font-black tracking-tighter ${isStruggling ? "text-rose-600" : "text-emerald-600"}`}>
                                        {passRate.toFixed(0)}%
                                    </p>
                                    <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Pass Percentage</p>
                                </div>
                                <div className="text-right space-y-1">
                                    <div className="flex items-center gap-1.5 justify-end text-sm font-black text-slate-800 dark:text-slate-200">
                                        <Users className="w-3.5 h-3.5 text-slate-400" />
                                        {item.total}
                                    </div>
                                    <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Total Tested</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {/* Custom Progress Bar */}
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                                    <div
                                        className={`h-full transition-all duration-1000 ${isStruggling ? "bg-rose-500" : "bg-emerald-500"}`}
                                        style={{ width: `${passRate}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                                    <span className="text-emerald-600">{item.passed} Passed Successfully</span>
                                    <span className="text-rose-600">{item.failed} Needs Attention</span>
                                </div>
                            </div>

                            <div className={`pt-3 border-t border-border/40 flex items-center justify-between`}>
                                {isStruggling ? (
                                    <div className="flex items-center gap-1.5 text-rose-600 text-[10px] font-black uppercase tracking-widest">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        Intervention Required
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Healthy Performance
                                    </div>
                                )}
                                <div className="text-[9px] font-bold text-slate-400 italic">
                                    {item.absent > 0 ? `${item.absent} Absentees` : "Full Attendance"}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
