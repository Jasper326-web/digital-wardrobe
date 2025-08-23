-- Enable RLS (Row Level Security)
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clothing_items table
CREATE TABLE IF NOT EXISTS public.clothing_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    image_url TEXT,
    usage_count INTEGER DEFAULT 0,
    original_price DECIMAL(10,2) NOT NULL,
    tags TEXT[] DEFAULT '{}',
    category TEXT CHECK (category IN ('tops', 'pants', 'shoes')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create outfit_records table
CREATE TABLE IF NOT EXISTS public.outfit_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    top_id UUID REFERENCES public.clothing_items(id) ON DELETE SET NULL,
    pants_id UUID REFERENCES public.clothing_items(id) ON DELETE SET NULL,
    shoes_id UUID REFERENCES public.clothing_items(id) ON DELETE SET NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_clothing_items_user_id ON public.clothing_items(user_id);
CREATE INDEX IF NOT EXISTS idx_clothing_items_category ON public.clothing_items(category);
CREATE INDEX IF NOT EXISTS idx_outfit_records_user_id ON public.outfit_records(user_id);
CREATE INDEX IF NOT EXISTS idx_outfit_records_date ON public.outfit_records(date);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clothing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outfit_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for clothing_items
CREATE POLICY "Users can view own clothing items" ON public.clothing_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clothing items" ON public.clothing_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clothing items" ON public.clothing_items
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own clothing items" ON public.clothing_items
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for outfit_records
CREATE POLICY "Users can view own outfit records" ON public.outfit_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own outfit records" ON public.outfit_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own outfit records" ON public.outfit_records
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own outfit records" ON public.outfit_records
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_clothing_items_updated_at
    BEFORE UPDATE ON public.clothing_items
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
