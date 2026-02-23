import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, ShieldCheck, Zap, BookOpen, Receipt } from 'lucide-react';
import { StudentProfileCarousel } from '@/components/home/StudentProfileCarousel';

const categories = [
  "Internship Completion Certificate",
  "Industrial Training Certificate",
  "Digital Marketing Certification",
  "Data Science Certification",
  "Data Structures & Algorithms Certification",
  "Cloud Computing",
  "Android App Development",
  "Ethical Hacking",
  "Programming",
  "Financial Accounting",
  "Web Designing",
  "AI/ML",
  "Full Stack Development",
  "Best Student of the Year",
  "Faculty of the Year",
  "Employee Experience Certificate"
];

const features = [
  {
    title: "Instant Verification",
    description: "Verify certificates instantly using our secure unique ID system and QR codes.",
    icon: ShieldCheck,
  },
  {
    title: "Premium Quality",
    description: "Industry-standard certificates that stand out.",
    icon: Award,
  },
  {
    title: "Fast Generation",
    description: "Generate certificates instantly upon course completion.",
    icon: Zap,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" style={{ backgroundPosition: '10px 10px' }}></div>
        <div className="container px-4 md:px-6 relative z-10 mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-800 mb-8 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
            <Award className="mr-2 h-4 w-4" />
            Empowering Futures Since 2010
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
            RK Institution <span className="text-indigo-600 dark:text-indigo-400">Certifications</span>
          </h1>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Validate your skills and achievements with our industry-recognized certification platform.
            Secure, verifiable, and instantly accessible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/admin/certifications">
              <Button size="lg" className="h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all w-full sm:w-auto">
                Explore Certifications
              </Button>
            </Link>
            <Link href="/verify">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base bg-white dark:bg-slate-950 shadow-sm hover:shadow-md transition-all w-full sm:w-auto">
                <ShieldCheck className="mr-2 h-5 w-5" />
                Verify a Certificate
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container px-4 md:px-6 mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">About RK Institution</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                RK Institution has been at the forefront of technical and professional education,
                equipping students with the skills required to excel in the modern workforce.
                Our certifications are recognized globally and stand as a testament to rigorous
                training and excellence.
              </p>
              <ul className="space-y-3">
                {[
                  "Over 10,000+ students certified",
                  "Industry-aligned curriculum",
                  "Expert faculty and mentors",
                  "100% verifiable digital certificates"
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-muted-foreground">
                    <div className="mr-3 p-1 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-20 absolute -inset-4 blur-2xl"></div>
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2000&auto=format&fit=crop"
                alt="Students learning"
                className="rounded-2xl shadow-2xl relative z-10 object-cover aspect-video md:aspect-square"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Certification Categories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our wide range of professional certifications designed to boost your career.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/admin/certifications/${category.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}`}
                className="group"
              >
                <Card className="h-full border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 dark:border-slate-800 dark:hover:border-indigo-700 transition-all cursor-pointer bg-white/50 backdrop-blur-sm dark:bg-slate-950/50">
                  <CardHeader>
                    <div className="mb-4 p-3 rounded-lg bg-indigo-50 w-fit text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-100 transition-all">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{category}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Choose Our Certifications?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide state-of-the-art secure digital certificates that are easy to share and impossible to forge.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                <div className="p-4 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400 mb-6">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Profile Section */}
      <StudentProfileCarousel />

      {/* Fee & Certificate Verification Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container px-4 md:px-6 mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Verification Portal</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Instantly verify certificates and fee receipts using their unique ID numbers.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Certificate Verify Card */}
            <Card className="border-slate-200 shadow-sm hover:shadow-md dark:border-slate-800 transition-all bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-slate-950">
              <CardHeader>
                <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 w-fit mb-3">
                  <ShieldCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle>Certificate Verification</CardTitle>
                <CardDescription>
                  Verify the authenticity of an RK Institution certificate using its unique certificate ID.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/verify">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    Verify Certificate
                  </Button>
                </Link>
              </CardContent>
            </Card>
            {/* Fee Receipt Verify Card */}
            <Card className="border-slate-200 shadow-sm hover:shadow-md dark:border-slate-800 transition-all bg-gradient-to-br from-emerald-50 to-white dark:from-slate-900 dark:to-slate-950">
              <CardHeader>
                <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 w-fit mb-3">
                  <Receipt className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle>Fee Receipt Verification</CardTitle>
                <CardDescription>
                  Verify a fee payment receipt by entering the unique receipt number issued by RK Institution.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/verify-receipt">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    Verify Fee Receipt
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-indigo-600 dark:bg-indigo-900 text-white">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        <div className="container px-4 md:px-6 relative z-10 text-center mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-indigo-100 mb-10">
            Explore our certification programs or verify an existing certificate instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/verify">
              <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-medium shadow-xl hover:shadow-2xl transition-all text-indigo-900">
                Verify Certificate
              </Button>
            </Link>
            <Link href="/verify-receipt">
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-medium border-white text-white hover:bg-white/10 transition-all">
                Verify Receipt
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
