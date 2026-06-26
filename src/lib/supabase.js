export const SUPABASE_URL  = 'https://haxfwofjrfkjwestfzvk.supabase.co';
export const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhheGZ3b2ZqcmZrandlc3RmenZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NTg2NzQsImV4cCI6MjA5NjIzNDY3NH0.j-mo1J0D-xDmsLb1sTBjthKHXMJVu1Y_bj5akCKE07w';
export const SITE_BASE     = 'https://valuelens.tw';

export function supabaseHeaders() {
  return { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` };
}
