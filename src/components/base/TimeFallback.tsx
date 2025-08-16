import clsx from "clsx";
import { memo } from "react";

interface TimeFallbackProps {
  showSeconds?: boolean;
  className?: string;
}

const TimeFallback = memo<TimeFallbackProps>(({ showSeconds = false, className }) => {
  return (
    <span className={clsx("time", className)}>
      <span className="hours">--</span>:<span className="minutes">--</span>
      {showSeconds === true && <span className="seconds">:--</span>}
    </span>
  );
});

TimeFallback.displayName = "TimeFallback";

export default TimeFallback;
