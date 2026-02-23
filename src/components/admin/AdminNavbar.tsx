"use client";

import { Bell, Menu, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminNavbar() {
    return (
        <header className="h-16 border-b bg-white dark:bg-slate-950 flex items-center px-4 md:px-8 justify-between sticky top-0 z-40">
            {/* Mobile menu (placeholder for future implementation) */}
            <div className="md:hidden">
                <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                </Button>
            </div>

            {/* Empty space on desktop for alignment */}
            <div className="hidden md:block">
            </div>

            {/* Right side Profile items */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-slate-500 relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
                </Button>

                <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-sm font-bold">Admin User</span>
                        <span className="text-xs text-muted-foreground">Administrator</span>
                    </div>
                    <UserCircle className="w-9 h-9 text-indigo-100 bg-indigo-600 rounded-full" />
                </div>
            </div>
        </header>
    );
}
