import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabase as getDb } from "@/lib/supabase";
import { createPortalSession } from "@/lib/stripe";

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const { data: dbUser } = await db
    .from("users")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!dbUser?.stripe_customer_id) {
    return NextResponse.json({ error: "No subscription found." }, { status: 404 });
  }

  const session = await createPortalSession(dbUser.stripe_customer_id);
  return NextResponse.json({ url: session.url });
}
