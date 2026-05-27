import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getOrCreateUser } from "@/lib/supabase";
import { createCheckoutSession } from "@/lib/stripe";

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must be signed in to upgrade." }, { status: 401 });
  }

  const dbUser = await getOrCreateUser(user.id, user.email ?? undefined);

  if (dbUser.plan === "pro") {
    return NextResponse.json({ error: "Already on Pro plan." }, { status: 400 });
  }

  const session = await createCheckoutSession(
    user.id,
    user.email ?? "",
    dbUser.stripe_customer_id
  );

  return NextResponse.json({ url: session.url });
}
