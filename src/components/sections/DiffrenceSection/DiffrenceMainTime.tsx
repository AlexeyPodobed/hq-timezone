import { clsx } from "clsx";
import { memo } from "react";
import "./DiffrenceSection.scss";

export interface DiffrenceMainTimeProps {
  aCity: string;
  bCity: string;
  timeDiffrence: string;
  sentence: string;
  className?: string;
}

export const DiffrenceMainTime = memo<DiffrenceMainTimeProps>(({ aCity, bCity, timeDiffrence, sentence, className }) => {
  return (
    <div className={clsx("diffrence-section__main-time", className)}>
      <div className="diffrence-section__main-time-block">
        <h3 className="diffrence-section__main-city">
          {aCity} {">"} {bCity}
        </h3>
        <h2 className="diffrence-section__main-time-value">{timeDiffrence}</h2>
        <div className="diffrence-section__main-diffrence">{sentence}</div>
      </div>
    </div>
  );
});

DiffrenceMainTime.displayName = "DiffrenceMainTime";
