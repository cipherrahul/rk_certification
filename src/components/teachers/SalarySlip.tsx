import React from "react";
import { CheckCircle } from "lucide-react";

interface SalarySlipProps {
    teacher: {
        teacher_id: string;
        name: string;
        department: string;
        assigned_class: string;
        subject: string;
        qualification: string;
        joining_date: string;
    };
    record: {
        slip_number: string;
        month: string;
        year: number;
        basic_salary: number;
        allowances: number;
        deductions: number;
        net_salary: number;
        payment_status: string;
        payment_date: string | null;
        slip_notes: string | null;
    };
}

export const SalarySlip = React.forwardRef<HTMLDivElement, SalarySlipProps>(
    ({ teacher, record }, ref) => {
        const gross = Number(record.basic_salary) + Number(record.allowances);

        return (
            <div
                ref={ref}
                className="w-full max-w-4xl mx-auto bg-white overflow-hidden border-2 border-black shadow-none rounded-none relative font-serif text-black"
                style={{ width: "950px" }} // Explicit width for consistent capture
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
                            <p className="text-sm font-bold mt-1 text-black">Professional Excellence Since 2016</p>
                            <div className="flex flex-col mt-2 text-xs font-bold space-y-0.5 text-black">
                                <span className="flex items-center gap-1">A-9 Adarsh Nagar, Delhi 110033</span>
                                <span className="flex items-center gap-1">Tel: +91 7533042633</span>
                            </div>
                        </div>
                    </div>

                    {/* Receipt Details */}
                    <div className="text-right flex flex-col items-end border-l-2 border-black pl-8 h-24 justify-center">
                        <h2 className="text-xl font-black uppercase tracking-widest mb-1 underline">Salary Slip</h2>
                        <div className="font-mono text-lg font-bold">No: {record.slip_number}</div>
                        <div className="text-sm font-bold mt-1 uppercase">Pay Period: {record.month} {record.year}</div>
                    </div>
                </div>

                {/* Main Content: Horizontal Information Flow */}
                <div className="p-8 relative z-10">
                    <div className="grid grid-cols-2 gap-12">
                        {/* Employee Information */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-wider border-b-2 border-black pb-1 mb-4 w-fit">Employee Details</h3>
                            <div className="space-y-2">
                                <div className="flex gap-4 border-b border-gray-200 pb-1">
                                    <span className="text-xs font-bold uppercase w-24">Name:</span>
                                    <span className="text-sm font-black uppercase">{teacher.name}</span>
                                </div>
                                <div className="flex gap-4 border-b border-gray-200 pb-1">
                                    <span className="text-xs font-bold uppercase w-24">Employee ID:</span>
                                    <span className="text-sm font-bold font-mono">{teacher.teacher_id}</span>
                                </div>
                                <div className="flex gap-4 border-b border-gray-200 pb-1">
                                    <span className="text-xs font-bold uppercase w-24">Department:</span>
                                    <span className="text-sm font-black italic">{teacher.department}</span>
                                </div>
                                <div className="flex gap-4 border-b border-gray-200 pb-1">
                                    <span className="text-xs font-bold uppercase w-24">Subject:</span>
                                    <span className="text-sm font-bold">{teacher.subject}</span>
                                </div>
                                <div className="flex gap-4 border-b border-gray-200 pb-1">
                                    <span className="text-xs font-bold uppercase w-24">Designation:</span>
                                    <span className="text-sm font-bold uppercase">{teacher.assigned_class ? `Instructor - ${teacher.assigned_class}` : 'Instructor'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Salary Summary */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-black uppercase tracking-wider border-b-2 border-black pb-1 mb-4 w-fit">Salary Summary</h3>
                            <div className="border-2 border-black p-4 space-y-3 bg-white/50">
                                <div className="flex justify-between text-sm items-center border-b border-gray-200 pb-1">
                                    <span className="font-bold uppercase text-[10px] tracking-wider">Basic Earnings:</span>
                                    <span className="font-bold">₹{Number(record.basic_salary).toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between text-sm items-center border-b border-gray-200 pb-1">
                                    <span className="font-bold uppercase text-[10px] tracking-wider">Total Allowances:</span>
                                    <span className="font-bold">₹{Number(record.allowances).toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between text-sm items-center border-b border-gray-200 pb-1">
                                    <span className="font-bold uppercase text-[10px] tracking-wider">Total Deductions:</span>
                                    <span className="font-bold text-gray-600">₹{Number(record.deductions).toLocaleString("en-IN")}</span>
                                </div>

                                <div className="space-y-1 mt-4">
                                    <div className="flex justify-between text-lg font-black border-y-2 border-black py-1">
                                        <span className="uppercase tracking-tight">Net Take Home:</span>
                                        <span>₹{Number(record.net_salary).toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold pt-1 items-center">
                                        <span className="uppercase opacity-70">Payment Status:</span>
                                        <span className="border border-black px-2 py-0.5 text-[10px] uppercase font-black bg-black text-white">{record.payment_status}</span>
                                    </div>
                                    {record.payment_date && (
                                        <div className="text-[10px] font-bold text-right pt-1 opacity-60 italic">
                                            Paid on {new Date(record.payment_date).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer: Horizontal Metadata */}
                    <div className="mt-8 border-t-2 border-black pt-6 pb-2 flex flex-row items-center justify-between text-[11px] font-bold uppercase tracking-tight relative z-10">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2 border-2 border-black px-4 py-2 bg-white">
                                <CheckCircle className="w-4 h-4 text-black" />
                                <span className="leading-none">Verified Digital Pay Slip</span>
                            </div>
                            {record.slip_notes && (
                                <div className="text-[10px] normal-case italic border-l-2 border-black pl-3 py-1">
                                    <span className="font-black uppercase block not-italic text-[9px] mb-0.5">Note:</span>
                                    {record.slip_notes}
                                </div>
                            )}
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                            <div className="h-12 w-48 border-b border-black mb-1 opacity-20" /> {/* Placeholder for digital signature */}
                            <p>Authorized Signatory — RK Institution</p>
                            <p className="opacity-50 text-[9px]">ISO 9001:2015 Educational Standard Compliant</p>
                            <p className="text-[8px] opacity-40 mt-1 uppercase">Computer Generated — Signature Not Required</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

SalarySlip.displayName = "SalarySlip";
