-- ============================================
-- TAMV MD-X4™ SOVEREIGN DATABASE SCHEMA
-- Triple Federated Architecture
-- Author: Edwin Oswaldo Castillo Trejo
-- ============================================

-- ENUMS for system types
CREATE TYPE public.membership_level AS ENUM ('citizen', 'creator', 'sovereign', 'guardian', 'architect');
CREATE TYPE public.content_type AS ENUM ('post', 'video', 'audio', 'image', 'dreamspace', 'stream', 'course');
CREATE TYPE public.transaction_type AS ENUM ('earning', 'tip', 'purchase', 'lottery', 'subscription', 'auction');
CREATE TYPE public.channel_type AS ENUM ('public', 'private', 'group', 'direct');
CREATE TYPE public.notification_type AS ENUM ('system', 'social', 'transaction', 'alert', 'isabella');

-- ============================================
-- 1. PROFILES (Citizens of the Federation)
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  bio TEXT,
  membership_level membership_level DEFAULT 'citizen',
  msr_balance DECIMAL(20, 8) DEFAULT 0,
  reputation_score INTEGER DEFAULT 100,
  is_verified BOOLEAN DEFAULT FALSE,
  is_creator BOOLEAN DEFAULT FALSE,
  wallet_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. MSR LEDGER (70/20/10 Justice System)
-- ============================================
CREATE TABLE public.msr_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount DECIMAL(20, 8) NOT NULL,
  transaction_type transaction_type NOT NULL,
  reference_id UUID,
  creator_share DECIMAL(20, 8),
  resilience_share DECIMAL(20, 8),
  kernel_share DECIMAL(20, 8),
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. CONTENT (Posts, Videos, Images, etc.)
-- ============================================
CREATE TABLE public.content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content_type content_type NOT NULL,
  title TEXT,
  body TEXT,
  media_urls TEXT[] DEFAULT '{}',
  thumbnail_url TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  price DECIMAL(20, 8) DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  is_encrypted BOOLEAN DEFAULT FALSE,
  encryption_key TEXT,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. CHANNELS & GROUPS
-- ============================================
CREATE TABLE public.channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  channel_type channel_type DEFAULT 'public',
  is_verified BOOLEAN DEFAULT FALSE,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.channel_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(channel_id, user_id)
);

-- ============================================
-- 5. MESSAGES (Real-time Chat)
-- ============================================
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_encrypted BOOLEAN DEFAULT TRUE,
  media_url TEXT,
  message_type TEXT DEFAULT 'text',
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. DREAMSPACES (4D Virtual Worlds)
-- ============================================
CREATE TABLE public.dreamspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  scene_data JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT TRUE,
  visitor_count INTEGER DEFAULT 0,
  max_visitors INTEGER DEFAULT 100,
  entry_fee DECIMAL(20, 8) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. STREAMING (Live 4D Broadcasts)
-- ============================================
CREATE TABLE public.streams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  is_live BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  viewer_count INTEGER DEFAULT 0,
  total_tips DECIMAL(20, 8) DEFAULT 0,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. UNIVERSITY TAMV (Courses & Certifications)
-- ============================================
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  price DECIMAL(20, 8) DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  student_count INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,
  category TEXT,
  difficulty TEXT DEFAULT 'beginner',
  modules JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  progress INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  certificate_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- ============================================
-- 9. LOTTERY KORIMA
-- ============================================
CREATE TABLE public.lottery_draws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jackpot DECIMAL(20, 8) DEFAULT 0,
  ticket_price DECIMAL(20, 8) DEFAULT 1,
  draw_date TIMESTAMPTZ NOT NULL,
  winner_id UUID REFERENCES public.profiles(id),
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.lottery_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id UUID REFERENCES public.lottery_draws(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  ticket_number TEXT NOT NULL,
  purchased_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 10. MARKETPLACE & AUCTIONS
-- ============================================
CREATE TABLE public.marketplace_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(20, 8) NOT NULL,
  category TEXT,
  images TEXT[] DEFAULT '{}',
  is_auction BOOLEAN DEFAULT FALSE,
  auction_end TIMESTAMPTZ,
  highest_bid DECIMAL(20, 8),
  highest_bidder_id UUID REFERENCES public.profiles(id),
  is_sold BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES public.marketplace_items(id) ON DELETE CASCADE NOT NULL,
  bidder_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(20, 8) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 11. DIGITAL PETS (Mascotas ADN)
-- ============================================
CREATE TABLE public.digital_pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  species TEXT DEFAULT 'anubis',
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  happiness INTEGER DEFAULT 100,
  appearance JSONB DEFAULT '{}',
  abilities TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 12. NOTIFICATIONS
-- ============================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  notification_type notification_type DEFAULT 'system',
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 13. SOCIAL INTERACTIONS
-- ============================================
CREATE TABLE public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content_id UUID REFERENCES public.content(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);

CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content_id UUID REFERENCES public.content(id) ON DELETE CASCADE NOT NULL,
  body TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments(id),
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 14. STORAGE BUCKET REFERENCES
-- ============================================
CREATE TABLE public.media_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.msr_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dreamspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lottery_draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lottery_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_uploads ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Profiles: Public read, own write
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Content: Public read, owner write
CREATE POLICY "Content is viewable by everyone" ON public.content FOR SELECT USING (true);
CREATE POLICY "Users can create own content" ON public.content FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own content" ON public.content FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own content" ON public.content FOR DELETE USING (auth.uid() = user_id);

-- Messages: Only participants can read/write
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Channels: Public read, owner manage
CREATE POLICY "Channels are viewable" ON public.channels FOR SELECT USING (channel_type = 'public' OR EXISTS (SELECT 1 FROM public.channel_members WHERE channel_id = channels.id AND user_id = auth.uid()));
CREATE POLICY "Users can create channels" ON public.channels FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update channels" ON public.channels FOR UPDATE USING (auth.uid() = owner_id);

-- Channel Members
CREATE POLICY "Members can view channel members" ON public.channel_members FOR SELECT USING (true);
CREATE POLICY "Users can join public channels" ON public.channel_members FOR INSERT WITH CHECK (auth.uid() = user_id);

-- DreamSpaces: Public read, owner manage
CREATE POLICY "Public dreamspaces visible" ON public.dreamspaces FOR SELECT USING (is_public = true OR auth.uid() = owner_id);
CREATE POLICY "Users can create dreamspaces" ON public.dreamspaces FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own dreamspaces" ON public.dreamspaces FOR UPDATE USING (auth.uid() = owner_id);

-- Streams: Public read
CREATE POLICY "Streams are viewable" ON public.streams FOR SELECT USING (true);
CREATE POLICY "Hosts can create streams" ON public.streams FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Hosts can update streams" ON public.streams FOR UPDATE USING (auth.uid() = host_id);

-- Courses
CREATE POLICY "Published courses visible" ON public.courses FOR SELECT USING (is_published = true OR auth.uid() = instructor_id);
CREATE POLICY "Instructors can create courses" ON public.courses FOR INSERT WITH CHECK (auth.uid() = instructor_id);
CREATE POLICY "Instructors can update courses" ON public.courses FOR UPDATE USING (auth.uid() = instructor_id);

-- Enrollments
CREATE POLICY "Users can view own enrollments" ON public.enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can enroll" ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Lottery
CREATE POLICY "Lottery draws visible" ON public.lottery_draws FOR SELECT USING (true);
CREATE POLICY "Users can view own tickets" ON public.lottery_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can buy tickets" ON public.lottery_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Marketplace
CREATE POLICY "Marketplace items visible" ON public.marketplace_items FOR SELECT USING (true);
CREATE POLICY "Sellers can create items" ON public.marketplace_items FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update items" ON public.marketplace_items FOR UPDATE USING (auth.uid() = seller_id);

-- Bids
CREATE POLICY "Bids visible to participants" ON public.bids FOR SELECT USING (true);
CREATE POLICY "Users can place bids" ON public.bids FOR INSERT WITH CHECK (auth.uid() = bidder_id);

-- Digital Pets
CREATE POLICY "Pets visible" ON public.digital_pets FOR SELECT USING (true);
CREATE POLICY "Owners can manage pets" ON public.digital_pets FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update pets" ON public.digital_pets FOR UPDATE USING (auth.uid() = owner_id);

-- Notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Social: Follows, Likes, Comments
CREATE POLICY "Follows visible" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users can follow" ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow" ON public.follows FOR DELETE USING (auth.uid() = follower_id);

CREATE POLICY "Likes visible" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Users can like" ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike" ON public.likes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Comments visible" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can comment" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- MSR Ledger: Users can view own transactions
CREATE POLICY "Users view own ledger" ON public.msr_ledger FOR SELECT USING (auth.uid() = user_id);

-- Media uploads
CREATE POLICY "Public media visible" ON public.media_uploads FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users can upload" ON public.media_uploads FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS: Profile creation trigger
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'citizen_' || LEFT(NEW.id::text, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'Ciudadano Soberano'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  
  -- Create default digital pet
  INSERT INTO public.digital_pets (owner_id, name, species)
  VALUES (NEW.id, 'Mini Anubis', 'anubis');
  
  -- Welcome notification
  INSERT INTO public.notifications (user_id, notification_type, title, message)
  VALUES (NEW.id, 'isabella', 'Bienvenido a la Federación Korima', 'Isabella AI te da la bienvenida. Tu viaje soberano comienza ahora.');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- FUNCTION: MSR Distribution 70/20/10
-- ============================================
CREATE OR REPLACE FUNCTION public.execute_msr_distribution(
  p_amount DECIMAL,
  p_creator_id UUID,
  p_transaction_type transaction_type,
  p_reference_id UUID DEFAULT NULL,
  p_description TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_creator_share DECIMAL := p_amount * 0.70;
  v_resilience_share DECIMAL := p_amount * 0.20;
  v_kernel_share DECIMAL := p_amount * 0.10;
  v_ledger_id UUID;
BEGIN
  -- Update creator balance
  UPDATE public.profiles
  SET msr_balance = msr_balance + v_creator_share,
      updated_at = NOW()
  WHERE id = p_creator_id;
  
  -- Record in ledger
  INSERT INTO public.msr_ledger (
    user_id, amount, transaction_type, reference_id,
    creator_share, resilience_share, kernel_share, description
  ) VALUES (
    p_creator_id, p_amount, p_transaction_type, p_reference_id,
    v_creator_share, v_resilience_share, v_kernel_share, p_description
  ) RETURNING id INTO v_ledger_id;
  
  RETURN v_ledger_id;
END;
$$;

-- ============================================
-- Enable Realtime for chat
-- ============================================
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.content REPLICA IDENTITY FULL;