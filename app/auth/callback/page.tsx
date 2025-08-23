"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Processing auth callback...')
        
        // 获取当前session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          router.push('/')
          return
        }

        console.log('Auth session data:', { session: !!session, user: session?.user?.email })

        if (session) {
          console.log('User authenticated:', session.user.email)
          
          // 设置我们的认证cookie
          document.cookie = `dw_auth=1; path=/; max-age=86400; secure; samesite=lax`
          
          // 等待一下确保cookie设置完成
          await new Promise(resolve => setTimeout(resolve, 100))
          
          // 重定向到wardrobe页面
          router.push('/wardrobe')
        } else {
          console.log('No session found, redirecting to home')
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
