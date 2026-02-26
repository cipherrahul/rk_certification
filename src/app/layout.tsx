import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "RK Institution - Professional Educational Institute Since 2016",
    template: "%s | RK Institution"
  },
  description: "RK Institution provides industry-leading professional education, academic foundations, and competitive coaching. Established in 2016, we empower students with real-world skills.",
  keywords: ["RK Institution", "Certification", "Education", "Job Skills", "Competitive Exam Coaching", "Computer Institute", "Professional Training"],
  authors: [{ name: "RK Institution" }],
  creator: "RK Institution",
  publisher: "RK Institution",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://rkinstitution.in"), // Replace with actual domain
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "RK Institution - Professional Educational Institute",
    description: "Empowering students since 2016 with quality education, rigorous training, and professional excellence.",
    url: "https://rkinstitution.in",
    siteName: "RK Institution",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RK Institution - Build Real Skills",
    description: "Join 5,000+ students transforming their careers with RK Institution.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
