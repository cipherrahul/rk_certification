"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { generateReportCardPDF } from "@/lib/pdf/report-card-pdf";

export function DownloadReportCard({ resultId }: { resultId: string }) {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const url = await generateReportCardPDF(resultId);
            if (url) {
                window.open(url, "_blank");
            } else {
                alert("Failed to generate PDF. Make sure storage bucket exists or contact admin.");
            }
        } catch (err: any) {
            console.error("Download error:", err);
            alert(`An error occurred: ${err.message || "Unknown error"}`);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Button
            size="sm"
            variant="default"
            className="bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all active:scale-95 shrink-0"
            onClick={handleDownload}
            disabled={isDownloading}
        >
            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
            {isDownloading ? "Generating..." : "Download PDF"}
        </Button>
    );
}
