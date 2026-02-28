"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Library, Loader2, Link as LinkIcon, FileText, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getStudyMaterials, createStudyMaterial, deleteStudyMaterial } from "@/app/actions/learning";
import { getAllCoursesAction } from "@/lib/actions/course.action";

export default function AdminStudyMaterialsPage() {
    const { toast } = useToast();
    const [materials, setMaterials] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [courseId, setCourseId] = useState("");
    const [subject, setSubject] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [materialType, setMaterialType] = useState("Video");
    const [fileUrl, setFileUrl] = useState("");

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [matRes, coursesRes] = await Promise.all([
                getStudyMaterials(),
                getAllCoursesAction()
            ]);
            setMaterials(matRes || []);
            if (coursesRes.success) setCourses(coursesRes.data || []);
        } catch (error) {
            toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async () => {
        if (!courseId || !subject || !title || !fileUrl) {
            toast({ title: "Validation Error", description: "Please fill all required fields", variant: "destructive" });
            return;
        }

        setIsSaving(true);
        try {
            await createStudyMaterial({
                course_id: courseId,
                subject,
                title,
                description,
                material_type: materialType,
                file_url: fileUrl
            });
            toast({ title: "Success", description: "Material uploaded successfully" });
            setTitle("");
            setDescription("");
            setFileUrl("");
            fetchData();
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Failed to save material", variant: "destructive" });
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this material?")) return;
        try {
            await deleteStudyMaterial(id);
            toast({ title: "Success", description: "Material deleted successfully" });
            fetchData();
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Failed to delete", variant: "destructive" });
        }
    };

    return (
        <div className="container px-4 py-8 mx-auto space-y-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">Study Materials</h1>
                <p className="text-muted-foreground text-sm font-medium">Upload recorded lectures, PDFs, and notes for students.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Create Form */}
                <Card className="lg:col-span-1 shadow-sm h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg">Upload Material</CardTitle>
                        <CardDescription>Add new resources.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Course</label>
                            <Select value={courseId} onValueChange={setCourseId}>
                                <SelectTrigger><SelectValue placeholder="Select Course" /></SelectTrigger>
                                <SelectContent>
                                    {courses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Subject</label>
                            <Input placeholder="e.g. Science" value={subject} onChange={e => setSubject(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Title</label>
                            <Input placeholder="e.g. Chapter 1 Notes" value={title} onChange={e => setTitle(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Type</label>
                            <Select value={materialType} onValueChange={setMaterialType}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Video">Video / Recorded Lecture</SelectItem>
                                    <SelectItem value="PDF">PDF Document</SelectItem>
                                    <SelectItem value="Link">External Link</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Description (Optional)</label>
                            <Input placeholder="Short description" value={description} onChange={e => setDescription(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">File URL / Drive Link</label>
                            <Input placeholder="https://..." value={fileUrl} onChange={e => setFileUrl(e.target.value)} />
                        </div>

                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 mt-4" onClick={handleCreate} disabled={isSaving}>
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                            Upload Material
                        </Button>
                    </CardContent>
                </Card>

                {/* List */}
                <Card className="lg:col-span-2 shadow-sm">
                    <CardHeader className="border-b border-border/40">
                        <CardTitle className="text-lg">Uploaded Resources</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="p-12 text-center text-muted-foreground"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" /></div>
                        ) : materials.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="pl-6">Type</TableHead>
                                        <TableHead>Details</TableHead>
                                        <TableHead>Link</TableHead>
                                        <TableHead className="text-right pr-6">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {materials.map((mat) => (
                                        <TableRow key={mat.id}>
                                            <TableCell className="pl-6">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-600">
                                                    {mat.material_type === 'Video' ? <Video className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-bold text-gray-900">{mat.title}</div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs font-medium text-indigo-600">{mat.courses?.name}</span>
                                                    <span className="text-xs font-medium text-gray-400">&bull;</span>
                                                    <span className="text-xs font-medium text-gray-600">{mat.subject}</span>
                                                </div>
                                                {mat.description && <div className="text-xs text-gray-500 mt-1">{mat.description}</div>}
                                            </TableCell>
                                            <TableCell>
                                                <a href={mat.file_url} target="_blank" rel="noreferrer" className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                                                    <LinkIcon className="w-4 h-4 mr-1" /> Open
                                                </a>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button variant="ghost" size="sm" className="text-rose-500" onClick={() => handleDelete(mat.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="p-12 text-center text-muted-foreground">
                                <Library className="w-8 h-8 mx-auto mb-4 opacity-20" />
                                No materials uploaded yet.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
