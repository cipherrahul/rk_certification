import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GraduationCap, Target, Eye, UserCheck, BookOpen } from "lucide-react";

const facultyMembers = [
    { name: "Aman Kumar", subject: "Accounts" },
    { name: "Manish Kumar", subject: "Mathematics" },
    { name: "Radhika Kumari", subject: "Classes 1st to 8th" },
    { name: "Suraj Singh", subject: "Physics & Chemistry" },
    { name: "Rahul Choudhary", subject: "Mathematics" },
    { name: "Kapil Saini", subject: "Computer" },
];

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Hero Section */}
            <section className="relative py-20 bg-indigo-600 dark:bg-indigo-900 border-b border-indigo-700">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
                <div className="container relative z-10 px-4 md:px-6 mx-auto max-w-5xl text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
                        About RK Institution
                    </h1>
                    <p className="text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
                        Empowering students since 2016 with quality education, rigorous training, and professional excellence.
                    </p>
                </div>
            </section>

            {/* Institution Details */}
            <section className="py-20 bg-white dark:bg-slate-950">
                <div className="container px-4 md:px-6 mx-auto max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-800 mb-6 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                                <GraduationCap className="mr-2 h-4 w-4" />
                                Established in 2016
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight mb-4">Our Legacy of Excellence</h2>
                            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                                Founded by <strong>Raghav Kumar (M.Sc Mathematics)</strong>, RK Institution has been a beacon of learning and academic brilliance.
                                We are dedicated to nurturing talent, building strong academic foundations, and preparing our students for a competitive, technology-driven future.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Our modern campus and expert faculty provide an environment that encourages curiosity, innovation, and practical skill development.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-20 absolute -inset-4 blur-2xl"></div>
                            <img
                                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2000&auto=format&fit=crop"
                                alt="RK Institution Campus"
                                className="rounded-2xl shadow-2xl relative z-10 object-cover aspect-[4/3]"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
                <div className="container px-4 md:px-6 mx-auto max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Mission */}
                        <Card className="border-slate-200 shadow-sm dark:border-slate-800 bg-white/50 backdrop-blur-sm dark:bg-slate-950/50">
                            <CardHeader>
                                <div className="mb-4 p-3 rounded-lg bg-indigo-50 w-fit text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
                                    <Target className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-2xl">Our Mission</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    To provide top-tier quality education, build unshakeable academic foundations, and promote intensive skill-based learning that empowers our students to succeed in real-world challenges.
                                </p>
                            </CardContent>
                        </Card>
                        {/* Vision */}
                        <Card className="border-slate-200 shadow-sm dark:border-slate-800 bg-white/50 backdrop-blur-sm dark:bg-slate-950/50">
                            <CardHeader>
                                <div className="mb-4 p-3 rounded-lg bg-emerald-50 w-fit text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                                    <Eye className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-2xl">Our Vision</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    To become a leading, highly reputed educational institute known for integrating advanced technology-driven learning and expanding our positive impact across multiple regions.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Faculty Section */}
            <section className="py-24 bg-white dark:bg-slate-950 overflow-hidden relative">
                <div className="container px-4 md:px-6 mx-auto relative z-10 mb-12">
                    <div className="text-center">
                        <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-800 mb-6 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                            <UserCheck className="mr-2 h-4 w-4" />
                            Expert Mentors
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight mb-4">Meet Our Faculty</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Learn from highly experienced professionals dedicated to your success.
                        </p>
                    </div>
                </div>

                {/* Left & Right Gradient Fades for Marquee */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />

                <div className="relative flex overflow-x-hidden group pb-8">
                    <div className="flex animate-marquee whitespace-nowrap gap-6 group-hover:[animation-play-state:paused] min-w-max px-3">
                        {facultyMembers.map((faculty) => (
                            <div key={faculty.name} className="w-80 inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl">
                                <Card className="h-full border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-400 dark:border-slate-800 dark:hover:border-indigo-600 transition-all duration-300 bg-slate-50 dark:bg-slate-900 hover:-translate-y-2 group/card">
                                    <CardHeader className="text-center pb-4">
                                        <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 dark:bg-indigo-900/50 dark:text-indigo-300 group-hover/card:scale-110 transition-transform duration-300 shadow-inner border border-indigo-200 dark:border-indigo-800">
                                            <span className="text-2xl font-black">{faculty.name.charAt(0)}</span>
                                        </div>
                                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white mb-2">{faculty.name}</CardTitle>
                                        <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300">
                                            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                                            {faculty.subject}
                                        </div>
                                    </CardHeader>
                                </Card>
                            </div>
                        ))}
                    </div>

                    <div className="flex animate-marquee whitespace-nowrap gap-6 group-hover:[animation-play-state:paused] min-w-max px-3" aria-hidden="true">
                        {facultyMembers.map((faculty) => (
                            <div key={`dup-${faculty.name}`} className="w-80 inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl" tabIndex={-1}>
                                <Card className="h-full border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-400 dark:border-slate-800 dark:hover:border-indigo-600 transition-all duration-300 bg-slate-50 dark:bg-slate-900 hover:-translate-y-2 group/card">
                                    <CardHeader className="text-center pb-4">
                                        <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 dark:bg-indigo-900/50 dark:text-indigo-300 group-hover/card:scale-110 transition-transform duration-300 shadow-inner border border-indigo-200 dark:border-indigo-800">
                                            <span className="text-2xl font-black">{faculty.name.charAt(0)}</span>
                                        </div>
                                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white mb-2">{faculty.name}</CardTitle>
                                        <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300">
                                            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                                            {faculty.subject}
                                        </div>
                                    </CardHeader>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
