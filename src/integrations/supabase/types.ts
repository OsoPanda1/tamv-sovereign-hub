export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bids: {
        Row: {
          amount: number
          bidder_id: string
          created_at: string | null
          id: string
          item_id: string
        }
        Insert: {
          amount: number
          bidder_id: string
          created_at?: string | null
          id?: string
          item_id: string
        }
        Update: {
          amount?: number
          bidder_id?: string
          created_at?: string | null
          id?: string
          item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bids_bidder_id_fkey"
            columns: ["bidder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bids_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "marketplace_items"
            referencedColumns: ["id"]
          },
        ]
      }
      channel_members: {
        Row: {
          channel_id: string
          id: string
          joined_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          channel_id: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          channel_id?: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_members_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "channel_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          avatar_url: string | null
          channel_type: Database["public"]["Enums"]["channel_type"] | null
          created_at: string | null
          description: string | null
          id: string
          is_verified: boolean | null
          member_count: number | null
          name: string
          owner_id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          channel_type?: Database["public"]["Enums"]["channel_type"] | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_verified?: boolean | null
          member_count?: number | null
          name: string
          owner_id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          channel_type?: Database["public"]["Enums"]["channel_type"] | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_verified?: boolean | null
          member_count?: number | null
          name?: string
          owner_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "channels_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          body: string
          content_id: string
          created_at: string | null
          id: string
          likes_count: number | null
          parent_id: string | null
          user_id: string
        }
        Insert: {
          body: string
          content_id: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          parent_id?: string | null
          user_id: string
        }
        Update: {
          body?: string
          content_id?: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          parent_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content: {
        Row: {
          body: string | null
          content_type: Database["public"]["Enums"]["content_type"]
          created_at: string | null
          encryption_key: string | null
          id: string
          is_encrypted: boolean | null
          is_premium: boolean | null
          likes_count: number | null
          media_urls: string[] | null
          metadata: Json | null
          price: number | null
          shares_count: number | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string | null
          updated_at: string | null
          user_id: string
          views_count: number | null
        }
        Insert: {
          body?: string | null
          content_type: Database["public"]["Enums"]["content_type"]
          created_at?: string | null
          encryption_key?: string | null
          id?: string
          is_encrypted?: boolean | null
          is_premium?: boolean | null
          likes_count?: number | null
          media_urls?: string[] | null
          metadata?: Json | null
          price?: number | null
          shares_count?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string | null
          user_id: string
          views_count?: number | null
        }
        Update: {
          body?: string | null
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string | null
          encryption_key?: string | null
          id?: string
          is_encrypted?: boolean | null
          is_premium?: boolean | null
          likes_count?: number | null
          media_urls?: string[] | null
          metadata?: Json | null
          price?: number | null
          shares_count?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "content_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          id: string
          instructor_id: string
          is_published: boolean | null
          modules: Json | null
          price: number | null
          rating: number | null
          student_count: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          instructor_id: string
          is_published?: boolean | null
          modules?: Json | null
          price?: number | null
          rating?: number | null
          student_count?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          instructor_id?: string
          is_published?: boolean | null
          modules?: Json | null
          price?: number | null
          rating?: number | null
          student_count?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      digital_pets: {
        Row: {
          abilities: string[] | null
          appearance: Json | null
          created_at: string | null
          experience: number | null
          happiness: number | null
          id: string
          level: number | null
          name: string
          owner_id: string
          species: string | null
          updated_at: string | null
        }
        Insert: {
          abilities?: string[] | null
          appearance?: Json | null
          created_at?: string | null
          experience?: number | null
          happiness?: number | null
          id?: string
          level?: number | null
          name: string
          owner_id: string
          species?: string | null
          updated_at?: string | null
        }
        Update: {
          abilities?: string[] | null
          appearance?: Json | null
          created_at?: string | null
          experience?: number | null
          happiness?: number | null
          id?: string
          level?: number | null
          name?: string
          owner_id?: string
          species?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "digital_pets_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dreamspaces: {
        Row: {
          created_at: string | null
          description: string | null
          entry_fee: number | null
          id: string
          is_public: boolean | null
          max_visitors: number | null
          name: string
          owner_id: string
          scene_data: Json | null
          thumbnail_url: string | null
          updated_at: string | null
          visitor_count: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          entry_fee?: number | null
          id?: string
          is_public?: boolean | null
          max_visitors?: number | null
          name: string
          owner_id: string
          scene_data?: Json | null
          thumbnail_url?: string | null
          updated_at?: string | null
          visitor_count?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          entry_fee?: number | null
          id?: string
          is_public?: boolean | null
          max_visitors?: number | null
          name?: string
          owner_id?: string
          scene_data?: Json | null
          thumbnail_url?: string | null
          updated_at?: string | null
          visitor_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dreamspaces_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          certificate_url: string | null
          completed_at: string | null
          course_id: string
          created_at: string | null
          id: string
          progress: number | null
          user_id: string
        }
        Insert: {
          certificate_url?: string | null
          completed_at?: string | null
          course_id: string
          created_at?: string | null
          id?: string
          progress?: number | null
          user_id: string
        }
        Update: {
          certificate_url?: string | null
          completed_at?: string | null
          course_id?: string
          created_at?: string | null
          id?: string
          progress?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          content_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          content_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          content_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lottery_draws: {
        Row: {
          created_at: string | null
          draw_date: string
          id: string
          is_completed: boolean | null
          jackpot: number | null
          ticket_price: number | null
          winner_id: string | null
        }
        Insert: {
          created_at?: string | null
          draw_date: string
          id?: string
          is_completed?: boolean | null
          jackpot?: number | null
          ticket_price?: number | null
          winner_id?: string | null
        }
        Update: {
          created_at?: string | null
          draw_date?: string
          id?: string
          is_completed?: boolean | null
          jackpot?: number | null
          ticket_price?: number | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lottery_draws_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lottery_tickets: {
        Row: {
          draw_id: string
          id: string
          purchased_at: string | null
          ticket_number: string
          user_id: string
        }
        Insert: {
          draw_id: string
          id?: string
          purchased_at?: string | null
          ticket_number: string
          user_id: string
        }
        Update: {
          draw_id?: string
          id?: string
          purchased_at?: string | null
          ticket_number?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lottery_tickets_draw_id_fkey"
            columns: ["draw_id"]
            isOneToOne: false
            referencedRelation: "lottery_draws"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lottery_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_items: {
        Row: {
          auction_end: string | null
          category: string | null
          created_at: string | null
          description: string | null
          highest_bid: number | null
          highest_bidder_id: string | null
          id: string
          images: string[] | null
          is_auction: boolean | null
          is_sold: boolean | null
          price: number
          seller_id: string
          title: string
        }
        Insert: {
          auction_end?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          highest_bid?: number | null
          highest_bidder_id?: string | null
          id?: string
          images?: string[] | null
          is_auction?: boolean | null
          is_sold?: boolean | null
          price: number
          seller_id: string
          title: string
        }
        Update: {
          auction_end?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          highest_bid?: number | null
          highest_bidder_id?: string | null
          id?: string
          images?: string[] | null
          is_auction?: boolean | null
          is_sold?: boolean | null
          price?: number
          seller_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_items_highest_bidder_id_fkey"
            columns: ["highest_bidder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_items_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      media_uploads: {
        Row: {
          created_at: string | null
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          is_public: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_public?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_public?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_uploads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          channel_id: string | null
          content: string
          created_at: string | null
          id: string
          is_encrypted: boolean | null
          is_read: boolean | null
          media_url: string | null
          message_type: string | null
          metadata: Json | null
          receiver_id: string | null
          sender_id: string
        }
        Insert: {
          channel_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_encrypted?: boolean | null
          is_read?: boolean | null
          media_url?: string | null
          message_type?: string | null
          metadata?: Json | null
          receiver_id?: string | null
          sender_id: string
        }
        Update: {
          channel_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_encrypted?: boolean | null
          is_read?: boolean | null
          media_url?: string | null
          message_type?: string | null
          metadata?: Json | null
          receiver_id?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      msr_ledger: {
        Row: {
          amount: number
          created_at: string | null
          creator_share: number | null
          description: string | null
          id: string
          kernel_share: number | null
          metadata: Json | null
          reference_id: string | null
          resilience_share: number | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          creator_share?: number | null
          description?: string | null
          id?: string
          kernel_share?: number | null
          metadata?: Json | null
          reference_id?: string | null
          resilience_share?: number | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          creator_share?: number | null
          description?: string | null
          id?: string
          kernel_share?: number | null
          metadata?: Json | null
          reference_id?: string | null
          resilience_share?: number | null
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "msr_ledger_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string | null
          metadata: Json | null
          notification_type:
            | Database["public"]["Enums"]["notification_type"]
            | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          metadata?: Json | null
          notification_type?:
            | Database["public"]["Enums"]["notification_type"]
            | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          metadata?: Json | null
          notification_type?:
            | Database["public"]["Enums"]["notification_type"]
            | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string
          is_creator: boolean | null
          is_verified: boolean | null
          membership_level:
            | Database["public"]["Enums"]["membership_level"]
            | null
          msr_balance: number | null
          reputation_score: number | null
          updated_at: string | null
          username: string
          wallet_address: string | null
        }
        Insert: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id: string
          is_creator?: boolean | null
          is_verified?: boolean | null
          membership_level?:
            | Database["public"]["Enums"]["membership_level"]
            | null
          msr_balance?: number | null
          reputation_score?: number | null
          updated_at?: string | null
          username: string
          wallet_address?: string | null
        }
        Update: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          is_creator?: boolean | null
          is_verified?: boolean | null
          membership_level?:
            | Database["public"]["Enums"]["membership_level"]
            | null
          msr_balance?: number | null
          reputation_score?: number | null
          updated_at?: string | null
          username?: string
          wallet_address?: string | null
        }
        Relationships: []
      }
      staking_config: {
        Row: {
          apy_boost_low_tvl: number
          apy_reduction_high_tvl: number
          default_fenix_share: number
          default_infra_share: number
          default_utility_share: number
          global_max_stake_per_user: number | null
          id: string
          lock_180_bonus: number
          lock_30_bonus: number
          lock_365_bonus: number
          lock_90_bonus: number
          min_compound_amount: number
          tvl_threshold_high: number
          tvl_threshold_low: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          apy_boost_low_tvl?: number
          apy_reduction_high_tvl?: number
          default_fenix_share?: number
          default_infra_share?: number
          default_utility_share?: number
          global_max_stake_per_user?: number | null
          id?: string
          lock_180_bonus?: number
          lock_30_bonus?: number
          lock_365_bonus?: number
          lock_90_bonus?: number
          min_compound_amount?: number
          tvl_threshold_high?: number
          tvl_threshold_low?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          apy_boost_low_tvl?: number
          apy_reduction_high_tvl?: number
          default_fenix_share?: number
          default_infra_share?: number
          default_utility_share?: number
          global_max_stake_per_user?: number | null
          id?: string
          lock_180_bonus?: number
          lock_30_bonus?: number
          lock_365_bonus?: number
          lock_90_bonus?: number
          min_compound_amount?: number
          tvl_threshold_high?: number
          tvl_threshold_low?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staking_config_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      staking_pools: {
        Row: {
          auto_compound_enabled: boolean
          base_apy: number
          compound_frequency_hours: number
          created_at: string
          current_apy: number
          description: string | null
          early_unstake_penalty: number
          fenix_share: number
          id: string
          infra_share: number
          is_active: boolean
          is_featured: boolean
          lock_days: number
          max_apy: number
          max_stake: number | null
          metadata: Json | null
          min_stake: number
          name: string
          pool_type: Database["public"]["Enums"]["staking_pool_type"]
          total_capacity: number | null
          total_staked: number
          updated_at: string
          utility_share: number
        }
        Insert: {
          auto_compound_enabled?: boolean
          base_apy?: number
          compound_frequency_hours?: number
          created_at?: string
          current_apy?: number
          description?: string | null
          early_unstake_penalty?: number
          fenix_share?: number
          id?: string
          infra_share?: number
          is_active?: boolean
          is_featured?: boolean
          lock_days?: number
          max_apy?: number
          max_stake?: number | null
          metadata?: Json | null
          min_stake?: number
          name: string
          pool_type?: Database["public"]["Enums"]["staking_pool_type"]
          total_capacity?: number | null
          total_staked?: number
          updated_at?: string
          utility_share?: number
        }
        Update: {
          auto_compound_enabled?: boolean
          base_apy?: number
          compound_frequency_hours?: number
          created_at?: string
          current_apy?: number
          description?: string | null
          early_unstake_penalty?: number
          fenix_share?: number
          id?: string
          infra_share?: number
          is_active?: boolean
          is_featured?: boolean
          lock_days?: number
          max_apy?: number
          max_stake?: number | null
          metadata?: Json | null
          min_stake?: number
          name?: string
          pool_type?: Database["public"]["Enums"]["staking_pool_type"]
          total_capacity?: number | null
          total_staked?: number
          updated_at?: string
          utility_share?: number
        }
        Relationships: []
      }
      staking_positions: {
        Row: {
          auto_compound: boolean
          compounded_amount: number
          created_at: string
          id: string
          last_claim_at: string | null
          last_compound_at: string | null
          lock_until: string | null
          locked_apy: number
          metadata: Json | null
          pending_rewards: number
          pool_id: string
          staked_amount: number
          staked_at: string
          status: Database["public"]["Enums"]["staking_position_status"]
          total_earned: number
          unstaked_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_compound?: boolean
          compounded_amount?: number
          created_at?: string
          id?: string
          last_claim_at?: string | null
          last_compound_at?: string | null
          lock_until?: string | null
          locked_apy: number
          metadata?: Json | null
          pending_rewards?: number
          pool_id: string
          staked_amount: number
          staked_at?: string
          status?: Database["public"]["Enums"]["staking_position_status"]
          total_earned?: number
          unstaked_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_compound?: boolean
          compounded_amount?: number
          created_at?: string
          id?: string
          last_claim_at?: string | null
          last_compound_at?: string | null
          lock_until?: string | null
          locked_apy?: number
          metadata?: Json | null
          pending_rewards?: number
          pool_id?: string
          staked_amount?: number
          staked_at?: string
          status?: Database["public"]["Enums"]["staking_position_status"]
          total_earned?: number
          unstaked_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staking_positions_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: false
            referencedRelation: "staking_pools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staking_positions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      staking_rewards: {
        Row: {
          apy_at_time: number
          created_at: string
          fenix_amount: number
          gross_amount: number
          id: string
          infra_amount: number
          net_amount: number
          period_end: string
          period_start: string
          pool_id: string
          position_id: string
          reward_type: Database["public"]["Enums"]["staking_reward_type"]
          user_id: string
          was_compounded: boolean
        }
        Insert: {
          apy_at_time: number
          created_at?: string
          fenix_amount: number
          gross_amount: number
          id?: string
          infra_amount: number
          net_amount: number
          period_end: string
          period_start: string
          pool_id: string
          position_id: string
          reward_type?: Database["public"]["Enums"]["staking_reward_type"]
          user_id: string
          was_compounded?: boolean
        }
        Update: {
          apy_at_time?: number
          created_at?: string
          fenix_amount?: number
          gross_amount?: number
          id?: string
          infra_amount?: number
          net_amount?: number
          period_end?: string
          period_start?: string
          pool_id?: string
          position_id?: string
          reward_type?: Database["public"]["Enums"]["staking_reward_type"]
          user_id?: string
          was_compounded?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "staking_rewards_pool_id_fkey"
            columns: ["pool_id"]
            isOneToOne: false
            referencedRelation: "staking_pools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staking_rewards_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "staking_positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staking_rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      streams: {
        Row: {
          created_at: string | null
          description: string | null
          ended_at: string | null
          host_id: string
          id: string
          is_live: boolean | null
          is_premium: boolean | null
          started_at: string | null
          thumbnail_url: string | null
          title: string
          total_tips: number | null
          viewer_count: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          ended_at?: string | null
          host_id: string
          id?: string
          is_live?: boolean | null
          is_premium?: boolean | null
          started_at?: string | null
          thumbnail_url?: string | null
          title: string
          total_tips?: number | null
          viewer_count?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          ended_at?: string | null
          host_id?: string
          id?: string
          is_live?: boolean | null
          is_premium?: boolean | null
          started_at?: string | null
          thumbnail_url?: string | null
          title?: string
          total_tips?: number | null
          viewer_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "streams_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_dynamic_apy: { Args: { p_pool_id: string }; Returns: number }
      execute_msr_distribution: {
        Args: {
          p_amount: number
          p_creator_id: string
          p_description?: string
          p_reference_id?: string
          p_transaction_type: Database["public"]["Enums"]["transaction_type"]
        }
        Returns: string
      }
      execute_stake: {
        Args: {
          p_amount: number
          p_auto_compound?: boolean
          p_pool_id: string
          p_user_id: string
        }
        Returns: string
      }
      execute_unstake: {
        Args: { p_force_early?: boolean; p_position_id: string }
        Returns: number
      }
    }
    Enums: {
      channel_type: "public" | "private" | "group" | "direct"
      content_type:
        | "post"
        | "video"
        | "audio"
        | "image"
        | "dreamspace"
        | "stream"
        | "course"
      membership_level:
        | "citizen"
        | "creator"
        | "sovereign"
        | "guardian"
        | "architect"
      notification_type:
        | "system"
        | "social"
        | "transaction"
        | "alert"
        | "isabella"
      staking_pool_type:
        | "flexible"
        | "locked_30"
        | "locked_90"
        | "locked_180"
        | "locked_365"
        | "governance"
      staking_position_status:
        | "active"
        | "unstaking"
        | "completed"
        | "cancelled"
      staking_reward_type:
        | "yield"
        | "bonus"
        | "referral"
        | "governance"
        | "compound"
      transaction_type:
        | "earning"
        | "tip"
        | "purchase"
        | "lottery"
        | "subscription"
        | "auction"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      channel_type: ["public", "private", "group", "direct"],
      content_type: [
        "post",
        "video",
        "audio",
        "image",
        "dreamspace",
        "stream",
        "course",
      ],
      membership_level: [
        "citizen",
        "creator",
        "sovereign",
        "guardian",
        "architect",
      ],
      notification_type: [
        "system",
        "social",
        "transaction",
        "alert",
        "isabella",
      ],
      staking_pool_type: [
        "flexible",
        "locked_30",
        "locked_90",
        "locked_180",
        "locked_365",
        "governance",
      ],
      staking_position_status: [
        "active",
        "unstaking",
        "completed",
        "cancelled",
      ],
      staking_reward_type: [
        "yield",
        "bonus",
        "referral",
        "governance",
        "compound",
      ],
      transaction_type: [
        "earning",
        "tip",
        "purchase",
        "lottery",
        "subscription",
        "auction",
      ],
    },
  },
} as const
