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

export interface SlcDimensionScore {
  nome: string
  score: number        // 0–100 normalizzato
  rischio: SlcRiskLevel
}

export interface SlcScores {
  totaleEventiSentinella: number   // somma grezza 0–40
  rischioEventiSentinella: SlcRiskLevel
  valoreSentinellaFase1: number    // valore discretizzato INAIL: 0 | 6 | 16
  totaleContenuto: number          // media dei punteggi delle dimensioni (0–100)
  rischioContenuto: SlcRiskLevel
  dimensioniContenuto: SlcDimensionScore[]
  totaleContesto: number
  rischioContesto: SlcRiskLevel
  dimensioniContesto: SlcDimensionScore[]
  totaleFase1: number
  rischioFase1: SlcRiskLevel
  totaleModuloRemoto: number
}

// ===== FASE 2 — VALUTAZIONE APPROFONDITA =====

export type SlcFase2Status = "non_attivata" | "attiva" | "completata"

export interface SlcPerceptionAnswer {
  questionId: string        // "1"–"35" (id item INAIL-HSE)
  valore: 1 | 2 | 3 | 4 | 5
}

export interface SlcFase2DimensionScore {
  nome: string
  score: number             // 0–100 (100 = max rischio)
  rischio: SlcRiskLevel
}

export interface SlcDemographicCount {
  option: string
  count: number
}

export interface SlcDemographicDistribution {
  fieldId: string                 // "gender", "age_range", …
  label: string                   // "Genere", "Età", …
  counts: SlcDemographicCount[]   // distribuzione delle risposte
}

export interface SlcFase2Data {
  status: SlcFase2Status
  dataAttivazione: string | null
  dataChiusura: string | null
  numPartecipanti: number
  numTarget: number
  risposte: SlcPerceptionAnswer[]         // punteggi aggregati per item
  dimensioni: SlcFase2DimensionScore[]
  totale: number                          // punteggio grezzo 35–175 (175 = ottimo benessere)
  rischio: SlcRiskLevel
  demografici?: SlcDemographicDistribution[]  // distribuzione socio-demografica (non contribuisce al punteggio)
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
  fase2: SlcFase2Data
}
