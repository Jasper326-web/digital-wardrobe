-- Create clothing_items table
CREATE TABLE IF NOT EXISTS clothing_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image_url TEXT,
  usage_count INTEGER DEFAULT 0,
  original_price DECIMAL(10,2),
  category TEXT NOT NULL CHECK (category IN ('tops', 'pants', 'shoes')),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_clothing_items_category ON clothing_items(category);
CREATE INDEX IF NOT EXISTS idx_clothing_items_created_at ON clothing_items(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE clothing_items ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Users can manage their own clothing items" ON clothing_items
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_clothing_items_updated_at
  BEFORE UPDATE ON clothing_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
