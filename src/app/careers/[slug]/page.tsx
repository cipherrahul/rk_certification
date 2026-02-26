import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock, Calendar, DollarSign, BadgeCheck, Briefcase, Share2, Info, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ApplicationForm from "@/components/careers/ApplicationForm";
import { getJobById } from "@/lib/actions/jobs";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const job = await getJobById(params.slug).catch(() => null);
    if (!job) return { title: "Job Not Found" };

    return {
        title: `${job.title} | Careers | RK Institution`,
        description: `${job.title} position in ${job.location} at RK Institution. ${job.description.substring(0, 120)}...`,
        openGraph: {
            title: `${job.title} - Join RK Institution`,
            description: `We are hiring a ${job.title} in ${job.location}. Join our mission to empower minds.`,
            type: "article",
        }
    };
}

export default async function JobDetailPage({ params }: { params: { slug: string } }) {
    const job = await getJobById(params.slug).catch(() => null);
    if (!job) notFound();

    const jobSchema = {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        "title": job.title,
        "description": job.description,
        "datePosted": job.created_at,
        "employmentType": job.employment_type,
        "hiringOrganization": {
            "@type": "Organization",
            "name": "RK Institution",
            "sameAs": "https://rkinstitution.in"
        },
        "jobLocation": {
            "@type": "Place",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": job.location,
                "addressRegion": "Rajasthan",
                "addressCountry": "IN"
            }
        },
        "baseSalary": {
            "@type": "MonetaryAmount",
            "currency": "INR",
            "value": {
                "@type": "QuantitativeValue",
                "value": job.salary_range,
                "unitText": "MONTH"
            }
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }}
            />
            <div className="min-h-screen bg-[#fafafa] dark:bg-slate-950 selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
                {/* Elegant Header Section */}
                <div className="bg-[#0a0a0b] text-white py-20 relative overflow-hidden">
                    <div className="absolute inset-0 z-0 opacity-10">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[120px]" />
                    </div>

                    <div className="container relative z-10 px-4 md:px-6 mx-auto max-w-6xl">
                        <Link href="/careers">
                            <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 mb-6 -ml-3 gap-2 rounded-xl text-xs h-9">
                                <ArrowLeft className="w-3.5 h-3.5" /> Back to Careers
                            </Button>
                        </Link>

                        <div className="grid lg:grid-cols-3 gap-8 items-end">
                            <div className="lg:col-span-2 space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] uppercase tracking-widest font-black">
                                        {job.department}
                                    </span>
                                    <span className="text-slate-500 text-xs font-medium">Published {new Date(job.created_at).toLocaleDateString()}</span>
                                </div>

                                <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                                    {job.title}
                                </h1>

                                <div className="flex flex-wrap gap-x-6 gap-y-3 pt-1">
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                                            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Location</span>
                                            <span className="text-xs font-semibold">{job.location}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                                            <Clock className="w-3.5 h-3.5 text-purple-400" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Type</span>
                                            <span className="text-xs font-semibold">{job.employment_type}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                                            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Salary Range</span>
                                            <span className="text-xs font-semibold">{job.salary_range}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden lg:flex justify-end pr-2">
                                <Button variant="ghost" className="rounded-xl border-white/10 hover:bg-white/5 text-white gap-2 h-10 px-5 text-sm">
                                    <Share2 className="w-4 h-4" /> Share Role
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="container px-4 md:px-6 mx-auto max-w-6xl py-12">
                    <div className="grid lg:grid-cols-12 gap-10">
                        {/* Left Side: Job Content */}
                        <div className="lg:col-span-8 space-y-10">
                            {/* Summary Section */}
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                                        <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">The Opportunity</h2>
                                </div>
                                <div className="text-slate-600 dark:text-slate-400 leading-relaxed text-base whitespace-pre-wrap">
                                    {job.description}
                                </div>
                            </div>

                            {/* Requirements Grid */}
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-12 -mt-12" />
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                                        <BadgeCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Who we&apos;re looking for</h2>
                                </div>
                                <div className="text-slate-600 dark:text-slate-400 leading-relaxed text-base whitespace-pre-wrap">
                                    {job.requirements}
                                </div>
                            </div>

                            {/* Extra Details */}
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/50">
                                    <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-3" />
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-1.5 text-sm">Experience</h4>
                                    <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                        Targeting candidates with <strong>{job.experience_required}</strong> of validated excellence.
                                    </p>
                                </div>
                                <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/50">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-3" />
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-1.5 text-sm">Inclusivity</h4>
                                    <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                        RK Institution is an equal opportunity employer. We value diverse perspectives.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Apply Sidebar */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-24">
                                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border-2 border-slate-100 dark:border-slate-800 shadow-xl shadow-indigo-500/5 relative overflow-hidden">
                                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />

                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Apply Now</h2>
                                    <p className="text-slate-500 text-xs mb-6 leading-relaxed">
                                        Join our team and start your journey today.
                                    </p>

                                    <ApplicationForm job={job} />

                                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-widest font-black">
                                        <span>RK INSTITUTION</span>
                                        <span>SECURED</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Support section */}
                <section className="py-20 border-t border-slate-100 dark:border-slate-800">
                    <div className="container px-4 mx-auto max-w-4xl text-center">
                        <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
                            <Briefcase className="w-4 h-4" /> Having trouble with the application? Contact our HR team at <strong>info.rkinstitution2016@gmail.com</strong>
                        </p>
                    </div>
                </section>
            </div>
        </>
    );
}
