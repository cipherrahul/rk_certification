"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, LayoutDashboard, FileBadge, Users, UserCog, LogOut, ChevronDown, FileText, Building, Briefcase, DollarSign, BookOpen, CalendarDays, Video, Library, ClipboardList, Target, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Branches", href: "/admin/branches", icon: Building },
    { name: "Academic", href: "/admin/academic", icon: BookOpen },
    { name: "Students", href: "/admin/students", icon: Users },
    { name: "Teachers", href: "/admin/teachers", icon: UserCog },
    { name: "Scheduling", href: "/admin/scheduling", icon: CalendarDays },
    { name: "Certifications", href: "/admin/certifications", icon: FileBadge },
    { name: "Offer Letters", href: "/admin/offer-letter", icon: FileText },
    { name: "Jobs", href: "/admin/jobs", icon: Briefcase },
    { name: "Expenses", href: "/admin/expenses", icon: DollarSign },
    { name: "Live Classes", href: "/admin/learning/live-classes", icon: Video },
    { name: "Materials", href: "/admin/learning/materials", icon: Library },
    { name: "Assignments", href: "/admin/learning/assignments", icon: ClipboardList },
    { name: "Online Tests", href: "/admin/learning/tests", icon: Target },
    { name: "Support Chat", href: "/admin/support", icon: MessageCircle },
];

interface AdminSidebarProps {
    isHovered: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

export function AdminSidebar({ isHovered, onMouseEnter, onMouseLeave }: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        // The outer container holds the structural space (w-16) to prevent layout shift.
        // The inner container animates and expands over the page content.
        <div className="hidden md:block w-16 h-full shrink-0 relative z-50">
            <aside
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                className={cn(
                    "absolute top-0 left-0 bg-background flex flex-col h-full border-r border-border/60 transition-[width] duration-300 ease-in-out z-50 overflow-hidden",
                    isHovered ? "w-64 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.5)]" : "w-16 shadow-none"
                )}
            >
                {/* Organization Selector Mockup */}
                <div className="h-14 flex items-center px-4 border-b border-border/60 hover:bg-accent/50 cursor-pointer transition-colors duration-200 shrink-0">
                    <div className="flex items-center gap-3 w-64">
                        <div className="w-7 h-7 shrink-0 rounded bg-brand flex items-center justify-center text-brand-foreground shadow-sm">
                            <GraduationCap className="w-4 h-4" />
                        </div>
                        <div className={cn(
                            "flex items-center justify-between flex-1 pr-8 transition-opacity duration-300",
                            isHovered ? "opacity-100" : "opacity-0"
                        )}>
                            <span className="font-medium text-sm tracking-tight truncate whitespace-nowrap">RK Institution</span>
                            <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" />
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
                    <div className={cn(
                        "w-64 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-2 px-5 transition-opacity duration-300",
                        isHovered ? "opacity-100" : "opacity-0"
                    )}>
                        Management
                    </div>
                    <div className="px-2 space-y-1 w-[240px]">
                        {navItems.map((item) => {
                            const isActive = pathname?.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 group relative",
                                        isActive
                                            ? "bg-brand/10 text-brand"
                                            : "text-muted-foreground hover:bg-accent/80 hover:text-foreground"
                                    )}
                                    title={!isHovered ? item.name : undefined}
                                >
                                    {isActive && (
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand rounded-r-md" />
                                    )}
                                    <item.icon className={cn("w-4 h-4 shrink-0 transition-colors", isActive ? "text-brand" : "text-muted-foreground group-hover:text-foreground")} />

                                    <span className={cn(
                                        "whitespace-nowrap transition-opacity duration-300",
                                        isHovered ? "opacity-100" : "opacity-0"
                                    )}>
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-2 border-t border-border/60 bg-background/50 shrink-0">
                    <form action="/auth/signout" method="post" className="w-[240px]">
                        <button
                            type="submit"
                            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200 w-full"
                            title={!isHovered ? "Sign Out" : undefined}
                        >
                            <LogOut className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
                            <span className={cn(
                                "whitespace-nowrap transition-opacity duration-300",
                                isHovered ? "opacity-100" : "opacity-0"
                            )}>
                                Sign Out
                            </span>
                        </button>
                    </form>
                </div>
            </aside>
        </div>
    );
}
