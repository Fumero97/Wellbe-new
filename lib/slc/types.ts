// SLC (Stress Lavoro Correlato) - Fase 1 Types
// Conforme alla metodologia INAIL 2025

export type SlcAssessmentStatus = "draft" | "review" | "final"
export type SlcTipoValutazione = "iniziale" | "aggiornamento"
export type SlcTrend = "diminuito" | "invariato" | "aumentato"
export type SlcRiskLevel = "basso" | "medio" | "alto"
export type SlcYesNo = "si" | "no" | null

export interface SlcTeamMember {
  id: string
  nome: string
  ruolo: string
}

export interface SlcSetup {
  companyId: string
  nomeGruppoOmogeneo: string
  numeroLavoratori: number | null
  dataValutazione: string
  tipoValutazione: SlcTipoValutazione
  remoteWorkEnabled: boolean
  numeroLavoratoriRemoto: number | null
  managementTeam: SlcTeamMember[]
  noteGenerali: string
}

export interface SlcSentinelEvent {
  id: string
  codice: string
  nome: string
  tipo: "trend" | "dichotomous"
  valoreUltimoAnno: number | null
  valoreTriennio: number | null
  risultatoUltimoAnno: number | null
  risultatoTriennio: number | null
  trend: SlcTrend | null
  punteggio: number
  risposta: SlcYesNo
  note: string
}

export interface SlcChecklistItemDef {
  id: string
  codice: string
  dimensione: string
  testo: string
  area: "contenuto" | "contesto"
}

export interface SlcChecklistItem {
  id: string
  codice: string
  risposta: SlcYesNo
  punteggio: number
  note: string
}

export interface SlcRemoteItemDef {
  id: string
  codice: string
  testo: string
}

export interface SlcRemoteItem {
  id: string
  codice: string
  risposta: SlcYesNo
  punteggio: number
  note: string
}

export interface SlcScores {
  totaleEventiSentinella: number
  rischioEventiSentinella: SlcRiskLevel
  totaleContenuto: number
  totaleContesto: number
  totaleFase1: number
  rischioFase1: SlcRiskLevel
  totaleModuloRemoto: number
}

export interface SlcAuditLog {
  id: string
  assessmentId: string
  campo: string
  oldValue: string
  newValue: string
  userId: string
  timestamp: string
}

export interface SentinelEventDef {
  id: string
  codice: string
  nome: string
  tipo: "trend" | "dichotomous"
}

export interface SlcAssessment {
  id: string
  status: SlcAssessmentStatus
  versione: number
  createdAt: string
  updatedAt: string
  setup: SlcSetup
  eventiSentinella: SlcSentinelEvent[]
  checklistContenuto: SlcChecklistItem[]
  checklistContesto: SlcChecklistItem[]
  moduloRemoto: SlcRemoteItem[]
  scores: SlcScores
  noteFinali: string
  azioniCorrettive: string
  auditLog: SlcAuditLog[]
}
