/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Suppress Supabase SSR peer dep warnings during build
  experimental: {},
};

module.exports = nextConfig;
