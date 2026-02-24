"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";

const contactDetails = [
    {
        icon: MapPin,
        title: "Our Address",
        lines: ["A-9 Nanda Road", "Adarsh Nagar, Delhi - 110033"],
    },
    {
        icon: Phone,
        title: "Phone",
        lines: ["+91 75330 42633"],
    },
    {
        icon: Mail,
        title: "Email",
        lines: ["info.rkinstitution@gmail.com"],
    },
    {
        icon: Clock,
        title: "Working Hours",
        lines: ["Monday – Saturday", "9:00 AM – 5:00 PM"],
    },
];

export function ContactInfo() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {contactDetails.map((item) => (
                <div
                    key={item.title}
                    className="flex gap-4 p-5 rounded-xl border border-border/60 bg-card hover:border-brand/30 transition-colors duration-200"
                >
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-brand" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm text-foreground mb-1">{item.title}</h3>
                        {item.lines.map((line) => (
                            <p key={line} className="text-sm text-muted-foreground leading-relaxed">
                                {line}
                            </p>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
