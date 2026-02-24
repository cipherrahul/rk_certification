import type { Metadata } from "next";
import { MessageSquare } from "lucide-react";
import { ContactForm } from "./components/ContactForm";
import { ContactInfo } from "./components/ContactInfo";
import { MapEmbed } from "./components/MapEmbed";

export const metadata: Metadata = {
    title: "Contact Us — RK Institution",
    description:
        "Get in touch with RK Institution for admission enquiries, course information, and more. We are here to help you.",
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative border-b border-border/60 bg-gradient-to-br from-background via-background to-brand/5 py-16 md:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 mb-5">
                        <MessageSquare className="w-3.5 h-3.5 text-brand" />
                        <span className="text-xs font-semibold text-brand uppercase tracking-wider">
                            Admissions & Enquiries
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
                        Get in Touch
                    </h1>
                    <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Have a question about admissions? We&apos;re here to help. Fill in the form below
                        and our team will reach out to you within{" "}
                        <span className="text-brand font-semibold">24 hours</span>.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    {/* Left: Contact Info + Map */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <h2 className="text-lg font-bold text-foreground mb-1">Contact Information</h2>
                            <p className="text-sm text-muted-foreground">
                                Reach us directly or visit our campus.
                            </p>
                        </div>

                        <ContactInfo />
                        <MapEmbed />
                    </div>

                    {/* Right: Enquiry Form */}
                    <div className="lg:col-span-3">
                        <ContactForm />
                    </div>
                </div>
            </section>
        </div>
    );
}
