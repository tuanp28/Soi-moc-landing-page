-- Create wheel_spins table
CREATE TABLE IF NOT EXISTS public.wheel_spins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_ip TEXT NOT NULL,
  browser_agent TEXT NOT NULL,
  prize_id INTEGER NOT NULL CHECK (prize_id >= 1 AND prize_id <= 4),
  coupon_code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) on wheel_spins
ALTER TABLE public.wheel_spins ENABLE ROW LEVEL SECURITY;

-- Disable public direct insert/update
DROP POLICY IF EXISTS "Disable public write" ON public.wheel_spins;
CREATE POLICY "Disable public write" ON public.wheel_spins FOR ALL USING (false);

-- Ensure wheel coupons exist in coupons table
INSERT INTO public.coupons (
  id, code, discount_type, discount_value, min_order_value, max_discount_amount,
  usage_limit, used_count, limit_per_user, start_date, expiry_date, is_active, created_at
)
VALUES
  ('coupon_wheel_10', 'SOIMOC10', 'percentage', 10.0, 100000.0, 30000.0, 1000, 0, 1, NOW(), NOW() + INTERVAL '1 year', TRUE, NOW()),
  ('coupon_wheel_20k', 'SOIMOC20K', 'fixed', 20000.0, 150000.0, NULL, 1000, 0, 1, NOW(), NOW() + INTERVAL '1 year', TRUE, NOW()),
  ('coupon_wheel_50k', 'SOIMOC50K', 'fixed', 50000.0, 300000.0, NULL, 1000, 0, 1, NOW(), NOW() + INTERVAL '1 year', TRUE, NOW()),
  ('coupon_wheel_vip15', 'SOIMOCVIP15', 'percentage', 15.0, 200000.0, 50000.0, 1000, 0, 1, NOW(), NOW() + INTERVAL '1 year', TRUE, NOW())
ON CONFLICT (code) DO NOTHING;

-- Create secure wheel spin RPC function
CREATE OR REPLACE FUNCTION public.spin_the_wheel_secure(
  user_ip TEXT,
  browser_agent TEXT,
  current_user_id UUID DEFAULT NULL
)
RETURNS TABLE (
  prize_id INTEGER,
  coupon_code TEXT,
  prize_name TEXT,
  message TEXT,
  success BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_spin_count_ip INTEGER;
  v_spin_count_user INTEGER;
  v_rand INTEGER;
  v_prize_id INTEGER;
  v_coupon_code TEXT;
  v_prize_name TEXT;
  v_cooldown_interval INTERVAL := INTERVAL '24 hours';
BEGIN
  -- 1. Anti-spam check (cooldown of 24 hours per IP)
  SELECT COUNT(*)
  INTO v_spin_count_ip
  FROM public.wheel_spins
  WHERE wheel_spins.user_ip = spin_the_wheel_secure.user_ip
    AND wheel_spins.created_at > now() - v_cooldown_interval;

  IF v_spin_count_ip >= 1 THEN
    RETURN QUERY SELECT 
      NULL::INTEGER, 
      NULL::TEXT, 
      NULL::TEXT, 
      'Bạn đã quay hôm nay rồi. Mỗi IP chỉ được quay 1 lần trong 24 giờ!'::TEXT, 
      false;
    RETURN;
  END IF;

  -- 2. Anti-spam check (cooldown of 24 hours per authenticated user if provided)
  IF spin_the_wheel_secure.current_user_id IS NOT NULL THEN
    SELECT COUNT(*)
    INTO v_spin_count_user
    FROM public.wheel_spins
    WHERE wheel_spins.user_id = spin_the_wheel_secure.current_user_id
      AND wheel_spins.created_at > now() - v_cooldown_interval;

    IF v_spin_count_user >= 1 THEN
      RETURN QUERY SELECT 
        NULL::INTEGER, 
        NULL::TEXT, 
        NULL::TEXT, 
        'Tài khoản của bạn đã quay hôm nay rồi. Vui lòng quay lại sau 24 giờ!'::TEXT, 
        false;
      RETURN;
    END IF;
  END IF;

  -- 3. Determine prize based on weighted probability (1 to 100)
  v_rand := floor(random() * 100) + 1;

  IF v_rand <= 40 THEN
    v_prize_id := 1;
    v_coupon_code := 'SOIMOC10';
    v_prize_name := 'Voucher Giảm 10%';
  ELSIF v_rand <= 75 THEN
    v_prize_id := 2;
    v_coupon_code := 'SOIMOC20K';
    v_prize_name := 'Voucher Giảm 20k';
  ELSIF v_rand <= 90 THEN
    v_prize_id := 3;
    v_coupon_code := 'SOIMOC50K';
    v_prize_name := 'Voucher Giảm 50k';
  ELSE
    v_prize_id := 4;
    v_coupon_code := 'SOIMOCVIP15';
    v_prize_name := 'Voucher VIP Giảm 15%';
  END IF;

  -- 4. Record spin
  INSERT INTO public.wheel_spins (user_id, user_ip, browser_agent, prize_id, coupon_code)
  VALUES (
    spin_the_wheel_secure.current_user_id,
    spin_the_wheel_secure.user_ip,
    spin_the_wheel_secure.browser_agent,
    v_prize_id,
    v_coupon_code
  );

  -- 5. Return success result
  RETURN QUERY SELECT 
    v_prize_id, 
    v_coupon_code, 
    v_prize_name, 
    'Quay số thành công!'::TEXT, 
    true;
END;
$$;
