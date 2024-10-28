import { useSupabase } from "@/components/providers/SupabaseProvider";

export function useUserId() {
  const { userId } = useSupabase();
  return userId;
}
