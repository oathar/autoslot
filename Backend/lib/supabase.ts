// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://klnsqwgtrnkllpzkvevj.supabase.co'

const supabaseKey = process.env.SUPABASE_KEY

if (!supabaseKey) {
  console.warn('⚠️ Missing SUPABASE_KEY environment variable. Supabase features will not work.');
}

// Create client only if key exists, otherwise export null
export const supabase = supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null

