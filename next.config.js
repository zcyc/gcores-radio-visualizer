/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["3000-1b02c8988ead-web.clackypaas.com"],
  images: {
    domains: ["alioss.gcores.com", "image.gcores.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.gcores.com",
      },
    ],
  },
};

module.exports = nextConfig;
