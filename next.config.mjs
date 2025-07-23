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
  //   webpack: (config) => {
  //   config.resolve.alias = {
  //     ...config.resolve.alias,
  //     '@': path.resolve(__dirname, 'src'),
  //     '@components': path.resolve(__dirname, 'src/components'),
  //     '@utils': path.resolve(__dirname, 'src/utils'),
  //     '@lib': path.resolve(__dirname, 'src/lib'),
  //     '@store': path.resolve(__dirname, 'src/store'),
  //     '@hooks': path.resolve(__dirname, 'src/hooks'),
  //     '@svgs': path.resolve(__dirname, 'src/svgs'),
  //     '@config': path.resolve(__dirname, 'src/config.ts'),
  //   };
  //   return config;
  // },

  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: process.env.NODE_ENV === 'production' 
  //         ? '/api/:path*'
  //         : '/api/:path*'
  //     }
  //   ]
  // }
  };
export default nextConfig;