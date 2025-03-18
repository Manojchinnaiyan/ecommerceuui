/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "localhost",
      "127.0.0.1",
      // Add your production image domain here, e.g.:
      // 'your-backend-domain.com',
      // 'your-storage-bucket.s3.amazonaws.com',
      "placehold.co",
      "picsum.photos",
      "loremflickr.com",
      "via.placeholder.com",
    ],
  },
  // Enable SWC minification for faster builds
  swcMinify: true,
  // Configure redirects if needed
  async redirects() {
    return [
      // Example redirect
      // {
      //   source: '/old-page',
      //   destination: '/new-page',
      //   permanent: true,
      // },
    ];
  },
  // Configure rewrites if needed (useful for API proxying)
  async rewrites() {
    return [
      // Example rewrite for local development
      // {
      //   source: '/api/:path*',
      //   destination: 'http://localhost:8000/api/:path*',
      // },
    ];
  },
  // Enable TypeScript error reporting in builds
  typescript: {
    // Set to false to ignore TypeScript errors during build (not recommended for production)
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
