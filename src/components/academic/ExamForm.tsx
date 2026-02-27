"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { examSchema, ExamFormValues } from "@/lib/schemas/exam";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { getAllCoursesAction } from "@/lib/actions/course.action";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getBranchesAction } from "@/lib/actions/branch.action";
import { createExamAction } from "@/lib/actions/exam.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Branch {
    id: string;
    name: string;
}

export function ExamForm() {
    const { toast } = useToast();
    const router = useRouter();
    const [branches, setBranches] = useState<Branch[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<ExamFormValues>({
        resolver: zodResolver(examSchema),
        defaultValues: {
            title: "",
            course: "",
            academicSession: "2026-27",
            totalMarks: 100,
            passingMarks: 33,
            branchId: undefined,
            examDate: new Date(),
        },
    });

    useEffect(() => {
        getBranchesAction().then(res => {
            if (res.success) setBranches(res.data);
        });
        getAllCoursesAction().then(res => {
            if (res.success) setCourses(res.data || []);
        });
    }, []);

    async function onSubmit(data: ExamFormValues) {
        setIsSubmitting(true);
        try {
            const res = await createExamAction(data);
            if (res.success) {
                toast({ title: "Success", description: "Exam scheduled successfully!" });
                router.push("/admin/academic");
                router.refresh();
            } else {
                toast({ title: "Error", description: res.error || "Failed to schedule exam", variant: "destructive" });
            }
        } catch (err) {
            toast({ title: "Error", description: err instanceof Error ? err.message : "An unexpected error occurred", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card className="max-w-2xl mx-auto shadow-sm border-border/60">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-border/40">
                <CardTitle>Schedule New Exam</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Exam Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Mid-Term Examination 2026" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="course"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Course</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select course" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {courses.map(c => (
                                                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="academicSession"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Academic Session</FormLabel>
                                        <FormControl>
                                            <Input placeholder="2026-27" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="examDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Exam Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={(date) => field.onChange(date || undefined)}
                                                    disabled={(date) =>
                                                        date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="branchId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Branch (Optional)</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(value === "none" ? undefined : value)}
                                            value={field.value || "none"}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="All Branches" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="none">All Branches</SelectItem>
                                                {branches.map(b => (
                                                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="totalMarks"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Marks</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="passingMarks"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Passing Marks</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button disabled={isSubmitting} className="w-full sm:w-auto min-w-[150px] bg-brand hover:bg-brand/90 transition-all">
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                {isSubmitting ? "Scheduling..." : "Schedule Exam"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
