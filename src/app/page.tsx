"use client";

import React from "react";
import { useSupabase } from "@/components/SupabaseProvider";
import { LoginScreen } from "@/components/LoginScreen";
import { AIChat } from "@/components/AIChat";

export default function Home() {
  const { user } = useSupabase();

  return (
    <>
      {user ? (
        <div className="container mx-auto px-2 py-2">
          <AIChat />
        </div>
      ) : (
        <LoginScreen />
      )}
    </>
  );
}
