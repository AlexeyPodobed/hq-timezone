"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error }: ErrorPageProps) {
  useEffect(() => {
    console.error("App error boundary:", error);
  }, [error]);

  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:pt-[16rem] lg:pb-[6rem] lg:px-6">
      <div className="mx-auto max-w-screen-sm text-center">
        <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-yellow">500</h1>
        <p className="mb-4 text-3xl tracking-tight font-bold  md:text-4xl text-white">Something went wrong.</p>
        <p className="mb-4 text-lg font-light  text-gray-400">Sorry, something broke on this page. You can try again or return to the home page.</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="/"
            className="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:ring-primary-900 my-4"
          >
            Back to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}
