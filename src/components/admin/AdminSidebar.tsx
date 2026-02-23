"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, LayoutDashboard, FileBadge, Users, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Students", href: "/admin/students", icon: Users },
    { name: "Certifications", href: "/admin/certifications", icon: FileBadge },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col h-full border-r border-slate-800">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800/50">
                <Link href="/admin/dashboard" className="flex items-center gap-2 text-white">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">RK Admin</span>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname?.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-indigo-600/10 text-indigo-400"
                                    : "hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-indigo-400" : "text-slate-400")} />
                            {item.name}
                        </Link>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800/50">
                <form action="/auth/signout" method="post">
                    <button
                        type="submit"
                        className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800 hover:text-red-400 transition-colors"
                    >
                        <LogOut className="w-5 h-5 text-slate-400" />
                        Sign Out
                    </button>
                </form>
            </div>
        </aside>
    );
}
