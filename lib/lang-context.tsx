'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

// 语言类型定义
type Language = 'zh' | 'en'

// 翻译内容
const translations = {
  zh: {
    // 导航
    'nav.home': '首页',
    'nav.wardrobe': '衣柜',
    'nav.outfit': '搭配',
    'nav.analytics': '分析',
    'nav.login': '登录',
    'nav.logout': '退出',
    'nav.profile': '个人资料',
    
    // 登录表单
    'login.title': '登录到数字衣柜',
    'login.email': '邮箱',
    'login.password': '密码',
    'login.submit': '登录',
    'login.google': '使用 Google 登录',
    'login.or': '或',
    'login.noAccount': '还没有账户？',
    'login.signup': '注册',
    
    // 衣柜页面
    'wardrobe.title': '我的衣柜',
    'wardrobe.addItem': '添加衣物',
    'wardrobe.category': '分类',
    'wardrobe.color': '颜色',
    'wardrobe.brand': '品牌',
    'wardrobe.size': '尺码',
    'wardrobe.price': '价格',
    'wardrobe.originalPrice': '原价',
    'wardrobe.description': '描述',
    'wardrobe.save': '保存',
    'wardrobe.cancel': '取消',
    'wardrobe.delete': '删除',
    'wardrobe.edit': '编辑',
    'wardrobe.confirmDelete': '确认删除',
    'wardrobe.deleteMessage': '确定要删除这件衣物吗？此操作无法撤销。',
    
    // 搭配页面
    'outfit.title': '搭配推荐',
    'outfit.create': '创建搭配',
    'outfit.selectItems': '选择衣物',
    'outfit.generate': '生成搭配',
    'outfit.save': '保存搭配',
    'outfit.delete': '删除搭配',
    
    // 分析页面
    'analytics.title': '数据分析',
    'analytics.totalItems': '总衣物数',
    'analytics.totalOutfits': '总搭配数',
    'analytics.totalValue': '总价值',
    'analytics.categoryBreakdown': '分类统计',
    'analytics.colorBreakdown': '颜色统计',
    'analytics.brandBreakdown': '品牌统计',
    
    // 通用
    'common.loading': '加载中...',
    'common.error': '出错了',
    'common.success': '成功',
    'common.confirm': '确认',
    'common.cancel': '取消',
    'common.close': '关闭',
    'common.save': '保存',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.add': '添加',
    'common.search': '搜索',
    'common.filter': '筛选',
    'common.sort': '排序',
    'common.refresh': '刷新',
    
    // 语言切换
    'language.zh': '中文',
    'language.en': 'English',
    'language.switch': '切换语言',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.wardrobe': 'Wardrobe',
    'nav.outfit': 'Outfit',
    'nav.analytics': 'Analytics',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.profile': 'Profile',
    
    // Login form
    'login.title': 'Login to Digital Wardrobe',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.submit': 'Login',
    'login.google': 'Login with Google',
    'login.or': 'or',
    'login.noAccount': "Don't have an account?",
    'login.signup': 'Sign up',
    
    // Wardrobe page
    'wardrobe.title': 'My Wardrobe',
    'wardrobe.addItem': 'Add Item',
    'wardrobe.category': 'Category',
    'wardrobe.color': 'Color',
    'wardrobe.brand': 'Brand',
    'wardrobe.size': 'Size',
    'wardrobe.price': 'Price',
    'wardrobe.originalPrice': 'Original Price',
    'wardrobe.description': 'Description',
    'wardrobe.save': 'Save',
    'wardrobe.cancel': 'Cancel',
    'wardrobe.delete': 'Delete',
    'wardrobe.edit': 'Edit',
    'wardrobe.confirmDelete': 'Confirm Delete',
    'wardrobe.deleteMessage': 'Are you sure you want to delete this item? This action cannot be undone.',
    
    // Outfit page
    'outfit.title': 'Outfit Recommendations',
    'outfit.create': 'Create Outfit',
    'outfit.selectItems': 'Select Items',
    'outfit.generate': 'Generate Outfit',
    'outfit.save': 'Save Outfit',
    'outfit.delete': 'Delete Outfit',
    
    // Analytics page
    'analytics.title': 'Data Analytics',
    'analytics.totalItems': 'Total Items',
    'analytics.totalOutfits': 'Total Outfits',
    'analytics.totalValue': 'Total Value',
    'analytics.categoryBreakdown': 'Category Breakdown',
    'analytics.colorBreakdown': 'Color Breakdown',
    'analytics.brandBreakdown': 'Brand Breakdown',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.confirm': 'Confirm',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.refresh': 'Refresh',
    
    // Language switch
    'language.zh': '中文',
    'language.en': 'English',
    'language.switch': 'Switch Language',
  }
}

// 语言上下文类型
interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

// 创建语言上下文
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// 语言提供者组件
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh') // 默认中文

  // 从本地存储加载语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
      setLanguage(savedLanguage)
    }
  }, [])

  // 保存语言设置到本地存储
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  // 翻译函数
  const t = (key: string): string => {
    const currentTranslations = translations[language]
    return currentTranslations[key as keyof typeof currentTranslations] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// 使用语言上下文的 Hook
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
