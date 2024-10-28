"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Session, User } from "@supabase/supabase-js";

type SupabaseContextType = {
  supabase: ReturnType<typeof createClient>;
  session: Session | null;
  user: User | null;
};

const Context = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const setServerSession = async () => {
      const {
        data: { session: serverSession },
      } = await supabase.auth.getSession();
      setSession(serverSession);
      setUser(serverSession?.user ?? null);
    };

    // Add .catch() handler to the promise
    setServerSession().catch(console.error);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  return <Context.Provider value={{ supabase, session, user }}>{children}</Context.Provider>;
}

export const useSupabase = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider");
  }
  return context;
};
