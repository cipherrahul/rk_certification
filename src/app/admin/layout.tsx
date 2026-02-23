import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin - RK Institution",
    description: "Admin section for RK Institution",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
