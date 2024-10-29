"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DishSwiper } from "../DishSwiper";
import { Meal } from "@/types";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Check, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface Message {
  role: string;
  content: string;
  id?: string;
  type?: "text" | "swiper" | "prompt";
  dishes?: Meal[];
  isComplete?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface UserPreferences {
  cuisine: string;
  nutritionalGoals: string;
  dietaryRestrictions: string;
  foodPreferences: string;
}

interface PreferenceProgress {
  cuisine: boolean;
  nutritionalGoals: boolean;
  dietaryRestrictions: boolean;
  foodPreferences: boolean;
}

export function AIChat() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm here to help you create a personalized meal plan. Tell me about your dietary preferences, health goals, and any other relevant information.",
      id: "initial",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedMeals, setGeneratedMeals] = useState<Meal[]>([]);
  const [showDishSwiper, setShowDishSwiper] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [preferenceProgress, setPreferenceProgress] = useState<PreferenceProgress>({
    cuisine: false,
    nutritionalGoals: false,
    dietaryRestrictions: false,
    foodPreferences: false,
  });
  const [usedPrompts, setUsedPrompts] = useState<Set<string>>(new Set());

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Focus input after sending message
  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showDishSwiper]);

  const generateMealPlan = async () => {
    // lead to meal plan page
    router.push("/meal-plan/new");
  };

  const generateMeals = async () => {
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

      if (!data.meals || !Array.isArray(data.meals) || data.meals.length === 0) {
        throw new Error("Invalid meal plan received");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I've generated some meal suggestions based on your preferences. Let's go through them!",
          id: Date.now().toString(),
          type: "text",
        },
        {
          role: "assistant",
          content: "Rate these meals:",
          id: (Date.now() + 1).toString(),
          type: "swiper",
          dishes: data.meals,
        },
      ]);

      setGeneratedMeals(data.meals);
      setShowDishSwiper(false);
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
          id: Date.now().toString(),
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
    const messageId = Date.now().toString();
    setMessages((prev) => [...prev, { role: "user", content: userMessage, id: messageId }]);
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
          contextMessages: messages,
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

      // Add AI response to messages with a unique ID
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.userPrompt,
          id: Date.now().toString(),
        },
      ]);

      // Check if we should show the generate prompt
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (
          lastMessage?.role === "assistant" &&
          hasEnoughPreferences(preferences) &&
          !prev.some((msg) => msg.type === "swiper")
        ) {
          return [
            ...prev,
            {
              role: "assistant",
              content:
                "I have enough information to suggest some meals for you. Would you like to see them? Otherwise, you can tell me more of your preferences.",
              id: Date.now().toString(),
              type: "prompt",
              action: {
                label: "Generate Meal Suggestions",
                onClick: generateMeals,
              },
            },
          ];
        }
        return prev;
      });
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
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          "Looking good! I've added your favorite dishes! Would you like me to create a weekly schedule with these meals?",
        id: Date.now().toString(),
        type: "prompt",
        action: {
          label: "Build Meal Plan",
          onClick: generateMealPlan,
        },
      },
    ]);
  };

  // Update when preferences change
  useEffect(() => {
    if (preferences) {
      setPreferenceProgress({
        cuisine: preferences.cuisine !== "unknown",
        nutritionalGoals: preferences.nutritionalGoals !== "unknown",
        dietaryRestrictions: preferences.dietaryRestrictions !== "unknown",
        foodPreferences: preferences.foodPreferences !== "unknown",
      });
    }
  }, [preferences]);

  // Add a progress indicator in the chat
  const renderProgress = () => (
    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
      <span>Information gathered:</span>
      <div className="flex space-x-1">
        {Object.entries(preferenceProgress).map(([key, complete]) => (
          <div
            key={key}
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              complete ? "bg-primary" : "bg-muted-foreground/30"
            )}
          />
        ))}
      </div>
    </div>
  );

  const getSuggestedPrompts = () => {
    if (!preferences) return [];

    const prompts = [];
    if (preferences.cuisine === "unknown") {
      prompts.push("What types of cuisine do you enjoy?");
    }
    if (preferences.nutritionalGoals === "unknown") {
      prompts.push("Do you have any specific nutritional goals?");
    }
    // ... add other prompts

    return prompts;
  };

  // Add function to check if we have enough preferences
  const hasEnoughPreferences = (prefs: UserPreferences | null): boolean => {
    if (!prefs) return false;
    return (
      prefs.cuisine !== "unknown" &&
      prefs.nutritionalGoals !== "unknown" &&
      prefs.dietaryRestrictions !== "unknown" &&
      prefs.foodPreferences !== "unknown"
    );
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    setUsedPrompts((prev) => new Set([...prev, prompt]));
  };

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-grow" ref={scrollAreaRef}>
        <div className="space-y-4 p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "user"
                  ? "animate-pop-in-user justify-end"
                  : "animate-pop-in-ai justify-start"
              )}
            >
              {message.type === "swiper" ? (
                <div className="w-full">
                  <DishSwiper dishes={message.dishes || []} onComplete={handleDishSwiperComplete} />
                </div>
              ) : message.isComplete ? (
                <div className="flex items-center space-x-2 rounded-lg bg-muted px-4 py-2">
                  <span>Done</span>
                  <Check className="h-4 w-4 text-green-500" />
                </div>
              ) : message.type === "prompt" ? (
                <div className="flex flex-col items-start space-y-2">
                  <div className="rounded-lg bg-muted px-4 py-2 text-foreground">
                    {message.content}
                  </div>
                  {message.action && (
                    <Button
                      onClick={message.action.onClick}
                      disabled={isLoading}
                      className="flex items-center gap-2"
                      size="sm"
                    >
                      <Sparkles className="h-4 w-4" />
                      {isLoading ? "Generating..." : message.action.label}
                    </Button>
                  )}
                </div>
              ) : (
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2 transition-all duration-200",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  {message.content}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <div className="sticky bottom-0 border-t bg-background p-4">
        {getSuggestedPrompts().length > 0 && (
          <div className="mb-2 flex flex-wrap justify-end gap-2">
            {getSuggestedPrompts()
              .filter((prompt) => !usedPrompts.has(prompt))
              .map((prompt) => (
                <Button
                  key={prompt}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePromptClick(prompt)}
                  className="flex items-center gap-2 text-xs"
                >
                  <Sparkles className="h-3 w-3" />
                  {prompt}
                </Button>
              ))}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            ref={inputRef}
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
