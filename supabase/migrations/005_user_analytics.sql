-- 用户分析查询脚本
-- 在Supabase SQL编辑器中运行这些查询

-- 1. 查看总用户数
SELECT COUNT(*) as total_users FROM auth.users;

-- 2. 查看活跃用户数（有创建服装项目的用户）
SELECT COUNT(DISTINCT user_id) as active_users 
FROM clothing_items 
WHERE user_id IS NOT NULL;

-- 3. 查看每个用户创建的服装项目数量
SELECT 
  u.email,
  u.created_at as user_created_at,
  COUNT(c.id) as item_count,
  MAX(c.created_at) as last_activity
FROM auth.users u
LEFT JOIN clothing_items c ON u.id = c.user_id
GROUP BY u.id, u.email, u.created_at
ORDER BY item_count DESC;

-- 4. 查看用户注册趋势（按月份）
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as new_users
FROM auth.users
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- 5. 查看最近活跃的用户
SELECT 
  u.email,
  u.created_at as user_created_at,
  COUNT(c.id) as item_count,
  MAX(c.updated_at) as last_activity
FROM auth.users u
LEFT JOIN clothing_items c ON u.id = c.user_id
WHERE c.updated_at >= NOW() - INTERVAL '30 days'
GROUP BY u.id, u.email, u.created_at
ORDER BY last_activity DESC;

-- 6. 查看用户留存率（7天、30天）
-- 7天内活跃用户
SELECT COUNT(DISTINCT u.id) as active_7d
FROM auth.users u
JOIN clothing_items c ON u.id = c.user_id
WHERE c.updated_at >= NOW() - INTERVAL '7 days';

-- 30天内活跃用户
SELECT COUNT(DISTINCT u.id) as active_30d
FROM auth.users u
JOIN clothing_items c ON u.id = c.user_id
WHERE c.updated_at >= NOW() - INTERVAL '30 days';
