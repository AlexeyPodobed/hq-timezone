"use client";

import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import { useState, useMemo } from "react";

import { Icon } from "../base/Icon";

export const customSelectVariants = cva("custom-select relative", {
    variants: {
        variant: {
            default: "w-[11.438rem] flex justify-between items-center gap-2.5 py-[0.938rem] px-5 border border-primary-1 rounded-lg cursor-pointer",
            yellow: "w-[11.438rem] flex justify-between items-center gap-2.5 py-[0.938rem] px-5 border border-border-secondary rounded-lg cursor-pointer",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

interface CustomSelectProps extends VariantProps<typeof customSelectVariants> {
    options: string[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
}

export function CustomSelect({ options, value, onChange, placeholder = "Select...", variant }: CustomSelectProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => options.filter((opt) => opt.toLowerCase().includes(search.toLowerCase())), [search, options]);

    return (
        <div className="custom-select relative">
            <div
                className={customSelectVariants({ variant })}
                onClick={() => setOpen((o) => !o)}
            >
                <span className="text-3xl leading-[3.25rem] line-clamp-1">{value || placeholder}</span>
                <Icon
                    size="0.515rem"
                    name="arrow-down"
                    className={clsx(variant === "yellow" ? "text-text-secondary" : "text-primary-1")}
                />
            </div>
            {open && (
                <div
                    className={clsx(
                        "custom-select-dropdown absolute top-full translate-y-1 left-0 right-0 w-[19.688rem] max-h-80 pt-[1.625rem] pb-6 pl-5 pr-[3.188rem] border rounded-lg z-50 overflow-auto",
                        variant === "yellow" ? "bg-primary-1 border-border-secondary" : "bg-white border-primary-1"
                    )}
                >
                    <input
                        type="text"
                        className={clsx(
                            "w-full mb-3 p-2.5 border  rounded-lg",
                            variant === "yellow" ? "text-text-secondary border-border-secondary " : "text-primary-1 border-primary-1"
                        )}
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {filtered.map((opt) => (
                        <div
                            key={opt}
                            className={clsx(
                                "p-2.5 border-b border-border-primary cursor-pointer",
                                value === opt && "",
                                variant === "yellow" ? "text-text-secondary" : "text-primary-1"
                            )}
                            onClick={() => {
                                onChange?.(opt);
                                setOpen(false);
                                setSearch("");
                            }}
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
