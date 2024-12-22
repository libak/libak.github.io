import type {NextConfig} from "next";

/**
 * @type {import('next').NextConfig}
 */
const nextConfig: NextConfig = {
    /* config options here */
    output: 'export',
    images: {
        unoptimized: true, // Disable Image Optimization for static builds
    },

    // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
    // trailingSlash: true,

    // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
    // skipTrailingSlashRedirect: true,

    // Optional: Change the output directory `out` -> `dist`
    // distDir: 'dist',
};

export default nextConfig;
