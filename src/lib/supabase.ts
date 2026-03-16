import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://afcjkbufqhwezmmidqmj.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmY2prYnVmcWh3ZXptbWlkcW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NjQxNTcsImV4cCI6MjA4OTI0MDE1N30.UxuczDmt8QKuzcir-27_i-JjypgJXaA3bPbjkhdNbq8'

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