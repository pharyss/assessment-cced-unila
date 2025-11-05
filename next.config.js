/** @type {import('next').NextConfig} */
const nextConfig = {
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
<<<<<<< HEAD
  // Proxy API requests to backend during development (bypasses CORS)
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/:path*",
      },
    ];
  },
=======
>>>>>>> 880ec58fb4eb94d770c441b8e71cd182a492ccfc
};

module.exports = nextConfig;
