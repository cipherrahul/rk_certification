"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell, Menu, Slash, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminNavbar() {
    const pathname = usePathname();
    const segments = pathname?.split('/').filter(Boolean) || [];

    return (
        <header className="h-14 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center px-4 md:px-6 justify-between sticky top-0 z-40 transition-colors duration-200">
            {/* Left side: Mobile menu & Breadcrumbs */}
            <div className="flex items-center gap-2">
                <div className="md:hidden">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground mr-2 shrink-0">
                        <Menu className="w-4 h-4" />
                    </Button>
                </div>

                {/* Breadcrumbs inspired by Supabase */}
                <nav className="hidden sm:flex items-center text-sm font-medium text-muted-foreground">
                    <Link href="/admin/dashboard" className="hover:text-foreground transition-colors">
                        RK Institution
                    </Link>
                    {segments.length > 1 && (
                        <>
                            <Slash className="w-4 h-4 mx-1 text-muted-foreground/50 transform -rotate-12 shrink-0" />
                            <span className="text-foreground capitalize">
                                {segments[1].replace('-', ' ')}
                            </span>
                        </>
                    )}
                </nav>
            </div>

            {/* Right side Profile & Actions */}
            <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center justify-center pl-3 ml-1 border-l border-border/60 h-8">
                    <button className="flex items-center justify-center w-7 h-7 shrink-0 rounded-full bg-brand/20 text-brand text-xs font-bold ring-1 ring-border/50 hover:ring-brand/50 transition-all duration-300">
                        AD
                    </button>
                </div>
            </div>
        </header>
    );
}

