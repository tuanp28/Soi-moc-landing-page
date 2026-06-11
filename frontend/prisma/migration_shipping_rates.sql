-- Migration: Create shipping_rates table and seed initial rates

-- 1. Create table
CREATE TABLE IF NOT EXISTS public.shipping_rates (
    id SERIAL PRIMARY KEY,
    province_name TEXT UNIQUE NOT NULL,
    shipping_fee NUMERIC NOT NULL,
    estimated_days TEXT NOT NULL
);

-- 2. Seed data
INSERT INTO public.shipping_rates (province_name, shipping_fee, estimated_days) VALUES
('Hà Nội', 20000, '1-2 ngày'),
('Thạch Thất', 0, 'Trong ngày'),
('Quốc Oai', 0, 'Trong ngày'),
('TP Hồ Chí Minh', 35000, '3-4 ngày'),
('Đà Nẵng', 35000, '3-4 ngày'),
('Các tỉnh khác', 40000, '3-5 ngày')
ON CONFLICT (province_name) DO UPDATE SET
    shipping_fee = EXCLUDED.shipping_fee,
    estimated_days = EXCLUDED.estimated_days;

-- 3. Enable RLS
ALTER TABLE public.shipping_rates ENABLE ROW LEVEL SECURITY;

-- 4. Drop policy if exists and recreate
DROP POLICY IF EXISTS "Allow public read access to shipping_rates" ON public.shipping_rates;
CREATE POLICY "Allow public read access to shipping_rates"
ON public.shipping_rates
FOR SELECT
USING (true);

-- 5. Seed FREESHIP coupon if not exists
INSERT INTO public.coupons (id, code, discount_type, discount_value, min_order_value, max_discount_amount, usage_limit, used_count, limit_per_user, start_date, expiry_date, is_active, created_at)
VALUES (
    'coupon_freeship',
    'FREESHIP',
    'free_shipping',
    0,
    0,
    NULL,
    1000,
    0,
    NULL,
    NOW(),
    NOW() + INTERVAL '1 year',
    TRUE,
    NOW()
)
ON CONFLICT (code) DO NOTHING;
