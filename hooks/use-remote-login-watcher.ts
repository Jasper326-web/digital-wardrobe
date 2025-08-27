'use client'

import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export function useRemoteLoginWatcher({
  redirectTo = '/wardrobe',
  pollMs = 3000,
  maxMs = 3 * 60 * 1000,
}: { redirectTo?: string; pollMs?: number; maxMs?: number } = {}) {
  const router = useRouter()
  const timerRef = useRef<number | null>(null)
  const endAtRef = useRef<number>(Date.now() + maxMs)

  useEffect(() => {
    let cancelled = false

    const check = async () => {
      if (cancelled) return
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace(redirectTo)
        stop()
      }
    }

    const onFocusOrVisible = () => {
      if (document.visibilityState === 'visible') check()
    }

    const start = () => {
      stop()
      check() // 立即检查一次
      timerRef.current = window.setInterval(() => {
        if (Date.now() > endAtRef.current) { stop(); return }
        check()
      }, pollMs)
    }

    const stop = () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
      timerRef.current = null
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) {
        router.replace(redirectTo)
        stop()
      }
    })

    window.addEventListener('visibilitychange', onFocusOrVisible)
    window.addEventListener('focus', onFocusOrVisible)

    start()

    return () => {
      cancelled = true
      stop()
      window.removeEventListener('visibilitychange', onFocusOrVisible)
      window.removeEventListener('focus', onFocusOrVisible)
      subscription.unsubscribe()
    }
  }, [pollMs, maxMs, redirectTo, router])
}
