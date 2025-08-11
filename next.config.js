/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["3000-1b02c8988ead-web.clackypaas.com"],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        hostname: "*",
        protocol: "https",
      },
    ],
  },
};

module.exports = nextConfig;
