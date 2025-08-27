export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export default function ConfirmedPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-semibold">已确认</h1>
        <p className="text-gray-600">请回到桌面端窗口，几秒内会自动登录。</p>
      </div>
    </div>
  )
}


