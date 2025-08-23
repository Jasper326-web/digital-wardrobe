"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { AnalyticsStats } from "@/components/analytics-stats"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { PageHeader } from "@/components/page-header"
import { LoadingSpinner } from "@/components/loading-spinner"
import { getClothingItems } from "@/lib/database"
import { checkSupabaseConnection } from "@/lib/supabase"

interface ClothingItem {
  id: string
  name: string
  image?: string
  usageCount: number
  originalPrice: number
  tags: string[]
  category: string
  user_id?: string
}

export default function AnalyticsPage() {
  const [items, setItems] = useState<ClothingItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 加载分析数据
  const loadAnalyticsData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const dbItems = await getClothingItems()
      
      // 将database.ts的ClothingItem转换为analytics页面的ClothingItem格式
      const items: ClothingItem[] = dbItems.map(dbItem => ({
        id: dbItem.id,
        name: dbItem.name,
        image: dbItem.image_url,
        usageCount: dbItem.usage_count,
        originalPrice: dbItem.original_price,
        tags: dbItem.tags,
        category: dbItem.category,
        user_id: dbItem.user_id
      }))
      
      setItems(items)
    } catch (error) {
      console.error('Failed to load analytics data:', error)
      
      // 如果是认证过期错误，重定向到首页
      if (error instanceof Error && error.message === 'AUTH_EXPIRED') {
        window.location.href = '/'
        return
      }
      
      setError('Failed to load analytics data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAnalyticsData()
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background images */}
      <div className="absolute inset-0 opacity-90">
        <img
          src="/Lucid_Origin_A_stylish_digital_wardrobe_concept_scene_showcasi_2.jpg"
          alt="Stylish digital wardrobe concept scene"
          className="w-full h-full object-cover object-center"
        />
        {/* Very light gray overlay */}
        <div className="absolute inset-0 bg-gray-100/20"></div>
      </div>

      <Navigation />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader 
          title="Analytics"
          description="Track your wardrobe usage and spending insights"
          icon="📊"
        />

        {isLoading ? (
          <LoadingSpinner 
            size="lg"
            text="Loading analytics..."
            subtext="Connecting to database and fetching your data"
          />
        ) : error ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="text-white text-lg mb-4">{error}</div>
              <button 
                onClick={loadAnalyticsData}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="text-white text-lg mb-4">No wardrobe data found</div>
              <p className="text-white/70 text-sm">Add some clothing items to your wardrobe to see analytics</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Cards */}
            <AnalyticsStats items={items} />

            {/* Charts */}
            <AnalyticsCharts items={items} />
          </div>
        )}
      </main>
    </div>
  )
}
