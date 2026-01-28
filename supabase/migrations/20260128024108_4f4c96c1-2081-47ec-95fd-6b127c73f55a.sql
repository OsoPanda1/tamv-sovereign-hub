-- =====================================================
-- MSR STAKING SYSTEM - TAMV MD-X4™
-- Pools, APY Dinámico, Auto-Compound, Distribución 20/30/50
-- =====================================================

-- Función para updated_at (si no existe)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Enum para tipos de pool
CREATE TYPE public.staking_pool_type AS ENUM ('flexible', 'locked_30', 'locked_90', 'locked_180', 'locked_365', 'governance');

-- Enum para estado de posición
CREATE TYPE public.staking_position_status AS ENUM ('active', 'unstaking', 'completed', 'cancelled');

-- Enum para tipo de reward
CREATE TYPE public.staking_reward_type AS ENUM ('yield', 'bonus', 'referral', 'governance', 'compound');

-- TABLA: Pools de Staking
CREATE TABLE public.staking_pools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  pool_type staking_pool_type NOT NULL DEFAULT 'flexible',
  base_apy DECIMAL(10,4) NOT NULL DEFAULT 5.0000,
  max_apy DECIMAL(10,4) NOT NULL DEFAULT 25.0000,
  current_apy DECIMAL(10,4) NOT NULL DEFAULT 5.0000,
  fenix_share DECIMAL(5,4) NOT NULL DEFAULT 0.2000,
  infra_share DECIMAL(5,4) NOT NULL DEFAULT 0.3000,
  utility_share DECIMAL(5,4) NOT NULL DEFAULT 0.5000,
  min_stake DECIMAL(18,2) NOT NULL DEFAULT 10.00,
  max_stake DECIMAL(18,2) DEFAULT NULL,
  total_staked DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  total_capacity DECIMAL(18,2) DEFAULT NULL,
  lock_days INTEGER NOT NULL DEFAULT 0,
  early_unstake_penalty DECIMAL(5,4) NOT NULL DEFAULT 0.1000,
  auto_compound_enabled BOOLEAN NOT NULL DEFAULT true,
  compound_frequency_hours INTEGER NOT NULL DEFAULT 24,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- TABLA: Posiciones de Staking
CREATE TABLE public.staking_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  pool_id UUID REFERENCES public.staking_pools(id) ON DELETE CASCADE NOT NULL,
  staked_amount DECIMAL(18,2) NOT NULL,
  compounded_amount DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  total_earned DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  pending_rewards DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  locked_apy DECIMAL(10,4) NOT NULL,
  staked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  lock_until TIMESTAMPTZ,
  last_compound_at TIMESTAMPTZ DEFAULT now(),
  last_claim_at TIMESTAMPTZ,
  unstaked_at TIMESTAMPTZ,
  status staking_position_status NOT NULL DEFAULT 'active',
  auto_compound BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT positive_stake CHECK (staked_amount > 0)
);

-- TABLA: Historial de Rewards
CREATE TABLE public.staking_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position_id UUID REFERENCES public.staking_positions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  pool_id UUID REFERENCES public.staking_pools(id) ON DELETE CASCADE NOT NULL,
  reward_type staking_reward_type NOT NULL DEFAULT 'yield',
  gross_amount DECIMAL(18,6) NOT NULL,
  fenix_amount DECIMAL(18,6) NOT NULL,
  infra_amount DECIMAL(18,6) NOT NULL,
  net_amount DECIMAL(18,6) NOT NULL,
  apy_at_time DECIMAL(10,4) NOT NULL,
  was_compounded BOOLEAN NOT NULL DEFAULT false,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- TABLA: Configuración Global
CREATE TABLE public.staking_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tvl_threshold_low DECIMAL(18,2) NOT NULL DEFAULT 100000.00,
  tvl_threshold_high DECIMAL(18,2) NOT NULL DEFAULT 10000000.00,
  apy_boost_low_tvl DECIMAL(5,4) NOT NULL DEFAULT 0.5000,
  apy_reduction_high_tvl DECIMAL(5,4) NOT NULL DEFAULT 0.2000,
  lock_30_bonus DECIMAL(5,4) NOT NULL DEFAULT 0.1000,
  lock_90_bonus DECIMAL(5,4) NOT NULL DEFAULT 0.2500,
  lock_180_bonus DECIMAL(5,4) NOT NULL DEFAULT 0.5000,
  lock_365_bonus DECIMAL(5,4) NOT NULL DEFAULT 1.0000,
  global_max_stake_per_user DECIMAL(18,2) DEFAULT NULL,
  min_compound_amount DECIMAL(18,2) NOT NULL DEFAULT 0.01,
  default_fenix_share DECIMAL(5,4) NOT NULL DEFAULT 0.2000,
  default_infra_share DECIMAL(5,4) NOT NULL DEFAULT 0.3000,
  default_utility_share DECIMAL(5,4) NOT NULL DEFAULT 0.5000,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES public.profiles(id)
);

-- ÍNDICES
CREATE INDEX idx_staking_positions_user ON public.staking_positions(user_id);
CREATE INDEX idx_staking_positions_pool ON public.staking_positions(pool_id);
CREATE INDEX idx_staking_positions_status ON public.staking_positions(status);
CREATE INDEX idx_staking_rewards_user ON public.staking_rewards(user_id);
CREATE INDEX idx_staking_rewards_position ON public.staking_rewards(position_id);

-- RLS
ALTER TABLE public.staking_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staking_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staking_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staking_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staking pools are publicly viewable" ON public.staking_pools FOR SELECT USING (true);
CREATE POLICY "Users can view own staking positions" ON public.staking_positions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create staking positions" ON public.staking_positions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own staking positions" ON public.staking_positions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own staking rewards" ON public.staking_rewards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Staking config is publicly viewable" ON public.staking_config FOR SELECT USING (true);

-- FUNCIÓN: Calcular APY dinámico
CREATE OR REPLACE FUNCTION public.calculate_dynamic_apy(p_pool_id UUID)
RETURNS DECIMAL(10,4) LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_pool staking_pools%ROWTYPE;
  v_config staking_config%ROWTYPE;
  v_total_tvl DECIMAL(18,2);
  v_dynamic_apy DECIMAL(10,4);
  v_tvl_modifier DECIMAL(5,4);
BEGIN
  SELECT * INTO v_pool FROM staking_pools WHERE id = p_pool_id;
  SELECT * INTO v_config FROM staking_config LIMIT 1;
  IF v_pool IS NULL OR v_config IS NULL THEN RETURN 0; END IF;
  SELECT COALESCE(SUM(total_staked), 0) INTO v_total_tvl FROM staking_pools WHERE is_active = true;
  IF v_total_tvl < v_config.tvl_threshold_low THEN
    v_tvl_modifier := 1 + v_config.apy_boost_low_tvl;
  ELSIF v_total_tvl > v_config.tvl_threshold_high THEN
    v_tvl_modifier := 1 - v_config.apy_reduction_high_tvl;
  ELSE v_tvl_modifier := 1; END IF;
  v_dynamic_apy := v_pool.base_apy * v_tvl_modifier;
  CASE v_pool.pool_type
    WHEN 'locked_30' THEN v_dynamic_apy := v_dynamic_apy * (1 + v_config.lock_30_bonus);
    WHEN 'locked_90' THEN v_dynamic_apy := v_dynamic_apy * (1 + v_config.lock_90_bonus);
    WHEN 'locked_180' THEN v_dynamic_apy := v_dynamic_apy * (1 + v_config.lock_180_bonus);
    WHEN 'locked_365' THEN v_dynamic_apy := v_dynamic_apy * (1 + v_config.lock_365_bonus);
    ELSE NULL;
  END CASE;
  IF v_dynamic_apy > v_pool.max_apy THEN v_dynamic_apy := v_pool.max_apy; END IF;
  RETURN v_dynamic_apy;
END; $$;

-- FUNCIÓN: Ejecutar stake
CREATE OR REPLACE FUNCTION public.execute_stake(p_user_id UUID, p_pool_id UUID, p_amount DECIMAL(18,2), p_auto_compound BOOLEAN DEFAULT true)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_pool staking_pools%ROWTYPE;
  v_user_balance DECIMAL(18,2);
  v_current_apy DECIMAL(10,4);
  v_lock_until TIMESTAMPTZ;
  v_position_id UUID;
BEGIN
  SELECT * INTO v_pool FROM staking_pools WHERE id = p_pool_id AND is_active = true;
  IF v_pool IS NULL THEN RAISE EXCEPTION 'Pool no disponible'; END IF;
  IF p_amount < v_pool.min_stake THEN RAISE EXCEPTION 'Monto mínimo: % MSR', v_pool.min_stake; END IF;
  IF v_pool.max_stake IS NOT NULL AND p_amount > v_pool.max_stake THEN RAISE EXCEPTION 'Monto máximo: % MSR', v_pool.max_stake; END IF;
  IF v_pool.total_capacity IS NOT NULL AND (v_pool.total_staked + p_amount) > v_pool.total_capacity THEN RAISE EXCEPTION 'Pool sin capacidad'; END IF;
  SELECT msr_balance INTO v_user_balance FROM profiles WHERE id = p_user_id;
  IF v_user_balance < p_amount THEN RAISE EXCEPTION 'Balance insuficiente'; END IF;
  v_current_apy := calculate_dynamic_apy(p_pool_id);
  IF v_pool.lock_days > 0 THEN v_lock_until := now() + (v_pool.lock_days || ' days')::INTERVAL; END IF;
  UPDATE profiles SET msr_balance = msr_balance - p_amount, updated_at = now() WHERE id = p_user_id;
  INSERT INTO staking_positions (user_id, pool_id, staked_amount, locked_apy, lock_until, auto_compound, status)
  VALUES (p_user_id, p_pool_id, p_amount, v_current_apy, v_lock_until, p_auto_compound, 'active') RETURNING id INTO v_position_id;
  UPDATE staking_pools SET total_staked = total_staked + p_amount, updated_at = now() WHERE id = p_pool_id;
  RETURN v_position_id;
END; $$;

-- FUNCIÓN: Ejecutar unstake
CREATE OR REPLACE FUNCTION public.execute_unstake(p_position_id UUID, p_force_early BOOLEAN DEFAULT false)
RETURNS DECIMAL(18,2) LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_position staking_positions%ROWTYPE;
  v_pool staking_pools%ROWTYPE;
  v_total_amount DECIMAL(18,2);
  v_penalty DECIMAL(18,2) := 0;
  v_final_amount DECIMAL(18,2);
BEGIN
  SELECT * INTO v_position FROM staking_positions WHERE id = p_position_id AND status = 'active';
  IF v_position IS NULL THEN RAISE EXCEPTION 'Posición no encontrada'; END IF;
  SELECT * INTO v_pool FROM staking_pools WHERE id = v_position.pool_id;
  IF v_position.lock_until IS NOT NULL AND v_position.lock_until > now() THEN
    IF NOT p_force_early THEN RAISE EXCEPTION 'Posición bloqueada hasta %', v_position.lock_until; END IF;
    v_penalty := (v_position.staked_amount + v_position.compounded_amount) * v_pool.early_unstake_penalty;
  END IF;
  v_total_amount := v_position.staked_amount + v_position.compounded_amount + v_position.pending_rewards;
  v_final_amount := v_total_amount - v_penalty;
  UPDATE staking_positions SET status = 'completed', unstaked_at = now(), updated_at = now() WHERE id = p_position_id;
  UPDATE profiles SET msr_balance = msr_balance + v_final_amount, updated_at = now() WHERE id = v_position.user_id;
  UPDATE staking_pools SET total_staked = total_staked - (v_position.staked_amount + v_position.compounded_amount), updated_at = now() WHERE id = v_pool.id;
  RETURN v_final_amount;
END; $$;

-- INSERTAR CONFIGURACIÓN INICIAL
INSERT INTO public.staking_config (tvl_threshold_low, tvl_threshold_high, apy_boost_low_tvl, apy_reduction_high_tvl,
  lock_30_bonus, lock_90_bonus, lock_180_bonus, lock_365_bonus, min_compound_amount,
  default_fenix_share, default_infra_share, default_utility_share)
VALUES (100000.00, 10000000.00, 0.5000, 0.2000, 0.1000, 0.2500, 0.5000, 1.0000, 0.01, 0.2000, 0.3000, 0.5000);

-- INSERTAR POOLS INICIALES
INSERT INTO public.staking_pools (name, description, pool_type, base_apy, max_apy, lock_days, is_featured) VALUES
('Flexible Korima', 'Retira cuando quieras. APY base sin bonus.', 'flexible', 5.0000, 15.0000, 0, true),
('Guardián 30', 'Lock 30 días. +10% bonus APY.', 'locked_30', 6.0000, 18.0000, 30, false),
('Centinela 90', 'Lock 90 días. +25% bonus APY.', 'locked_90', 7.5000, 22.0000, 90, true),
('Soberano 180', 'Lock 180 días. +50% bonus APY.', 'locked_180', 10.0000, 30.0000, 180, false),
('Arquitecto 365', 'Lock 1 año. +100% bonus APY.', 'locked_365', 12.5000, 50.0000, 365, true),
('Gobernanza DAO', 'Stake para votar. APY + poder de voto.', 'governance', 8.0000, 25.0000, 90, true);

-- Triggers updated_at
CREATE TRIGGER update_staking_pools_updated_at BEFORE UPDATE ON public.staking_pools FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_staking_positions_updated_at BEFORE UPDATE ON public.staking_positions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();