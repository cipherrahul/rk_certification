import { Plus, LayoutDashboard, Settings, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getExamsAction, getGradeAnalyticsAction } from "@/lib/actions/exam.action";
import { ExamList } from "@/components/academic/ExamList";
import { GradeAnalytics } from "@/components/academic/GradeAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ExamsPage() {
    const [examsRes, analyticsRes] = await Promise.all([
        getExamsAction(),
        getGradeAnalyticsAction(),
    ]);

    const exams = examsRes.success ? examsRes.data : [];
    const analytics = analyticsRes.success ? analyticsRes.data : [];

    return (
        <div className="container px-4 py-8 mx-auto max-w-6xl space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">Academic & Exams</h1>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">Professional grade management and institutional performance tracking.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/academic/courses">
                        <Button variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-600 font-bold">
                            <GraduationCap className="w-4 h-4 mr-2" />
                            Manage Courses
                        </Button>
                    </Link>
                    <Link href="/admin/academic/subjects">
                        <Button variant="outline" className="border-brand/20 text-brand hover:bg-brand/5 hover:text-brand font-bold">
                            <Settings className="w-4 h-4 mr-2" />
                            Manage Subjects
                        </Button>
                    </Link>
                    <Link href="/admin/academic/exams/new">
                        <Button className="bg-brand hover:bg-brand/90 text-brand-foreground shadow-lg px-6 font-bold">
                            <Plus className="w-4 h-4 mr-2" />
                            Schedule New Exam
                        </Button>
                    </Link>
                </div>
            </div>

            <Tabs defaultValue="schedules" className="space-y-6">
                <TabsList className="bg-slate-100 dark:bg-slate-900 border border-border/40 p-1 rounded-xl h-12">
                    <TabsTrigger value="schedules" className="px-8 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm rounded-lg transition-all">
                        Exam Schedules
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="px-8 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm rounded-lg transition-all">
                        Grade Analytics
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="schedules">
                    <Card className="shadow-sm border-border/60 bg-card overflow-hidden">
                        <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-border/40">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Upcoming & Recent Exams</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ExamList exams={exams || []} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-brand">
                            <LayoutDashboard className="w-4 h-4" />
                            <h2 className="text-sm font-black uppercase tracking-widest">Institutional Insights</h2>
                        </div>
                        <GradeAnalytics data={analytics || []} />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
