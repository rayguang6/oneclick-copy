/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    typescript:{
      ignoreBuildErrors: true,
    },
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
    images: {
      // instead of "domains: […]"
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '*',    // allow any HTTPS host
          // you can omit port and pathname to imply "**"
        },
      ],
    },
    webpack: (config) => {
      config.resolve.alias.fs = false;
      config.resolve.alias.path = false;
      return config;
    },
    experimental: {
      serverActions: {
        bodySizeLimit: '10mb',
      },
    },
    // Increase the serverless function timeout (in seconds)
    serverRuntimeConfig: {
      functionTimeout: 120,
    }
  }
  
  module.exports = nextConfig; 