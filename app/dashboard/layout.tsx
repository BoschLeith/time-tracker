import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <main>
          <SiteHeader />
          <div className="p-4 pt-0 md:p-8 md:pt-0">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
