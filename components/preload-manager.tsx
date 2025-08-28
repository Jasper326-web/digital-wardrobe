"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface PreloadManagerProps {
  children: React.ReactNode
}

export function PreloadManager({ children }: PreloadManagerProps) {
  const router = useRouter()

  useEffect(() => {
    // 预加载关键页面
    const preloadPages = () => {
      // 预加载衣柜页面
      router.prefetch('/wardrobe')
      // 预加载搭配页面
      router.prefetch('/outfit')
      // 预加载分析页面
      router.prefetch('/analytics')
    }

    // 延迟预加载，避免阻塞初始渲染
    const timer = setTimeout(preloadPages, 1000)

    return () => clearTimeout(timer)
  }, [router])

  return <>{children}</>
}
