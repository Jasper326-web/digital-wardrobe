'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function CallbackClient() {
  const router = useRouter()
  const sp = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        await supabase.auth.exchangeCodeForSession(window.location.href).catch(() => {})

        const loginToken = sp.get('loginToken')
        const confirmOnly = sp.get('confirmOnly') === '1'
        if (loginToken) {
          const channel = supabase.channel(`login:${loginToken}`, { config: { broadcast: { ack: true } } })
          await channel.subscribe()
          await channel.send({ type: 'broadcast', event: 'logged_in', payload: { ts: Date.now() } }).catch(() => {})
          supabase.removeChannel(channel)
        }

        const { data: { session } } = await supabase.auth.getSession()
        if (confirmOnly) {
          // 确认模式：广播后立即登出，并跳到确认页
          if (session) {
            await supabase.auth.signOut().catch(() => {})
          }
          router.replace('/auth/confirmed')
        } else if (session) {
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

  return null
}
