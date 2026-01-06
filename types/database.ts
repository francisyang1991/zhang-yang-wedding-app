export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      schedule_events: {
        Row: {
          id: string
          title: string
          day: string
          date: string
          time: string
          location: string
          description: string | null
          icon: string
          attire: string | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          day: string
          date: string
          time: string
          location: string
          description?: string | null
          icon: string
          attire?: string | null
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          day?: string
          date?: string
          time?: string
          location?: string
          description?: string | null
          icon?: string
          attire?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      guests: {
        Row: {
          id: string
          family_id: string | null
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          rsvp_status: 'Pending' | 'Attending' | 'Declined'
          accommodation: 'andaz' | 'ac_hotel' | 'self' | null
          room_detail: string | null
          booking_method: string | null
          meal_choice: string | null
          dietary_restrictions: string | null
          plus_one: boolean
          plus_one_name: string | null
          note: string | null
          created_at: string
          updated_at: string
          last_updated: string
        }
        Insert: {
          id?: string
          family_id?: string | null
          first_name: string
          last_name: string
          email?: string | null
          phone?: string | null
          rsvp_status?: 'Pending' | 'Attending' | 'Declined'
          accommodation?: 'andaz' | 'ac_hotel' | 'self' | null
          room_detail?: string | null
          booking_method?: string | null
          meal_choice?: string | null
          dietary_restrictions?: string | null
          plus_one?: boolean
          plus_one_name?: string | null
          note?: string | null
          created_at?: string
          updated_at?: string
          last_updated?: string
        }
        Update: {
          id?: string
          family_id?: string | null
          first_name?: string
          last_name?: string
          email?: string | null
          phone?: string | null
          rsvp_status?: 'Pending' | 'Attending' | 'Declined'
          accommodation?: 'andaz' | 'ac_hotel' | 'self' | null
          room_detail?: string | null
          booking_method?: string | null
          meal_choice?: string | null
          dietary_restrictions?: string | null
          plus_one?: boolean
          plus_one_name?: string | null
          note?: string | null
          created_at?: string
          updated_at?: string
          last_updated?: string
        }
      }
      photos: {
        Row: {
          id: string
          filename: string
          original_name: string
          url: string
          thumbnail_url: string | null
          category: 'hero' | 'couple' | 'story' | 'gallery'
          alt_text: string | null
          caption: string | null
          order_index: number
          is_featured: boolean
          uploaded_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          filename: string
          original_name: string
          url: string
          thumbnail_url?: string | null
          category: 'hero' | 'couple' | 'story' | 'gallery'
          alt_text?: string | null
          caption?: string | null
          order_index?: number
          is_featured?: boolean
          uploaded_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          filename?: string
          original_name?: string
          url?: string
          thumbnail_url?: string | null
          category?: 'hero' | 'couple' | 'story' | 'gallery'
          alt_text?: string | null
          caption?: string | null
          order_index?: number
          is_featured?: boolean
          uploaded_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      story_content: {
        Row: {
          id: string
          title: string
          content: string
          order_index: number
          is_active: boolean
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          order_index?: number
          is_active?: boolean
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          order_index?: number
          is_active?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      admin_settings: {
        Row: {
          id: string
          key: string
          value: Json
          description: string | null
          updated_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          description?: string | null
          updated_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          description?: string | null
          updated_by?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      rsvp_status: 'Pending' | 'Attending' | 'Declined'
      accommodation_type: 'andaz' | 'ac_hotel' | 'self'
      photo_category: 'hero' | 'couple' | 'story' | 'gallery'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}