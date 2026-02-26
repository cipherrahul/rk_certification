import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Tag, List } from "lucide-react";

export default function ExpensesLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-full">
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center gap-4 px-4 md:px-6">
                    <div className="flex items-center gap-1 md:gap-2 overflow-x-auto no-scrollbar scroll-smooth">
                        <Link href="/admin/expenses">
                            <Button variant="ghost" size="sm" className="gap-2 h-9">
                                <LayoutDashboard className="w-4 h-4" /> Dashboard
                            </Button>
                        </Link>
                        <Link href="/admin/expenses/categories">
                            <Button variant="ghost" size="sm" className="gap-2 h-9">
                                <Tag className="w-4 h-4" /> Categories
                            </Button>
                        </Link>
                        <Link href="/admin/expenses/list">
                            <Button variant="ghost" size="sm" className="gap-2 h-9">
                                <List className="w-4 h-4" /> Expense List
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-auto">
                {children}
            </div>
        </div>
    );
}
