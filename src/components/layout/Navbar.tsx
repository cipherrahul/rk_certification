"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();
    if (pathname?.startsWith('/admin')) return null;

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <GraduationCap className="h-8 w-8 text-primary" />
                            <span className="text-xl font-bold tracking-tight">RK Institution</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex gap-6 items-center">
                        <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            Home
                        </Link>
                        <Link href="/verify" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            Verify Certificate
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/admin/login">
                            <Button variant="outline" size="sm">Admin Login</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
