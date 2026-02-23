import React from "react";

interface StudentIDCardProps {
    student: {
        student_id: string;
        first_name: string;
        last_name: string;
        father_name: string;
        course: string;
        academic_session: string;
        mobile: string;
        photo_url?: string | null;
    };
}

export const StudentIDCard = React.forwardRef<HTMLDivElement, StudentIDCardProps>(
    ({ student }, ref) => {
        return (
            <div
                ref={ref}
                id="student-id-card"
                style={{
                    width: "340px",
                    height: "210px",
                    fontFamily: "Arial, sans-serif",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                    position: "relative",
                    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)",
                    color: "#fff",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Top stripe */}
                <div style={{
                    background: "linear-gradient(90deg, #b32d00, #e05a00)",
                    height: "6px",
                    width: "100%",
                }} />

                {/* Header */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 16px 6px 16px",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                }}>
                    <div style={{
                        width: "32px",
                        height: "32px",
                        background: "#b32d00",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "900",
                        fontSize: "13px",
                        flexShrink: 0,
                    }}>RK</div>
                    <div>
                        <div style={{ fontSize: "13px", fontWeight: "800", letterSpacing: "1px", color: "#fff" }}>
                            RK INSTITUTION
                        </div>
                        <div style={{ fontSize: "8px", color: "#f0a070", letterSpacing: "0.5px" }}>
                            STUDENT IDENTITY CARD
                        </div>
                    </div>
                    <div style={{ marginLeft: "auto", fontSize: "9px", color: "rgba(255,255,255,0.5)", textAlign: "right" }}>
                        <div>Session</div>
                        <div style={{ color: "#f0c070", fontWeight: "700" }}>{student.academic_session}</div>
                    </div>
                </div>

                {/* Body */}
                <div style={{
                    display: "flex",
                    flex: 1,
                    padding: "10px 16px",
                    gap: "14px",
                    alignItems: "center",
                }}>
                    {/* Photo */}
                    <div style={{
                        width: "72px",
                        height: "90px",
                        borderRadius: "8px",
                        border: "2px solid rgba(255,255,255,0.2)",
                        overflow: "hidden",
                        flexShrink: 0,
                        background: "rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        {student.photo_url ? (
                            <img src={student.photo_url} alt="Student" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                            <div style={{ fontSize: "28px", color: "rgba(255,255,255,0.3)" }}>👤</div>
                        )}
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "16px", fontWeight: "800", lineHeight: "1.1", color: "#fff", marginBottom: "4px" }}>
                            {student.first_name} {student.last_name}
                        </div>
                        <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.5)", marginBottom: "2px" }}>
                            S/O, D/O
                        </div>
                        <div style={{ fontSize: "11px", color: "#f0d0b0", marginBottom: "8px" }}>
                            {student.father_name}
                        </div>
                        <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.5)", marginBottom: "2px" }}>
                            COURSE
                        </div>
                        <div style={{ fontSize: "10px", color: "#80cfff", fontWeight: "600", marginBottom: "8px", lineHeight: 1.2 }}>
                            {student.course}
                        </div>
                        <div style={{
                            display: "inline-block",
                            background: "#b32d00",
                            borderRadius: "4px",
                            padding: "2px 8px",
                            fontSize: "10px",
                            fontWeight: "700",
                            letterSpacing: "1px",
                            color: "#fff",
                        }}>
                            {student.student_id}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div style={{
                    background: "rgba(255,255,255,0.05)",
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                    padding: "5px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "9px",
                    color: "rgba(255,255,255,0.4)",
                }}>
                    <span>New Delhi, India</span>
                    <span>{student.mobile}</span>
                    <span>rkinstitution.com</span>
                </div>

                {/* Bottom stripe */}
                <div style={{
                    background: "linear-gradient(90deg, #b32d00, #e05a00)",
                    height: "4px",
                    width: "100%",
                }} />
            </div>
        );
    }
);

StudentIDCard.displayName = "StudentIDCard";
