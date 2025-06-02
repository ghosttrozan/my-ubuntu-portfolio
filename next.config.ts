/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (
    config: import('webpack').Configuration,
    { isServer }: { isServer: boolean }
  ) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({ '@prisma/client': '@prisma/client' });
    }
    return config;
  }
};

module.exports = nextConfig;