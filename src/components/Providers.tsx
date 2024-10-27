"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SupabaseProvider } from "./providers/SupabaseProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseProvider>{children}</SupabaseProvider>
    </QueryClientProvider>
  );
}
