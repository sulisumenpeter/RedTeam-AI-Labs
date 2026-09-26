import { createClient } from '@supabase/supabase-js';

// These should be set in .env.local for a real app
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-xyz.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
