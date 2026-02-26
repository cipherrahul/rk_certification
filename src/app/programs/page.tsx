"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    ArrowRight,
    Users,
    Clock,
    MapPin,
    Sparkles
} from 'lucide-react';
import { PROGRAMS, ProgramCategory } from '@/data/programs';
import ProgramIcon from '@/components/programs/ProgramIcon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProgramsPage() {
    const [activeCategory, setActiveCategory] = useState<ProgramCategory | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');

    const categories: (ProgramCategory | 'All')[] = ['All', 'Academic', 'Entrance', 'Competitive', 'Professional'];

    const filteredPrograms = PROGRAMS.filter(program => {
        const matchesCategory = activeCategory === 'All' || program.category === activeCategory;
        const matchesSearch = program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            program.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-slate-950 text-white pt-24 pb-20 overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-400 text-sm font-bold mb-6"
                    >
                        <Sparkles className="h-4 w-4" />
                        Empowering Careers Since 2016
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black mb-8 leading-tight"
                    >
                        Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Programs.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-400 leading-relaxed font-light"
                    >
                        From academic foundations to national competitive mastery, find the right path to accelerate your success.
                    </motion.p>
                </div>

                {/* Search & Filter Bar */}
                <div className="max-w-5xl mx-auto mb-16">
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between glass p-6 rounded-[2.5rem]">
                        {/* Search */}
                        <div className="relative w-full md:max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search for programs..."
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500 transition-all text-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-2 justify-center">
                            {categories.map((cat) => (
                                <Button
                                    key={cat}
                                    variant={activeCategory === cat ? 'default' : 'ghost'}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`rounded-xl transition-all ${activeCategory === cat
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {cat}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Programs Grid */}
                <motion.div
                    layout
                    className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredPrograms.map((program) => (
                            <motion.div
                                key={program.slug}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Link href={`/programs/${program.slug}`}>
                                    <Card className="group relative glass h-full border-white/5 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-500 cursor-pointer overflow-hidden p-0.5">
                                        <CardHeader className="relative p-6 pb-2">
                                            <div className="absolute top-6 right-6 px-2 py-0.5 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-400 text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                                {program.highlight}
                                            </div>
                                            <div className="mb-4 p-3 rounded-2xl bg-slate-900 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 w-fit">
                                                <ProgramIcon name={program.icon} className="h-6 w-6 text-blue-500" />
                                            </div>
                                            <CardTitle className="text-lg font-black group-hover:text-blue-400 transition-colors text-white">{program.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6 pt-0 space-y-4">
                                            <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                                                {program.description}
                                            </p>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <Users className="h-4 w-4 text-blue-500" />
                                                    {program.target}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <Clock className="h-4 w-4 text-purple-500" />
                                                    {program.duration}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <MapPin className="h-4 w-4 text-emerald-500" />
                                                    {program.mode}
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-blue-400 text-sm font-bold group/btn">
                                                Learn More
                                                <div className="h-8 w-8 rounded-full bg-blue-600/10 flex items-center justify-center group-hover/btn:bg-blue-600 group-hover/btn:text-white transition-all">
                                                    <ArrowRight className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State */}
                {filteredPrograms.length === 0 && (
                    <div className="py-40 text-center">
                        <h3 className="text-2xl font-bold text-slate-500">No programs found matching your criteria.</h3>
                        <Button
                            variant="link"
                            onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                            className="text-blue-500 mt-4"
                        >
                            Clear all filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
