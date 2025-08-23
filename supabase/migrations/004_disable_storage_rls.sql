-- 临时解决方案：禁用存储RLS（仅用于测试）
-- 注意：这不是生产环境的安全做法

-- 禁用 storage.objects 的 RLS
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- 禁用 storage.buckets 的 RLS  
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;

-- 注意：在生产环境中，应该使用适当的RLS策略而不是完全禁用
