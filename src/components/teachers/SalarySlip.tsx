import React from "react";

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
                style={{
                    width: "680px",
                    fontFamily: "Arial, sans-serif",
                    background: "#ffffff",
                    color: "#1a1a2e",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    overflow: "hidden",
                }}
            >
                {/* Header */}
                <div style={{
                    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)",
                    color: "#fff",
                    padding: "20px 28px",
                }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{
                                width: "44px", height: "44px",
                                background: "#b32d00",
                                borderRadius: "8px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontWeight: "900", fontSize: "16px",
                            }}>RK</div>
                            <div>
                                <div style={{ fontSize: "18px", fontWeight: "800", letterSpacing: "1px" }}>RK INSTITUTION</div>
                                <div style={{ fontSize: "10px", color: "#f0a070", letterSpacing: "0.5px" }}>New Delhi, India • rkinstitution.com</div>
                            </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "14px", fontWeight: "700", color: "#f0c070" }}>SALARY SLIP</div>
                            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", marginTop: "2px" }}>{record.slip_number}</div>
                        </div>
                    </div>

                    <div style={{
                        height: "3px",
                        background: "linear-gradient(90deg, #b32d00, #e05a00)",
                        borderRadius: "2px",
                        marginTop: "16px",
                    }} />

                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", marginTop: "10px", textAlign: "right" }}>
                        Pay Period: <span style={{ color: "#f0c070", fontWeight: "700" }}>{record.month} {record.year}</span>
                    </div>
                </div>

                {/* Employee Details */}
                <div style={{ padding: "20px 28px", background: "#f8f9fb", borderBottom: "1px solid #e0e0e0" }}>
                    <div style={{ fontSize: "10px", fontWeight: "700", color: "#888", letterSpacing: "1px", marginBottom: "10px" }}>
                        EMPLOYEE DETAILS
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                        {[
                            { label: "Employee Name", value: teacher.name },
                            { label: "Employee ID", value: teacher.teacher_id },
                            { label: "Department", value: teacher.department },
                            { label: "Subject", value: teacher.subject },
                            { label: "Class Assigned", value: teacher.assigned_class },
                            { label: "Joining Date", value: new Date(teacher.joining_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) },
                        ].map(({ label, value }) => (
                            <div key={label}>
                                <div style={{ fontSize: "9px", color: "#888", marginBottom: "2px" }}>{label}</div>
                                <div style={{ fontSize: "12px", fontWeight: "600", color: "#1a1a2e" }}>{value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Earnings & Deductions */}
                <div style={{ padding: "20px 28px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                        {/* Earnings */}
                        <div>
                            <div style={{ fontSize: "10px", fontWeight: "700", color: "#888", letterSpacing: "1px", marginBottom: "10px" }}>
                                EARNINGS
                            </div>
                            <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse" }}>
                                <tbody>
                                    {[
                                        { label: "Basic Salary", value: Number(record.basic_salary) },
                                        { label: "Allowances", value: Number(record.allowances) },
                                    ].map(({ label, value }) => (
                                        <tr key={label} style={{ borderBottom: "1px solid #f0f0f0" }}>
                                            <td style={{ padding: "6px 0", color: "#555" }}>{label}</td>
                                            <td style={{ padding: "6px 0", textAlign: "right", fontWeight: "600", color: "#1a1a2e" }}>
                                                ₹{value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr style={{ borderTop: "2px solid #1a1a2e" }}>
                                        <td style={{ padding: "8px 0", fontWeight: "700", color: "#1a1a2e" }}>Gross Pay</td>
                                        <td style={{ padding: "8px 0", textAlign: "right", fontWeight: "700", color: "#1a1a2e" }}>
                                            ₹{gross.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Deductions */}
                        <div>
                            <div style={{ fontSize: "10px", fontWeight: "700", color: "#888", letterSpacing: "1px", marginBottom: "10px" }}>
                                DEDUCTIONS
                            </div>
                            <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse" }}>
                                <tbody>
                                    <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                                        <td style={{ padding: "6px 0", color: "#555" }}>Total Deductions</td>
                                        <td style={{ padding: "6px 0", textAlign: "right", fontWeight: "600", color: "#c0392b" }}>
                                            ₹{Number(record.deductions).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                    <tr style={{ borderTop: "2px solid #1a1a2e" }}>
                                        <td style={{ padding: "8px 0", fontWeight: "700", color: "#1a1a2e" }}>Net Deductions</td>
                                        <td style={{ padding: "8px 0", textAlign: "right", fontWeight: "700", color: "#c0392b" }}>
                                            ₹{Number(record.deductions).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Net Pay */}
                <div style={{
                    margin: "0 28px 20px",
                    background: "linear-gradient(135deg, #1a1a2e, #0f3460)",
                    color: "#fff",
                    borderRadius: "8px",
                    padding: "14px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                    <div>
                        <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)", letterSpacing: "1px" }}>NET PAY</div>
                        <div style={{ fontSize: "22px", fontWeight: "800", color: "#f0c070", letterSpacing: "0.5px", marginTop: "2px" }}>
                            ₹{Number(record.net_salary).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)" }}>Payment Status</div>
                        <div style={{
                            display: "inline-block",
                            marginTop: "4px",
                            padding: "3px 12px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontWeight: "700",
                            background: record.payment_status === "Paid" ? "#27ae60" : "#e67e22",
                            color: "#fff",
                        }}>
                            {record.payment_status}
                        </div>
                        {record.payment_date && (
                            <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>
                                Paid on {new Date(record.payment_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Notes + Signature */}
                <div style={{
                    padding: "0 28px 20px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                    alignItems: "end",
                }}>
                    <div>
                        {record.slip_notes && (
                            <>
                                <div style={{ fontSize: "9px", color: "#888", marginBottom: "4px", letterSpacing: "0.5px" }}>NOTES</div>
                                <div style={{ fontSize: "11px", color: "#555", fontStyle: "italic" }}>{record.slip_notes}</div>
                            </>
                        )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ borderTop: "1px solid #ccc", paddingTop: "6px", fontSize: "10px", color: "#888" }}>
                            Authorized Signatory
                        </div>
                        <div style={{ fontSize: "11px", fontWeight: "600", color: "#1a1a2e", marginTop: "2px" }}>
                            RK Institution
                        </div>
                    </div>
                </div>

                {/* Footer stripe */}
                <div style={{
                    background: "linear-gradient(90deg, #b32d00, #e05a00)",
                    height: "5px",
                }} />
            </div>
        );
    }
);

SalarySlip.displayName = "SalarySlip";
