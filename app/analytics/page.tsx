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
    try {
      setIsLoading(true)
      setError(null)
      
      // 首先检查Supabase连接
      const isConnected = await checkSupabaseConnection()
      if (!isConnected) {
        setError('Unable to connect to database. Please check your internet connection and try again.')
        setItems([])
        return
      }
      
      console.log('Starting to load analytics data...')
      const [tops, pants, shoes] = await Promise.all([
        getClothingItems('tops'),
        getClothingItems('pants'),
        getClothingItems('shoes')
      ])

      const mapDbItem = (dbItem: any): ClothingItem => ({
        id: dbItem.id,
        name: dbItem.name,
        image: dbItem.image_url || "",
        usageCount: dbItem.usage_count,
        originalPrice: dbItem.original_price,
        tags: dbItem.tags || [],
        category: dbItem.category,
        user_id: dbItem.user_id
      })

      const allItems = [
        ...tops.map(mapDbItem),
        ...pants.map(mapDbItem),
        ...shoes.map(mapDbItem)
      ]

      console.log(`Loaded ${allItems.length} items for analytics`)
      setItems(allItems)
      
    } catch (error) {
      console.error('Failed to load analytics data:', error)
      setError('Failed to load analytics data. Please try again.')
      setItems([])
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
