"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Award,
  ShieldCheck,
  Zap,
  BookOpen,
  Receipt,
  Users,
  Building2,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Star,
  Globe
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { StudentProfileCarousel } from '@/components/home/StudentProfileCarousel';
import { useRef } from 'react';

const stats = [
  { label: "Total Students", value: "5,000+", icon: Users, color: "text-blue-600" },
  { label: "Branch Network", value: "5+", icon: Building2, color: "text-purple-600" },
  { label: "Success Rate", value: "98%", icon: TrendingUp, color: "text-emerald-600" },
  { label: "Career Placements", value: "2,000+", icon: Award, color: "text-amber-600" },
];

const programs = [
  { slug: "jee-ultimate", title: "JEE Preparation", students: "2.1k+", icon: Star, highlight: "Top Results" },
  { slug: "neet-medical", title: "NEET Foundation", students: "3.2k+", icon: CheckCircle2, highlight: "PCB Focus" },
  { slug: "primary-foundation", title: "Primary Foundation", students: "1.2k+", icon: Globe, highlight: "Most Popular" },
  { slug: "secondary-excellence", title: "Secondary Excellence", students: "0.8k+", icon: TrendingUp, highlight: "Trending" },
  { slug: "cuet-success", title: "CUET Success", students: "1.5k+", icon: Zap, highlight: "Career Ready" },
  { slug: "full-stack-web", title: "Full Stack Development", students: "2.5k+", icon: Globe, highlight: "Tech Fast-Track" },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/20" ref={containerRef}>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950 px-4">
        {/* Dynamic Animated Gradient Background */}
        <motion.div
          className="absolute inset-0 z-0 opacity-40"
          style={{ y: backgroundY }}
        >
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/30 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/30 blur-[120px] animate-pulse delay-700" />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-emerald-600/20 blur-[100px] animate-pulse delay-1000" />
        </motion.div>

        {/* Mesh Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(white,transparent_85%)]" />

        <div className="container relative z-10 mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-4 py-1.5 text-sm font-medium text-blue-200 mb-8 hover:bg-white/10 transition-colors">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-ping" />
              Trusted by 5,000+ Students Across India
            </div>
          </motion.div>

          <motion.h1
            style={{ y: textY }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-8xl font-black tracking-tight text-white mb-8 leading-[1.1]"
          >
            Build Real <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Skills.</span><br />
            Shape Your <span className="italic font-serif">Future.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light"
          >
            RK Institution provides industry-leading professional education designed to bridge the gap
            between academic learning and real-world career success.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link href="/programs">
              <Button size="lg" className="h-14 px-10 text-lg font-semibold rounded-full bg-blue-600 hover:bg-blue-700 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:scale-105 group">
                Explore Programs
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="h-14 px-10 text-lg font-medium border border-white/20 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm rounded-full transition-all hover:scale-105">
                Book Free Counseling
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30"
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className={`p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <h3 className="text-3xl md:text-4xl font-black mb-2 text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
                <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Offered Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 relative">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold text-blue-600 uppercase tracking-[0.2em] mb-4">Our Curriculum</h2>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                Programs Designed for <span className="text-blue-600">Impact.</span>
              </h3>
            </div>
            <Link href="/programs">
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700 font-bold group">
                View All Programs
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={`/programs/${program.slug}`}>
                  <Card className="glass h-full border-white/5 hover:border-blue-500/50 hover:bg-white/10 hover:-translate-y-2 transition-all duration-300 group cursor-pointer overflow-hidden p-0.5">
                    <CardHeader className="relative p-6 pb-2">
                      <div className="absolute top-4 right-4 px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[9px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                        {program.highlight}
                      </div>
                      <div className="mb-4 p-3 rounded-2xl bg-white dark:bg-slate-800 w-fit shadow-sm group-hover:shadow-blue-500/20 group-hover:shadow-xl transition-all duration-500">
                        <program.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">{program.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                        <Users className="h-4 w-4" />
                        {program.students} Students Enrolled
                      </div>
                      <div className="mt-6 flex items-center text-blue-600 text-sm font-bold opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all">
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-[0.2em] mb-4">The RK Advantage</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Why Knowledge Seekers <span className="text-blue-600">Choose Us?</span></h3>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              {
                title: "Flexible Learning",
                desc: "Adapt your study schedule to your lifestyle with our blend of live and recorded sessions.",
                icon: Zap
              },
              {
                title: "Expert Mentorship",
                desc: "Learn directly from industry veterans who have walked the path you're embarking on.",
                icon: Users
              },
              {
                title: "Proven Outcomes",
                desc: "Our graduates are working at top tech firms, from innovative startups to Fortune 500s.",
                icon: TrendingUp
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 hover:bg-blue-600 hover:text-white transition-all duration-500 group"
              >
                <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-slate-800 w-fit text-blue-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h4 className="text-2xl font-bold mb-4">{feature.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed group-hover:text-blue-50/80 transition-colors">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories (Testimonials) Section */}
      <section className="py-24 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-600 rounded-full blur-[150px]" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600 rounded-full blur-[150px]" />
        </div>

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-4">Wall of Success</h2>
            <h3 className="text-4xl md:text-5xl font-black mb-6">Student & Parent <span className="italic">Stories</span></h3>
          </div>

          <StudentProfileCarousel />

          <div className="mt-20 grid md:grid-cols-3 gap-8">
            {[
              {
                text: "The mentorship at RK Institution is unparalleled. I went from knowing basic HTML to building full-scale SaaS applications in just 6 months.",
                author: "Ananya Sharma",
                role: "Full Stack Dev @ TechFlow India",
                image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=200&auto=format&fit=crop"
              },
              {
                text: "As a parent, I was worried about my son's career path. RK's career counseling and structured programs gave him the clarity and skills he needed.",
                author: "Rajesh Malhotra",
                role: "Parent & Business Owner",
                image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&auto=format&fit=crop"
              },
              {
                text: "The hands-on projects and the community support are what set this place apart. It's not just a course; it's a career transformation.",
                author: "Vikas Gupta",
                role: "Data Scientist @ DataNode",
                image: "https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?q=80&w=200&auto=format&fit=crop"
              }
            ].map((testi, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10"
              >
                <div className="flex gap-1 text-amber-400 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="text-lg text-slate-300 mb-8 italic leading-relaxed">&quot;{testi.text}&quot;</p>
                <div className="flex items-center gap-4">
                  <img src={testi.image} alt={testi.author} className="h-12 w-12 rounded-full object-cover border-2 border-blue-500" />
                  <div>
                    <h5 className="font-bold">{testi.author}</h5>
                    <p className="text-xs text-slate-500">{testi.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus & Branch Network Section */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-bold text-blue-600 uppercase tracking-[0.2em] mb-4">Our Presence</h2>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-8">A Network That <span className="text-blue-600">Connects India.</span></h3>
              <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                With 5+ state-of-the-art facilities across major Indian cities, RK Institution ensures that
                quality professional education is always within your reach. Our campuses are designed
                to foster collaboration and innovation.
              </p>
              <div className="space-y-4">
                {[
                  "Tech-enabled Smart Classrooms",
                  "24/7 Innovation Labs",
                  "Dedicated Career Centers",
                  "Active Alumni Network in India"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>
              <Button className="mt-10 rounded-full h-12 px-8">Find a Branch Near You</Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-video rounded-3xl bg-slate-200 overflow-hidden shadow-2xl">
                <img
                  src="/images/campus/real_classroom.jpg"
                  alt="RK Institution Classroom View"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 glass p-6 rounded-2xl hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-slate-300" />
                    ))}
                  </div>
                  <div className="text-sm font-bold">500+ Students learning in India</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Faculty Excellence Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">Expert Faculty</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Learn from India&apos;s <span className="text-blue-600">Best.</span></h3>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { name: "Rahul Choudhary", role: "Co-founder & Software Engineer", exp: "B.Tech Computer Science", img: "/images/faculty/rahul_mentor.png?v=2" },
              { name: "Manish Choudhary", role: "Founder & Mathematics Expert", exp: "M.Sc Mathematics", img: "/images/faculty/manish.jpg" },
              { name: "Pooja Singhania", role: "Digital Marketing Lead", exp: "MBA Marketing", img: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=200&auto=format&fit=crop" },
              { name: "Abhishek Verma", role: "Data Science Mentor", exp: "M.Tech AI/ML", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop" }
            ].map((mentor, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-3xl mb-4 aspect-[4/5] shadow-xl">
                  <img src={mentor.img} alt={mentor.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-4 left-4 right-4 translate-y-4 group-hover:translate-y-0 transition-transform opacity-0 group-hover:opacity-100">
                    <Button variant="secondary" size="sm" className="w-full rounded-xl">View Bio</Button>
                  </div>
                </div>
                <h5 className="text-xl font-bold">{mentor.name}</h5>
                <p className="text-blue-600 text-sm font-semibold">{mentor.role}</p>
                <p className="text-slate-500 text-xs font-medium">{mentor.exp}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Verification Portal (Modernized) */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-5xl mx-auto glass p-8 md:p-16 rounded-[3rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck className="h-48 w-48 text-blue-600" />
            </div>

            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-black mb-6">Security & <span className="text-blue-600">Verification.</span></h3>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  Every document issued by RK Institution is cryptographically secure and
                  instantly verifiable. Employers can trust our digital records.
                </p>
                <div className="flex flex-col gap-4">
                  <Link href="/verify">
                    <Button className="w-full md:w-fit h-14 px-8 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5" />
                      Verify Certificate
                    </Button>
                  </Link>
                  <Link href="/verify-receipt">
                    <Button variant="outline" className="w-full md:w-fit h-14 px-8 rounded-full flex items-center gap-3 border-2">
                      <Receipt className="h-5 w-5" />
                      Verify Fee Receipt
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
                <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <Globe className="h-10 w-10 text-blue-600 animate-slow-spin" />
                </div>
                <h4 className="font-bold text-lg mb-2">Global Credential Standard</h4>
                <p className="text-sm text-slate-500">ISO 9001:2015 Certified Educational Institution</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-[3rem] bg-blue-600 p-12 md:p-24 text-center overflow-hidden"
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-7xl font-black text-white mb-8 leading-tight">
                Ready to Shape Your <br />
                <span className="text-blue-200 underline decoration-blue-400 decoration-wavy underline-offset-8">Career Path?</span>
              </h2>
              <p className="text-xl text-blue-50/80 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                Join 5,000+ graduates who have transformed their lives through
                our industry-leading programs and mentorship.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/contact">
                  <Button size="lg" className="h-16 px-12 text-lg font-bold rounded-full bg-white text-blue-600 hover:bg-blue-50 shadow-2xl transition-all hover:scale-105">
                    Enroll Now
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button className="h-16 px-12 text-lg font-bold rounded-full border-2 border-white/30 bg-transparent text-white hover:bg-white/10 transition-all hover:scale-105 shadow-none hover:shadow-none">
                    Download Brochure
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
