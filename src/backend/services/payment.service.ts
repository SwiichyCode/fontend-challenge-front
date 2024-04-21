import { stripe } from "@/config/libs/stripe";
import { env } from "@/config/env";
import type Stripe from "stripe";

class PaymentService {
  async createCheckoutSession() {
    try {
      const checkoutSession: Stripe.Response<Stripe.Checkout.Session> =
        await stripe.checkout.sessions.create({
          /*payment_method_types: ["card"],*/
          line_items: [
            {
              price: "price_1P84uXP0a9h6Ik6fLb5TWUfG",
              quantity: 1,
            },
          ],
          mode: "subscription",
          success_url: env.NEXTAUTH_URL,
          cancel_url: env.NEXTAUTH_URL,
        });

      return checkoutSession;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId: string) {
    try {
      const cancelledSubscription: Stripe.Response<Stripe.Subscription> =
        await stripe.subscriptions.cancel(subscriptionId);

      return cancelledSubscription;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

const paymentService = new PaymentService();
export default paymentService;
