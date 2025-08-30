// Cloudflare R2 静态资源配置
export const R2_CONFIG = {
  // R2 公共访问域名
  PUBLIC_URL: process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://pub-xxxxx.r2.dev',
  
  // 静态资源路径
  ASSETS: {
    // 背景图片
    BACKGROUND: '/Lucid_Origin_A_stylish_digital_wardrobe_concept_scene_showcasi_2.jpg',
    WARDROBE_BACKGROUND: '/wardrobe-background.jpg',
    
    // 占位图片
    PLACEHOLDER: '/placeholder.jpg',
    PLACEHOLDER_LOGO: '/placeholder-logo.png',
    PLACEHOLDER_USER: '/placeholder-user.jpg',
    
    // 示例图片
    EXAMPLE_IMAGES: {
      BLACK_OXFORDS: '/example-images/black-oxfords.jpg',
      BLACK_PANTS: '/example-images/black-pants.jpg',
      BLUE_JEANS: '/example-images/blue-jeans.jpg',
      BLUE_SHIRT: '/example-images/blue-shirt.jpg',
      WHITE_SNEAKERS: '/example-images/white-sneakers.jpg',
      WHITE_TSHIRT: '/example-images/white-tshirt.jpg',
    }
  }
}

// 获取 R2 资源完整 URL
export function getR2Url(path: string): string {
  return `${R2_CONFIG.PUBLIC_URL}${path}`
}

// 获取背景图片 URL
export function getBackgroundUrl(): string {
  return getR2Url(R2_CONFIG.ASSETS.BACKGROUND)
}

// 获取衣柜背景图片 URL
export function getWardrobeBackgroundUrl(): string {
  return getR2Url(R2_CONFIG.ASSETS.WARDROBE_BACKGROUND)
}

// 获取占位图片 URL
export function getPlaceholderUrl(type: 'default' | 'logo' | 'user' = 'default'): string {
  switch (type) {
    case 'logo':
      return getR2Url(R2_CONFIG.ASSETS.PLACEHOLDER_LOGO)
    case 'user':
      return getR2Url(R2_CONFIG.ASSETS.PLACEHOLDER_USER)
    default:
      return getR2Url(R2_CONFIG.ASSETS.PLACEHOLDER)
  }
}
