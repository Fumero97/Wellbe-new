"use client"

import { useEffect, useState } from "react"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getMe, FrontEndUserDTO } from "@/lib/variables"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<FrontEndUserDTO | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const me = await getMe()
        setUser(me)
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    })()
  }, [])

  const isPartner = user?.ruolo === "partner"

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-slate-100 bg-white">
          <div className="flex items-center justify-between w-full gap-2 px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Panoramica</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Back button for partners */}
            {isPartner && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => window.location.href = "/consulente/aziende"}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Torna alle Aziende</span>
              </Button>
            )}
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-slate-50/50">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
