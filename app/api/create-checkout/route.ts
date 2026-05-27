import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";
import { getOrCreateUser } from "@/lib/supabase";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";
  const dbUser = await getOrCreateUser(userId, email);

  const session = await createCheckoutSession(userId, email, dbUser.stripe_customer_id);
  return NextResponse.json({ url: session.url });
}
