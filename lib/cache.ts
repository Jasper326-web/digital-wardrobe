import { supabase } from './supabase'

// 简单的内存缓存系统
class Cache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  set(key: string, data: any, ttl: number = 5 * 60 * 1000) { // 默认5分钟
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get(key: string): any | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  clear() {
    this.cache.clear()
  }

  delete(key: string) {
    this.cache.delete(key)
  }
}

export const cache = new Cache()

// 缓存键常量
export const CACHE_KEYS = {
  CLOTHING_ITEMS: 'clothing_items',
  USER_PROFILE: 'user_profile',
  ANALYTICS_DATA: 'analytics_data'
} as const

// 清除当前用户的缓存
export const clearUserCache = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const userCacheKey = `${CACHE_KEYS.CLOTHING_ITEMS}_${user.id}`
      cache.delete(userCacheKey)
      console.log('Cleared cache for user:', user.id)
    }
  } catch (error) {
    console.error('Error clearing user cache:', error)
  }
}
