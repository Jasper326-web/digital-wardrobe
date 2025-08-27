"use client"

import type React from "react"

import { useState, useEffect, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import { useLanguage } from "@/lib/lang-context"
import { useRouter } from 'next/navigation'
import { useRemoteLoginWatcher } from '@/hooks/use-remote-login-watcher'

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [isEmailLoading, setIsEmailLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isClient, setIsClient] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const { t } = useLanguage()
  const router = useRouter()

  // 方案B兜底：挂载跨设备轮询/焦点刷新
  useRemoteLoginWatcher({ redirectTo: '/wardrobe' })

  // 方案A：一次性 token，用于跨设备 Realtime 通知
  const loginToken = useMemo(() => {
    try {
      // 浏览器原生 uuid
      // @ts-ignore
      if (typeof crypto !== 'undefined' && crypto?.randomUUID) return crypto.randomUUID()
    } catch {}
    // 退化：简易随机串
    return Math.random().toString(36).slice(2) + Date.now().toString(36)
  }, [])
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  useEffect(() => {
    setIsClient(true)

    // 订阅一次性频道，等待手机端回调广播
    const channel = supabase
      .channel(`login:${loginToken}`, { config: { broadcast: { ack: true } } })
      .on('broadcast', { event: 'logged_in' }, async () => {
        // 收到广播，刷新本地 session 并跳转
        await supabase.auth.getSession()
        const { data: { session } } = await supabase.auth.getSession()
        if (session) router.replace('/wardrobe')
      })
      .subscribe()

    channelRef.current = channel
    return () => { if (channel) supabase.removeChannel(channel) }
  }, [loginToken, router])

  // 倒计时效果
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // 检查URL参数中的错误信息
  useEffect(() => {
    if (!isClient) return
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get('error')
    if (error === 'link_expired') setErrorMessage('The login link has expired. Please try logging in again.')
  }, [isClient])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsEmailLoading(true)
    setErrorMessage("")
    try {
      const redirectUrl = new URL(`${window.location.origin}/auth/callback`)
      redirectUrl.searchParams.set('loginToken', loginToken)

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectUrl.toString() },
      })

      if (error) {
        if (error.message.includes('55 seconds') || error.message.includes('rate limit')) {
          setErrorMessage('Too many requests. Please wait about 1 minute before trying again.')
          setCountdown(60)
        } else if (error.message.includes('Invalid email')) {
          setErrorMessage('Please enter a valid email address.')
        } else {
          setErrorMessage('Failed to send login email. Please try again.')
        }
      } else {
        // 可选：提示已发送邮件
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.')
    } finally {
      setIsEmailLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    setErrorMessage("")
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) setErrorMessage('Failed to start Google login. Please try again.')
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.')
    } finally {
      setIsGoogleLoading(false)
    }
  }

  if (!isClient) {
    return (
      <div className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
        <div className="animate-pulse">
          <div className="h-12 bg-white/20 rounded-2xl mb-4"></div>
          <div className="h-12 bg-white/20 rounded-2xl mb-4"></div>
          <div className="h-12 bg-white/20 rounded-2xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="absolute -top-3 -right-3 bg-emerald-400 text-black px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transform rotate-3 shadow-lg z-10 whitespace-nowrap">
        ✨ {t('home.freeAnalysis')}
      </div>

      <Card className="w-full max-w-sm sm:max-w-md min-w-[320px] p-6 sm:p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10 rounded-3xl"></div>
        {/* Content wrapper */}
        <div className="relative z-10">
          {errorMessage && (
            <Alert className="mb-4 bg-red-50 border-red-200">
              <AlertDescription className="text-red-800 text-sm">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 mb-6">
            <Input
              type="email"
              placeholder={t('login.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 sm:h-14 text-sm sm:text-base bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-orange-400 transition-all duration-300"
              required
              disabled={isEmailLoading || countdown > 0}
            />

            <Button
              type="submit"
              className="w-full h-12 sm:h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed min-w-0"
              disabled={isEmailLoading || countdown > 0}
            >
              <span className="truncate">
                {isEmailLoading ? t('login.checking') : 
                 countdown > 0 ? `Wait ${countdown}s before trying again` : 
                 t('login.continue')}
              </span>
            </Button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/30"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-black font-medium">{t('login.or')}</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            className="w-full h-12 sm:h-14 bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-900 font-semibold rounded-2xl hover:bg-white transition-all duration-300 transform hover:scale-[1.02] shadow-lg min-w-0"
            disabled={isGoogleLoading}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="truncate">
              {isGoogleLoading ? t('login.processing') : t('login.google')}
            </span>
          </Button>

          <p className="text-xs text-gray-600 mt-4 text-center">
            {t('login.waitMessage')}
          </p>
        </div>
      </Card>
    </div>
  )
}
