'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

// 语言类型定义
type Language = 'zh' | 'en'

// 翻译内容
const translations = {
  zh: {
    // 首页
    'home.title': '了解你的每日穿搭成本',
    'home.uploadWardrobe': '上传你的衣柜',
    'home.buildCloset': '→ 建立你的个人衣橱',
    'home.trackCost': '追踪每次穿着成本，了解什么值得保留',
    'home.freeAnalysis': '在一分钟内获得你的首次免费分析',
    'home.loading': '检查认证状态...',
    
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
    'login.toSignup': '没有账号？去注册',
    'login.toLogin': '已有账号？去登录',
    'login.continue': '继续到你的衣柜 →',
    'login.checking': '检查认证状态...',
    'login.processing': '处理中...',
    'login.waitMessage': '如果已有账户，我们会为你登录',
    
    // 衣柜页面
    'wardrobe.title': '我的衣柜',
    'wardrobe.subtitle': '管理你的衣物并追踪使用情况',
    'wardrobe.addItem': '添加衣物',
    'wardrobe.addTop': '添加上衣',
    'wardrobe.addPant': '添加裤子',
    'wardrobe.addShoe': '添加鞋子',
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
    'wardrobe.noTops': '还没有上衣',
    'wardrobe.noPants': '还没有裤子',
    'wardrobe.noShoes': '还没有鞋子',
    'wardrobe.startBuilding': '开始建立你的衣柜，添加你的第一件',
    'wardrobe.startBuildingTop': '开始建立你的衣柜，添加你的第一件上衣',
    'wardrobe.startBuildingPant': '开始建立你的衣柜，添加你的第一条裤子',
    'wardrobe.startBuildingShoe': '开始建立你的衣柜，添加你的第一双鞋子',
    'wardrobe.tops': '上衣',
    'wardrobe.pants': '裤子',
    'wardrobe.shoes': '鞋子',
    'wardrobe.wears': '次穿着',
    'wardrobe.costPerWear': '每次穿着成本',
    'wardrobe.totalUsedValue': '总使用价值',
    'wardrobe.remainingValue': '剩余价值',
    'wardrobe.tags': '标签',
    'wardrobe.addCustomTag': '添加自定义标签...',
    'wardrobe.commonTags': '常用标签',
    'wardrobe.saveChanges': '保存更改',
    'wardrobe.calculatedValues': '计算值',
    'wardrobe.tag.casual': '休闲',
    'wardrobe.tag.formal': '正式',
    'wardrobe.tag.work': '工作',
    'wardrobe.tag.summer': '夏季',
    'wardrobe.tag.winter': '冬季',
    'wardrobe.tag.sport': '运动',
    'wardrobe.tag.date': '约会',
    'wardrobe.tag.workout': '健身',
    'wardrobe.tag.versatile': '百搭',
    'wardrobe.tag.cozy': '舒适',
    'wardrobe.tag.smartCasual': '商务休闲',
    'wardrobe.tag.smart-casual': '商务休闲',
    'wardrobe.tag.comfort': '舒适',
    'wardrobe.tag.exercise': '运动',
    
    // 搭配页面
    'outfit.title': '今日搭配',
    'outfit.subtitle': '规划并追踪你的每日穿搭',
    'outfit.create': '创建搭配',
    'outfit.selectItems': '选择衣物',
    'outfit.generate': '生成搭配',
    'outfit.save': '保存搭配',
    'outfit.delete': '删除搭配',
    'outfit.tops': '上衣',
    'outfit.pants': '裤子',
    'outfit.shoes': '鞋子',
    'outfit.outfitSummary': '搭配总结',
    'outfit.itemsSelected': '件衣物已选择',
    'outfit.selectItemsFirst': '请先选择衣物',
    'outfit.selectTop': '选择上衣',
    'outfit.selectPants': '选择裤子',
    'outfit.selectShoes': '选择鞋子',
    'outfit.selected': '已选择',
    'outfit.wears': '次穿着',
    'outfit.todaysOutfit': '今日搭配',
    'outfit.totalWears': '总穿着次数',
    'outfit.todaysTotalCost': '今日总成本',
    'outfit.totalOriginalPrice': '总原价',
    'outfit.styleTags': '风格标签',
    'outfit.confirmUpdate': '确认并更新使用次数',
    
    // 成功弹窗
    'success.outfitConfirmed': '搭配确认！🎉',
    'success.outfitSaved': '您的每日搭配已成功保存！',
    'success.itemsUpdated': '已更新物品',
    'success.todaysCost': '今日成本',
    'success.usageCountsIncreased': '✓ 所有选中物品的使用次数已增加1',
    'success.gotIt': '知道了！',
    
    // 错误信息
    'error.updateFailed': '更新失败',
    'error.usageCountsNotUpdated': '使用次数无法更新',
    'error.confirmFailed': '确认失败',
    'error.tryAgain': '请重试',
    
    // 分析页面
    'analytics.title': '数据分析',
    'analytics.subtitle': '追踪你的衣柜使用情况和消费洞察',
    'analytics.totalItems': '总衣物数',
    'analytics.totalOutfits': '总搭配数',
    'analytics.totalValue': '总价值',
    'analytics.categoryBreakdown': '分类统计',
    'analytics.colorBreakdown': '颜色统计',
    'analytics.brandBreakdown': '品牌统计',
    'analytics.mostWornItem': '最常穿衣物',
    'analytics.bestValue': '最佳价值',
    'analytics.needsMoreWear': '需要多穿',
    'analytics.wardrobeSummary': '衣柜总结',
    'analytics.wears': '次穿着',
    'analytics.perWear': '每次穿着',
    'analytics.avgCostPerWear': '平均每次穿着成本',
    'analytics.totalItemsCount': '总衣物数',
    'analytics.remainingValue': '剩余价值',
    'analytics.consumedValue': '已消费价值',
    
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
    'common.upload': '上传',
    'common.camera': '相机',
    'common.itemName': '衣物名称',
    'common.originalPriceLabel': '原价',
    'common.usageCount': '使用次数',
    'common.selected': '已选择',
    'common.uploading': '上传中...',
    
    // 语言切换
    'language.zh': '中文',
    'language.en': 'English',
    'language.switch': '切换语言',
    
    // 货币切换
    'currency.switch': '币种',
    
    // 弹窗
    'modal.editItem': '编辑衣物',
    'modal.addNewItem': '新增衣物',
    
    // 连接提示
    'common.connecting': '正在连接数据库并获取数据...'
  },
  en: {
    // Home page
    'home.title': 'Know your daily outfit cost',
    'home.uploadWardrobe': 'Upload your wardrobe',
    'home.buildCloset': '→ Build your personal closet',
    'home.trackCost': 'Track cost-per-wear so you know what\'s worth keeping',
    'home.freeAnalysis': 'Get your first free analysis in less than a minute',
    'home.loading': 'Checking authentication...',
    
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
    'login.toSignup': 'No account? Create one',
    'login.toLogin': 'Have an account? Sign in',
    'login.continue': 'Continue to your wardrobe →',
    'login.checking': 'Checking authentication...',
    'login.processing': 'Processing...',
    'login.waitMessage': 'If you already have an account, we\'ll log you in',
    
    // Wardrobe page
    'wardrobe.title': 'My Wardrobe',
    'wardrobe.subtitle': 'Manage your clothing items and track their usage',
    'wardrobe.addItem': 'Add Item',
    'wardrobe.addTop': 'Add Top',
    'wardrobe.addPant': 'Add Pant',
    'wardrobe.addShoe': 'Add Shoe',
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
    'wardrobe.noTops': 'No Tops yet',
    'wardrobe.noPants': 'No Pants yet',
    'wardrobe.noShoes': 'No Shoes yet',
    'wardrobe.startBuilding': 'Start building your wardrobe by adding your first',
    'wardrobe.startBuildingTop': 'Start building your wardrobe by adding your first top',
    'wardrobe.startBuildingPant': 'Start building your wardrobe by adding your first pant',
    'wardrobe.startBuildingShoe': 'Start building your wardrobe by adding your first shoe',
    'wardrobe.tops': 'Tops',
    'wardrobe.pants': 'Pants',
    'wardrobe.shoes': 'Shoes',
    'wardrobe.wears': 'wears',
    'wardrobe.costPerWear': 'Cost per wear',
    'wardrobe.totalUsedValue': 'Total used value',
    'wardrobe.remainingValue': 'Remaining value',
    'wardrobe.tags': 'Tags',
    'wardrobe.addCustomTag': 'Add custom tag...',
    'wardrobe.commonTags': 'Common tags',
    'wardrobe.saveChanges': 'Save Changes',
    'wardrobe.calculatedValues': 'Calculated Values',
    'wardrobe.tag.casual': 'casual',
    'wardrobe.tag.formal': 'formal',
    'wardrobe.tag.work': 'work',
    'wardrobe.tag.summer': 'summer',
    'wardrobe.tag.winter': 'winter',
    'wardrobe.tag.sport': 'sport',
    'wardrobe.tag.date': 'date',
    'wardrobe.tag.workout': 'workout',
    'wardrobe.tag.versatile': 'versatile',
    'wardrobe.tag.cozy': 'cozy',
    'wardrobe.tag.smartCasual': 'smart-casual',
    'wardrobe.tag.smart-casual': 'smart-casual',
    'wardrobe.tag.comfort': 'comfort',
    'wardrobe.tag.exercise': 'exercise',
    
    // Outfit page
    'outfit.title': "Today's Outfit",
    'outfit.subtitle': 'Plan and track your daily outfits',
    'outfit.create': 'Create Outfit',
    'outfit.selectItems': 'Select Items',
    'outfit.generate': 'Generate Outfit',
    'outfit.save': 'Save Outfit',
    'outfit.delete': 'Delete Outfit',
    'outfit.tops': 'Tops',
    'outfit.pants': 'Pants',
    'outfit.shoes': 'Shoes',
    'outfit.outfitSummary': 'Outfit Summary',
    'outfit.itemsSelected': 'items selected',
    'outfit.selectItemsFirst': 'Select Items First',
    'outfit.selectTop': 'Select Top',
    'outfit.selectPants': 'Select Pants',
    'outfit.selectShoes': 'Select Shoes',
    'outfit.selected': 'Selected',
    'outfit.wears': 'wears',
    'outfit.todaysOutfit': "Today's Outfit",
    'outfit.totalWears': 'Total Wears',
    'outfit.todaysTotalCost': "Today's Total Cost",
    'outfit.totalOriginalPrice': 'Total Original Price',
    'outfit.styleTags': 'Style Tags',
    'outfit.confirmUpdate': 'Confirm & Update Usage Counts',
    
    // Success modal
    'success.outfitConfirmed': 'Outfit Confirmed! 🎉',
    'success.outfitSaved': 'Your daily outfit has been saved successfully!',
    'success.itemsUpdated': 'Items Updated',
    'success.todaysCost': "Today's Cost",
    'success.usageCountsIncreased': '✓ Usage counts increased by 1 for all selected items',
    'success.gotIt': 'Got it!',
    
    // Error messages
    'error.updateFailed': 'Update Failed',
    'error.usageCountsNotUpdated': 'Usage counts could not be updated',
    'error.confirmFailed': 'Confirmation Failed',
    'error.tryAgain': 'Please try again',
    
    // Analytics page
    'analytics.title': 'Analytics',
    'analytics.subtitle': 'Track your wardrobe usage and spending insights',
    'analytics.totalItems': 'Total Items',
    'analytics.totalOutfits': 'Total Outfits',
    'analytics.totalValue': 'Total Value',
    'analytics.categoryBreakdown': 'Category Breakdown',
    'analytics.colorBreakdown': 'Color Breakdown',
    'analytics.brandBreakdown': 'Brand Breakdown',
    'analytics.mostWornItem': 'Most Worn Item',
    'analytics.bestValue': 'Best Value',
    'analytics.needsMoreWear': 'Needs More Wear',
    'analytics.wardrobeSummary': 'Wardrobe Summary',
    'analytics.wears': 'wears',
    'analytics.perWear': 'per wear',
    'analytics.avgCostPerWear': 'Avg Cost/Wear',
    'analytics.totalItemsCount': 'Total Items',
    'analytics.remainingValue': 'Remaining Value',
    'analytics.consumedValue': 'Consumed Value',
    
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
    'common.upload': 'Upload',
    'common.camera': 'Camera',
    'common.itemName': 'Item Name',
    'common.originalPriceLabel': 'Original Price',
    'common.usageCount': 'Usage Count',
    'common.selected': 'items selected',
    'common.uploading': 'Uploading...',
    
    // Language switch
    'language.zh': '中文',
    'language.en': 'English',
    'language.switch': 'Switch Language',
    
    // Currency switch
    'currency.switch': 'Currency',
    
    // Modals
    'modal.editItem': 'Edit Item',
    'modal.addNewItem': 'Add New Item',
    
    // Connecting subtext
    'common.connecting': 'Connecting to database and fetching your data'
  }
}

// 语言上下文类型
interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  currency: 'cny' | 'usd'
  setCurrency: (c: 'cny' | 'usd') => void
  currencySymbol: string
  formatCurrency: (value: number | string) => string
}

// 创建语言上下文
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// 语言提供者组件
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh') // 默认中文
  const [currency, setCurrency] = useState<'cny' | 'usd'>(() => {
    const saved = (typeof window !== 'undefined' ? localStorage.getItem('currency') : null) as 'cny' | 'usd' | null
    return saved === 'usd' ? 'usd' : 'cny'
  })

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

  const currencySymbol = currency === 'cny' ? '¥' : '$'
  const formatCurrency = (value: number | string): string => {
    const num = typeof value === 'string' ? Number.parseFloat(value) : value
    if (Number.isNaN(num)) return `${currencySymbol}0`
    return `${currencySymbol}${num.toFixed(2)}`
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, currency, setCurrency: (c) => { setCurrency(c); if (typeof window !== 'undefined') localStorage.setItem('currency', c) }, currencySymbol, formatCurrency }}>
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
