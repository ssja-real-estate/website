/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = {
  images: {
    loader: "akamai",
    domains: ["ssja.ir"],
  },
};
