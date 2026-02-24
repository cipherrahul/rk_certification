"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Plus, Download, CheckCircle, Clock, Trash2, Loader2, ChevronDown, ChevronUp, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { salaryRecordSchema, SalaryRecordFormValues } from "@/lib/schemas/salary.schema";
import {
    createSalaryRecordAction,
    updateSalaryPaymentStatus,
    deleteSalaryRecordAction,
} from "@/lib/actions/salary.action";
import { SalarySlip } from "./SalarySlip";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

interface SalaryRecord {
    id: string;
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
    created_at: string;
    whatsapp_status: string;
    pdf_url?: string;
}

interface Teacher {
    id: string;
    teacher_id: string;
    name: string;
    department: string;
    assigned_class: string;
    subject: string;
    qualification: string;
    joining_date: string;
}

interface SalaryManagementProps {
    teacher: Teacher;
    initialRecords: SalaryRecord[];
}

export function SalaryManagement({ teacher, initialRecords }: SalaryManagementProps) {
    const [records, setRecords] = useState<SalaryRecord[]>(initialRecords);
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const slipRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const currentYear = new Date().getFullYear();

    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<SalaryRecordFormValues>({
        // @ts-expect-error Zod config inferred types conflict with useForm output
        resolver: zodResolver(salaryRecordSchema),
        defaultValues: {
            month: MONTHS[new Date().getMonth()],
            year: currentYear,
            basicSalary: teacher ? 0 : 0,
            allowances: 0,
            deductions: 0,
            paymentStatus: "Pending",
        },
    });

    const onSubmit = async (data: SalaryRecordFormValues) => {
        setIsSubmitting(true);
        setFormError(null);
        const result = await createSalaryRecordAction(teacher.id, data);
        if (result.success) {
            // Refresh by reloading page to get new record
            window.location.reload();
        } else {
            setFormError(result.error || "Failed to create salary record.");
        }
        setIsSubmitting(false);
    };

    const handleMarkPaid = async (record: SalaryRecord) => {
        if (record.payment_status === "Paid") return;
        setUpdatingId(record.id);
        const result = await updateSalaryPaymentStatus(record.id, teacher.id, "Paid", new Date());
        if (result.success) {
            setRecords((prev) =>
                prev.map((r) =>
                    r.id === record.id
                        ? { ...r, payment_status: "Paid", payment_date: new Date().toISOString().split("T")[0] }
                        : r
                )
            );
        }
        setUpdatingId(null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this salary record? This cannot be undone.")) return;
        setDeletingId(id);
        const result = await deleteSalaryRecordAction(id, teacher.id);
        if (result.success) {
            setRecords((prev) => prev.filter((r) => r.id !== id));
        }
        setDeletingId(null);
    };

    const handleDownloadSlip = async (record: SalaryRecord) => {
        const el = slipRefs.current[record.id];
        if (!el) return;
        setDownloadingId(record.id);
        try {
            const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: [680, 420] });
            pdf.addImage(imgData, "PNG", 0, 0, 680, 420);
            pdf.save(`${record.slip_number}-${teacher.name.replace(/\s+/g, "_")}.pdf`);
        } catch (e) {
            console.error("PDF generation failed:", e);
        }
        setDownloadingId(null);
    };

    const totalPaid = records
        .filter((r) => r.payment_status === "Paid")
        .reduce((sum, r) => sum + Number(r.net_salary), 0);

    return (
        <div className="space-y-4">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: "Total Records", value: records.length, color: "text-slate-700 dark:text-slate-200" },
                    { label: "Paid", value: records.filter(r => r.payment_status === "Paid").length, color: "text-emerald-600 dark:text-emerald-400" },
                    { label: "Pending", value: records.filter(r => r.payment_status === "Pending").length, color: "text-amber-600 dark:text-amber-400" },
                ].map(({ label, value, color }) => (
                    <div key={label} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 text-center border border-slate-200 dark:border-slate-700">
                        <div className={`text-xl font-bold ${color}`}>{value}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{label}</div>
                    </div>
                ))}
            </div>

            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-base">Salary Records</CardTitle>
                            <CardDescription className="text-xs mt-0.5">
                                Total paid: <span className="font-semibold text-emerald-600">₹{totalPaid.toLocaleString("en-IN")}</span>
                            </CardDescription>
                        </div>
                        <Button
                            size="sm"
                            onClick={() => setShowForm(!showForm)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
                        >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Record
                            {showForm ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                        </Button>
                    </div>
                </CardHeader>

                {/* Add record form */}
                {showForm && (
                    <div className="mx-4 mb-4 border border-indigo-200 dark:border-indigo-800 rounded-lg bg-indigo-50/50 dark:bg-indigo-900/10 p-4">
                        <div className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-3">New Salary Record</div>
                        {formError && (
                            <div className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded px-3 py-2 mb-3 flex items-center gap-1.5">
                                <X className="w-3 h-3" /> {formError}
                            </div>
                        )}
                        <form onSubmit={handleSubmit(onSubmit as any)} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            <div>
                                <Label className="text-xs">Month *</Label>
                                <Select defaultValue={MONTHS[new Date().getMonth()]} onValueChange={(v) => setValue("month", v)}>
                                    <SelectTrigger className="h-8 text-xs mt-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MONTHS.map((m) => <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="text-xs">Year *</Label>
                                <Input type="number" defaultValue={currentYear} min={2020} max={2100} {...register("year")} className="h-8 text-xs mt-1" />
                            </div>
                            <div>
                                <Label className="text-xs">Basic Salary (₹) *</Label>
                                <Input type="number" min={0} placeholder="30000" {...register("basicSalary")} className="h-8 text-xs mt-1" />
                                {errors.basicSalary && <p className="text-xs text-red-500">{errors.basicSalary.message}</p>}
                            </div>
                            <div>
                                <Label className="text-xs">Allowances (₹)</Label>
                                <Input type="number" min={0} placeholder="5000" {...register("allowances")} className="h-8 text-xs mt-1" />
                            </div>
                            <div>
                                <Label className="text-xs">Deductions (₹)</Label>
                                <Input type="number" min={0} placeholder="0" {...register("deductions")} className="h-8 text-xs mt-1" />
                            </div>
                            <div>
                                <Label className="text-xs">Status</Label>
                                <Select defaultValue="Pending" onValueChange={(v) => setValue("paymentStatus", v as "Pending" | "Paid")}>
                                    <SelectTrigger className="h-8 text-xs mt-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pending" className="text-xs">Pending</SelectItem>
                                        <SelectItem value="Paid" className="text-xs">Paid</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="text-xs">Payment Date</Label>
                                <Input type="date" className="h-8 text-xs mt-1"
                                    onChange={(e) => setValue("paymentDate", e.target.value ? new Date(e.target.value) : null)} />
                            </div>
                            <div>
                                <Label className="text-xs">Notes</Label>
                                <Input placeholder="Optional note" {...register("slipNotes")} className="h-8 text-xs mt-1" />
                            </div>
                            <div className="col-span-2 sm:col-span-3 lg:col-span-4 flex gap-2 pt-1">
                                <Button type="submit" size="sm" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                                    {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Plus className="w-3 h-3 mr-1" />}
                                    {isSubmitting ? "Saving…" : "Add Record"}
                                </Button>
                                <Button type="button" size="sm" variant="outline" className="text-xs" onClick={() => { setShowForm(false); reset(); }}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                <CardContent className="p-0">
                    {records.length === 0 ? (
                        <div className="h-32 flex flex-col items-center justify-center text-muted-foreground">
                            <Clock className="w-8 h-8 mb-2 opacity-30" />
                            <p className="text-sm">No salary records yet</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-800">
                                    <tr>
                                        {["Slip No.", "Period", "Net Pay", "Status", "WA", "Actions"].map(h => (
                                            <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map((record) => (
                                        <tr key={record.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                                            <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{record.slip_number}</td>
                                            <td className="px-4 py-2.5 font-medium whitespace-nowrap">{record.month} {record.year}</td>
                                            <td className="px-4 py-2.5 text-slate-600">₹{Number(record.basic_salary).toLocaleString("en-IN")}</td>
                                            <td className="px-4 py-2.5 text-slate-600">₹{Number(record.allowances).toLocaleString("en-IN")}</td>
                                            <td className="px-4 py-2.5 text-red-500">₹{Number(record.deductions).toLocaleString("en-IN")}</td>
                                            <td className="px-4 py-2.5 font-bold text-emerald-600 dark:text-emerald-400">₹{Number(record.net_salary).toLocaleString("en-IN")}</td>
                                            <td className="px-4 py-2.5">
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        record.payment_status === "Paid"
                                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800"
                                                            : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800"
                                                    }
                                                >
                                                    {record.payment_status}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-2.5">
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        record.whatsapp_status === "sent"
                                                            ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                                            : record.whatsapp_status === "failed" ? "bg-red-50 text-red-700 border-red-200" : "bg-slate-50 text-slate-500 border-slate-200"
                                                    }
                                                >
                                                    {record.whatsapp_status?.toUpperCase() || "PENDING"}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-2.5">
                                                <div className="flex items-center gap-1">
                                                    {record.pdf_url ? (
                                                        <a href={record.pdf_url} target="_blank" rel="noopener noreferrer">
                                                            <Button
                                                                variant="ghost" size="icon"
                                                                className="h-7 w-7 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                                                                title="View Stored PDF"
                                                            >
                                                                <Download className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </a>
                                                    ) : (
                                                        <Button
                                                            variant="ghost" size="icon"
                                                            className="h-7 w-7 text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                                                            title="Download Slip (Local)"
                                                            disabled={downloadingId === record.id}
                                                            onClick={() => handleDownloadSlip(record)}
                                                        >
                                                            {downloadingId === record.id
                                                                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                                : <Download className="w-3.5 h-3.5" />}
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost" size="icon"
                                                        className="h-7 w-7 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                                                        title="Delete Record"
                                                        disabled={deletingId === record.id}
                                                        onClick={() => handleDelete(record.id)}
                                                    >
                                                        {deletingId === record.id
                                                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                            : <Trash2 className="w-3.5 h-3.5" />}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Hidden salary slip elements for PDF generation */}
            <div style={{ position: "absolute", left: "-9999px", top: "0", pointerEvents: "none" }}>
                {records.map((record) => (
                    <div key={record.id} ref={(el) => { slipRefs.current[record.id] = el; }}>
                        <SalarySlip teacher={teacher} record={record} />
                    </div>
                ))}
            </div>
        </div>
    );
}
