"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/login-form"
import { Navigation } from "@/components/navigation"
import { getBackgroundUrl } from "@/lib/r2-config"
import { supabase } from "@/lib/supabase"
import { useLanguage } from "@/lib/lang-context"

export default function HomePage() {
  const loginFormRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { t } = useLanguage()

  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isClient, setIsClient] = useState(false)

  // 确保只在客户端运行
  useEffect(() => {
    setIsClient(true)
  }, [])

  // 检查登录状态，如果已登录则重定向到wardrobe页面
  useEffect(() => {
    if (!isClient) return

    // 检查是否是登出后的重定向
    const urlParams = new URLSearchParams(window.location.search)
    const logoutStatus = urlParams.get('logout')
    
    if (logoutStatus) {
      // 如果是登出后的重定向，清除所有认证状态并停止检查
      console.log('检测到登出状态:', logoutStatus)
      document.cookie = "dw_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      document.cookie = "sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supabase.auth.token')
        localStorage.removeItem('supabase.auth.expires_at')
        localStorage.removeItem('supabase.auth.refresh_token')
        localStorage.removeItem('supabase.auth.access_token')
      }
      
      setIsCheckingAuth(false)
      return
    }

    let retryCount = 0
    const maxRetries = 2 // 减少重试次数，快速失败

    const checkAuthStatus = async () => {
      try {
        // 静默检查，不打印日志避免干扰
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth check error:', error)
          document.cookie = "dw_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
          setIsCheckingAuth(false)
          return
        }
        
        if (session && session.user) {
          // 用户已登录，立即跳转
          const hasAuthCookie = document.cookie.includes('dw_auth')
          if (!hasAuthCookie) {
            document.cookie = `dw_auth=1; path=/; max-age=86400; secure; samesite=lax`
          }
          
          const urlParams = new URLSearchParams(window.location.search)
          const redirectTo = urlParams.get('redirect') || '/wardrobe'
          router.push(redirectTo)
          return
        }
        
        // 检查cookie作为备用
        const hasDwAuthCookie = document.cookie.includes('dw_auth')
        if (hasDwAuthCookie) {
          const { data: { session: refreshedSession } } = await supabase.auth.refreshSession()
          
          if (refreshedSession && refreshedSession.user) {
            router.push('/wardrobe')
            return
          } else {
            document.cookie = "dw_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
          }
        }
        
        // 快速重试一次
        retryCount++
        if (retryCount < maxRetries) {
          setTimeout(checkAuthStatus, 500) // 快速重试
          return
        }
        
        setIsCheckingAuth(false)
      } catch (error) {
        console.error('Auth check failed:', error)
        retryCount++
        if (retryCount < maxRetries) {
          setTimeout(checkAuthStatus, 500)
          return
        }
        setIsCheckingAuth(false)
      }
    }
    
    // 减少延迟，快速响应
    const timer = setTimeout(checkAuthStatus, 300)
    return () => clearTimeout(timer)
  }, [isClient])

  const handleProtectedLinkClick = () => {
    if (loginFormRef.current) {
      // Add shake animation
      loginFormRef.current.classList.add('animate-shake')
      setTimeout(() => {
        loginFormRef.current?.classList.remove('animate-shake')
      }, 500)
    }
  }

  // 如果正在检查认证状态，显示加载状态
  if (!isClient || isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('home.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">

      
      <Navigation onProtectedLinkClick={handleProtectedLinkClick} />
      {/* Background images */}
      <div className="absolute inset-0 opacity-90">
        <img
          src={getBackgroundUrl()}
          alt="Stylish digital wardrobe concept scene"
          className="w-full h-full object-cover object-center"
        />
        {/* Very light gray overlay */}
        <div className="absolute inset-0 bg-gray-100/20"></div>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 min-h-screen flex items-center py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left side - Promotional content */}
            <div className="text-white space-y-8 lg:space-y-12">
              <div className="space-y-6 lg:space-y-8">
                <div className="relative">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight tracking-tight">
                    <span className="inline-flex items-center gap-2 lg:gap-3 whitespace-nowrap">
                      <span className="text-4xl sm:text-5xl lg:text-6xl animate-pulse">🔥</span>
                      <span
                        className="text-white font-black whitespace-nowrap"
                        style={{ 
                          textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"
                        }}
                      >
                        {t('home.title')}
                      </span>
                    </span>
                  </h1>
                  {/* Subtle glow effect */}
                </div>

                <div className="space-y-4 lg:space-y-6 text-base sm:text-lg lg:text-xl">
                  <div className="group flex items-start gap-3 lg:gap-4 p-0">
                    <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">📸</span>
                    <p className="leading-tight">
                      <span 
                        className="underline decoration-white decoration-2 underline-offset-4 font-black text-white"
                        style={{ 
                          textShadow: "-0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0.5px 0.5px 0 #000"
                        }}
                      >
                        {t('home.uploadWardrobe')}
                      </span>
                      <span 
                        className="text-white font-black"
                        style={{ 
                          textShadow: "-0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0.5px 0.5px 0 #000"
                        }}
                      >
                        {t('home.buildCloset')}
                      </span>
                    </p>
                  </div>

                  <div className="group flex items-start gap-3 lg:gap-4 p-0">
                    <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">📊</span>
                    <p className="leading-tight">
                      <span 
                        className="text-white font-black"
                        style={{ 
                          textShadow: "-0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0.5px 0.5px 0 #000"
                        }}
                      >
                        {t('home.trackCost')}
                      </span>
                    </p>
                  </div>

                  <div className="group flex items-start gap-3 lg:gap-4 p-0">
                    <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">✨</span>
                    <p className="leading-tight">
                      <span 
                        className="text-white font-black"
                        style={{ 
                          textShadow: "-0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0.5px 0.5px 0 #000"
                        }}
                      >
                        {t('home.freeAnalysis')}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Login form */}
            <div ref={loginFormRef} className="flex justify-center lg:justify-end">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
