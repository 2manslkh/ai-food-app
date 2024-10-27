"use client";

import React from "react";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import { LoginScreen } from "@/components/LoginScreen";
import { AIChat } from "@/components/chat/AIChat";

export default function Home() {
  const { user } = useSupabase();

  return (
    <>
      {user ? (
        <div className="h-full">
          <AIChat />
        </div>
      ) : (
        <LoginScreen />
      )}
    </>
  );
}
