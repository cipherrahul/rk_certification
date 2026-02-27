"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BranchForm } from "@/components/admin/branches/BranchForm";
import { getBranchByIdAction } from "@/lib/actions/branch.action";

export default function EditBranchPage() {
    const params = useParams();
    const [branch, setBranch] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadBranch() {
            if (params.id) {
                const res = await getBranchByIdAction(params.id as string);
                if (res.success) {
                    setBranch(res.data);
                }
            }
            setLoading(false);
        }
        loadBranch();
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-brand" />
            </div>
        );
    }

    if (!branch) {
        return (
            <div className="p-6 text-center">
                <h1 className="text-2xl font-bold">Branch not found</h1>
                <Link href="/admin/branches">
                    <Button variant="link">Back to branches</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/branches">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Branch</h1>
                    <p className="text-muted-foreground">Update details for {branch.name}</p>
                </div>
            </div>

            <BranchForm initialData={branch} isEdit />
        </div>
    );
}
