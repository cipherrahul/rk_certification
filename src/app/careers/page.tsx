import Link from "next/link";
import { Briefcase, MapPin, Clock, ArrowRight, GraduationCap, Sparkles, TrendingUp, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getJobs } from "@/lib/actions/jobs";

export const metadata = {
    title: "Careers | RK Institution",
    description: "Join the RK Institution team. Explore current openings and build a rewarding career in education and content creation.",
};

export default async function CareersPage() {
    // Fetch only published jobs
    const jobs = await getJobs(true);

    return (
        <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-slate-950 selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
            {/* Hero Section with Animated Background */}
            <section className="relative py-24 md:py-32 overflow-hidden bg-[#0a0a0b]">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
                </div>

                <div className="container relative z-10 px-4 md:px-6 mx-auto max-w-6xl text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-indigo-300 text-xs font-semibold mb-8 animate-fade-in">
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        <span>Work with the best in Education</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                        Shape the Future of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-300% animate-gradient">Learning</span>
                    </h1>

                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
                        Join RK Institution&apos;s mission to empower minds. We&apos;re looking for visionaries, educators, and creators.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div className="text-left">
                                <div className="text-white font-bold text-lg leading-none">{jobs.length}+</div>
                                <div className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold mt-1">Open Roles</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-purple-400" />
                            </div>
                            <div className="text-left">
                                <div className="text-white font-bold text-lg leading-none">Hybrid</div>
                                <div className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold mt-1">Work Mode</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Job Listings Section */}
            <section className="py-20 -mt-10 relative z-20">
                <div className="container px-4 md:px-6 mx-auto max-w-5xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Current Openings</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Find your next role at RK Institution.</p>
                        </div>
                        <div className="relative w-full md:w-72 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search roles..."
                                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all text-sm shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {jobs.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[24px] border border-dashed border-slate-200 dark:border-slate-800">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Openings Right Now</h3>
                                <p className="text-slate-500 text-sm">Check back soon for new opportunities.</p>
                            </div>
                        ) : (
                            jobs.map((job) => (
                                <Link key={job.id} href={`/careers/${job.id}`} className="block group">
                                    <Card className="p-0 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-300 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 overflow-hidden rounded-2xl">
                                        <div className="p-6 md:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex-1 space-y-3">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                        {job.title}
                                                    </h3>
                                                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-[10px] uppercase tracking-wider font-bold border border-indigo-100 dark:border-indigo-800/50">
                                                        {job.employment_type}
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-slate-500 dark:text-slate-400 font-medium">
                                                    <span className="flex items-center gap-1.5">
                                                        <GraduationCap className="w-3.5 h-3.5 text-indigo-500/70" />
                                                        {job.department}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <MapPin className="w-3.5 h-3.5 text-rose-500/70" />
                                                        {job.location}
                                                    </span>
                                                    <span className="font-bold text-indigo-600/90 dark:text-indigo-400/90">
                                                        {job.salary_range}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-800">
                                                <div className="hidden sm:flex flex-col items-end mr-2">
                                                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">Expertise</span>
                                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                                                        {job.experience_required}
                                                    </span>
                                                </div>
                                                <div className="w-10 h-10 rounded-xl bg-indigo-600 group-hover:bg-indigo-700 text-white flex items-center justify-center transition-all shadow-md shadow-indigo-500/20">
                                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Why Join Us Section */}
            <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <div className="container px-4 md:px-6 mx-auto max-w-5xl">
                    <div className="max-w-2xl mb-12">
                        <h2 className="text-3xl font-bold tracking-tight mb-3 text-slate-900 dark:text-white leading-tight">Beyond a workplace. <br /><span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Join a collective of visionaries.</span></h2>
                        <p className="text-slate-500 dark:text-slate-400 text-base">We invest in people who are passionate about changing the education landscape.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: "⚡",
                                title: "High-Octane Growth",
                                desc: "Fast-tracked career paths with annual increments and learning opportunities.",
                                color: "bg-amber-50 dark:bg-amber-900/10 text-amber-600"
                            },
                            {
                                icon: "🌍",
                                title: "Global Impact",
                                desc: "Your work touches the lives of thousands of students across our diverse platforms.",
                                color: "bg-blue-50 dark:bg-blue-900/10 text-blue-600"
                            },
                            {
                                icon: "🎨",
                                title: "Total Autonomy",
                                desc: "We hire experts and get out of their way. Creative freedom is our core tenet.",
                                color: "bg-purple-50 dark:bg-purple-900/10 text-purple-600"
                            },
                        ].map((item) => (
                            <div key={item.title} className="p-7 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 hover:border-indigo-500/20 transition-all">
                                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-xl mb-5 shadow-sm`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">{item.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-20 bg-[#0a0a0b] text-white relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-600/10 blur-[120px]" />
                <div className="container relative z-10 px-4 mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Didn&apos;t find your role?</h2>
                    <p className="text-slate-400 mb-8 text-base">We&apos;re always on the lookout for exceptional talent. <br />Drop your resume for future opportunities.</p>
                    <a href="mailto:info.rkinstitution2016@gmail.com?subject=General%20Career%20Inquiry%20-%20RK%20Institution">
                        <Button size="lg" className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20">
                            Apply for General Pool <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </a>
                </div>
            </section>
        </div>
    );
}
