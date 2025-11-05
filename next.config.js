/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "standalone",

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["localhost"],

    remotePatterns: [
      {
        protocol: "https",

        hostname: "cdn.sanity.io",

        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
