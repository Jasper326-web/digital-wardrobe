"use client"

import { useEffect, Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { trackEvent } from '@/lib/analytics'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isProcessing, setIsProcessing] = useState(true)
  const [redirectTarget, setRedirectTarget] = useState<string | null>(null)

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
          
          // 记录OAuth成功事件
          trackEvent('login_success', { method: 'oauth', provider: 'google' })

          // 检查是否有重定向参数
          const redirectTo = searchParams.get('redirect') || '/wardrobe'
          console.log('Setting redirect target:', redirectTo)
          setRedirectTarget(redirectTo)
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

  // 监听认证状态变化，确保跳转成功
  useEffect(() => {
    if (!redirectTarget) return

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session && redirectTarget) {
          console.log('OAuth callback: Auth state confirmed, proceeding with redirect')
          setIsProcessing(false)
          // 使用 window.location 确保强制跳转
          window.location.href = redirectTarget
        }
      }
    )

    // 备用机制：如果5秒内没有收到认证状态变化，强制跳转
    const fallbackTimer = setTimeout(() => {
      if (redirectTarget && isProcessing) {
        console.log('OAuth callback: Fallback redirect triggered')
        setIsProcessing(false)
        window.location.href = redirectTarget
      }
    }, 5000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(fallbackTimer)
    }
  }, [redirectTarget, isProcessing])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <p className="text-gray-600">正在处理登录...</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">正在处理登录...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
