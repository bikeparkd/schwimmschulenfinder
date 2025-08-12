export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      geolocations: {
        Row: {
          country: string | null
          created_at: string | null
          latitude: number | null
          longitude: number | null
          postal_code: number | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          latitude?: number | null
          longitude?: number | null
          postal_code?: number | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          latitude?: number | null
          longitude?: number | null
          postal_code?: number | null
        }
        Relationships: []
      }
      schwimmschule: {
        Row: {
          about: Json | null
          address: string | null
          categories: Json | null
          closed_on: string | null
          coordinates: Json | null
          description: string | null
          detailed_address: Json | null
          detailed_reviews: Json | null
          featured_image: string | null
          featured_question: string | null
          featured_reviews: Json | null
          hours: Json | null
          images: Json | null
          is_permanently_closed: string | null
          is_temporarily_closed: string | null
          Land: string | null
          link: string | null
          main_category: string | null
          menu: string | null
          most_popular_times: string | null
          name: string | null
          owner: Json | null
          phone: string | null
          place_id: string
          plus_code: string | null
          PLZ: string | null
          popular_times: string | null
          price_range: string | null
          query: string | null
          rating: string | null
          review_keywords: Json | null
          reviews: string | null
          reviews_link: string | null
          reviews_per_rating: Json | null
          Stadt: string | null
          status: string | null
          time_zone: string | null
          website: string | null
          workday_timing: string | null
        }
        Insert: {
          about?: Json | null
          address?: string | null
          categories?: Json | null
          closed_on?: string | null
          coordinates?: Json | null
          description?: string | null
          detailed_address?: Json | null
          detailed_reviews?: Json | null
          featured_image?: string | null
          featured_question?: string | null
          featured_reviews?: Json | null
          hours?: Json | null
          images?: Json | null
          is_permanently_closed?: string | null
          is_temporarily_closed?: string | null
          Land?: string | null
          link?: string | null
          main_category?: string | null
          menu?: string | null
          most_popular_times?: string | null
          name?: string | null
          owner?: Json | null
          phone?: string | null
          place_id: string
          plus_code?: string | null
          PLZ?: string | null
          popular_times?: string | null
          price_range?: string | null
          query?: string | null
          rating?: string | null
          review_keywords?: Json | null
          reviews?: string | null
          reviews_link?: string | null
          reviews_per_rating?: Json | null
          Stadt?: string | null
          status?: string | null
          time_zone?: string | null
          website?: string | null
          workday_timing?: string | null
        }
        Update: {
          about?: Json | null
          address?: string | null
          categories?: Json | null
          closed_on?: string | null
          coordinates?: Json | null
          description?: string | null
          detailed_address?: Json | null
          detailed_reviews?: Json | null
          featured_image?: string | null
          featured_question?: string | null
          featured_reviews?: Json | null
          hours?: Json | null
          images?: Json | null
          is_permanently_closed?: string | null
          is_temporarily_closed?: string | null
          Land?: string | null
          link?: string | null
          main_category?: string | null
          menu?: string | null
          most_popular_times?: string | null
          name?: string | null
          owner?: Json | null
          phone?: string | null
          place_id?: string
          plus_code?: string | null
          PLZ?: string | null
          popular_times?: string | null
          price_range?: string | null
          query?: string | null
          rating?: string | null
          review_keywords?: Json | null
          reviews?: string | null
          reviews_link?: string | null
          reviews_per_rating?: Json | null
          Stadt?: string | null
          status?: string | null
          time_zone?: string | null
          website?: string | null
          workday_timing?: string | null
        }
        Relationships: []
      }
      schwimmschule_registrations: {
        Row: {
          address: string
          admin_notes: string | null
          city: string
          contact_person_name: string | null
          contact_person_role: string | null
          created_at: string
          description: string | null
          email: string
          features: string[] | null
          id: string
          image_url: string | null
          name: string
          opening_hours: Json | null
          phone: string | null
          postal_code: string
          status: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address: string
          admin_notes?: string | null
          city: string
          contact_person_name?: string | null
          contact_person_role?: string | null
          created_at?: string
          description?: string | null
          email: string
          features?: string[] | null
          id?: string
          image_url?: string | null
          name: string
          opening_hours?: Json | null
          phone?: string | null
          postal_code: string
          status?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string
          admin_notes?: string | null
          city?: string
          contact_person_name?: string | null
          contact_person_role?: string | null
          created_at?: string
          description?: string | null
          email?: string
          features?: string[] | null
          id?: string
          image_url?: string | null
          name?: string
          opening_hours?: Json | null
          phone?: string | null
          postal_code?: string
          status?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      schwimmschulen_import: {
        Row: {
          address: string | null
          can_claim: string | null
          categories: string | null
          city: string | null
          closed_on: string | null
          created_at: string
          description: string | null
          featured_image: string | null
          id: string
          is_temporarily_closed: string | null
          link: string | null
          main_category: string | null
          name: string
          owner_name: string | null
          owner_profile_link: string | null
          phone: string | null
          place_id: string | null
          query: string | null
          rating: string | null
          review_keywords: string | null
          reviews: string | null
          street: string | null
          updated_at: string
          website: string | null
          workday_timing: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          can_claim?: string | null
          categories?: string | null
          city?: string | null
          closed_on?: string | null
          created_at?: string
          description?: string | null
          featured_image?: string | null
          id?: string
          is_temporarily_closed?: string | null
          link?: string | null
          main_category?: string | null
          name: string
          owner_name?: string | null
          owner_profile_link?: string | null
          phone?: string | null
          place_id?: string | null
          query?: string | null
          rating?: string | null
          review_keywords?: string | null
          reviews?: string | null
          street?: string | null
          updated_at?: string
          website?: string | null
          workday_timing?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          can_claim?: string | null
          categories?: string | null
          city?: string | null
          closed_on?: string | null
          created_at?: string
          description?: string | null
          featured_image?: string | null
          id?: string
          is_temporarily_closed?: string | null
          link?: string | null
          main_category?: string | null
          name?: string
          owner_name?: string | null
          owner_profile_link?: string | null
          phone?: string | null
          place_id?: string | null
          query?: string | null
          rating?: string | null
          review_keywords?: string | null
          reviews?: string | null
          street?: string | null
          updated_at?: string
          website?: string | null
          workday_timing?: string | null
          zip?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_distance_km: {
        Args: { lat1: number; lon1: number; lat2: number; lon2: number }
        Returns: number
      }
      get_coordinates_by_postal_code: {
        Args: { postal_code_input: string }
        Returns: {
          latitude: number
          longitude: number
        }[]
      }
      rating_to_numeric: {
        Args: { "": string }
        Returns: number
      }
      search_schwimmschule_by_location: {
        Args: { search_lat: number; search_lon: number; radius_km?: number }
        Returns: {
          place_id: string
          name: string
          rating: string
          reviews: string
          phone: string
          hours: Json
          detailed_address: Json
          address: string
          link: string
          about: Json
          featured_reviews: Json
          featured_image: string
          website: string
          coordinates: Json
          distance_km: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
