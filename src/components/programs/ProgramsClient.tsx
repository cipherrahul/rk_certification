"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, BookOpen, Clock, Users, ArrowRight, Star } from 'lucide-react';
import { PROGRAMS, ProgramCategory } from '@/data/programs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProgramsClient() {
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
            {/* Header Section */}
            <div className="max-w-4xl mx-auto text-center mb-20">
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
                    className="text-xl text-slate-400 mb-12"
                >
                    Find the perfect program to accelerate your career or academic journey.
                </motion.p>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-center p-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl max-w-2xl mx-auto mb-12">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search programs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-none focus:ring-0 text-sm py-2 pl-10"
                        />
                    </div>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap justify-center gap-3">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeCategory === category
                                ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Program Grid */}
            <div className="container mx-auto px-4">
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence mode='popLayout'>
                        {filteredPrograms.map((program) => (
                            <motion.div
                                layout
                                key={program.slug}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Link href={`/programs/${program.slug}`}>
                                    <Card className="h-full bg-white/5 border-white/10 hover:border-blue-500/50 transition-all duration-500 group cursor-pointer overflow-hidden backdrop-blur-sm">
                                        <CardHeader>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-3 rounded-2xl bg-blue-600/20 text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                                    <program.icon className="h-6 w-6" />
                                                </div>
                                                <div className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                    {program.category}
                                                </div>
                                            </div>
                                            <CardTitle className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                                {program.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-slate-400 text-sm mb-8 line-clamp-2 leading-relaxed">
                                                {program.description}
                                            </p>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 text-sm text-slate-300">
                                                    <Clock className="h-4 w-4 text-blue-500" />
                                                    {program.duration}
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-slate-300">
                                                    <Users className="h-4 w-4 text-blue-500" />
                                                    {program.target}
                                                </div>
                                            </div>
                                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">
                                                    {program.mode}
                                                </span>
                                                <div className="flex items-center text-sm font-bold text-white opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all">
                                                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredPrograms.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-slate-500 text-lg">No programs found matching your search.</p>
                        <Button
                            variant="link"
                            className="text-blue-500 mt-4"
                            onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                        >
                            Reset all filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
