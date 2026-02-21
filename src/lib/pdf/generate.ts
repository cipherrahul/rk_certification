import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { createClient } from "../supabase/client";

/**
 * Captures an HTML element and generates a PDF
 * @param elementId The ID of the HTML element containing the certificate layout
 * @param fileName Name of the downloaded/uploaded PDF file
 * @returns Upload URL if successful
 */
export async function generateAndUploadCertificatePDF(elementId: string, fileName: string): Promise<string | null> {
    const element = document.getElementById(elementId);
    if (!element) return null;

    try {
        // 1. Capture HTML to Canvas
        const canvas = await html2canvas(element, {
            scale: 2, // higher scale for better resolution
            useCORS: true,
            logging: false,
        });

        const imgData = canvas.toDataURL("image/jpeg", 1.0);

        // 2. Adjust jsPDF sizing based on canvas
        const pdf = new jsPDF("landscape", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

        // 3. Get Blob for uploading
        const pdfBlob = pdf.output("blob");

        // 4. Upload to Supabase Storage
        const supabase = createClient();
        const filePath = `certificates/${fileName}.pdf`;

        // We upload via the client (Requires RLS policy permitting this)
        const { data, error } = await supabase.storage
            .from("certificates")
            .upload(filePath, pdfBlob, {
                contentType: "application/pdf",
                upsert: true,
            });

        if (error) {
            console.error("PDF upload error:", error);
            return null;
        }

        // Return the public URL
        const { data: publicUrlData } = supabase.storage
            .from("certificates")
            .getPublicUrl(filePath);

        return publicUrlData.publicUrl;
    } catch (error) {
        console.error("Error generating PDF:", error);
        return null;
    }
}
