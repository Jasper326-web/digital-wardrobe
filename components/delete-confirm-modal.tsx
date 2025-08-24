"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2, AlertTriangle } from "lucide-react"
import { deleteImage } from "@/lib/supabase"

interface ClothingItem {
  id: string
  name: string
  image?: string
  usageCount: number
  originalPrice: number
  tags: string[]
}

interface DeleteConfirmModalProps {
  item: ClothingItem | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (item: ClothingItem) => void
}

export function DeleteConfirmModal({ item, isOpen, onClose, onConfirm }: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  if (!item) return null

  const handleConfirm = async () => {
    if (isDeleting) return // 防止重复点击
    
    try {
      setIsDeleting(true)
      
      // 如果项目有图片，先删除图片
      if (item.image && item.image.startsWith('http')) {
        await deleteImage(item.image)
      }
      onConfirm(item)
      onClose()
    } catch (error) {
      console.error('Failed to delete image:', error)
      // 即使图片删除失败，也继续删除项目
      onConfirm(item)
      onClose()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" aria-describedby="delete-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Delete Item
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={item.image || `/placeholder.svg?height=64&width=64&query=${encodeURIComponent(item.name)}`}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-600">
                {item.usageCount} wears • ${item.originalPrice} original price
              </p>
            </div>
          </div>

          <div className="text-center space-y-2" id="delete-description">
            <p className="text-gray-700">
              Are you sure you want to delete <span className="font-semibold">"{item.name}"</span>?
            </p>
            <p className="text-sm text-gray-500">
              This action cannot be undone. All usage data will be permanently lost.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isDeleting ? 'Deleting...' : 'Delete Item'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
