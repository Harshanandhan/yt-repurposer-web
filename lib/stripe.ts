import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-04-22.dahlia",
  });
}

export { getStripe as stripe };

export async function createCheckoutSession(
  authId: string,
  email: string,
  stripeCustomerId: string | null
) {
  const client = getStripe();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID!, quantity: 1 }],
    success_url: `${baseUrl}/dashboard?upgrade=success`,
    cancel_url: `${baseUrl}/pricing`,
    metadata: { auth_id: authId },
  };

  if (stripeCustomerId) {
    params.customer = stripeCustomerId;
  } else {
    params.customer_email = email;
  }

  return client.checkout.sessions.create(params);
}

export async function createPortalSession(stripeCustomerId: string) {
  const client = getStripe();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  return client.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${baseUrl}/dashboard`,
  });
}
