"use client";

import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import { useState, useMemo, useEffect, useRef, memo } from "react";

import { Icon } from "../base/Icon";

export const customSelectVariants = cva("custom-select relative", {
  variants: {
    variant: {
      default: "border-primary-1 text--primary-1",
      yellow: "border-yellow text-white",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type OptionType = string | { label: string; value: string };

export interface CustomSelectProps extends VariantProps<typeof customSelectVariants> {
  options: OptionType[];
  value?: string;
  onChange?: (value: string) => void;
  onSearchChange?: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
}

export const CustomSelect = memo<CustomSelectProps>(
  ({ options, value, onChange, onSearchChange, placeholder = "Select...", variant, searchable = true }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const ref = useRef<HTMLDivElement>(null);

    const normalizedOptions = useMemo(() => {
      return options.map((opt) => (typeof opt === "string" ? { label: opt, value: opt } : opt));
    }, [options]);

    const filtered = useMemo(() => {
      return searchable ? normalizedOptions.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase())) : normalizedOptions;
    }, [normalizedOptions, search, searchable]);

    useEffect(() => {
      setSearch("");
    }, [value]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <div
        ref={ref}
        className="custom-select relative"
      >
        <div
          className={clsx(
            "max-w-full flex justify-between items-center gap-2.5 p-2.5 border rounded-lg cursor-pointer lg:p-5 transition-opacity hover:opacity-50",
            customSelectVariants({ variant })
          )}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="text-[1.25rem] leading-relaxed lg:text-3xl lg:leading-[3.25rem] line-clamp-1">
            {normalizedOptions.find((o) => o.value === value)?.label || placeholder}
          </span>
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
              variant === "yellow" ? "bg-primary-1 border-yellow" : "bg-white border-primary-1"
            )}
          >
            {searchable && (
              <input
                type="text"
                className={clsx(
                  "w-full mb-3 p-2.5 border rounded-lg",
                  variant === "yellow" ? "text-white border-yellow bg-primary-1" : "text-primary-1 border-primary-1"
                )}
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  onSearchChange?.(e.target.value);
                }}
              />
            )}
            {filtered.map((opt) => (
              <div
                key={opt.value}
                className={clsx(
                  "p-2.5 border-b border-border-primary cursor-pointer",
                  value === opt.value && "",
                  variant === "yellow" ? "text-text-secondary" : "text-primary-1"
                )}
                onClick={() => {
                  onChange?.(opt.value);
                  setOpen(false);
                  setSearch("");
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

CustomSelect.displayName = "CustomSelect";
