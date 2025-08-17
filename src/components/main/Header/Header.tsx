import { getHeader } from "@/api/main";
import { ImageWrapper } from "@/common/ImageWrapper";
import "@/components/components.scss";
import "./Header.scss";
import { getCurrentDate } from "@/utils/global";

import { HeaderDate } from "./HeaderDate";
import HeaderTimeSwitcher from "./HeaderTimeSwitcher";

export default async function Header() {
  const { data } = await getHeader();
  const logo = data.header_logo;
  const currentDate = getCurrentDate();

  return (
    <header className="header">
      <div className="header-inner">
        <ImageWrapper
          src={logo.url || "/images/logo.svg"}
          alt={logo.alt || "Logo"}
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
