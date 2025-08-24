import "@/assets/styles/globals.css";
import type { Metadata } from "next";
import React from "react";

import Footer from "@/components/main/Footer/Footer";
// import Header from "@/components/main/Header/Header";

export const metadata: Metadata = {
  title: "Next App",
  description: "Next App Description",
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="text-primary-1">
        {/* <Header /> */}
        <main className="relative flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
