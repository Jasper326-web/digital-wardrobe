/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 性能优化配置
  experimental: {
    // 在Cloudflare环境中禁用optimizeCss，因为需要critters依赖
    // optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // 压缩配置
  compress: true,
  // 静态资源优化
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  // 输出配置 - 在Cloudflare Pages中使用export而不是standalone
  // output: 'standalone',
  // 页面优化
  poweredByHeader: false,
  // 缓存配置
  generateEtags: false,
  // Cloudflare Pages特定配置
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  // 禁用一些可能导致问题的功能
  swcMinify: true,
  reactStrictMode: false,
}

export default nextConfig
