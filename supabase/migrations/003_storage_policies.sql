-- 注意：这些策略需要在Supabase Dashboard的Storage设置中手动配置
-- 或者使用Supabase CLI运行

-- 方法1：在Supabase Dashboard中配置
-- 1. 进入 Storage > Policies
-- 2. 为 wardrobe-images bucket 添加以下策略：

-- 对于 storage.objects 表：
-- INSERT 策略：允许认证用户上传
-- SELECT 策略：允许认证用户查看
-- UPDATE 策略：允许认证用户更新
-- DELETE 策略：允许认证用户删除

-- 对于 storage.buckets 表：
-- ALL 策略：允许认证用户访问 wardrobe-images bucket

-- 方法2：使用Supabase CLI（推荐）
-- 如果你有Supabase CLI，可以运行：
-- supabase db push

-- 方法3：手动在SQL编辑器中运行（需要管理员权限）
-- 以下代码需要在有管理员权限的SQL编辑器中运行：

-- 确保RLS已启用
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- 删除现有策略（如果存在）
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can access wardrobe-images bucket" ON storage.buckets;

-- 创建新的策略
CREATE POLICY "Authenticated users can upload files" ON storage.objects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view files" ON storage.objects
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update files" ON storage.objects
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete files" ON storage.objects
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can access wardrobe-images bucket" ON storage.buckets
  FOR ALL USING (auth.role() = 'authenticated' AND name = 'wardrobe-images');
