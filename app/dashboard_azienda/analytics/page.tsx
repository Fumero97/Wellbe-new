"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OverviewCard } from "@/components/dashboard/overview-cards"
import { BarChartDemo, AreaChartDemo } from "@/components/dashboard/charts"
import { BatteryWarning, Heart, Sun, Thermometer } from "lucide-react"

const moodData = [
  { name: 'Lun', value: 7.5 },
  { name: 'Mar', value: 7.2 },
  { name: 'Mer', value: 7.8 },
  { name: 'Gio', value: 6.9 },
  { name: 'Ven', value: 8.2 },
]

const departmentData = [
  { name: 'IT', value: 85 },
  { name: 'HR', value: 78 },
  { name: 'Sales', value: 65 },
  { name: 'Marketing', value: 82 },
  { name: 'Ops', value: 70 },
]

export default function WellbeingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Wellbeing Aziendale</h1>
        <p className="text-slate-500">
          Analisi del clima aziendale, stress lavoro-correlato e soddisfazione dei dipendenti.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <OverviewCard
          title="Climate Score"
          value="82/100"
          description="Ottimo clima generale"
          icon={Sun}
          trend="up"
          trendValue="+3%"
        />
        <OverviewCard
          title="Work-Life Balance"
          value="7.6/10"
          description="Soddisfazione orari"
          icon={Heart}
          trend="neutral"
          trendValue="0.1"
        />
        <OverviewCard
          title="Rischio Burnout"
          value="18%"
          description="Dipendenti a rischio medio/alto"
          icon={BatteryWarning}
          trend="down"
          trendValue="-2%"
          className="border-amber-200 bg-amber-50/30"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Trend Umore Settimanale</CardTitle>
            <CardDescription>Media giornaliera reported dai dipendenti</CardDescription>
          </CardHeader>
          <CardContent>
            <AreaChartDemo data={moodData} dataKey="value" color="#ec4899" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Soddisfazione per Dipartimento</CardTitle>
            <CardDescription>Survey engagement score breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChartDemo data={departmentData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
