"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import {
    GraduationCap, Target, Eye, Users, TrendingUp, Award, Building2, BookOpen,
    CheckCircle2, ArrowRight, Lightbulb, Globe, ShieldCheck, Zap, Star, Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" }
    })
};

const stats = [
    { value: "2016", label: "Year Founded", icon: Building2 },
    { value: "5,000+", label: "Students Trained", icon: Users },
    { value: "5+", label: "Branches", icon: Globe },
    { value: "98%", label: "Success Rate", icon: TrendingUp },
];

const values = [
    {
        icon: Lightbulb,
        title: "Conceptual Clarity",
        desc: "We go beyond textbooks — our pedagogy is rooted in deep conceptual understanding, ensuring students can apply knowledge in any situation.",
        color: "from-yellow-500/20 to-amber-500/10 border-yellow-500/30 text-yellow-500"
    },
    {
        icon: Heart,
        title: "Student-First Culture",
        desc: "Every decision we make at RK Institution is guided by our students' growth, well-being, and long-term success.",
        color: "from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-500"
    },
    {
        icon: ShieldCheck,
        title: "Integrity & Trust",
        desc: "We uphold the highest standards of transparency and accountability — from admissions to certifications.",
        color: "from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-500"
    },
    {
        icon: Zap,
        title: "Innovation First",
        desc: "Our curriculum is continually upgraded with cutting-edge tools, industry trends, and emerging technologies.",
        color: "from-purple-500/20 to-violet-500/10 border-purple-500/30 text-purple-500"
    },
    {
        icon: Globe,
        title: "Holistic Development",
        desc: "Beyond academics, we cultivate leadership, communication, and critical-thinking skills that matter in the real world.",
        color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-500"
    },
    {
        icon: Award,
        title: "Results-Driven",
        desc: "Our track record speaks for itself — thousands of students placed in top universities, companies, and government roles.",
        color: "from-orange-500/20 to-red-500/10 border-orange-500/30 text-orange-500"
    },
];

const milestones = [
    { year: "2016", title: "Foundation Laid", desc: "RK Institution was founded by Manish Choudhary in New Delhi, starting with a single classroom and a vision to democratize quality education." },
    { year: "2018", title: "First Expansion", desc: "Opened our second branch and introduced the JEE/NEET preparation wing, receiving an overwhelming response from students." },
    { year: "2020", title: "Digital Shift", desc: "Launched a full online learning platform during the pandemic, reaching students across multiple states and ensuring zero learning disruption." },
    { year: "2022", title: "Technology Programs", desc: "Introduced Professional Development programs in Full Stack Development, Data Science, and ADCA — bridging the skill gap for the digital economy." },
    { year: "2024", title: "Institutional Recognition", desc: "Achieved ISO 9001:2015 certification, and expanded to 5 state-of-the-art branches with AI-powered learning infrastructure." },
    { year: "2025", title: "Digital Portal Launch", desc: "Launched our integrated student and teacher portal, digitizing admissions, results, ID cards, fee receipts, and timetables end-to-end." },
];

const facultyMembers = [
    { name: "Manish Choudhary", subject: "Founder & Mathematics Expert", exp: "M.Sc Mathematics", initial: "M", color: "bg-blue-600" },
    { name: "Rahul Choudhary", subject: "Co-founder & Software Engineer", exp: "B.Tech Computer Science", initial: "R", color: "bg-indigo-600" },
    { name: "Aman Kumar", subject: "Accounts & Commerce", exp: "M.Com Finance", initial: "A", color: "bg-emerald-600" },
    { name: "Radhika Kumari", subject: "Primary Education (Cl 1–8)", exp: "B.Ed, 10+ Years", initial: "R", color: "bg-rose-600" },
    { name: "Suraj Singh", subject: "Physics & Chemistry", exp: "B.Sc Physics", initial: "S", color: "bg-amber-600" },
    { name: "Kapil Saini", subject: "Computer Science & Typing", exp: "MCA, PGDCA", initial: "K", color: "bg-violet-600" },
];

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-[#020617] text-slate-300 overflow-x-hidden">

            {/* ─── HERO ─────────────────────────────────────────── */}
            <section className="relative min-h-[60vh] flex items-center justify-center pt-32 pb-24 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px]" />
                    <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px]" />
                </div>

                <div className="container relative z-10 px-4 mx-auto max-w-5xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-400 mb-8"
                    >
                        <Star className="h-3 w-3 fill-blue-400" /> Est. 2016 · Delhi, India
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.1] mb-8"
                    >
                        Shaping India&apos;s{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            Next Generation
                        </span>
                        <br />of Leaders
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10"
                    >
                        RK Institution is more than a coaching center — it is a movement dedicated to making
                        high-quality, career-defining education accessible to every student in India.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        <Link href="/programs">
                            <Button className="h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-700 font-bold text-white shadow-lg shadow-blue-600/20">
                                Explore Programs <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button variant="outline" className="h-12 px-8 rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10">
                                Get in Touch
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ─── STATS BAR ────────────────────────────────────── */}
            <section className="border-y border-white/5 bg-white/[0.02] py-12">
                <div className="container px-4 mx-auto max-w-5xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                custom={i}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:border-blue-600/30 transition-all">
                                    <stat.icon className="h-6 w-6 text-blue-500" />
                                </div>
                                <p className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</p>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── OUR STORY ────────────────────────────────────── */}
            <section className="py-32">
                <div className="container px-4 mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <p className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4">Our Story</p>
                            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-8">
                                A Legacy Built on <span className="text-blue-400">Purpose</span>
                            </h2>
                            <div className="space-y-5 text-slate-400 text-lg leading-relaxed">
                                <p>
                                    In 2016, <strong className="text-white">Manish Choudhary (M.Sc Mathematics)</strong> founded RK Institution
                                    with a single, audacious goal: to bridge the widening gap between academic potential and real-world achievement.
                                </p>
                                <p>
                                    Starting with a single classroom in Adarsh Nagar, New Delhi, RK Institution rapidly gained recognition
                                    for its result-oriented methodology and genuine care for student outcomes. Word spread — and so did our impact.
                                </p>
                                <p>
                                    Today, we operate <strong className="text-white">5+ branches</strong>, offer programs across academic,
                                    competitive, and professional verticals, and serve <strong className="text-white">5,000+ learners</strong>.
                                    Our digital portal has made administrative processes seamless for students, teachers, and administrators alike.
                                </p>
                            </div>
                            <div className="mt-10 grid grid-cols-2 gap-4">
                                {["Board Results", "JEE/NEET Selections", "Government Job Placements", "Tech Industry Hires"].map((item) => (
                                    <div key={item} className="flex items-center gap-2 text-sm font-medium text-slate-300">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            variants={fadeUp}
                            custom={2}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl" />
                            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] border border-white/10 shadow-2xl">
                                <Image
                                    src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2000&auto=format&fit=crop"
                                    alt="RK Institution Campus"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6 p-5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center">
                                            <GraduationCap className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm">Adarsh Nagar Campus</p>
                                            <p className="text-slate-400 text-xs">Primary HQ · Est. 2016</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ─── MISSION & VISION ─────────────────────────────── */}
            <section className="py-24 border-y border-white/5 bg-white/[0.02]">
                <div className="container px-4 mx-auto max-w-5xl">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <p className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4">Purpose</p>
                        <h2 className="text-4xl md:text-5xl font-black text-white">Mission & Vision</h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            {
                                icon: Target,
                                label: "Our Mission",
                                color: "blue",
                                text: "To provide top-tier, accessible education that builds unshakeable academic foundations and promotes intensive skill-based learning — empowering every student to succeed in real-world challenges, whether academic, professional, or entrepreneurial."
                            },
                            {
                                icon: Eye,
                                label: "Our Vision",
                                color: "purple",
                                text: "To become India's most trusted multi-vertical educational institution, recognized for integrating technology-driven learning, producing exceptional academic results, and nurturing leaders who positively impact society at every level."
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={item.label}
                                custom={i}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="relative p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-sm hover:border-blue-600/30 transition-all duration-500"
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${item.color === 'blue' ? 'bg-blue-600/10 border border-blue-600/20' : 'bg-purple-600/10 border border-purple-600/20'}`}>
                                    <item.icon className={`h-7 w-7 ${item.color === 'blue' ? 'text-blue-500' : 'text-purple-500'}`} />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4">{item.label}</h3>
                                <p className="text-slate-400 leading-relaxed text-lg">{item.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CORE VALUES ──────────────────────────────────── */}
            <section className="py-32">
                <div className="container px-4 mx-auto max-w-6xl">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <p className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4">What We Stand For</p>
                        <h2 className="text-4xl md:text-5xl font-black text-white">
                            Our Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Values</span>
                        </h2>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {values.map((v, i) => (
                            <motion.div
                                key={v.title}
                                custom={i}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className={`p-7 rounded-3xl border bg-gradient-to-br ${v.color} backdrop-blur-sm hover:-translate-y-1 transition-all duration-300 group`}
                            >
                                <v.icon className="h-8 w-8 mb-5" />
                                <h3 className="text-white font-black text-xl mb-3">{v.title}</h3>
                                <p className="text-slate-400 leading-relaxed text-sm">{v.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── TIMELINE ─────────────────────────────────────── */}
            <section className="py-24 border-y border-white/5 bg-white/[0.02]">
                <div className="container px-4 mx-auto max-w-4xl">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <p className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4">Our Journey</p>
                        <h2 className="text-4xl md:text-5xl font-black text-white">
                            A Decade of <span className="text-blue-400">Milestones</span>
                        </h2>
                    </motion.div>

                    <div className="relative">
                        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-600/80 via-purple-600/50 to-transparent" />
                        <div className="space-y-12">
                            {milestones.map((m, i) => (
                                <motion.div
                                    key={m.year}
                                    custom={i}
                                    variants={fadeUp}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    className={`relative flex ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col md:gap-12 gap-4 items-start md:items-center`}
                                >
                                    <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'} pl-14 md:pl-0`}>
                                        <div className={`p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-600/30 transition-all duration-300 ${i % 2 === 0 ? 'md:ml-auto' : ''}`}>
                                            <p className="text-blue-500 font-black text-lg mb-1">{m.year}</p>
                                            <h3 className="text-white font-black text-xl mb-2">{m.title}</h3>
                                            <p className="text-slate-400 text-sm leading-relaxed">{m.desc}</p>
                                        </div>
                                    </div>
                                    {/* Dot on timeline */}
                                    <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-6 md:top-1/2 md:-translate-y-1/2 w-5 h-5 rounded-full bg-blue-600 border-4 border-[#020617] shadow-lg shadow-blue-600/30 z-10" />
                                    <div className="md:w-1/2 hidden md:block" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── FACULTY ──────────────────────────────────────── */}
            <section className="py-32">
                <div className="container px-4 mx-auto max-w-6xl">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <p className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4">The Team</p>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                            Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Expert Faculty</span>
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Seasoned educators and industry professionals who combine deep subject mastery with a genuine passion for student success.
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {facultyMembers.map((f, i) => (
                            <motion.div
                                key={f.name}
                                custom={i}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="group p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-blue-600/30 transition-all duration-500 hover:-translate-y-1"
                            >
                                <div className="flex items-center gap-4 mb-5">
                                    <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center text-white text-xl font-black shadow-lg shrink-0`}>
                                        {f.initial}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-black text-lg leading-tight">{f.name}</h3>
                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mt-0.5">{f.exp}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5">
                                    <BookOpen className="h-4 w-4 text-blue-500 shrink-0" />
                                    <span className="text-slate-300 text-sm font-medium">{f.subject}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA ──────────────────────────────────────────── */}
            <section className="py-24 px-4">
                <div className="container mx-auto max-w-5xl">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="relative rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-800 p-12 md:p-20 text-center overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl translate-y-1/2 -translate-x-1/2" />
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                                Ready to Begin Your <br />
                                <span className="italic text-blue-200">Success Story?</span>
                            </h2>
                            <p className="text-blue-100/80 text-lg mb-10 max-w-2xl mx-auto">
                                Join thousands of students who have transformed their academic and professional lives at RK Institution. Your journey starts with a single step.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/contact">
                                    <Button size="lg" className="h-14 px-10 rounded-full bg-white text-blue-700 font-black hover:bg-blue-50 shadow-2xl transition-all hover:scale-105">
                                        Enroll Now
                                    </Button>
                                </Link>
                                <Link href="/programs">
                                    <Button size="lg" className="h-14 px-10 rounded-full border-2 border-white/30 bg-transparent text-white font-bold hover:bg-white/10 transition-all hover:scale-105 shadow-none hover:shadow-none">
                                        Browse Programs
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
