"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plan } from "@/types";

const BuyButton = ({ plan }: { plan: Plan }) => {
  const { toast } = useToast();
  return (
    <Button
      variant={"default"}
      size={"lg"}
      className="w-full rounded-lg bg-orange-1 font-bold text-lg mt-4"
      onClick={() => {
        toast({
          title: "Coming Soon",
          description: "We are working on this feature",
          key: "buy-button",
        });
      }}
    >
      Get Started
    </Button>
  );
};

export default BuyButton;
