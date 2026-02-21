"use client";

import { useEffect, useState, useRef } from "react";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Mock data representing top students (you can later replace this with API data)
const TOP_STUDENTS = [
    {
        id: 1,
        name: "Sarah Jenkins",
        course: "Full Stack Development",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
        rating: 5,
        review: "This certification helped me land my dream job as a software engineer!",
    },
    {
        id: 2,
        name: "Michael Chen",
        course: "Data Science Certification",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
        rating: 5,
        review: "The curriculum is perfectly aligned with current industry standards.",
    },
    {
        id: 3,
        name: "Elena Rodriguez",
        course: "Cloud Computing",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
        rating: 4.8,
        review: "Excellent practical exercises and easily verifiable credentials.",
    },
    {
        id: 4,
        name: "David Kim",
        course: "AI/ML",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
        rating: 5,
        review: "The best structured artificial intelligence program I've attended.",
    },
    {
        id: 5,
        name: "Anita Desai",
        course: "Digital Marketing Certification",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
        rating: 4.9,
        review: "Highly recommended! Transformative learning experience.",
    },
    {
        id: 6,
        name: "James Wilson",
        course: "Cybersecurity",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop",
        rating: 5,
        review: "Practical, rigorous, and exactly what employers are looking for.",
    }
];

export function StudentProfileCarousel() {
    const [isHovered, setIsHovered] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logic
    useEffect(() => {
        let animationFrameId: number;
        let lastTime = performance.now();
        const pixelsPerSecond = 40; // Adjust speed here

        const scroll = (currentTime: number) => {
            if (!isHovered && scrollRef.current) {
                const deltaTime = (currentTime - lastTime) / 1000;
                scrollRef.current.scrollLeft += pixelsPerSecond * deltaTime;

                // Reset scroll to create infinite loop effect
                // When we've scrolled past half the content (since we duplicate the array)
                if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth / 2) {
                    scrollRef.current.scrollLeft = 0;
                }
            }
            lastTime = currentTime;
            animationFrameId = requestAnimationFrame(scroll);
        };

        animationFrameId = requestAnimationFrame(scroll);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isHovered]);

    // Duplicate array to enable seamless infinite scrolling
    const carouselItems = [...TOP_STUDENTS, ...TOP_STUDENTS];

    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-900 overflow-hidden relative border-t border-slate-200 dark:border-slate-800">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-indigo-100/50 dark:bg-indigo-900/20 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-100/50 dark:bg-blue-900/20 blur-3xl pointer-events-none"></div>

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                        Meet Our <span className="text-indigo-600 dark:text-indigo-400">Certified Alumni</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Join thousands of successful students who have advanced their careers with our industry-recognized certifications.
                    </p>
                </div>

                <div className="relative">
                    {/* Left and Right Gradient Fades for visual smoothness */}
                    <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-900 z-10 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-slate-50 to-transparent dark:from-slate-900 z-10 pointer-events-none"></div>

                    {/* Scrolling Container */}
                    <div
                        ref={scrollRef}
                        className="flex overflow-hidden gap-6 py-4 px-4 snap-x snap-mandatory scrollbar-hide select-none touch-pan-x"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onTouchStart={() => setIsHovered(true)}
                        onTouchEnd={() => setIsHovered(false)}
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
                        {carouselItems.map((student, idx) => (
                            <Card
                                key={`${student.id}-${idx}`}
                                className="min-w-[320px] max-w-[320px] md:min-w-[380px] md:max-w-[380px] shrink-0 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all bg-white dark:bg-slate-950"
                            >
                                <CardContent className="p-6 md:p-8 flex flex-col items-center text-center h-full">
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-sm opacity-40"></div>
                                        <img
                                            src={student.image}
                                            alt={student.name}
                                            className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-900 relative z-10 shadow-sm"
                                            draggable={false}
                                        />
                                        <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-900 rounded-full p-1 shadow-sm border border-slate-100 dark:border-slate-800 z-20">
                                            <div className="bg-emerald-500 rounded-full w-5 h-5 flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{student.name}</h3>
                                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-4">{student.course}</p>

                                    <div className="flex items-center justify-center gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={cn(
                                                    "w-4 h-4",
                                                    i < Math.floor(student.rating)
                                                        ? "text-amber-400 fill-amber-400"
                                                        : i < student.rating
                                                            ? "text-amber-400 fill-amber-400 opacity-50"
                                                            : "text-slate-200 dark:text-slate-800"
                                                )}
                                            />
                                        ))}
                                        <span className="ml-2 text-sm font-semibold text-slate-700 dark:text-slate-300">{student.rating.toFixed(1)}</span>
                                    </div>

                                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 italic">
                                        "{student.review}"
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
