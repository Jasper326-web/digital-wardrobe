"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const sp = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // 幂等：保底兑换 code 为 session（若 URL 参数不满足，SDK 内部会忽略）
        await supabase.auth.exchangeCodeForSession(window.location.href).catch(() => {})

        // 读取 loginToken 并向频道广播
        const loginToken = sp.get('loginToken')
        if (loginToken) {
          const channel = supabase.channel(`login:${loginToken}`, { config: { broadcast: { ack: true } } })
          await channel.subscribe()
          await channel.send({ type: 'broadcast', event: 'logged_in', payload: { ts: Date.now() } }).catch(() => {})
          supabase.removeChannel(channel)
        }

        // 正常获取会话并跳转
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          document.cookie = `dw_auth=1; path=/; max-age=86400; secure; samesite=lax`
          router.replace('/wardrobe')
        } else {
          router.replace('/')
        }
      } catch (error) {
        router.replace('/')
      }
    }

    handleAuthCallback()
  }, [router, sp])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing login...</p>
      </div>
    </div>
  )
}
