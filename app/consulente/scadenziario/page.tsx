"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Calendar as CalendarIcon,
  Plus,
  Filter,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react"
import { useState, useMemo } from "react"

interface ScadenzaDTO {
  id: number
  idAzienda: number
  denominazioneAzienda: string
  tipo: 'certificazione' | 'documento'
  titolo: string
  descrizione?: string
  dataScadenza: string
  priorita: 'alta' | 'media' | 'bassa'
  stato: 'completato' | 'in_corso' | 'scaduto' | 'programmato'
}

// Mock data
const mockScadenze: ScadenzaDTO[] = [
  {
    id: 1,
    idAzienda: 1,
    denominazioneAzienda: "Wellbe Demo Corp",
    tipo: "certificazione",
    titolo: "ISO 9001 - Rinnovo",
    descrizione: "Rinnovo certificazione qualità",
    dataScadenza: "2026-02-22",
    priorita: "alta",
    stato: "programmato"
  },
  {
    id: 2,
    idAzienda: 2,
    denominazioneAzienda: "Tech Solutions S.r.l.",
    tipo: "documento",
    titolo: "Bilancio 2024",
    descrizione: "Presentazione bilancio annuale",
    dataScadenza: "2026-02-14",
    priorita: "alta",
    stato: "in_corso"
  },
  {
    id: 3,
    idAzienda: 3,
    denominazioneAzienda: "Green Energy S.p.A.",
    tipo: "certificazione",
    titolo: "ISO 14001",
    descrizione: "Certificazione ambientale",
    dataScadenza: "2026-03-05",
    priorita: "media",
    stato: "programmato"
  },
  {
    id: 4,
    idAzienda: 1,
    denominazioneAzienda: "Wellbe Demo Corp",
    tipo: "documento",
    titolo: "DURF - Dichiarazione Annuale",
    descrizione: "Dichiarazione Unica Retributiva",
    dataScadenza: "2026-03-15",
    priorita: "media",
    stato: "programmato"
  },
  {
    id: 5,
    idAzienda: 4,
    denominazioneAzienda: "Fashion Co. S.r.l.",
    tipo: "certificazione",
    titolo: "SA 8000",
    descrizione: "Responsabilità sociale",
    dataScadenza: "2026-01-20",
    priorita: "alta",
    stato: "scaduto"
  },
  {
    id: 6,
    idAzienda: 2,
    denominazioneAzienda: "Tech Solutions S.r.l.",
    tipo: "documento",
    titolo: "Reportistica DEI",
    descrizione: "Report annuale diversità e inclusione",
    dataScadenza: "2026-04-10",
    priorita: "bassa",
    stato: "programmato"
  }
]

export default function ScadenziarioPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [filterAzienda, setFilterAzienda] = useState("all")
  const [filterTipo, setFilterTipo] = useState("all")
  const [filterPriorita, setFilterPriorita] = useState("all")
  const [filterStato, setFilterStato] = useState("all")

  // Get unique aziende
  const uniqueAziende = useMemo(() => {
    return [...new Set(mockScadenze.map(s => s.denominazioneAzienda))]
  }, [])

  // Filtered scadenze
  const filteredScadenze = useMemo(() => {
    return mockScadenze
      .filter(s => {
        const matchesAzienda = filterAzienda === "all" || s.denominazioneAzienda === filterAzienda
        const matchesTipo = filterTipo === "all" || s.tipo === filterTipo
        const matchesPriorita = filterPriorita === "all" || s.priorita === filterPriorita
        const matchesStato = filterStato === "all" || s.stato === filterStato
        return matchesAzienda && matchesTipo && matchesPriorita && matchesStato
      })
      .sort((a, b) => new Date(a.dataScadenza).getTime() - new Date(b.dataScadenza).getTime())
  }, [filterAzienda, filterTipo, filterPriorita, filterStato])

  // Dates with deadlines for calendar
  const datesWithDeadlines = useMemo(() => {
    return mockScadenze.map(s => new Date(s.dataScadenza))
  }, [])

  const getPriorityColor = (priorita: string) => {
    switch (priorita) {
      case 'alta': return 'destructive'
      case 'media': return 'default'
      case 'bassa': return 'secondary'
      default: return 'default'
    }
  }

  const getStatoColor = (stato: string) => {
    switch (stato) {
      case 'completato': return 'default'
      case 'in_corso': return 'default'
      case 'scaduto': return 'destructive'
      case 'programmato': return 'secondary'
      default: return 'default'
    }
  }

  const getStatoIcon = (stato: string) => {
    switch (stato) {
      case 'completato': return CheckCircle2
      case 'in_corso': return Clock
      case 'scaduto': return XCircle
      case 'programmato': return CalendarIcon
      default: return CalendarIcon
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

  const clearFilters = () => {
    setFilterAzienda("all")
    setFilterTipo("all")
    setFilterPriorita("all")
    setFilterStato("all")
  }

  const hasActiveFilters = filterAzienda !== "all" || filterTipo !== "all" || filterPriorita !== "all" || filterStato !== "all"

  return (
    <div className="space-y-6 mt-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <CalendarIcon className="h-8 w-8 text-blue-600" />
            Scadenziario
          </h1>
          <p className="text-slate-500">Gestisci scadenze certificazioni e documenti</p>
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200">
          <Plus className="h-4 w-4" />
          Nuova Scadenza
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <Filter className="h-4 w-4 text-slate-400" />

            <Select value={filterAzienda} onValueChange={setFilterAzienda}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tutte le aziende" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutte le aziende</SelectItem>
                {uniqueAziende.map(azienda => (
                  <SelectItem key={azienda} value={azienda}>{azienda}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Tutti i tipi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti i tipi</SelectItem>
                <SelectItem value="certificazione">Certificazione</SelectItem>
                <SelectItem value="documento">Documento</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriorita} onValueChange={setFilterPriorita}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Tutte le priorità" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutte le priorità</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="bassa">Bassa</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStato} onValueChange={setFilterStato}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Tutti gli stati" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti gli stati</SelectItem>
                <SelectItem value="completato">Completato</SelectItem>
                <SelectItem value="in_corso">In corso</SelectItem>
                <SelectItem value="scaduto">Scaduto</SelectItem>
                <SelectItem value="programmato">Programmato</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Cancella filtri
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Calendario</CardTitle>
            <CardDescription>Seleziona una data per filtrare</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{
                hasDeadline: datesWithDeadlines
              }}
              modifiersStyles={{
                hasDeadline: {
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  color: '#3b82f6'
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Scadenze List */}
        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Scadenze ({filteredScadenze.length})</span>
              {filteredScadenze.some(s => s.stato === 'scaduto') && (
                <Badge variant="destructive">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {filteredScadenze.filter(s => s.stato === 'scaduto').length} scadute
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Lista completa delle scadenze</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredScadenze.length > 0 ? (
                filteredScadenze.map(scadenza => {
                  const daysUntil = getDaysUntil(scadenza.dataScadenza)
                  const StatoIcon = getStatoIcon(scadenza.stato)

                  return (
                    <div
                      key={scadenza.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors gap-3"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-blue-50 rounded-lg mt-1">
                          {scadenza.tipo === 'certificazione' ? (
                            <FileText className="h-5 w-5 text-blue-600" />
                          ) : (
                            <FileText className="h-5 w-5 text-slate-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-medium text-slate-900">{scadenza.titolo}</h3>
                            <Badge variant={getPriorityColor(scadenza.priorita) as any} className="text-xs">
                              {scadenza.priorita}
                            </Badge>
                            <Badge variant={getStatoColor(scadenza.stato) as any} className="text-xs flex items-center gap-1">
                              <StatoIcon className="h-3 w-3" />
                              {scadenza.stato}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600">{scadenza.denominazioneAzienda}</p>
                          {scadenza.descrizione && (
                            <p className="text-xs text-slate-500 mt-1">{scadenza.descrizione}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                        <div className="text-right">
                          <p className={`text-sm font-medium ${
                            daysUntil < 0 ? 'text-red-600' :
                            daysUntil < 7 ? 'text-orange-600' :
                            'text-slate-900'
                          }`}>
                            {daysUntil < 0 ? 'Scaduto' :
                             daysUntil === 0 ? 'Oggi' :
                             daysUntil === 1 ? 'Domani' :
                             `${daysUntil} giorni`}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatDate(scadenza.dataScadenza)}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Gestisci
                        </Button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <CalendarIcon className="h-12 w-12 mb-3" />
                  <p>Nessuna scadenza trovata</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
