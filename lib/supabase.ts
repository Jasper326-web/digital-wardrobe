import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 检查环境变量是否存在
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are not set. Authentication will not work.')
  throw new Error('Supabase environment variables are not configured')
}

// 清理URL，移除可能的尾随字符
const cleanSupabaseUrl = supabaseUrl.replace(/[%#]$/, '')

export const supabase = createClient(
  cleanSupabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      // 使用简单的认证流程
      detectSessionInUrl: true,
      flowType: 'implicit'
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
)

// 检查Supabase连接状态
export const checkSupabaseConnection = async (): Promise<boolean> => {
  // 如果环境变量未设置，返回 false
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not set, skipping connection check')
    return false
  }

  try {
    const { data, error } = await supabase
      .from('clothing_items')
      .select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('Supabase connection check failed:', error)
      return false
    }
    
    console.log('Supabase connection successful')
    return true
  } catch (error) {
    console.error('Supabase connection error:', error)
    return false
  }
}

// 图片上传工具函数
export const uploadImage = async (file: File, itemId: string, category: string): Promise<string> => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${itemId}-${Date.now()}.${fileExt}`
  const filePath = `${category}/${fileName}`

  console.log(`Uploading ${file.name} (${(file.size / 1024).toFixed(1)}KB) to ${filePath}`)

  const { data, error } = await supabase.storage
    .from('wardrobe-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Error uploading image:', error)
    throw new Error(`Failed to upload image: ${error.message}`)
  }

  console.log('Upload successful, getting public URL...')

  // 获取公共URL
  const { data: { publicUrl } } = supabase.storage
    .from('wardrobe-images')
    .getPublicUrl(data.path)

  return publicUrl
}

// 删除图片工具函数
export const deleteImage = async (imageUrl: string): Promise<void> => {
  // 从URL中提取文件路径
  const urlParts = imageUrl.split('/')
  const filePath = urlParts.slice(-2).join('/') // 获取 category/filename

  const { error } = await supabase.storage
    .from('wardrobe-images')
    .remove([filePath])

  if (error) {
    console.error('Error deleting image:', error)
    throw new Error(`Failed to delete image: ${error.message}`)
  }
}

// 将Base64图片转换为File对象
export const base64ToFile = (base64String: string, filename: string): File => {
  const arr = base64String.split(',')
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg'
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  
  return new File([u8arr], filename, { type: mime })
}
