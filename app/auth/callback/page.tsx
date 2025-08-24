"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('=== AUTH CALLBACK DEBUG START ===')
        console.log('Current URL:', window.location.href)
        console.log('Search params:', window.location.search)
        
        // 处理URL中的认证参数
        const urlParams = new URLSearchParams(window.location.search)
        const accessToken = urlParams.get('access_token')
        const refreshToken = urlParams.get('refresh_token')
        const tokenHash = urlParams.get('token_hash')
        const type = urlParams.get('type')
        const error = urlParams.get('error')
        const errorDescription = urlParams.get('error_description')
        
        console.log('=== URL PARAMS ===')
        console.log('accessToken:', accessToken ? 'EXISTS' : 'NOT FOUND')
        console.log('refreshToken:', refreshToken ? 'EXISTS' : 'NOT FOUND')
        console.log('tokenHash:', tokenHash ? 'EXISTS' : 'NOT FOUND')
        console.log('type:', type)
        console.log('error:', error)
        console.log('errorDescription:', errorDescription)
        
        if (error) {
          console.error('Auth error from URL:', error, errorDescription)
          router.push('/')
          return
        }
        
        // 处理Magic Link的token_hash
        if (tokenHash && type === 'email') {
          console.log('=== PROCESSING MAGIC LINK ===')
          console.log('Verifying OTP with token_hash:', tokenHash)
          
          const { data, error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'email'
          })
          
          if (verifyError) {
            console.error('OTP verification error:', verifyError)
            router.push('/')
            return
          }
          
          console.log('OTP verification successful:', data)
        }
        
        // 如果有token，设置session
        if (accessToken && refreshToken) {
          console.log('=== SETTING SESSION FROM TOKENS ===')
          const { data, error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })
          
          if (setSessionError) {
            console.error('Set session error:', setSessionError)
            router.push('/')
            return
          }
          
          console.log('Session set successfully:', data)
        }
        
        // 获取当前session
        console.log('=== GETTING CURRENT SESSION ===')
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          router.push('/')
          return
        }

        console.log('Session data:', { 
          hasSession: !!session, 
          userEmail: session?.user?.email,
          userId: session?.user?.id
        })

        if (session) {
          console.log('=== USER AUTHENTICATED ===')
          console.log('Setting dw_auth cookie...')
          
          // 设置我们的认证cookie
          document.cookie = `dw_auth=1; path=/; max-age=86400; secure; samesite=lax`
          
          // 等待一下确保cookie设置完成
          await new Promise(resolve => setTimeout(resolve, 100))
          
          console.log('Redirecting to /wardrobe...')
          // 重定向到wardrobe页面
          router.push('/wardrobe')
        } else {
          console.log('=== NO SESSION FOUND ===')
          console.log('Redirecting to home...')
          // 没有session，重定向到首页
          router.push('/')
        }
        
        console.log('=== AUTH CALLBACK DEBUG END ===')
      } catch (error) {
        console.error('=== AUTH CALLBACK ERROR ===')
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
        <p className="text-gray-600">Processing login...</p>
        <p className="text-gray-400 text-sm mt-2">Check browser console for debug info</p>
      </div>
    </div>
  )
}
