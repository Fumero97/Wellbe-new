"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Brain, Plus, FileText, Clock, Lock, AlertTriangle,
  Trash2, ChevronRight, Users, Calendar, TrendingUp,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

import type { SlcAssessment, SlcRiskLevel, SlcTipoValutazione } from "@/lib/slc/types"
import {
  loadAssessments, saveAssessment, deleteAssessment,
  createBlankAssessment, generateId,
} from "@/lib/slc/mock-data"

// ===== HELPERS =====

const STATUS_CONFIG = {
  draft:  { label: "Bozza",        color: "bg-slate-100 text-slate-700",  icon: FileText },
  review: { label: "In Revisione", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  final:  { label: "Finalizzato",  color: "bg-green-100 text-green-700",   icon: Lock },
}

const RISK_CONFIG: Record<SlcRiskLevel, { label: string; bg: string }> = {
  basso: { label: "Basso",  bg: "bg-green-100 text-green-800" },
  medio: { label: "Medio",  bg: "bg-yellow-100 text-yellow-800" },
  alto:  { label: "Alto",   bg: "bg-red-100 text-red-800" },
}

// ===== FORM STATE =====

interface NewGroupForm {
  nomeGruppoOmogeneo: string
  numeroLavoratori: string
  dataValutazione: string
  tipoValutazione: SlcTipoValutazione
  remoteWorkEnabled: boolean
}

const EMPTY_FORM: NewGroupForm = {
  nomeGruppoOmogeneo: "",
  numeroLavoratori: "",
  dataValutazione: new Date().toISOString().split("T")[0],
  tipoValutazione: "iniziale",
  remoteWorkEnabled: false,
}

// ===== MAIN COMPONENT =====

export default function SlcIndexPage() {
  const router = useRouter()
  const [assessments, setAssessments] = useState<SlcAssessment[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<NewGroupForm>(EMPTY_FORM)

  // Load from localStorage on mount
  useEffect(() => {
    setAssessments(loadAssessments())
  }, [])

  const refreshList = () => setAssessments(loadAssessments())

  const handleCreate = () => {
    if (!form.nomeGruppoOmogeneo.trim()) {
      toast.error("Il nome del gruppo omogeneo è obbligatorio")
      return
    }
    const id = generateId()
    const assessment = createBlankAssessment(id, {
      nomeGruppoOmogeneo: form.nomeGruppoOmogeneo.trim(),
      numeroLavoratori: form.numeroLavoratori ? Number(form.numeroLavoratori) : null,
      dataValutazione: form.dataValutazione,
      tipoValutazione: form.tipoValutazione,
      remoteWorkEnabled: form.remoteWorkEnabled,
    })
    saveAssessment(assessment)
    setDialogOpen(false)
    setForm(EMPTY_FORM)
    toast.success(`Gruppo "${form.nomeGruppoOmogeneo.trim()}" creato`)
    router.push(`/dashboard_azienda/slc/${id}/fase-1`)
  }

  const handleDelete = (id: string) => {
    deleteAssessment(id)
    refreshList()
    toast.success("Gruppo eliminato")
    setDeleteId(null)
  }

  const totalGroups = assessments.length
  const highRisk = assessments.filter(a => a.scores.rischioFase1 === "alto").length
  const inProgress = assessments.filter(a => a.status !== "final").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-violet-50">
            <Brain className="h-7 w-7 text-violet-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Stress Lavoro Correlato</h1>
            <p className="text-sm text-slate-500">Valutazione preliminare per gruppi omogenei — metodologia INAIL 2025</p>
          </div>
        </div>
        <Button className="gap-2 bg-violet-600 hover:bg-violet-700" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Nuovo Gruppo Omogeneo
        </Button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-violet-50">
              <Users className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalGroups}</p>
              <p className="text-sm text-slate-500">Gruppi totali</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-amber-50">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{inProgress}</p>
              <p className="text-sm text-slate-500">In lavorazione</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{highRisk}</p>
              <p className="text-sm text-slate-500">Rischio alto</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      {assessments.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="p-4 rounded-full bg-violet-50">
              <Brain className="h-10 w-10 text-violet-400" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Nessun gruppo omogeneo</h3>
              <p className="text-sm text-slate-500">Crea il primo gruppo per avviare la valutazione SLC</p>
            </div>
            <Button className="gap-2 bg-violet-600 hover:bg-violet-700" onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Nuovo Gruppo Omogeneo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Gruppi Omogenei</CardTitle>
            <CardDescription>{assessments.length} valutazion{assessments.length === 1 ? "e" : "i"} in archivio</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {/* Desktop table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gruppo Omogeneo</TableHead>
                    <TableHead className="w-[90px] text-center">Lavoratori</TableHead>
                    <TableHead className="w-[120px]">Data</TableHead>
                    <TableHead className="w-[100px]">Tipo</TableHead>
                    <TableHead className="w-[120px]">Stato</TableHead>
                    <TableHead className="w-[110px] text-center">Rischio Fase 1</TableHead>
                    <TableHead className="w-[80px] text-center">Totale</TableHead>
                    <TableHead className="w-[120px] text-right">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessments.map((a) => {
                    const sc = STATUS_CONFIG[a.status]
                    const StatusIcon = sc.icon
                    return (
                      <TableRow
                        key={a.id}
                        className="cursor-pointer hover:bg-slate-50"
                        onClick={() => router.push(`/dashboard_azienda/slc/${a.id}/fase-1`)}
                      >
                        <TableCell>
                          <div className="font-medium text-slate-900">{a.setup.nomeGruppoOmogeneo || "—"}</div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            v{a.versione} · aggiornato {new Date(a.updatedAt).toLocaleDateString("it-IT")}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{a.setup.numeroLavoratori ?? "—"}</TableCell>
                        <TableCell className="text-sm">{a.setup.dataValutazione || "—"}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs capitalize">
                            {a.setup.tipoValutazione}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn(sc.color, "gap-1")}>
                            <StatusIcon className="h-3 w-3" />
                            {sc.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={RISK_CONFIG[a.scores.rischioFase1].bg}>
                            {RISK_CONFIG[a.scores.rischioFase1].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-bold">{a.scores.totaleFase1}</TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm" variant="ghost"
                              className="gap-1 text-violet-600 hover:text-violet-700 hover:bg-violet-50"
                              onClick={() => router.push(`/dashboard_azienda/slc/${a.id}/fase-1`)}
                            >
                              Apri <ChevronRight className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="icon" variant="ghost"
                              className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                              onClick={() => setDeleteId(a.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3 p-4">
              {assessments.map((a) => {
                const sc = STATUS_CONFIG[a.status]
                const StatusIcon = sc.icon
                return (
                  <Card key={a.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => router.push(`/dashboard_azienda/slc/${a.id}/fase-1`)}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 truncate">
                            {a.setup.nomeGruppoOmogeneo || "Gruppo senza nome"}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge className={cn(sc.color, "gap-1 text-xs")}>
                              <StatusIcon className="h-3 w-3" />{sc.label}
                            </Badge>
                            <Badge className={cn(RISK_CONFIG[a.scores.rischioFase1].bg, "text-xs")}>
                              Rischio {RISK_CONFIG[a.scores.rischioFase1].label}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-400 mt-1.5">
                            {a.setup.numeroLavoratori ?? "—"} lav. · {a.setup.dataValutazione || "—"} · v{a.versione}
                          </p>
                        </div>
                        <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:text-red-600"
                            onClick={() => setDeleteId(a.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-violet-600"
                            onClick={() => router.push(`/dashboard_azienda/slc/${a.id}/fase-1`)}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setForm(EMPTY_FORM) }}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-violet-600" />
              Nuovo Gruppo Omogeneo
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nome Gruppo Omogeneo <span className="text-red-500">*</span></Label>
              <Input
                placeholder="es. Impiegati amministrativi, Operatori di produzione..."
                value={form.nomeGruppoOmogeneo}
                onChange={(e) => setForm(f => ({ ...f, nomeGruppoOmogeneo: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Numero Lavoratori</Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="es. 50"
                  value={form.numeroLavoratori}
                  onChange={(e) => setForm(f => ({ ...f, numeroLavoratori: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Data Valutazione</Label>
                <Input
                  type="date"
                  value={form.dataValutazione}
                  onChange={(e) => setForm(f => ({ ...f, dataValutazione: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tipo Valutazione</Label>
              <Select
                value={form.tipoValutazione}
                onValueChange={(v) => setForm(f => ({ ...f, tipoValutazione: v as SlcTipoValutazione }))}
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
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
              <Switch
                checked={form.remoteWorkEnabled}
                onCheckedChange={(v) => setForm(f => ({ ...f, remoteWorkEnabled: v }))}
              />
              <div>
                <Label className="cursor-pointer">Lavoro da remoto attivo</Label>
                <p className="text-xs text-slate-500">Abilita il modulo Remoto/Tecnologia</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annulla</Button>
            <Button className="bg-violet-600 hover:bg-violet-700" onClick={handleCreate}>
              Crea e Apri Fase 1
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare il gruppo?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione è irreversibile. Tutti i dati della valutazione verranno eliminati.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
