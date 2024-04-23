import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/config/libs/stripe";
import { env } from "@/config/env";
import type Stripe from "stripe";

import { handleCheckoutSessionCompleted } from "@/use-cases/handle-checkout-session-completed";
import { handleInvoicePaymentSucceeded } from "@/use-cases/handle-invoice-payment-suceeded";
import { handleCustomerSubscriptionDeleted } from "@/use-cases/handle-customer-subscription-deleted";

const secret = env.STRIPE_WEBHOOK_SECRET;

export const POST = async (req: Request) => {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature")!;

    const event = stripe.webhooks.constructEvent(body, signature, secret);

    const session = event.data.object as Stripe.Checkout.Session;

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(session);
        break;
      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(session);
        break;
      case "customer.subscription.deleted":
        await handleCustomerSubscriptionDeleted(session);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ result: event, ok: true });
  } catch (error) {
    console.error(error);
  }
};
