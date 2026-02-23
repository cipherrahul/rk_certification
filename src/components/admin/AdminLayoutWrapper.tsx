"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminNavbar } from "@/components/admin/AdminNavbar";

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Do not apply layout to the login page
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950/50">
            <AdminSidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <AdminNavbar />
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
