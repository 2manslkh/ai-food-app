"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "./SupabaseProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SupabaseLogin() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [authChecking, setAuthChecking] = useState(true);
  const { supabase, user } = useSupabase();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        console.log("Logged in user:", user);
        console.log("User's name:", user.user_metadata.full_name || user.email);
      }
      setAuthChecking(false);
    };

    checkUser();
  }, [supabase]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}`,
        },
      });
      if (error) throw error;
      setMessage("Check your email for the login link!");
    } catch (error) {
      console.error("Error logging in:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error logging in with Google:", error);
      setMessage("Error logging in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error logging out:", error);
      setMessage("Error logging out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authChecking) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="space-y-4">
        <p>Welcome, {user.user_metadata.full_name || user.email}!</p>
        <Button onClick={handleLogout} disabled={loading}>
          {loading ? "Loading..." : "Logout"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Send Magic Link"}
        </Button>
      </form>
      <div className="text-center">
        <span className="text-gray-500">or</span>
      </div>
      <Button onClick={handleGoogleLogin} disabled={loading} className="w-full">
        {loading ? "Loading..." : "Login with Google"}
      </Button>
      {message && <p className="text-sm text-center text-red-500">{message}</p>}
    </div>
  );
}
