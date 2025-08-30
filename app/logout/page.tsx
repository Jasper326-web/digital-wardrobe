"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { cache } from "@/lib/cache"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const forceLogout = async () => {
      try {
        console.log('强制登出：清除所有认证状态...')
        
        // 1. 清除 Supabase 会话
        await supabase.auth.signOut()
        
        // 2. 清除认证 cookie
        document.cookie = "dw_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        document.cookie = "sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        
        // 3. 清除本地存储
        if (typeof window !== 'undefined') {
          localStorage.removeItem('supabase.auth.token')
          localStorage.removeItem('supabase.auth.expires_at')
          localStorage.removeItem('supabase.auth.refresh_token')
          localStorage.removeItem('supabase.auth.access_token')
          sessionStorage.clear()
        }
        
        // 4. 清除应用缓存
        cache.clear()
        
        // 5. 强制刷新页面状态
        setTimeout(() => {
          console.log('强制登出完成，重定向到首页...')
          router.replace('/?logout=success')
        }, 1000)
        
      } catch (error) {
        console.error('强制登出时出错:', error)
        // 即使出错也要重定向
        setTimeout(() => {
          router.replace('/?logout=error')
        }, 1000)
      }
    }

    forceLogout()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">正在登出...</h2>
        <p className="text-gray-600">清除认证状态中，请稍候...</p>
      </div>
    </div>
  )
}
