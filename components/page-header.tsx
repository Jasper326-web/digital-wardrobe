"use client"

import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description: string
  icon?: string
  className?: string
}

export function PageHeader({ title, description, icon, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-8 mt-16", className)}>
      {/* 玻璃态背景容器 */}
      <div className="relative group hover:scale-[1.02] transition-transform duration-300">
        {/* 背景模糊效果 */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl group-hover:shadow-3xl transition-shadow duration-300"></div>
        
        {/* 渐变边框效果 */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400/20 via-blue-400/20 to-purple-400/20 p-[1px] group-hover:from-emerald-400/30 group-hover:via-blue-400/30 group-hover:to-purple-400/30 transition-all duration-300">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400/10 via-blue-400/10 to-purple-400/10 group-hover:from-emerald-400/20 group-hover:via-blue-400/20 group-hover:to-purple-400/20 transition-all duration-300"></div>
        </div>
        
        {/* 内容 */}
        <div className="relative p-6 text-center">
          {/* 图标 */}
          {icon && (
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{icon}</span>
            </div>
          )}
          
          {/* 标题 */}
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white via-emerald-50 to-white bg-clip-text text-transparent group-hover:from-emerald-100 group-hover:via-white group-hover:to-emerald-100 transition-all duration-300">
            {title}
          </h1>
          
          {/* 描述 */}
          <p className="text-lg text-white/90 font-medium leading-relaxed max-w-2xl mx-auto group-hover:text-white transition-colors duration-300">
            {description}
          </p>
          
          {/* 装饰性元素 */}
          <div className="flex justify-center mt-4 space-x-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse group-hover:bg-emerald-300 transition-colors duration-300"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse group-hover:bg-blue-300 transition-colors duration-300" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse group-hover:bg-purple-300 transition-colors duration-300" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
