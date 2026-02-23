import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock, Calendar, DollarSign, BadgeCheck, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { jobs } from "@/lib/data/jobs";
import ApplicationForm from "@/components/careers/ApplicationForm";

export async function generateStaticParams() {
    return jobs.map((job) => ({ slug: job.id }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const job = jobs.find((j) => j.id === params.slug);
    if (!job) return { title: "Job Not Found" };
    return {
        title: `${job.title} | Careers | RK Institution`,
        description: job.shortDescription,
    };
}

const badgeBgStyles: Record<string, string> = {
    red: "bg-red-100 text-red-700 border border-red-200",
    blue: "bg-blue-100 text-blue-700 border border-blue-200",
    pink: "bg-pink-100 text-pink-700 border border-pink-200",
};

export default function JobDetailPage({ params }: { params: { slug: string } }) {
    const job = jobs.find((j) => j.id === params.slug);
    if (!job) notFound();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Top Banner */}
            <div className="bg-indigo-600 dark:bg-indigo-900 text-white py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5))]" />
                <div className="container px-4 md:px-6 mx-auto max-w-5xl relative z-10">
                    <Link href="/careers">
                        <Button variant="ghost" className="text-indigo-200 hover:text-white hover:bg-white/10 mb-6 -ml-2 gap-1">
                            <ArrowLeft className="w-4 h-4" /> Back to All Jobs
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className="text-xs font-semibold bg-white/20 border border-white/30 px-2.5 py-1 rounded-full">{job.department}</span>
                        {job.badge && (
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${job.badgeColor ? (badgeBgStyles[job.badgeColor] ?? "") : ""}`}>
                                {job.badge}
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">{job.title}</h1>
                    <div className="flex flex-wrap gap-5 text-indigo-100 text-sm">
                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{job.location}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{job.type}</span>
                        <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" />{job.salaryRange}</span>
                        <span className="flex items-center gap-1.5 text-rose-200 font-semibold">
                            <Calendar className="w-4 h-4" />Apply by {job.lastDate}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container px-4 md:px-6 mx-auto max-w-5xl py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left: Job Description */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About the Role */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                                <Briefcase className="w-5 h-5 text-indigo-500" /> About the Role
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">{job.aboutRole}</p>
                        </div>

                        {/* Responsibilities */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-3">
                                <BadgeCheck className="w-5 h-5 text-indigo-500" /> Key Responsibilities
                            </h2>
                            <ul className="space-y-3">
                                {job.responsibilities.map((r, i) => (
                                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                        <span className="mt-1.5 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                                        <span>{r}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Qualifications */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-3">
                                <BadgeCheck className="w-5 h-5 text-emerald-500" /> Qualifications Required
                            </h2>
                            <ul className="space-y-3">
                                {job.qualifications.map((q, i) => (
                                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                        <span className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                                        <span>{q}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Skills */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Skills & Tools</h2>
                            <div className="flex flex-wrap gap-2.5">
                                {job.skills.map((s) => (
                                    <span key={s} className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 text-sm px-3 py-1.5 rounded-full font-medium">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Perks */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Perks & Benefits</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {job.perks.map((p) => (
                                    <div key={p} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                                        <BadgeCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                        {p}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Application Form */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Apply for this Role</h2>
                            <p className="text-muted-foreground text-sm mb-6">
                                Fill in the form below. Resume must be <strong>PDF or DOC</strong> and under <strong>50KB</strong>.
                            </p>
                            <ApplicationForm job={job} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
