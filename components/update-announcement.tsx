"use client"

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/lang-context'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface UpdateItem {
  id: string
  date: string
  title: string
  content: string
  type: 'feature' | 'fix' | 'improvement' | 'announcement'
}

// 更新内容配置
export const updates: UpdateItem[] = [
  {
    id: '1',
    date: '2024-12-19',
    title: '🎉 新功能上线：塔罗牌星座穿搭推荐',
    content: '结合塔罗牌和星座，为您推荐今日最佳穿搭！快来体验神秘的穿搭指引吧～',
    type: 'feature'
  },
  {
    id: '2',
    date: '2024-12-19',
    title: '🔧 修复登录跳转问题',
    content: '优化了注册和Google登录的跳转体验，现在应该更加流畅了！',
    type: 'fix'
  },
  {
    id: '3',
    date: '2024-12-18',
    title: '✨ 新增滚动更新说明',
    content: '在这里您可以看到最新的功能更新和改进，让我们一起共建更好的数字衣柜！',
    type: 'improvement'
  }
]

export function UpdateAnnouncement() {
  const { t } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [externalUpdates, setExternalUpdates] = useState<UpdateItem[] | null>(null)

  // 自动轮播
  useEffect(() => {
    if (isPaused || !isVisible) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % updates.length)
    }, 5000) // 5秒切换一次

    return () => clearInterval(timer)
  }, [isPaused, isVisible])

  // 读取外部更新 JSON（如存在则覆盖本地）
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/updates.json', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (Array.isArray(data) && data.length) {
          setExternalUpdates(data)
        }
      } catch {}
    }
    load()
  }, [])

  // 从本地存储检查是否已关闭
  useEffect(() => {
    const dismissed = localStorage.getItem('update_announcement_dismissed')
    if (dismissed === 'true') {
      setIsVisible(false)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('update_announcement_dismissed', 'true')
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + updates.length) % updates.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % updates.length)
  }

  if (!isVisible) return null

  const data = externalUpdates && externalUpdates.length ? externalUpdates : updates
  const currentUpdate = data[currentIndex % data.length]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'feature':
        return 'bg-emerald-500'
      case 'fix':
        return 'bg-blue-500'
      case 'improvement':
        return 'bg-purple-500'
      case 'announcement':
        return 'bg-orange-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="relative bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* 左侧：更新内容 */}
          <div 
            className="flex-1 flex items-center space-x-4 cursor-pointer"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* 类型标识 */}
            <div className={`w-2 h-2 rounded-full ${getTypeColor(currentUpdate.type)}`}></div>
            
            {/* 更新内容 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-emerald-800 truncate">
                  {currentUpdate.title}
                </span>
                <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                  {currentUpdate.date}
                </span>
              </div>
              <p className="text-xs text-emerald-700 mt-1 truncate">
                {currentUpdate.content}
              </p>
            </div>
          </div>

          {/* 右侧：控制按钮 */}
          <div className="flex items-center space-x-2 ml-4">
            {/* 导航按钮 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {/* 指示器 */}
            <div className="flex space-x-1">
              {data.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-emerald-600' : 'bg-emerald-300'
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNext}
              className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* 关闭按钮 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
