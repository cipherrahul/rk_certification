import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 pt-32 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-blue-600/10 rounded-2xl border border-blue-600/20">
                        <Shield className="h-8 w-8 text-blue-500" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight">Privacy Policy</h1>
                        <p className="text-slate-500 font-medium">Last updated: March 2026</p>
                    </div>
                </div>

                <div className="prose prose-invert prose-slate max-w-none space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
                            <Eye className="h-5 w-5 text-blue-500" /> Information We Collect
                        </h2>
                        <p className="leading-relaxed">
                            At RK Institution, we collect information to provide better services to our students and users. This includes:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-400">
                            <li>Personal identification (Name, email address, phone number, etc.)</li>
                            <li>Academic background and interests</li>
                            <li>Usage data and website interaction via cookies</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
                            <Lock className="h-5 w-5 text-blue-500" /> How We Use Your Data
                        </h2>
                        <p className="leading-relaxed">
                            Your data is used to personalize your learning experience, process admissions, and send important institutional updates. We do not sell your personal information to third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
                            <FileText className="h-5 w-5 text-blue-500" /> Your Rights
                        </h2>
                        <p className="leading-relaxed">
                            You have the right to access, correct, or delete your personal data stored with us. For any privacy-related queries, please contact our support team at <a href="mailto:privacy@rkinstitution.com" className="text-blue-400 hover:underline">privacy@rkinstitution.com</a>.
                        </p>
                    </section>

                    <div className="pt-12 border-t border-white/5 text-sm text-slate-500 italic">
                        By using our website, you hereby consent to our Privacy Policy and agree to its terms.
                    </div>
                </div>
            </div>
        </div>
    );
}
