import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Placeholder images stream from Lummi's public CDN.
    // Optimization is disabled so the demo runs anywhere without a configured loader.
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'assets.lummi.ai' },
      { protocol: 'https', hostname: 'www.lummi.ai' },
      { protocol: 'https', hostname: 'images.pexels.com' },
    ],
  },
};

export default withNextIntl(nextConfig);
