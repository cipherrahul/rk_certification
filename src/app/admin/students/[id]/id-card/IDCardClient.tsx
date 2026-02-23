"use client";

import { useRef, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StudentIDCard } from "@/components/students/StudentIDCard";
import { useToast } from "@/hooks/use-toast";

interface IDCardClientProps {
    student: {
        student_id: string;
        first_name: string;
        last_name: string;
        father_name: string;
        course: string;
        academic_session: string;
        mobile: string;
        photo_url?: string | null;
        id: string;
    };
}

export function IDCardClient({ student }: IDCardClientProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const [isDownloading, setIsDownloading] = useState(false);

    async function handleDownload() {
        if (!cardRef.current) return;
        setIsDownloading(true);
        try {
            const html2canvas = (await import("html2canvas")).default;
            const jsPDF = (await import("jspdf")).default;

            const canvas = await html2canvas(cardRef.current, {
                scale: 3,
                backgroundColor: null,
                useCORS: true,
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "px",
                format: [canvas.width / 3, canvas.height / 3],
            });
            pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 3, canvas.height / 3);
            pdf.save(`ID-Card-${student.student_id}.pdf`);

            toast({ title: "Downloaded!", description: `ID card saved as PDF.` });
        } catch (err: unknown) {
            console.error(err);
            toast({ title: "Error", description: "Failed to download ID card.", variant: "destructive" });
        } finally {
            setIsDownloading(false);
        }
    }

    function handlePrint() {
        window.print();
    }

    return (
        <div className="container px-4 py-8 mx-auto max-w-3xl">
            <Link href={`/admin/students/${student.id}`}>
                <Button variant="ghost" className="mb-6 -ml-2 text-muted-foreground hover:text-foreground print:hidden">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Profile
                </Button>
            </Link>

            <h1 className="text-3xl font-bold tracking-tight mb-1 print:hidden">Student ID Card</h1>
            <p className="text-muted-foreground mb-8 print:hidden">
                Preview the ID card below. Download as PDF or print directly.
            </p>

            {/* Card Preview */}
            <Card className="shadow-sm border-slate-200 dark:border-slate-800 mb-6 print:border-0 print:shadow-none">
                <CardHeader className="print:hidden">
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>{student.first_name} {student.last_name} — {student.student_id}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-10 print:py-0 print:px-0 bg-slate-50 dark:bg-slate-900/30 rounded-b-xl">
                    <StudentIDCard ref={cardRef} student={student} />
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 print:hidden">
                <Button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-base"
                >
                    <Download className="w-4 h-4 mr-2" />
                    {isDownloading ? "Generating PDF..." : "Download as PDF"}
                </Button>
                <Button
                    onClick={handlePrint}
                    variant="outline"
                    className="flex-1 h-12 text-base"
                >
                    <Printer className="w-4 h-4 mr-2" />
                    Print ID Card
                </Button>
            </div>
        </div>
    );
}
