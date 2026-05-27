import { NextRequest, NextResponse } from "next/server";
import { stripe as getStripe } from "@/lib/stripe";
import { supabase as getDb } from "@/lib/supabase";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const db = getDb();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const authId = session.metadata?.auth_id;
    const customerId = session.customer as string;

    if (authId) {
      await db
        .from("users")
        .update({ plan: "pro", stripe_customer_id: customerId })
        .eq("id", authId);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    await db
      .from("users")
      .update({ plan: "free" })
      .eq("stripe_customer_id", sub.customer as string);
  }

  if (event.type === "customer.subscription.updated") {
    const sub = event.data.object as Stripe.Subscription;
    const isActive = sub.status === "active" || sub.status === "trialing";
    await db
      .from("users")
      .update({ plan: isActive ? "pro" : "free" })
      .eq("stripe_customer_id", sub.customer as string);
  }

  return NextResponse.json({ received: true });
}
