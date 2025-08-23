# Supabase 设置指南

## 1. 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com)
2. 创建新项目
3. 等待项目初始化完成

## 2. 获取项目配置

在项目设置中找到以下信息：
- Project URL
- Anon public key

## 3. 配置环境变量

创建 `.env.local` 文件并添加：

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 4. 创建数据库表

运行数据库迁移：

```bash
# 如果使用 Supabase CLI
supabase db push

# 或者手动在 Supabase Dashboard 中运行 SQL
```

## 5. 创建 Storage 桶

1. 在 Supabase Dashboard 中进入 Storage
2. 创建新桶：`wardrobe-images`
3. 设置权限：
   - 公开读取
   - 认证用户写入

## 6. 设置 RLS 策略

确保 `clothing_items` 表启用了 RLS 并设置了适当的策略。

## 7. 测试功能

启动开发服务器：

```bash
pnpm dev
```

现在应该可以：
- 添加新项目
- 上传图片
- 使用摄像头拍照
- 删除项目
