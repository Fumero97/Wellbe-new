import { SlcAssessment, SlcSetup, SlcFase2Data } from "./types"
import {
  CHECKLIST_CONTENUTO,
  CHECKLIST_CONTESTO,
  CHECKLIST_REMOTO,
  EVENTI_SENTINELLA_DEFS,
} from "./checklist-items"

const LS_KEY = "slc_assessments"

// ===== FASE 2 FACTORY =====

export function createBlankFase2(): SlcFase2Data {
  return {
    status: "non_attivata",
    dataAttivazione: null,
    dataChiusura: null,
    numPartecipanti: 0,
    numTarget: 0,
    risposte: [],
    dimensioni: [],
    totale: 0,
    rischio: "basso",
  }
}

// ===== BLANK ASSESSMENT FACTORY =====

export function createBlankAssessment(id: string, setup?: Partial<SlcSetup>): SlcAssessment {
  return {
    id,
    status: "draft",
    versione: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    setup: {
      companyId: "",
      nomeGruppoOmogeneo: setup?.nomeGruppoOmogeneo ?? "",
      numeroLavoratori: setup?.numeroLavoratori ?? null,
      dataValutazione: setup?.dataValutazione ?? new Date().toISOString().split("T")[0],
      tipoValutazione: setup?.tipoValutazione ?? "iniziale",
      remoteWorkEnabled: setup?.remoteWorkEnabled ?? false,
      numeroLavoratoriRemoto: setup?.numeroLavoratoriRemoto ?? null,
      managementTeam: [],
      noteGenerali: "",
    },
    eventiSentinella: EVENTI_SENTINELLA_DEFS.map((def) => ({
      id: def.id,
      codice: def.codice,
      nome: def.nome,
      tipo: def.tipo,
      valoreUltimoAnno: null,
      valoreTriennio: null,
      risultatoUltimoAnno: null,
      risultatoTriennio: null,
      trend: null,
      punteggio: 0,
      risposta: null,
      note: "",
    })),
    checklistContenuto: CHECKLIST_CONTENUTO.map((def) => ({
      id: def.id,
      codice: def.codice,
      risposta: null,
      punteggio: 0,
      note: "",
    })),
    checklistContesto: CHECKLIST_CONTESTO.map((def) => ({
      id: def.id,
      codice: def.codice,
      risposta: null,
      punteggio: 0,
      note: "",
    })),
    moduloRemoto: CHECKLIST_REMOTO.map((def) => ({
      id: def.id,
      codice: def.codice,
      risposta: null,
      punteggio: 0,
      note: "",
    })),
    scores: {
      totaleEventiSentinella: 0,
      rischioEventiSentinella: "basso",
      valoreSentinellaFase1: 0,
      totaleContenuto: 0,
      rischioContenuto: "basso",
      dimensioniContenuto: [],
      totaleContesto: 0,
      rischioContesto: "basso",
      dimensioniContesto: [],
      totaleFase1: 0,
      rischioFase1: "basso",
      totaleModuloRemoto: 0,
    },
    noteFinali: "",
    azioniCorrettive: "",
    auditLog: [],
    fase2: createBlankFase2(),
  }
}

// ===== SEED DATA (shown on first load) =====

const SEED_ASSESSMENTS: SlcAssessment[] = [
  {
    ...createBlankAssessment("slc-001"),
    createdAt: "2026-01-10T09:00:00Z",
    updatedAt: "2026-02-05T14:30:00Z",
    setup: {
      companyId: "demo",
      nomeGruppoOmogeneo: "Impiegati amministrativi",
      numeroLavoratori: 45,
      dataValutazione: "2026-02-01",
      tipoValutazione: "iniziale",
      remoteWorkEnabled: true,
      numeroLavoratoriRemoto: 12,
      managementTeam: [
        { id: "tm1", nome: "Dr. Marco Bianchi", ruolo: "RSPP" },
        { id: "tm2", nome: "Dr. Laura Verdi", ruolo: "Medico Competente" },
      ],
      noteGenerali: "",
    },
    scores: {
      totaleEventiSentinella: 5,
      rischioEventiSentinella: "basso",
      valoreSentinellaFase1: 0,
      totaleContenuto: 8,
      rischioContenuto: "basso",
      dimensioniContenuto: [],
      totaleContesto: 6,
      rischioContesto: "basso",
      dimensioniContesto: [],
      totaleFase1: 14,
      rischioFase1: "basso",
      totaleModuloRemoto: 2,
    },
    fase2: {
      status: "attiva",
      dataAttivazione: "2026-02-12T09:00:00Z",
      dataChiusura: null,
      numPartecipanti: 10,
      numTarget: 45,
      risposte: [],
      dimensioni: [],
      totale: 0,
      rischio: "basso",
    },
  },
  {
    ...createBlankAssessment("slc-002"),
    status: "review",
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-02-10T11:00:00Z",
    setup: {
      companyId: "demo",
      nomeGruppoOmogeneo: "Operatori di produzione",
      numeroLavoratori: 120,
      dataValutazione: "2026-02-10",
      tipoValutazione: "iniziale",
      remoteWorkEnabled: false,
      numeroLavoratoriRemoto: null,
      managementTeam: [],
      noteGenerali: "",
    },
    scores: {
      totaleEventiSentinella: 16,
      rischioEventiSentinella: "medio",
      valoreSentinellaFase1: 6,
      totaleContenuto: 14,
      rischioContenuto: "basso",
      dimensioniContenuto: [],
      totaleContesto: 11,
      rischioContesto: "basso",
      dimensioniContesto: [],
      totaleFase1: 31,
      rischioFase1: "basso",
      totaleModuloRemoto: 0,
    },
    fase2: {
      status: "completata",
      dataAttivazione: "2026-02-01T09:00:00Z",
      dataChiusura: "2026-02-15T18:00:00Z",
      numPartecipanti: 102,
      numTarget: 120,
      risposte: [
        // item 1–35 (ordinati per id): valore 1–5 dove 5 = ottimo benessere
        { questionId: "1",  valore: 3 },  // Ruolo
        { questionId: "2",  valore: 3 },  // Controllo
        { questionId: "3",  valore: 3 },  // Domanda
        { questionId: "4",  valore: 3 },  // Ruolo
        { questionId: "5",  valore: 3 },  // Relazioni
        { questionId: "6",  valore: 3 },  // Domanda
        { questionId: "7",  valore: 3 },  // Supporto Colleghi
        { questionId: "8",  valore: 3 },  // Supporto Management
        { questionId: "9",  valore: 2 },  // Domanda
        { questionId: "10", valore: 2 },  // Controllo
        { questionId: "11", valore: 2 },  // Ruolo
        { questionId: "12", valore: 3 },  // Domanda
        { questionId: "13", valore: 3 },  // Ruolo
        { questionId: "14", valore: 3 },  // Relazioni
        { questionId: "15", valore: 3 },  // Controllo
        { questionId: "16", valore: 3 },  // Domanda
        { questionId: "17", valore: 3 },  // Ruolo
        { questionId: "18", valore: 2 },  // Domanda
        { questionId: "19", valore: 2 },  // Controllo
        { questionId: "20", valore: 3 },  // Domanda
        { questionId: "21", valore: 2 },  // Relazioni
        { questionId: "22", valore: 2 },  // Domanda
        { questionId: "23", valore: 2 },  // Supporto Management
        { questionId: "24", valore: 3 },  // Supporto Colleghi
        { questionId: "25", valore: 3 },  // Controllo
        { questionId: "26", valore: 3 },  // Cambiamento
        { questionId: "27", valore: 2 },  // Supporto Colleghi
        { questionId: "28", valore: 2 },  // Cambiamento
        { questionId: "29", valore: 3 },  // Supporto Management
        { questionId: "30", valore: 2 },  // Controllo
        { questionId: "31", valore: 3 },  // Supporto Colleghi
        { questionId: "32", valore: 3 },  // Cambiamento
        { questionId: "33", valore: 3 },  // Supporto Management
        { questionId: "34", valore: 3 },  // Relazioni
        { questionId: "35", valore: 2 },  // Supporto Management
      ],
      // Punteggi calcolati: score = indice rischio normalizzato 0–100 (100 = max rischio)
      // Domanda (items 3,6,9,12,16,18,20,22): raw=21/40 → risk=59
      // Controllo (items 2,10,15,19,25,30): raw=15/30 → risk=63
      // Supporto Management (items 8,23,29,33,35): raw=13/25 → risk=60
      // Supporto Colleghi (items 7,24,27,31): raw=11/20 → risk=56
      // Relazioni (items 5,14,21,34): raw=11/20 → risk=56
      // Ruolo (items 1,4,11,13,17): raw=14/25 → risk=55
      // Cambiamento (items 26,28,32): raw=8/15 → risk=58
      // Totale grezzo: 93/175 → Giallo → medio
      dimensioni: [
        { nome: "Domanda",             score: 59, rischio: "medio" },
        { nome: "Controllo",           score: 63, rischio: "medio" },
        { nome: "Supporto Management", score: 60, rischio: "medio" },
        { nome: "Supporto Colleghi",   score: 56, rischio: "medio" },
        { nome: "Relazioni",           score: 56, rischio: "medio" },
        { nome: "Ruolo",               score: 55, rischio: "medio" },
        { nome: "Cambiamento",         score: 58, rischio: "medio" },
      ],
      totale: 93,
      rischio: "medio",
    },
  },
]

// ===== LOCALSTORAGE HELPERS =====

export function loadAssessments(): SlcAssessment[] {
  if (typeof window === "undefined") return SEED_ASSESSMENTS
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) {
      // First load: seed with demo data
      localStorage.setItem(LS_KEY, JSON.stringify(SEED_ASSESSMENTS))
      return SEED_ASSESSMENTS
    }
    const parsed = JSON.parse(raw) as SlcAssessment[]
    // Migration: add fase2 to any legacy assessment that doesn't have it
    return parsed.map((a) => ({ ...a, fase2: a.fase2 ?? createBlankFase2() }))
  } catch {
    return SEED_ASSESSMENTS
  }
}

export function loadAssessment(id: string): SlcAssessment | null {
  const all = loadAssessments()
  return all.find((a) => a.id === id) ?? null
}

export function saveAssessment(assessment: SlcAssessment): void {
  if (typeof window === "undefined") return
  try {
    const all = loadAssessments()
    const idx = all.findIndex((a) => a.id === assessment.id)
    const updated = { ...assessment, updatedAt: new Date().toISOString() }
    if (idx >= 0) {
      all[idx] = updated
    } else {
      all.push(updated)
    }
    localStorage.setItem(LS_KEY, JSON.stringify(all))
  } catch {
    // silently fail
  }
}

export function deleteAssessment(id: string): void {
  if (typeof window === "undefined") return
  try {
    const all = loadAssessments().filter((a) => a.id !== id)
    localStorage.setItem(LS_KEY, JSON.stringify(all))
  } catch {
    // silently fail
  }
}

export function generateId(): string {
  return `slc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

// Keep for backwards compat
export function createMockAssessment(assessmentId: string): SlcAssessment {
  return createBlankAssessment(assessmentId)
}
