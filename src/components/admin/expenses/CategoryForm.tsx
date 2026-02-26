"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseCategorySchema, ExpenseCategoryFormValues } from "@/lib/schemas/branch";
import { createExpenseCategoryAction, updateExpenseCategoryAction } from "@/lib/actions/expense.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface CategoryFormProps {
    initialData?: any;
    onSuccess: () => void;
}

const colors = [
    "#6366f1", "#ef4444", "#10b981", "#f59e0b", "#3b82f6",
    "#8b5cf6", "#ec4899", "#06b6d4", "#f97316", "#84cc16"
];

export function CategoryForm({ initialData, onSuccess }: CategoryFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<ExpenseCategoryFormValues>({
        resolver: zodResolver(expenseCategorySchema),
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
            color: initialData?.color || "#6366f1",
        },
    });

    async function onSubmit(values: ExpenseCategoryFormValues) {
        setIsLoading(true);
        try {
            const res = initialData
                ? await updateExpenseCategoryAction(initialData.id, values)
                : await createExpenseCategoryAction(values);

            if (res.success) {
                toast({ title: `Category ${initialData ? "updated" : "created"} successfully` });
                onSuccess();
            } else {
                toast({ title: "Error", description: res.error, variant: "destructive" });
            }
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Rent, Salary" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Describe the purpose of this category" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Pick a Color</FormLabel>
                            <FormControl>
                                <div className="flex flex-wrap gap-2">
                                    {colors.map((c) => (
                                        <button
                                            key={c}
                                            type="button"
                                            className={`w-8 h-8 rounded-full border-2 transition-all ${field.value === c ? "border-black scale-110" : "border-transparent"
                                                }`}
                                            style={{ backgroundColor: c }}
                                            onClick={() => field.onChange(c)}
                                        />
                                    ))}
                                    <Input
                                        type="color"
                                        className="w-8 h-8 p-0 border-none bg-transparent"
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Update Category" : "Create Category"}
                </Button>
            </form>
        </Form>
    );
}
