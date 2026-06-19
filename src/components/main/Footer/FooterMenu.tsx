import Link from "next/link";
import { memo } from "react";

import { getSlugFromWpUrl } from "@/utils/global";

interface MenuLink {
  url: string;
  title: string;
  target?: string;
}

interface FooterMenuProps {
  items: MenuLink[];
}

export const FooterMenu = memo<FooterMenuProps>(({ items }) => {
  return (
    <ul className="footer__menu">
      {items.map((item, index) => (
        <li key={index}>
          <Link
            href={getSlugFromWpUrl(item.url)}
            target={item.target}
            prefetch
          >
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  );
});

FooterMenu.displayName = "FooterMenu";
