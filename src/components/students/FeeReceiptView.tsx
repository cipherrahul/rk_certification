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
                    scale: 2, // Higher resolution
                    useCORS: true,
                    logging: false,
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
                    className="w-full max-w-3xl mx-auto bg-white overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.08)] print:shadow-none rounded-2xl relative font-sans"
                >
                    {/* Background Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none z-0">
                        <ShieldCheck className="w-96 h-96" />
                    </div>

                    {/* Top Border Accent */}
                    <div className="h-3 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 absolute top-0 left-0 z-10" />

                    {/* Receipt Header */}
                    <div className="px-8 pt-10 pb-6 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 bg-white/80 backdrop-blur-sm">
                        {/* Brand */}
                        <div className="flex items-center gap-5 w-full md:w-auto">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-lg shadow-indigo-200">
                                <span className="text-white font-black text-2xl tracking-tighter">RK</span>
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 uppercase">RK Institution</h1>
                                <div className="flex flex-col mt-1 space-y-0.5 text-xs font-medium text-slate-500">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                                        <span>A-9 Adarsh Nagar, Delhi 110033</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Phone className="w-3.5 h-3.5 text-indigo-500" />
                                        <span>+91 7533042633</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Receipt Meta */}
                        <div className="flex flex-col items-start md:items-end w-full md:w-auto bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex flex-col items-start md:items-end w-full">
                                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                    <Receipt className="w-3.5 h-3.5" />
                                    Official Receipt
                                </span>
                                <span className="text-xl font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-200">
                                    {receipt.receipt_number}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {status}
                                </div>
                                <span className="text-xs font-medium text-slate-500">{issueDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="p-8 relative z-10 bg-white/95">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Left Column: Student Details */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Billed To</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Student Name</p>
                                            <p className="text-lg font-bold text-slate-900">{s.first_name} {s.last_name}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Enrollment ID</p>
                                                <p className="text-sm font-mono font-bold text-indigo-700">{s.student_id}</p>
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Session</p>
                                                <p className="text-sm font-bold text-slate-700">{s.academic_session}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Course Registered</p>
                                            <p className="text-base font-semibold text-slate-800">{s.course}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Payment Details */}
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-between h-full shadow-inner">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2 flex items-center justify-between">
                                        <span>Payment Summary</span>
                                        <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-xs">{receipt.month}</span>
                                    </h3>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                                            <span>Payment Mode</span>
                                            <span className="text-slate-900 font-bold capitalize">{receipt.payment_mode}</span>
                                        </div>
                                        {receipt.notes && (
                                            <div className="text-xs text-slate-500 bg-white p-2 rounded border border-slate-200 italic">
                                                Note: {receipt.notes}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-semibold text-slate-500">Total Course Fee</span>
                                            <span className="font-bold text-slate-700">₹{Number(receipt.total_fees).toLocaleString("en-IN")}</span>
                                        </div>

                                        <div className="flex justify-between items-center relative py-3">
                                            <div className="absolute inset-x-0 bottom-0 h-px bg-slate-200" />
                                            <span className="font-bold text-slate-800">Amount Paid Now</span>
                                            <span className="text-xl font-black text-emerald-600">₹{Number(receipt.paid_amount).toLocaleString("en-IN")}</span>
                                        </div>

                                        <div className="flex justify-between text-sm pt-2">
                                            <span className="font-bold text-slate-600">Remaining Balance</span>
                                            <span className={`font-bold ${remaining > 0 ? 'text-red-500' : 'text-slate-400'}`}>
                                                ₹{remaining.toLocaleString("en-IN")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="bg-slate-900 text-slate-400 px-8 py-5 flex flex-col md:flex-row items-center justify-between text-xs relative z-10">
                        <div className="flex items-center gap-2 mb-2 md:mb-0 text-emerald-400 font-medium">
                            <CheckCircle className="w-4 h-4" />
                            <span>Digitally Verified & Secured</span>
                        </div>
                        <div className="text-center md:text-right font-medium">
                            <p>This is a computer generated document. No signature is required.</p>
                            <p className="text-slate-500 mt-0.5">Thank you for choosing RK Institution.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

FeeReceiptView.displayName = "FeeReceiptView";

