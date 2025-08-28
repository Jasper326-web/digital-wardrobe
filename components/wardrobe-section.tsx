"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/lang-context"

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

export function WardrobeSection({ 
  title, 
  emoji, 
  category, 
  items, 
  onItemClick, 
  onAddItem,
  onDeleteItem 
}: WardrobeSectionProps) {
  const { t, formatCurrency } = useLanguage()
  
  const commonTags = [
    "casual",
    "formal",
    "work",
    "summer",
    "winter",
    "sport",
    "date",
    "workout",
    "versatile",
    "cozy",
    "smart-casual",
    "comfort",
    "exercise",
  ]
  
  const calculateCostPerWear = (price: number, usage: number) => {
    return (price / (usage + 1)).toFixed(2)
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
          {category === 'tops' ? t('wardrobe.addTop') : 
           category === 'pants' ? t('wardrobe.addPant') : 
           t('wardrobe.addShoe')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card 
            key={item.id} 
            className="cursor-pointer hover:shadow-md transition-all duration-200 group"
            onClick={() => onItemClick(item)}
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

                {/* 删除按钮 */}
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
              </div>

              {/* 项目信息 */}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.usageCount} {t('wardrobe.wears')}</span>
                  <span className="font-semibold text-primary">
                    {formatCurrency(calculateCostPerWear(item.originalPrice, item.usageCount))}/{t('analytics.perWear')}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {commonTags.includes(tag) ? t(`wardrobe.tag.${tag}`) : tag}
                    </Badge>
                  ))}
                  {item.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{item.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">{emoji}</div>
          <h3 className="text-lg font-semibold mb-2">
            {category === 'tops' ? t('wardrobe.noTops') : 
             category === 'pants' ? t('wardrobe.noPants') : 
             t('wardrobe.noShoes')}
          </h3>
          <p className="text-muted-foreground mb-4">
            {category === 'tops' ? t('wardrobe.startBuildingTop') : 
             category === 'pants' ? t('wardrobe.startBuildingPant') : 
             t('wardrobe.startBuildingShoe')}
          </p>
        </div>
      )}
    </div>
  )
}
