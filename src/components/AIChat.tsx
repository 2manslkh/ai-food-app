"use client";

import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DishSwiper } from "./DishSwiper";
import { Meal } from "@/types";
import { generateMockMeals } from "@/lib/mocks";

interface Message {
  role: string;
  content: string;
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm here to help you create a personalized meal plan. Tell me about your dietary preferences, health goals, and any other relevant information.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedMeals, setGeneratedMeals] = useState<Meal[]>([]);
  const [showDishSwiper, setShowDishSwiper] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { role: "user", content: input }]);
      setInput("");
      setIsLoading(true);

      // Simulate AI response and meal generation
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I've generated some meal suggestions based on your preferences. Let's go through them!",
          },
        ]);
        setIsLoading(false);

        // Generate mock meals
        const mockMeals = generateMockMeals(20);
        console.log("🚀 | setTimeout | mockMeals:", mockMeals);

        setGeneratedMeals(mockMeals);
        setShowDishSwiper(true);
      }, 2000);
    }
  };

  const handleDishSwiperComplete = (favorites: Meal[]) => {
    setShowDishSwiper(false);
    // Here you would typically save the favorites to the user's profile
    console.log("Favorite dishes:", favorites);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `Great! I've added your ${favorites.length} favorite dishes to your meal plan.`,
      },
    ]);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <ScrollArea className="h-[500px]">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`inline-block p-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.content}
              </span>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
          {showDishSwiper && (
            <div className="mt-4">
              <DishSwiper
                dishes={generatedMeals}
                onComplete={handleDishSwiperComplete}
              />
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full space-x-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-grow"
          />
          <Button type="submit">Send</Button>
        </form>
      </CardFooter>
    </Card>
  );
}
