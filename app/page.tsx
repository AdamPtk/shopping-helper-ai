"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [typedText, setTypedText] = useState("");
  const benefitsRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    setMobileMenuOpen(false);
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = [
      benefitsRef.current,
      pricingRef.current,
      contactRef.current,
    ];
    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () =>
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawGrid = () => {
      if (!canvas || !ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const gridSize = 40;
      const cols = Math.ceil(canvas.width / gridSize);
      const rows = Math.ceil(canvas.height / gridSize);

      ctx.strokeStyle = darkMode
        ? "rgba(79, 70, 229, 0.1)"
        : "rgba(99, 102, 241, 0.1)";
      ctx.lineWidth = 1;

      // Draw vertical lines
      for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let i = 0; i <= rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
      }

      // Fill random cells
      ctx.fillStyle = darkMode
        ? "rgba(79, 70, 229, 0.3)"
        : "rgba(99, 102, 241, 0.3)";
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          if (Math.random() < 0.1) {
            // 10% chance to fill a cell
            ctx.fillRect(i * gridSize, j * gridSize, gridSize, gridSize);
          }
        }
      }
    };

    drawGrid();

    const handleResize = () => {
      drawGrid();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [darkMode]);

  useEffect(() => {
    const text =
      "Your AI-powered personal shopper, finding the best products tailored just for you.";
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setTypedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-900 dark:to-gray-900 text-indigo-900 dark:text-indigo-100 relative overflow-hidden transition-colors duration-300`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      <header className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-80 dark:bg-indigo-900 dark:bg-opacity-80 backdrop-blur-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-indigo-600 dark:text-indigo-300"
          >
            Shoppy
          </Link>
          <div className="hidden md:flex space-x-8 items-center">
            {["Benefits", "Pricing", "Contact"].map((item) => (
              <button
                key={item}
                onClick={() =>
                  scrollTo(
                    item === "Benefits"
                      ? benefitsRef
                      : item === "Pricing"
                        ? pricingRef
                        : contactRef
                  )
                }
                className={`hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors ${
                  activeSection.toLowerCase() === item.toLowerCase()
                    ? "text-indigo-600 dark:text-indigo-300"
                    : ""
                }`}
              >
                {item}
              </button>
            ))}
            <Link
              href="/chat"
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-4 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Try for Free
            </Link>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300 shadow-md hover:shadow-lg transition-shadow"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300 mr-4 shadow-md hover:shadow-lg transition-shadow"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              className="text-indigo-600 dark:text-indigo-300 shadow-md hover:shadow-lg transition-shadow"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white dark:bg-indigo-900 bg-opacity-95 dark:bg-opacity-95 flex flex-col items-center justify-center"
          >
            {["Benefits", "Pricing", "Contact"].map((item) => (
              <button
                key={item}
                onClick={() =>
                  scrollTo(
                    item === "Benefits"
                      ? benefitsRef
                      : item === "Pricing"
                        ? pricingRef
                        : contactRef
                  )
                }
                className="text-2xl mb-6 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
              >
                {item}
              </button>
            ))}
            <Link
              href="/chat"
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-6 py-3 rounded-full transition-all duration-300 text-xl shadow-md hover:shadow-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Try for Free
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10">
        <section className="hero container mx-auto px-6 py-32 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400 dark:from-indigo-300 dark:to-indigo-500 relative"
            style={{
              filter: "drop-shadow(0 0 10px rgba(99, 102, 241, 0.3))",
              animation: "gradientMove 5s ease infinite",
            }}
          >
            Shop Smarter, Not Harder
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="text-xl md:text-2xl mb-8"
          >
            {typedText}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              href="/chat"
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-lg px-8 py-3 rounded-full transition-all duration-300 inline-block shadow-md hover:shadow-lg"
            >
              Try for Free
            </Link>
          </motion.div>
        </section>

        <section
          id="benefits"
          ref={benefitsRef}
          className="benefits container mx-auto px-6 py-24"
        >
          <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400 dark:from-indigo-300 dark:to-indigo-500">
            Why Choose Shoppy?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "AI-Powered Recommendations",
                icon: "🧠",
                description:
                  "Our advanced AI analyzes your preferences to suggest products you'll love.",
              },
              {
                title: "Save Time and Money",
                icon: "⏱️",
                description:
                  "Efficiently compare prices and features across multiple stores in seconds.",
              },
              {
                title: "Personalized Experience",
                icon: "👤",
                description:
                  "Get a shopping experience tailored to your unique style and needs.",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-white dark:bg-indigo-900 p-8 rounded-xl text-center transition-all cursor-pointer relative overflow-hidden shadow-lg hover:shadow-xl dark:shadow-indigo-500/30 dark:hover:shadow-indigo-400/40"
                whileHover="hover"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-800 dark:to-indigo-900 opacity-0"
                  variants={{
                    hover: { opacity: 1 },
                  }}
                  style={{ zIndex: -1 }}
                />
                <motion.div
                  className="relative"
                  variants={{
                    hover: { y: -5 },
                  }}
                >
                  <motion.div
                    className="text-5xl mb-4 relative inline-block"
                    style={{
                      filter: "drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))",
                    }}
                  >
                    {benefit.icon}
                  </motion.div>
                  <h3 className="text-2xl font-semibold mb-4 text-indigo-600 dark:text-indigo-300">
                    {benefit.title}
                  </h3>
                  <p className="text-indigo-800 dark:text-indigo-100">
                    {benefit.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </section>

        <section
          id="pricing"
          ref={pricingRef}
          className="pricing container mx-auto px-6 py-24"
        >
          <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400 dark:from-indigo-300 dark:to-indigo-500">
            Choose Your Plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Basic",
                price: "$9.99",
                features: [
                  "AI product recommendations",
                  "Price comparisons",
                  "Basic support",
                ],
              },
              {
                name: "Pro",
                price: "$19.99",
                features: [
                  "All Basic features",
                  "Personalized shopping lists",
                  "Advanced AI insights",
                  "Priority support",
                ],
              },
              {
                name: "Enterprise",
                price: "Custom",
                features: [
                  "All Pro features",
                  "Custom AI training",
                  "Dedicated account manager",
                  "24/7 premium support",
                ],
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className={`bg-white dark:bg-indigo-900 p-8 rounded-xl text-center ${
                  index === 1
                    ? "border-2 border-indigo-400 dark:border-indigo-300"
                    : ""
                } shadow-lg hover:shadow-xl dark:shadow-indigo-500/30 dark:hover:shadow-indigo-400/40 transition-all`}
              >
                <h3 className="text-2xl font-semibold mb-4 text-indigo-600 dark:text-indigo-300">
                  {plan.name}
                </h3>
                <p className="text-4xl font-bold mb-6 text-indigo-800 dark:text-indigo-100">
                  {plan.price}
                </p>
                <ul className="mb-8">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="mb-2 flex items-center justify-center text-indigo-800 dark:text-indigo-100"
                    >
                      <svg
                        className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/chat"
                  className={`inline-block px-6 py-2 rounded-full ${
                    index === 1
                      ? "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white"
                      : "bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-100 hover:bg-indigo-200 dark:hover:bg-indigo-700"
                  } transition-all duration-300 shadow-md hover:shadow-lg`}
                >
                  Choose Plan
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <section
          id="contact"
          ref={contactRef}
          className="contact container mx-auto px-6 py-24"
        >
          <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400 dark:from-indigo-300 dark:to-indigo-500">
            Get in Touch
          </h2>
          <div className="max-w-2xl mx-auto">
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-indigo-800 dark:text-indigo-100"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 rounded-md bg-white dark:bg-indigo-800 text-indigo-800 dark:text-indigo-100 border border-indigo-300 dark:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 shadow-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-indigo-800 dark:text-indigo-100"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 rounded-md bg-white dark:bg-indigo-800 text-indigo-800 dark:text-indigo-100 border border-indigo-300 dark:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 shadow-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block mb-2 text-indigo-800 dark:text-indigo-100"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 rounded-md bg-white dark:bg-indigo-800 text-indigo-800 dark:text-indigo-100 border border-indigo-300 dark:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 shadow-sm"
                ></textarea>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-6 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Send Message
              </motion.button>
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-white dark:bg-indigo-900 py-8 relative z-10">
        <div className="container mx-auto px-6 text-center text-indigo-800 dark:text-indigo-100">
          <p>&copy; 2023 Shoppy. All rights reserved.</p>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
}
