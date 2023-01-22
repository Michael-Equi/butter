/** @type {<T>(config: T) => T} */
const withPrismaPlugin = require("next-prisma-plugin-webpack5");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
    tsconfigPath: "./tsconfig.json",
  },
  compiler: {
    styledComponents: true,
  },
  experimental: {
    externalDir: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

module.exports = withPrismaPlugin(nextConfig);
