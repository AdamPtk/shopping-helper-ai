"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const typingTexts = [
  "Find the perfect product",
  "Save time and money",
  "Get personalized recommendations",
];

export default function Banner() {
  const [typingText, setTypingText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (charIndex < typingTexts[textIndex].length) {
        setTypingText((prev) => prev + typingTexts[textIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setTypingText("");
          setCharIndex(0);
          setTextIndex((prev) => (prev + 1) % typingTexts.length);
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, [charIndex, textIndex]);

  return (
    <section className="pt-20 pb-40 px-4 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-6xl font-bold mt-10 pb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text"
      >
        Your AI Shopping Assistant
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-300"
      >
        {typingText}
        <span className="animate-blink">|</span>
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Link href="/chat">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg py-6 px-10 rounded-full hover:shadow-xl hover:shadow-purple-500 transition-shadow duration-200">
            Try for Free
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
