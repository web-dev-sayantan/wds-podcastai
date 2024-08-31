import BuyButton from "@/components/BuyButton";
import { Button } from "@/components/ui/button";
import { pricingPlans } from "@/constants";

export default function PricingPage() {
  return (
    <div className="flex flex-col gap-y-4 w-full text-white-1">
      <h1 className="mt-12 text-3xl ">Pricing</h1>
      <p className="text-white-2">
        If you enjoy a product, kindly consider purchasing. This also comes with
        a free trial.
      </p>
      <div className="flex flex-col gap-4 md:flex-row md:flex-wrap items-center gap-x-4">
        {pricingPlans.map((plan) => (
          <div
            key={plan.id}
            className="flex flex-col md:w-[300px] min-h-[500px] bg-black-1 rounded-xl"
          >
            <div className="p-8 flex flex-col gap-y-3">
              <h1 className="text-2xl font-bold capitalize">{plan.name}</h1>
              <p className="text-white-2">{plan.description}</p>
              <p className="text-orange-1 font-bold text-4xl">
                ${plan.price}{" "}
                {plan.price > 0 && (
                  <span className="text-white-2 text-sm">/mo</span>
                )}
              </p>
              <BuyButton plan={plan} />
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
    </div>
  );
}
