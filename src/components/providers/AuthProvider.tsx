"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { Session } from "@supabase/supabase-js";

const AuthContext = createContext<{ session: Session | null }>({
  session: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClient();
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return (
    <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
