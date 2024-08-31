"use client";

import Script from "next/script";
import BuyButton from "@/components/BuyButton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { pricingPlans } from "@/constants";
import { api } from "@/convex/_generated/api";
import { useClerk } from "@clerk/nextjs";
import { useAction, useQuery } from "convex/react";

export default function PricingPage() {
  const { user: clerkUser } = useClerk();
  const { toast } = useToast();
  const user = useQuery(api.users.getUserById, {
    clerkId: clerkUser ? clerkUser.id : "",
  });
  const cancelSubscription = useAction(api.razorpay.cancelSubscription);

  async function handleCancelSubscription() {
    if (!user) {
      return;
    }
    try {
      const subscription = await cancelSubscription({
        subscription_id: user.subscriptionId!,
        user_clerk_id: user.clerkId,
      });

      if (subscription) {
        toast({
          title: "Success",
          description: "Subscription canceled",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Unable to cancel subscription",
      });
    }
  }

  return (
    <div className="flex flex-col gap-y-4 w-full text-white-1">
      <h1 className="mt-12 text-3xl ">Pricing</h1>
      <p className="text-white-2">
        If you enjoy a product, kindly consider purchasing.
      </p>
      <div className="flex flex-col gap-4 md:flex-row md:flex-wrap items-center gap-x-4">
        {pricingPlans.map((plan) => (
          <div
            key={plan.id}
            className="flex flex-col md:w-[300px] min-h-[530px] bg-black-1 rounded-xl"
          >
            <div className="p-8 flex flex-col gap-y-3">
              <h1 className="text-2xl font-bold capitalize flex items-center gap-4">
                {plan.name}{" "}
                {plan.id === user?.planId && (
                  <span className="bg-orange-1 text-white-1 px-2 py-1 rounded-full text-xs font-light ">
                    Current Plan
                  </span>
                )}
              </h1>
              <p className="text-white-2">{plan.description}</p>
              <p className="text-orange-1 font-bold text-4xl">
                <span className="text-white-2 text-3xl">₹ </span>
                {plan.price}{" "}
                {plan.price > 0 && (
                  <span className="text-white-2 text-sm">/mo</span>
                )}
              </p>
              {user &&
              user.subscriptionId &&
              user.planId !== "free_plan" &&
              plan.id === user.planId ? (
                <Button
                  className="w-full rounded-lg bg-red-600 font-bold text-lg mt-4 tracking-wider"
                  size={"lg"}
                  onClick={() =>
                    cancelSubscription({
                      subscription_id: user.subscriptionId!,
                      user_clerk_id: user.clerkId,
                    })
                  }
                >
                  Cancel
                </Button>
              ) : (
                <BuyButton plan={plan} />
              )}
            </div>
            <div className="w-full flex-1 bg-black-2 py-8 px-4 rounded-b-xl">
              <h2 className="text-white-2 text-lg mb-8">Benefits Include:</h2>
              <ul className="flex flex-col gap-y-2">
                {plan.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-center gap-x-2 text-white-2"
                  >
                    <span className="text-xs flex items-center gap-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
    </div>
  );
}
