"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { WardrobeSection } from "@/components/wardrobe-section"
import { ItemEditModal } from "@/components/item-edit-modal"
import { DeleteConfirmModal } from "@/components/delete-confirm-modal"
import { PageHeader } from "@/components/page-header"
import { LoadingSpinner } from "@/components/loading-spinner"
import { createClothingItem, updateClothingItem, deleteClothingItem, getClothingItems, ClothingItem as DBClothingItem } from "@/lib/database"
import { checkSupabaseConnection } from "@/lib/supabase"

interface ClothingItem {
  id: string
  name: string
  image?: string
  usageCount: number
  originalPrice: number
  tags: string[]
  user_id?: string
}

export default function WardrobePage() {
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<ClothingItem | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<string>("")
  const [items, setItems] = useState<{ [key: string]: ClothingItem[] }>({
    tops: [],
    pants: [],
    shoes: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 加载数据
  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // 首先检查Supabase连接
      const isConnected = await checkSupabaseConnection()
      if (!isConnected) {
        setError('Unable to connect to database. Please check your internet connection and try again.')
        setItems({ tops: [], pants: [], shoes: [] })
        return
      }
      
      console.log('Starting to load wardrobe items...')
      const [tops, pants, shoes] = await Promise.all([
        getClothingItems('tops'),
        getClothingItems('pants'),
        getClothingItems('shoes')
      ])

      const mapDbItem = (dbItem: any) => ({
        id: dbItem.id,
        name: dbItem.name,
        image: dbItem.image_url || "",
        usageCount: dbItem.usage_count,
        originalPrice: dbItem.original_price,
        tags: dbItem.tags,
        user_id: dbItem.user_id
      })

      const mappedItems = {
        tops: tops.map(mapDbItem),
        pants: pants.map(mapDbItem),
        shoes: shoes.map(mapDbItem)
      }

      console.log(`Loaded ${tops.length + pants.length + shoes.length} wardrobe items`)
      setItems(mappedItems)
      
    } catch (error) {
      console.error('Failed to load items:', error)
      setError('Failed to load wardrobe items. Please try again.')
      setItems({ tops: [], pants: [], shoes: [] })
    } finally {
      setIsLoading(false)
    }
  }

  const handleItemClick = (item: ClothingItem) => {
    // 确定项目所属的分类
    let category = ""
    if (items.tops.find(i => i.id === item.id)) category = "tops"
    else if (items.pants.find(i => i.id === item.id)) category = "pants"
    else if (items.shoes.find(i => i.id === item.id)) category = "shoes"
    
    setCurrentCategory(category)
    setSelectedItem(item)
    setIsEditModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsEditModalOpen(false)
    setSelectedItem(null)
  }

  const handleSaveItem = async (updatedItem: ClothingItem) => {
    try {
      if (updatedItem.id.startsWith('new-')) {
        // 创建新项目
        const dbItem = await createClothingItem({
          name: updatedItem.name,
          image_url: updatedItem.image,
          usage_count: updatedItem.usageCount,
          original_price: updatedItem.originalPrice,
          category: currentCategory,
          tags: updatedItem.tags
        })

        // 更新本地状态
        const newItem: ClothingItem = {
          id: dbItem.id,
          name: dbItem.name,
          image: dbItem.image_url || "",
          usageCount: dbItem.usage_count,
          originalPrice: dbItem.original_price,
          tags: dbItem.tags,
          user_id: dbItem.user_id
        }

        setItems(prev => ({
          ...prev,
          [currentCategory]: [...prev[currentCategory], newItem]
        }))

        alert(`Item "${updatedItem.name}" has been created successfully!`)
      } else {
        // 更新现有项目
        await updateClothingItem(updatedItem.id, {
          name: updatedItem.name,
          image_url: updatedItem.image,
          usage_count: updatedItem.usageCount,
          original_price: updatedItem.originalPrice,
          tags: updatedItem.tags
        })

        // 更新本地状态
        setItems(prev => ({
          ...prev,
          [currentCategory]: prev[currentCategory].map(item => 
            item.id === updatedItem.id ? updatedItem : item
          )
        }))

        alert(`Item "${updatedItem.name}" has been updated successfully!`)
      }
    } catch (error) {
      console.error('Failed to save item:', error)
      alert('Failed to save item. Please try again.')
    }
    handleCloseModal()
  }

  const handleDeleteItem = (item: ClothingItem) => {
    setItemToDelete(item)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async (item: ClothingItem) => {
    try {
      // 删除数据库中的项目
      await deleteClothingItem(item.id)

      // 更新本地状态 - 从所有分类中查找并删除
      setItems(prev => ({
        tops: prev.tops.filter(i => i.id !== item.id),
        pants: prev.pants.filter(i => i.id !== item.id),
        shoes: prev.shoes.filter(i => i.id !== item.id)
      }))

      alert(`Item "${item.name}" has been deleted successfully!`)
    } catch (error) {
      console.error('Failed to delete item:', error)
      alert('Failed to delete item. Please try again.')
    }
    setIsDeleteModalOpen(false)
    setItemToDelete(null)
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setItemToDelete(null)
  }

  const handleAddItem = (category: string) => {
    // Create a new empty item for the selected category
    const newItem: ClothingItem = {
      id: `new-${Date.now()}`, // Temporary ID
      name: "",
      image: "",
      usageCount: 0,
      originalPrice: 0,
      tags: [],
    }
    setCurrentCategory(category)
    setSelectedItem(newItem)
    setIsEditModalOpen(true)
  }

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
          title="My Wardrobe"
          description="Manage your clothing items and track their usage"
          icon="👗"
        />

        {isLoading ? (
          <LoadingSpinner 
            size="lg"
            text="Loading your wardrobe..."
            subtext="Connecting to database and fetching your items"
          />
        ) : error ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="text-white text-lg mb-4">{error}</div>
              <button 
                onClick={loadItems}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            <WardrobeSection
              title="Tops"
              emoji="👕"
              category="tops"
              items={items.tops}
              onItemClick={handleItemClick}
              onAddItem={handleAddItem}
              onDeleteItem={handleDeleteItem}
            />
            <WardrobeSection
              title="Pants"
              emoji="👖"
              category="pants"
              items={items.pants}
              onItemClick={handleItemClick}
              onAddItem={handleAddItem}
              onDeleteItem={handleDeleteItem}
            />
            <WardrobeSection
              title="Shoes"
              emoji="👟"
              category="shoes"
              items={items.shoes}
              onItemClick={handleItemClick}
              onAddItem={handleAddItem}
              onDeleteItem={handleDeleteItem}
            />
          </div>
        )}
      </main>

      <ItemEditModal 
        item={selectedItem} 
        isOpen={isEditModalOpen} 
        onClose={handleCloseModal} 
        onSave={handleSaveItem}
        category={currentCategory}
      />
      <DeleteConfirmModal 
        item={itemToDelete} 
        isOpen={isDeleteModalOpen} 
        onClose={handleCloseDeleteModal} 
        onConfirm={handleConfirmDelete} 
      />
    </div>
  )
}


