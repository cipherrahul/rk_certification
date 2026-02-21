import React from 'react';
import { CertificateFormValues } from "@/lib/schemas/certificate";
import { QRCodeSVG } from 'qrcode.react';

interface CertificateLayoutProps {
    data: CertificateFormValues | null;
}

export const CertificateLayout: React.FC<CertificateLayoutProps> = ({ data }) => {
    if (!data) return null;

    const issueDate = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // Generate a random Sr. No and UID for visual purpose, or we'd ideally get it from props.
    // We'll just hardcode or generate from timestamp for the layout.
    const srNo = Math.floor(100000 + Math.random() * 900000);
    const uidNo = data.mobile || "1234567890";

    return (
        <div
            id="certificate-template"
            style={{
                width: '1122.5px', // roughly 297mm (A4 landscape)
                height: '793.7px', // roughly 210mm
                position: 'absolute',
                top: '-9999px',
                left: '-9999px',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
                fontFamily: '"Times New Roman", Times, serif',
                zIndex: -1,
                padding: '20px'
            }}
        >
            {/* Outer ornate border (simulated with CSS) */}
            <div style={{
                border: '12px solid #b32d00', // Deep red/orange border
                width: '100%',
                height: '100%',
                position: 'relative',
                boxSizing: 'border-box',
                padding: '6px',
                backgroundColor: '#fff',
            }}>
                {/* Inner thin border */}
                <div style={{
                    border: '2px solid #b32d00',
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '25px 40px',
                    backgroundImage: 'repeating-linear-gradient(45deg, rgba(179, 45, 0, 0.03) 0, rgba(179, 45, 0, 0.03) 2px, transparent 2px, transparent 8px)', // Watermark texture
                }}>

                    {/* Watermark text */}
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignContent: 'center',
                        opacity: 0.04,
                        overflow: 'hidden',
                        zIndex: 0,
                        pointerEvents: 'none',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#000',
                        textAlign: 'center',
                        lineHeight: '2.5',
                        wordBreak: 'break-all'
                    }}>
                        {Array.from({ length: 200 }).map((_, i) => (
                            <span key={i} style={{ margin: '0 10px' }}>RK INSTITUTION</span>
                        ))}
                    </div>

                    <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>

                        {/* Top Row: UID, Logo, Sr No */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                UID No. {uidNo}
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                Sr. No. {srNo}
                            </div>
                        </div>

                        {/* Logos and Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 20px' }}>
                            {/* QR Placeholder */}
                            <div style={{ width: '80px', height: '80px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <QRCodeSVG value={`https://rkinstitution.com/verify/${uidNo}`} size={80} />
                            </div>

                            {/* Center Title */}
                            <div style={{ textAlign: 'center', flex: 1, padding: '0 20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '5px' }}>
                                    <div style={{ width: '60px', height: '60px', backgroundColor: '#b32d00', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '24px', borderRadius: '4px' }}>
                                        RK
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                        <h1 style={{ margin: 0, fontSize: '48px', color: '#b32d00', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase', lineHeight: '1' }}>
                                            RK INSTITUTION
                                        </h1>
                                    </div>
                                </div>
                                <p style={{ margin: 0, fontSize: '16px', color: '#b32d00', fontStyle: 'italic', fontWeight: 'bold' }}>
                                    Discover. Learn. Empower.
                                </p>
                            </div>

                            {/* Photo Placeholder */}
                            <div style={{ width: '90px', height: '110px', border: '1px solid #000', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '12px', opacity: 0.8, overflow: 'hidden' }}>
                                {data.photo ? (
                                    <img src={data.photo} alt="Student" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    "Photo"
                                )}
                            </div>
                        </div>

                        {/* Course Name */}
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '42px', fontWeight: 'bold', margin: '0 0 5px 0', fontFamily: 'serif' }}>
                                {data.courseName}
                            </h2>
                            <p style={{ margin: '0 0 5px 0', fontSize: '18px', fontStyle: 'italic', fontWeight: 'bold' }}>in</p>
                            <h3 style={{ margin: 0, fontSize: '28px', color: '#b32d00', fontWeight: 'bold' }}>
                                ( Professional Certification )
                            </h3>
                        </div>

                        {/* Main Text Body */}
                        <div style={{ textAlign: 'center', fontSize: '20px', lineHeight: '1.8', margin: '0 auto', maxWidth: '95%', flex: 1 }}>
                            <p style={{ margin: 0, textAlign: 'justify', textAlignLast: 'center' }}>
                                <span style={{ fontWeight: 'bold', fontFamily: 'serif', fontSize: '24px' }}>Certified that</span>{' '}
                                <span style={{ fontWeight: 'bold' }}>Mr./Ms. {data.firstName.toUpperCase()} {data.lastName.toUpperCase()}</span>{' '}
                                son/daughter of Shri. <span style={{ fontWeight: 'bold' }}>{data.fatherName.toUpperCase()}</span>,{' '}
                                student of the RK INSTITUTION, has obtained the degree/certification of <span style={{ fontWeight: 'bold' }}>{data.courseName}</span> at this Institution, having passed the examination for the said program held in{' '}
                                <span style={{ fontWeight: 'bold' }}>
                                    {data.completionDate ? new Date(data.completionDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}
                                </span>{' '}
                                in the <span style={{ fontWeight: 'bold' }}>FIRST DIVISION</span> having Grade/Performance of <span style={{ fontWeight: 'bold' }}>{data.grade}</span>.
                            </p>
                        </div>

                        {/* Seal Text */}
                        <div style={{ textAlign: 'center', marginBottom: '20px', fontSize: '22px', fontFamily: 'serif', marginTop: '10px' }}>
                            Given under the seal of The Institution.
                        </div>

                        {/* Signatures */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', padding: '0 40px' }}>

                            <div style={{ textAlign: 'center', width: '200px' }}>
                                <div style={{ height: '40px', borderBottom: '1px solid #000', marginBottom: '5px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', fontFamily: 'cursive', fontSize: '24px' }}>
                                    <span style={{ transform: 'rotate(-5deg)' }}>Manish</span>
                                </div>
                                <div style={{ fontSize: '15px', fontWeight: 'bold' }}>Director</div>
                            </div>

                            {/* Center Seal */}
                            <div style={{ width: '140px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 20px' }}>
                                <img src="/seal.png" alt="RK Seal" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>

                            <div style={{ textAlign: 'center', width: '200px' }}>
                                <div style={{ height: '40px', borderBottom: '1px solid #000', marginBottom: '5px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', fontFamily: 'cursive', fontSize: '24px' }}>
                                    <span style={{ transform: 'rotate(-5deg)' }}>Rahul Kumar</span>
                                </div>
                                <div style={{ fontSize: '15px', fontWeight: 'bold' }}>Head of Dept</div>
                                <div style={{ marginTop: '15px', fontSize: '14px', fontWeight: 'bold' }}>
                                    Date of Issue: {issueDate}
                                </div>
                            </div>
                        </div>

                        {/* Footer Location and Barcode */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', padding: '0 20px' }}>
                            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                New Delhi, India.
                            </div>
                            <div style={{ height: '25px', width: '250px', backgroundImage: 'repeating-linear-gradient(to right, #000 0, #000 2px, transparent 2px, transparent 4px, #000 4px, #000 6px, transparent 6px, transparent 9px, #000 9px, #000 10px, transparent 10px, transparent 13px)' }}>
                                {/* Fake Barcode */}
                            </div>
                            <div style={{ height: '20px', width: '80px', backgroundColor: '#333' }}>
                                {/* Fake colored box */}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Decorative Corners */}
                <div style={{ position: 'absolute', top: '-10px', left: '-10px', width: '30px', height: '30px', borderTop: '6px solid #b32d00', borderLeft: '6px solid #b32d00' }}></div>
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '30px', height: '30px', borderTop: '6px solid #b32d00', borderRight: '6px solid #b32d00' }}></div>
                <div style={{ position: 'absolute', bottom: '-10px', left: '-10px', width: '30px', height: '30px', borderBottom: '6px solid #b32d00', borderLeft: '6px solid #b32d00' }}></div>
                <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', width: '30px', height: '30px', borderBottom: '6px solid #b32d00', borderRight: '6px solid #b32d00' }}></div>
            </div>
        </div>
    );
}
