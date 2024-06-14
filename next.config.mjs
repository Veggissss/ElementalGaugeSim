/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        GITHUB_PAGES_URL: "https://veggissss.github.io/ElementalGaugeSim/",
    },
    reactStrictMode: true,
    output: "export",  // For creating ./out directory
    images: { unoptimized: true },
};

export default nextConfig;
