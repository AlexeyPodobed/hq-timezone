import clsx from "clsx";
// import Link from "next/link";

import { Container } from "@/common/Container";
// import SocLink from "@/components/base/SocLink";
import "@/components/components.scss";

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer className={clsx("footer", className)}>
      <Container>Footer</Container>
    </footer>
  );
}
