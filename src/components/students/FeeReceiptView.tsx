import React, { useRef, useState } from "react";
import { CheckCircle, Phone, MapPin, Receipt, ShieldCheck, Download, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface FeeReceiptViewProps {
    receipt: {
        receipt_number: string;
        month: string;
        total_fees: number;
        paid_amount: number;
        remaining_amount: number;
        payment_date: string;
        payment_mode: string;
        notes?: string;
        students: {
            first_name: string;
            last_name: string;
            course: string;
            student_id: string;
            academic_session: string;
            branches?: {
                address: string;
                contact_number: string;
                email: string;
            };
        };
    };
}

export const FeeReceiptView = React.forwardRef<HTMLDivElement, FeeReceiptViewProps>(
    ({ receipt }, ref) => {
        const localRef = useRef<HTMLDivElement>(null);
        // Use external ref if provided, otherwise use local ref
        const receiptRef = (ref || localRef) as React.RefObject<HTMLDivElement>;

        const [isDownloading, setIsDownloading] = useState(false);

        const s = receipt.students;
        const issueDate = new Date(receipt.payment_date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

        // Calculate balance gracefully
        const remaining = Number(receipt.remaining_amount);
        const status = remaining <= 0 ? "PAID" : "PARTIAL";

        const handleDownload = async () => {
            if (!receiptRef.current) return;
            setIsDownloading(true);
            try {
                // Ensure the element is visible for html2canvas
                const canvas = await html2canvas(receiptRef.current, {
                    scale: 4, // Ultra-high resolution (4x)
                    useCORS: true,
                    logging: false,
                    backgroundColor: "#ffffff",
                });

                const imgData = canvas.toDataURL("image/jpeg", 1.0);
                const pdf = new jsPDF("p", "mm", "a4");
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

                pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
                pdf.save(`Fee_Receipt_${receipt.receipt_number}.pdf`);
            } catch (error) {
                console.error("Error generating PDF:", error);
            } finally {
                setIsDownloading(false);
            }
        };

        return (
            <div className="flex flex-col items-center gap-6 w-full">
                <div className="w-full flex justify-end max-w-3xl pe-2 print:hidden cursor-pointer">
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                        {isDownloading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Download className="w-4 h-4 mr-2" />
                        )}
                        {isDownloading ? "Generating PDF..." : "Download Receipt"}
                    </button>
                </div>

                <div
                    ref={receiptRef}
                    id="fee-receipt"
                    className="w-full max-w-4xl mx-auto bg-white overflow-hidden border-2 border-black print:border-black shadow-none rounded-none relative font-serif text-black"
                >
                    {/* Repeating Background Watermark */}
                    <div className="absolute inset-0 pointer-events-none select-none z-0 opacity-[0.03] overflow-hidden flex flex-wrap gap-x-20 gap-y-16 p-8">
                        {Array.from({ length: 48 }).map((_, i) => (
                            <div key={i} className="text-2xl font-black -rotate-45 whitespace-nowrap">
                                RK INSTITUTION
                            </div>
                        ))}
                    </div>

                    {/* Header: Horizontal Layout */}
                    <div className="px-8 py-6 border-b-2 border-black flex flex-row items-center justify-between gap-8 bg-white/90 text-black relative z-10 backdrop-blur-[2px]">
                        {/* Brand & Address */}
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 border-2 border-black flex items-center justify-center">
                                <span className="text-black font-black text-3xl tracking-tighter">RK</span>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-3xl font-black tracking-tight text-black uppercase">RK Institution</h1>
                                <p className="text-sm font-bold mt-1">Professional Excellence Since 2016</p>
                                <div className="flex flex-col mt-2 text-xs font-bold space-y-0.5">
                                    <span className="flex items-center gap-1">{s.branches?.address || "A-9 Adarsh Nagar, Delhi 110033"}</span>
                                    <span className="flex items-center gap-1">Tel: {s.branches?.contact_number || "+91 7533042633"}</span>
                                    <span className="flex items-center gap-1">Email: {s.branches?.email || "info@rkinstitution.com"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Receipt Details */}
                        <div className="text-right flex flex-col items-end border-l-2 border-black pl-8 h-24 justify-center">
                            <h2 className="text-xl font-black uppercase tracking-widest mb-1 underline">Fee Receipt</h2>
                            <div className="font-mono text-lg font-bold">No: {receipt.receipt_number}</div>
                            <div className="text-sm font-bold mt-1">Date: {issueDate}</div>
                        </div>
                    </div>

                    {/* Main Content: Horizontal Information Flow */}
                    <div className="p-8">
                        <div className="grid grid-cols-2 gap-12">
                            {/* Student Information */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-black uppercase tracking-wider border-b-2 border-black pb-1 mb-4 w-fit">Student Details</h3>
                                <div className="space-y-2">
                                    <div className="flex gap-4 border-b border-gray-200 pb-1">
                                        <span className="text-xs font-bold uppercase w-24">Name:</span>
                                        <span className="text-sm font-black uppercase">{s.first_name} {s.last_name}</span>
                                    </div>
                                    <div className="flex gap-4 border-b border-gray-200 pb-1">
                                        <span className="text-xs font-bold uppercase w-24">Student ID:</span>
                                        <span className="text-sm font-bold font-mono">{s.student_id}</span>
                                    </div>
                                    <div className="flex gap-4 border-b border-gray-200 pb-1">
                                        <span className="text-xs font-bold uppercase w-24">Course:</span>
                                        <span className="text-sm font-black">{s.course}</span>
                                    </div>
                                    <div className="flex gap-4 border-b border-gray-200 pb-1">
                                        <span className="text-xs font-bold uppercase w-24">Session:</span>
                                        <span className="text-sm font-bold">{s.academic_session}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Summary */}
                            <div className="space-y-2">
                                <h3 className="text-sm font-black uppercase tracking-wider border-b-2 border-black pb-1 mb-4 w-fit">Payment Summary</h3>
                                <div className="border-2 border-black p-4 space-y-3">
                                    <div className="flex justify-between text-sm items-center border-b border-gray-100 pb-1">
                                        <span className="font-bold">Month / Installment:</span>
                                        <span className="font-black uppercase tracking-wide">{receipt.month}</span>
                                    </div>
                                    <div className="flex justify-between text-sm items-center border-b border-gray-100 pb-1">
                                        <span className="font-bold">Payment Mode:</span>
                                        <span className="font-black uppercase tracking-wide">{receipt.payment_mode}</span>
                                    </div>

                                    <div className="space-y-1 mt-4">
                                        <div className="flex justify-between text-xs font-bold mb-1">
                                            <span>Full Fee Amount:</span>
                                            <span>₹{Number(receipt.total_fees).toLocaleString("en-IN")}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-black border-y-2 border-black py-1">
                                            <span className="uppercase">Amount Received:</span>
                                            <span>₹{Number(receipt.paid_amount).toLocaleString("en-IN")}</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold pt-1">
                                            <span>Outstanding Balance:</span>
                                            <span className={remaining > 0 ? "underline" : ""}>₹{remaining.toLocaleString("en-IN")}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notes Section if exists */}
                        {receipt.notes && (
                            <div className="mt-8 border-2 border-black p-3 text-xs">
                                <span className="font-black uppercase block mb-1">Remarks:</span>
                                <p className="font-medium italic">{receipt.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Footer: Horizontal Metadata */}
                    <div className="px-8 pt-6 pb-10 border-t-2 border-black flex flex-row items-center justify-between text-[11px] font-bold uppercase tracking-tight bg-white relative z-10">
                        <div className="flex items-center gap-2 border-2 border-black px-4 py-2 bg-white">
                            <CheckCircle className="w-4 h-4 text-black" />
                            <span className="leading-none">Verified Digital Document</span>
                        </div>
                        <div className="text-right space-y-1">
                            <p>Computer Generated Receipt — Valid without signature</p>
                            <p className="opacity-70">ISO 9001:2015 Educational Standard Compliant</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

FeeReceiptView.displayName = "FeeReceiptView";

