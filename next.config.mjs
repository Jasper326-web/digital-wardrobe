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
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // 压缩配置
  compress: true,
  // 静态资源优化
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  // 输出配置
  output: 'standalone',
  // 页面优化
  poweredByHeader: false,
  // 缓存配置
  generateEtags: false,
}

export default nextConfig
