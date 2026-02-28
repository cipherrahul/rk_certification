"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GraduationCap, Menu, X } from 'lucide-react';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/results', label: 'Student Results' },
    { href: '/timetable', label: 'My Timetable' },
    { href: '/careers', label: 'Careers' },
    { href: '/verify', label: 'Verify Certificate' },
    { href: '/verify-receipt', label: 'Verify Fee Receipt' },
    { href: '/contact', label: 'Contact Us' },
];

export default function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    if (pathname?.startsWith('/admin')) return null;

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <GraduationCap className="h-8 w-8 text-primary" />
                            <span className="text-xl font-bold tracking-tight">RK Institution</span>
                        </Link>
                    </div>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex gap-6 items-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors ${pathname === link.href
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:text-primary'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link href="/admin/login">
                            <Button variant="outline" size="sm">Admin Login</Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setMobileOpen((prev) => !prev)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {mobileOpen && (
                <div className="md:hidden border-t border-border/60 bg-background/98 backdrop-blur px-4 pb-5 pt-3 space-y-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className={`block py-2.5 px-3 rounded-md text-sm font-medium transition-colors ${pathname === link.href
                                ? 'bg-primary/10 text-primary'
                                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="pt-3 border-t border-border/60">
                        <Link href="/admin/login" onClick={() => setMobileOpen(false)}>
                            <Button variant="outline" size="sm" className="w-full">Admin Login</Button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
