import React from 'react';
import { BookOpen, Scale, AlertCircle, FileText } from 'lucide-react';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 pt-32 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-purple-600/10 rounded-2xl border border-purple-600/20">
                        <Scale className="h-8 w-8 text-purple-500" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight">Terms of Service</h1>
                        <p className="text-slate-500 font-medium tracking-wide font-mono text-xs uppercase">Legal Framework & Institutional Norms</p>
                    </div>
                </div>

                <div className="prose prose-invert prose-slate max-w-none space-y-12">
                    <section className="bg-white/5 p-8 rounded-3xl border border-white/5 backdrop-blur-sm">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                            <BookOpen className="h-5 w-5 text-purple-500" /> 1. Acceptance of Terms
                        </h2>
                        <p className="text-slate-400">
                            By accessing and using RK Institution's website and services, you agree to be bound by these Terms of Service. If you do not agree, please refrain from using our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                            <FileText className="h-5 w-5 text-purple-500" /> 2. Use License
                        </h2>
                        <p className="text-slate-400">
                            Permission is granted to temporarily download one copy of the materials (information or software) on RK Institution's website for personal, non-commercial transitory viewing only.
                        </p>
                        <div className="mt-4 grid md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-slate-900 border border-white/5 text-sm">
                                <h4 className="font-bold text-white mb-2">Prohibited Actions:</h4>
                                <ul className="list-disc pl-4 space-y-1 opacity-70">
                                    <li>Modifying or copying materials</li>
                                    <li>Using for commercial displays</li>
                                    <li>Attempting to decompile software</li>
                                    <li>Removing copyright notations</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="border-l-4 border-purple-500 pl-8">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                            <AlertCircle className="h-5 w-5 text-purple-500" /> 3. Governing Law
                        </h2>
                        <p className="text-slate-400 font-light italic">
                            These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in New Delhi.
                        </p>
                    </section>

                    <div className="pt-12 border-t border-white/5 text-sm text-slate-500 flex justify-between items-center">
                        <div>© {new Date().getFullYear()} RK Institution Legal Department</div>
                        <div className="flex gap-4">
                            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
                            <span>|</span>
                            <a href="/contact" className="hover:text-white transition-colors">Contact</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
