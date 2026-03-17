import { LocalDate } from "@/common/LocalDate";
import { Time } from "@/components/base/Time";

export const HeaderDate = () => {
  return (
    <div className="header__time-wrap">
      <LocalDate />
      <Time className="min-w-24 flex gap-0.5 justify-center" />
    </div>
  );
};

HeaderDate.displayName = "HeaderDate";
