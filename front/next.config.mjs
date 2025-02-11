/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    webpack(config, options) {
        if (options.isServer) config.devtool = 'source-map';
        return config;
    },
};

export default nextConfig;
