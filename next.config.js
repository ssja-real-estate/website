/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // output: 'export', // ✅ اضافه شده برای static export
  images: {
    loader: "akamai",
    path: "",
    domains: ["ssja.ir", "trustseal.enamad.ir"],
  },
};

module.exports = nextConfig;
