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
    Github,
    Youtube,
    ShieldCheck,
    Globe2,
    Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function Footer() {
    const pathname = usePathname();
    const { toast } = useToast();
    const [email, setEmail] = useState('');

    if (pathname?.startsWith('/admin')) return null;

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            toast({
                title: "Subscription Successful",
                description: "You've been added to our institutional newsletter.",
            });
            setEmail('');
        }
    };

    const footerLinks = {
        programs: [
            { name: "JEE Preparation", href: "/programs/jee-ultimate" },
            { name: "NEET Foundation", href: "/programs/neet-medical" },
            { name: "Full Stack Web", href: "/programs/full-stack-web" },
            { name: "Data Science & AI", href: "/programs/data-science-ai" },
            { name: "Advanced Diploma", href: "/programs/adca-expert" }
        ],
        institution: [
            { name: "About Us", href: "/about" },
            { name: "Exam Results", href: "/results" },
            { name: "ID Card Verify", href: "/verify" },
            { name: "Careers", href: "/careers" },
            { name: "Contact Us", href: "/contact" }
        ],
        support: [
            { name: "Help Center", href: "/contact" },
            { name: "Student Portal", href: "/student" },
            { name: "Teacher Portal", href: "/teacher" },
            { name: "Branches", href: "/contact" },
            { name: "Sitemap", href: "/sitemap.ts" }
        ]
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <footer className="relative bg-[#020617] text-slate-400 overflow-hidden pt-32 pb-12 border-t border-white/5">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container relative z-10 mx-auto px-4 md:px-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24"
                >
                    {/* Brand Section */}
                    <div className="lg:col-span-4 space-y-10">
                        <motion.div variants={itemVariants}>
                            <Link href="/" className="flex items-center gap-3.5 group">
                                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-2xl shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform duration-500">
                                    <GraduationCap className="h-7 w-7 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-black tracking-tight text-white leading-none">RK Institution</span>
                                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">Est. 2016</span>
                                </div>
                            </Link>
                        </motion.div>

                        <motion.p variants={itemVariants} className="text-lg font-light leading-relaxed max-w-sm text-slate-400">
                            Empowering the next generation of global leaders through high-impact, skill-driven professional education.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex gap-3">
                            {[
                                { icon: Facebook, href: "#" },
                                { icon: Twitter, href: "#" },
                                { icon: Instagram, href: "#" },
                                { icon: Linkedin, href: "#" },
                                { icon: Youtube, href: "#" }
                            ].map((social, i) => (
                                <Link
                                    key={i}
                                    href={social.href}
                                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-blue-600 transition-all duration-300"
                                >
                                    <social.icon className="h-5 w-5" />
                                </Link>
                            ))}
                        </motion.div>
                    </div>

                    {/* Links Grid */}
                    <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-8">
                        <motion.div variants={itemVariants} className="space-y-7 text-center md:text-left">
                            <h3 className="text-white font-bold text-sm uppercase tracking-widest">Programs</h3>
                            <ul className="space-y-4">
                                {footerLinks.programs.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="hover:text-blue-400 transition-colors text-[14px] flex items-center group justify-center md:justify-start">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-7 text-center md:text-left">
                            <h3 className="text-white font-bold text-sm uppercase tracking-widest">Institution</h3>
                            <ul className="space-y-4">
                                {footerLinks.institution.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="hover:text-blue-400 transition-colors text-[14px] flex items-center group justify-center md:justify-start">
                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div variants={itemVariants} className="hidden md:block space-y-7">
                            <h3 className="text-white font-bold text-sm uppercase tracking-widest">Ecosystem</h3>
                            <ul className="space-y-4">
                                {footerLinks.support.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="hover:text-blue-400 transition-colors text-[14px] flex items-center group">
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Newsletter & Contact */}
                    <div className="lg:col-span-3 space-y-10">
                        <motion.div variants={itemVariants} className="p-7 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl group hover:border-blue-600/30 transition-all duration-500">
                            <h3 className="text-white font-black text-xl mb-3 flex items-center gap-2">
                                <Zap className="h-5 w-5 text-yellow-400 fill-yellow-400" /> Stay Informed
                            </h3>
                            <p className="text-sm font-medium opacity-60 mb-8 leading-relaxed">
                                Get exclusive academic news and career insights directly.
                            </p>
                            <form onSubmit={handleSubscribe} className="relative">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-blue-600/50 transition-all pr-14"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition-all active:scale-90 shadow-lg shadow-blue-600/20"
                                >
                                    <ArrowRight className="h-5 w-5" />
                                </button>
                            </form>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-5 px-4 font-medium">
                            <div className="flex items-start gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-blue-600/10 group-hover:border-blue-600/20 transition-all">
                                    <MapPin className="h-5 w-5 text-blue-500" />
                                </div>
                                <span className="text-sm pt-2 hover:text-white transition-colors cursor-default">A9 Nanda Road, Adarsh Nagar, New Delhi</span>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-blue-600/10 group-hover:border-blue-600/20 transition-all">
                                    <Phone className="h-5 w-5 text-blue-500" />
                                </div>
                                <a href="tel:7533042633" className="text-sm hover:text-white transition-colors">+91 7533042633</a>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Bottom Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8"
                >
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                            © {new Date().getFullYear()} RK Institution India. Academic Excellence Redefined.
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-bold tracking-tight">
                            <span className="text-slate-600">Developed by</span>
                            <span className="text-blue-500 uppercase">Rahul Choudhary</span>
                        </div>
                        <p className="text-[10px] text-slate-600 max-w-xs text-center md:text-left font-medium">
                            Unit of RK International Educational Trust. ISO 9001:2015 Certified Educational Body.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 text-[11px] font-black uppercase tracking-widest">
                        <Link href="/privacy" className="text-slate-500 hover:text-white transition-all hover:-translate-y-0.5">Privacy Policy</Link>
                        <Link href="/terms" className="text-slate-500 hover:text-white transition-all hover:-translate-y-0.5">Terms of Service</Link>
                        <div className="hidden sm:flex items-center gap-3 bg-white/[0.02] border border-white/5 px-4 py-2 rounded-full">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-emerald-500/80">Global Systems Operational</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
