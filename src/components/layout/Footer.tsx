"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    GraduationCap,
    MapPin,
    Phone,
    Mail,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    ArrowRight,
    ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
    const pathname = usePathname();
    if (pathname?.startsWith('/admin')) return null;

    return (
        <footer className="relative bg-slate-950 text-slate-400 overflow-hidden pt-24 pb-12 border-t border-white/5">
            {/* Background design elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
                    {/* Brand Section */}
                    <div className="lg:col-span-4 space-y-8">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="bg-blue-600 p-2 rounded-xl">
                                <GraduationCap className="h-7 w-7 text-white" />
                            </div>
                            <span className="text-2xl font-black tracking-tight text-white">RK Institution</span>
                        </Link>
                        <p className="text-lg leading-relaxed max-w-sm">
                            Since 2016, empowering the next generation of tech leaders across India through immersive skill-based education.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: Facebook, href: "#" },
                                { icon: Twitter, href: "#" },
                                { icon: Instagram, href: "#" },
                                { icon: Linkedin, href: "#" }
                            ].map((social, i) => (
                                <motion.a
                                    key={i}
                                    href={social.href}
                                    whileHover={{ y: -4, backgroundColor: "rgba(255,255,255,0.1)" }}
                                    className="p-3 rounded-full bg-white/5 border border-white/10 text-white transition-colors"
                                >
                                    <social.icon className="h-5 w-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="lg:col-span-4 grid grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-white font-bold text-lg">Programs</h3>
                            <ul className="space-y-4">
                                {["Web Dev", "Data Science", "Digital Marketing", "Cloud Ops"].map((link) => (
                                    <li key={link}>
                                        <Link href="/contact" className="hover:text-blue-400 transition-colors flex items-center group">
                                            <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-white font-bold text-lg">Institution</h3>
                            <ul className="space-y-4">
                                {["About Us", "Our Branches", "Verification", "Careers"].map((link) => (
                                    <li key={link}>
                                        <Link href={link === 'Verification' ? '/verify' : '/contact'} className="hover:text-blue-400 transition-colors flex items-center group">
                                            <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm">
                            <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
                                <Mail className="h-5 w-5 text-blue-500" /> Newsletter
                            </h3>
                            <p className="text-sm mb-6">Stay updated with latest admissions and tech trends.</p>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="bg-black/20 border border-white/10 rounded-xl px-4 py-2 w-full focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                />
                                <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition-colors">
                                    <ArrowRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 px-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-blue-500 mt-1 shrink-0" />
                                <span className="text-sm">A9 Nanda Road, Adarsh Nagar, New Delhi</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-blue-500 shrink-0" />
                                <a href="tel:7533042633" className="text-sm hover:text-white transition-colors">+91 7533042633</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-sm">
                        © {new Date().getFullYear()} RK Institution India. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-sm">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <div className="flex items-center gap-2 text-xs font-mono uppercase bg-white/5 px-3 py-1 rounded-full border border-white/10">
                            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                            Systems Operational
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
