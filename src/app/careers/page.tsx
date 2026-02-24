import Link from "next/link";
import { Briefcase, MapPin, Clock, Calendar, ChevronRight, GraduationCap, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { jobs } from "@/lib/data/jobs";

const badgeStyles: Record<string, string> = {
    red: "bg-red-100 text-red-700 border border-red-200",
    blue: "bg-blue-100 text-blue-700 border border-blue-200",
    pink: "bg-pink-100 text-pink-700 border border-pink-200",
};

export const metadata = {
    title: "Careers | RK Institution",
    description: "Join the RK Institution team. Explore current openings and build a rewarding career in education and content creation.",
};

export default function CareersPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Hero */}
            <section className="relative py-24 bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-700 overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5))]" />
                <div className="container relative z-10 px-4 md:px-6 mx-auto max-w-5xl text-center">
                    <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 text-sm font-medium text-white mb-8">
                        <Briefcase className="mr-2 h-4 w-4" />
                        We&apos;re Hiring &mdash; {jobs.length} Open Positions
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
                        Build Your Career at<br />
                        <span className="text-indigo-200">RK Institution</span>
                    </h1>
                    <p className="text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
                        Join a passionate team of educators and creators committed to shaping the next generation of thinkers and professionals.
                    </p>
                    <p className="mt-4 inline-flex items-center gap-2 text-indigo-200 font-semibold text-sm bg-white/10 rounded-full px-5 py-2 border border-white/20">
                        <Calendar className="w-4 h-4" />
                        Last date to apply: <strong className="text-white">31 March 2026</strong>
                    </p>
                </div>
            </section>

            {/* Job Listings */}
            <section className="py-20">
                <div className="container px-4 md:px-6 mx-auto max-w-5xl">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Current Openings</h2>
                        <p className="mt-2 text-muted-foreground text-lg">All positions are based in Delhi. Hybrid options available for digital roles.</p>
                    </div>

                    <div className="space-y-6">
                        {jobs.map((job) => (
                            <Card
                                key={job.id}
                                className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-700 group"
                            >
                                <CardHeader className="pb-4">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                                                    {job.title}
                                                </h3>
                                                {job.badge && (
                                                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${job.badgeColor ? (badgeStyles[job.badgeColor] || "bg-slate-100 text-slate-700") : "bg-slate-100 text-slate-700"}`}>
                                                        {job.badge}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-muted-foreground text-sm mb-4">{job.shortDescription}</p>
                                            <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                                                <span className="flex items-center gap-1.5">
                                                    <GraduationCap className="w-4 h-4 text-indigo-500" />
                                                    {job.department}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin className="w-4 h-4 text-indigo-500" />
                                                    {job.location}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="w-4 h-4 text-indigo-500" />
                                                    {job.type}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="w-4 h-4 text-rose-500" />
                                                    Apply by {job.lastDate}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-start sm:items-end gap-3 shrink-0">
                                            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg px-3 py-1">
                                                {job.salaryRange}
                                            </span>
                                            <Link href={`/careers/${job.id}`}>
                                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm gap-2">
                                                    View & Apply
                                                    <ArrowRight className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="border-t border-slate-100 dark:border-slate-800 pt-4">
                                    <div className="flex flex-wrap gap-2">
                                        {job.skills.slice(0, 5).map((skill) => (
                                            <span key={skill} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-full font-medium">
                                                {skill}
                                            </span>
                                        ))}
                                        {job.skills.length > 5 && (
                                            <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-2.5 py-1 rounded-full font-medium">
                                                +{job.skills.length - 5} more
                                            </span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Join Us */}
            <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <div className="container px-4 md:px-6 mx-auto max-w-5xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">Why Work With Us?</h2>
                    <p className="text-muted-foreground text-lg mb-12">We are more than an institution. We are a community.</p>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: "🎓", title: "Mission-Driven", desc: "Work where your contribution directly impacts the lives of thousands of students." },
                            { icon: "🚀", title: "Growth-Focused", desc: "We invest in our team with skill-building programs, workshops, and annual increments." },
                            { icon: "💡", title: "Creative Culture", desc: "A team-first, open environment where your ideas are heard and executed." },
                        ].map((item) => (
                            <div key={item.title} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                                <div className="text-4xl mb-4">{item.icon}</div>
                                <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">{item.title}</h3>
                                <p className="text-muted-foreground text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-16 bg-indigo-600 dark:bg-indigo-900 text-white text-center">
                <div className="container px-4 mx-auto max-w-3xl">
                    <h2 className="text-3xl font-bold mb-4">Don&apos;t See a Perfect Fit?</h2>
                    <p className="text-indigo-100 mb-8 text-lg">Send your resume and we will keep you in mind for future opportunities.</p>
                    <a href="mailto:mk1139418@gmail.com?subject=General%20Application%20-%20RK%20Institution">
                        <Button size="lg" variant="secondary" className="h-12 px-8 text-indigo-900 font-semibold">
                            Send General Application <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </a>
                </div>
            </section>
        </div>
    );
}
