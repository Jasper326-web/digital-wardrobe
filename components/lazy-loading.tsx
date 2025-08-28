"use client"

import { Suspense, lazy, ComponentType } from 'react'
import { LoadingSpinner } from './loading-spinner'

interface LazyComponentProps {
  component: ComponentType<any>
  fallback?: React.ReactNode
  [key: string]: any
}

export function LazyComponent({ component: Component, fallback, ...props }: LazyComponentProps) {
  return (
    <Suspense fallback={fallback || <LoadingSpinner />}>
      <Component {...props} />
    </Suspense>
  )
}

// 预定义的懒加载组件
export const LazyAnalyticsCharts = lazy(() => import('./analytics-charts').then(module => ({ default: module.AnalyticsCharts })))
export const LazyAnalyticsStats = lazy(() => import('./analytics-stats').then(module => ({ default: module.AnalyticsStats })))
export const LazyOutfitSelector = lazy(() => import('./outfit-selector').then(module => ({ default: module.OutfitSelector })))
export const LazyOutfitMannequin = lazy(() => import('./outfit-mannequin').then(module => ({ default: module.OutfitMannequin })))
export const LazyOutfitSummary = lazy(() => import('./outfit-summary').then(module => ({ default: module.OutfitSummary })))
export const LazyWardrobeSection = lazy(() => import('./wardrobe-section').then(module => ({ default: module.WardrobeSection })))
