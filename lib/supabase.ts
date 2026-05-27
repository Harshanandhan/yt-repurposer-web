import { createClient } from "@supabase/supabase-js";

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export { getClient as supabase };

export type Plan = "free" | "pro";

export interface DbUser {
  id: string;
  clerk_id: string;
  email: string | null;
  stripe_customer_id: string | null;
  plan: Plan;
  created_at: string;
}

export interface Generation {
  id: string;
  user_id: string;
  video_id: string;
  video_url: string;
  posts: Post[];
  created_at: string;
}

export interface Post {
  style: string;
  content: string;
}

export async function getOrCreateUser(clerkId: string, email?: string): Promise<DbUser> {
  const db = getClient();
  const { data: existing } = await db
    .from("users")
    .select("*")
    .eq("clerk_id", clerkId)
    .single();

  if (existing) return existing;

  const { data, error } = await db
    .from("users")
    .insert({ clerk_id: clerkId, email: email ?? null })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserPlan(clerkId: string): Promise<Plan> {
  const db = getClient();
  const { data } = await db
    .from("users")
    .select("plan")
    .eq("clerk_id", clerkId)
    .single();

  return (data?.plan as Plan) ?? "free";
}

export async function saveGeneration(
  userId: string,
  videoId: string,
  videoUrl: string,
  posts: Post[]
) {
  const db = getClient();
  await db
    .from("generations")
    .insert({ user_id: userId, video_id: videoId, video_url: videoUrl, posts });
}

export async function getUserGenerations(userId: string): Promise<Generation[]> {
  const db = getClient();
  const { data } = await db
    .from("generations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  return data ?? [];
}
