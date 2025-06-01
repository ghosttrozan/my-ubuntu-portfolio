/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
