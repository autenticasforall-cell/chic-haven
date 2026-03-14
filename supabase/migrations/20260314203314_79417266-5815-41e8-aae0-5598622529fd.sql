
-- TABELA: profiles (extensão do auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  cpf TEXT UNIQUE,
  birth_date DATE,
  gender TEXT CHECK (gender IN ('feminino', 'masculino', 'outro', 'prefiro_nao_dizer')),
  avatar_url TEXT,
  shopify_customer_id TEXT,
  accepts_marketing BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABELA: addresses
CREATE TABLE public.addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  label TEXT DEFAULT 'Casa',
  recipient_name TEXT NOT NULL,
  street TEXT NOT NULL,
  number TEXT NOT NULL,
  complement TEXT,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABELA: wishlists
CREATE TABLE public.wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  shopify_product_id TEXT NOT NULL,
  shopify_variant_id TEXT,
  product_title TEXT,
  product_image TEXT,
  product_price NUMERIC(10,2),
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, shopify_product_id)
);

-- TABELA: reviews
CREATE TABLE public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  shopify_product_id TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  title TEXT,
  body TEXT,
  verified_purchase BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABELA: orders_cache
CREATE TABLE public.orders_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  shopify_order_id TEXT UNIQUE NOT NULL,
  shopify_order_number TEXT,
  total_price NUMERIC(10,2),
  currency TEXT DEFAULT 'BRL',
  financial_status TEXT,
  fulfillment_status TEXT,
  line_items JSONB,
  shipping_address JSONB,
  tracking_number TEXT,
  tracking_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABELA: newsletter_subscribers
CREATE TABLE public.newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  source TEXT DEFAULT 'homepage',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABELA: coupon_usage
CREATE TABLE public.coupon_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  coupon_code TEXT NOT NULL,
  shopify_order_id TEXT,
  used_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, coupon_code)
);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES: profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS POLICIES: addresses
CREATE POLICY "Users manage own addresses" ON public.addresses FOR ALL USING (auth.uid() = user_id);

-- RLS POLICIES: wishlists
CREATE POLICY "Users manage own wishlist" ON public.wishlists FOR ALL USING (auth.uid() = user_id);

-- RLS POLICIES: reviews
CREATE POLICY "Anyone can view approved reviews" ON public.reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);

-- RLS POLICIES: orders_cache
CREATE POLICY "Users can view own orders" ON public.orders_cache FOR SELECT USING (auth.uid() = user_id);

-- RLS POLICIES: newsletter_subscribers
CREATE POLICY "Public newsletter insert" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);

-- RLS POLICIES: coupon_usage
CREATE POLICY "Users manage own coupons" ON public.coupon_usage FOR ALL USING (auth.uid() = user_id);

-- TRIGGER: auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- TRIGGER: update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_orders_cache_updated_at BEFORE UPDATE ON public.orders_cache
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
