"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, FilePieChart } from "lucide-react";
import { generateFinancialReportPDF } from "@/lib/pdf/financial-report-pdf";
import { useToast } from "@/hooks/use-toast";

export function FinancialActions() {
    const [isGenerating, setIsGenerating] = useState(false);
    const { toast } = useToast();

    const handleDownloadReport = async () => {
        setIsGenerating(true);
        try {
            const pdfUrl = await generateFinancialReportPDF();
            if (pdfUrl) {
                window.open(pdfUrl, "_blank");
                toast({
                    title: "Success",
                    description: "Financial report generated successfully!",
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to generate report. Please try again.",
                });
            }
        } catch (error) {
            console.error("Report extraction error:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "An error occurred during report generation.",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Button
            variant="outline"
            className="shadow-sm border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
            onClick={handleDownloadReport}
            disabled={isGenerating}
        >
            {isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
                <FilePieChart className="w-4 h-4 mr-2" />
            )}
            {isGenerating ? "Generating..." : "Financial Report"}
        </Button>
    );
}
