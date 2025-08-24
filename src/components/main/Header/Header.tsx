import Link from "next/link";

import { getHeader } from "@/api/main";
import { ImageWrapper } from "@/common/ImageWrapper";
import "@/components/components.scss";
import "./Header.scss";
import { getCurrentDate } from "@/utils/date";

import { HeaderDate } from "./HeaderDate";
import HeaderTimeSwitcher from "./HeaderTimeSwitcher";

export default async function Header() {
  const { data } = await getHeader();
  const { header_logo } = data;
  const currentDate = getCurrentDate();

  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/">
          <ImageWrapper
            src={header_logo.url || "/images/logo.svg"}
            alt={header_logo.alt || "Logo"}
            className="max-w-[7.1875rem] lg:max-w-[15.938rem]"
          />
        </Link>

        <div className="flex items-center gap-2.5">
          <HeaderTimeSwitcher />
          <HeaderDate date={currentDate} />
        </div>
      </div>
    </header>
  );
}
