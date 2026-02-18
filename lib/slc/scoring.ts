import {
  SlcSentinelEvent,
  SlcChecklistItem,
  SlcRemoteItem,
  SlcRiskLevel,
  SlcScores,
  SlcTrend,
  SlcYesNo,
} from "./types"

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

/** Checklist item: si = pratica adottata (0 punti), no = non adottata (1 punto) */
export function checklistItemScore(risposta: SlcYesNo): number {
  return risposta === "no" ? 1 : 0
}

/** Total sentinel events score */
export function calcTotaleEventiSentinella(events: SlcSentinelEvent[]): number {
  return events.reduce((sum, e) => sum + e.punteggio, 0)
}

/** Sentinel risk level (INAIL thresholds, max possible = 40) */
export function calcRischioEventiSentinella(totale: number): SlcRiskLevel {
  if (totale <= 10) return "basso"
  if (totale <= 20) return "medio"
  return "alto"
}

/** Checklist total */
export function calcTotaleChecklist(items: SlcChecklistItem[]): number {
  return items.reduce((sum, item) => sum + item.punteggio, 0)
}

/** Remote module total */
export function calcTotaleModuloRemoto(items: SlcRemoteItem[]): number {
  return items.reduce((sum, item) => sum + item.punteggio, 0)
}

/** Phase 1 total = sentinel + contenuto + contesto (NO remote module) */
export function calcTotaleFase1(
  totaleEventi: number,
  totaleContenuto: number,
  totaleContesto: number
): number {
  return totaleEventi + totaleContenuto + totaleContesto
}

/** Phase 1 risk level */
export function calcRischioFase1(totaleFase1: number): SlcRiskLevel {
  if (totaleFase1 <= 25) return "basso"
  if (totaleFase1 <= 50) return "medio"
  return "alto"
}

/** Recalculate all scores from raw data */
export function recalcAllScores(
  eventiSentinella: SlcSentinelEvent[],
  checklistContenuto: SlcChecklistItem[],
  checklistContesto: SlcChecklistItem[],
  moduloRemoto: SlcRemoteItem[]
): SlcScores {
  const totaleEventiSentinella = calcTotaleEventiSentinella(eventiSentinella)
  const rischioEventiSentinella = calcRischioEventiSentinella(totaleEventiSentinella)
  const totaleContenuto = calcTotaleChecklist(checklistContenuto)
  const totaleContesto = calcTotaleChecklist(checklistContesto)
  const totaleFase1 = calcTotaleFase1(totaleEventiSentinella, totaleContenuto, totaleContesto)
  const rischioFase1 = calcRischioFase1(totaleFase1)
  const totaleModuloRemoto = calcTotaleModuloRemoto(moduloRemoto)

  return {
    totaleEventiSentinella,
    rischioEventiSentinella,
    totaleContenuto,
    totaleContesto,
    totaleFase1,
    rischioFase1,
    totaleModuloRemoto,
  }
}
