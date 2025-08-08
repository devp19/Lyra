"use client";

import { AppSidebar } from "@/components/dash-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useUser } from "@/lib/useUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import RepositoryTable from "@/components/repo-table";
 
export default function Page() {
  const { user, loading } = useUser();
const router = useRouter();

useEffect(() => {
  if (!loading && user === null) {
    router.push("/login");
  }
}, [user, loading, router]);

if (loading) {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-gray-300 border-t-primary" />
    </div>
  );
}



  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="bg-muted/50 aspect-video rounded-xl" />
                <div className="bg-muted/50 aspect-video rounded-xl" />
                <div className="bg-muted/50 aspect-video rounded-xl" />
              </div>
              {/* <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" /> */}
              <RepositoryTable />

            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
