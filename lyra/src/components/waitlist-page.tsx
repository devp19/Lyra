"use client";
import React, { useState, useEffect, useRef } from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);
  const emailInput = useRef<HTMLInputElement | null>(null);

  // Refactored! Now a function you can re-use.
  async function fetchWaitlistCount() {
    const res = await fetch("/api/waitlist-count");
    const data = await res.json();
    setWaitlistCount(data.waitlistCount);
  }

  useEffect(() => {
    fetchWaitlistCount();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from("waitlist").insert([{ email }]);
    setLoading(false);
    setJoined(true);
    await fetchWaitlistCount(); // <-- Refresh the count immediately!
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a href="/">
              <img src="/lyra-transparent.png" height={72} width={72} alt="" />
            </a>
            <div className="text-center text-sm">
              Open-source, private, powerful. The new way to code in the cloud.
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                ref={emailInput}
                onChange={(e) => setEmail(e.target.value)}
                // disabled={loading || joined}
              />
            </div>
            <Button
              type="submit"
              className="w-full h-10 relative overflow-hidden"
            //   disabled={loading || joined}
            >
              <span
                className={`absolute left-0 right-0 top-0 transition-all duration-300
                  ${joined ? "-translate-y-6 opacity-0" : "translate-y-2.5 opacity-100"}`}
              >
                {loading ? "Joining Waitlist..." : "Join Waitlist"}
              </span>
              <span
                className={`absolute left-0 right-0 top-0 transition-all duration-300
                  ${joined ? "translate-y-2.5 opacity-100 text-black font-regular" : "translate-y-6 opacity-0"}`}
              >
                Joined Waitlist!
              </span>
            </Button>
          </div>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Details
            </span>
          </div>
          {/* Waitlist live count with animated dot */}
          <div className="flex items-center justify-center text-center text-sm">
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-muted-foreground font-medium text-xs sm:text-sm">
              {waitlistCount === null
                ? "Loading..."
                : waitlistCount.toLocaleString()} users have joined the waitlist
            </span>
          </div>
        </div>
      </form>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By joining the waitlist, you agree to recieve emails related to beta-access
      </div>
    </div>
  );
}
