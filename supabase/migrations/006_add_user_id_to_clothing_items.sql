-- 添加user_id字段到clothing_items表
-- 这个迁移会添加user_id字段并更新RLS策略

-- 1. 添加user_id字段
ALTER TABLE clothing_items ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- 2. 更新RLS策略，确保用户只能访问自己的数据
DROP POLICY IF EXISTS "Users can manage their own clothing items" ON clothing_items;

CREATE POLICY "Users can manage their own clothing items" ON clothing_items
  FOR ALL USING (auth.uid() = user_id);

-- 3. 为现有数据设置user_id（如果有的话）
-- 注意：这需要手动处理，因为无法确定现有数据属于哪个用户
-- UPDATE clothing_items SET user_id = auth.uid() WHERE user_id IS NULL;

-- 4. 使user_id字段为必填（在确保所有数据都有user_id之后）
-- ALTER TABLE clothing_items ALTER COLUMN user_id SET NOT NULL;
