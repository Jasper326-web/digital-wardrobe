"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/login-form"
import { Navigation } from "@/components/navigation"
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

    const checkAuthStatus = async () => {
      try {
        console.log('Checking authentication status...')
        
        // 检查Supabase会话状态
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth check error:', error)
          // 清除可能过期的cookie
          document.cookie = "dw_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
          setIsCheckingAuth(false)
          return
        }
        
        if (session && session.user) {
          console.log('User is authenticated:', session.user.email)
          // 检查是否已经有认证cookie
          const hasAuthCookie = document.cookie.includes('dw_auth')
          if (!hasAuthCookie) {
            // 设置认证cookie
            document.cookie = `dw_auth=1; path=/; max-age=86400; secure; samesite=lax`
          }
          
          // 检查URL参数中的重定向目标
          const urlParams = new URLSearchParams(window.location.search)
          const redirectTo = urlParams.get('redirect') || '/wardrobe'
          console.log('Redirecting to:', redirectTo)
          router.push(redirectTo)
          return
        }
        
        // 检查dw_auth cookie作为备用
        const hasDwAuthCookie = document.cookie.includes('dw_auth')
        if (hasDwAuthCookie) {
          console.log('Found dw_auth cookie, checking if session is still valid...')
          
          // 尝试刷新会话
          const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession()
          
          if (refreshedSession && refreshedSession.user) {
            console.log('Session refreshed successfully, redirecting to wardrobe')
            router.push('/wardrobe')
            return
          } else {
            console.log('Session refresh failed, clearing cookie')
            document.cookie = "dw_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
          }
        }
        
        console.log('No valid session found, showing login form')
        setIsCheckingAuth(false)
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsCheckingAuth(false)
      }
    }
    
    // 添加延迟，避免在OAuth回调过程中立即检查
    const timer = setTimeout(checkAuthStatus, 500)
    return () => clearTimeout(timer)
  }, [router, isClient])

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
          src="/Lucid_Origin_A_stylish_digital_wardrobe_concept_scene_showcasi_2.jpg"
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
