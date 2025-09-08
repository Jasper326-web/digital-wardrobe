import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const referer = request.headers.get('referer') || ''
    const userAgent = request.headers.get('user-agent') || ''
    const xRequestedWith = request.headers.get('x-requested-with') || ''
    const cookie = request.headers.get('cookie') || ''

    // 仅在开发环境打印详细日志
    if (process.env.NODE_ENV !== 'production') {
      console.log('[credits] GET', {
        path: url.pathname + url.search,
        referer,
        userAgent,
        xRequestedWith,
        cookie: cookie ? '[present]' : '[none]'
      })
    }

    // 返回空内容但维持 200，避免控制台噪音由 404/重试放大
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store'
      }
    })
  } catch (e) {
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}


