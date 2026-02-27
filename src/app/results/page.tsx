import { PublicResultSearch } from "@/components/academic/PublicResultSearch";
import { GraduationCap, ShieldCheck, Download } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Student Results | RK Institution",
    description: "Access your digital examination records, academic performance reports, and download professional report cards using your Student ID.",
};

export default function ResultsPage() {
    return (
        <div className="bg-white dark:bg-slate-950">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-slate-900 py-24 sm:py-32">
                {/* Abstract background patterns */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand rounded-full blur-[120px]"></div>
                </div>

                <div className="container px-4 mx-auto relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase mb-6 drop-shadow-sm">
                            Student <span className="text-emerald-400 font-black">Result</span> Portal
                        </h1>
                        <p className="text-xl text-slate-300 font-medium leading-relaxed mb-10">
                            Transparent, timely, and secure access to your academic records. Verify your performance and download official digital copies of your report cards.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
                            {[
                                { icon: GraduationCap, text: "Official Records" },
                                { icon: ShieldCheck, text: "Verified Results" },
                                { icon: Download, text: "Instant Downloads" },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <item.icon className="w-6 h-6 text-emerald-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Portal Section */}
            <div className="container px-4 mx-auto py-16 -mt-12 relative z-20">
                <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-8 sm:p-12">
                    <PublicResultSearch />
                </div>
            </div>

            {/* Footer Notice */}
            <div className="container px-4 mx-auto pb-24 text-center">
                <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-900/50 dark:border-slate-800">
                    <p className="text-xs text-muted-foreground font-medium">
                        If you are unable to find your result or have issues with your Enrollment ID, please contact the institute office or email us at <span className="text-slate-900 dark:text-white font-bold">support@rkinstitution.com</span>. Digital records are updated within 48 hours of examination completion.
                    </p>
                </div>
            </div>
        </div>
    );
}
