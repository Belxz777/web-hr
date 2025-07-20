/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
  serverActions: {
  allowedForwardedHosts: [""],
  allowedOrigins: [""]
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
          ? '/api/:path*'
          : '/api/:path*'
      }
    ]
  }
  };
export default nextConfig;