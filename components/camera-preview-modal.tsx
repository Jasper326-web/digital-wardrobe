"use client"

import React, { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Camera, CameraOff, X } from "lucide-react"

interface CameraPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  onPhotoTaken: (photoDataUrl: string) => void
}

export function CameraPreviewModal({ isOpen, onClose, onPhotoTaken }: CameraPreviewModalProps) {
  const [isCameraLoading, setIsCameraLoading] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

    const startCamera = async () => {
    try {
      setIsCameraLoading(true)
      console.log('Requesting camera access...')
      
      // 检查是否在HTTPS环境下
      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        alert('Camera access requires HTTPS. Please use HTTPS or localhost.')
        return
      }
      
      // 检查浏览器是否支持getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Your browser does not support camera access.')
        return
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      })
      
      console.log('Camera access granted:', mediaStream)
      setStream(mediaStream)
      setIsCameraActive(true)
      
      // 等待DOM更新后再设置视频
      const setupVideo = () => {
        if (videoRef.current) {
          console.log('Setting video srcObject...')
          videoRef.current.srcObject = mediaStream
          
          // 确保视频元素正确加载
          const playVideo = () => {
            if (videoRef.current) {
              videoRef.current.play().then(() => {
                console.log('Video playback started successfully')
              }).catch((error) => {
                console.error('Failed to start video playback:', error)
              })
            }
          }
          
          videoRef.current.onloadedmetadata = () => {
            console.log('Video metadata loaded, starting playback...')
            playVideo()
          }
          
          videoRef.current.oncanplay = () => {
            console.log('Video can play, starting playback...')
            playVideo()
          }
          
          videoRef.current.onerror = (error) => {
            console.error('Video error:', error)
          }
          
          // 强制播放尝试
          setTimeout(() => {
            if (videoRef.current && videoRef.current.readyState >= 2) {
              console.log('Force playing video after timeout...')
              playVideo()
            }
          }, 500)
        } else {
          console.error('Video ref is still null after timeout')
        }
      }
      
      // 尝试多次设置视频，直到成功
      let attempts = 0
      const maxAttempts = 10
      
      const trySetupVideo = () => {
        attempts++
        if (videoRef.current) {
          setupVideo()
        } else if (attempts < maxAttempts) {
          console.log(`Video ref not ready, attempt ${attempts}/${maxAttempts}`)
          setTimeout(trySetupVideo, 50)
        } else {
          console.error('Failed to setup video after multiple attempts')
        }
      }
      
      trySetupVideo()
      
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert(`Cannot access camera: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsCameraLoading(false)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsCameraActive(false)
    setIsCameraLoading(false)
  }

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        
        // 应用镜像效果到拍照
        context.scale(-1, 1)
        context.translate(-canvas.width, 0)
        context.drawImage(video, 0, 0)
        
        const photoDataUrl = canvas.toDataURL('image/jpeg', 0.6)
        onPhotoTaken(photoDataUrl)
        stopCamera()
        onClose()
      }
    }
  }

  const handleClose = () => {
    stopCamera()
    onClose()
  }

  const forceRefreshVideo = () => {
    if (videoRef.current && stream) {
      console.log('Force refreshing video...')
      videoRef.current.srcObject = null
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      }, 100)
    }
  }

  useEffect(() => {
    if (isOpen) {
      // 延迟启动摄像头，确保DOM已渲染
      const timer = setTimeout(() => {
        startCamera()
      }, 200) // 增加延迟时间
      
      return () => clearTimeout(timer)
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isOpen])

  // 监听videoRef变化，确保在ref可用时设置视频
  useEffect(() => {
    if (isOpen && stream && videoRef.current && !videoRef.current.srcObject) {
      console.log('Video ref is now available, setting up video...')
      videoRef.current.srcObject = stream
      
      const playVideo = () => {
        if (videoRef.current) {
          videoRef.current.play().then(() => {
            console.log('Video playback started from ref effect')
          }).catch((error) => {
            console.error('Failed to start video playback from ref effect:', error)
          })
        }
      }
      
      videoRef.current.onloadedmetadata = playVideo
      videoRef.current.oncanplay = playVideo
    }
  }, [isOpen, stream, videoRef.current])

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden" showCloseButton={false}>
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg">Take Photo</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="relative bg-black">
          {isCameraLoading ? (
            <div className="w-full h-96 flex items-center justify-center">
              <LoadingSpinner 
                size="md"
                text="Starting camera..."
                className="text-white"
              />
            </div>
          ) : isCameraActive ? (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-96 object-cover"
                style={{ transform: 'scaleX(-1)' }}
                controls={false}
                preload="auto"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* 调试信息 */}
              <div className="absolute top-2 left-2 bg-black/50 text-white text-xs p-2 rounded">
                Camera Active: {isCameraActive ? 'Yes' : 'No'}<br/>
                Stream: {stream ? 'Connected' : 'Not Connected'}<br/>
                Video Ready: {videoRef.current?.readyState || 'Unknown'}<br/>
                <button 
                  onClick={forceRefreshVideo}
                  className="mt-1 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                >
                  Refresh Video
                </button>
              </div>
              
              {/* 如果视频没有显示，显示提示 */}
              {videoRef.current && videoRef.current.readyState < 2 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <LoadingSpinner 
                    size="sm"
                    text="Initializing camera..."
                    className="text-white"
                  />
                </div>
              )}
              
              {/* 拍照按钮 */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <Button
                  onClick={takePhoto}
                  size="lg"
                  className="h-16 w-16 rounded-full bg-white hover:bg-gray-100 text-black shadow-lg"
                >
                  <Camera className="h-8 w-8" />
                </Button>
              </div>

              {/* 取消按钮 */}
              <div className="absolute top-4 right-4">
                <Button
                  onClick={handleClose}
                  variant="secondary"
                  size="sm"
                  className="bg-black/50 hover:bg-black/70 text-white border-0"
                >
                  <CameraOff className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full h-96 flex items-center justify-center">
              <div className="text-white text-center">
                <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Camera not available</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
