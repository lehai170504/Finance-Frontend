import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

// Cấu hình PWA
const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

// Cấu hình Next.js
const nextConfig: NextConfig = {
  output: "export", // Quan trọng: Xuất ra file static để Electron có thể đọc
  images: {
    unoptimized: true, // Bắt buộc khi dùng output export
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  devIndicators: {
    // @ts-ignore - Next.js 16 types might be missing this, but it works at runtime
    appIsrStatus: false,
  },
};

// Bọc cấu hình nextConfig bằng PWA
export default withPWA(nextConfig);
