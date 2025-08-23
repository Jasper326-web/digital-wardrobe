"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // 处理认证回调
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          router.push('/')
          return
        }

        if (data.session) {
          // 设置我们的认证cookie
          document.cookie = `dw_auth=1; path=/; max-age=86400`
          
          // 重定向到wardrobe页面
          router.push('/wardrobe')
        } else {
          // 没有session，重定向到首页
          router.push('/')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        router.push('/')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <p className="text-gray-600">处理登录中...</p>
      </div>
    </div>
  )
}
