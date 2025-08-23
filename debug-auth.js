// 调试认证配置的脚本
console.log('=== Digital Wardrobe 认证调试信息 ===')

// 检查环境变量
console.log('\n1. 环境变量检查:')
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '已设置' : '未设置')
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '已设置' : '未设置')

// 检查浏览器环境
if (typeof window !== 'undefined') {
  console.log('\n2. 浏览器环境检查:')
  console.log('当前URL:', window.location.href)
  console.log('User Agent:', navigator.userAgent)
  
  // 检查是否有认证相关的cookie
  console.log('\n3. Cookie检查:')
  console.log('所有cookies:', document.cookie)
  console.log('dw_auth cookie:', document.cookie.includes('dw_auth') ? '存在' : '不存在')
  
  // 检查是否有第三方认证服务
  console.log('\n4. 第三方服务检查:')
  const scripts = Array.from(document.scripts).map(s => s.src)
  const authScripts = scripts.filter(src => 
    src.includes('auth') || 
    src.includes('google') || 
    src.includes('github') ||
    src.includes('supabase')
  )
  console.log('认证相关脚本:', authScripts)
  
  // 检查localStorage
  console.log('\n5. LocalStorage检查:')
  const authKeys = Object.keys(localStorage).filter(key => 
    key.includes('auth') || 
    key.includes('supabase') ||
    key.includes('user')
  )
  console.log('认证相关localStorage:', authKeys)
}

// 检查Next.js配置
console.log('\n6. Next.js配置检查:')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('VERCEL:', process.env.VERCEL ? '是Vercel环境' : '非Vercel环境')
console.log('NETLIFY:', process.env.NETLIFY ? '是Netlify环境' : '非Netlify环境')

console.log('\n=== 调试完成 ===')
