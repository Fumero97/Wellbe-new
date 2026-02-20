import {
  SlcSentinelEvent,
  SlcChecklistItem,
  SlcChecklistItemDef,
  SlcRemoteItem,
  SlcRiskLevel,
  SlcScores,
  SlcDimensionScore,
  SlcTrend,
  SlcYesNo,
  SlcPerceptionAnswer,
  SlcFase2DimensionScore,
} from "./types"
import { PERCEPTION_QUESTIONS, DIMENSION_DEFS, SOCIODEMOGRAPHIC_FIELDS } from "./perception-questions"
import type { SlcDemographicDistribution } from "./types"

// ===== SENTINEL EVENTS =====

/** Auto-suggest trend based on ultimo anno vs triennio values */
export function suggestTrend(
  valoreUltimoAnno: number | null,
  valoreTriennio: number | null
): SlcTrend | null {
  if (valoreUltimoAnno === null || valoreTriennio === null) return null
  if (valoreUltimoAnno === 0) return "diminuito"
  if (valoreUltimoAnno < valoreTriennio) return "diminuito"
  if (valoreUltimoAnno === valoreTriennio) return "invariato"
  return "aumentato"
}

/** Map trend to score: diminuito=0, invariato=1, aumentato=4 */
export function trendToScore(trend: SlcTrend | null): number {
  switch (trend) {
    case "diminuito": return 0
    case "invariato": return 1
    case "aumentato": return 4
    default: return 0
  }
}

/** Dichotomous indicators (ES9, ES10): no=0, si=4 */
export function dichotomousScore(risposta: SlcYesNo): number {
  return risposta === "si" ? 4 : 0
}

/**
 * Total sentinel events score — simple sum.
 * Max: 40 (10 indicators × max 4 pts each)
 */
export function calcTotaleEventiSentinella(events: SlcSentinelEvent[]): number {
  return events.reduce((acc, e) => acc + e.punteggio, 0)
}

/** Sentinel risk level — thresholds: basso ≤10, medio ≤20, alto >20 */
export function calcRischioEventiSentinella(totale: number): SlcRiskLevel {
  if (totale <= 10) return "basso"
  if (totale <= 20) return "medio"
  return "alto"
}

/**
 * Mappa il punteggio grezzo degli eventi sentinella al valore INAIL
 * da inserire nella tabella finale Fase 1:
 *   0–10  → 0
 *   11–20 → 6
 *   21–40 → 16
 */
export function sentinelToFase1Value(totale: number): number {
  if (totale <= 10) return 0
  if (totale <= 20) return 6
  return 16
}

// ===== CHECKLIST ITEM =====

/** Checklist item: si = pratica adottata (0 punti), no = non adottata (1 punto) */
export function checklistItemScore(risposta: SlcYesNo): number {
  return risposta === "no" ? 1 : 0
}

// ===== AREA CONTENUTO DEL LAVORO (metodologia INAIL 2025) =====

/**
 * Soglie di rischio per dimensione dell'Area Contenuto del Lavoro (Tabella 5 INAIL).
 * I valori si riferiscono al punteggio normalizzato 0–100 di ogni dimensione.
 */
export const CONTENUTO_DIMENSIONI_DEF: {
  nome: string
  medioDA: number
  altoDA: number
}[] = [
  { nome: "Ambiente di lavoro e attrezzature", medioDA: 23, altoDA: 46 },
  { nome: "Pianificazione dei compiti",         medioDA: 50, altoDA: 83 },
  { nome: "Carico di lavoro e ritmo di lavoro", medioDA: 33, altoDA: 56 },
  { nome: "Orario di lavoro",                   medioDA: 38, altoDA: 75 },
]

function rischioPerDimensione(score: number, medioDA: number, altoDA: number): SlcRiskLevel {
  if (score < medioDA) return "basso"
  if (score < altoDA) return "medio"
  return "alto"
}

/**
 * Calcola il punteggio normalizzato (0–100) per ogni dimensione del Contenuto del Lavoro
 * e la media delle dimensioni come punteggio complessivo dell'Area (Figura 5 INAIL).
 *
 * Formula per dimensione: (Σ punteggi_item_dimensione / n° item_dimensione) × 100
 * Formula area:           Σ punteggi_dimensioni / N (N = 4)
 */
export function calcContenuto(
  items: SlcChecklistItem[],
  definitions: SlcChecklistItemDef[]
): { totale: number; rischio: SlcRiskLevel; dimensioni: SlcDimensionScore[] } {
  const dimensioni: SlcDimensionScore[] = CONTENUTO_DIMENSIONI_DEF.map((dimDef) => {
    const dimDefs = definitions.filter((d) => d.dimensione === dimDef.nome)
    const dimItems = items.filter((i) => dimDefs.some((d) => d.id === i.id))

    const score =
      dimDefs.length > 0
        ? Math.round((dimItems.reduce((s, i) => s + i.punteggio, 0) / dimDefs.length) * 100)
        : 0

    return {
      nome: dimDef.nome,
      score,
      rischio: rischioPerDimensione(score, dimDef.medioDA, dimDef.altoDA),
    }
  })

  const totale =
    dimensioni.length > 0
      ? Math.round(dimensioni.reduce((s, d) => s + d.score, 0) / dimensioni.length)
      : 0

  // Overall risk: based on the single highest dimension risk, or by totale thresholds
  const rischio: SlcRiskLevel =
    totale < 33 ? "basso" : totale < 66 ? "medio" : "alto"

  return { totale, rischio, dimensioni }
}

// ===== AREA CONTESTO DEL LAVORO (metodologia INAIL 2025 — Tabella 8 / Figura 7) =====

/**
 * Soglie di rischio per le 5 dimensioni principali del Contesto del Lavoro (Tabella 8 INAIL).
 * La 6ª dimensione "Interfaccia casa lavoro" ha trattamento speciale (Figura 7).
 */
export const CONTESTO_DIMENSIONI_DEF: {
  nome: string
  medioDA: number
  altoDA: number
}[] = [
  { nome: "Funzione e cultura organizzativa",            medioDA: 45, altoDA: 73  },
  { nome: "Ruolo nell'ambito dell'organizzazione",       medioDA: 50, altoDA: 75  },
  { nome: "Evoluzione della carriera",                   medioDA: 67, altoDA: 100 },
  { nome: "Autonomia decisionale controllo del lavoro",  medioDA: 60, altoDA: 80  },
  { nome: "Rapporti interpersonali sul lavoro",          medioDA: 67, altoDA: 100 },
]

const INTERFACCIA_DIM_NOME = "Interfaccia casa lavoro"

/**
 * Calcola il punteggio normalizzato (0–100) per ogni dimensione del Contesto del Lavoro
 * e applica la formula Figura 7 INAIL per il punteggio complessivo dell'Area.
 *
 * Formula per dimensione: (Σ punteggi_item / n° item) × 100
 * Formula area: (Σ 5 dim_score / 5) − valore_interfaccia
 *   dove valore_interfaccia = punteggio_grezzo_interfaccia === 0 ? -4 : 0
 */
export function calcContesto(
  items: SlcChecklistItem[],
  definitions: SlcChecklistItemDef[]
): { totale: number; rischio: SlcRiskLevel; dimensioni: SlcDimensionScore[] } {
  // Calculate all 5 main dimensions
  const dimensioni5: SlcDimensionScore[] = CONTESTO_DIMENSIONI_DEF.map((dimDef) => {
    const dimDefs = definitions.filter((d) => d.dimensione === dimDef.nome)
    const dimItems = items.filter((i) => dimDefs.some((d) => d.id === i.id))
    const score =
      dimDefs.length > 0
        ? Math.round((dimItems.reduce((s, i) => s + i.punteggio, 0) / dimDefs.length) * 100)
        : 0
    return {
      nome: dimDef.nome,
      score,
      rischio: rischioPerDimensione(score, dimDef.medioDA, dimDef.altoDA),
    }
  })

  // Calculate Interfaccia casa lavoro dimension (special treatment)
  const interfacciaDefs = definitions.filter((d) => d.dimensione === INTERFACCIA_DIM_NOME)
  const interfacciaItems = items.filter((i) => interfacciaDefs.some((d) => d.id === i.id))
  const interfacciaGrezzo = interfacciaItems.reduce((s, i) => s + i.punteggio, 0)
  const valoreInterfaccia = interfacciaGrezzo === 0 ? -4 : 0
  const interfacciaScore =
    interfacciaDefs.length > 0
      ? Math.round((interfacciaGrezzo / interfacciaDefs.length) * 100)
      : 0
  const interfacciaDim: SlcDimensionScore = {
    nome: INTERFACCIA_DIM_NOME,
    score: interfacciaScore,
    rischio: rischioPerDimensione(interfacciaScore, 45, 73), // no specific threshold, use generic
  }

  // Area score: mean of 5 dims − valore_interfaccia (subtracting a negative = adding)
  const media5 =
    dimensioni5.length > 0
      ? dimensioni5.reduce((s, d) => s + d.score, 0) / dimensioni5.length
      : 0
  const totale = Math.round(media5 - valoreInterfaccia)

  const rischio: SlcRiskLevel = totale < 45 ? "basso" : totale < 75 ? "medio" : "alto"

  return { totale, rischio, dimensioni: [...dimensioni5, interfacciaDim] }
}

/** Checklist total (raw sum) — kept for backwards compat / remote module */
export function calcTotaleChecklist(items: SlcChecklistItem[]): number {
  return items.reduce((sum, item) => sum + item.punteggio, 0)
}

// ===== REMOTE MODULE =====

/** Remote module total */
export function calcTotaleModuloRemoto(items: SlcRemoteItem[]): number {
  return items.reduce((sum, item) => sum + item.punteggio, 0)
}

// ===== FASE 1 AGGREGATE =====

/**
 * Phase 1 total = sentinel (discretizzato) + contenuto + contesto
 * Max: 16 + 100 + 104 ≈ 220
 */
export function calcTotaleFase1(
  totaleEventi: number,
  totaleContenuto: number,
  totaleContesto: number
): number {
  return totaleEventi + totaleContenuto + totaleContesto
}

/**
 * Phase 1 risk level.
 * Max ≈ 220 — thresholds at ~25 % (55) and ~50 % (110)
 */
export function calcRischioFase1(totaleFase1: number): SlcRiskLevel {
  if (totaleFase1 <= 55) return "basso"
  if (totaleFase1 <= 110) return "medio"
  return "alto"
}

// ===== RECALC ALL =====

/** Recalculate all scores from raw data */
export function recalcAllScores(
  eventiSentinella: SlcSentinelEvent[],
  checklistContenuto: SlcChecklistItem[],
  checklistContenutoDefs: SlcChecklistItemDef[],
  checklistContesto: SlcChecklistItem[],
  checklistContestoDefs: SlcChecklistItemDef[],
  moduloRemoto: SlcRemoteItem[]
): SlcScores {
  const totaleEventiSentinella = calcTotaleEventiSentinella(eventiSentinella)
  const rischioEventiSentinella = calcRischioEventiSentinella(totaleEventiSentinella)
  const valoreSentinellaFase1 = sentinelToFase1Value(totaleEventiSentinella)

  const contenuto = calcContenuto(checklistContenuto, checklistContenutoDefs)
  const contesto = calcContesto(checklistContesto, checklistContestoDefs)

  const totaleFase1 = calcTotaleFase1(valoreSentinellaFase1, contenuto.totale, contesto.totale)
  const rischioFase1 = calcRischioFase1(totaleFase1)
  const totaleModuloRemoto = calcTotaleModuloRemoto(moduloRemoto)

  return {
    totaleEventiSentinella,
    rischioEventiSentinella,
    valoreSentinellaFase1,
    totaleContenuto: contenuto.totale,
    rischioContenuto: contenuto.rischio,
    dimensioniContenuto: contenuto.dimensioni,
    totaleContesto: contesto.totale,
    rischioContesto: contesto.rischio,
    dimensioniContesto: contesto.dimensioni,
    totaleFase1,
    rischioFase1,
    totaleModuloRemoto,
  }
}

// ===== FASE 2 — PERCEZIONE DEL RISCHIO (INAIL-HSE, 35 item, scala 1–5) =====

/**
 * Normalizza il punteggio grezzo di una dimensione in un indice di rischio 0–100
 * dove 0 = ottimo benessere, 100 = massimo rischio.
 * Formula: ((max − rawScore) / (max − min)) × 100
 * (tutti gli item sono già orientati: valore alto = benessere alto)
 */
function normalizeDimRisk(rawScore: number, minScore: number, maxScore: number): number {
  return Math.round(((maxScore - rawScore) / (maxScore - minScore)) * 100)
}

function fase2DimRischio(normalizedRisk: number): SlcRiskLevel {
  if (normalizedRisk < 33) return "basso"
  if (normalizedRisk <= 66) return "medio"
  return "alto"
}

/**
 * Mappa il punteggio totale grezzo (35–175) al livello di rischio INAIL:
 *   Verde ≥ 147 e Blu ≥ 105 → basso
 *   Giallo ≥ 63             → medio
 *   Rosso < 63              → alto
 */
function fase2TotaleRischio(totale: number): SlcRiskLevel {
  if (totale >= 105) return "basso"
  if (totale >= 63)  return "medio"
  return "alto"
}

/**
 * Calcola i punteggi di Fase 2 (percezione del rischio INAIL-HSE) dalle risposte aggregate.
 *
 * - dimensioni[].score = indice di rischio normalizzato 0–100 (100 = max rischio)
 * - totale              = punteggio grezzo 35–175 (175 = ottimo benessere)
 * - rischio             = basso / medio / alto dalle soglie colore INAIL
 */
export function calcFase2Scores(
  risposte: SlcPerceptionAnswer[]
): { dimensioni: SlcFase2DimensionScore[]; totale: number; rischio: SlcRiskLevel } {
  const dimensioni: SlcFase2DimensionScore[] = DIMENSION_DEFS.map((dimDef) => {
    const dimQuestions = PERCEPTION_QUESTIONS.filter((q) => q.dimensione === dimDef.nome)
    const dimRisposte = risposte.filter((r) => dimQuestions.some((q) => q.id === r.questionId))

    const rawDimScore = dimRisposte.reduce((sum, r) => sum + r.valore, 0)
    const score =
      dimRisposte.length > 0
        ? normalizeDimRisk(rawDimScore, dimDef.minScore, dimDef.maxScore)
        : 0

    return { nome: dimDef.nome, score, rischio: fase2DimRischio(score) }
  })

  // Total = sum of all raw item scores (35–175, higher = better)
  const totale = risposte.reduce((sum, r) => sum + r.valore, 0)

  return { dimensioni, totale, rischio: fase2TotaleRischio(totale) }
}

/**
 * Genera risposte casuali plausibili per tutte le 35 domande (usata dalla simulazione).
 */
export function generateMockPerceptionAnswers(): SlcPerceptionAnswer[] {
  return PERCEPTION_QUESTIONS.map((q) => ({
    questionId: q.id,
    valore: (Math.floor(Math.random() * 5) + 1) as 1 | 2 | 3 | 4 | 5,
  }))
}

/**
 * Genera una distribuzione demografica simulata plausibile per N partecipanti.
 * Le proporzioni riflettono distribuzioni tipiche in contesti lavorativi italiani.
 */
export function generateMockDemographics(numPartecipanti: number): SlcDemographicDistribution[] {
  function distribute(options: string[], weights: number[]): SlcDemographicDistribution["counts"] {
    const total = weights.reduce((a, b) => a + b, 0)
    let remaining = numPartecipanti
    return options.map((option, i) => {
      const isLast = i === options.length - 1
      const count = isLast ? remaining : Math.round((weights[i] / total) * numPartecipanti)
      remaining -= isLast ? 0 : count
      return { option, count }
    })
  }

  return SOCIODEMOGRAPHIC_FIELDS.map((field) => {
    let counts: SlcDemographicDistribution["counts"]

    switch (field.id) {
      case "gender":
        counts = distribute(field.options, [0.48, 0.52])
        break
      case "age_range":
        counts = distribute(field.options, [0.20, 0.55, 0.25])
        break
      case "nationality":
        counts = distribute(field.options, [0.88, 0.12])
        break
      case "contract_type":
        counts = distribute(field.options, [0.60, 0.15, 0.10, 0.10, 0.05])
        break
      default:
        counts = field.options.map((option) => ({ option, count: 0 }))
    }

    return { fieldId: field.id, label: field.label, counts }
  })
}
