import { loadStripe } from "@stripe/stripe-js";
import { useCreateStripeCheckoutSessionMutation } from "../../graphql/createStripeCheckoutSession.generated";
import { PaidPlan } from "../../graphql/types.generated";
import { BoxProps, Button, ButtonProps } from "@chakra-ui/react";
import { FC } from "react";

const PUBLIC_STRIPE_API_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_API_KEY;

/**
 * When clicked, redirects the user to their a Stripe Checkout session for the to upgrade to the paid plan
 */
const UpgradeButton: FC<{ projectId: string } & ButtonProps> = ({
  projectId,
  ...props
}) => {
  const [, createStripeCheckoutSession] =
    useCreateStripeCheckoutSessionMutation();

  const redirectToCheckout = () => {
    if (!PUBLIC_STRIPE_API_KEY)
      throw new Error(
        "Please define the NEXT_PUBLIC_STRIPE_PUBLIC_API_KEY env var."
      );

    Promise.all([
      loadStripe(PUBLIC_STRIPE_API_KEY),
      createStripeCheckoutSession({
        plan: PaidPlan.Pro,
        projectId,
      }).then(({ data }) => data?.createStripeCheckoutSession),
    ]).then(([stripe, sessionId]) => {
      if (!stripe || !sessionId) return;

      stripe.redirectToCheckout({
        sessionId,
      });
    });
  };

  return (
    <Button variant="outline" onClick={redirectToCheckout} {...props}>
      Upgrade
    </Button>
  );
};
/**
 * When clicked, redirects the user to their a Stripe Checkout session for the to upgrade to the paid plan
 */
export default UpgradeButton;
