"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
    GraduationCap,
    Target,
    Eye,
    UserCheck,
    BookOpen,
    Shield,
    Zap,
    Rocket,
    Heart,
    Globe,
    ChevronRight,
    MapPin,
    Calendar,
    Star
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const facultyMembers = [
    { name: "Raghav Kumar", role: "Founder", subject: "Mathematics (M.Sc)", icon: "RK" },
    { name: "Aman Kumar", role: "Sr. Faculty", subject: "Accounts", icon: "AK" },
    { name: "Manish Kumar", role: "Co-Founder", subject: "Mathematics", icon: "MK" },
    { name: "Radhika Kumari", role: "Faculty", subject: "Primary Foundation", icon: "RK" },
    { name: "Suraj Singh", role: "Faculty", subject: "Physics & Chemistry", icon: "SS" },
    { name: "Rahul Choudhary", role: "Tech Lead", subject: "Computer Science", icon: "RC" },
    { name: "Kapil Saini", role: "Faculty", subject: "Competitive Exams", icon: "KS" },
];

const timeline = [
    { year: "2016", title: "The Foundation", description: "RK Institution was established with a vision to provide quality education in Adarsh Nagar." },
    { year: "2018", title: "Digital Integration", description: "Introduced smart classrooms and digital learning aids to enhance the student experience." },
    { year: "2020", title: "Resilience & Growth", description: "Successfully transitioned to hybrid models, ensuring uninterrupted learning during global challenges." },
    { year: "2022", title: "Tech Excellence", description: "Launched professional tech programs in Web Dev and Data Science to bridge the industry gap." },
    { year: "2026", title: "Future Ready", description: "Continuing to lead with 5000+ students and expanded regional presence." },
];

const values = [
    { title: "Integrity", desc: "Honesty and ethical conduct in every academic pursuit.", icon: Shield, color: "text-blue-500" },
    { title: "Innovation", desc: "Embracing new technologies to redefine the learning experience.", icon: Zap, color: "text-amber-500" },
    { title: "Inspiration", desc: "Motivating students to reach beyond their perceived limits.", icon: Rocket, color: "text-purple-500" },
];

export default function AboutPage() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-300" ref={containerRef}>
            {/* Premium Hero Section */}
            <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20">
                <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(white,transparent_70%)]" />
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-700" />

                <div className="container relative z-10 px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold mb-8">
                            <GraduationCap className="h-4 w-4" />
                            Academic Excellence Since 2016
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter">
                            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Journey.</span><br />
                            Your <span className="italic font-serif text-slate-500">Legacy.</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
                            Discover the story behind RK Institution—where tradition meets technology
                            to create a future-ready learning ecosystem.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Institutional Journey (Timeline) */}
            <section className="py-32 relative">
                <div className="container px-4 mx-auto">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-4">Chronicles</h2>
                            <h3 className="text-4xl md:text-5xl font-black text-white mb-8">Eight Years of <br />Transformative Learning</h3>
                            <div className="space-y-12">
                                {timeline.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="relative pl-12 border-l border-white/10 group"
                                    >
                                        <div className="absolute left-[-5px] top-0 w-[10px] h-[10px] rounded-full bg-blue-500 group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                        <span className="text-blue-500 font-black text-xl mb-1 block">{item.year}</span>
                                        <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                                        <p className="text-slate-400 font-medium leading-relaxed">{item.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative group bg-slate-900"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2000&auto=format&fit=crop"
                                    alt="Campus Life"
                                    className="object-cover h-full w-full group-hover:scale-110 transition-transform duration-1000 opacity-60"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                                <div className="absolute bottom-10 left-10 p-8 glass rounded-3xl border-l-4 border-blue-500">
                                    <p className="text-2xl font-black text-white mb-2">5,000+</p>
                                    <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Success Stories</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-32 bg-white/[0.02] border-y border-white/5">
                <div className="container px-4 mx-auto text-center">
                    <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-4">Ethos</h2>
                    <h3 className="text-4xl md:text-5xl font-black text-white mb-20">Values That Define Us</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        {values.map((v, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-10 rounded-[2.5rem] bg-slate-900 border border-white/5 hover:border-blue-500/30 hover:bg-slate-900/50 transition-all group"
                            >
                                <div className={`p-4 rounded-2xl bg-white/5 w-fit mb-8 group-hover:scale-110 transition-transform ${v.color}`}>
                                    <v.icon className="h-8 w-8" />
                                </div>
                                <h4 className="text-2xl font-bold text-white mb-4">{v.title}</h4>
                                <p className="text-slate-400 leading-relaxed font-medium">{v.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section (Glassmorphic) */}
            <section className="py-32 relative overflow-hidden">
                <div className="container px-4 mx-auto">
                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            {
                                title: "Our Mission",
                                content: "To provide top-tier quality education, build unshakeable academic foundations, and promote intensive skill-based learning that empowers our students to succeed in real-world challenges.",
                                icon: Target,
                                color: "from-blue-600 to-indigo-600"
                            },
                            {
                                title: "Our Vision",
                                content: "To become a leading, highly reputed educational institute known for integrating advanced technology-driven learning and expanding our positive impact across multiple regions.",
                                icon: Eye,
                                color: "from-purple-600 to-pink-600"
                            }
                        ].map((box, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative p-12 rounded-[3rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl overflow-hidden group min-h-[400px] flex flex-col justify-center"
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${box.color} opacity-10 blur-3xl group-hover:opacity-30 transition-opacity`} />
                                <div className="mb-8 p-4 rounded-2xl bg-white/5 w-fit">
                                    <box.icon className="h-8 w-8 text-white" />
                                </div>
                                <h4 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">{box.title}</h4>
                                <p className="text-lg text-slate-400 leading-relaxed font-light italic">
                                    &quot;{box.content}&quot;
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Premium Faculty Showcase */}
            <section className="py-32 border-t border-white/5">
                <div className="container px-4 mx-auto mb-20 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-end justify-between gap-8">
                        <div className="max-w-xl">
                            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-4">The Mentors</h2>
                            <h3 className="text-4xl md:text-5xl font-black text-white leading-tight">Led by Excellence. <br />Driven by Mentorship.</h3>
                        </div>
                        <p className="text-slate-500 font-medium max-w-sm">
                            Our faculty members are more than teachers—they are industry practitioners and academic visionaries.
                        </p>
                    </div>
                </div>

                <div className="container px-4 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {facultyMembers.map((fac, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 hover:border-blue-500/40 transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] group"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                                <span className="text-xl font-black text-white">{fac.icon}</span>
                            </div>
                            <h4 className="text-xl font-bold text-white mb-1">{fac.name}</h4>
                            <p className="text-blue-500 text-xs font-bold uppercase tracking-widest mb-4">{fac.role}</p>
                            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                <BookOpen className="h-4 w-4 text-blue-500" />
                                {fac.subject}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
