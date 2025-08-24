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
        
        // Handle both search params (?) and fragment (#) for different auth flows
        const searchParams = new URLSearchParams(window.location.search)
        const fragmentParams = new URLSearchParams(window.location.hash.substring(1))
        
        console.log('Search params:', searchParams.toString())
        console.log('Fragment params:', fragmentParams.toString())
        
        // Check for Magic Link parameters in fragment
        const accessToken = fragmentParams.get('access_token')
        const refreshToken = fragmentParams.get('refresh_token')
        const tokenHash = searchParams.get('token_hash') || fragmentParams.get('token_hash')
        const type = searchParams.get('type') || fragmentParams.get('type')
        const error = searchParams.get('error') || fragmentParams.get('error')
        const errorDescription = searchParams.get('error_description') || fragmentParams.get('error_description')
        
        console.log('=== URL PARAMS ===')
        console.log('accessToken:', accessToken ? 'FOUND' : 'NOT FOUND')
        console.log('refreshToken:', refreshToken ? 'FOUND' : 'NOT FOUND')
        console.log('tokenHash:', tokenHash ? 'FOUND' : 'NOT FOUND')
        console.log('type:', type)
        console.log('error:', error)
        console.log('errorDescription:', errorDescription)
        
        // Handle errors
        if (error) {
          console.error('Auth error from URL:', error, errorDescription)
          router.push('/')
          return
        }
        
        // Handle Magic Link verification
        if (tokenHash && type === 'email') {
          console.log('=== VERIFYING MAGIC LINK ===')
          const { data, error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'email'
          })
          
          if (verifyError) {
            console.error('Magic Link verification error:', verifyError)
            router.push('/')
            return
          }
          
          console.log('Magic Link verification successful:', data)
        }
        
        // Handle direct access token (from fragment)
        if (accessToken && refreshToken) {
          console.log('=== SETTING SESSION FROM TOKENS ===')
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })
          
          if (sessionError) {
            console.error('Session setting error:', sessionError)
            router.push('/')
            return
          }
          
          console.log('Session set successfully:', data)
        }
        
        console.log('=== GETTING CURRENT SESSION ===')
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Auth callback error:', sessionError)
          router.push('/')
          return
        }
        
        console.log('Session data:', sessionData)
        
        if (sessionData.session) {
          console.log('=== USER AUTHENTICATED ===')
          console.log('User authenticated:', sessionData.session.user.email)
          document.cookie = `dw_auth=1; path=/; max-age=86400; secure; samesite=lax`
          console.log('Setting dw_auth cookie...')
          await new Promise(resolve => setTimeout(resolve, 100))
          console.log('Redirecting to /wardrobe...')
          router.push('/wardrobe')
        } else {
          console.log('No session found, redirecting to home')
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
        <p className="text-gray-600">Processing login...</p>
        <p className="text-xs text-gray-400 mt-2">Check browser console for debug info</p>
      </div>
    </div>
  )
}
