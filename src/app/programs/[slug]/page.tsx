import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROGRAMS } from "@/data/programs";
import ProgramDetailClient from "@/components/programs/ProgramDetailClient";

export async function generateStaticParams() {
    return PROGRAMS.map((program) => ({
        slug: program.slug,
    }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const program = PROGRAMS.find((p) => p.slug === params.slug);

    if (!program) {
        return {
            title: "Program Not Found",
        };
    }

    return {
        title: `${program.title} | RK Institution`,
        description: program.description,
        openGraph: {
            title: `${program.title} - Professional Certification @ RK Institution`,
            description: (program.detailedDescription || program.description).substring(0, 160),
            type: "article",
        },
    };
}

export default function ProgramDetailPage({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const program = PROGRAMS.find((p) => p.slug === slug);

    if (!program) {
        notFound();
    }

    // Schema Markup for SEO
    const courseSchema = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": program.title,
        "description": program.description,
        "provider": {
            "@type": "Organization",
            "name": "RK Institution",
            "sameAs": "https://rkinstitution.in"
        }
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": program.faq.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <ProgramDetailClient program={program} />
        </>
    );
}
