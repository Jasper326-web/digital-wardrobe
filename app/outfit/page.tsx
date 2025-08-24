"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { OutfitSelector } from "@/components/outfit-selector"
import { OutfitMannequin } from "@/components/outfit-mannequin"
import { OutfitSummary } from "@/components/outfit-summary"
import { SuccessModal } from "@/components/success-modal"
import { PageHeader } from "@/components/page-header"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { getClothingItems, updateClothingItem } from "@/lib/database"
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

export default function OutfitPage() {
  const [items, setItems] = useState<ClothingItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<{
    top?: ClothingItem
    pants?: ClothingItem
    shoes?: ClothingItem
  }>({})
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const { toast } = useToast()

  // 加载outfit数据
  const loadOutfitData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const dbItems = await getClothingItems()
      
      // 将database.ts的ClothingItem转换为outfit页面的ClothingItem格式
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
      console.error('Failed to load outfit data:', error)
      
      // 如果是认证过期错误，重定向到首页
      if (error instanceof Error && error.message === 'AUTH_EXPIRED') {
        window.location.href = '/'
        return
      }
      
      setError('Failed to load outfit data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOutfitData()
  }, [])

  const handleItemSelect = (item: ClothingItem, category: string) => {
    setSelectedItems((prev) => {
      const categoryKey = category === "tops" ? "top" : category === "pants" ? "pants" : "shoes"
      const currentItem = prev[categoryKey]
      
      // 如果点击的是已选择的物品，则取消选择
      if (currentItem && currentItem.id === item.id) {
        const newState = { ...prev }
        delete newState[categoryKey]
        return newState
      }
      
      // 否则选择新物品
      return {
        ...prev,
        [categoryKey]: item,
      }
    })
  }

  const handleConfirmOutfit = async () => {
    const selectedItemsArray = Object.values(selectedItems).filter(Boolean) as ClothingItem[]
    
    try {
      // 增加每个选中物品的使用次数
      await Promise.all(
        selectedItemsArray.map(async (item) => {
          await updateClothingItem(item.id, {
            usage_count: item.usageCount + 1
          })
        })
      )

      // 更新本地状态以反映新的使用次数
      setItems(prevItems => 
        prevItems.map(item => {
          const selectedItem = selectedItemsArray.find(selected => selected.id === item.id)
          if (selectedItem) {
            return { ...item, usageCount: item.usageCount + 1 }
          }
          return item
        })
      )

      // 更新选中的物品状态
      setSelectedItems(prev => {
        const updated = { ...prev }
        Object.keys(updated).forEach(key => {
          const item = updated[key as keyof typeof updated]
          if (item) {
            updated[key as keyof typeof updated] = { ...item, usageCount: item.usageCount + 1 }
          }
        })
        return updated
      })

      // 计算今日总成本用于弹窗显示
      const todayTotalCost = selectedItemsArray.reduce((sum, item) => {
        const costPerWear = item.originalPrice / (item.usageCount + 1)
        return sum + costPerWear
      }, 0).toFixed(2)

      // 显示成功弹窗
      setShowSuccessModal(true)
      
      console.log("Confirmed outfit:", selectedItems)
    } catch (error) {
      console.error('Failed to update usage counts:', error)
      toast({
        title: "Outfit Confirmed!",
        description: "Today's outfit saved, but usage counts couldn't be updated.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* Background images */}
      <div className="absolute inset-0 opacity-90">
        <img
          src="/Lucid_Origin_A_stylish_digital_wardrobe_concept_scene_showcasi_2.jpg"
          alt="Fashion photography background"
          className="w-full h-full object-cover object-center"
        />
        {/* Light gray overlay */}
        <div className="absolute inset-0 bg-gray-300/30"></div>
      </div>

      <Navigation />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-64">
        <PageHeader 
          title="Today's Outfit"
          description="Plan and track your daily outfits"
          icon="👔"
        />

        {isLoading ? (
          <LoadingSpinner 
            size="lg"
            text="Loading your wardrobe..."
            subtext="Connecting to database and fetching your items"
          />
        ) : error ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-center">
              <div className="text-white text-lg mb-4">{error}</div>
              <button 
                onClick={loadOutfitData}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-16">
            {/* Left Side - Item Selector */}
            <div className="xl:col-span-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                <div className="mb-4">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent mb-2">Select Items</h2>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full"></div>
                </div>
                <OutfitSelector 
                  items={items}
                  selectedItems={selectedItems} 
                  onItemSelect={handleItemSelect} 
                />
              </div>
            </div>

            {/* Right Side - Mannequin & Summary */}
            <div className="xl:col-span-2 space-y-6">
              {/* Mannequin */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <OutfitMannequin selectedItems={selectedItems} />
              </div>
              
              {/* Quick Summary */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                  <span>📊</span>
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-black">Items Selected:</span>
                    <span className="text-black font-semibold">
                      {Object.values(selectedItems).filter(Boolean).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black">Total Value:</span>
                    <span className="text-black font-semibold">
                      ${Object.values(selectedItems).filter(Boolean).reduce((sum, item) => sum + item.originalPrice, 0).toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black">Total Wears:</span>
                    <span className="text-black font-semibold">
                      {Object.values(selectedItems).filter(Boolean).reduce((sum, item) => sum + item.usageCount, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Summary - Fixed Position */}
      <OutfitSummary selectedItems={selectedItems} onConfirmOutfit={handleConfirmOutfit} />

      {/* Success Modal */}
      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        itemCount={Object.values(selectedItems).filter(Boolean).length}
        totalCost={Object.values(selectedItems).filter(Boolean).reduce((sum, item) => {
          const costPerWear = item.originalPrice / (item.usageCount + 1)
          return sum + costPerWear
        }, 0).toFixed(2)}
      />
    </div>
  )
}
