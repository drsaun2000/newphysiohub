/** @type {import('next').NextConfig} */

const nextConfig = {
    env: {
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1",
      },
      images: {
        remotePatterns: [
          {
            // protocol: "https",
            hostname: "drsaun777.sirv.com",
          },
          {
            protocol: "https",
            hostname: "res.cloudinary.com",
            pathname: "/derpthkas/image/upload/**",
          },
        ],
      },
};

export default nextConfig;
