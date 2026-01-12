"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OverviewCard } from "@/components/dashboard/overview-cards"
import { BarChartDemo, AreaChartDemo } from "@/components/dashboard/charts"
import { Scale, Users, Wallet } from "lucide-react"

const genderData = [
  { name: 'Uomini', value: 52 },
  { name: 'Donne', value: 48 },
]

const payGapTrend = [
  { name: '2020', value: 12.5 },
  { name: '2021', value: 10.2 },
  { name: '2022', value: 8.5 },
  { name: '2023', value: 5.8 },
  { name: '2024', value: 4.2 },
]

export default function DEIPage() {
  return (
    <div className="space-y-6">
       <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Diversity, Equity & Inclusion</h1>
        <p className="text-slate-500">
          Monitoraggio parità di genere, inclusione e accessibilità.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
         <OverviewCard
          title="Gender Pay Gap"
          value="4.2%"
          description="Inferiore media settore (8.5%)"
          icon={Wallet}
          trend="down"
          trendValue="-1.6%"
        />
        <OverviewCard
          title="Indice Inclusione"
          value="78/100"
          description="Basato su 340 risposte"
          icon={Users}
          trend="up"
          trendValue="+4"
        />
        <OverviewCard
          title="Leadership Femminile"
          value="35%"
          description="Obiettivo 2025: 40%"
          icon={Scale}
          trend="up"
          trendValue="+5%"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Evoluzione Pay Gap (%)</CardTitle>
            <CardDescription>Differenza retributiva media Uomo/Donna</CardDescription>
          </CardHeader>
          <CardContent>
             <AreaChartDemo data={payGapTrend} dataKey="value" color="#8b5cf6" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Distribuzione Genere</CardTitle>
            <CardDescription>Popolazione aziendale totale</CardDescription>
          </CardHeader>
          <CardContent>
             <BarChartDemo data={genderData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
