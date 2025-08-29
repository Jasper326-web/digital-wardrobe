"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Processing OAuth callback...')
        
        // 处理OAuth回调
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          router.push('/?error=auth_failed')
          return
        }

        if (data.session && data.session.user) {
          console.log('OAuth login successful:', data.session.user.email)
          // 设置认证cookie
          document.cookie = `dw_auth=1; path=/; max-age=86400; secure; samesite=lax`
          
          // 检查是否有重定向参数
          const redirectTo = searchParams.get('redirect') || '/wardrobe'
          console.log('Redirecting to:', redirectTo)
          router.push(redirectTo)
        } else {
          console.log('No session found in callback')
          router.push('/?error=no_session')
        }
      } catch (error) {
        console.error('Auth callback failed:', error)
        router.push('/?error=callback_failed')
      }
    }

    // 延迟处理，确保URL参数已加载
    const timer = setTimeout(handleAuthCallback, 100)
    return () => clearTimeout(timer)
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <p className="text-gray-600">正在处理登录...</p>
      </div>
    </div>
  )
}
