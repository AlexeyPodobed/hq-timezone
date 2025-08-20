"use client";

import { clsx } from "clsx";
import React, { useEffect, useRef } from "react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import "swiper/css";
import { SwiperOptions } from "swiper/types";

import { useBreakpoint } from "@/hooks/useBreakpoint";

interface SwiperComponentProps {
  children: React.ReactNode;
  settings: SwiperOptions;
  className?: string;
  destroy?: boolean;
  mobileDestroy?: boolean;
  equalHeight?: boolean;
}

const SwiperComponent = ({ children, settings, destroy, mobileDestroy, equalHeight, className, ...props }: SwiperComponentProps) => {
  const swiperRef = useRef<SwiperRef | null>(null);
  const { isReady, isDesktop, isMobile, isTablet } = useBreakpoint();

  useEffect(() => {
    if (!isReady) return;

    const swiper = swiperRef.current?.swiper;
    if (!swiper) return;

    if (destroy && isDesktop && !swiper.destroyed) {
      swiper.destroy(true, true);
    } else if (destroy && !mobileDestroy && !isDesktop && swiper.destroyed) {
      swiper.init();
    }

    if (mobileDestroy && isMobile && !swiper.destroyed) {
      swiper.destroy(true, true);
    } else if (mobileDestroy && !destroy && isTablet && swiper.destroyed) {
      swiper.init();
    }
  }, [isReady, isDesktop, isMobile, isTablet, destroy, mobileDestroy]);

  return (
    <Swiper
      ref={swiperRef}
      modules={[Navigation, Pagination, Autoplay]}
      className={clsx(className, { "height-equal": equalHeight })}
      {...settings}
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <SwiperSlide key={index}>{child}</SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwiperComponent;
