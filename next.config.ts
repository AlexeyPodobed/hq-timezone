/** @type {import('next').NextConfig} */

const nextConfig = {
  // output: "standalone", // Needed on dev stage
  images: {
    remotePatterns: [{ protocol: "https", hostname: process.env.NEXT_PUBLIC_WORDPRESS_HOST }],
    formats: ["image/avif", "image/webp"],
  },

  async rewrites() {
    return [
      {
        source: `${process.env.NEXT_PUBLIC_GEO_NAMES_PROXY}/:path*`,
        destination: `${process.env.NEXT_PUBLIC_GEO_NAMES_API}/:path*`,
      },
    ];
  },
};

export default nextConfig;
