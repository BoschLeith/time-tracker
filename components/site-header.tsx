"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function SiteHeader() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const isClientPage =
    segments[segments.length - 2] === "clients" &&
    !isNaN(Number(segments[segments.length - 1]));
  const isTransactionPage =
    segments[segments.length - 2] === "transactions" &&
    !isNaN(Number(segments[segments.length - 1]));
  const isTimeEntryPage =
    segments[segments.length - 2] === "time-entries" &&
    !isNaN(Number(segments[segments.length - 1]));

  const breadcrumbItems = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const isLast = index === segments.length - 1;

    let label =
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

    if (isLast) {
      if (isClientPage) label = "Client";
      if (isTransactionPage) label = "Transaction";
      if (isTimeEntryPage) label = "Time Entry";
    }

    return (
      <span key={href} className="flex items-center">
        <BreadcrumbItem>
          {isLast ? (
            <BreadcrumbPage>{label}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link href={href}>{label}</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
        {!isLast && <BreadcrumbSeparator />}
      </span>
    );
  });

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <nav>
          <Breadcrumb>
            <BreadcrumbList>{breadcrumbItems}</BreadcrumbList>
          </Breadcrumb>
        </nav>
      </div>
    </header>
  );
}
