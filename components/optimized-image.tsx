"use client"

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src?: string
  alt: string
  fallbackSrc?: string
  className?: string
  width?: number
  height?: number
  placeholder?: string
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc,
  className,
  width = 100,
  height = 100,
  placeholder,
  onError,
  ...props
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const placeholderUrl = useMemo(() => {
    if (placeholder) return placeholder
    return `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(alt)}`
  }, [placeholder, width, height, alt])

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError && fallbackSrc) {
      setImageSrc(fallbackSrc)
      setHasError(true)
    } else {
      setImageSrc(placeholderUrl)
      setHasError(true)
    }
    setIsLoading(false)
    onError?.(e)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={imageSrc || placeholderUrl}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  )
}
