"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/lib/lang-context"

interface ClothingItem {
  id: string
  name: string
  image?: string
  usageCount: number
  originalPrice: number
  tags: string[]
  category: string
}

interface OutfitMannequinProps {
  selectedItems: {
    top?: ClothingItem
    pants?: ClothingItem
    shoes?: ClothingItem
  }
}

export function OutfitMannequin({ selectedItems }: OutfitMannequinProps) {
  const { t } = useLanguage()
  
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-2">{t('outfit.todaysOutfit')}</h3>
      </div>

      <div className="flex flex-col items-center space-y-5">
        {/* Top Slot */}
        <Card className="w-56 h-40 border-dashed border-2 border-white/30 bg-white/10 backdrop-blur-sm">
          <CardContent className="p-6 h-full flex flex-col items-center justify-center">
            {selectedItems.top ? (
              <div className="text-center">
                <img
                  src={selectedItems.top.image || `/placeholder.svg?height=100&width=100&query=${encodeURIComponent(selectedItems.top.name)}`}
                  alt={selectedItems.top.name}
                  className="w-24 h-24 object-cover rounded-lg mx-auto mb-3 shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `/placeholder.svg?height=100&width=100&query=${encodeURIComponent(selectedItems.top!.name)}`;
                  }}
                />
                <p className="text-base font-medium text-white truncate w-full" style={{ textShadow: "-0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0.5px 0.5px 0 #000" }}>{selectedItems.top.name}</p>
              </div>
            ) : (
              <div className="text-center">
                <span className="text-5xl">👕</span>
                <p className="text-base text-white/80 mt-3">{t('outfit.selectTop')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pants Slot */}
        <Card className="w-56 h-40 border-dashed border-2 border-white/30 bg-white/10 backdrop-blur-sm">
          <CardContent className="p-6 h-full flex flex-col items-center justify-center">
            {selectedItems.pants ? (
              <div className="text-center">
                <img
                  src={selectedItems.pants.image || `/placeholder.svg?height=100&width=100&query=${encodeURIComponent(selectedItems.pants.name)}`}
                  alt={selectedItems.pants.name}
                  className="w-24 h-24 object-cover rounded-lg mx-auto mb-3 shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `/placeholder.svg?height=100&width=100&query=${encodeURIComponent(selectedItems.pants!.name)}`;
                  }}
                />
                <p className="text-base font-medium text-white truncate w-full" style={{ textShadow: "-0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0.5px 0.5px 0 #000" }}>{selectedItems.pants.name}</p>
              </div>
            ) : (
              <div className="text-center">
                <span className="text-5xl">👖</span>
                <p className="text-base text-white/80 mt-3">{t('outfit.selectPants')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Shoes Slot */}
        <Card className="w-56 h-36 border-dashed border-2 border-white/30 bg-white/10 backdrop-blur-sm">
          <CardContent className="p-6 h-full flex flex-col items-center justify-center">
            {selectedItems.shoes ? (
              <div className="text-center">
                <img
                  src={selectedItems.shoes.image || `/placeholder.svg?height=80&width=80&query=${encodeURIComponent(selectedItems.shoes.name)}`}
                  alt={selectedItems.shoes.name}
                  className="w-20 h-20 object-cover rounded-lg mx-auto mb-3 shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `/placeholder.svg?height=80&width=80&query=${encodeURIComponent(selectedItems.shoes!.name)}`;
                  }}
                />
                <p className="text-base font-medium text-white truncate w-full" style={{ textShadow: "-0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0.5px 0.5px 0 #000" }}>{selectedItems.shoes.name}</p>
              </div>
            ) : (
              <div className="text-center">
                <span className="text-4xl">👟</span>
                <p className="text-base text-white/80 mt-3">{t('outfit.selectShoes')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
