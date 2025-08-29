"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import { useLanguage } from "@/lib/lang-context"
import { useRouter } from 'next/navigation'
import { cache } from "@/lib/cache"
import { trackEvent } from "@/lib/analytics"
// Removed remote login watcher (Magic Link flow)

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [infoMessage, setInfoMessage] = useState("")
  const [isResending, setIsResending] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  // 检查URL参数中的错误信息（保留）
  useEffect(() => {
    if (!isClient) return
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get('error')
    if (error === 'link_expired') setErrorMessage('The login link has expired. Please try logging in again.')
  }, [isClient])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")
    setInfoMessage("")
    try {
      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) {
          if (error.message.toLowerCase().includes('user already registered') || error.message.toLowerCase().includes('already')) {
            setErrorMessage('Email already in use. Try logging in.')
          } else if (error.message.toLowerCase().includes('password')) {
            setErrorMessage('Password does not meet requirements.')
          } else {
            setErrorMessage('Failed to sign up. Please try again.')
          }
        } else {
          // 若项目未开启 email 确认，这里会直接有 session；否则需要验证邮箱
          const session = data.session
          if (session) {
            // 清除所有缓存，确保新用户看到正确的数据
            cache.clear()
            // 设置认证cookie
            document.cookie = `dw_auth=1; path=/; max-age=86400; secure; samesite=lax`
            // 立即跳转，减少延迟
            trackEvent('signup_success', { method: 'password' })
            router.replace('/wardrobe')
          } else {
            setInfoMessage('Registration successful. Check your email to verify your account.')
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          const msg = error.message.toLowerCase()
          if (msg.includes('email not confirmed') || msg.includes('email not confirmed')) {
            setErrorMessage('Email not confirmed. Please verify your inbox, or resend the verification email below.')
          } else if (msg.includes('invalid login credentials')) {
            setErrorMessage('Invalid email or password.')
          } else {
            setErrorMessage('Failed to log in. Please try again.')
          }
        } else {
          if (data.session) {
            // 清除所有缓存，确保新用户看到正确的数据
            cache.clear()
            // 设置认证cookie
            document.cookie = `dw_auth=1; path=/; max-age=86400; secure; samesite=lax`
            // 快速跳转，只保留最小延迟
            trackEvent('login_success', { method: 'password' })
            setTimeout(() => {
              router.replace('/wardrobe')
            }, 50)
          }
        }
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
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
              disabled={isSubmitting}
            />

            <Input
              type="password"
              placeholder={t('login.password') || 'Password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 sm:h-14 text-sm sm:text-base bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-orange-400 transition-all duration-300"
              required
              disabled={isSubmitting}
            />

            <Button
              type="submit"
              className="w-full h-12 sm:h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed min-w-0"
              disabled={isSubmitting}
            >
              <span className="truncate">
                {isSubmitting ? (authMode === 'signup' ? (t('login.processing') || 'Creating account...') : (t('login.checking') || 'Signing in...')) : (authMode === 'signup' ? (t('login.signup') || 'Sign up') : (t('login.continue') || 'Sign in'))}
              </span>
            </Button>
          </form>

          {infoMessage && (
            <Alert className="mb-4 bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-800 text-sm">
                {infoMessage}
              </AlertDescription>
            </Alert>
          )}

          {errorMessage.toLowerCase().includes('email not confirmed') && (
            <div className="mb-4">
              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  try {
                    setIsResending(true)
                    setInfoMessage("")
                    const { error } = await supabase.auth.resend({ type: 'signup', email })
                    if (error) {
                      setErrorMessage('Failed to resend verification email. Please try again later.')
                    } else {
                      setInfoMessage('Verification email sent. Please check your inbox.')
                    }
                  } finally {
                    setIsResending(false)
                  }
                }}
                className="w-full"
                disabled={isResending}
              >
                {isResending ? (t('login.processing') || 'Resending...') : 'Resend verification email'}
              </Button>
            </div>
          )}

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/30"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-black font-medium">{t('login.or')}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              className="text-sm text-gray-700 hover:text-gray-900 underline"
            >
              {authMode === 'login' ? (t('login.toSignup') || 'No account? Create one') : (t('login.toLogin') || 'Have an account? Sign in')}
            </button>
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
