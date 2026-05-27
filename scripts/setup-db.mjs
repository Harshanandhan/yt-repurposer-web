// Run this manually in the Supabase SQL Editor:
// https://supabase.com/dashboard/project/_/sql/new
//
// CREATE TABLE IF NOT EXISTS users (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   clerk_id TEXT UNIQUE NOT NULL,
//   email TEXT,
//   stripe_customer_id TEXT,
//   plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
//
// CREATE TABLE IF NOT EXISTS generations (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   user_id UUID REFERENCES users(id) ON DELETE CASCADE,
//   video_id TEXT NOT NULL,
//   video_url TEXT NOT NULL,
//   posts JSONB NOT NULL,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
//
// ALTER TABLE users ENABLE ROW LEVEL SECURITY;
// ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
