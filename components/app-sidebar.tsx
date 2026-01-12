"use client"

import {
  Calendar,
  ChevronDown,
  Layout,
  LifeBuoy,
  LogOut,
  PieChart,
  Settings,
  User,
  Activity,
  Shield,
  Users,
  Leaf,
  Briefcase,
  FileText,
  Handshake
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
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/components/language-provider"

export function AppSidebar() {
  const { t } = useLanguage();

  const modules = [
    {
      title: t('wellbeing'),
      url: "/dashboard_azienda/wellbeing",
      icon: Activity,
    },
    {
      title: t('dei'),
      url: "/dashboard_azienda/dei",
      icon: Users,
    },
    {
      title: t('safety'),
      url: "/dashboard_azienda/safety",
      icon: Shield,
    },
    {
      title: t('stakeholders'),
      url: "/dashboard_azienda/stakeholders",
      icon: Handshake,
    },
    {
      title: t('supplyChain'),
      url: "/dashboard_azienda/supply-chain",
      icon: Briefcase,
    },
  ]

  const tools = [
    {
      title: t('certifications'),
      url: "/dashboard_azienda/certifications",
      icon: Layout,
    },
    {
      title: t('reports'),
      url: "/dashboard_azienda/reports",
      icon: FileText,
    },
    {
      title: t('analytics'),
      url: "/dashboard_azienda/analytics",
      icon: PieChart,
    },
    {
      title: t('surveys'),
      url: "/dashboard_azienda/surveys",
      icon: FileText,
    },
    {
      title: t('planner'),
      url: "/dashboard_azienda/planner",
      icon: Calendar,
    },
    {
      title: t('partner'),
      url: "/dashboard_azienda/partners",
      icon: Handshake,
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
            Platform
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
                  <a href="/dashboard_azienda" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-600 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700 font-medium">
                    <Layout className="h-5 w-5" />
                    <span>{t('dashboard')}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {modules.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-600 font-medium">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator className="bg-slate-100" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
            {t('tools')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {tools.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-600 font-medium">
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
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 font-medium">CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 text-left ml-2">
                    <span className="text-sm font-semibold text-slate-900">Acme Corp</span>
                    <span className="text-xs text-slate-500">Admin Workspace</span>
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
                <DropdownMenuItem className="cursor-pointer gap-2 text-red-600 focus:bg-red-50 focus:text-red-700">
                  <LogOut className="h-4 w-4" />
                  Log out
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
