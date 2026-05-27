import { NextRequest, NextResponse } from "next/server";
import { stripe as getStripe } from "@/lib/stripe";
import { supabase as getDb } from "@/lib/supabase";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const db = getDb();
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const clerkId = session.metadata?.clerk_id;
    const customerId = session.customer as string;

    if (clerkId) {
      await db
        .from("users")
        .update({ plan: "pro", stripe_customer_id: customerId })
        .eq("clerk_id", clerkId);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = sub.customer as string;
    await db
      .from("users")
      .update({ plan: "free" })
      .eq("stripe_customer_id", customerId);
  }

  return NextResponse.json({ received: true });
}
