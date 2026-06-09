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
          status: Database["public"]["Enums"]["listing_status"]
          subcategory: string | null
          updated_at: string
          videos: string[]
          website: string | null
          whatsapp: string | null
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
          status?: Database["public"]["Enums"]["listing_status"]
          subcategory?: string | null
          updated_at?: string
          videos?: string[]
          website?: string | null
          whatsapp?: string | null
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
          status?: Database["public"]["Enums"]["listing_status"]
          subcategory?: string | null
          updated_at?: string
          videos?: string[]
          website?: string | null
          whatsapp?: string | null
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
      ],
      listing_category: ["hospedagem", "restaurante", "passeio", "experiencia"],
      listing_plan: ["gratuito", "destaque", "premium"],
      listing_status: ["pending", "approved", "rejected"],
    },
  },
} as const
