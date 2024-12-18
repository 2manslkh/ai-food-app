"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "./providers/SupabaseProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function SupabaseLogin() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [authChecking, setAuthChecking] = useState(true);
  const { supabase, user } = useSupabase();
  const [emailLogin] = useState(false);
  const router = useRouter();

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

  const handleAnonymousLogin = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) {
        console.error("Detailed error:", error);
        throw error;
      }
      console.log("Signed in anonymously:", data);
      router.push("/"); // Redirect to dashboard or main app page
    } catch (error) {
      console.error("Error signing in anonymously:", error);
      if (error instanceof Error) {
        setMessage(`Failed to sign in anonymously: ${error.message}`);
      } else {
        setMessage("Failed to sign in anonymously. Please try again.");
      }
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
      <div className="flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (user) {
    return (
      <>
        <p>Welcome, {user.user_metadata.full_name || user.email}!</p>
        <Button onClick={handleLogout} disabled={loading}>
          {loading ? "Loading..." : "Logout"}
        </Button>
      </>
    );
  }

  return (
    <>
      {emailLogin && (
        <>
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
        </>
      )}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="mb-4 flex w-full items-center justify-center"
      >
        {loading ? (
          "Loading..."
        ) : (
          <>
            <Image
              src="/web_light_sq_SI.svg"
              alt="Google Sign-In"
              width={175}
              height={40}
              className=""
            />
          </>
        )}
      </button>
      <Button onClick={handleAnonymousLogin} disabled={loading} className="h-[40px] w-[175px]">
        {loading ? "Loading..." : "Continue as Guest"}
      </Button>
      {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
    </>
  );
}
