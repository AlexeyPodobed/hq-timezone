import { FC } from "react";

import { Time } from "@/components/base/Time";
import { formatMonthDate } from "@/utils/gloabl";

interface HeaderDateProps {
  date?: Date;
  showYear?: boolean;
}

export const HeaderDate: FC<HeaderDateProps> = ({ date = new Date(), showYear = true }) => {
  return (
    <div className="header__time-wrap">
      <span>{formatMonthDate(date, showYear)}</span>
      <Time className="min-w-24 flex gap-0.5 justify-center" />
    </div>
  );
};
