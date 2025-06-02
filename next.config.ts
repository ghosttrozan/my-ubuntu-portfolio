/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.externals = [...config.externals, { '@prisma/client': '@prisma/client' }]
    return config
  },
};

module.exports = nextConfig;
