import { useSupabase } from "@/components/providers/SupabaseProvider";

export function useUserId() {
  const { user } = useSupabase();
  return user?.id;
}
