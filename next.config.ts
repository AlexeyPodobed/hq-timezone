/** @type {import('next').NextConfig} */

const nextConfig = {
  // output: "standalone", // Needed on dev stage
  images: {
    loader: "custom",
    loaderFile: "./ImageLoader.js",
  },
};

export default nextConfig;
