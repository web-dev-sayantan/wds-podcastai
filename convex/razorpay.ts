"use node";
import { internal } from "@/convex/_generated/api";
import { action, internalMutation } from "@/convex/_generated/server";
import { v } from "convex/values";
import Razorpay from "razorpay";

const razorPayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_TEST_KEY_ID!,
  key_secret: process.env.RAZORPAY_TEST_KEY_SECRET!,
});

export const createSubscription = action({
  args: {
    plan_id: v.string(),
    notify_email: v.string(),
    user_clerk_id: v.string(),
  },
  handler: async (
    ctx,
    { plan_id, notify_email, user_clerk_id }
  ): Promise<
    | {
        planId: string;
        subscriptionId: string;
        clerkId: string;
      }
    | undefined
  > => {
    try {
      const subscription = await razorPayInstance.subscriptions.create({
        plan_id,
        total_count: 1,
        notify_info: {
          notify_email,
        },
        quantity: 1,
      });
      if (subscription) {
        return ctx.runMutation(internal.users.assignSubscriptionToUser, {
          clerkId: user_clerk_id,
          subscription_id: subscription.id,
          plan_id: subscription.plan_id,
        });
      }
    } catch (error) {
      console.error(error);
    }
  },
});

export const cancelSubscription = action({
  args: {
    subscription_id: v.string(),
    user_clerk_id: v.string(),
  },
  handler: async (
    ctx,
    { subscription_id, user_clerk_id }
  ): Promise<
    | {
        planId: string;
        subscriptionId: string;
        clerkId: string;
      }
    | undefined
  > => {
    try {
      const subscription = await razorPayInstance.subscriptions.cancel(
        subscription_id,
        true
      );
      if (subscription) {
        return await ctx.runMutation(internal.users.assignSubscriptionToUser, {
          clerkId: user_clerk_id,
          subscription_id: "free_plan",
          plan_id: "free_plan",
        });
      } else {
        throw new Error("Unable to cancel subscription");
      }
    } catch (error) {
      console.error("Unable to cancel subscription", error);
      throw new Error("Unable to cancel subscription");
    }
  },
});
