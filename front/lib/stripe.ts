import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is missing");

export const stripe = new Stripe(stripeKey, {
  apiVersion: "2025-03-31.basil", // Latest stable version
});

export default stripe;
