"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BranchForm } from "@/components/admin/branches/BranchForm";

export default function NewBranchPage() {
    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/branches">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create Branch</h1>
                    <p className="text-muted-foreground">Register a new institution branch</p>
                </div>
            </div>

            <BranchForm />
        </div>
    );
}
