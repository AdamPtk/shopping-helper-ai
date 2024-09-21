"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import { Send, PlusCircle, User, Bot, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const loadingTexts = [
  "Shoppy is finding the best deals...",
  "Analyzing thousands of products...",
  "Customizing recommendations just for you...",
  "Crunching data at lightning speed...",
  "Almost there! Preparing your personalized results...",
];

export interface Result {
  title: string;
  price: string;
  image: string;
  link: string;
}

export default function Chat() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [showItems, setShowItems] = useState<boolean>(false);
  const [items, setItems] = useState<Result[]>([]);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const itemsBoxRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat({
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content: "Cześć! Jak mogę Ci dziś pomóc?",
      },
    ],
  });

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }

    const getResults = async () => {
      if (messages.length === 0) return;
      const lastMessage = messages[messages.length - 1].content;

      if (
        lastMessage.includes("Teraz szukam dla ciebie najlepszych propozycji!")
      ) {
        setIsPending(true);
        setShowItems(true);
        const userQuery = lastMessage
          .replace("Teraz szukam dla ciebie najlepszych propozycji!", "")
          .trim();

        try {
          const tavilyResponse = await axios.post("/api/tavily", { userQuery });
          const results = tavilyResponse.data.answer;
          console.log(tavilyResponse, results);
          // Assuming results is an array of items
          setItems(results);
          setIsPending(false);
        } catch (error) {
          console.error("Error fetching results:", error);
          setIsPending(false);
        }
      }
    };

    getResults();
  }, [messages]);

  useEffect(() => {
    if (showItems && itemsBoxRef.current) {
      itemsBoxRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showItems]);

  useEffect(() => {
    if (isPending) {
      const interval = setInterval(() => {
        setLoadingTextIndex(
          (prevIndex) => (prevIndex + 1) % loadingTexts.length
        );
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isPending]);

  const handleNewChat = () => {
    setMessages([]);
    setShowItems(false);
    setItems([]);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto h-screen bg-background pt-16">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start space-x-2 ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {m.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                m.role === "user"
                  ? "bg-blue-500 text-white"
                  : "border bg-gradient-to-b from-white dark:from-gray-800 to-transparent"
              }`}
            >
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
            {m.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
            )}
          </motion.div>
        ))}
        <AnimatePresence>
          {showItems && (
            <motion.div
              ref={itemsBoxRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="border bg-gradient-to-b from-white dark:from-gray-800 to-transparent rounded-lg p-4 shadow-lg"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Recommended Items
              </h3>
              {isPending ? (
                <div className="flex flex-col items-center justify-center h-24">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                  <motion.p
                    key={loadingTextIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-sm text-gray-600 dark:text-gray-400 text-center"
                  >
                    {loadingTexts[loadingTextIndex]}
                  </motion.p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((item, index) => (
                    <a
                      key={index}
                      href={item.link}
                      className="h-full"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md h-full flex flex-col justify-between">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full"
                        />
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-gray-200">
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.price}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>
      <div className="border-t border-gray-200 dark:border-gray-800 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <motion.div
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                <span className="hidden md:inline-block">Send</span>
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleNewChat}>
            <PlusCircle className="w-5 h-5 mr-1" />
            <span className="hidden md:inline-block">New Chat</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
