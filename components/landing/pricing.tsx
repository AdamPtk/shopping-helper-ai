"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Basic",
    price: "$9.99",
    features: [
      "Smart product recommendations",
      "Basic personalization",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: "$19.99",
    features: [
      "Advanced AI recommendations",
      "Full personalization",
      "Priority email support",
      "Exclusive deals",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "Custom AI model",
      "Dedicated account manager",
      "24/7 phone support",
      "API access",
      "Custom integrations",
    ],
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="py-20 px-4 bg-gradient-to-b from-transparent from-1% via-background via-90%"
    >
      <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
        Choose Your Plan
      </h2>
      <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={` rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 w-full md:w-80 flex flex-col justify-between ${
              index === 1
                ? "md:-mt-4 md:border-4 border-blue-500"
                : "md:border border-purple-500"
            }`}
          >
            <div>
              <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
              <p className="text-4xl font-bold mb-6">{plan.price}</p>
              <ul className="mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center mb-2">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button>Get Started</Button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
