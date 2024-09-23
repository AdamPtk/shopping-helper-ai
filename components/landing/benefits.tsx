"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Clock, Brain, Shield, Zap } from "lucide-react";

const benefits = [
  {
    title: "Smart Product Recommendations",
    description:
      "Our AI analyzes your preferences to suggest the perfect products for you.",
    icon: ShoppingCart,
  },
  {
    title: "Time-Saving Shopping",
    description:
      "Spend less time searching and more time enjoying your purchases.",
    icon: Clock,
  },
  {
    title: "Personalized Experience",
    description:
      "Get a tailored shopping experience that understands your unique needs.",
    icon: Brain,
  },
  {
    title: "Secure and Private",
    description:
      "Your data is protected with state-of-the-art security measures.",
    icon: Shield,
  },
  {
    title: "Lightning-Fast Results",
    description:
      "Get instant product suggestions powered by cutting-edge AI technology.",
    icon: Zap,
  },
  {
    title: "Lightning-Fast Results",
    description:
      "Get instant product suggestions powered by cutting-edge AI technology.",
    icon: Zap,
  },
];

export default function Benefits() {
  return (
    <section id="benefits" className="py-20 px-4">
      <h2 className="text-4xl font-bold text-center pb-12 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
        Why Choose Shoppy?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {benefits.map((benefit, index) => (
          <motion.div
            key={benefit.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.03, dur: 0.3 }}
            className="bg-gradient-to-b from-white dark:from-gray-800 to-transparent border rounded-lg p-6 shadow-lg hover:shadow-xl hover:shadow-blue-500 transition-shadow duration-300"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
              <benefit.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {benefit.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
