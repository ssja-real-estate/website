/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = {
  images: {
    loader: "akamai",
    path: "",
    domains: ["ssja.ir","trustseal.enamad.ir"],
  },
};
