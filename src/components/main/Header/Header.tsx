import clsx from "clsx";

// import Link from "next/link";
import { ImageWrapper } from "@/common/ImageWrapper";
import { LinkType } from "@/types/global";
import "@/components/components.scss";

import "./Header.scss";
import { HeaderDate } from "./HeaderDate";
import HeaderTimeSwitcher from "./HeaderTimeSwitcher";

interface HeaderProps {
  navLinks?: LinkType[];
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  return (
    <header className={clsx("header", className)}>
      <ImageWrapper
        src="/images/logo.svg"
        alt="Logo"
        className="w-[15.938rem]"
      />

      <div className="flex items-center gap-2.5">
        <HeaderTimeSwitcher />
        <HeaderDate />
      </div>
    </header>
  );
}
