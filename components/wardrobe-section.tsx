"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ClothingItem {
  id: string
  name: string
  image?: string
  usageCount: number
  originalPrice: number
  tags: string[]
}

interface WardrobeSectionProps {
  title: string
  emoji: string
  category: string
  items: ClothingItem[]
  onItemClick: (item: ClothingItem) => void
  onAddItem: (category: string) => void
  onDeleteItem: (item: ClothingItem) => void
}

// 示例项目数据
const getExampleItems = (category: string): ClothingItem[] => {
  const examples = {
    tops: [
      {
        id: "example-top-1",
        name: "White Cotton T-Shirt",
        image: "", // 使用占位符图片
        usageCount: 12,
        originalPrice: 25,
        tags: ["casual", "summer", "versatile"]
      },
      {
        id: "example-top-2", 
        name: "Blue Dress Shirt",
        image: "", // 使用占位符图片
        usageCount: 8,
        originalPrice: 60,
        tags: ["formal", "work", "professional"]
      }
    ],
    pants: [
      {
        id: "example-pants-1",
        name: "Dark Blue Jeans",
        image: "", // 使用占位符图片
        usageCount: 15,
        originalPrice: 80,
        tags: ["casual", "versatile", "comfort"]
      },
      {
        id: "example-pants-2",
        name: "Black Dress Pants",
        image: "", // 使用占位符图片
        usageCount: 6,
        originalPrice: 120,
        tags: ["formal", "work", "elegant"]
      }
    ],
    shoes: [
      {
        id: "example-shoes-1",
        name: "White Sneakers",
        image: "", // 使用占位符图片
        usageCount: 20,
        originalPrice: 120,
        tags: ["casual", "sport", "comfort"]
      },
      {
        id: "example-shoes-2",
        name: "Black Oxford Shoes",
        image: "", // 使用占位符图片
        usageCount: 10,
        originalPrice: 200,
        tags: ["formal", "work", "classic"]
      }
    ]
  }
  
  return examples[category as keyof typeof examples] || []
}

export function WardrobeSection({ 
  title, 
  emoji, 
  category, 
  items, 
  onItemClick, 
  onAddItem,
  onDeleteItem 
}: WardrobeSectionProps) {
  const [showExamples, setShowExamples] = useState(() => {
    // 检查本地存储，看用户是否已经看过示例
    if (typeof window !== 'undefined') {
      const hasSeenExamples = localStorage.getItem('hasSeenWardrobeExamples')
      return !hasSeenExamples
    }
    return true
  })
  
  // 检查是否应该显示示例（当没有真实项目时）
  const shouldShowExamples = items.length === 0 && showExamples
  const exampleItems = shouldShowExamples ? getExampleItems(category) : []
  const displayItems = shouldShowExamples ? exampleItems : items

  const calculateCostPerWear = (price: number, usage: number) => {
    return (price / (usage + 1)).toFixed(2)
  }

  const handleExampleClick = (exampleItem: ClothingItem) => {
    // 当点击示例项目时，创建一个新的真实项目
    const newItem: ClothingItem = {
      id: `new-${Date.now()}`,
      name: exampleItem.name,
      image: exampleItem.image,
      usageCount: exampleItem.usageCount,
      originalPrice: exampleItem.originalPrice,
      tags: exampleItem.tags
    }
    
    // 调用onItemClick来编辑这个新项目
    onItemClick(newItem)
    
    // 隐藏示例项目并记住用户已经看过
    setShowExamples(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasSeenWardrobeExamples', 'true')
    }
  }

  const handleDeleteExample = (exampleItem: ClothingItem) => {
    // 当删除示例项目时，只是隐藏它
    if (exampleItems.length === 1) {
      setShowExamples(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span>{emoji}</span>
          {title}
        </h2>
        <Button onClick={() => onAddItem(category)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add {title.slice(0, -1)}
        </Button>
      </div>

             {shouldShowExamples && (
         <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
           <div className="flex items-center justify-between mb-2">
             <div className="flex items-center gap-2">
               <span className="text-blue-600">💡</span>
               <span className="text-sm font-medium text-blue-800">Getting Started</span>
             </div>
             <Button
               variant="ghost"
               size="sm"
               onClick={() => {
                 setShowExamples(false)
                 if (typeof window !== 'undefined') {
                   localStorage.setItem('hasSeenWardrobeExamples', 'true')
                 }
               }}
               className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
             >
               Skip Examples
             </Button>
           </div>
           <p className="text-sm text-blue-700">
             Here are some example items to help you get started. Click on any item to customize it, or add your own items using the button above.
           </p>
         </div>
       )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayItems.map((item) => (
          <Card 
            key={item.id} 
            className={cn(
              "cursor-pointer hover:shadow-md transition-all duration-200 group",
              shouldShowExamples && "ring-2 ring-blue-200 bg-blue-50/50"
            )}
            onClick={() => shouldShowExamples ? handleExampleClick(item) : onItemClick(item)}
          >
            <CardContent className="p-4">
              <div className="relative">
                {/* 图片容器 */}
                <div className="w-full h-48 bg-muted rounded-lg overflow-hidden mb-3">
                  <img
                    src={item.image || `/placeholder.svg?height=192&width=192&query=${encodeURIComponent(item.name)}`}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `/placeholder.svg?height=192&width=192&query=${encodeURIComponent(item.name)}`;
                    }}
                  />
                </div>

                {/* 删除按钮 - 只在非示例项目时显示 */}
                {!shouldShowExamples && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteItem(item);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}

                {/* 示例项目标识 */}
                {shouldShowExamples && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                      Example
                    </Badge>
                  </div>
                )}
              </div>

              {/* 项目信息 */}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.usageCount} wears</span>
                  <span className="font-semibold text-primary">
                    ${calculateCostPerWear(item.originalPrice, item.usageCount)}/wear
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{item.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {shouldShowExamples && (
                  <div className="text-xs text-blue-600 mt-2">
                    💡 Click to customize this example
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {displayItems.length === 0 && !shouldShowExamples && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">👕</div>
          <h3 className="text-lg font-semibold mb-2">No {title} yet</h3>
          <p className="text-muted-foreground mb-4">Start building your wardrobe by adding your first {title.slice(0, -1).toLowerCase()}.</p>
          <Button onClick={() => onAddItem(category)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Your First {title.slice(0, -1)}
          </Button>
        </div>
      )}
    </div>
  )
}
