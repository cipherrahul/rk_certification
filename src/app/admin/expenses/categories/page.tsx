"use client";

import { useEffect, useState } from "react";
import { getExpenseCategoriesAction, deleteExpenseCategoryAction } from "@/lib/actions/expense.action";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Tag, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CategoryForm } from "@/components/admin/expenses/CategoryForm";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [alertConfig, setAlertConfig] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
    const { toast } = useToast();

    const fetchCategories = async () => {
        setIsLoading(true);
        const res = await getExpenseCategoriesAction();
        if (res.success) {
            setCategories(res.data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async () => {
        if (!alertConfig.id) return;
        try {
            const res = await deleteExpenseCategoryAction(alertConfig.id);
            if (res.success) {
                toast({ title: "Deleted", description: "Category removed successfully." });
                fetchCategories();
            } else {
                toast({ title: "Error", description: res.error, variant: "destructive" });
            }
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setAlertConfig({ isOpen: false, id: null });
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Expense Categories</h1>
                    <p className="text-muted-foreground mt-1">Manage categories for organized expense tracking.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) setEditingCategory(null);
                }}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" /> Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingCategory ? "Edit Category" : "New Category"}</DialogTitle>
                        </DialogHeader>
                        <CategoryForm
                            initialData={editingCategory}
                            onSuccess={() => {
                                setIsDialogOpen(false);
                                fetchCategories();
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-brand" />
                </div>
            ) : categories.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center h-64 gap-4">
                        <Tag className="w-12 h-12 text-muted-foreground opacity-20" />
                        <p className="text-muted-foreground">No categories found. Start by adding one.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categories.map((category) => (
                        <Card key={category.id} className="group overflow-hidden">
                            <div
                                className="h-2 w-full"
                                style={{ backgroundColor: category.color || "#6366f1" }}
                            />
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <h3 className="font-semibold text-lg">{category.name}</h3>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-brand"
                                            onClick={() => {
                                                setEditingCategory(category);
                                                setIsDialogOpen(true);
                                            }}
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                            onClick={() => setAlertConfig({ isOpen: true, id: category.id })}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                                {category.description && (
                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                        {category.description}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <AlertDialog open={alertConfig.isOpen} onOpenChange={(open) => setAlertConfig({ ...alertConfig, isOpen: open })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this category. Expenses already linked to it will remain but without a category.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
