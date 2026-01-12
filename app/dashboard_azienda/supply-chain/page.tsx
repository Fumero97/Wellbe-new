"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OverviewCard } from "@/components/dashboard/overview-cards"
import { BarChartDemo } from "@/components/dashboard/charts"
import { AlertTriangle, CheckSquare, Truck } from "lucide-react"

const supplierData = [
  { name: 'Compliant', value: 24 },
  { name: 'Audit In Corso', value: 3 },
  { name: 'Non Compliant', value: 1 },
]

export default function SupplyChainPage() {
  return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Supply Chain Responsabile</h1>
          <p className="text-slate-500">
            Monitoraggio compliance fornitori e rischi etici nella catena di approvvigionamento.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <OverviewCard
            title="Fornitori Monitorati"
            value="28"
            description="Tier 1 Suppliers"
            icon={Truck}
            trend="neutral"
            trendValue="0"
          />
          <OverviewCard
            title="Compliance SA8000"
            value="86%"
            description="Fornitori certificati o conformi"
            icon={CheckSquare}
            trend="up"
            trendValue="+4%"
          />
          <OverviewCard
            title="Rischi Critici"
            value="1"
            description="Richiede azione immediata"
            icon={AlertTriangle}
            trend="down"
            trendValue="-1" // meaning 1 less risk than before, which is good but value is strictly 1
            className="border-red-200 bg-red-50/30"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Stato Conformità Fornitori</CardTitle>
              <CardDescription>Breakdown status audit etici</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChartDemo data={supplierData} />
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
