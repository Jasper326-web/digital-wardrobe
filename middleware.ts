import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Minimal auth gate: if no auth cookie, redirect to homepage for protected routes
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 允许访问登出页面
  if (pathname === "/logout") {
    return NextResponse.next()
  }

  const protectedPaths = ["/wardrobe", "/outfit", "/analytics"]
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))

  if (!isProtected) return NextResponse.next()

  const isLoggedIn = Boolean(request.cookies.get("dw_auth"))
  if (!isLoggedIn) {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/wardrobe/:path*", "/outfit/:path*", "/analytics/:path*"],
}


