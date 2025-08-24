"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Minus, Plus, X, Upload, Camera, CameraOff } from "lucide-react"
import { uploadImage, deleteImage, base64ToFile } from "@/lib/supabase"
import { CameraPreviewModal } from "@/components/camera-preview-modal"

interface ClothingItem {
  id: string
  name: string
  image?: string
  usageCount: number
  originalPrice: number
  tags: string[]
}

interface ItemEditModalProps {
  item: ClothingItem | null
  isOpen: boolean
  onClose: () => void
  onSave: (item: ClothingItem) => void
  category?: string // 添加分类参数
}

interface FormData {
  name: string
  originalPrice: number | undefined
  usageCount: number
  tags: string[]
}

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

export function ItemEditModal({ item, isOpen, onClose, onSave, category }: ItemEditModalProps) {
  const [newTag, setNewTag] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<FormData>({
    defaultValues: {
      name: "",
      originalPrice: undefined, // 保持undefined，不使用默认值
      usageCount: 0,
      tags: [],
    },
  })

  useEffect(() => {
    if (item) {
      form.reset({
        name: item.name,
        originalPrice: item.originalPrice,
        usageCount: item.usageCount,
        tags: item.tags,
      })
      setUploadedImage(item.image || null)
    } else {
      // 重置为新项目的默认值
      form.reset({
        name: "",
        originalPrice: undefined, // 新项目时也不使用默认值
        usageCount: 0,
        tags: [],
      })
      setUploadedImage(null)
    }
  }, [item, form])



  const watchedValues = form.watch()
  const costPerWear =
    ((watchedValues.originalPrice || 0) / (watchedValues.usageCount + 1)).toFixed(2)

  const totalUsedValue =
    ((watchedValues.originalPrice || 0) * (watchedValues.usageCount / (watchedValues.usageCount + 1))).toFixed(2)

  const remainingValue = ((watchedValues.originalPrice || 0) - Number.parseFloat(totalUsedValue)).toFixed(2)

  const handleUsageChange = (increment: boolean) => {
    const currentUsage = form.getValues("usageCount")
    const newUsage = increment ? currentUsage + 1 : Math.max(0, currentUsage - 1)
    form.setValue("usageCount", newUsage)
  }

  const handleAddTag = (tag: string) => {
    const currentTags = form.getValues("tags")
    if (!currentTags.includes(tag)) {
      form.setValue("tags", [...currentTags, tag])
    }
    setNewTag("")
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags")
    form.setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove),
    )
  }

  const handleAddCustomTag = () => {
    if (newTag.trim() && !watchedValues.tags.includes(newTag.trim())) {
      handleAddTag(newTag.trim())
    }
  }

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()
      
      img.onload = () => {
        // 计算新的尺寸，最大宽度600px（更小的尺寸）
        const maxWidth = 600
        const maxHeight = 600
        let { width, height } = img
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        // 绘制压缩后的图片
        ctx.drawImage(img, 0, 0, width, height)
        
        // 转换为Blob，降低质量到60%
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            })
            resolve(compressedFile)
          } else {
            resolve(file)
          }
        }, 'image/jpeg', 0.6) // 60%质量，更快的上传
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && category) {
      try {
        setIsUploading(true)
        
        // 如果有旧图片，先删除
        if (uploadedImage && uploadedImage.startsWith('http')) {
          try {
            await deleteImage(uploadedImage)
          } catch (deleteError) {
            console.warn('Failed to delete old image:', deleteError)
          }
        }
        
        // 压缩图片
        const compressedFile = await compressImage(file)
        
        // 上传压缩后的图片
        const imageUrl = await uploadImage(compressedFile, item?.id || `new-${Date.now()}`, category)
        setUploadedImage(imageUrl)
      } catch (error) {
        console.error('Failed to upload image:', error)
        alert('Image upload failed. Please try again.')
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleCameraClick = () => {
    setIsCameraModalOpen(true)
  }

  const handlePhotoTaken = async (photoDataUrl: string) => {
    if (category) {
      try {
        setIsUploading(true)
        
        // 显示上传进度
        console.log('Starting photo upload...')
        
        // 如果有旧图片，先删除
        if (uploadedImage && uploadedImage.startsWith('http')) {
          try {
            console.log('Deleting old image...')
            await deleteImage(uploadedImage)
            console.log('Old image deleted successfully')
          } catch (deleteError) {
            console.warn('Failed to delete old image:', deleteError)
          }
        }
        
        // 将Base64转换为File对象
        console.log('Converting photo to file...')
        const photoFile = base64ToFile(photoDataUrl, `photo-${Date.now()}.jpg`)
        
        // 上传到Supabase Storage
        console.log('Uploading photo to Supabase...')
        const imageUrl = await uploadImage(photoFile, item?.id || `new-${Date.now()}`, category)
        console.log('Photo uploaded successfully:', imageUrl)
        setUploadedImage(imageUrl)
      } catch (error) {
        console.error('Failed to upload photo:', error)
        alert('Photo upload failed. Please try again.')
      } finally {
        setIsUploading(false)
      }
    }
  }



  const onSubmit = (data: FormData) => {
    const itemToSave = item ? {
      ...item,
      ...data,
      originalPrice: data.originalPrice || 0, // 确保originalPrice是数字
      image: uploadedImage || item.image,
    } : {
      id: `new-${Date.now()}`,
      ...data,
      originalPrice: data.originalPrice || 0, // 确保originalPrice是数字
      image: uploadedImage || "",
    }
    onSave(itemToSave)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Item" : "Add New Item"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-center">
              <div className="relative group">
                {isUploading ? (
                  <div className="w-64 h-64 bg-muted rounded-lg overflow-hidden relative flex items-center justify-center">
                    <LoadingSpinner 
                      size="sm"
                      text="Uploading image..."
                      className="text-muted-foreground"
                    />
                  </div>
                ) : (
                  <div
                    className="w-64 h-64 bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={handleImageClick}
                  >
                    <img
                      src={
                        uploadedImage || `/placeholder.svg?height=256&width=256&query=${encodeURIComponent(item?.name || "new item")}`
                      }
                      alt={item?.name || "New item"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-white text-center">
                        <Camera className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Click to upload image</p>
                      </div>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleImageClick}
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Upload
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleCameraClick}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Camera className="w-4 h-4 mr-1" />
                    Camera
                  </Button>
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="originalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="0"
                        value={field.value === undefined || field.value === null ? '' : field.value.toString()}
                        onChange={(e) => {
                          const inputValue = e.target.value
                          
                          // 如果输入为空，设置为0
                          if (inputValue === '') {
                            field.onChange(0)
                            return
                          }
                          
                          // 只允许数字和小数点
                          const numericValue = inputValue.replace(/[^0-9.]/g, '')
                          
                          // 确保只有一个小数点
                          const parts = numericValue.split('.')
                          if (parts.length > 2) {
                            return // 多个小数点，不更新
                          }
                          
                          // 限制小数点后两位
                          if (parts.length === 2 && parts[1].length > 2) {
                            return // 小数位超过2位，不更新
                          }
                          
                          // 转换为数字
                          const numValue = parseFloat(numericValue)
                          if (!isNaN(numValue) && numValue >= 0) {
                            field.onChange(numValue)
                          }
                        }}
                        onBlur={(e) => {
                          // 失去焦点时，如果是空值或无效值，设置为0
                          const value = e.target.value
                          if (value === '' || isNaN(parseFloat(value))) {
                            field.onChange(0)
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="usageCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usage Count</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleUsageChange(false)}
                          disabled={field.value <= 0}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Input
                          type="number"
                          min="0"
                          className="text-center"
                          {...field}
                          onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                        />
                        <Button type="button" variant="outline" size="sm" onClick={() => handleUsageChange(true)}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-sm text-foreground">Calculated Values</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Cost per wear:</span>
                  <div className="font-semibold text-primary text-lg">${costPerWear}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Total used value:</span>
                  <div className="font-semibold text-foreground">${totalUsedValue}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Remaining value:</span>
                  <div className="font-semibold text-foreground">${remainingValue}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <FormLabel>Tags</FormLabel>

              <div className="flex flex-wrap gap-2">
                {watchedValues.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 w-4 h-4 hover:bg-transparent"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Add custom tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddCustomTag()
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={handleAddCustomTag}>
                  Add
                </Button>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Common tags:</p>
                <div className="flex flex-wrap gap-2">
                  {commonTags
                    .filter((tag) => !watchedValues.tags.includes(tag))
                    .map((tag) => (
                      <Button
                        key={tag}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddTag(tag)}
                        className="text-xs"
                      >
                        {tag}
                      </Button>
                    ))}
                </div>
              </div>
            </div>

            <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>

      {/* Camera Preview Modal */}
      <CameraPreviewModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onPhotoTaken={handlePhotoTaken}
      />
    </Dialog>
  )
}
