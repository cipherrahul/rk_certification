import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OfferLetterForm } from "../components/OfferLetterForm";

export default function NewOfferLetterPage() {
    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/offer-letter">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Generate Offer Letter</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Fill in the employee details to generate a secured PDF offer letter.
                    </p>
                </div>
            </div>

            <OfferLetterForm />
        </div>
    );
}
