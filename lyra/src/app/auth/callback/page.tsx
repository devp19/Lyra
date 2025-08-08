"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const finalize = async () => {
      // Ensure session is set and user is refreshed after OAuth redirect
      await supabase.auth.getSession();
      await supabase.auth.getUser(); // refresh user identities
      router.replace("/dashboard"); // or wherever you want to land
    };
    finalize();
  }, [router]);

  return <div>Connecting to GitHub…</div>;
}
