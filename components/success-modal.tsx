"use client"

import { useEffect, useState } from "react"
import { CheckCircle, TrendingUp, Sparkles } from "lucide-react"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  itemCount: number
  totalCost: string
}

export function SuccessModal({ isOpen, onClose, itemCount, totalCost }: SuccessModalProps) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowContent(true)
    } else {
      setShowContent(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 弹窗内容 */}
      <div className={`
        relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4
        transform transition-all duration-500 ease-out
        ${showContent ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
      `}>
        {/* 装饰性背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-t-2xl" />
        
        {/* 内容 */}
        <div className="relative z-10 text-center">
          {/* 成功图标 */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-emerald-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </div>

          {/* 标题 */}
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Outfit Confirmed! 🎉
          </h3>

          {/* 描述 */}
          <p className="text-gray-600 mb-6">
            Your daily outfit has been saved successfully!
          </p>

          {/* 统计信息 */}
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-4 mb-6 border border-emerald-200">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-600">{itemCount}</div>
                <div className="text-sm text-gray-600">Items Updated</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">${totalCost}</div>
                <div className="text-sm text-gray-600">Today's Cost</div>
              </div>
            </div>
          </div>

          {/* 成功消息 */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-emerald-800 font-medium">
              ✓ Usage counts increased by 1 for all selected items
            </p>
          </div>

          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  )
}
