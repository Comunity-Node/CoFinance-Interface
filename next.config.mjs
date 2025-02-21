import path from 'path';

const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: function (config, options) {
    const dirname = path.dirname(new URL(import.meta.url).pathname);

    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(dirname, 'src'), 
    };

    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    return config;
  },
};

export default nextConfig;
