"use client";

import React from "react";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { user, supabase } = useSupabase();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Profile</h1>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Profile</h1>
      <div className="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md">
        <p className="mb-4">
          <strong>Name:</strong> {user.user_metadata.full_name || "Not provided"}
        </p>
        <p className="mb-4">
          <strong>Email:</strong> {user.email}
        </p>
        {/* Add more user information here */}
        <Button onClick={handleLogout}>Log Out</Button>
      </div>
    </div>
  );
}
