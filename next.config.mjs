/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'encoding');
    return config;
  },
    images: {
      dangerouslyAllowSVG: true,
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'nft-cdn.alchemy.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'assets.airstack.xyz',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'metadata.ens.domains',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'w3s.link',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'ipfs.io',
            port: '',
            pathname: '/**',
          },
        ],
      },
};

export default nextConfig;
