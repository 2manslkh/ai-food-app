"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DishSwiper } from "../DishSwiper";
import { Meal } from "@/types";
import { toast } from "@/hooks/use-toast";

interface Message {
  role: string;
  content: string;
}

interface UserPreferences {
  cuisine: string;
  nutritionalGoals: string;
  dietaryRestrictions: string;
  foodPreferences: string;
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
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, showDishSwiper]);

  const generateMealPlan = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generateMealPlan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          existingPreferences: preferences,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate meal plan");
      }

      console.log("Generated Meal Plan:", data);

      // Validate the response data
      if (!data.meals || !Array.isArray(data.meals) || data.meals.length === 0) {
        throw new Error("Invalid meal plan received");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I've generated some meal suggestions based on your preferences. Let's go through them!",
        },
      ]);

      setGeneratedMeals(data.meals);
      setShowDishSwiper(true);
    } catch (error) {
      console.error("Error generating meal plan:", error);

      // Handle different error scenarios
      let errorMessage = "Failed to generate meal plan. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes("AI service")) {
          errorMessage = "AI service is temporarily unavailable. Please try again later.";
        } else if (error.message.includes("Invalid meal plan")) {
          errorMessage = "Received invalid meal plan data. Please try again.";
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I apologize, but I encountered an error while generating your meal plan. Would you like to try again?",
        },
      ]);
    } finally {
      setIsLoading(false);
      setShowGenerateButton(true); // Keep the button visible in case user wants to retry
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/promptUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          existingPreferences: preferences,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();
      console.log("AI Response:", data);

      // Update preferences
      setPreferences({
        cuisine: data.cuisine,
        nutritionalGoals: data.nutritionalGoals,
        dietaryRestrictions: data.dietaryRestrictions,
        foodPreferences: data.foodPreferences,
      });

      // Add AI response to messages
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.userPrompt,
        },
      ]);

      // If we have enough information, show generate button
      if (
        data.cuisine !== "unknown" ||
        data.nutritionalGoals !== "unknown" ||
        data.dietaryRestrictions !== "unknown" ||
        data.foodPreferences !== "unknown"
      ) {
        setShowGenerateButton(true);
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDishSwiperComplete = () => {
    setShowDishSwiper(false);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `Great! I've added your favorite dishes to your meal plan. Would you like me to create a weekly schedule with these meals?`,
      },
    ]);
  };

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-grow" ref={scrollAreaRef}>
        <div className="space-y-4 p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-2 ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {showGenerateButton && !showDishSwiper && (
            <div className="flex justify-center">
              <Button onClick={generateMealPlan} disabled={isLoading}>
                Generate Meal Plan
              </Button>
            </div>
          )}
          {isLoading && (
            <div className="flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
            </div>
          )}
          {showDishSwiper && (
            <div className="mt-4">
              <DishSwiper dishes={generatedMeals} onComplete={handleDishSwiperComplete} />
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="sticky bottom-0 border-t bg-background p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-grow"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
