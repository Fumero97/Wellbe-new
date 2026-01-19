"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OverviewCard } from "@/components/dashboard/overview-cards"
import { AreaChartDemo, BarChartDemo } from "@/components/dashboard/charts"
import { 
  AlertCircle, 
  CheckCircle, 
  ShieldAlert, 
  TrendingUp, 
  Users, 
  Activity, 
  Search, 
  Clock, 
  AlertTriangle,
  FileText,
  ClipboardCheck,
  Zap
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const performanceData = [
  { name: 'Jan', incidents: 2, nearMisses: 5 },
  { name: 'Feb', incidents: 1, nearMisses: 8 },
  { name: 'Mar', incidents: 0, nearMisses: 12 },
  { name: 'Apr', incidents: 1, nearMisses: 10 },
  { name: 'May', incidents: 0, nearMisses: 15 },
  { name: 'Jun', incidents: 0, nearMisses: 14 },
]

const trainingByRole = [
  { name: 'Manutenzione', value: 95 },
  { name: 'Produzione', value: 88 },
  { name: 'Logistica', value: 92 },
  { name: 'Uffici', value: 100 },
]

export default function SafetyPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Salute e Sicurezza (ISO 45001)</h1>
          <p className="text-slate-500 max-w-2xl">
            Monitoraggio centralizzato del Sistema di Gestione OH&S secondo lo standard internazionale ISO 45001.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 border border-green-100 rounded-full text-sm font-medium">
          <CheckCircle className="h-4 w-4" />
          SISTEMA CONFORME
        </div>
      </div>

      {/* High-Level KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <OverviewCard
          title="LTIFR"
          value="1.2"
          description="Infortuni con perdita di tempo"
          icon={Activity}
          trend="down"
          trendValue="-15%"
        />
        <OverviewCard
          title="Near Miss Rate"
          value="4.5"
          description="Rapporto segnalazioni proattive"
          icon={Zap}
          trend="up"
          trendValue="+22%"
        />
        <OverviewCard
          title="Formazione"
          value="94.2%"
          description="Copertura corsi obbligatori"
          icon={Users}
          trend="up"
          trendValue="+2.1%"
        />
        <OverviewCard
          title="Audit Interni"
          value="8/10"
          description="Completamento piano annuale"
          icon={ClipboardCheck}
          trend="neutral"
          trendValue="In corso"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="bg-slate-100/50 p-1 border border-slate-200">
          <TabsTrigger value="performance" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Performance & Trend
          </TabsTrigger>
          <TabsTrigger value="risks" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Rischi & Compliance
          </TabsTrigger>
          <TabsTrigger value="participation" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Partecipazione & Salute
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Incidenti vs Near Miss (6 Mesi)</CardTitle>
                <CardDescription>Correlazione tra eventi avversi e segnalazioni proattive (Piramide di Bird)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                   <AreaChartDemo 
                    data={performanceData} 
                    dataKey="nearMisses" 
                    color="#0ea5e9" 
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500">Giorni senza infortuni</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">142</div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    Record precedente: 128 giorni
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500">Severità Media</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">3.4</div>
                  <p className="text-xs text-slate-500 mt-1">Giorni di assenza medi per evento</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500">Costi Prevenzione</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">€42.5k</div>
                  <p className="text-xs text-slate-500 mt-1">Investimento YTD in DPI e Tech</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="risks" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-600" />
                  Identificazione Pericoli
                </CardTitle>
                <CardDescription>Progresso mappatura rischi per area aziendale</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Linee Produzione A</span>
                    <span className="font-medium text-slate-900">100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Logistica & Magazzino</span>
                    <span className="font-medium text-slate-900">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Nuovi Uffici (Ala Nord)</span>
                    <span className="font-medium text-slate-900">40%</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Non Conformità Aperte
                </CardTitle>
                <CardDescription>Azioni correttive in attesa di risoluzione</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-3 rounded-lg border border-amber-100 bg-amber-50/30">
                    <div className="mt-1">
                      <Clock className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-slate-900 whitespace-nowrap">DPI mancanti Linea B</span>
                        <Badge variant="outline" className="text-[10px] uppercase border-amber-200 text-amber-700 bg-white">ALTA</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Scadenza: 4 giorni fa</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-3 rounded-lg border border-slate-100 bg-white">
                    <div className="mt-1">
                      <FileText className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-slate-900 whitespace-nowrap">Aggiornamento DVR</span>
                        <Badge variant="outline" className="text-[10px] uppercase border-slate-200 text-slate-600">MEDIA</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Assegnato a: RSPP</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="participation" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Copertura Formazione per Reparto</CardTitle>
                <CardDescription>% completamento dei corsi abilitanti per la mansione</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <BarChartDemo data={trainingByRole} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Salute e Benessere</CardTitle>
                <CardDescription>Indicatori di salute occupazionale</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="text-slate-500 text-xs mb-1 uppercase font-semibold">Tasso Assenteismo</div>
                    <div className="text-2xl font-bold">2.4%</div>
                    <div className="text-[10px] text-green-600 mt-1">In calo (-0.5%)</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="text-slate-500 text-xs mb-1 uppercase font-semibold">Soddisfazione Env.</div>
                    <div className="text-2xl font-bold">8.2/10</div>
                    <div className="text-[10px] text-slate-500 mt-1">Da survey trimestrale</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="text-slate-500 text-xs mb-1 uppercase font-semibold">Visite Mediche</div>
                    <div className="text-2xl font-bold">98%</div>
                    <div className="text-[10px] text-green-600 mt-1">Idoneità completate</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="text-slate-500 text-xs mb-1 uppercase font-semibold">Microclima</div>
                    <div className="text-2xl font-bold">Ottimale</div>
                    <div className="text-[10px] text-slate-500 mt-1">Monitoring IA attivo</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
