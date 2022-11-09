const withPlugins = require("next-compose-plugins");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

//const withPWA = require("next-pwa");
//const runtimeCaching = require("next-pwa/cache");

const nextConfig = {
  images: {
    domains: [
      "ngabroadimages.s3.eu-west-2.amazonaws.com",
      "naijagoingabroad.com.ng",
      "cdn.naijagoingabroad.com",
      "www.naijagoingabroad.com.ng",
      "images.unsplash.com",
      "sc04.alicdn.com",
      "cl9nedatabucket170937-dev.s3.eu-central-1.amazonaws.com",
      "https://ngav21e78a8b3cc4f543578f719d56dc031e1c170205-dev.s3.eu-west-2.amazonaws.com",
    ],
  },
  webpack5: true,
  reactStrictMode: true,
  trailingSlash: true,
  experimental: {
    scrollRestoration: true,
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    USER_EMAIL: process.env.USER_EMAIL,
    USER_PASSWORD: process.env.USER_PASSWORD,
    FLW_PUBLIC_KEY: process.env.FLW_PUBLIC_KEY,
    FLW_SECRET_KEY: process.env.FLW_SECRET_KEY,
    NEXT_PUBLIC_FLW_PUBLIC_KEY: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY,
  },
};

/* const redirects = {
  async redirects() {
    return [
      {
        source: "/articles",
        destination: "/articles/1",
        permanent: true,
      },
    ];
  },
}; */

//const images = () => ();

module.exports = withPlugins(
  [
    // add a plugin with specific configuration
    /*  [
      withPWA,
      {
        pwa: {
          dest: "public",
          runtimeCaching,
          //         disable: true,
          disable: process.env.NODE_ENV === "development",
        },
      },
    ], */
    // add a plugin without a configuration
    // redirects,
    withBundleAnalyzer,
  ],
  nextConfig
);
