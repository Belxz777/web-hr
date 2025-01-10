/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
  serverActions: {
  allowedForwardedHosts: ['https://kdnhfs81-3000.euw.devtunnels.ms/'],
  allowedOrigins: ["https://kdnhfs81-3000.euw.devtunnels.ms/"]
  },
  },
  reactStrictMode: false,
  images: {
remotePatterns:[{
protocol: 'https',
hostname: "images.squarespace-cdn.com",

}]
  }
  };
export default nextConfig;
