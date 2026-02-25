"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Building, MapPin, Phone, Mail, Calendar, MoreVertical, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getBranchesAction } from "@/lib/actions/branch.action";
import { formatDate } from "@/lib/utils";

export default function BranchesPage() {
    const [branches, setBranches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function loadBranches() {
            const res = await getBranchesAction();
            if (res.success) {
                setBranches(res.data);
            }
            setLoading(false);
        }
        loadBranches();
    }, []);

    const filteredBranches = branches.filter(b =>
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.code.toLowerCase().includes(search.toLowerCase()) ||
        b.city.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Branches</h1>
                    <p className="text-muted-foreground">Manage and monitor all institution branches</p>
                </div>
                <Link href="/admin/branches/new">
                    <Button className="bg-brand hover:bg-brand/90 text-white gap-2">
                        <Plus className="w-4 h-4" />
                        Create Branch
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-2 max-w-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search branches..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 rounded-xl bg-accent/20 animate-pulse" />
                    ))}
                </div>
            ) : filteredBranches.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl bg-accent/5 transition-colors border-border/60">
                    <Building className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg font-medium">No branches found</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto">
                        {search ? "Try adjusting your search terms" : "Get started by creating your first institution branch"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBranches.map((branch) => (
                        <Card key={branch.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-border/60">
                            <CardHeader className="bg-accent/30 pb-4">
                                <div className="flex items-start justify-between">
                                    <div className="p-2 rounded-lg bg-white shadow-sm ring-1 ring-border/20">
                                        <Building className="w-6 h-6 text-brand" />
                                    </div>
                                    <Badge variant={branch.status === 'Active' ? 'default' : 'secondary'} className={branch.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : ''}>
                                        {branch.status}
                                    </Badge>
                                </div>
                                <CardTitle className="mt-4">{branch.name}</CardTitle>
                                <CardDescription className="font-mono text-xs uppercase tracking-wider">{branch.code}</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 shrink-0" />
                                        <span className="truncate">{branch.address}, {branch.city}, {branch.state}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 shrink-0" />
                                        <span>{branch.contact_number}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 shrink-0" />
                                        <span className="truncate">{branch.email}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>Est. {formatDate(branch.opening_date)}</span>
                                    </div>
                                    <Link href={`/admin/branches/${branch.id}`}>
                                        <Button variant="ghost" size="sm" className="text-brand hover:text-brand hover:bg-brand/5 text-xs font-semibold">
                                            View Details
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
