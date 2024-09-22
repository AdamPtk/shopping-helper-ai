"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Plus, User, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import axios from "axios";

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
  const chatEndRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat();

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
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

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto pt-16 h-screen text-gray-900 dark:text-white transition-colors duration-200">
      <ScrollArea className="flex-grow p-4 space-y-4">
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start my-3 space-x-2 ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <Avatar className={m.role === "user" ? "order-last" : ""}>
              <AvatarFallback>
                {m.role === "user" ? <User /> : <Bot />}
              </AvatarFallback>
              <AvatarImage
                src={m.role === "user" ? "/user-avatar.png" : "/ai-avatar.png"}
              />
            </Avatar>
            <div
              className={`p-3 rounded-lg max-w-[80%] ${
                m.role === "user"
                  ? "bg-blue-600 dark:bg-blue-700 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
              }`}
            >
              <p className="text-sm">{m.content}</p>
            </div>
          </motion.div>
        ))}
        <AnimatePresence>
          {showItems && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <Card className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-4">
                  {isPending ? (
                    <div className="flex justify-center items-center h-40">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {items.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Card className="overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-40 object-cover"
                            />
                            <CardContent className="p-4">
                              <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                                {item.title}
                              </h3>
                              <p className="text-blue-600 dark:text-blue-400 font-bold">
                                {item.price}
                              </p>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full"
                              >
                                <Button
                                  variant="outline"
                                  className="w-full border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900"
                                >
                                  View Item
                                </Button>
                              </a>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </ScrollArea>
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-grow bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Send className="h-4 w-4" />
              </motion.div>
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="ml-2">Send</span>
          </Button>
          <Button
            type="button"
            onClick={() => {
              setMessages([]);
              setShowItems(false);
              setItems([]);
            }}
            variant="outline"
            className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
      </form>
    </div>
  );
}
