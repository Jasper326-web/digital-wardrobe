"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/login-form"
import { Navigation } from "@/components/navigation"
import { supabase } from "@/lib/supabase"

export default function HomePage() {
  const loginFormRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [debugInfo, setDebugInfo] = useState<string>('')
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
        // 添加调试信息
        const debug = `
          环境检查:
          - URL: ${window.location.href}
          - User Agent: ${navigator.userAgent}
          - Cookies: ${document.cookie}
          - dw_auth: ${document.cookie.includes('dw_auth') ? '存在' : '不存在'}
          - 第三方脚本: ${Array.from(document.scripts).filter(s => s.src.includes('auth') || s.src.includes('google') || s.src.includes('github')).length}个
        `
        setDebugInfo(debug)
        console.log('Digital Wardrobe 调试信息:', debug)
        
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
          // 设置认证cookie
          document.cookie = `dw_auth=1; path=/; max-age=86400; secure; samesite=lax`
          router.push('/wardrobe')
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
        
        setIsCheckingAuth(false)
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsCheckingAuth(false)
      }
    }
    
    checkAuthStatus()
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
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 调试信息 - 生产环境可以隐藏 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 left-4 z-50 bg-black/80 text-white p-4 rounded-lg text-xs max-w-md">
          <h3 className="font-bold mb-2">调试信息:</h3>
          <pre className="whitespace-pre-wrap">{debugInfo}</pre>
        </div>
      )}
      
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
                        Know your daily outfit cost
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
                        Upload your wardrobe
                      </span>
                      <span 
                        className="text-white font-black"
                        style={{ 
                          textShadow: "-0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0.5px 0.5px 0 #000"
                        }}
                      >
                        →Build your personal closet
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
                        Track cost-per-wear so you know what's worth keeping
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
                        Get your first free analysis in less than a minute
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
