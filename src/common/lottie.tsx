"use client";

import Lottie from "lottie-react";
import React, { memo } from "react";

export const AnimLottie = memo<{ json: object }>(({ json }) => (
  <Lottie
    animationData={json}
    loop={true}
  />
));

AnimLottie.displayName = "AnimLottie";
