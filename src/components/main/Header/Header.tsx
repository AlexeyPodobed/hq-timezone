import clsx from "clsx";

// import Link from "next/link";
import { ImageWrapper } from "@/common/ImageWrapper";
import "@/components/components.scss";
import "./Header.scss";
import { getCurrentDate } from "@/utils/global";

import { HeaderDate } from "./HeaderDate";
import HeaderTimeSwitcher from "./HeaderTimeSwitcher";

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const currentDate = getCurrentDate();

  return (
    <header className={clsx("header", className)}>
      <div className="header-inner">
        <ImageWrapper
          src="/images/logo.svg"
          alt="Logo"
          className="max-w-[7.1875rem] lg:max-w-[15.938rem]"
        />

        <div className="flex items-center gap-2.5">
          <HeaderTimeSwitcher />
          <HeaderDate date={currentDate} />
        </div>
      </div>
    </header>
  );
}
