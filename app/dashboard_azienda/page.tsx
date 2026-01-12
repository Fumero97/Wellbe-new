"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OverviewCard } from "@/components/dashboard/overview-cards"
import { RadarChartDemo, AreaChartDemo } from "@/components/dashboard/charts"
import { Activity, Heart, Shield, Users, Zap, Briefcase, FileText, Megaphone } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"

export default function DashboardAziendaPage() {
  const { t } = useLanguage()

  const radarData = [
    { subject: t('wellbeing'), A: 125, fullMark: 150 },
    { subject: t('dei'), A: 110, fullMark: 150 },
    { subject: t('safety'), A: 95, fullMark: 150 },
    { subject: t('stakeholders'), A: 105, fullMark: 150 },
    { subject: t('supplyChain'), A: 90, fullMark: 150 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('dashboardTitle')}</h1>
        <p className="text-slate-500">
          {t('dashboardSubtitle')}
        </p>
      </div>

      {/* CSR Score & Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <OverviewCard
          title={t('sustainabilityScore')}
          value="Total 87/100"
          description={t('sectorAvg')}
          icon={Activity}
          trend="up"
          trendValue="+5%"
        />
        <OverviewCard
          title={t('employeeEngagement')}
          value="92%"
          description={t('surveyResponse')}
          icon={Heart}
          trend="up"
          trendValue="+12%"
        />
        <OverviewCard
          title={t('socialRoi')}
          value="€ 1.4M"
          description="YTD Impact Generated"
          icon={Zap}
          trend="up"
          trendValue="+8%"
        />
        <OverviewCard
          title={t('verifiedSuppliers')}
          value="24/28"
          description="Compliance Score"
          icon={Briefcase}
          trend="neutral"
          trendValue="+1"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Main Visual: CSR Radar */}
        <Card className="col-span-4 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>{t('csrPerformance')}</CardTitle>
            <CardDescription>
              {t('csrComparison')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] w-full flex items-center justify-center">
                 <RadarChartDemo data={radarData} />
            </div>
          </CardContent>
        </Card>
        
        <div className="col-span-3 space-y-4">
            {/* Quick Actions */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{t('quickActions')}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="h-20 flex flex-col gap-1 items-center justify-center border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all">
                        <FileText className="h-6 w-6" />
                        <span className="text-xs font-semibold">{t('reports')}</span>
                    </Button>
                     <Button variant="outline" className="h-20 flex flex-col gap-1 items-center justify-center border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all">
                        <Megaphone className="h-6 w-6" />
                        <span className="text-xs font-semibold">{t('surveys')}</span>
                    </Button>
                </CardContent>
            </Card>

             {/* AI Insights / News */}
            <Card className="flex-1 border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle>{t('aiInsights')}</CardTitle>
                    <CardDescription>
                    {t('predictiveAnalysis')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    <div className="flex items-start gap-4 rounded-lg bg-blue-50/50 p-3">
                        <Zap className="mt-0.5 h-5 w-5 text-blue-600" />
                        <div className="space-y-1">
                        <p className="text-sm font-medium leading-none text-blue-900">
                            Wellbeing Optimization
                        </p>
                        <p className="text-xs text-blue-700">
                            Burnout risk decreased by 15% following new flexible work policies.
                        </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 rounded-lg bg-emerald-50/50 p-3">
                        <Activity className="mt-0.5 h-5 w-5 text-emerald-600" />
                        <div className="space-y-1">
                        <p className="text-sm font-medium leading-none text-emerald-900">
                            Energy Sustainability
                        </p>
                        <p className="text-xs text-emerald-700">
                            Consumption reduced by 8% vs previous quarter.
                        </p>
                        </div>
                    </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
