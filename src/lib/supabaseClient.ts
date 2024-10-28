import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
console.log("🚀 | supabaseUrl:", supabaseUrl);
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const createClient = () => createBrowserClient(supabaseUrl, supabaseAnonKey);

export const supabase = () => createBrowserClient(supabaseUrl, supabaseAnonKey);
