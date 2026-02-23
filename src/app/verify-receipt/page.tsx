"use client";

import { useState } from "react";
import { Search, CheckCircle, XCircle, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getPaymentByReceiptNumberAction } from "@/lib/actions/fee.action";
import { FeeReceiptView } from "@/components/students/FeeReceiptView";

export default function VerifyReceiptPage() {
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [result, setResult] = useState<any | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (!query.trim()) return;
        setIsSearching(true);
        setHasSearched(true);
        setResult(null);
        try {
            const res = await getPaymentByReceiptNumberAction(query.trim().toUpperCase());
            if (res.success) setResult(res.data);
        } catch {
            setResult(null);
        } finally {
            setIsSearching(false);
        }
    }

    return (
        <div className="container px-4 md:px-6 py-16 mx-auto max-w-4xl min-h-[calc(100vh-8rem)]">
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-800 mb-6 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                    <Receipt className="w-4 h-4" />
                    Fee Receipt Verification
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">
                    Verify Fee Receipt
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                    Enter your receipt number to instantly verify your fee payment record.
                </p>
            </div>

            <Card className="shadow-lg border-slate-200 dark:border-slate-800">
                <CardHeader className="bg-slate-50 border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800 pb-8 pt-8 px-6 md:px-10">
                    <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl mx-auto w-full">
                        <Input
                            placeholder="e.g. RK-FEE-2026-00001"
                            className="h-14 text-lg font-medium tracking-wider"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <Button
                            type="submit"
                            size="lg"
                            className="h-14 px-8 text-base bg-indigo-600 hover:bg-indigo-700 text-white"
                            disabled={isSearching}
                        >
                            {isSearching ? (
                                <Search className="w-5 h-5 animate-spin" />
                            ) : (
                                <><Search className="w-5 h-5 mr-2" /> Verify</>
                            )}
                        </Button>
                    </form>
                </CardHeader>

                {hasSearched && !isSearching && (
                    <CardContent className="p-6 md:p-10 bg-white dark:bg-slate-950">
                        {result ? (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/50">
                                    <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-emerald-800 dark:text-emerald-300">Valid Receipt Found</p>
                                        <p className="text-sm text-emerald-700 dark:text-emerald-400/80">
                                            Receipt No: <span className="font-mono font-bold">{result.receipt_number}</span>
                                        </p>
                                    </div>
                                </div>
                                <FeeReceiptView receipt={result} />
                            </div>
                        ) : (
                            <div className="text-center py-12 animate-in fade-in zoom-in-95 duration-300">
                                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 dark:bg-red-950/30">
                                    <XCircle className="w-10 h-10 text-red-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Receipt Not Found</h3>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                    No receipt matching{" "}
                                    <span className="font-mono font-bold text-slate-900 dark:text-white px-1">{query}</span>{" "}
                                    was found. Please check the receipt number and try again.
                                </p>
                            </div>
                        )}
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
