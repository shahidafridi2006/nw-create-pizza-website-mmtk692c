import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '__SUPABASE_URL__'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '__SUPABASE_ANON_KEY__'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      pizzas: {
        Row: {
          id: number
          name: string
          description: string
          price_small: number
          price_medium: number
          price_large: number
          image_url: string
          category: string
          ingredients: string[]
          is_vegetarian: boolean
          is_spicy: boolean
          is_popular: boolean
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description: string
          price_small: number
          price_medium: number
          price_large: number
          image_url: string
          category: string
          ingredients?: string[]
          is_vegetarian?: boolean
          is_spicy?: boolean
          is_popular?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string
          price_small?: number
          price_medium?: number
          price_large?: number
          image_url?: string
          category?: string
          ingredients?: string[]
          is_vegetarian?: boolean
          is_spicy?: boolean
          is_popular?: boolean
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: number
          customer_name: string
          customer_email: string
          customer_phone: string
          delivery_address: string
          delivery_instructions: string | null
          total_amount: number
          status: string
          estimated_delivery: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          customer_name: string
          customer_email: string
          customer_phone: string
          delivery_address: string
          delivery_instructions?: string | null
          total_amount: number
          status?: string
          estimated_delivery?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          delivery_address?: string
          delivery_instructions?: string | null
          total_amount?: number
          status?: string
          estimated_delivery?: string
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: number
          order_id: number
          pizza_id: number
          pizza_name: string
          size: string
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: number
          order_id: number
          pizza_id: number
          pizza_name: string
          size: string
          quantity: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: number
          order_id?: number
          pizza_id?: number
          pizza_name?: string
          size?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
        }
      }
    }
  }
}