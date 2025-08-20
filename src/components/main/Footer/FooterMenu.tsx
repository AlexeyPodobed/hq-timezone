import Link from "next/link";
import { memo } from "react";

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
    <div className="footer__menu">
      {items.map((item, index) => (
        <Link
          key={index}
          href={item.url}
          target={item.target}
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
});

FooterMenu.displayName = "FooterMenu";
