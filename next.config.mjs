/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
  serverActions: {
  allowedForwardedHosts: ['https://kdnhfs81-3000.euw.devtunnels.ms/',"https://mznn1hzc-3000.euw.devtunnels.ms/","https://bj6wpd1n-3000.euw.devtunnels.ms/","localhost:3000","http://81.200.158.11:8000", "https://web-pulse-rust.vercel.app"],
  allowedOrigins: ["https://kdnhfs81-3000.euw.devtunnels.ms/","https://mznn1hzc-3000.euw.devtunnels.ms/","https://bj6wpd1n-3000.euw.devtunnels.ms/","https://web-pulse-rust.vercel.app/","localhost:3000","http://81.200.158.11:8000", "https://web-pulse-rust.vercel.app"]
  },
  },
  reactStrictMode: false,
  
  images: {
remotePatterns:[{
protocol: 'https',
hostname: "images.squarespace-cdn.com",

}]
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? 'https://web-pulse-rust.vercel.app/api/:path*'
          : 'http://81.200.158.11:8000/api/:path*'
      }
    ]
  }
  };
export default nextConfig;