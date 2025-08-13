import clsx from "clsx";
// import Link from "next/link";

import { Container } from "@/common/Container";
import { LinkType } from "@/types/global";
import "@/components/components.scss";

interface HeaderProps {
  navLinks?: LinkType[];
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  return (
    <header className={clsx("header", className)}>
      <Container>Header</Container>
    </header>
  );
}
