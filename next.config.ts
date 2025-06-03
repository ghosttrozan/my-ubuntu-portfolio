/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (
    config: import('webpack').Configuration,
  ) => {
    return config;
  }
};

module.exports = nextConfig;