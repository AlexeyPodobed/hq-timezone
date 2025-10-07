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
        source: "/sitemap_index.xml",
        destination: "/sitemap.xml",
      },
    ];
  },
};

export default nextConfig;
