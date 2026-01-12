"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Building2, Lock, Palette, Users, ChevronRight, CreditCard } from "lucide-react"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/components/language-provider"

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();

  const settingsSections = [
    {
      title: "Company Profile", // We might want to add these to translations.ts eventually, but hardcoded for now or use generic keys if available.
      description: "Manage your organization details and branding",
      icon: Building2,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      tags: ["Company Name", "Industry", "Size", "Logo"],
      href: "#"
    },
    {
      title: "Team Management",
      description: "Add team members and manage permissions",
      icon: Users,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
      tags: ["Invite Users", "Roles", "Access Levels"],
      href: "#"
    },
    {
      title: "Notifications",
      description: "Configure alerts and email preferences",
      icon: Bell,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100",
      tags: ["Email Alerts", "Dashboard Notifications", "Report Schedule"],
      href: "#"
    },
    {
      title: "Security",
      description: "Manage authentication and data protection",
      icon: Lock,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100",
      tags: ["2FA", "Sessions", "API Keys"],
      href: "#"
    },
    // Removed Appearance card from this list to handle it separately with the toggle
    {
      title: "Plan & Billing",
      description: "Manage your subscription and usage",
      icon: CreditCard,
      iconColor: "text-cyan-600",
      iconBg: "bg-cyan-100",
      tags: ["Invoices", "Plan", "Add-ons"],
      href: "/dashboard_azienda/settings/billing"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('settings')}</h1>
        <p className="text-slate-500">
           {language === 'it' ? 'Gestisci le preferenze della piattaforma Wellbe.' : 'Manage your Wellbe platform preferences.'}
        </p>
      </div>

      {/* Language / Appearance Section */}
      <Card className="border-slate-200">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100`}>
                <Palette className={`h-6 w-6 text-pink-600`} />
            </div>
            <div>
                <CardTitle className="text-lg font-semibold text-slate-900">
                    {language === 'it' ? 'Aspetto e Lingua' : 'Appearance & Language'}
                </CardTitle>
                <CardDescription className="text-sm text-slate-500">
                    {t('languageDesc')}
                </CardDescription>
            </div>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-between py-4">
                <div className="space-y-0.5">
                    <Label className="text-base">{t('language')}</Label>
                    <p className="text-sm text-slate-500">
                        {language === 'it' ? 'Seleziona la lingua dell\'interfaccia' : 'Select interface language'}
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className={`text-sm font-medium ${language === 'it' ? 'text-slate-900' : 'text-slate-500'}`}>Italiano</div>
                    <Switch 
                        checked={language === 'en'}
                        onCheckedChange={(checked) => setLanguage(checked ? 'en' : 'it')}
                    />
                    <div className={`text-sm font-medium ${language === 'en' ? 'text-slate-900' : 'text-slate-500'}`}>English</div>
                </div>
            </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {settingsSections.map((section) => (
          <Link key={section.title} href={section.href} className="block">
            <Card className="group relative overflow-hidden transition-all hover:shadow-md cursor-pointer border-slate-200 h-full">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${section.iconBg}`}>
                    <section.icon className={`h-6 w-6 ${section.iconColor}`} />
                </div>
                <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {section.title}
                    </CardTitle>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </CardHeader>
                <CardContent>
                <CardDescription className="mb-4 text-sm text-slate-500">
                    {section.description}
                </CardDescription>
                <div className="flex flex-wrap gap-2">
                    {section.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                        {tag}
                        </span>
                    ))}
                </div>
                </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
