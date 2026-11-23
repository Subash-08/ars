/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com"],
  },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "prisma"],
  },
};

export default nextConfig;
