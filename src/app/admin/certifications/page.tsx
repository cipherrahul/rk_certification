import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

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

export default function CertificationsPage() {
    return (
        <div className="container px-4 md:px-6 py-12 mx-auto max-w-7xl">
            <div className="mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight mb-4">Certification Categories</h1>
                <p className="text-xl text-muted-foreground">
                    Select a category to generate a new certificate.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map((category) => (
                    <Link
                        key={category}
                        href={`/admin/certifications/${category.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}`}
                        className="group"
                    >
                        <Card className="h-full border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 dark:border-slate-800 dark:hover:border-indigo-700 transition-all cursor-pointer bg-white dark:bg-slate-950">
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
    );
}
