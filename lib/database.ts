import { supabase } from './supabase'

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
  let retryCount = 0
  const maxRetries = 3

  while (retryCount < maxRetries) {
    try {
      // 首先检查认证状态
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('Auth error:', authError)
        throw new Error('Authentication failed')
      }

      if (!user) {
        console.error('No authenticated user found')
        throw new Error('User not authenticated')
      }

      console.log('Authenticated user:', user.id)

      const { data, error } = await supabase
        .from('clothing_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Database error:', error)
        throw error
      }

      return data || []
    } catch (error) {
      retryCount++
      console.error(`Attempt ${retryCount} failed:`, error)
      
      if (retryCount >= maxRetries) {
        throw error
      }
      
      // 指数退避重试
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000))
    }
  }

  throw new Error('Failed to fetch clothing items after multiple attempts')
}

// 创建新的衣物项目
export const createClothingItem = async (item: Omit<ClothingItem, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<ClothingItem> => {
  // 获取当前用户
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
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

  return data
}

// 更新衣物项目
export const updateClothingItem = async (id: string, updates: Partial<ClothingItem>): Promise<ClothingItem> => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
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

  return data
}

// 删除衣物项目
export const deleteClothingItem = async (id: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
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
}

// 增加使用次数
export const incrementUsageCount = async (id: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
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
