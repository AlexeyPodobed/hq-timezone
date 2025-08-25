import React from "react";

import { Icon } from "@/components/base/Icon.tsx";

interface MeetSectionResultsCityProps {
  name: string | undefined;
  label: string;
  showRemoveBtn?: boolean;
  removeCallback?: () => void;
  diffShort?: string;
}

export const MeetSectionResultsCity = ({ name, label, showRemoveBtn = false, removeCallback, diffShort }: MeetSectionResultsCityProps) => {
  return (
    <div className="meet-section__results-city relative">
      <div className="meet-section__results-flex pt-2 lg:pt-0">
        {(name || diffShort) && (
          <h4>
            {name && name}
            {diffShort && <span> {diffShort}</span>}
          </h4>
        )}
        <p>{label}</p>
      </div>
      {showRemoveBtn && removeCallback && (
        <div
          className="cursor-pointer meet-section__results-city-remove absolute -top-2 right-0 lg:static lg:pt-1"
          onClick={removeCallback}
        >
          <Icon
            name="minus"
            className="text-[1.5rem] pt-2 lg:pt-0 lg:text-[2rem] text-red-500 relative z-10 lg:static"
          />
        </div>
      )}
    </div>
  );
};
