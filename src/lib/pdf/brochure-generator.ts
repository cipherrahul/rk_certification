import jsPDF from 'jspdf';
import { Program } from '@/data/programs';

// Robust image loading with timeout
const getBase64Image = async (url: string): Promise<{ data: string, format: string }> => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
        const blob = await response.blob();
        const format = (blob.type.split('/')[1] || 'JPEG').toUpperCase();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            const readerTimeout = setTimeout(() => reject(new Error("FileReader timeout")), 5000);

            reader.onloadend = () => {
                clearTimeout(readerTimeout);
                const base64data = reader.result as string;
                resolve({ data: base64data, format });
            };
            reader.onerror = () => {
                clearTimeout(readerTimeout);
                reject(new Error("FileReader failed"));
            };
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Error fetching image:', url, error);
        throw error;
    }
};

export const generateBrochure = async (program: Program) => {
    console.log("Starting brochure generation for:", program.title);
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    // Modern Professional Palette
    const primaryBlue = '#1e40af';
    const deepSlate = '#0f172a';
    const accentBlue = '#3b82f6';
    const lightBlue = '#eff6ff';
    const slate400 = '#94a3b8';
    const slate600 = '#475569';
    const white = '#ffffff';

    const addPageDecoration = (pageNum: number) => {
        doc.setFillColor(primaryBlue);
        doc.rect(0, 0, pageWidth, 2, 'F');
        const footerY = pageHeight - 12;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(slate400);
        doc.text(`Institutional Prospectus 2025 | Page ${pageNum}`, margin, footerY);
        doc.text('RK INSTITUTION | rkinstitution.com', pageWidth - margin, footerY, { align: 'right' });
    };

    // PAGE 1: COVER
    doc.setFillColor(deepSlate);
    doc.rect(0, 0, pageWidth, 120, 'F');
    doc.setFillColor(primaryBlue);
    doc.triangle(pageWidth, 0, pageWidth, 150, pageWidth - 80, 0, 'F');
    doc.setDrawColor(accentBlue);
    doc.setLineWidth(1);
    doc.line(margin, 30, margin, 100);
    doc.setTextColor(white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(36);
    doc.text('RK', margin + 5, 55);
    doc.setFontSize(14);
    doc.text('INSTITUTION', margin + 5, 65);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(accentBlue);
    doc.text('EXCELLENCE IN EDUCATION', margin + 5, 72);

    // Watermark category text
    doc.saveGraphicsState();
    // @ts-ignore - GState is commonly available but sometimes missing from types
    if (typeof doc.GState === 'function') {
        // @ts-ignore
        doc.setGState(new doc.GState({ opacity: 0.1 }));
    }
    doc.setTextColor(white);
    doc.setFontSize(60);
    doc.setFont('helvetica', 'bold');
    doc.text(program.category.substring(0, 4).toUpperCase(), pageWidth - 30, 240, { angle: 90, charSpace: 5 });
    doc.restoreGraphicsState();

    let currentY = 150;
    doc.setTextColor(deepSlate);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PROSPECTUS & SYLLABUS', margin, currentY);
    currentY += 15;
    doc.setFontSize(44);
    const titleLines = doc.splitTextToSize(program.title.toUpperCase(), pageWidth - (margin * 2) - 20);
    doc.text(titleLines, margin, currentY);
    currentY += (titleLines.length * 15) + 5;
    doc.setDrawColor(accentBlue);
    doc.setLineWidth(2);
    doc.line(margin, currentY, margin + 40, currentY);
    currentY += 15;
    doc.setTextColor(slate600);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'italic');
    doc.text(`Future-Proof Education in ${program.category}`, margin, currentY);
    currentY = pageHeight - 65;
    doc.setFillColor(lightBlue);
    doc.roundedRect(margin, currentY, pageWidth - (margin * 2), 45, 4, 4, 'F');
    doc.setTextColor(primaryBlue);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('ADMISSIONS DESK', margin + 10, currentY + 12);
    doc.setTextColor(deepSlate);
    doc.setFontSize(12);
    doc.text('RK Institution - Adarsh Nagar Campus', margin + 10, currentY + 22);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('A9 Nanda Road, Adarsh Nagar, New Delhi - 110033', margin + 10, currentY + 28);
    doc.text('Official Helpline: +91 7533042633', margin + 10, currentY + 34);
    addPageDecoration(1);

    // PAGE 2: OVERVIEW
    doc.addPage();
    addPageDecoration(2);
    currentY = 30;
    doc.setTextColor(primaryBlue);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Program Overview', margin, currentY);
    currentY += 12;
    doc.setTextColor(slate600);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setLineHeightFactor(1.6);
    const desc = doc.splitTextToSize(program.detailedDescription || program.description, pageWidth - (margin * 2));
    doc.text(desc, margin, currentY);
    currentY += (desc.length * 6) + 20;
    doc.setTextColor(deepSlate);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('The Learning Journey', margin, currentY);
    doc.setTextColor(accentBlue);
    doc.setFontSize(9);
    doc.text('DETAILED SEMESTER-WISE BREAKDOWN', margin, currentY + 8);
    currentY += 20;

    program.fullCurriculum.forEach((module, idx) => {
        if (currentY > pageHeight - 50) {
            doc.addPage();
            addPageDecoration(2);
            currentY = 30;
        }
        doc.setFillColor(lightBlue);
        doc.circle(margin + 5, currentY + 5, 8, 'F');
        doc.setTextColor(primaryBlue);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text((idx + 1).toString(), margin + 3.5, currentY + 6.5);
        doc.setTextColor(deepSlate);
        doc.setFontSize(13);
        doc.text(module.moduleTitle.toUpperCase(), margin + 20, currentY + 4);
        currentY += 10;
        doc.setTextColor(slate600);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const topics = module.topics.join('  •  ');
        const topicLines = doc.splitTextToSize(topics, pageWidth - (margin * 2) - 20);
        doc.text(topicLines, margin + 20, currentY);
        currentY += (topicLines.length * 5) + 5;
        doc.setDrawColor('#f1f5f9');
        doc.line(margin + 20, currentY, pageWidth - margin, currentY);
        currentY += 10;
    });

    // PAGE 3: LEADERSHIP
    doc.addPage();
    addPageDecoration(3);
    currentY = 30;
    doc.setTextColor(primaryBlue);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Our Visionaries', margin, currentY);
    currentY += 20;

    const leadership = [
        {
            name: "Manish Choudhary",
            role: "Founder & Mathematics Expert",
            bio: "M.Sc Mathematics with a mission to simplify competitive learning. Over a decade of experience in mentoring students.",
            img: "/images/faculty/manish.jpg"
        },
        {
            name: "Rahul Choudhary",
            role: "Co-founder & Software Engineer",
            bio: "B.Tech Computer Science leading technical innovation. Expertise in Full Stack Engineering and Modern EdTech systems.",
            img: "/images/faculty/rahul_mentor.png"
        }
    ];

    for (const lead of leadership) {
        doc.setFillColor('#ffffff');
        doc.setDrawColor('#e2e8f0');
        doc.roundedRect(margin, currentY, pageWidth - (margin * 2), 65, 3, 3, 'FD');

        try {
            const { data: imgData, format } = await getBase64Image(lead.img);
            doc.addImage(imgData, format === 'PNG' ? 'PNG' : 'JPEG', margin + 8, currentY + 7.5, 45, 50);
            doc.setDrawColor(accentBlue);
            doc.setLineWidth(0.5);
            doc.rect(margin + 8, currentY + 7.5, 45, 50, 'D');
        } catch (e) {
            console.warn("Failed to load image for leadership:", lead.name, e);
            doc.setFillColor('#f1f5f9');
            doc.rect(margin + 8, currentY + 7.5, 45, 50, 'F');
        }

        doc.setTextColor(primaryBlue);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(lead.name, margin + 62, currentY + 15);
        doc.setTextColor(accentBlue);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(lead.role.toUpperCase(), margin + 62, currentY + 22);
        doc.setTextColor(slate600);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const bioLines = doc.splitTextToSize(lead.bio, pageWidth - margin - 82);
        doc.text(bioLines, margin + 62, currentY + 32);
        currentY += 75;
    }

    doc.setTextColor(deepSlate);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Career Outcomes', margin, currentY);
    currentY += 12;
    doc.setTextColor(slate600);
    doc.setFontSize(9);
    program.outcomes.slice(0, 4).forEach((outcome, i) => {
        const xPos = margin + (i % 2 === 0 ? 0 : (pageWidth / 2) - margin);
        const yPos = currentY + (Math.floor(i / 2) * 8);
        doc.setFillColor(accentBlue);
        doc.rect(xPos, yPos - 3, 2, 2, 'F');
        doc.text(outcome, xPos + 6, yPos);
    });

    // PAGE 4: FAQ & CONTACT
    doc.addPage();
    addPageDecoration(4);
    currentY = 30;
    doc.setTextColor(primaryBlue);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Expert Insights (FAQ)', margin, currentY);
    currentY += 20;

    program.faq.slice(0, 5).forEach((faq) => {
        if (currentY > pageHeight - 60) {
            doc.addPage();
            addPageDecoration(4);
            currentY = 30;
        }
        doc.setFillColor('#ffffff');
        doc.setDrawColor('#f1f5f9');
        doc.roundedRect(margin, currentY, pageWidth - (margin * 2), 25, 2, 2, 'FD');
        doc.setTextColor(deepSlate);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`Q: ${faq.question}`, margin + 5, currentY + 10);
        doc.setTextColor(slate600);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const qLines = doc.splitTextToSize(faq.answer, pageWidth - (margin * 2) - 10);
        doc.text(qLines, margin + 5, currentY + 16);
        currentY += 32;
    });

    currentY = pageHeight - 75;
    doc.setFillColor(deepSlate);
    doc.rect(0, currentY, pageWidth, 75, 'F');
    doc.setTextColor(white);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('READY TO TAKE THE NEXT STEP?', margin, currentY + 18);
    doc.setTextColor(slate400);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const footerLines = doc.splitTextToSize('Join a community of successful students. Admissions experts are ready to guide you.', pageWidth - (margin * 2));
    doc.text(footerLines, margin, currentY + 28);
    doc.setTextColor(accentBlue);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('ADMISSIONS OPEN FOR 2025-26 BATCH', margin, currentY + 45);
    doc.setTextColor(white);
    doc.setFontSize(10);
    doc.text('CALL/WHATSAPP: +91 7533042633', margin, currentY + 55);
    doc.text('VISIT: www.rkinstitution.com', pageWidth - margin, currentY + 55, { align: 'right' });

    console.log("Saving brochure PDF...");
    doc.save(`${program.slug}-brochure.pdf`);
    return true;
};
