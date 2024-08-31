"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/convex/_generated/api";
import { Plan } from "@/types";
import { useClerk } from "@clerk/nextjs";
import { useAction } from "convex/react";

// Extend the window interface to include Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}
const BuyButton = ({ plan }: { plan: Plan }) => {
  const { user } = useClerk();
  const { toast } = useToast();
  const createSubscription = useAction(api.razorpay.createSubscription);

  async function handleGetStarted() {
    if (!user) {
      return;
    }
    if (plan.id === "free_plan") {
    }
    const subscription = await createSubscription({
      plan_id: plan.id,
      notify_email: user.emailAddresses[0].emailAddress,
      user_clerk_id: user.id,
    });
    if (subscription) {
      // toast({
      //   title: "Success",
      //   description: "Your subscription has been created",
      // });
      // integrate checkout
      var options = {
        key: process.env.RAZORPAY_TEST_KEY_ID,
        subscription_id: subscription.subscriptionId,
        name: "RantCast",
        description: "Starter Plan",
        image: "/icons/logo.svg",
        handler: async function (response: any) {
          alert(response.razorpay_payment_id),
            alert(response.razorpay_subscription_id),
            alert(response.razorpay_signature);
        },
        prefill: {
          name: user.fullName,
          email: user.emailAddresses[0].emailAddress,
        },
        notes: {
          note_key_1: "Rantcast test subscription",
          note_key_2: "Starter Plan",
        },
        theme: {
          color: "#F37254",
        },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    }
  }
  return (
    <Button
      variant={"default"}
      size={"lg"}
      className="w-full rounded-lg bg-orange-1 font-bold text-lg mt-4"
      onClick={handleGetStarted}
    >
      Get Started
    </Button>
  );
};

export default BuyButton;
