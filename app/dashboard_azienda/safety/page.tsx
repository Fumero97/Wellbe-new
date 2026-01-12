"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OverviewCard } from "@/components/dashboard/overview-cards"
import { AreaChartDemo, BarChartDemo } from "@/components/dashboard/charts"
import { AlertCircle, CheckCircle, ShieldAlert } from "lucide-react"

const incidentTrend = [
  { name: 'Q1', value: 4 },
  { name: 'Q2', value: 2 },
  { name: 'Q3', value: 1 },
  { name: 'Q4', value: 0 },
]

const trainingData = [
  { name: 'Antincendio', value: 100 },
  { name: 'Primo Soccorso', value: 85 },
  { name: 'Sicurezza Gen.', value: 92 },
  { name: 'Preposti', value: 60 },
]

export default function SafetyPage() {
  return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Health & Safety</h1>
          <p className="text-slate-500">
            Gestione rischi, incidenti e formazione obbligatoria ISO 45001.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <OverviewCard
            title="Giorni Probabili Senza Incidenti"
            value="142"
            description="Ultimo incidente: 24/06/2024"
            icon={ShieldAlert}
            trend="up"
            trendValue="+142"
          />
          <OverviewCard
            title="Near Miss Reporting"
            value="12"
            description="Segnalazioni proattive questo mese"
            icon={AlertCircle}
            trend="up"
            trendValue="+3"
          />
          <OverviewCard
            title="Formazione Completata"
            value="92%"
            description="Copertura totale dipendenti"
            icon={CheckCircle}
            trend="up"
            trendValue="+5%"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Trend Incidenti (YTD)</CardTitle>
              <CardDescription>Eventi registrati per quarter</CardDescription>
            </CardHeader>
            <CardContent>
              <AreaChartDemo data={incidentTrend} dataKey="value" color="#ef4444" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Stato Formazione</CardTitle>
              <CardDescription>% completamento corsi obbligatori</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChartDemo data={trainingData} />
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
