"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Building2,
  AlertTriangle,
  FileText,
  AlertCircle,
  TrendingUp,
  Calendar,
  ArrowRight
} from "lucide-react"
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { useEffect, useState } from "react"
import { getOrganizations } from "@/lib/variables"
import { OrganizationDTO } from "@/lib/variables"

// Mock data per scadenze
const mockDeadlines = [
  {
    id: 1,
    idAzienda: 1,
    denominazioneAzienda: "Wellbe Demo Corp",
    tipo: "certificazione" as const,
    titolo: "ISO 9001 - Rinnovo",
    dataScadenza: "2026-02-22",
    priorita: "alta" as const,
  },
  {
    id: 2,
    idAzienda: 2,
    denominazioneAzienda: "Tech Solutions S.r.l.",
    tipo: "documento" as const,
    titolo: "Bilancio 2024",
    dataScadenza: "2026-02-14",
    priorita: "alta" as const,
  },
  {
    id: 3,
    idAzienda: 3,
    denominazioneAzienda: "Green Energy S.p.A.",
    tipo: "certificazione" as const,
    titolo: "ISO 14001",
    dataScadenza: "2026-03-05",
    priorita: "media" as const,
  },
]

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe']

export default function ConsultantDashboard() {
  const [organizations, setOrganizations] = useState<OrganizationDTO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const orgs = await getOrganizations()
        setOrganizations(orgs)
      } catch (error) {
        console.error("Error fetching organizations:", error)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // Calculate statistics
  const totalCompanies = organizations.length
  const upcomingDeadlines = mockDeadlines.filter(d => {
    const daysUntil = Math.ceil((new Date(d.dataScadenza).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return daysUntil <= 30 && daysUntil >= 0
  }).length
  const activeSurveys = 12 // Mock
  const criticalAlerts = mockDeadlines.filter(d => d.priorita === 'alta').length

  // Data for tipo distribution
  const tipoDistribution = organizations.reduce((acc, org) => {
    const tipo = org.tipo || 'Altro'
    const existing = acc.find(item => item.name === tipo)
    if (existing) {
      existing.value += 1
    } else {
      acc.push({ name: tipo, value: 1 })
    }
    return acc
  }, [] as { name: string; value: number }[])

  // Data for sede distribution
  const sedeDistribution = organizations.reduce((acc, org) => {
    const sede = org.sedeLegale || 'Non specificata'
    const existing = acc.find(item => item.name === sede)
    if (existing) {
      existing.value += 1
    } else {
      acc.push({ name: sede, value: 1 })
    }
    return acc
  }, [] as { name: string; value: number }[])

  const kpis = [
    {
      title: "Aziende Gestite",
      value: totalCompanies,
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "+2 questo mese"
    },
    {
      title: "Scadenze Imminenti",
      value: upcomingDeadlines,
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      trend: "Prossimi 30 giorni"
    },
    {
      title: "Survey Attivi",
      value: activeSurveys,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: "In corso"
    },
    {
      title: "Alert Critici",
      value: criticalAlerts,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      trend: "Richiede attenzione"
    }
  ]

  const getPriorityColor = (priorita: string) => {
    switch (priorita) {
      case 'alta': return 'destructive'
      case 'media': return 'default'
      case 'bassa': return 'secondary'
      default: return 'default'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const getDaysUntil = (dateString: string) => {
    const days = Math.ceil((new Date(dateString).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  if (loading) {
    return (
      <div className="space-y-6 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-slate-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 mt-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Building2 className="h-8 w-8 text-blue-600" />
          Dashboard Consulente
        </h1>
        <p className="text-slate-500">Overview delle aziende gestite e attività recenti</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {kpi.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{kpi.value}</div>
              <p className="text-xs text-slate-500 mt-1">{kpi.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart: Distribuzione Tipo */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Distribuzione per Tipo
            </CardTitle>
            <CardDescription>Tipologia societaria delle aziende gestite</CardDescription>
          </CardHeader>
          <CardContent>
            {tipoDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={tipoDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {tipoDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-slate-400">
                Nessun dato disponibile
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart: Distribuzione Geografica */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Distribuzione Geografica
            </CardTitle>
            <CardDescription>Sedi legali delle aziende gestite</CardDescription>
          </CardHeader>
          <CardContent>
            {sedeDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sedeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-slate-400">
                Nessun dato disponibile
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Scadenze Imminenti */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                Scadenze Imminenti
              </CardTitle>
              <CardDescription>Certificazioni e documenti in scadenza nei prossimi 30 giorni</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <a href="/consulente/scadenziario">
                Vedi tutte
                <ArrowRight className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {mockDeadlines.length > 0 ? (
            <div className="space-y-3">
              {mockDeadlines.slice(0, 5).map(deadline => {
                const daysUntil = getDaysUntil(deadline.dataScadenza)
                return (
                  <div key={deadline.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Badge variant={getPriorityColor(deadline.priorita) as any}>
                        {deadline.priorita}
                      </Badge>
                      <div>
                        <p className="font-medium text-slate-900">{deadline.titolo}</p>
                        <p className="text-sm text-slate-600">
                          {deadline.denominazioneAzienda}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900">
                        {daysUntil > 0 ? `${daysUntil} giorni` : 'Scaduto'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDate(deadline.dataScadenza)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8 text-slate-400">
              Nessuna scadenza imminente
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
