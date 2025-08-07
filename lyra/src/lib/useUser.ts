import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useUser() {
  const [user, setUser] = useState<null | {
    name: string;
    email: string;
    avatar: string;
  }>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      if (data?.user) {
        setUser({
          name: data.user.user_metadata.full_name || "No Name",
          email: data.user.email || "No Email",
          avatar: data.user.user_metadata.avatar_url || "/dev.png",
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(() => getUser());

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  return { user, loading };
}
