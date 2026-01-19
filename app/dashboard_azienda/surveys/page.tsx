"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Calendar as CalendarIcon, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  FileText, 
  Filter, 
  ArrowUpDown,
  X
} from "lucide-react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

const INITIAL_SURVEYS = [
  {
    title: "Quarterly Wellness Assessment",
    status: "Active",
    module: "Wellbeing",
    created: "Oct 15, 2024",
    closes: "Nov 15, 2024",
    responses: 145,
    target: 200,
    rate: 73,
    color: "bg-emerald-100 text-emerald-700"
  },
  {
    title: "DEI & Inclusion Survey",
    status: "Draft",
    module: "DEI",
    created: "Nov 02, 2024",
    closes: "Dec 01, 2024",
    responses: 0,
    target: 200,
    rate: 0,
    color: "bg-yellow-100 text-yellow-700"
  },
  {
    title: "Safety Protocols Feedback",
    status: "Closed",
    module: "Safety",
    created: "Sep 01, 2024",
    closes: "Sep 30, 2024",
    responses: 188,
    target: 200,
    rate: 94,
    color: "bg-slate-100 text-slate-700"
  },
  {
    title: "Vendor Satisfaction Survey",
    status: "Active",
    module: "Supply Chain",
    created: "Oct 20, 2024",
    closes: "Nov 20, 2024",
    responses: 45,
    target: 80,
    rate: 56,
    color: "bg-emerald-100 text-emerald-700"
  },
  {
    title: "Internal Stakeholder Review",
    status: "Draft",
    module: "Stakeholders",
    created: "Nov 05, 2024",
    closes: "Dec 05, 2024",
    responses: 0,
    target: 50,
    rate: 0,
    color: "bg-yellow-100 text-yellow-700"
  }
]

export default function SurveysPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [moduleFilter, setModuleFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  const filteredSurveys = useMemo(() => {
    return INITIAL_SURVEYS
      .filter((s) => {
        const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) || 
                             s.module.toLowerCase().includes(search.toLowerCase())
        const matchesStatus = statusFilter === "all" || s.status === statusFilter
        const matchesModule = moduleFilter === "all" || s.module === moduleFilter
        return matchesSearch && matchesStatus && matchesModule
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.created).getTime() - new Date(a.created).getTime()
        }
        if (sortBy === "title") {
          return a.title.localeCompare(b.title)
        }
        if (sortBy === "rate") {
          return b.rate - a.rate
        }
        return 0
      })
  }, [search, statusFilter, moduleFilter, sortBy])

  const clearFilters = () => {
    setSearch("")
    setStatusFilter("all")
    setModuleFilter("all")
    setSortBy("newest")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
         <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <FileText className="h-8 w-8 text-blue-600" />
                Surveys
            </h1>
            <p className="text-slate-500">Manage and track employee feedback surveys.</p>
         </div>
         <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200">
            <Plus className="h-4 w-4" />
            New Survey
         </Button>
      </div>

       {/* Filters & Controls */}
       <Card className="border-slate-200 shadow-sm overflow-visible">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[240px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Cerca per titolo o modulo..."
                      className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Module Filter */}
                <Select value={moduleFilter} onValueChange={setModuleFilter}>
                  <SelectTrigger className="w-[160px] bg-white border-slate-200">
                    <SelectValue placeholder="Modello" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti i Modelli</SelectItem>
                    <SelectItem value="Wellbeing">Wellbeing</SelectItem>
                    <SelectItem value="DEI">DEI</SelectItem>
                    <SelectItem value="Safety">Safety</SelectItem>
                    <SelectItem value="Supply Chain">Supply Chain</SelectItem>
                    <SelectItem value="Stakeholders">Stakeholders</SelectItem>
                  </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] bg-white border-slate-200">
                    <SelectValue placeholder="Stato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti gli stati</SelectItem>
                    <SelectItem value="Active">Attivo</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Closed">Chiuso</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sorting */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px] bg-white border-slate-200">
                    <SelectValue placeholder="Ordina per" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Più recenti</SelectItem>
                    <SelectItem value="title">Titolo (A-Z)</SelectItem>
                    <SelectItem value="rate">Tasso risposte</SelectItem>
                  </SelectContent>
                </Select>

                {/* Date Button (Mock) */}
                <Button variant="outline" size="sm" className="gap-2 border-slate-200 h-10 px-4">
                  <CalendarIcon className="h-4 w-4 text-slate-500" />
                  <span>Gen - Dic 2024</span>
                </Button>

                {/* Clear Filters */}
                {(search || statusFilter !== "all" || moduleFilter !== "all" || sortBy !== "newest") && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-slate-500 hover:text-red-600 gap-1 h-10"
                  >
                    <X className="h-4 w-4" />
                    Reset
                  </Button>
                )}
            </div>
          </CardContent>
       </Card>

      {/* Survey Grid */}
      {filteredSurveys.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSurveys.map((survey) => (
              <Card key={survey.title} className="border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow group">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="mb-2 text-slate-500 border-slate-100 bg-slate-50/50 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          {survey.module}
                      </Badge>
                      <Badge className={`${survey.color} hover:${survey.color} border-none font-medium text-[10px] tracking-wider uppercase px-2 py-0.5`}>
                          {survey.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                      {survey.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-3">
                    <div className="space-y-4 text-sm text-slate-500">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-xs">
                              <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
                              Creato:
                            </span>
                            <span className="font-semibold text-slate-700">{survey.created}</span>
                        </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-xs">
                              <CalendarIcon className="h-3.5 w-3.5 text-red-400" />
                              Scadenza:
                            </span>
                            <span className="font-semibold text-slate-700">{survey.closes}</span>
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t border-slate-100">
                          <div className="flex justify-between items-end mb-1.5">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Response Rate</span>
                              <span className="text-sm font-black text-slate-900">{survey.rate}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${survey.status === 'Closed' ? 'bg-slate-400' : 'bg-blue-600'}`}
                              style={{ width: `${survey.rate}%` }} 
                            />
                          </div>
                          <div className="flex justify-between items-center mt-1.5">
                            <p className="text-[11px] text-slate-400">
                              {survey.responses} / {survey.target} risposte
                            </p>
                            <Badge variant="secondary" className="h-5 text-[10px] bg-blue-50 text-blue-700">
                              {survey.rate >= 70 ? 'Ottimo' : 'In corso'}
                            </Badge>
                          </div>
                      </div>
                    </div>
                </CardContent>
                <CardFooter className="grid grid-cols-3 gap-2 border-t border-slate-100 p-3 bg-slate-50/50 rounded-b-xl">
                    <Button variant="ghost" size="sm" className="w-full text-slate-600 hover:text-blue-600 hover:bg-white text-xs gap-1.5 font-medium">
                      <Eye className="h-3.5 w-3.5" />
                      Vedi
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full text-slate-600 hover:text-blue-600 hover:bg-white text-xs gap-1.5 font-medium">
                      <Edit className="h-3.5 w-3.5" />
                      Modifica
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full text-slate-600 hover:text-red-600 hover:bg-white text-xs gap-1.5 font-medium">
                      <Trash2 className="h-3.5 w-3.5" />
                      Elimina
                    </Button>
                </CardFooter>
              </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-slate-300 bg-slate-50/50 py-20">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center">
              <Filter className="h-6 w-6 text-slate-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-slate-900">Nessuna survey trovata</h3>
              <p className="text-sm text-slate-500 max-w-xs">
                Non abbiamo trovato risultati per i filtri selezionati. Prova a cambiare i parametri o resetta tutto.
              </p>
            </div>
            <Button variant="outline" onClick={clearFilters} className="gap-2">
              <RefreshCcw className="h-4 w-4" />
              Reset Filtri
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function RefreshCcw(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  )
}
