"use client";

import { useState } from "react";
import { Search, CheckCircle, XCircle, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";

export default function VerifyPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [result, setResult] = useState<any | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setHasSearched(true);
        setResult(null);

        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('certificates')
                .select('*')
                .eq('certificate_id', searchQuery.trim().toUpperCase())
                .single();

            if (error || !data) {
                setResult(null);
            } else {
                setResult(data);
            }
        } catch (err) {
            console.error(err);
            setResult(null);
        } finally {
            setIsSearching(false);
        }
    }

    return (
        <div className="container px-4 md:px-6 py-16 mx-auto max-w-4xl min-h-[calc(100vh-8rem)]">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">
                    Verify Certificate
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Enter the unique Certificate ID to verify its authenticity and view the details.
                </p>
            </div>

            <Card className="shadow-lg border-slate-200 dark:border-slate-800">
                <CardHeader className="bg-slate-50 border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800 pb-8 pt-8 px-6 md:px-10">
                    <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl mx-auto w-full">
                        <Input
                            placeholder="e.g. RK2026PROG001"
                            className="h-14 text-lg font-medium tracking-wider"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button type="submit" size="lg" className="h-14 px-8 text-base bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isSearching}>
                            {isSearching ? <Search className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5 mr-2" />}
                            {isSearching ? "Verifying..." : "Verify"}
                        </Button>
                    </form>
                </CardHeader>

                {hasSearched && !isSearching && (
                    <CardContent className="p-6 md:p-10 bg-white dark:bg-slate-950">
                        {result ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-emerald-50 border border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/50">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-emerald-100 rounded-full dark:bg-emerald-900/50">
                                            <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-300">Valid Certificate</h3>
                                            <p className="text-emerald-700 dark:text-emerald-400/80 mt-1">
                                                ID: <span className="font-mono font-bold tracking-wider">{result.certificate_id}</span>
                                            </p>
                                        </div>
                                    </div>
                                    {result.pdf_url && (
                                        <a href={result.pdf_url} target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-900/50">
                                                <Download className="w-4 h-4 mr-2" />
                                                Download PDF
                                            </Button>
                                        </a>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 px-2">
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Recipient Details</h4>
                                            <p className="text-2xl font-bold font-serif">{result.first_name} {result.last_name}</p>
                                            {result.father_name && <p className="text-slate-600 dark:text-slate-400 mt-1">D/O, S/O: {result.father_name}</p>}
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Certification</h4>
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1 p-1.5 bg-indigo-50 text-indigo-600 rounded-md dark:bg-indigo-900/50 dark:text-indigo-400">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-lg font-semibold">{result.certificate_type}</p>
                                                    <p className="text-slate-600 dark:text-slate-400 mt-1">Grade: <Badge variant="secondary" className="ml-1 leading-none">{result.grade}</Badge></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6 md:border-l md:border-slate-100 dark:md:border-slate-800 md:pl-8">
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Dates</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">Issue Date</p>
                                                    <p className="font-medium">{new Date(result.issue_date).toLocaleDateString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">Completion Date</p>
                                                    <p className="font-medium">{new Date(result.completion_date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Course Details</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">Duration</p>
                                                    <p className="font-medium">{result.duration}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 animate-in fade-in zoom-in-95 duration-300">
                                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 dark:bg-red-950/30">
                                    <XCircle className="w-10 h-10 text-red-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Certificate Not Found</h3>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                    We couldn't find a certificate matching the ID <span className="font-mono font-bold text-slate-900 dark:text-white px-1">{searchQuery}</span>.
                                    Please check the ID and try again.
                                </p>
                            </div>
                        )}
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
