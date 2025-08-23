import { supabase } from './supabase'

export interface ClothingItem {
  id: string
  name: string
  image_url?: string
  usage_count: number
  original_price: number
  category: string
  tags: string[]
  user_id?: string
  created_at: string
  updated_at: string
}

// 获取所有衣物项目
export const getClothingItems = async (category?: string): Promise<ClothingItem[]> => {
  const maxRetries = 3
  let lastError: any = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempting to fetch ${category || 'all'} items (attempt ${attempt}/${maxRetries})`)
      
      let query = supabase
        .from('clothing_items')
        .select('*')
        .order('created_at', { ascending: false })

      if (category) {
        query = query.eq('category', category)
      }

      const { data, error } = await query

      if (error) {
        console.error(`Error fetching clothing items (attempt ${attempt}):`, error)
        lastError = error
        throw new Error(`Failed to fetch clothing items: ${error.message}`)
      }

      console.log(`Successfully fetched ${data?.length || 0} ${category || 'items'}`)
      return data || []
      
    } catch (error) {
      lastError = error
      console.error(`Database connection error (attempt ${attempt}):`, error)
      
      if (attempt === maxRetries) {
        console.error('All retry attempts failed, returning empty array')
        return []
      }
      
      // 等待一段时间后重试
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    }
  }

  return []
}

// 创建新的衣物项目
export const createClothingItem = async (item: Omit<ClothingItem, 'id' | 'created_at' | 'updated_at'>): Promise<ClothingItem> => {
  // 获取当前用户ID
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('clothing_items')
    .insert([{
      ...item,
      user_id: user.id
    }])
    .select()
    .single()

  if (error) {
    console.error('Error creating clothing item:', error)
    throw new Error(`Failed to create clothing item: ${error.message}`)
  }

  return data
}

// 更新衣物项目
export const updateClothingItem = async (id: string, updates: Partial<ClothingItem>): Promise<ClothingItem> => {
  const { data, error } = await supabase
    .from('clothing_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating clothing item:', error)
    throw new Error(`Failed to update clothing item: ${error.message}`)
  }

  return data
}

// 删除衣物项目
export const deleteClothingItem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('clothing_items')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting clothing item:', error)
    throw new Error(`Failed to delete clothing item: ${error.message}`)
  }
}

// 增加使用次数
export const incrementUsageCount = async (id: string): Promise<ClothingItem> => {
  const { data, error } = await supabase
    .from('clothing_items')
    .update({ usage_count: supabase.rpc('increment_usage_count') })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error incrementing usage count:', error)
    throw new Error(`Failed to increment usage count: ${error.message}`)
  }

  return data
}
