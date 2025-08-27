import { Suspense } from 'react'
import CallbackClient from './callback-client'

export const dynamic = 'force-dynamic'

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing login...</p>
        </div>
      </div>
    }>
      <CallbackClient />
    </Suspense>
  )
}
