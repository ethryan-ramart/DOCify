/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse"],
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ejknokozpjwnlzieumpc.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/covers/**',
      },
    ],
  }
};


export default nextConfig;

