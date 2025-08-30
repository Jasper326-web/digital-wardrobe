"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { UserAvatar } from "./user-avatar"
import { supabase } from "@/lib/supabase"
import { LanguageSwitcher } from "./language-switcher"
import { CurrencySwitcher } from "./currency-switcher"
import { useLanguage } from "@/lib/lang-context"

const navItems = [
  { href: "/wardrobe", labelKey: "nav.wardrobe" },
  { href: "/outfit", labelKey: "nav.outfit" },
  { href: "/analytics", labelKey: "nav.analytics" },
]

interface NavigationProps {
  onProtectedLinkClick?: () => void
}

export function Navigation({ onProtectedLinkClick }: NavigationProps) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/"
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    setIsClient(true)
    
    // 检查认证状态
    const checkAuthStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Navigation: Auth session:', !!session, session?.user?.email)
        
        // 检查是否有认证cookie，确保用户真正登录了
        const hasAuthCookie = document.cookie.includes('dw_auth')
        setIsLoggedIn(!!session && hasAuthCookie)
      } catch (error) {
        console.error('Error checking auth status:', error)
        // 如果Supabase检查失败，回退到cookie检查
        const hasAuthCookie = document.cookie.includes('dw_auth')
        console.log('Navigation: Fallback to cookie check:', hasAuthCookie)
        setIsLoggedIn(hasAuthCookie)
      }
    }

    checkAuthStatus()

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Navigation: Auth state changed:', event, !!session, session?.user?.email)
        
        // 只有在登录事件时才设置登录状态
        if (event === 'SIGNED_IN' && session) {
          const hasAuthCookie = document.cookie.includes('dw_auth')
          setIsLoggedIn(hasAuthCookie)
        } else if (event === 'SIGNED_OUT') {
          setIsLoggedIn(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (isLoginPage && href !== "/") {
      e.preventDefault()
      onProtectedLinkClick?.()
    }
  }

  // 在客户端渲染之前，使用默认值避免水合错误
  const logoHref = isClient ? (isLoggedIn ? "/wardrobe" : "/") : "/"

  return (
    <nav className="absolute top-0 left-0 right-0 z-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={logoHref} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">DW</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Digital Wardrobe
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 text-gray-900 hover:text-emerald-600 hover:bg-gray-100/50",
                    pathname === item.href
                      ? "bg-gray-100/50 text-emerald-600"
                      : "text-gray-900/90 hover:text-emerald-600",
                  )}
                >
                  {t(item.labelKey)}
                </Link>
              ))}
            </div>
          </div>

          {/* User Avatar, Language Switcher and Mobile menu */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <LanguageSwitcher />
            {/* Currency Switcher */}
            <CurrencySwitcher />
            
            {/* User Avatar */}
            {isLoggedIn && <UserAvatar />}
            
            {/* Force Logout Link (for debugging) */}
            {isLoggedIn && (
              <Link
                href="/logout"
                className="px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 text-red-600 hover:text-red-700 hover:bg-red-50/50"
                title="强制登出（清除所有认证状态）"
              >
                强制登出
              </Link>
            )}
            
            {/* Mobile menu */}
            <div className="md:hidden">
              <div className="flex items-center space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className={cn(
                      "px-2 py-1 rounded text-xs font-medium transition-all duration-200 text-gray-900 hover:text-emerald-600 hover:bg-gray-100/50",
                      pathname === item.href
                        ? "bg-gray-100/50 text-emerald-600"
                        : "text-gray-900/90 hover:text-emerald-600",
                    )}
                  >
                    {t(item.labelKey)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
