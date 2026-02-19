import { SlcAssessment, SlcSetup } from "./types"
import {
  CHECKLIST_CONTENUTO,
  CHECKLIST_CONTESTO,
  CHECKLIST_REMOTO,
  EVENTI_SENTINELLA_DEFS,
} from "./checklist-items"

const LS_KEY = "slc_assessments"

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
      totaleContenuto: 0,
      totaleContesto: 0,
      totaleFase1: 0,
      rischioFase1: "basso",
      totaleModuloRemoto: 0,
    },
    noteFinali: "",
    azioniCorrettive: "",
    auditLog: [],
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
      totaleContenuto: 8,
      totaleContesto: 6,
      totaleFase1: 19,
      rischioFase1: "basso",
      totaleModuloRemoto: 2,
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
      totaleContenuto: 14,
      totaleContesto: 11,
      totaleFase1: 41,
      rischioFase1: "medio",
      totaleModuloRemoto: 0,
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
    return JSON.parse(raw) as SlcAssessment[]
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
