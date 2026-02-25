"use client";

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    CheckCircle2,
    Users,
    MapPin,
    Clock,
    BookOpen,
    Star,
    ShieldCheck,
    Zap,
    GraduationCap,
    Sparkles,
    ArrowRight,
    HelpCircle,
    ChevronDown,
    CreditCard
} from 'lucide-react';
import { PROGRAMS } from '@/data/programs';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { generateBrochure } from '@/lib/pdf/brochure-generator';

export default function ProgramDetailPage({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const program = PROGRAMS.find(p => p.slug === slug);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    if (!program) {
        notFound();
    }

    const handleGetBrochure = async () => {
        setIsGenerating(true);
        try {
            await generateBrochure(program);
        } catch (error) {
            console.error('Failed to generate brochure:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const sections = [
        { title: 'Faculty Support', items: ['Expert guidance from industry leaders', 'Dedicated doubt-solving counters', 'Personalized attention'], icon: Users },
        { title: 'Test Series & Assessment', items: ['Weekly topic-wise assessments', 'Monthly full-length mock tests', 'Detailed feedback reports'], icon: ShieldCheck },
        { title: 'Study Materials', items: ['Comprehensive subject modules', 'Handwritten class notes', 'Online access portal'], icon: GraduationCap },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white pt-24 pb-20">
            {/* Hero Header */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/5 transition-opacity" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent blur-3xl pointer-events-none" />

                <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/programs" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 group">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back to All Programs
                    </Link>

                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6">
                                <Sparkles className="h-3 w-3" />
                                {program.category} Excellence
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                                {program.title} <span className="text-blue-600">Level.</span>
                            </h1>
                            <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-xl">
                                {program.detailedDescription || program.description}
                            </p>

                            <div className="flex flex-wrap gap-8 mb-10">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                        <Users className="h-6 w-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase">Target</p>
                                        <p className="font-bold">{program.target}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                        <Clock className="h-6 w-6 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase">Duration</p>
                                        <p className="font-bold">{program.duration}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                        <MapPin className="h-6 w-6 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase">Mode</p>
                                        <p className="font-bold">{program.mode}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Link href="/contact">
                                    <Button size="lg" className="h-16 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-xl shadow-blue-600/20">
                                        Enroll Now
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="h-16 px-10 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 font-bold text-lg disabled:opacity-50"
                                    onClick={handleGetBrochure}
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? 'Generating...' : 'Get Brochure'}
                                </Button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-[3rem] blur-3xl -z-10" />
                            <div className="glass p-12 rounded-[3rem] border-white/10 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <program.icon className="h-64 w-64 text-white" />
                                </div>
                                <h3 className="text-3xl font-black mb-8 relative z-10 underline decoration-blue-500 decoration-4 underline-offset-8">Key Subjects</h3>
                                <div className="grid grid-cols-1 gap-4 relative z-10">
                                    {program.subjects.map((sub, i) => (
                                        <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors">
                                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                                            <span className="font-bold text-lg">{sub}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Curriculum Roadmap */}
            <section className="py-24 relative">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black mb-4">Curriculum <span className="text-blue-600">Roadmap.</span></h2>
                        <p className="text-slate-400">A structured path towards excellence in {program.title}.</p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        {program.fullCurriculum.map((module, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="relative pl-12 pb-12 last:pb-0 group"
                            >
                                {/* Vertical Line */}
                                <div className="absolute left-[1.375rem] top-2 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 to-transparent group-last:bg-none" />
                                {/* Bullet */}
                                <div className="absolute left-0 top-0 h-11 w-11 rounded-full bg-slate-900 border-2 border-blue-600 flex items-center justify-center z-10 group-hover:bg-blue-600 transition-colors duration-300">
                                    <span className="font-black text-sm">{idx + 1}</span>
                                </div>

                                <div className="glass p-8 rounded-3xl border-white/5 group-hover:border-blue-500/30 transition-all duration-300">
                                    <h3 className="text-xl font-black mb-4 group-hover:text-blue-400 transition-colors">{module.moduleTitle}</h3>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {module.topics.map((topic, i) => (
                                            <div key={i} className="flex items-center gap-2 text-slate-400 text-sm italic">
                                                <div className="h-1.5 w-1.5 rounded-full bg-blue-600/50" />
                                                {topic}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features & Outcome */}
            <section className="py-24 bg-slate-900/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-12">
                            <div className="grid md:grid-cols-2 gap-8">
                                {sections.map((section, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all"
                                    >
                                        <div className="h-12 w-12 rounded-xl bg-blue-600/20 flex items-center justify-center mb-6">
                                            <section.icon className="h-6 w-6 text-blue-500" />
                                        </div>
                                        <h3 className="text-xl font-black mb-6">{section.title}</h3>
                                        <ul className="space-y-4">
                                            {section.items.map((item, i) => (
                                                <li key={i} className="flex gap-3 text-slate-400 text-sm italic">
                                                    <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                ))}

                                {/* Program Outcomes */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="p-8 rounded-[2rem] bg-blue-600/10 border border-blue-500/20 relative overflow-hidden"
                                >
                                    <div className="h-12 w-12 rounded-xl bg-blue-600/30 flex items-center justify-center mb-6">
                                        <Star className="h-6 w-6 text-blue-400" />
                                    </div>
                                    <h3 className="text-xl font-black mb-6">Program Outcomes</h3>
                                    <ul className="space-y-4">
                                        {program.outcomes.map((outcome, i) => (
                                            <li key={i} className="flex gap-3 text-slate-200 text-sm font-bold">
                                                <div className="h-5 w-5 rounded-full bg-blue-600/30 flex items-center justify-center shrink-0">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                                                </div>
                                                {outcome}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Fee Card */}
                            {program.fees && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    className="p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 relative overflow-hidden group"
                                >
                                    <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                        <CreditCard className="h-48 w-48 text-white rotate-12" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.2em] mb-4">Course Fee Structure</p>
                                    <h3 className="text-3xl font-black mb-6 flex items-baseline gap-2">
                                        {program.fees.split('|')[0]}
                                    </h3>
                                    {program.fees.includes('|') && (
                                        <p className="text-sm text-slate-400 mb-8 font-medium italic border-l-2 border-blue-500 pl-4">
                                            Alternative payment options: {program.fees.split('|')[1]}
                                        </p>
                                    )}
                                    <Button className="w-full h-14 rounded-xl bg-white text-slate-900 font-bold hover:bg-blue-500 hover:text-white transition-all">
                                        Request Fee Breakup
                                    </Button>
                                </motion.div>
                            )}

                            {/* Batch Info */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl"
                            >
                                <h3 className="text-2xl font-black mb-6 underline decoration-white/20 underline-offset-8">Student Intake</h3>
                                <p className="text-blue-100 mb-8 italic text-sm">Now accepting applications for the 2025 Summer session.</p>
                                <div className="p-6 rounded-2xl bg-black/10 backdrop-blur-sm border border-white/10">
                                    <p className="text-xs uppercase font-black tracking-widest text-blue-200 mb-2">Next Batch Starting</p>
                                    <p className="text-xl font-bold">Monday, 3rd March</p>
                                </div>
                            </motion.div>

                            <div className="p-8 rounded-[2.5rem] glass border-dashed bg-transparent text-center border-2 border-white/10">
                                <h4 className="font-bold text-slate-400 mb-4 uppercase text-[10px] tracking-[0.2em]">Have Questions?</h4>
                                <p className="text-lg font-bold mb-6 italic">Talk to our career experts today for a free guidance session.</p>
                                <Link href="/contact">
                                    <Button variant="outline" className="w-full h-14 rounded-xl border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all font-bold">
                                        Schedule Counseling
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Leadership Section */}
            <section className="py-24 bg-slate-900/50 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/5 via-transparent to-transparent blur-3xl pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black mb-4">Meet Our <span className="text-blue-600">Visionaries.</span></h2>
                        <p className="text-slate-400">Leading the way in transformative education and technical excellence.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        {[
                            {
                                name: "Manish Choudhary",
                                role: "Founder & Mathematics Expert",
                                bio: "M.Sc Mathematics with a mission to simplify competitive learning for regular students.",
                                img: "/images/faculty/manish.jpg"
                            },
                            {
                                name: "Rahul Choudhary",
                                role: "Co-founder & Software Engineer",
                                bio: "B.Tech Computer Science leading our technical innovation and professional tracks.",
                                img: "/images/faculty/rahul_mentor.png"
                            }
                        ].map((m, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="glass p-8 rounded-[3rem] border-white/5 flex flex-col items-center text-center group"
                            >
                                <div className="h-48 w-48 rounded-full overflow-hidden mb-8 border-4 border-blue-600/20 group-hover:border-blue-600 transition-colors duration-500 shadow-2xl">
                                    <img src={m.img} alt={m.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <h3 className="text-2xl font-black mb-2">{m.name}</h3>
                                <p className="text-blue-500 font-bold mb-4 uppercase text-xs tracking-[0.2em]">{m.role}</p>
                                <p className="text-slate-400 italic text-sm leading-relaxed">{m.bio}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 border-t border-white/5">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-16">
                        <div className="inline-flex h-12 w-12 rounded-full bg-blue-600/10 items-center justify-center mb-6">
                            <HelpCircle className="h-6 w-6 text-blue-500" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black mb-4">Frequently Asked <span className="text-blue-600">Questions.</span></h2>
                    </div>

                    <div className="space-y-4">
                        {program.faq.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                className="w-full text-left glass rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 hover:border-blue-500/30"
                            >
                                <div className="p-6 flex items-center justify-between pointer-events-none">
                                    <span className="font-bold text-lg">{item.question}</span>
                                    <ChevronDown className={`h-5 w-5 text-blue-500 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                                </div>
                                <AnimatePresence>
                                    {openFaq === idx && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-6 pt-0 text-slate-400 italic leading-relaxed border-t border-white/5 mt-2">
                                                {item.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
