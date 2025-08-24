"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [isEmailLoading, setIsEmailLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // 检查URL参数中的错误信息
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get('error')
    
    if (error === 'link_expired') {
      setErrorMessage('The login link has expired. Please try logging in again.')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsEmailLoading(true)
    setErrorMessage("")
    
    try {
      console.log("Login with email:", email)
      // 使用Supabase邮箱登录
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        console.error('Email login error:', error)
        setErrorMessage('Failed to send login email. Please try again.')
      } else {
        alert('Please check your email and click the login link to complete your login!')
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrorMessage('An unexpected error occurred. Please try again.')
    } finally {
      setIsEmailLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    setErrorMessage("")
    
    try {
      console.log("Login with Google")
      // 使用Supabase Google认证
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        console.error('Google login error:', error)
        setErrorMessage('Failed to start Google login. Please try again.')
      }
      // 如果成功，用户会被重定向到Google登录页面
    } catch (error) {
      console.error('Google login error:', error)
      setErrorMessage('An unexpected error occurred. Please try again.')
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="relative">
      <div className="absolute -top-3 -right-3 bg-emerald-400 text-black px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transform rotate-3 shadow-lg z-10 whitespace-nowrap">
        ✨ Get your first free analysis in less than a minute
      </div>

      <Card className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl relative overflow-hidden">
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
              placeholder="Type your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 sm:h-14 text-sm sm:text-base bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-orange-400 transition-all duration-300"
              required
              disabled={isEmailLoading}
            />

            <Button
              type="submit"
              className="w-full h-12 sm:h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
              disabled={isEmailLoading}
            >
              {isEmailLoading ? "Processing..." : "Start building your closet now →"}
            </Button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/30"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-white/70 font-medium">or</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            className="w-full h-12 sm:h-14 bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-900 font-semibold rounded-2xl hover:bg-white transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? "Processing..." : "Continue with Google"}
          </Button>

          <p className="text-xs text-gray-600 mt-4 text-center">
            If you already have an account, we'll log you in
          </p>
        </div>
      </Card>
    </div>
  )
}
