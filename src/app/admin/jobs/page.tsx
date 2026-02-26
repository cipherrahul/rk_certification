import Link from "next/link";
import { Plus, Search, MapPin, Clock, MoreHorizontal, Edit, Trash2, Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getJobs, deleteJob, toggleJobStatus } from "@/lib/actions/jobs";
import { format } from "date-fns";
import { revalidatePath } from "next/cache";

export default async function AdminJobsPage() {
    const jobs = await getJobs();

    async function handleDelete(id: string) {
        "use server";
        await deleteJob(id);
        revalidatePath("/admin/jobs");
    }

    async function handleToggleStatus(id: string, currentStatus: "Draft" | "Published") {
        "use server";
        await toggleJobStatus(id, currentStatus);
        revalidatePath("/admin/jobs");
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Job Openings</h1>
                    <p className="text-muted-foreground">Manage job postings and their visibility.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link href="/admin/jobs/applications">
                        <Button variant="outline" className="border-border/60 hover:bg-accent/50 gap-2">
                            <Plus className="w-4 h-4" /> View Applications
                        </Button>
                    </Link>
                    <Link href="/admin/jobs/new">
                        <Button className="bg-brand hover:bg-brand/90 text-white gap-2">
                            <Plus className="w-4 h-4" /> Create New Job
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-4 bg-accent/30 p-4 rounded-lg border border-border/50">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search jobs by title or department..." className="pl-9 h-10 border-border/50 bg-background" />
                </div>
                <Button variant="outline" className="h-10 border-border/50 bg-background text-sm font-medium">
                    Filter
                </Button>
            </div>

            <div className="border border-border/50 rounded-xl bg-background/50 overflow-hidden">
                <Table>
                    <TableHeader className="bg-accent/50">
                        <TableRow className="hover:bg-transparent border-border/50">
                            <TableHead className="w-[300px]">Job Title</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {jobs?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                    No job openings found. Create your first job posting above.
                                </TableCell>
                            </TableRow>
                        ) : (
                            jobs?.map((job) => (
                                <TableRow key={job.id} className="hover:bg-accent/30 border-border/50 transition-colors">
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col gap-0.5">
                                            <span>{job.title}</span>
                                            <span className="text-xs text-muted-foreground uppercase tracking-tight">{job.employment_type}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-medium bg-accent/80 text-foreground border-border/50">
                                            {job.department}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                            <MapPin className="w-3.5 h-3.5 text-brand/70" />
                                            {job.location}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {job.status === "Published" ? (
                                            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1 font-medium">
                                                <Globe className="w-3 h-3" /> Published
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-muted-foreground border-border/50 gap-1 font-medium bg-accent/20">
                                                <Lock className="w-3 h-3" /> Draft
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {job.created_at ? format(new Date(job.created_at), "MMM d, yyyy") : "N/A"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent/60">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 bg-background border-border shadow-xl">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <Link href={`/admin/jobs/${job.id}/edit`}>
                                                    <DropdownMenuItem className="gap-2 cursor-pointer focus:bg-brand/10 focus:text-brand">
                                                        <Edit className="w-4 h-4" /> Edit Details
                                                    </DropdownMenuItem>
                                                </Link>
                                                <form action={handleToggleStatus.bind(null, job.id, job.status)}>
                                                    <DropdownMenuItem asChild className="gap-2 cursor-pointer focus:bg-brand/10 focus:text-brand">
                                                        <button type="submit" className="w-full text-left flex items-center gap-2 p-2">
                                                            {job.status === "Published" ? (
                                                                <>
                                                                    <Lock className="w-4 h-4" /> Move to Draft
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Globe className="w-4 h-4" /> Publish Now
                                                                </>
                                                            )}
                                                        </button>
                                                    </DropdownMenuItem>
                                                </form>
                                                <DropdownMenuSeparator />
                                                <form action={handleDelete.bind(null, job.id)}>
                                                    <DropdownMenuItem asChild className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                                                        <button type="submit" className="w-full text-left flex items-center gap-2 p-2">
                                                            <Trash2 className="w-4 h-4" /> Delete Job
                                                        </button>
                                                    </DropdownMenuItem>
                                                </form>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
