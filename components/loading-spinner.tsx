"use client"

import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/lang-context"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  text?: string
  subtext?: string
  className?: string
}

export function LoadingSpinner({ 
  size = "md", 
  text,
  subtext,
  className 
}: LoadingSpinnerProps) {
  const { t } = useLanguage()
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12", 
    lg: "h-16 w-16"
  }

  const textSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl"
  }

  return (
    <div className={cn("flex justify-center items-center py-12", className)}>
      <div className="text-center">
        {/* 统一的单圈加载动画 */}
        <div className={cn(
          "animate-spin rounded-full border-4 border-white/20 border-t-emerald-400 mx-auto mb-6",
          sizeClasses[size]
        )}></div>
        
        {/* 加载文字 */}
        <div className={cn("text-white font-semibold mb-2", textSizes[size])}>
          {text ?? t('common.loading')}
        </div>
        
        {/* 副标题 */}
        {subtext && (
          <div className="text-white/70 text-sm">
            {subtext}
          </div>
        )}
        
        {/* 装饰性圆点 */}
        <div className="flex justify-center mt-4 space-x-1">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  )
}
