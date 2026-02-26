"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    CheckCircle2,
    Clock,
    Users,
    MapPin,
    ArrowRight,
    Star,
    Award,
    Shield,
    Download
} from 'lucide-react';
import { Program } from '@/data/programs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { generateBrochure } from '@/lib/pdf/brochure-generator';
import ProgramIcon from './ProgramIcon';

export default function ProgramDetailClient({ program }: { program: Program }) {
    const [activeModule, setActiveModule] = useState<number | null>(0);
    const [isGenerating, setIsGenerating] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 text-white pt-24 pb-20">
            {/* Hero Header */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-400 text-sm font-bold mb-8">
                            <Star className="h-4 w-4 fill-current" />
                            {program.highlight}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-slate-900 border border-white/5">
                                <ProgramIcon name={program.icon} className="h-8 w-8 md:h-10 md:w-10 text-blue-500" />
                            </div>
                            <span>{program.title} <span className="text-blue-600">Level.</span></span>
                        </h1>
                        <p className="text-xl text-slate-400 mb-10 leading-relaxed font-light">
                            {program.detailedDescription}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                            {[
                                { icon: Clock, label: "Duration", value: program.duration, color: "text-blue-500" },
                                { icon: Users, label: "Target", value: program.target, color: "text-purple-500" },
                                { icon: MapPin, label: "Mode", value: program.mode, color: "text-emerald-500" },
                                { icon: Award, label: "Certification", value: "ISO Certified", color: "text-amber-500" },
                            ].map((stat, i) => (
                                <div key={i} className="glass p-4 rounded-2xl border-white/5">
                                    <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
                                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{stat.label}</p>
                                    <p className="text-sm font-bold text-white">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button
                                size="lg"
                                className="rounded-full h-14 px-8 bg-blue-600 hover:bg-blue-700 font-bold"
                                onClick={async () => {
                                    setIsGenerating(true);
                                    try {
                                        await generateBrochure(program);
                                    } catch (error) {
                                        console.error("Brochure generation failed:", error);
                                    } finally {
                                        setIsGenerating(false);
                                    }
                                }}
                                disabled={isGenerating}
                            >
                                {isGenerating ? "Preparing..." : "Download Brochure"}
                                <Download className="ml-2 h-5 w-5" />
                            </Button>
                            <Link href="/contact">
                                <Button size="lg" className="rounded-full h-14 px-8 bg-indigo-600 hover:bg-indigo-700 text-white border-0 font-extrabold shadow-xl transition-all hover:scale-105">
                                    Contact Admission
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Curriculum Section */}
            <section className="py-24 bg-white/5 backdrop-blur-sm border-y border-white/5">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16">
                        <div>
                            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-[0.2em] mb-4">The Syllabus</h2>
                            <h3 className="text-4xl font-black mb-8">Comprehensive <br /> <span className="text-blue-600">Learning Path.</span></h3>
                            <div className="space-y-4">
                                {program.fullCurriculum.map((module, idx) => (
                                    <div
                                        key={idx}
                                        className={`rounded-2xl border transition-all duration-300 overflow-hidden ${activeModule === idx ? 'bg-white/10 border-blue-500/50' : 'bg-white/5 border-white/5'}`}
                                    >
                                        <button
                                            className="w-full px-6 py-5 flex items-center justify-between text-left"
                                            onClick={() => setActiveModule(activeModule === idx ? null : idx)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="h-8 w-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                                                    0{idx + 1}
                                                </span>
                                                <span className="font-bold">{module.moduleTitle}</span>
                                            </div>
                                            <ChevronDown className={`h-5 w-5 text-slate-500 transition-transform ${activeModule === idx ? 'rotate-180' : ''}`} />
                                        </button>
                                        <AnimatePresence>
                                            {activeModule === idx && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="px-6 pb-6 pt-0"
                                                >
                                                    <div className="pl-12 space-y-3">
                                                        {module.topics.map((topic, i) => (
                                                            <div key={i} className="flex items-center gap-3 text-sm text-slate-400">
                                                                <div className="h-1 w-1 rounded-full bg-blue-500" />
                                                                {topic}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-8">
                            <Card className="glass border-white/5 p-8 rounded-3xl">
                                <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <SparkleIcon className="h-5 w-5 text-blue-500" /> Key Highlights
                                </h4>
                                <div className="space-y-4">
                                    {program.features.map((feature, i) => (
                                        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-blue-500/30 transition-colors">
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                                            <p className="text-sm font-medium text-slate-300">{feature}</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card className="glass border-white/5 p-8 rounded-3xl bg-blue-600/20 border-blue-500/20">
                                <h4 className="text-xl font-bold mb-4">Learning Outcomes</h4>
                                <div className="space-y-3">
                                    {program.outcomes.map((outcome, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm font-medium text-slate-200">
                                            <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                                            {outcome}
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQs Section */}
            <section className="py-24">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-center text-4xl font-black mb-16">Frequently Asked <span className="text-blue-600">Questions.</span></h2>
                    <div className="space-y-4">
                        {program.faq.map((item, idx) => (
                            <div key={idx} className="glass p-6 rounded-2xl border-white/5">
                                <h5 className="font-bold text-lg mb-3 flex items-start gap-3">
                                    <span className="text-blue-500 mt-1">Q.</span>
                                    {item.question}
                                </h5>
                                <p className="text-slate-400 pl-8 leading-relaxed">
                                    {item.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Fees Section */}
            {program.fees && (
                <section className="py-24 bg-slate-900 border-y border-white/5">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-sm font-bold text-blue-500 uppercase tracking-[0.2em] mb-4">Investment</h2>
                        <h3 className="text-4xl font-black mb-12">Program <span className="text-blue-600">Enrollment Fee.</span></h3>
                        <div className="max-w-md mx-auto glass p-10 rounded-[2.5rem] border-white/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Shield className="h-32 w-32" />
                            </div>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-4">Starting From</p>
                            <div className="text-5xl font-black mb-6 flex items-center justify-center gap-2">
                                <span className="text-2xl text-slate-500 font-normal">₹</span>
                                {program.fees}
                            </div>
                            <Button className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold">Secure Your Seat</Button>
                            <p className="text-[10px] text-slate-500 mt-6 font-medium">Includes course materials, lab access, and certification fee.</p>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}

function SparkleIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2003/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
        </svg>
    )
}
