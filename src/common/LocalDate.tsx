"use client";

import { memo, useEffect, useState } from "react";

import { formatMonthDate } from "@/utils/date";

interface LocalDateProps {
  showYear?: boolean;
  className?: string;
}

export const LocalDate = memo<LocalDateProps>(({ showYear = true, className }) => {
  const [localDate, setLocalDate] = useState<Date | null>(null);

  useEffect(() => {
    setLocalDate(new Date());
  }, []);

  if (!localDate) return <span className={className}>-- -- ----</span>;

  return <span className={className}>{formatMonthDate(localDate, showYear)}</span>;
});

LocalDate.displayName = "LocalDate";

export default LocalDate;
