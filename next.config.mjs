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
