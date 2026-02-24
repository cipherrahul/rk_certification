"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminNavbar } from "@/components/admin/AdminNavbar";

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);

    // Do not apply layout to the login page
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    return (
        <div className="dark">
            <div className="flex h-screen overflow-hidden bg-background text-foreground selection:bg-brand/30 transition-colors duration-300">
                <AdminSidebar
                    isHovered={isSidebarHovered}
                    onMouseEnter={() => setIsSidebarHovered(true)}
                    onMouseLeave={() => setIsSidebarHovered(false)}
                />
                <div className="flex-1 flex flex-col h-screen overflow-hidden relative transition-all duration-300">
                    <AdminNavbar />
                    <main className="flex-1 overflow-auto bg-background/95">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
