"use client";
import { useState } from "react";

import { CustomSelect } from "@/components/base/CustomSelect";

interface HeroCitySelectProps {
    cities: string[];
}

export function HeroCitySelect({ cities }: HeroCitySelectProps) {
    const [city, setCity] = useState("");
    return (
        <>
            <CustomSelect
                options={cities}
                value={city}
                onChange={setCity}
                placeholder="Select city"
            />
            <CustomSelect
                options={cities}
                value={city}
                onChange={setCity}
                placeholder="Select city"
                variant="yellow"
            />
        </>
    );
}
