import { MetadataRoute } from 'next';
import { PROGRAMS } from '@/data/programs';
import { getJobs } from '@/lib/actions/jobs';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://rkinstitution.in';

    // Core pages
    const routes = [
        '',
        '/programs',
        '/careers',
        '/contact',
        '/about',
        '/privacy',
        '/terms',
        '/results',
        '/verify',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : route.includes('/programs') ? 0.9 : 0.8,
    }));

    // Dynamic Program pages
    const programUrls = PROGRAMS.map((program) => ({
        url: `${baseUrl}/programs/${program.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // Dynamic Career pages
    const jobs = await getJobs(true).catch(() => []);
    const jobUrls = jobs.map((job) => ({
        url: `${baseUrl}/careers/${job.id}`,
        lastModified: new Date(job.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [...routes, ...programUrls, ...jobUrls];
}
