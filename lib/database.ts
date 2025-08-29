import { supabase } from './supabase'
import { cache, CACHE_KEYS, clearUserCache } from './cache'

export interface ClothingItem {
  id: string
  name: string
  image_url: string
  usage_count: number
  original_price: number
  category: string
  tags: string[]
  created_at: string
  updated_at: string
  user_id: string
}

// 获取用户的衣物项目
export const getClothingItems = async (): Promise<ClothingItem[]> => {
  // 首先检查认证状态
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    console.error('Auth error or no user:', authError)
    // 清除所有缓存
    cache.clear()
    throw new Error('AUTH_EXPIRED')
  }

  // 使用用户ID作为缓存键的一部分，确保不同用户的数据不会混淆
  const userCacheKey = `${CACHE_KEYS.CLOTHING_ITEMS}_${user.id}`
  const cachedData = cache.get(userCacheKey)
  if (cachedData) {
    console.log('Using cached clothing items for user:', user.id)
    return cachedData
  }

  // 直接获取数据，因为认证已经在函数开始时检查过了
  const { data, error } = await supabase
    .from('clothing_items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Database error:', error)
    throw error
  }

  const result = data || []
  
  // 缓存结果，使用用户特定的缓存键
  cache.set(userCacheKey, result, 2 * 60 * 1000) // 2分钟缓存
  
  return result
}

// 创建新的衣物项目
export const createClothingItem = async (item: Omit<ClothingItem, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<ClothingItem> => {
  // 首先检查认证状态
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError) {
    console.error('Auth error:', authError)
    // 清除过期的认证cookie
    if (typeof document !== 'undefined') {
      document.cookie = "dw_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
    throw new Error('AUTH_EXPIRED')
  }

  if (!user) {
    console.error('No authenticated user found')
    // 清除过期的认证cookie
    if (typeof document !== 'undefined') {
      document.cookie = "dw_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
    throw new Error('AUTH_EXPIRED')
  }

  const { data, error } = await supabase
    .from('clothing_items')
    .insert([
      {
        ...item,
        user_id: user.id
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating item:', error)
    throw error
  }

  // 清除缓存，强制重新获取数据
  cache.delete(CACHE_KEYS.CLOTHING_ITEMS)

  return data
}

// 更新衣物项目
export const updateClothingItem = async (id: string, updates: Partial<ClothingItem>): Promise<ClothingItem> => {
  // 首先检查认证状态
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError) {
    console.error('Auth error:', authError)
    // 清除过期的认证cookie
    if (typeof document !== 'undefined') {
      document.cookie = "dw_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
    throw new Error('AUTH_EXPIRED')
  }

  if (!user) {
    console.error('No authenticated user found')
    // 清除过期的认证cookie
    if (typeof document !== 'undefined') {
      document.cookie = "dw_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
    throw new Error('AUTH_EXPIRED')
  }

  const { data, error } = await supabase
    .from('clothing_items')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating item:', error)
    throw error
  }

  // 清除当前用户的缓存
  await clearUserCache()

  return data
}

// 删除衣物项目
export const deleteClothingItem = async (id: string): Promise<void> => {
  // 首先检查认证状态
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError) {
    console.error('Auth error:', authError)
    // 清除过期的认证cookie
    if (typeof document !== 'undefined') {
      document.cookie = "dw_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
    throw new Error('AUTH_EXPIRED')
  }

  if (!user) {
    console.error('No authenticated user found')
    // 清除过期的认证cookie
    if (typeof document !== 'undefined') {
      document.cookie = "dw_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
    throw new Error('AUTH_EXPIRED')
  }

  const { error } = await supabase
    .from('clothing_items')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting item:', error)
    throw error
  }

  // 清除当前用户的缓存
  await clearUserCache()
}

// 增加使用次数
export const incrementUsageCount = async (id: string): Promise<void> => {
  // 首先检查认证状态
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError) {
    console.error('Auth error:', authError)
    // 清除过期的认证cookie
    if (typeof document !== 'undefined') {
      document.cookie = "dw_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
    throw new Error('AUTH_EXPIRED')
  }

  if (!user) {
    console.error('No authenticated user found')
    // 清除过期的认证cookie
    if (typeof document !== 'undefined') {
      document.cookie = "dw_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
    throw new Error('AUTH_EXPIRED')
  }

  const { error } = await supabase
    .from('clothing_items')
    .update({ usage_count: supabase.rpc('increment_usage_count') })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error incrementing usage count:', error)
    throw error
  }
}
