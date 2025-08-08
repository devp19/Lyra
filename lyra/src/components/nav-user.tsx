"use client";

import { useState, useEffect } from "react";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  // Control menu open state and logout/animation states
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLinkGitHub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  // This is KEY: Use onSelect on DropdownMenuItem + preventDefault!
  const handleLogoutClick = async (e: Event) => {
    e.preventDefault(); // Tells Radix/shadcn "don't close menu"
    // If not confirming, show "Confirm logout?"
    if (!confirmingLogout && !loggingOut) {
      setConfirmingLogout(true);
      setTimeout(() => setConfirmingLogout(false), 5000); // Auto-reset after 5s
      return;
    }
    // If already confirming, proceed to logout animation
    setLoggingOut(true);
    setConfirmingLogout(false);
    setTimeout(async () => {
      supabase.auth.signOut();
      setMenuOpen(false); // Close menu after animation
      router.push("/login");
    }, 600);
  };

  // Reset local state when menu closes
  const handleOpenChange = (open: boolean) => {
    setMenuOpen(open);
    if (!open) {
      setConfirmingLogout(false);
      setLoggingOut(false);
    }
  };

  const [isGitHubLinked, setIsGitHubLinked] = useState(false);

  useEffect(() => {
    async function checkGitHubLinked() {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user?.identities?.some((i) => i.provider === "github")) {
        setIsGitHubLinked(true);
      } else {
        setIsGitHubLinked(false);
      }
    }
    checkGitHubLinked();
  }, []);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={menuOpen} onOpenChange={handleOpenChange}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              onClick={() => setMenuOpen(true)}
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-gray-400">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "bottom"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
             <DropdownMenuGroup>
      {isGitHubLinked ? (
        <DropdownMenuItem disabled>
          <BadgeCheck />
          GitHub Linked
        </DropdownMenuItem>
      ) : (
        <DropdownMenuItem onSelect={handleLinkGitHub}>
          <BadgeCheck />
          Link GitHub
        </DropdownMenuItem>
      )}
    </DropdownMenuGroup>

              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {/* MAIN LOGOUT BUTTON */}
            <DropdownMenuItem
              onSelect={handleLogoutClick}
              disabled={loggingOut}
              className="overflow-hidden relative h-10 select-none cursor-pointer"
              tabIndex={0}
            >
              <LogOut className="mr-2" />
              <div className="relative w-full h-full">
                {/* 1. Normal "Log out" */}
                <span
                  className={`absolute left-0 right-0 top-0 transition-all duration-200
                  ${
                    !confirmingLogout && !loggingOut
                      ? "translate-y-1 opacity-100"
                      : "-translate-y-5 opacity-0"
                  }`}
                >
                  Log out
                </span>
                {/* 2. Confirm logout */}
                <span
                  className={`absolute left-0 right-0 top-0 transition-all duration-200
                  ${
                    confirmingLogout && !loggingOut
                      ? "translate-y-1 opacity-100"
                      : "translate-y-5 opacity-0"
                  }`}
                >
                  Confirm logout?
                </span>
                {/* 3. Logging out/animation */}
                <span
                  className={`absolute left-0 right-0 top-0 transition-all duration-200
                  ${
                    loggingOut
                      ? "translate-y-1 opacity-100"
                      : "translate-y-5 opacity-0"
                  }`}
                >
                  Logging out...
                </span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
