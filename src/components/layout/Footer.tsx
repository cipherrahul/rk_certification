"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap } from 'lucide-react';

export default function Footer() {
    const pathname = usePathname();
    if (pathname?.startsWith('/admin')) return null;

    return (
        <footer className="border-t bg-muted/50">
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center sm:flex-row flex-col gap-6">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-6 w-6 text-primary" />
                        <span className="text-lg font-bold tracking-tight">RK Institution</span>
                        <span className="text-sm text-muted-foreground ml-2">
                            © {new Date().getFullYear()} All rights reserved.
                        </span>
                    </div>
                    <div className="flex gap-6">
                        <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Home
                        </Link>
                        <Link href="/verify" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Verify Certificate
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
