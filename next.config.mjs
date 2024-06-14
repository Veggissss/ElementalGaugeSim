/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: "export",  // For creating ./out directory
    images: { unoptimized: true },
};

export default nextConfig;
