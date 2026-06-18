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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      accommodations: {
        Row: {
          address: string | null
          amenities: Json
          business_type: string | null
          category: string | null
          checkin_time: string | null
          checkout_time: string | null
          city: string | null
          country: string | null
          created_at: string
          created_by: string | null
          full_description: string | null
          house_rules: Json
          id: string
          instagram: string | null
          is_featured: boolean
          latitude: number | null
          location: string | null
          longitude: number | null
          name: string
          neighborhood: string | null
          photos: Json
          rating: number | null
          review_count: number | null
          rooms: Json
          segment: string | null
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          short_description: string | null
          slug: string
          source_platform: string | null
          source_url: string | null
          state: string | null
          status: string
          subcategory: string | null
          updated_at: string
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          amenities?: Json
          business_type?: string | null
          category?: string | null
          checkin_time?: string | null
          checkout_time?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          full_description?: string | null
          house_rules?: Json
          id?: string
          instagram?: string | null
          is_featured?: boolean
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name: string
          neighborhood?: string | null
          photos?: Json
          rating?: number | null
          review_count?: number | null
          rooms?: Json
          segment?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug: string
          source_platform?: string | null
          source_url?: string | null
          state?: string | null
          status?: string
          subcategory?: string | null
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          amenities?: Json
          business_type?: string | null
          category?: string | null
          checkin_time?: string | null
          checkout_time?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          full_description?: string | null
          house_rules?: Json
          id?: string
          instagram?: string | null
          is_featured?: boolean
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name?: string
          neighborhood?: string | null
          photos?: Json
          rating?: number | null
          review_count?: number | null
          rooms?: Json
          segment?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug?: string
          source_platform?: string | null
          source_url?: string | null
          state?: string | null
          status?: string
          subcategory?: string | null
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      activity_logs: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          created_at: string
          id: string
          metadata: Json | null
          resource_id: string | null
          resource_type: string | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          after: Json | null
          before: Json | null
          created_at: string
          id: string
          metadata: Json | null
          resource_id: string | null
          resource_type: string | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          after?: Json | null
          before?: Json | null
          created_at?: string
          id?: string
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          after?: Json | null
          before?: Json | null
          created_at?: string
          id?: string
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
        }
        Relationships: []
      }
      backup_snapshots: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          kind: string
          name: string
          notes: string | null
          payload: Json | null
          rows_count: number | null
          size_bytes: number | null
          status: string
          tables_count: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          kind?: string
          name: string
          notes?: string | null
          payload?: Json | null
          rows_count?: number | null
          size_bytes?: number | null
          status?: string
          tables_count?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          kind?: string
          name?: string
          notes?: string | null
          payload?: Json | null
          rows_count?: number | null
          size_bytes?: number | null
          status?: string
          tables_count?: number | null
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string | null
          category_slug: string | null
          content: string | null
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          keywords: string | null
          published: boolean
          published_at: string
          reading_minutes: number | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          category_slug?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          keywords?: string | null
          published?: boolean
          published_at?: string
          reading_minutes?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          category_slug?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          keywords?: string | null
          published?: boolean
          published_at?: string
          reading_minutes?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_slug_fkey"
            columns: ["category_slug"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["slug"]
          },
        ]
      }
      cms_banners: {
        Row: {
          active: boolean
          created_at: string
          created_by: string | null
          cta_label: string | null
          ends_at: string | null
          id: string
          image_url: string
          link_url: string | null
          position: string
          sort_order: number
          starts_at: string | null
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          cta_label?: string | null
          ends_at?: string | null
          id?: string
          image_url: string
          link_url?: string | null
          position?: string
          sort_order?: number
          starts_at?: string | null
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          cta_label?: string | null
          ends_at?: string | null
          id?: string
          image_url?: string
          link_url?: string | null
          position?: string
          sort_order?: number
          starts_at?: string | null
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cms_menu_items: {
        Row: {
          active: boolean
          created_at: string
          id: string
          label: string
          location: string
          open_in_new_tab: boolean
          parent_id: string | null
          sort_order: number
          updated_at: string
          url: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          label: string
          location?: string
          open_in_new_tab?: boolean
          parent_id?: string | null
          sort_order?: number
          updated_at?: string
          url: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          label?: string
          location?: string
          open_in_new_tab?: boolean
          parent_id?: string | null
          sort_order?: number
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_menu_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "cms_menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: []
      }
      invites: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          role: Database["public"]["Enums"]["app_role"]
          status: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          role: Database["public"]["Enums"]["app_role"]
          status?: string
          token: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          status?: string
          token?: string
        }
        Relationships: []
      }
      lead_requests: {
        Row: {
          category: string | null
          created_at: string
          description: string
          email: string
          id: string
          name: string
          source: string | null
          status: string
          updated_at: string
          whatsapp: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description: string
          email: string
          id?: string
          name: string
          source?: string | null
          status?: string
          updated_at?: string
          whatsapp: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string
          email?: string
          id?: string
          name?: string
          source?: string | null
          status?: string
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      listing_events: {
        Row: {
          category: string | null
          created_at: string
          device: string | null
          event_type: string
          id: number
          listing_id: string
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          device?: string | null
          event_type: string
          id?: number
          listing_id: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          device?: string | null
          event_type?: string
          id?: number
          listing_id?: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listing_events_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          address: string | null
          amenities: string[]
          category: Database["public"]["Enums"]["listing_category"]
          created_at: string
          description: string | null
          email: string | null
          extras: Json
          featured: boolean
          id: string
          imported_at: string | null
          instagram: string | null
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          name: string
          neighborhood: string | null
          opening_hours: string | null
          owner_id: string
          pending_changes: Json | null
          pending_changes_at: string | null
          phone: string | null
          photos: string[]
          plan: Database["public"]["Enums"]["listing_plan"]
          price_range: string | null
          services: string[]
          short_description: string | null
          slug: string
          source_platform: string | null
          source_type: string | null
          source_url: string | null
          status: Database["public"]["Enums"]["listing_status"]
          subcategory: string | null
          updated_at: string
          videos: string[]
          website: string | null
          whatsapp: string | null
          whatsapp_message: string | null
        }
        Insert: {
          address?: string | null
          amenities?: string[]
          category: Database["public"]["Enums"]["listing_category"]
          created_at?: string
          description?: string | null
          email?: string | null
          extras?: Json
          featured?: boolean
          id?: string
          imported_at?: string | null
          instagram?: string | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name: string
          neighborhood?: string | null
          opening_hours?: string | null
          owner_id: string
          pending_changes?: Json | null
          pending_changes_at?: string | null
          phone?: string | null
          photos?: string[]
          plan?: Database["public"]["Enums"]["listing_plan"]
          price_range?: string | null
          services?: string[]
          short_description?: string | null
          slug: string
          source_platform?: string | null
          source_type?: string | null
          source_url?: string | null
          status?: Database["public"]["Enums"]["listing_status"]
          subcategory?: string | null
          updated_at?: string
          videos?: string[]
          website?: string | null
          whatsapp?: string | null
          whatsapp_message?: string | null
        }
        Update: {
          address?: string | null
          amenities?: string[]
          category?: Database["public"]["Enums"]["listing_category"]
          created_at?: string
          description?: string | null
          email?: string | null
          extras?: Json
          featured?: boolean
          id?: string
          imported_at?: string | null
          instagram?: string | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name?: string
          neighborhood?: string | null
          opening_hours?: string | null
          owner_id?: string
          pending_changes?: Json | null
          pending_changes_at?: string | null
          phone?: string | null
          photos?: string[]
          plan?: Database["public"]["Enums"]["listing_plan"]
          price_range?: string | null
          services?: string[]
          short_description?: string | null
          slug?: string
          source_platform?: string | null
          source_type?: string | null
          source_url?: string | null
          status?: Database["public"]["Enums"]["listing_status"]
          subcategory?: string | null
          updated_at?: string
          videos?: string[]
          website?: string | null
          whatsapp?: string | null
          whatsapp_message?: string | null
        }
        Relationships: []
      }
      page_content: {
        Row: {
          content_key: string
          content_type: string
          content_value: Json | null
          created_at: string
          id: string
          page_id: string
          updated_at: string
        }
        Insert: {
          content_key: string
          content_type?: string
          content_value?: Json | null
          created_at?: string
          id?: string
          page_id: string
          updated_at?: string
        }
        Update: {
          content_key?: string
          content_type?: string
          content_value?: Json | null
          created_at?: string
          id?: string
          page_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_content_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      page_sections: {
        Row: {
          button_link: string | null
          button_text: string | null
          content: string | null
          created_at: string
          extra: Json
          id: string
          image_url: string | null
          is_visible: boolean
          kind: string
          page_id: string
          section_key: string
          sort_order: number
          subtitle: string | null
          title: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          button_link?: string | null
          button_text?: string | null
          content?: string | null
          created_at?: string
          extra?: Json
          id?: string
          image_url?: string | null
          is_visible?: boolean
          kind?: string
          page_id: string
          section_key: string
          sort_order?: number
          subtitle?: string | null
          title?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          button_link?: string | null
          button_text?: string | null
          content?: string | null
          created_at?: string
          extra?: Json
          id?: string
          image_url?: string | null
          is_visible?: boolean
          kind?: string
          page_id?: string
          section_key?: string
          sort_order?: number
          subtitle?: string | null
          title?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "page_sections_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_system: boolean
          slug: string
          sort_order: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean
          slug: string
          sort_order?: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean
          slug?: string
          sort_order?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          active: boolean
          badge: string | null
          benefits: Json
          billing_period: string
          created_at: string
          currency: string
          description: string | null
          featured_in_search: boolean
          id: string
          name: string
          photo_limit: number
          price_cents: number
          slug: string
          sort_order: number
          trial_days: number
          updated_at: string
          video_limit: number
        }
        Insert: {
          active?: boolean
          badge?: string | null
          benefits?: Json
          billing_period?: string
          created_at?: string
          currency?: string
          description?: string | null
          featured_in_search?: boolean
          id?: string
          name: string
          photo_limit?: number
          price_cents?: number
          slug: string
          sort_order?: number
          trial_days?: number
          updated_at?: string
          video_limit?: number
        }
        Update: {
          active?: boolean
          badge?: string | null
          benefits?: Json
          billing_period?: string
          created_at?: string
          currency?: string
          description?: string | null
          featured_in_search?: boolean
          id?: string
          name?: string
          photo_limit?: number
          price_cents?: number
          slug?: string
          sort_order?: number
          trial_days?: number
          updated_at?: string
          video_limit?: number
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          is_public: boolean
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          is_public?: boolean
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          is_public?: boolean
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      pousada_imagens: {
        Row: {
          created_at: string
          id: string
          imagem_url: string
          ordem: number
          pousada_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          imagem_url: string
          ordem?: number
          pousada_id: string
        }
        Update: {
          created_at?: string
          id?: string
          imagem_url?: string
          ordem?: number
          pousada_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pousada_imagens_pousada_id_fkey"
            columns: ["pousada_id"]
            isOneToOne: false
            referencedRelation: "pousadas"
            referencedColumns: ["id"]
          },
        ]
      }
      pousadas: {
        Row: {
          cidade: string | null
          created_at: string
          descricao: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          owner_id: string
          status: string
          telefone: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          cidade?: string | null
          created_at?: string
          descricao?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          owner_id: string
          status?: string
          telefone?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          cidade?: string | null
          created_at?: string
          descricao?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          owner_id?: string
          status?: string
          telefone?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string
          language: string | null
          name: string | null
          updated_at: string
          user_id: string
          whatsapp: string | null
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          language?: string | null
          name?: string | null
          updated_at?: string
          user_id: string
          whatsapp?: string | null
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          language?: string | null
          name?: string | null
          updated_at?: string
          user_id?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      subscription_payments: {
        Row: {
          amount: number
          created_at: string
          due_date: string | null
          id: string
          invoice_number: string | null
          notes: string | null
          paid_at: string | null
          payment_method: string | null
          period_end: string | null
          period_start: string | null
          reference: string | null
          status: string
          subscription_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          notes?: string | null
          paid_at?: string | null
          payment_method?: string | null
          period_end?: string | null
          period_start?: string | null
          reference?: string | null
          status?: string
          subscription_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          notes?: string | null
          paid_at?: string | null
          payment_method?: string | null
          period_end?: string | null
          period_start?: string | null
          reference?: string | null
          status?: string
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          annual_amount: number | null
          auto_renew: boolean
          billing_cycle: string
          created_at: string
          current_period_end: string | null
          current_period_start: string
          id: string
          listing_id: string
          monthly_amount: number | null
          notes: string | null
          owner_id: string
          plan: Database["public"]["Enums"]["listing_plan"]
          sequence_number: number
          started_at: string
          status: string
          trial_end: string | null
          updated_at: string
        }
        Insert: {
          annual_amount?: number | null
          auto_renew?: boolean
          billing_cycle?: string
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string
          id?: string
          listing_id: string
          monthly_amount?: number | null
          notes?: string | null
          owner_id: string
          plan?: Database["public"]["Enums"]["listing_plan"]
          sequence_number?: number
          started_at?: string
          status?: string
          trial_end?: string | null
          updated_at?: string
        }
        Update: {
          annual_amount?: number | null
          auto_renew?: boolean
          billing_cycle?: string
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string
          id?: string
          listing_id?: string
          monthly_amount?: number | null
          notes?: string | null
          owner_id?: string
          plan?: Database["public"]["Enums"]["listing_plan"]
          sequence_number?: number
          started_at?: string
          status?: string
          trial_end?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_invite: {
        Args: { _token: string }
        Returns: {
          message: string
          role: Database["public"]["Enums"]["app_role"]
          success: boolean
        }[]
      }
      admin_confirm_payment: {
        Args: {
          _amount: number
          _method?: string
          _months?: number
          _notes?: string
          _subscription_id: string
        }
        Returns: Json
      }
      admin_list_subscriptions: {
        Args: never
        Returns: {
          auto_renew: boolean
          billing_cycle: string
          current_period_end: string
          current_period_start: string
          days_remaining: number
          id: string
          last_payment_at: string
          listing_id: string
          listing_name: string
          monthly_amount: number
          owner_email: string
          owner_id: string
          owner_name: string
          plan: string
          started_at: string
          status: string
          total_paid: number
          trial_end: string
        }[]
      }
      create_backup_snapshot: {
        Args: { _kind?: string; _name: string }
        Returns: string
      }
      create_invite: {
        Args: {
          _days?: number
          _email: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: {
          expires_at: string
          id: string
          token: string
        }[]
      }
      find_user_id_by_email: { Args: { _email: string }; Returns: string }
      get_advertiser_financials: { Args: never; Returns: Json }
      get_dashboard_kpis: { Args: { _days?: number }; Returns: Json }
      get_financial_kpis: { Args: { _days?: number }; Returns: Json }
      get_listing_whatsapp_stats: {
        Args: { _days?: number; _listing_id: string }
        Returns: Json
      }
      get_users_with_roles: {
        Args: never
        Returns: {
          created_at: string
          email: string
          name: string
          role: Database["public"]["Enums"]["app_role"]
          role_id: string
          user_id: string
        }[]
      }
      get_whatsapp_funnel: { Args: { _days?: number }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "admin"
        | "user"
        | "super_admin"
        | "financial_manager"
        | "content_manager"
        | "support_agent"
        | "advertiser"
      listing_category: "hospedagem" | "restaurante" | "passeio" | "experiencia"
      listing_plan: "gratuito" | "destaque" | "premium"
      listing_status: "pending" | "approved" | "rejected"
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
      app_role: [
        "admin",
        "user",
        "super_admin",
        "financial_manager",
        "content_manager",
        "support_agent",
        "advertiser",
      ],
      listing_category: ["hospedagem", "restaurante", "passeio", "experiencia"],
      listing_plan: ["gratuito", "destaque", "premium"],
      listing_status: ["pending", "approved", "rejected"],
    },
  },
} as const
