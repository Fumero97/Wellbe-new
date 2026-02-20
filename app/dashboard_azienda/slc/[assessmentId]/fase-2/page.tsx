"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Brain,
  Users,
  Play,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  FileText,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

import type { SlcAssessment, SlcFase2Data } from "@/lib/slc/types"
import { loadAssessment, saveAssessment } from "@/lib/slc/mock-data"
import { PERCEPTION_QUESTIONS, PERCEPTION_DIMENSIONI, DIMENSION_DEFS } from "@/lib/slc/perception-questions"
import { calcFase2Scores, generateMockPerceptionAnswers } from "@/lib/slc/scoring"

// ===== HELPERS =====

const RISCHIO_CONFIG = {
  basso: { label: "Basso",  bg: "bg-green-100  text-green-800",  bar: "bg-green-500"  },
  medio: { label: "Medio",  bg: "bg-yellow-100 text-yellow-800", bar: "bg-yellow-500" },
  alto:  { label: "Alto",   bg: "bg-red-100    text-red-800",    bar: "bg-red-500"    },
}

const DIM_COLORS: Record<string, string> = {
  "Domanda":             "text-orange-600 bg-orange-50   border-orange-200",
  "Controllo":           "text-blue-600   bg-blue-50     border-blue-200",
  "Supporto Management": "text-purple-600 bg-purple-50   border-purple-200",
  "Supporto Colleghi":   "text-teal-600   bg-teal-50     border-teal-200",
  "Relazioni":           "text-rose-600   bg-rose-50     border-rose-200",
  "Ruolo":               "text-indigo-600 bg-indigo-50   border-indigo-200",
  "Cambiamento":         "text-pink-600   bg-pink-50     border-pink-200",
}

// ===== MAIN PAGE =====

export default function Fase2Page() {
  const params = useParams()
  const router = useRouter()
  const assessmentId = params.assessmentId as string

  const [assessment, setAssessment] = useState<SlcAssessment | null>(null)
  const [isActivating, setIsActivating] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)

  const load = useCallback(() => {
    const a = loadAssessment(assessmentId)
    setAssessment(a)
  }, [assessmentId])

  useEffect(() => { load() }, [load])

  if (!assessment) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        Caricamento…
      </div>
    )
  }

  const fase2 = assessment.fase2
  const nomeGruppo = assessment.setup.nomeGruppoOmogeneo || "Gruppo senza nome"
  const numTarget = assessment.setup.numeroLavoratori ?? 0

  // ── Attiva sondaggio ──
  const handleAttiva = () => {
    setIsActivating(true)
    const updated: SlcAssessment = {
      ...assessment,
      fase2: {
        ...assessment.fase2,
        status: "attiva",
        dataAttivazione: new Date().toISOString(),
        numTarget,
        numPartecipanti: 0,
      },
    }
    saveAssessment(updated)
    setAssessment(updated)
    setIsActivating(false)
    toast.success("Sondaggio attivato — in attesa delle risposte dei dipendenti")
  }

  // ── Simula completamento ──
  const handleSimula = () => {
    setIsSimulating(true)
    const risposte = generateMockPerceptionAnswers()
    const { dimensioni, totale, rischio } = calcFase2Scores(risposte)
    const partecipanti = numTarget > 0 ? Math.round(numTarget * (0.7 + Math.random() * 0.25)) : 15
    const updated: SlcAssessment = {
      ...assessment,
      fase2: {
        ...assessment.fase2,
        status: "completata",
        dataChiusura: new Date().toISOString(),
        numPartecipanti: partecipanti,
        numTarget: numTarget > 0 ? numTarget : partecipanti,
        risposte,
        dimensioni,
        totale,
        rischio,
      },
    }
    saveAssessment(updated)
    setAssessment(updated)
    setIsSimulating(false)
    toast.success("Simulazione completata — risultati aggiornati")
  }

  const participationRate =
    fase2.numTarget > 0 ? Math.round((fase2.numPartecipanti / fase2.numTarget) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-slate-500 hover:text-slate-900"
            onClick={() => router.push(`/dashboard_azienda/slc/${assessmentId}/fase-1`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="p-3 rounded-xl bg-violet-50">
            <Brain className="h-7 w-7 text-violet-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900">{nomeGruppo}</h1>
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <span className="text-xl font-bold text-violet-700">Fase 2 — Valutazione Approfondita</span>
            </div>
            <p className="text-sm text-slate-500">Sondaggio di percezione del rischio da stress lavoro correlato</p>
          </div>
        </div>

        {/* Phase navigation */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-slate-600"
            onClick={() => router.push(`/dashboard_azienda/slc/${assessmentId}/fase-1`)}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Fase 1
          </Button>
          <Button
            size="sm"
            disabled
            className="gap-1.5 bg-slate-200 text-slate-400 cursor-not-allowed"
            title="Pianificazione Interventi — prossimamente"
          >
            Fase 3
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* ════════════════════════════════════════ NON ATTIVATA */}
      {fase2.status === "non_attivata" && (
        <div className="space-y-6">
          <Card className="border-violet-200 bg-violet-50/40 shadow-sm">
            <CardContent className="pt-6 flex flex-col items-center text-center gap-4 py-10">
              <div className="p-5 rounded-full bg-violet-100">
                <Play className="h-10 w-10 text-violet-500" />
              </div>
              <div className="space-y-1 max-w-md">
                <h3 className="text-xl font-bold text-slate-900">Sondaggio non ancora attivato</h3>
                <p className="text-sm text-slate-500">
                  Il sondaggio di percezione del rischio raccoglie la percezione soggettiva dei dipendenti
                  attraverso 35 domande standardizzate INAIL-HSE su 7 dimensioni psicosociali.
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-violet-500" />
                  35 domande
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-violet-500" />
                  {numTarget > 0 ? `${numTarget} destinatari` : "destinatari da definire"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-violet-500" />
                  ~5 min
                </span>
              </div>
              <Button
                className="gap-2 bg-violet-600 hover:bg-violet-700 mt-2"
                disabled={isActivating}
                onClick={handleAttiva}
              >
                <Play className="h-4 w-4" />
                Attiva Sondaggio
              </Button>
            </CardContent>
          </Card>

          {/* Preview domande */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Anteprima questionario INAIL-HSE</CardTitle>
              <CardDescription>35 domande su scala Likert 1–5 · 7 dimensioni psicosociali · Punteggio totale 35–175</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {PERCEPTION_DIMENSIONI.map((dim) => {
                  const dimQuestions = PERCEPTION_QUESTIONS.filter((q) => q.dimensione === dim)
                  const dimDef = DIMENSION_DEFS.find((d) => d.nome === dim)
                  const colorClass = DIM_COLORS[dim] ?? "text-slate-600 bg-slate-50 border-slate-200"
                  return (
                    <div key={dim} className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border", colorClass)}>
                          {dim}
                        </div>
                        {dimDef && (
                          <span className="text-xs text-slate-400">{dimQuestions.length} item · score {dimDef.minScore}–{dimDef.maxScore}</span>
                        )}
                      </div>
                      <div className="space-y-2">
                        {dimQuestions.map((q) => (
                          <div key={q.id} className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="text-[10px] font-bold text-slate-400 mt-0.5 shrink-0 w-5">{q.id}</span>
                            <span>{q.testo}</span>
                            <Badge
                              variant="outline"
                              className={cn(
                                "ml-auto shrink-0 text-[9px] border-none px-1.5",
                                q.reverse_scored
                                  ? "bg-red-50 text-red-500"
                                  : "bg-green-50 text-green-600"
                              )}
                            >
                              {q.reverse_scored ? "−" : "+"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ════════════════════════════════════════ ATTIVA */}
      {fase2.status === "attiva" && (
        <div className="space-y-6">
          <Card className="border-amber-200 bg-amber-50/40 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="p-4 rounded-full bg-amber-100 shrink-0">
                  <Clock className="h-8 w-8 text-amber-500" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      Sondaggio in corso
                      <Badge className="bg-amber-100 text-amber-800 border-none text-xs">Attivo</Badge>
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Attivato il {new Date(fase2.dataAttivazione!).toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Risposte raccolte</span>
                      <span className="font-semibold text-slate-900">
                        {fase2.numPartecipanti} / {fase2.numTarget}
                        <span className="text-slate-400 font-normal ml-1">({participationRate}%)</span>
                      </span>
                    </div>
                    <Progress value={participationRate} className="h-2" />
                  </div>
                </div>
                <Button
                  className="gap-2 bg-violet-600 hover:bg-violet-700 shrink-0"
                  disabled={isSimulating}
                  onClick={handleSimula}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {isSimulating ? "Elaborazione…" : "Simula Completamento"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Still show question preview while active */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Questionario somministrato</CardTitle>
              <CardDescription>35 domande INAIL-HSE su 7 dimensioni — in attesa di tutte le risposte</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {PERCEPTION_DIMENSIONI.map((dim) => {
                  const dimQuestions = PERCEPTION_QUESTIONS.filter((q) => q.dimensione === dim)
                  const colorClass = DIM_COLORS[dim] ?? "text-slate-600 bg-slate-50 border-slate-200"
                  return (
                    <div key={dim} className="p-4">
                      <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border mb-3", colorClass)}>
                        {dim}
                      </div>
                      <div className="space-y-2">
                        {dimQuestions.map((q) => (
                          <div key={q.id} className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="text-[10px] font-bold text-slate-400 mt-0.5 shrink-0 w-5">{q.id}</span>
                            <span>{q.testo}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ════════════════════════════════════════ COMPLETATA */}
      {fase2.status === "completata" && (
        <div className="space-y-6">
          {/* KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-violet-50">
                  <Users className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {fase2.numPartecipanti}
                    <span className="text-sm font-normal text-slate-400">/{fase2.numTarget}</span>
                  </p>
                  <p className="text-sm text-slate-500">Partecipanti ({participationRate}%)</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-50">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {fase2.totale}
                    <span className="text-sm font-normal text-slate-400">/175</span>
                  </p>
                  <p className="text-sm text-slate-500">Score benessere globale</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 flex items-center gap-4">
                <div className={cn(
                  "p-3 rounded-lg",
                  fase2.rischio === "alto" ? "bg-red-50" : fase2.rischio === "medio" ? "bg-yellow-50" : "bg-green-50"
                )}>
                  <AlertTriangle className={cn(
                    "h-5 w-5",
                    fase2.rischio === "alto" ? "text-red-600" : fase2.rischio === "medio" ? "text-yellow-600" : "text-green-600"
                  )} />
                </div>
                <div>
                  <p className="text-2xl font-bold capitalize">{fase2.rischio}</p>
                  <p className="text-sm text-slate-500">Rischio percezione</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dimension scores */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Risultati per Dimensione</CardTitle>
              <CardDescription>Indice di rischio normalizzato 0–100 per dimensione (0 = ottimo, 100 = massimo rischio)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {fase2.dimensioni.map((d) => {
                const rc = RISCHIO_CONFIG[d.rischio]
                const colorClass = DIM_COLORS[d.nome] ?? "text-slate-600 bg-slate-50 border-slate-200"
                const dimDef = DIMENSION_DEFS.find((dd) => dd.nome === d.nome)
                return (
                  <div key={d.nome} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded border", colorClass)}>
                          {d.nome}
                        </span>
                        {dimDef && (
                          <span className="text-[10px] text-slate-400">score {dimDef.minScore}–{dimDef.maxScore}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{d.score}%</span>
                        <Badge className={cn(rc.bg, "text-xs border-none font-medium")}>{rc.label}</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-700", rc.bar)}
                        style={{ width: `${d.score}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Confronto Fase 1 vs Fase 2 */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Confronto Fase 1 — Fase 2</CardTitle>
              <CardDescription>
                Valutazione oggettiva (Fase 1) vs percezione soggettiva (Fase 2)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 font-medium border-b border-slate-100">
                      <th className="pb-3 pt-1 text-left font-medium">Indicatore</th>
                      <th className="pb-3 pt-1 text-center font-medium">Fase 1</th>
                      <th className="pb-3 pt-1 text-center font-medium">Fase 2 Percezione</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <tr>
                      <td className="py-3 text-slate-700 font-medium">Score totale</td>
                      <td className="py-3 text-center font-bold text-slate-900">
                        {assessment.scores.totaleFase1}
                        <span className="text-xs font-normal text-slate-400">/220</span>
                      </td>
                      <td className="py-3 text-center font-bold text-slate-900">
                        {fase2.totale}
                        <span className="text-xs font-normal text-slate-400">/175</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 text-slate-700 font-medium">Livello di rischio</td>
                      <td className="py-3 text-center">
                        <Badge className={cn(RISCHIO_CONFIG[assessment.scores.rischioFase1].bg, "border-none")}>
                          {RISCHIO_CONFIG[assessment.scores.rischioFase1].label}
                        </Badge>
                      </td>
                      <td className="py-3 text-center">
                        <Badge className={cn(RISCHIO_CONFIG[fase2.rischio].bg, "border-none")}>
                          {RISCHIO_CONFIG[fase2.rischio].label}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 text-slate-700 font-medium">Partecipazione</td>
                      <td className="py-3 text-center text-slate-500">—</td>
                      <td className="py-3 text-center text-slate-700 font-medium">{participationRate}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Fase 3 CTA */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <p className="text-sm text-slate-400">Fase 3 — Pianificazione Interventi disponibile prossimamente</p>
            <Button
              disabled
              className="gap-2 bg-slate-200 text-slate-400 cursor-not-allowed"
            >
              Vai a Fase 3
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
