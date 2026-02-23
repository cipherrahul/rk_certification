"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, MapPin, Phone, Mail, Users } from 'lucide-react';

export default function Footer() {
    const pathname = usePathname();
    if (pathname?.startsWith('/admin')) return null;

    return (
        <footer className="border-t bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400">
            <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
                    {/* Brand & Mission */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <GraduationCap className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">RK Institution</span>
                        </div>
                        <p className="text-sm leading-relaxed">
                            Established in 2016. Providing quality education, deep academic foundations, and skill-based learning.
                        </p>
                    </div>

                    {/* Locations */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-indigo-500" /> Branches
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex flex-col">
                                <span className="font-medium text-slate-800 dark:text-slate-300">Main Branch</span>
                                <span>A9 Nanda Road, Adarsh Nagar, Delhi</span>
                            </li>
                            <li className="flex flex-col">
                                <span className="font-medium text-slate-800 dark:text-slate-300">Branch 2</span>
                                <span>Majlish Park, Delhi</span>
                            </li>
                            <li className="flex flex-col">
                                <span className="font-medium text-slate-800 dark:text-slate-300">Branch 3</span>
                                <span>Pokhram Biraul, Darbhanga</span>
                            </li>
                        </ul>
                    </div>

                    {/* Contact details */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                            <Phone className="w-4 h-4 text-indigo-500" /> Contact Details
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a href="tel:7533042633" className="hover:text-indigo-600 flex items-center gap-2 transition-colors">
                                    <Phone className="w-3.5 h-3.5" /> 7533042633
                                </a>
                            </li>
                            <li>
                                <a href="mailto:mk1139418@gmail.com" className="hover:text-indigo-600 flex items-center gap-2 transition-colors">
                                    <Mail className="w-3.5 h-3.5" /> mk1139418@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Team Members */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                            <Users className="w-4 h-4 text-indigo-500" /> Team Members
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li><span className="font-medium text-slate-800 dark:text-slate-300">Aman Kumar</span> - Accounts</li>
                            <li><span className="font-medium text-slate-800 dark:text-slate-300">Manish Kumar</span> - Mathematics</li>
                            <li><span className="font-medium text-slate-800 dark:text-slate-300">Radhika Kumari</span> - Primary Classes</li>
                            <li><span className="font-medium text-slate-800 dark:text-slate-300">Suraj Singh</span> - Physics & Chemistry</li>
                            <li><span className="font-medium text-slate-800 dark:text-slate-300">Rahul Choudhary</span> - Math & CS</li>
                            <li><span className="font-medium text-slate-800 dark:text-slate-300">Kapil Saini</span> - Computer</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex gap-6">
                        <Link href="/" className="text-sm hover:text-indigo-600 transition-colors">Home</Link>
                        <Link href="/about" className="text-sm hover:text-indigo-600 transition-colors">About</Link>
                        <Link href="/verify" className="text-sm hover:text-indigo-600 transition-colors">Verify Certificate</Link>
                        <Link href="/verify-receipt" className="text-sm hover:text-indigo-600 transition-colors">Verify Receipt</Link>
                    </div>
                    <span className="text-sm">
                        © {new Date().getFullYear()} RK Institution. All rights reserved.
                    </span>
                </div>
            </div>
        </footer>
    );
}
