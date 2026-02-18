"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Shield,
  GraduationCap,
  Stethoscope,
  HardHat,
  FileCheck,
  Calendar,
  Bell,
  Download,
  Upload,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Mail,
  Plus,
  TrendingUp,
  X
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock Data
const mockTrainingPlans = [
  { id: 1, worker: "Mario Rossi", course: "Antincendio Rischio Medio", deadline: "2026-03-15", status: "pending", department: "Produzione" },
  { id: 2, worker: "Laura Bianchi", course: "Primo Soccorso", deadline: "2026-02-28", status: "completed", department: "Amministrazione" },
  { id: 3, worker: "Giuseppe Verdi", course: "Carrelli Elevatori", deadline: "2026-04-10", status: "in_progress", department: "Logistica" },
  { id: 4, worker: "Anna Neri", course: "Lavori in Quota", deadline: "2026-02-20", status: "pending", department: "Manutenzione" },
  { id: 5, worker: "Carlo Ferrari", course: "Spazi Confinati", deadline: "2026-05-05", status: "overdue", department: "Manutenzione" },
]

const mockHealthSurveillance = [
  { id: 1, worker: "Mario Rossi", type: "Visita Periodica", deadline: "2026-03-01", doctor: "Dr. Colombo", status: "scheduled" },
  { id: 2, worker: "Laura Bianchi", type: "Visita Preassuntiva", deadline: "2026-02-15", doctor: "Dr. Ricci", status: "completed" },
  { id: 3, worker: "Giuseppe Verdi", type: "Visita Periodica", deadline: "2026-04-20", doctor: "Dr. Colombo", status: "pending" },
  { id: 4, worker: "Anna Neri", type: "Visita su Richiesta", deadline: "2026-02-25", doctor: "Dr. Ricci", status: "scheduled" },
]

const mockDpiDeadlines = [
  { id: 1, equipment: "Scarpe Antinfortunistiche", quantity: 50, department: "Produzione", deadline: "2026-03-10", status: "active" },
  { id: 2, equipment: "Caschi di Protezione", quantity: 30, department: "Manutenzione", deadline: "2026-02-18", status: "warning" },
  { id: 3, equipment: "Guanti Anticalore", quantity: 100, department: "Produzione", deadline: "2026-04-05", status: "active" },
  { id: 4, equipment: "Maschere FFP3", quantity: 200, department: "Tutti", deadline: "2026-02-12", status: "critical" },
]

const mockCompliance = [
  { id: 1, document: "DVR - Documento Valutazione Rischi", deadline: "2026-06-30", responsible: "RSPP", status: "active" },
  { id: 2, document: "Piano di Emergenza", deadline: "2026-03-15", responsible: "RSPP", status: "warning" },
  { id: 3, document: "Registro Infortuni", deadline: "Continuo", responsible: "HR", status: "active" },
  { id: 4, document: "Certificato Prevenzione Incendi", deadline: "2026-12-31", responsible: "Facility", status: "active" },
]

export default function SafetyPage() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  // Statistics
  const stats = {
    trainingCompliance: 87.5,
    healthChecksCompleted: 94,
    dpiActive: 75,
    documentsUpToDate: 100
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default'
      case 'in_progress': return 'default'
      case 'pending': return 'secondary'
      case 'overdue': case 'critical': return 'destructive'
      case 'scheduled': case 'active': return 'default'
      case 'warning': return 'default'
      default: return 'secondary'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completato'
      case 'in_progress': return 'In corso'
      case 'pending': return 'Da fare'
      case 'overdue': return 'Scaduto'
      case 'scheduled': return 'Programmato'
      case 'active': return 'Attivo'
      case 'critical': return 'Critico'
      case 'warning': return 'Attenzione'
      default: return status
    }
  }

  const getDaysUntil = (dateString: string) => {
    if (dateString === "Continuo") return null
    const days = Math.ceil((new Date(dateString).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  const modules = [
    {
      id: 'training',
      title: 'Piani Formativi',
      icon: GraduationCap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Gestione corsi e formazione obbligatoria',
      value: `${stats.trainingCompliance}%`,
      status: stats.trainingCompliance >= 90 ? 'Ottimo' : 'Da migliorare'
    },
    {
      id: 'health',
      title: 'Sorveglianza Sanitaria',
      icon: Stethoscope,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Visite mediche e idoneità lavoratori',
      value: `${stats.healthChecksCompleted}%`,
      status: 'Conforme'
    },
    {
      id: 'dpi',
      title: 'Scadenze DPI',
      icon: HardHat,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Dispositivi di protezione individuale',
      value: `${mockDpiDeadlines.length} attivi`,
      status: '2 in scadenza'
    },
    {
      id: 'compliance',
      title: 'Adempimenti HSE',
      icon: FileCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Documentazione e obblighi normativi',
      value: `${stats.documentsUpToDate}%`,
      status: 'Conforme'
    }
  ]

  const clearFilters = () => {
    setSearchTerm("")
    setFilterDepartment("all")
    setFilterStatus("all")
  }

  const hasActiveFilters = searchTerm !== "" || filterDepartment !== "all" || filterStatus !== "all"

  return (
    <div className="space-y-6 mt-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            Gestionale HSE
          </h1>
          <p className="text-slate-500 mt-1">Sistema di gestione salute, sicurezza e ambiente</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Importa Excel
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Esporta
          </Button>
        </div>
      </div>

      {/* Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {modules.map((module) => (
          <Card
            key={module.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedModule === module.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedModule(module.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-lg ${module.bgColor}`}>
                  <module.icon className={`h-6 w-6 ${module.color}`} />
                </div>
                <Badge variant="outline" className="text-xs">
                  {module.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-sm font-medium text-slate-600 mb-1">
                {module.title}
              </CardTitle>
              <p className="text-2xl font-bold text-slate-900 mb-1">{module.value}</p>
              <p className="text-xs text-slate-500">{module.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      {selectedModule ? (
        <Card className="border-2 border-blue-100">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {(() => {
                  const module = modules.find(m => m.id === selectedModule)
                  const Icon = module?.icon || Shield
                  return (
                    <>
                      <div className={`p-2 rounded-lg ${module?.bgColor}`}>
                        <Icon className={`h-5 w-5 ${module?.color}`} />
                      </div>
                      <div>
                        <CardTitle>{module?.title}</CardTitle>
                        <CardDescription>{module?.description}</CardDescription>
                      </div>
                    </>
                  )
                })()}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedModule(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={selectedModule} className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="training">Piani Formativi</TabsTrigger>
                <TabsTrigger value="health">Sorveglianza</TabsTrigger>
                <TabsTrigger value="dpi">DPI</TabsTrigger>
                <TabsTrigger value="compliance">Adempimenti</TabsTrigger>
              </TabsList>

              {/* Training Plans */}
              <TabsContent value="training" className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="relative flex-1 min-w-[240px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Cerca lavoratore o corso..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tutti i reparti</SelectItem>
                      <SelectItem value="Produzione">Produzione</SelectItem>
                      <SelectItem value="Amministrazione">Amministrazione</SelectItem>
                      <SelectItem value="Logistica">Logistica</SelectItem>
                      <SelectItem value="Manutenzione">Manutenzione</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tutti gli stati</SelectItem>
                      <SelectItem value="pending">Da fare</SelectItem>
                      <SelectItem value="in_progress">In corso</SelectItem>
                      <SelectItem value="completed">Completati</SelectItem>
                      <SelectItem value="overdue">Scaduti</SelectItem>
                    </SelectContent>
                  </Select>

                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="h-4 w-4 mr-1" />
                      Cancella
                    </Button>
                  )}

                  <Button className="gap-2 ml-auto">
                    <Plus className="h-4 w-4" />
                    Nuovo Piano
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lavoratore</TableHead>
                      <TableHead>Corso</TableHead>
                      <TableHead>Reparto</TableHead>
                      <TableHead>Scadenza</TableHead>
                      <TableHead>Stato</TableHead>
                      <TableHead className="text-right">Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTrainingPlans.map((plan) => {
                      const daysUntil = getDaysUntil(plan.deadline)
                      return (
                        <TableRow key={plan.id}>
                          <TableCell className="font-medium">{plan.worker}</TableCell>
                          <TableCell>{plan.course}</TableCell>
                          <TableCell>{plan.department}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm">{new Date(plan.deadline).toLocaleDateString('it-IT')}</span>
                              {daysUntil !== null && (
                                <span className={`text-xs ${
                                  daysUntil < 0 ? 'text-red-600' :
                                  daysUntil < 7 ? 'text-orange-600' :
                                  'text-slate-500'
                                }`}>
                                  {daysUntil < 0 ? `${Math.abs(daysUntil)} giorni fa` :
                                   daysUntil === 0 ? 'Oggi' :
                                   `${daysUntil} giorni`}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(plan.status) as any}>
                              {getStatusLabel(plan.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TabsContent>

              {/* Health Surveillance */}
              <TabsContent value="health" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                      <Calendar className="h-4 w-4" />
                      Calendario Visite
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Bell className="h-4 w-4" />
                      Imposta Reminder
                    </Button>
                  </div>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nuova Visita
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lavoratore</TableHead>
                      <TableHead>Tipo Visita</TableHead>
                      <TableHead>Medico Competente</TableHead>
                      <TableHead>Data Programmata</TableHead>
                      <TableHead>Stato</TableHead>
                      <TableHead className="text-right">Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockHealthSurveillance.map((visit) => {
                      const daysUntil = getDaysUntil(visit.deadline)
                      return (
                        <TableRow key={visit.id}>
                          <TableCell className="font-medium">{visit.worker}</TableCell>
                          <TableCell>{visit.type}</TableCell>
                          <TableCell>{visit.doctor}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm">{new Date(visit.deadline).toLocaleDateString('it-IT')}</span>
                              {daysUntil !== null && daysUntil >= 0 && (
                                <span className="text-xs text-slate-500">
                                  {daysUntil === 0 ? 'Oggi' : `${daysUntil} giorni`}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(visit.status) as any}>
                              {getStatusLabel(visit.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              Gestisci
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TabsContent>

              {/* DPI Deadlines */}
              <TabsContent value="dpi" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Registro DPI
                    </Button>
                  </div>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Aggiungi DPI
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockDpiDeadlines.map((dpi) => {
                    const daysUntil = getDaysUntil(dpi.deadline)
                    const isWarning = daysUntil !== null && daysUntil < 7
                    const isCritical = dpi.status === 'critical'

                    return (
                      <Card key={dpi.id} className={`${
                        isCritical ? 'border-red-200 bg-red-50/30' :
                        isWarning ? 'border-orange-200 bg-orange-50/30' :
                        'border-slate-200'
                      }`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${
                                isCritical ? 'bg-red-100' :
                                isWarning ? 'bg-orange-100' :
                                'bg-slate-100'
                              }`}>
                                <HardHat className={`h-5 w-5 ${
                                  isCritical ? 'text-red-600' :
                                  isWarning ? 'text-orange-600' :
                                  'text-slate-600'
                                }`} />
                              </div>
                              <div>
                                <CardTitle className="text-base">{dpi.equipment}</CardTitle>
                                <p className="text-sm text-slate-600">{dpi.department}</p>
                              </div>
                            </div>
                            <Badge variant={getStatusColor(dpi.status) as any}>
                              {getStatusLabel(dpi.status)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm">
                            <div>
                              <p className="text-slate-500">Quantità</p>
                              <p className="font-semibold text-slate-900">{dpi.quantity} unità</p>
                            </div>
                            <div className="text-right">
                              <p className="text-slate-500">Scadenza</p>
                              <p className={`font-semibold ${
                                isCritical || (daysUntil !== null && daysUntil < 0) ? 'text-red-600' :
                                isWarning ? 'text-orange-600' :
                                'text-slate-900'
                              }`}>
                                {new Date(dpi.deadline).toLocaleDateString('it-IT')}
                              </p>
                              {daysUntil !== null && (
                                <p className="text-xs text-slate-500">
                                  {daysUntil < 0 ? `${Math.abs(daysUntil)} giorni fa` :
                                   daysUntil === 0 ? 'Oggi' :
                                   `${daysUntil} giorni`}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Button variant="outline" className="w-full" size="sm">
                            <Bell className="h-4 w-4 mr-2" />
                            Imposta Reminder
                          </Button>
                        </CardFooter>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>

              {/* Compliance */}
              <TabsContent value="compliance" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Archivio Documenti
                    </Button>
                  </div>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nuovo Adempimento
                  </Button>
                </div>

                <div className="space-y-3">
                  {mockCompliance.map((doc) => {
                    const daysUntil = getDaysUntil(doc.deadline)
                    const isWarning = daysUntil !== null && daysUntil < 30

                    return (
                      <Card key={doc.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className={`p-2 rounded-lg ${
                                isWarning ? 'bg-orange-100' : 'bg-green-100'
                              }`}>
                                <FileCheck className={`h-5 w-5 ${
                                  isWarning ? 'text-orange-600' : 'text-green-600'
                                }`} />
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-base">{doc.document}</CardTitle>
                                <div className="flex items-center gap-4 mt-1">
                                  <p className="text-sm text-slate-600">
                                    <span className="text-slate-500">Responsabile:</span> {doc.responsible}
                                  </p>
                                  <p className="text-sm text-slate-600">
                                    <span className="text-slate-500">Scadenza:</span>{' '}
                                    {doc.deadline === "Continuo" ? doc.deadline : new Date(doc.deadline).toLocaleDateString('it-IT')}
                                  </p>
                                  {daysUntil !== null && (
                                    <p className={`text-sm font-medium ${
                                      isWarning ? 'text-orange-600' : 'text-slate-600'
                                    }`}>
                                      {daysUntil < 0 ? `Scaduto ${Math.abs(daysUntil)} giorni fa` :
                                       daysUntil === 0 ? 'Scade oggi' :
                                       `${daysUntil} giorni`}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={getStatusColor(doc.status) as any}>
                                {getStatusLabel(doc.status)}
                              </Badge>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed border-2 border-slate-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Seleziona un modulo per iniziare
            </h3>
            <p className="text-slate-500 text-center max-w-md">
              Clicca su una delle card sopra per gestire piani formativi, sorveglianza sanitaria, DPI o adempimenti HSE
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Scadenze Imminenti (7 giorni)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">5</div>
            <p className="text-xs text-slate-500 mt-1">2 DPI, 2 formazioni, 1 visita</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Conformità Generale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">92%</div>
            <Progress value={92} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              Lavoratori Monitorati
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">248</div>
            <p className="text-xs text-slate-500 mt-1">Tutti i reparti aziendali</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
