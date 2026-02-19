"use client"

import React, { useState, useMemo, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion"
import {
  AlertTriangle, CheckCircle, Clock, FileText, Plus,
  Lock, Trash2, TrendingUp, TrendingDown, Minus,
  Settings, ClipboardList, Monitor, BarChart3, StickyNote,
  ArrowLeft, Loader2, Users, Save, Copy
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { ChartRadarLinesOnly } from "@/components/dashboard/charts"
import { ChartConfig } from "@/components/ui/chart"

import type {
  SlcAssessment, SlcSentinelEvent, SlcChecklistItem, SlcRemoteItem,
  SlcYesNo, SlcTrend, SlcRiskLevel, SlcTeamMember
} from "@/lib/slc/types"
import {
  suggestTrend, trendToScore, dichotomousScore, checklistItemScore,
  recalcAllScores,
} from "@/lib/slc/scoring"
import { loadAssessment, saveAssessment, createMockAssessment } from "@/lib/slc/mock-data"
import {
  CHECKLIST_CONTENUTO, CHECKLIST_CONTESTO, CHECKLIST_REMOTO,
  EVENTI_SENTINELLA_DEFS,
} from "@/lib/slc/checklist-items"

// ===== HELPERS =====

const STATUS_CONFIG = {
  draft: { label: "Bozza", color: "bg-slate-100 text-slate-700", icon: FileText },
  review: { label: "In Revisione", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  final: { label: "Finalizzato", color: "bg-green-100 text-green-700", icon: Lock },
}

const RISK_CONFIG: Record<SlcRiskLevel, { label: string; color: string; bg: string }> = {
  basso: { label: "Rischio Basso", color: "text-green-700", bg: "bg-green-100 text-green-800" },
  medio: { label: "Rischio Medio", color: "text-yellow-700", bg: "bg-yellow-100 text-yellow-800" },
  alto: { label: "Rischio Alto", color: "text-red-700", bg: "bg-red-100 text-red-800" },
}

const TREND_OPTIONS: { value: SlcTrend; label: string; icon: React.ElementType }[] = [
  { value: "diminuito", label: "Diminuito (0)", icon: TrendingDown },
  { value: "invariato", label: "Invariato (1)", icon: Minus },
  { value: "aumentato", label: "Aumentato (4)", icon: TrendingUp },
]

function groupByDimension<T extends { id: string }>(
  items: T[],
  definitions: { id: string; dimensione: string }[]
): { dimensione: string; items: T[] }[] {
  const groups: { dimensione: string; items: T[] }[] = []
  let currentDim = ""
  for (const def of definitions) {
    const item = items.find(i => i.id === def.id)
    if (!item) continue
    if (def.dimensione !== currentDim) {
      currentDim = def.dimensione
      groups.push({ dimensione: currentDim, items: [] })
    }
    groups[groups.length - 1].items.push(item)
  }
  return groups
}

// ===== MAIN COMPONENT =====

export default function SlcFase1Page() {
  const params = useParams()
  const router = useRouter()
  const assessmentId = params.assessmentId as string

  const [assessment, setAssessment] = useState<SlcAssessment>(() =>
    loadAssessment(assessmentId) ?? createMockAssessment(assessmentId)
  )
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [openSections, setOpenSections] = useState<string[]>(["setup"])

  const isReadOnly = assessment.status === "final"

  // ===== AUTOSAVE =====
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSaving(true)
      saveAssessment(assessment)
      setTimeout(() => {
        setIsSaving(false)
        setLastSaved(new Date())
      }, 300)
    }, 1500)
    return () => clearTimeout(timer)
  }, [assessment])

  // ===== SCORE RECALCULATION =====
  const scores = useMemo(() => {
    return recalcAllScores(
      assessment.eventiSentinella,
      assessment.checklistContenuto,
      assessment.checklistContesto,
      assessment.moduloRemoto
    )
  }, [assessment.eventiSentinella, assessment.checklistContenuto, assessment.checklistContesto, assessment.moduloRemoto])

  // ===== COMPLETION TRACKING =====
  const completion = useMemo(() => {
    const sentinelAnswered = assessment.eventiSentinella.filter(e =>
      e.tipo === "dichotomous" ? e.risposta !== null : e.trend !== null
    ).length
    const contenutoAnswered = assessment.checklistContenuto.filter(i => i.risposta !== null).length
    const contestoAnswered = assessment.checklistContesto.filter(i => i.risposta !== null).length
    const remotoAnswered = assessment.moduloRemoto.filter(i => i.risposta !== null).length

    return {
      sentinel: Math.round((sentinelAnswered / 10) * 100),
      contenuto: Math.round((contenutoAnswered / CHECKLIST_CONTENUTO.length) * 100),
      contesto: Math.round((contestoAnswered / CHECKLIST_CONTESTO.length) * 100),
      remoto: Math.round((remotoAnswered / CHECKLIST_REMOTO.length) * 100),
    }
  }, [assessment.eventiSentinella, assessment.checklistContenuto, assessment.checklistContesto, assessment.moduloRemoto])

  // ===== UPDATE HANDLERS =====
  const updateSetup = useCallback((field: string, value: unknown) => {
    if (isReadOnly) return
    setAssessment(prev => ({
      ...prev,
      setup: { ...prev.setup, [field]: value }
    }))
  }, [isReadOnly])

  const addTeamMember = useCallback(() => {
    if (isReadOnly) return
    setAssessment(prev => ({
      ...prev,
      setup: {
        ...prev.setup,
        managementTeam: [
          ...prev.setup.managementTeam,
          { id: `tm${Date.now()}`, nome: "", ruolo: "" }
        ]
      }
    }))
  }, [isReadOnly])

  const updateTeamMember = useCallback((id: string, field: keyof SlcTeamMember, value: string) => {
    if (isReadOnly) return
    setAssessment(prev => ({
      ...prev,
      setup: {
        ...prev.setup,
        managementTeam: prev.setup.managementTeam.map(m =>
          m.id === id ? { ...m, [field]: value } : m
        )
      }
    }))
  }, [isReadOnly])

  const removeTeamMember = useCallback((id: string) => {
    if (isReadOnly) return
    setAssessment(prev => ({
      ...prev,
      setup: {
        ...prev.setup,
        managementTeam: prev.setup.managementTeam.filter(m => m.id !== id)
      }
    }))
  }, [isReadOnly])

  const updateSentinelEvent = useCallback((id: string, updates: Partial<SlcSentinelEvent>) => {
    if (isReadOnly) return
    setAssessment(prev => ({
      ...prev,
      eventiSentinella: prev.eventiSentinella.map(e => {
        if (e.id !== id) return e
        const updated = { ...e, ...updates }
        if (updated.tipo === "trend") {
          if (updates.valoreUltimoAnno !== undefined || updates.valoreTriennio !== undefined) {
            const suggested = suggestTrend(updated.valoreUltimoAnno, updated.valoreTriennio)
            if (suggested) updated.trend = suggested
          }
          updated.punteggio = trendToScore(updated.trend)
        }
        if (updated.tipo === "dichotomous" && updates.risposta !== undefined) {
          updated.punteggio = dichotomousScore(updated.risposta)
        }
        return updated
      })
    }))
  }, [isReadOnly])

  const updateChecklistItem = useCallback((
    area: "contenuto" | "contesto",
    id: string,
    updates: { risposta?: SlcYesNo; note?: string }
  ) => {
    if (isReadOnly) return
    const key = area === "contenuto" ? "checklistContenuto" : "checklistContesto" as const
    setAssessment(prev => ({
      ...prev,
      [key]: (prev[key] as SlcChecklistItem[]).map(item => {
        if (item.id !== id) return item
        const updated = { ...item, ...updates }
        if (updates.risposta !== undefined) {
          updated.punteggio = checklistItemScore(updated.risposta)
        }
        return updated
      })
    }))
  }, [isReadOnly])

  const updateRemoteItem = useCallback((id: string, updates: { risposta?: SlcYesNo; note?: string }) => {
    if (isReadOnly) return
    setAssessment(prev => ({
      ...prev,
      moduloRemoto: prev.moduloRemoto.map(item => {
        if (item.id !== id) return item
        const updated = { ...item, ...updates }
        if (updates.risposta !== undefined) {
          updated.punteggio = checklistItemScore(updated.risposta)
        }
        return updated
      })
    }))
  }, [isReadOnly])

  // ===== STATUS TRANSITIONS =====
  const setStatus = useCallback((status: "draft" | "review" | "final") => {
    setAssessment(prev => ({
      ...prev,
      status,
      auditLog: [
        ...prev.auditLog,
        {
          id: `log-${Date.now()}`,
          assessmentId: prev.id,
          campo: "status",
          oldValue: prev.status,
          newValue: status,
          userId: "current-user",
          timestamp: new Date().toISOString(),
        }
      ]
    }))
    const labels = { draft: "Bozza", review: "In Revisione", final: "Finalizzato" }
    toast.success(`Stato aggiornato a: ${labels[status]}`)
  }, [])

  const createNewVersion = useCallback(() => {
    setAssessment(prev => ({
      ...prev,
      status: "draft" as const,
      versione: prev.versione + 1,
      auditLog: [
        ...prev.auditLog,
        {
          id: `log-${Date.now()}`,
          assessmentId: prev.id,
          campo: "versione",
          oldValue: String(prev.versione),
          newValue: String(prev.versione + 1),
          userId: "current-user",
          timestamp: new Date().toISOString(),
        }
      ]
    }))
    toast.info("Nuova versione creata")
  }, [])

  // ===== RADAR CHART DATA =====
  const radarData = useMemo(() => [
    { area: "Eventi Sentinella", value: scores.totaleEventiSentinella },
    { area: "Contenuto", value: scores.totaleContenuto },
    { area: "Contesto", value: scores.totaleContesto },
  ], [scores])

  const radarConfig: ChartConfig = {
    value: { label: "Punteggio", color: "hsl(var(--chart-1))" },
  }

  // ===== CHECKLIST RENDER HELPER =====
  const renderChecklistSection = (
    area: "contenuto" | "contesto",
    definitions: typeof CHECKLIST_CONTENUTO | typeof CHECKLIST_CONTESTO,
    items: SlcChecklistItem[],
    totale: number,
    maxScore: number
  ) => {
    const grouped = groupByDimension(items, definitions)
    return (
      <div className="space-y-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Cod.</TableHead>
              <TableHead>Indicatore</TableHead>
              <TableHead className="w-[120px] text-center">Risposta</TableHead>
              <TableHead className="w-[80px] text-center">Punti</TableHead>
              <TableHead className="w-[200px]">Note</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grouped.map(group => (
              <React.Fragment key={group.dimensione}>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableCell colSpan={5} className="font-semibold text-slate-700 py-2">
                    {group.dimensione}
                  </TableCell>
                </TableRow>
                {group.items.map(item => {
                  const def = definitions.find(d => d.id === item.id)
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="text-xs text-slate-400 font-mono">{item.codice}</TableCell>
                      <TableCell className="text-sm">{def?.testo}</TableCell>
                      <TableCell className="text-center">
                        <Select
                          value={item.risposta || ""}
                          onValueChange={(v) => updateChecklistItem(area, item.id, { risposta: v as SlcYesNo })}
                          disabled={isReadOnly}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="—" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="si">Sì</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={cn(
                          "text-xs",
                          item.punteggio > 0 ? "border-red-200 text-red-700" : "border-green-200 text-green-700"
                        )}>
                          {item.punteggio}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Input
                          className="h-8 text-xs"
                          placeholder="Note..."
                          value={item.note}
                          onChange={(e) => updateChecklistItem(area, item.id, { note: e.target.value })}
                          disabled={isReadOnly}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
          <span className="font-semibold text-sm">Totale {area === "contenuto" ? "Contenuto" : "Contesto"}</span>
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">{totale}</span>
            <span className="text-sm text-slate-500">/ {maxScore}</span>
          </div>
        </div>
      </div>
    )
  }

  // ===== RENDER =====
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/dashboard_azienda/slc")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              Valutazione SLC — Fase 1
              {isReadOnly && <Lock className="h-5 w-5 text-slate-400" />}
            </h1>
            <p className="text-sm text-slate-500">
              {assessment.setup.nomeGruppoOmogeneo} • v{assessment.versione}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Autosave indicator */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            {isSaving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Salvataggio...</span>
              </>
            ) : lastSaved ? (
              <>
                <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                <span>Salvato alle {lastSaved.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}</span>
              </>
            ) : null}
          </div>
          {/* Status badge */}
          {(() => {
            const cfg = STATUS_CONFIG[assessment.status]
            const Icon = cfg.icon
            return (
              <Badge className={cn(cfg.color, "gap-1.5")}>
                <Icon className="h-3.5 w-3.5" />
                {cfg.label}
              </Badge>
            )
          })()}
        </div>
      </div>

      {/* ACCORDION SECTIONS */}
      <Accordion
        type="multiple"
        value={openSections}
        onValueChange={setOpenSections}
        className="space-y-4"
      >
        {/* ===== 1. SETUP ===== */}
        <AccordionItem value="setup" className="border rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <Settings className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <span className="font-semibold">Configurazione</span>
                <p className="text-xs text-slate-500 font-normal">Dati generali della valutazione</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <Label>Gruppo Omogeneo</Label>
                <Input
                  value={assessment.setup.nomeGruppoOmogeneo}
                  onChange={(e) => updateSetup("nomeGruppoOmogeneo", e.target.value)}
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label>Numero Lavoratori</Label>
                <Input
                  type="number"
                  value={assessment.setup.numeroLavoratori ?? ""}
                  onChange={(e) => updateSetup("numeroLavoratori", e.target.value ? Number(e.target.value) : null)}
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label>Data Valutazione</Label>
                <Input
                  type="date"
                  value={assessment.setup.dataValutazione}
                  onChange={(e) => updateSetup("dataValutazione", e.target.value)}
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo Valutazione</Label>
                <Select
                  value={assessment.setup.tipoValutazione}
                  onValueChange={(v) => updateSetup("tipoValutazione", v)}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iniziale">Iniziale</SelectItem>
                    <SelectItem value="aggiornamento">Aggiornamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Company ID</Label>
                <Input
                  value={assessment.setup.companyId}
                  onChange={(e) => updateSetup("companyId", e.target.value)}
                  disabled={isReadOnly}
                />
              </div>
              <div className="flex flex-col gap-2 justify-end">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={assessment.setup.remoteWorkEnabled}
                    onCheckedChange={(v) => updateSetup("remoteWorkEnabled", v)}
                    disabled={isReadOnly}
                  />
                  <Label>Lavoro da remoto attivo</Label>
                </div>
                {assessment.setup.remoteWorkEnabled && (
                  <Input
                    type="number"
                    placeholder="N. lavoratori remoto"
                    value={assessment.setup.numeroLavoratoriRemoto ?? ""}
                    onChange={(e) => updateSetup("numeroLavoratoriRemoto", e.target.value ? Number(e.target.value) : null)}
                    disabled={isReadOnly}
                  />
                )}
              </div>
            </div>

            {/* Management Team */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Gruppo di Gestione della Valutazione</Label>
                {!isReadOnly && (
                  <Button variant="outline" size="sm" onClick={addTeamMember} className="gap-1.5">
                    <Plus className="h-3.5 w-3.5" /> Aggiungi membro
                  </Button>
                )}
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome e Cognome</TableHead>
                    <TableHead>Ruolo</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessment.setup.managementTeam.map(member => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <Input
                          className="h-8"
                          value={member.nome}
                          onChange={(e) => updateTeamMember(member.id, "nome", e.target.value)}
                          disabled={isReadOnly}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          className="h-8"
                          value={member.ruolo}
                          onChange={(e) => updateTeamMember(member.id, "ruolo", e.target.value)}
                          disabled={isReadOnly}
                        />
                      </TableCell>
                      <TableCell>
                        {!isReadOnly && (
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeTeamMember(member.id)}>
                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Note generali */}
            <div className="mt-4 space-y-2">
              <Label>Note Generali</Label>
              <Textarea
                value={assessment.setup.noteGenerali}
                onChange={(e) => updateSetup("noteGenerali", e.target.value)}
                placeholder="Annotazioni generali sulla valutazione..."
                rows={3}
                disabled={isReadOnly}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ===== 2. EVENTI SENTINELLA ===== */}
        <AccordionItem value="sentinel" className="border rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 rounded-lg bg-orange-50">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-left flex-1">
                <span className="font-semibold">Eventi Sentinella</span>
                <p className="text-xs text-slate-500 font-normal">10 indicatori — completamento {completion.sentinel}%</p>
              </div>
              <Badge className={RISK_CONFIG[scores.rischioEventiSentinella].bg}>
                {scores.totaleEventiSentinella} pt
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Cod.</TableHead>
                    <TableHead>Indicatore</TableHead>
                    <TableHead className="w-[110px] text-center">Val. Ultimo Anno</TableHead>
                    <TableHead className="w-[110px] text-center">Val. Triennio</TableHead>
                    <TableHead className="w-[160px] text-center">Andamento</TableHead>
                    <TableHead className="w-[80px] text-center">Punti</TableHead>
                    <TableHead className="w-[180px]">Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessment.eventiSentinella.map(event => (
                    <TableRow key={event.id}>
                      <TableCell className="text-xs text-slate-400 font-mono">{event.codice}</TableCell>
                      <TableCell className="text-sm font-medium">{event.nome}</TableCell>

                      {event.tipo === "trend" ? (
                        <>
                          <TableCell>
                            <Input
                              type="number"
                              className="h-8 text-xs text-center"
                              value={event.valoreUltimoAnno ?? ""}
                              onChange={(e) => updateSentinelEvent(event.id, {
                                valoreUltimoAnno: e.target.value ? Number(e.target.value) : null
                              })}
                              disabled={isReadOnly}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              className="h-8 text-xs text-center"
                              value={event.valoreTriennio ?? ""}
                              onChange={(e) => updateSentinelEvent(event.id, {
                                valoreTriennio: e.target.value ? Number(e.target.value) : null
                              })}
                              disabled={isReadOnly}
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={event.trend || ""}
                              onValueChange={(v) => updateSentinelEvent(event.id, { trend: v as SlcTrend })}
                              disabled={isReadOnly}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="—" />
                              </SelectTrigger>
                              <SelectContent>
                                {TREND_OPTIONS.map(opt => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell colSpan={2} className="text-center text-xs text-slate-400">
                            Indicatore dicotomico
                          </TableCell>
                          <TableCell>
                            <Select
                              value={event.risposta || ""}
                              onValueChange={(v) => updateSentinelEvent(event.id, { risposta: v as SlcYesNo })}
                              disabled={isReadOnly}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="—" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="no">No (0)</SelectItem>
                                <SelectItem value="si">Sì (4)</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </>
                      )}

                      <TableCell className="text-center">
                        <Badge variant="outline" className={cn(
                          "text-xs font-bold",
                          event.punteggio >= 4 ? "border-red-200 text-red-700 bg-red-50" :
                          event.punteggio >= 1 ? "border-yellow-200 text-yellow-700 bg-yellow-50" :
                          "border-green-200 text-green-700 bg-green-50"
                        )}>
                          {event.punteggio}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Input
                          className="h-8 text-xs"
                          placeholder="Note..."
                          value={event.note}
                          onChange={(e) => updateSentinelEvent(event.id, { note: e.target.value })}
                          disabled={isReadOnly}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* Totale */}
            <div className="flex items-center justify-between p-3 mt-3 bg-slate-50 rounded-lg border">
              <span className="font-semibold text-sm">Totale Eventi Sentinella</span>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold">{scores.totaleEventiSentinella}</span>
                <span className="text-sm text-slate-500">/ 400</span>
                <Badge className={RISK_CONFIG[scores.rischioEventiSentinella].bg}>
                  {RISK_CONFIG[scores.rischioEventiSentinella].label}
                </Badge>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ===== 3. CONTENUTO DEL LAVORO ===== */}
        <AccordionItem value="contenuto" className="border rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 rounded-lg bg-purple-50">
                <ClipboardList className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-left flex-1">
                <span className="font-semibold">Contenuto del Lavoro</span>
                <p className="text-xs text-slate-500 font-normal">{CHECKLIST_CONTENUTO.length} indicatori — completamento {completion.contenuto}%</p>
              </div>
              <Badge variant="outline" className="font-bold">{scores.totaleContenuto} pt</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            {renderChecklistSection("contenuto", CHECKLIST_CONTENUTO, assessment.checklistContenuto, scores.totaleContenuto, CHECKLIST_CONTENUTO.length)}
          </AccordionContent>
        </AccordionItem>

        {/* ===== 4. CONTESTO DEL LAVORO ===== */}
        <AccordionItem value="contesto" className="border rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 rounded-lg bg-teal-50">
                <Users className="h-5 w-5 text-teal-600" />
              </div>
              <div className="text-left flex-1">
                <span className="font-semibold">Contesto del Lavoro</span>
                <p className="text-xs text-slate-500 font-normal">{CHECKLIST_CONTESTO.length} indicatori — completamento {completion.contesto}%</p>
              </div>
              <Badge variant="outline" className="font-bold">{scores.totaleContesto} pt</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            {renderChecklistSection("contesto", CHECKLIST_CONTESTO, assessment.checklistContesto, scores.totaleContesto, CHECKLIST_CONTESTO.length)}
          </AccordionContent>
        </AccordionItem>

        {/* ===== 5. MODULO REMOTO (condizionale) ===== */}
        {assessment.setup.remoteWorkEnabled && (
          <AccordionItem value="remoto" className="border rounded-lg overflow-hidden border-dashed border-indigo-200">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 rounded-lg bg-indigo-50">
                  <Monitor className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="text-left flex-1">
                  <span className="font-semibold">Modulo Lavoro Remoto / Innovazione Tecnologica</span>
                  <p className="text-xs text-slate-500 font-normal">Opzionale — completamento {completion.remoto}% — NON influisce sul totale Fase 1</p>
                </div>
                <Badge variant="outline" className="font-bold border-indigo-200 text-indigo-700">{scores.totaleModuloRemoto} pt</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="mb-3 p-2 bg-indigo-50 rounded-lg text-xs text-indigo-700 flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5" />
                Il punteggio di questo modulo è separato e NON viene sommato al totale della Fase 1
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Cod.</TableHead>
                    <TableHead>Indicatore</TableHead>
                    <TableHead className="w-[120px] text-center">Risposta</TableHead>
                    <TableHead className="w-[80px] text-center">Punti</TableHead>
                    <TableHead className="w-[200px]">Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessment.moduloRemoto.map(item => {
                    const def = CHECKLIST_REMOTO.find(d => d.id === item.id)
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="text-xs text-slate-400 font-mono">{item.codice}</TableCell>
                        <TableCell className="text-sm">{def?.testo}</TableCell>
                        <TableCell className="text-center">
                          <Select
                            value={item.risposta || ""}
                            onValueChange={(v) => updateRemoteItem(item.id, { risposta: v as SlcYesNo })}
                            disabled={isReadOnly}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="—" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="si">Sì</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={cn(
                            "text-xs",
                            item.punteggio > 0 ? "border-red-200 text-red-700" : "border-green-200 text-green-700"
                          )}>
                            {item.punteggio}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Input
                            className="h-8 text-xs"
                            placeholder="Note..."
                            value={item.note}
                            onChange={(e) => updateRemoteItem(item.id, { note: e.target.value })}
                            disabled={isReadOnly}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between p-3 mt-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <span className="font-semibold text-sm text-indigo-700">Totale Modulo Remoto</span>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-indigo-700">{scores.totaleModuloRemoto}</span>
                  <span className="text-sm text-indigo-400">/ {CHECKLIST_REMOTO.length}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* ===== 6. RIEPILOGO PUNTEGGI ===== */}
        <AccordionItem value="riepilogo" className="border rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 rounded-lg bg-emerald-50">
                <BarChart3 className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="text-left flex-1">
                <span className="font-semibold">Riepilogo Punteggi</span>
                <p className="text-xs text-slate-500 font-normal">Sintesi finale della Fase 1</p>
              </div>
              <Badge className={RISK_CONFIG[scores.rischioFase1].bg}>
                {scores.totaleFase1} pt — {RISK_CONFIG[scores.rischioFase1].label}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Eventi Sentinella */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-600">Eventi Sentinella</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{scores.totaleEventiSentinella}<span className="text-sm font-normal text-slate-400"> / 400</span></div>
                  <Progress value={(scores.totaleEventiSentinella / 400) * 100} className="mt-2 h-2" />
                  <div className="mt-2">
                    <Badge className={RISK_CONFIG[scores.rischioEventiSentinella].bg}>
                      {RISK_CONFIG[scores.rischioEventiSentinella].label}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Contenuto */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-600">Contenuto del Lavoro</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{scores.totaleContenuto}<span className="text-sm font-normal text-slate-400"> / {CHECKLIST_CONTENUTO.length}</span></div>
                  <Progress value={(scores.totaleContenuto / CHECKLIST_CONTENUTO.length) * 100} className="mt-2 h-2" />
                </CardContent>
              </Card>

              {/* Contesto */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-600">Contesto del Lavoro</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{scores.totaleContesto}<span className="text-sm font-normal text-slate-400"> / {CHECKLIST_CONTESTO.length}</span></div>
                  <Progress value={(scores.totaleContesto / CHECKLIST_CONTESTO.length) * 100} className="mt-2 h-2" />
                </CardContent>
              </Card>

              {/* Totale Fase 1 */}
              <Card className="border-2 border-slate-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-slate-900">TOTALE FASE 1</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black">{scores.totaleFase1}<span className="text-sm font-normal text-slate-400"> / {400 + CHECKLIST_CONTENUTO.length + CHECKLIST_CONTESTO.length}</span></div>
                  <Progress value={(scores.totaleFase1 / (400 + CHECKLIST_CONTENUTO.length + CHECKLIST_CONTESTO.length)) * 100} className="mt-2 h-2" />
                  <div className="mt-2">
                    <Badge className={cn(RISK_CONFIG[scores.rischioFase1].bg, "text-sm px-3 py-1")}>
                      {RISK_CONFIG[scores.rischioFase1].label}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Modulo Remoto separato */}
            {assessment.setup.remoteWorkEnabled && (
              <Card className="border-dashed border-2 border-indigo-200 mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-indigo-700 flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    Modulo Remoto / Tecnologia (separato)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-indigo-700">{scores.totaleModuloRemoto}<span className="text-sm font-normal text-indigo-400"> / {CHECKLIST_REMOTO.length}</span></div>
                  <Progress value={(scores.totaleModuloRemoto / CHECKLIST_REMOTO.length) * 100} className="mt-2 h-2" />
                  <p className="text-xs text-indigo-500 mt-2">Punteggio non incluso nel totale Fase 1</p>
                </CardContent>
              </Card>
            )}

            {/* Radar Chart */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-sm">Distribuzione Punteggi per Area</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartRadarLinesOnly data={radarData} config={radarConfig} />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {assessment.status === "draft" && (
                <>
                  <Button variant="outline" onClick={() => setStatus("review")} className="gap-2">
                    <Clock className="h-4 w-4" /> Invia in Revisione
                  </Button>
                  <Button onClick={() => setStatus("final")} className="gap-2 bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4" /> Finalizza Valutazione
                  </Button>
                </>
              )}
              {assessment.status === "review" && (
                <>
                  <Button variant="outline" onClick={() => setStatus("draft")} className="gap-2">
                    <FileText className="h-4 w-4" /> Torna a Bozza
                  </Button>
                  <Button onClick={() => setStatus("final")} className="gap-2 bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4" /> Finalizza Valutazione
                  </Button>
                </>
              )}
              {assessment.status === "final" && (
                <>
                  <Button variant="outline" onClick={createNewVersion} className="gap-2">
                    <Copy className="h-4 w-4" /> Crea Nuova Versione
                  </Button>
                  <Button className="gap-2" disabled>
                    Procedi a Fase 2
                  </Button>
                </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ===== 7. NOTE E AZIONI ===== */}
        <AccordionItem value="note" className="border rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50">
                <StickyNote className="h-5 w-5 text-amber-600" />
              </div>
              <div className="text-left">
                <span className="font-semibold">Note e Azioni Correttive</span>
                <p className="text-xs text-slate-500 font-normal">Osservazioni finali e piano di intervento</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-semibold">Note Finali</Label>
                <Textarea
                  value={assessment.noteFinali}
                  onChange={(e) => setAssessment(prev => ({ ...prev, noteFinali: e.target.value }))}
                  placeholder="Osservazioni conclusive sulla valutazione..."
                  rows={4}
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Azioni Correttive</Label>
                <Textarea
                  value={assessment.azioniCorrettive}
                  onChange={(e) => setAssessment(prev => ({ ...prev, azioniCorrettive: e.target.value }))}
                  placeholder="Elenco delle azioni correttive e migliorative previste..."
                  rows={4}
                  disabled={isReadOnly}
                />
              </div>

              {/* Audit Log */}
              {assessment.auditLog.length > 0 && (
                <div className="space-y-2 mt-6">
                  <Label className="font-semibold text-slate-600">Registro Modifiche</Label>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data/Ora</TableHead>
                        <TableHead>Campo</TableHead>
                        <TableHead>Valore Precedente</TableHead>
                        <TableHead>Nuovo Valore</TableHead>
                        <TableHead>Utente</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assessment.auditLog.map(log => (
                        <TableRow key={log.id}>
                          <TableCell className="text-xs">
                            {new Date(log.timestamp).toLocaleString("it-IT")}
                          </TableCell>
                          <TableCell className="text-xs font-mono">{log.campo}</TableCell>
                          <TableCell className="text-xs">{log.oldValue}</TableCell>
                          <TableCell className="text-xs">{log.newValue}</TableCell>
                          <TableCell className="text-xs">{log.userId}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
