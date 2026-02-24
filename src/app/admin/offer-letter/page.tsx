import Link from "next/link";
import { Plus, FileText, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOfferLettersAction } from "@/lib/actions/offer-letter.action";

export default async function OfferLetterListPage() {
    const letters = await getOfferLettersAction();

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Offer Letters</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Generate and manage employee offer letters.
                    </p>
                </div>
                <Link href="/admin/offer-letter/new">
                    <Button className="bg-brand hover:bg-brand/90 text-brand-foreground font-semibold">
                        <Plus className="w-4 h-4 mr-2" />
                        Generate New
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-border/60 bg-card shadow-sm">
                    <CardHeader className="pb-1 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm text-muted-foreground font-medium">Total Generated</CardTitle>
                        <FileText className="w-4 h-4 text-brand" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-foreground">{letters.length}</p>
                    </CardContent>
                </Card>
                <Card className="border-border/60 bg-card shadow-sm">
                    <CardHeader className="pb-1 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm text-muted-foreground font-medium">This Month</CardTitle>
                        <FileText className="w-4 h-4 text-brand" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-foreground">
                            {letters.filter((l) => {
                                const d = new Date(l.created_at);
                                const now = new Date();
                                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                            }).length}
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-border/60 bg-card shadow-sm">
                    <CardHeader className="pb-1 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm text-muted-foreground font-medium">Full-Time Offers</CardTitle>
                        <FileText className="w-4 h-4 text-brand" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-foreground">
                            {letters.filter((l) => l.employment_type === "Full-Time").length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Table */}
            <Card className="border-border/60 bg-card shadow-sm">
                <CardHeader className="pb-4 border-b border-border/40">
                    <CardTitle className="text-lg text-foreground">All Offer Letters</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        A list of all generated offer letters.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {letters.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                            <FileText className="w-12 h-12 text-muted-foreground/40" />
                            <p className="text-sm font-medium text-muted-foreground">No offer letters generated yet.</p>
                            <Link href="/admin/offer-letter/new">
                                <Button variant="outline" size="sm" className="mt-2">Generate First Letter</Button>
                            </Link>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-accent/40">
                                <TableRow className="border-border/40 hover:bg-transparent">
                                    <TableHead className="font-semibold text-muted-foreground pl-6">Employee</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground">Position</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground">Department</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground">Type</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground">Gross / Month</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground">Joining Date</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground">Status</TableHead>
                                    <TableHead className="text-right font-semibold text-muted-foreground pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {letters.map((letter) => (
                                    <TableRow key={letter.id} className="border-border/40 hover:bg-accent/50 transition-colors">
                                        <TableCell className="font-medium text-foreground pl-6">{letter.full_name}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{letter.position}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{letter.department}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-xs border-border/60">
                                                {letter.employment_type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm font-medium text-foreground">
                                            ₹{Number(letter.gross_salary).toLocaleString("en-IN")}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(letter.joining_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-brand/10 text-brand border-brand/20 text-xs font-medium">
                                                {letter.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex justify-end gap-1">
                                                {letter.pdf_url && (
                                                    <a href={letter.pdf_url} target="_blank" rel="noopener noreferrer">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-brand hover:bg-brand/10">
                                                            <Download className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </a>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
