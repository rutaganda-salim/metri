
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mgsubqvamygnunlzttsr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nc3VicXZhbXlnbnVubHp0dHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NjYxNDEsImV4cCI6MjA1NjI0MjE0MX0.0JIyLTB2v5UT1SeIV2JBUsGbbM0jamKq-uQojfD3o6Y";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
