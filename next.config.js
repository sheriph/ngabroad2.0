// @ts-nocheck
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    USER_EMAIL: process.env.USER_EMAIL,
    USER_PASSWORD: process.env.USER_PASSWORD,
    FLW_PUBLIC_KEY: process.env.FLW_PUBLIC_KEY,
    FLW_SECRET_KEY: process.env.FLW_SECRET_KEY,
    NEXT_PUBLIC_FLW_PUBLIC_KEY: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  },
  swcMinify: true,
  // reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: [
      "ngabroadimages.s3.eu-west-2.amazonaws.com",
      "naijagoingabroad.com.ng",
      "thumbs.dreamstime.com",
      "cdn.naijagoingabroad.com",
      "www.naijagoingabroad.com.ng",
      "images.unsplash.com",
      "sc04.alicdn.com",
      "cl9nedatabucket170937-dev.s3.eu-central-1.amazonaws.com",
      "https://ngav21e78a8b3cc4f543578f719d56dc031e1c170205-dev.s3.eu-west-2.amazonaws.com",
    ],
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
