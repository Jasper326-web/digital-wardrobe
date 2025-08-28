"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // 处理认证回调
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          router.push('/?error=auth_failed')
          return
        }

        if (session && session.user) {
          console.log('OAuth login successful:', session.user.email)
          // 设置认证cookie
          document.cookie = `dw_auth=1; path=/; max-age=86400; secure; samesite=lax`
          // 重定向到衣橱页面
          router.push('/wardrobe')
        } else {
          console.log('No session found in callback')
          router.push('/?error=no_session')
        }
      } catch (error) {
        console.error('Auth callback failed:', error)
        router.push('/?error=callback_failed')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <p className="text-gray-600">正在处理登录...</p>
      </div>
    </div>
  )
}
