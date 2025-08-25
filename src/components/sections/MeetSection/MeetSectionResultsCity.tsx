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
    <div className="meet-section__results-city">
      <div className="meet-section__results-flex">
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
          className="cursor-pointer"
          onClick={removeCallback}
        >
          <Icon
            name="minus"
            className="text-[2.875rem] text-red-700"
          />
        </div>
      )}
    </div>
  );
};
