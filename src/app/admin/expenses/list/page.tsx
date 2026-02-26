"use client";

import { useEffect, useState } from "react";
import { getExpensesAction, getExpenseCategoriesAction } from "@/lib/actions/expense.action";
import { getBranchesAction } from "@/lib/actions/branch.action";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Loader2, DollarSign, Calendar as CalendarImg, Building2, Tag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExpenseForm } from "@/components/admin/expenses/ExpenseForm";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function ExpenseListingPage() {
    const [expenses, setExpenses] = useState<any[]>([]);
    const [branches, setBranches] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Filters
    const [branchFilter, setBranchFilter] = useState<string>("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");

    const fetchData = async () => {
        setIsLoading(true);
        const [expRes, branchRes, catRes] = await Promise.all([
            getExpensesAction({
                branchId: branchFilter === "all" ? undefined : branchFilter,
                categoryId: categoryFilter === "all" ? undefined : categoryFilter
            }),
            getBranchesAction(),
            getExpenseCategoriesAction()
        ]);

        if (expRes.success) setExpenses(expRes.data);
        if (branchRes.success) setBranches(branchRes.data);
        if (catRes.success) setCategories(catRes.data);

        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [branchFilter, categoryFilter]);

    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Expense Listing</h1>
                    <p className="text-muted-foreground mt-1">View and manage all institutional expenses.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" /> Record New Expense
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Record New Expense</DialogTitle>
                        </DialogHeader>
                        <ExpenseForm
                            branches={branches}
                            categories={categories}
                            onSuccess={() => {
                                setIsDialogOpen(false);
                                fetchData();
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <Card className="mb-8">
                <CardContent className="p-4 flex flex-wrap gap-4 items-end">
                    <div className="w-full md:w-64 space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Building2 className="w-3.5 h-3.5" /> Branch
                        </label>
                        <Select value={branchFilter} onValueChange={setBranchFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Branches" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Branches</SelectItem>
                                {branches.map((b) => (
                                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="w-full md:w-64 space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Tag className="w-3.5 h-3.5" /> Category
                        </label>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button variant="outline" onClick={() => { setBranchFilter("all"); setCategoryFilter("all"); }} className="gap-2">
                        Reset Filters
                    </Button>
                </CardContent>
            </Card>

            {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-brand" />
                </div>
            ) : expenses.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center h-64 gap-4">
                        <DollarSign className="w-12 h-12 text-muted-foreground opacity-20" />
                        <p className="text-muted-foreground">No expenses recorded for the selected filters.</p>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Branch</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead>Type</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {expenses.map((expense) => (
                                <TableRow key={expense.id}>
                                    <TableCell className="font-medium whitespace-nowrap">
                                        {format(new Date(expense.date), "dd MMM yyyy")}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: expense.expense_categories?.color || "#94a3b8" }}
                                            />
                                            {expense.expense_categories?.name || "Other"}
                                        </div>
                                    </TableCell>
                                    <TableCell>{expense.branches?.name}</TableCell>
                                    <TableCell className="max-w-xs truncate">{expense.description || "-"}</TableCell>
                                    <TableCell className="text-right font-bold text-lg">
                                        ₹{Number(expense.amount).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        {expense.is_recurring ? (
                                            <Badge variant="secondary" className="gap-1">
                                                <CalendarImg className="w-3 h-3" /> {expense.recurring_interval}
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline">Once</Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}
        </div>
    );
}
