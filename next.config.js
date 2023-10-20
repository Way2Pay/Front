/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
       source: "/api/transaction/index.js",
        
        headers: [
          { "key": "Access-Control-Allow-Origin", "value": "*" },
        ],
      },
    ]
  },
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["@sismo-core/sismo-connect-server"],
  },
  webpack: config => {
   
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};

module.exports = nextConfig;
