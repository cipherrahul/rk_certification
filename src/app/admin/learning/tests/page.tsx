"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, ListChecks, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
    getOnlineTests,
    createOnlineTest,
    deleteOnlineTest,
    getTestQuestions,
    addTestQuestion,
    deleteTestQuestion
} from "@/app/actions/learning";
import { getAllCoursesAction } from "@/lib/actions/course.action";

export default function AdminOnlineTestsPage() {
    const { toast } = useToast();
    const [tests, setTests] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSavingTest, setIsSavingTest] = useState(false);

    // Test Form
    const [courseId, setCourseId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [durationMinutes, setDurationMinutes] = useState("30");
    const [maxMarks, setMaxMarks] = useState("100");
    const [passingMarks, setPassingMarks] = useState("40");

    // Questions Management
    const [selectedTest, setSelectedTest] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const [isSavingQuestion, setIsSavingQuestion] = useState(false);

    // Question Form
    const [qText, setQText] = useState("");
    const [qType, setQType] = useState("MCQ");
    const [options, setOptions] = useState("Option A, Option B, Option C, Option D"); // Comma-separated for simple UI
    const [correctOption, setCorrectOption] = useState("");
    const [qMarks, setQMarks] = useState("1");

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [testRes, coursesRes] = await Promise.all([
                getOnlineTests(),
                getAllCoursesAction()
            ]);
            setTests(testRes || []);
            if (coursesRes.success) setCourses(coursesRes.data || []);
        } catch (error) {
            toast({ title: "Error", description: "Failed to load tests", variant: "destructive" });
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateTest = async () => {
        if (!courseId || !title || !startTime || !endTime) {
            toast({ title: "Validation Error", description: "Please fill required fields", variant: "destructive" });
            return;
        }
        setIsSavingTest(true);
        try {
            await createOnlineTest({
                course_id: courseId,
                title,
                description,
                start_time: new Date(startTime).toISOString(),
                end_time: new Date(endTime).toISOString(),
                duration_minutes: parseInt(durationMinutes),
                max_marks: parseInt(maxMarks),
                passing_marks: parseInt(passingMarks)
            });
            toast({ title: "Success", description: "Test created. You can now add questions." });
            setTitle("");
            fetchData();
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Failed to create", variant: "destructive" });
        }
        setIsSavingTest(false);
    };

    const handleDeleteTest = async (id: string) => {
        if (!confirm("Are you sure? This deletes the test, all questions, and submissions permanently.")) return;
        try {
            await deleteOnlineTest(id);
            if (selectedTest?.id === id) setSelectedTest(null);
            toast({ title: "Success", description: "Test deleted" });
            fetchData();
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Failed to delete test", variant: "destructive" });
        }
    };

    const viewTestDetails = async (test: any) => {
        setSelectedTest(test);
        setLoadingQuestions(true);
        try {
            const qs = await getTestQuestions(test.id);
            setQuestions(qs || []);
        } catch (error: any) {
            toast({ title: "Error", description: "Failed to load questions", variant: "destructive" });
        }
        setLoadingQuestions(false);
    };

    const handleAddQuestion = async () => {
        if (!qText || !correctOption) {
            toast({ title: "Validation Error", description: "Question text and correct option are required.", variant: "destructive" });
            return;
        }
        setIsSavingQuestion(true);
        try {
            const optsArray = qType === "MCQ" ? options.split(",").map(s => s.trim()) : null;
            await addTestQuestion({
                test_id: selectedTest.id,
                question_text: qText,
                question_type: qType,
                options: optsArray,
                correct_option: correctOption.trim(),
                marks: parseInt(qMarks)
            });
            toast({ title: "Success", description: "Question added" });
            setQText("");
            viewTestDetails(selectedTest);
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Failed to add question", variant: "destructive" });
        }
        setIsSavingQuestion(false);
    };

    const handleDeleteQuestion = async (id: string) => {
        if (!confirm("Delete question?")) return;
        try {
            await deleteTestQuestion(id);
            toast({ title: "Success", description: "Question deleted" });
            viewTestDetails(selectedTest);
        } catch (error: any) {
            toast({ title: "Error", description: "Failed to delete question", variant: "destructive" });
        }
    };

    return (
        <div className="container px-4 py-8 mx-auto space-y-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">Online Tests</h1>
                <p className="text-muted-foreground text-sm font-medium">Create MCQ tests, add questions, and track automated grading.</p>
            </div>

            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {/* Left Col: Setup & List */}
                <div className="xl:col-span-1 space-y-8">
                    {/* Create Form */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Create New Test</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Select value={courseId} onValueChange={setCourseId}>
                                <SelectTrigger><SelectValue placeholder="Course" /></SelectTrigger>
                                <SelectContent>{courses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                            </Select>
                            <Input placeholder="Test Title" value={title} onChange={e => setTitle(e.target.value)} />
                            <div className="grid grid-cols-2 gap-2">
                                <Input type="datetime-local" placeholder="Start Time" value={startTime} onChange={e => setStartTime(e.target.value)} title="Start Time" />
                                <Input type="datetime-local" placeholder="End Time" value={endTime} onChange={e => setEndTime(e.target.value)} title="End Time" />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <Input type="number" placeholder="Mins" value={durationMinutes} onChange={e => setDurationMinutes(e.target.value)} title="Duration (Minutes)" />
                                <Input type="number" placeholder="Max Pts" value={maxMarks} onChange={e => setMaxMarks(e.target.value)} title="Max Marks" />
                                <Input type="number" placeholder="Pass Pts" value={passingMarks} onChange={e => setPassingMarks(e.target.value)} title="Passing Marks" />
                            </div>
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={handleCreateTest} disabled={isSavingTest}>
                                {isSavingTest ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                                Create Test
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Test List */}
                    <Card className="shadow-sm">
                        <CardHeader><CardTitle className="text-lg">Active Tests</CardTitle></CardHeader>
                        <CardContent className="p-0">
                            {isLoading ? (
                                <div className="p-8 text-center text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
                            ) : (
                                <Table>
                                    <TableBody>
                                        {tests.map(test => (
                                            <TableRow key={test.id} className={selectedTest?.id === test.id ? "bg-indigo-50/50" : "cursor-pointer"} onClick={() => viewTestDetails(test)}>
                                                <TableCell className="pl-6 py-4">
                                                    <div className="font-bold">{test.title}</div>
                                                    <div className="text-xs text-indigo-600 font-medium mb-1">{test.courses?.name}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(test.start_time).toLocaleDateString()} &bull; {test.duration_minutes}m &bull; {test.maxMarks} Pts
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <Button variant="ghost" size="sm" className="text-rose-500 h-8 w-8 p-0 z-10 relative" onClick={(e) => { e.stopPropagation(); handleDeleteTest(test.id); }}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Col: Questions Manager */}
                <div className="xl:col-span-2">
                    {selectedTest ? (
                        <Card className="shadow-sm h-full flex flex-col border-indigo-100 ring-1 ring-indigo-50">
                            <CardHeader className="bg-indigo-50/50 border-b border-indigo-100">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl text-indigo-900 flex items-center gap-2">
                                            <ListChecks className="w-5 h-5" /> Questions: {selectedTest.title}
                                        </CardTitle>
                                        <CardDescription>{questions.length} Questions Added | {questions.reduce((sum, q) => sum + q.marks, 0)} Total Marks (Target: {selectedTest.max_marks})</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-6 space-y-8 flex-1">
                                {/* Add Question Form */}
                                <div className="bg-white border rounded-xl p-5 space-y-4 shadow-sm">
                                    <h3 className="font-bold text-sm text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                        <Plus className="w-4 h-4 text-indigo-500" /> Add New Question
                                    </h3>
                                    <div className="space-y-3">
                                        <Input placeholder="Enter question text..." value={qText} onChange={e => setQText(e.target.value)} />
                                        <div className="grid grid-cols-4 gap-3">
                                            <Select value={qType} onValueChange={setQType}>
                                                <SelectTrigger className="col-span-1"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="MCQ">Multiple Choice</SelectItem>
                                                    <SelectItem value="TrueFalse">True / False</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {qType === "MCQ" ? (
                                                <Input className="col-span-3" placeholder="Comma separated options (e.g. A, B, C, D)" value={options} onChange={e => setOptions(e.target.value)} />
                                            ) : (
                                                <div className="col-span-3 flex items-center text-sm text-muted-foreground">Options automatically set to True and False.</div>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-4 gap-3">
                                            <Input className="col-span-3 bg-emerald-50 border-emerald-200 placeholder:text-emerald-400 font-medium" placeholder="Exact text of Correct Answer" value={correctOption} onChange={e => setCorrectOption(e.target.value)} />
                                            <Input className="col-span-1" type="number" placeholder="Marks" value={qMarks} onChange={e => setQMarks(e.target.value)} />
                                        </div>
                                        <div className="flex justify-end">
                                            <Button onClick={handleAddQuestion} disabled={isSavingQuestion} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                                                {isSavingQuestion ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Save Question"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Question List */}
                                <div className="space-y-4">
                                    <h3 className="font-bold text-sm text-gray-500 uppercase tracking-widest border-b pb-2">Added Questions</h3>
                                    {loadingQuestions ? (
                                        <div className="text-center p-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-300" /></div>
                                    ) : questions.length > 0 ? (
                                        <div className="space-y-3">
                                            {questions.map((q, i) => (
                                                <div key={q.id} className="relative p-4 border rounded-xl bg-slate-50 hover:bg-white transition-colors group">
                                                    <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-rose-500 bg-rose-50 hover:bg-rose-100 hover:text-rose-600" onClick={() => handleDeleteQuestion(q.id)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                                                            {i + 1}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-medium text-gray-900 mb-2 pr-8">{q.question_text}</div>
                                                            {q.question_type === 'MCQ' && q.options && (
                                                                <div className="grid grid-cols-2 gap-2 mb-3">
                                                                    {q.options.map((opt: string, idx: number) => (
                                                                        <div key={idx} className={`p-2 rounded-lg text-sm border font-medium ${opt === q.correct_option ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-white border-gray-200 text-gray-600'}`}>
                                                                            <span className="text-gray-400 mr-2">{String.fromCharCode(65 + idx)}.</span> {opt}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {q.question_type === 'TrueFalse' && (
                                                                <div className="flex gap-4 mb-3">
                                                                    {['True', 'False'].map(opt => (
                                                                        <div key={opt} className={`px-4 py-2 rounded-lg text-sm border font-medium ${opt === q.correct_option ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-white border-gray-200 text-gray-600'}`}>
                                                                            {opt}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            <div className="flex items-center justify-between mt-4 text-xs font-semibold text-gray-400">
                                                                <Badge variant="outline" className="bg-white">{q.question_type}</Badge>
                                                                <div>Marks: <span className="text-indigo-600 ml-1">{q.marks}</span></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-12 text-center border-2 border-dashed rounded-xl bg-slate-50/50">
                                            <Target className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                            <div className="text-sm font-medium text-gray-500">No questions added yet.</div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="h-full flex items-center justify-center bg-slate-50/50 border-dashed border-2 shadow-none min-h-[400px]">
                            <div className="text-center text-muted-foreground">
                                <ListChecks className="w-12 h-12 text-indigo-200 mx-auto mb-4 opacity-50" />
                                <h3 className="font-semibold text-lg text-slate-700">Select a Test</h3>
                                <p className="text-sm opacity-80 max-w-[250px] mx-auto mt-2">Click on a test from the active list to manage its questions.</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
