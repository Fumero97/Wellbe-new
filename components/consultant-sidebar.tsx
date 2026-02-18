"use client"

import {
  Calendar,
  ChevronDown,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Settings,
  User,
  Building2,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/components/language-provider"

export function ConsultantSidebar() {
  const { t } = useLanguage();

  const menuItems = [
    {
      title: t('dashboard'),
      url: "/consulente/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Scadenziario",
      url: "/consulente/scadenziario",
      icon: Calendar,
    },
    {
      title: "Aziende",
      url: "/consulente/aziende",
      icon: Building2,
    },
  ]

  return (
    <Sidebar className="border-r border-slate-200 bg-white shadow-sm">
      <SidebarHeader className="h-16 flex items-center px-6 border-b border-slate-100">
        <div className="flex items-center gap-2 font-bold text-xl text-slate-900 tracking-tight">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/Wellbe-logo-blue.svg" alt="Wellbe" className="h-8" />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-4 gap-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
            {t('consultant') || 'Consulente'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-600 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700 font-medium">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-100 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="data-[state=open]:bg-slate-50 hover:bg-slate-50 rounded-xl transition-colors">
                  <Avatar className="h-9 w-9 border border-slate-200">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">CS</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 text-left ml-2">
                    <span className="text-sm font-semibold text-slate-900">Consulente</span>
                    <span className="text-xs text-slate-500">Partner Workspace</span>
                  </div>
                  <ChevronDown className="ml-auto h-4 w-4 text-slate-400" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl border-slate-200 shadow-lg" align="start" side="top">
                <DropdownMenuItem className="cursor-pointer gap-2 focus:bg-slate-50 text-slate-700">
                  <User className="h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer gap-2 focus:bg-slate-50 text-slate-700">
                  <a href="/dashboard_azienda/settings">
                    <Settings className="h-4 w-4" />
                    {t('settings')}
                  </a>
                </DropdownMenuItem>
                 <DropdownMenuItem className="cursor-pointer gap-2 focus:bg-slate-50 text-slate-700">
                  <LifeBuoy className="h-4 w-4" />
                  Support
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer gap-2 text-red-600 focus:bg-red-50 focus:text-red-700">
                  <a href="/logout">
                    <LogOut className="h-4 w-4" />
                    Log out
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
