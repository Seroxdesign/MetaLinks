/** @type {import('next').NextConfig} */
const nextConfig = {
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
            hostname: 'metadata.ens.domains',
            port: '',
            pathname: '/**',
          },
        ],
      },
};

export default nextConfig;
