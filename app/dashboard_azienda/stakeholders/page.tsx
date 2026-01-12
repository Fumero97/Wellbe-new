"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OverviewCard } from "@/components/dashboard/overview-cards"
import { AreaChartDemo, BarChartDemo } from "@/components/dashboard/charts"
import { Globe, HeartHandshake, Megaphone } from "lucide-react"

const transparencyTrend = [
  { name: '2020', value: 65 },
  { name: '2021', value: 72 },
  { name: '2022', value: 78 },
  { name: '2023', value: 85 },
  { name: '2024', value: 87 },
]

const initiativesData = [
  { name: 'Volontariato', value: 12 },
  { name: 'Donazioni', value: 8 },
  { name: 'Eventi Locali', value: 5 },
  { name: 'Partnership', value: 10 },
]

export default function StakeholdersPage() {
  return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Stakeholder & Comunità</h1>
          <p className="text-slate-500">
            Relazioni con comunità locali, trasparenza e impatto sociale esterno.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <OverviewCard
            title="Indice Trasparenza"
            value="87/100"
            description="Fiducia consumatori"
            icon={Megaphone}
            trend="up"
            trendValue="+5"
          />
          <OverviewCard
            title="Progetti Comunitari"
            value="12"
            description="Iniziative attive 2024"
            icon={Globe}
            trend="up"
            trendValue="+2"
          />
          <OverviewCard
            title="Ore Volontariato"
            value="450h"
            description="Totale dipendenti su base annua"
            icon={HeartHandshake}
            trend="up"
            trendValue="+12%"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Crescita Reputazionale</CardTitle>
              <CardDescription>Indice di percezione del brand (Trust Score)</CardDescription>
            </CardHeader>
            <CardContent>
              <AreaChartDemo data={transparencyTrend} dataKey="value" color="#10b981" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Iniziative per Tipo</CardTitle>
              <CardDescription>Distribuzione attività sociali</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChartDemo data={initiativesData} />
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
