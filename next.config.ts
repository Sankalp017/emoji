import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "em-content.zobj.net",
        port: "",
        pathname: "/thumbs/**",
      },
      {
        protocol: "https",
        hostname: "emojipedia-us.s3.dualstack.us-west-1.amazonaws.com",
        port: "",
        pathname: "/thumbs/**",
      },
    ],
  },
  webpack: (config) => {
    if (process.env.NODE_ENV === "development") {
      config.module.rules.push({
        test: /\.(jsx|tsx)$/,
        exclude: /node_modules/,
        enforce: "pre",
        use: "@dyad-sh/nextjs-webpack-component-tagger",
      });
    }
    return config;
  },
};

export default nextConfig;