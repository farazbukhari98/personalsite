/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    domains: ['vercel-blob.s3.us-east-1.amazonaws.com', 'vr2z9g34fcliluxo.public.blob.vercel-storage.com'],
  },
};

module.exports = nextConfig;