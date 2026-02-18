import { SlcChecklistItemDef, SlcRemoteItemDef, SentinelEventDef } from "./types"

// =============================
// EVENTI SENTINELLA (10 indicatori)
// =============================

export const EVENTI_SENTINELLA_DEFS: SentinelEventDef[] = [
  { id: "ES01", codice: "ES01", nome: "Indici infortunistici", tipo: "trend" },
  { id: "ES02", codice: "ES02", nome: "Assenza per malattia", tipo: "trend" },
  { id: "ES03", codice: "ES03", nome: "Assenze dal lavoro", tipo: "trend" },
  { id: "ES04", codice: "ES04", nome: "Ferie non godute", tipo: "trend" },
  { id: "ES05", codice: "ES05", nome: "Rotazione del personale (turnover)", tipo: "trend" },
  { id: "ES06", codice: "ES06", nome: "Procedimenti e sanzioni disciplinari", tipo: "trend" },
  { id: "ES07", codice: "ES07", nome: "Richieste di visite mediche straordinarie", tipo: "trend" },
  { id: "ES08", codice: "ES08", nome: "Segnalazioni del medico competente", tipo: "trend" },
  { id: "ES09", codice: "ES09", nome: "Istanze giudiziarie per molestie morali/sessuali", tipo: "dichotomous" },
  { id: "ES10", codice: "ES10", nome: "Lamentele formalizzate da parte dei lavoratori", tipo: "dichotomous" },
]

// =============================
// AREA: CONTENUTO DEL LAVORO
// =============================

export const CHECKLIST_CONTENUTO: SlcChecklistItemDef[] = [
  // --- Ambiente di lavoro e attrezzature ---
  {
    id: "CC01", codice: "CC01",
    dimensione: "Ambiente di lavoro e attrezzature",
    testo: "Le condizioni di illuminazione sono adeguate per lo svolgimento delle mansioni",
    area: "contenuto",
  },
  {
    id: "CC02", codice: "CC02",
    dimensione: "Ambiente di lavoro e attrezzature",
    testo: "Le condizioni termiche e di qualità dell'aria sono adeguate",
    area: "contenuto",
  },
  {
    id: "CC03", codice: "CC03",
    dimensione: "Ambiente di lavoro e attrezzature",
    testo: "I livelli di rumore sono accettabili e non interferiscono con il lavoro",
    area: "contenuto",
  },
  {
    id: "CC04", codice: "CC04",
    dimensione: "Ambiente di lavoro e attrezzature",
    testo: "Le attrezzature e gli strumenti di lavoro sono adeguati e funzionanti",
    area: "contenuto",
  },
  {
    id: "CC05", codice: "CC05",
    dimensione: "Ambiente di lavoro e attrezzature",
    testo: "È garantita la manutenzione regolare dei locali e delle attrezzature",
    area: "contenuto",
  },
  {
    id: "CC06", codice: "CC06",
    dimensione: "Ambiente di lavoro e attrezzature",
    testo: "Gli spazi di lavoro sono adeguati (superficie, disposizione, pulizia)",
    area: "contenuto",
  },
  // --- Pianificazione dei compiti ---
  {
    id: "CC07", codice: "CC07",
    dimensione: "Pianificazione dei compiti",
    testo: "I compiti lavorativi sono chiaramente definiti e comunicati ai lavoratori",
    area: "contenuto",
  },
  {
    id: "CC08", codice: "CC08",
    dimensione: "Pianificazione dei compiti",
    testo: "Le procedure di lavoro sono documentate e aggiornate",
    area: "contenuto",
  },
  {
    id: "CC09", codice: "CC09",
    dimensione: "Pianificazione dei compiti",
    testo: "La monotonia e la ripetitività delle mansioni sono contenute",
    area: "contenuto",
  },
  {
    id: "CC10", codice: "CC10",
    dimensione: "Pianificazione dei compiti",
    testo: "I lavoratori dispongono delle competenze necessarie per le mansioni assegnate",
    area: "contenuto",
  },
  {
    id: "CC11", codice: "CC11",
    dimensione: "Pianificazione dei compiti",
    testo: "È prevista la rotazione su compiti diversificati ove possibile",
    area: "contenuto",
  },
  // --- Carico di lavoro e ritmo di lavoro ---
  {
    id: "CC12", codice: "CC12",
    dimensione: "Carico di lavoro e ritmo di lavoro",
    testo: "Il carico di lavoro è distribuito equamente tra i lavoratori del gruppo",
    area: "contenuto",
  },
  {
    id: "CC13", codice: "CC13",
    dimensione: "Carico di lavoro e ritmo di lavoro",
    testo: "Le scadenze e i ritmi sono realistici e raggiungibili",
    area: "contenuto",
  },
  {
    id: "CC14", codice: "CC14",
    dimensione: "Carico di lavoro e ritmo di lavoro",
    testo: "Non si verificano frequenti picchi di lavoro eccessivi",
    area: "contenuto",
  },
  {
    id: "CC15", codice: "CC15",
    dimensione: "Carico di lavoro e ritmo di lavoro",
    testo: "I lavoratori hanno la possibilità di regolare il proprio ritmo entro certi limiti",
    area: "contenuto",
  },
  {
    id: "CC16", codice: "CC16",
    dimensione: "Carico di lavoro e ritmo di lavoro",
    testo: "Sono previste risorse aggiuntive in caso di picchi di attività",
    area: "contenuto",
  },
  // --- Orario di lavoro ---
  {
    id: "CC17", codice: "CC17",
    dimensione: "Orario di lavoro",
    testo: "L'orario di lavoro è regolare e prevedibile",
    area: "contenuto",
  },
  {
    id: "CC18", codice: "CC18",
    dimensione: "Orario di lavoro",
    testo: "Il lavoro straordinario è limitato e gestito correttamente",
    area: "contenuto",
  },
  {
    id: "CC19", codice: "CC19",
    dimensione: "Orario di lavoro",
    testo: "I turni (se presenti) sono organizzati nel rispetto dei ritmi circadiani",
    area: "contenuto",
  },
  {
    id: "CC20", codice: "CC20",
    dimensione: "Orario di lavoro",
    testo: "Sono garantite pause adeguate durante la giornata lavorativa",
    area: "contenuto",
  },
  {
    id: "CC21", codice: "CC21",
    dimensione: "Orario di lavoro",
    testo: "È rispettato il diritto alla disconnessione al di fuori dell'orario di lavoro",
    area: "contenuto",
  },
  {
    id: "CC22", codice: "CC22",
    dimensione: "Orario di lavoro",
    testo: "Viene favorita la conciliazione tra orario di lavoro e impegni personali",
    area: "contenuto",
  },
]

// =============================
// AREA: CONTESTO DEL LAVORO
// =============================

export const CHECKLIST_CONTESTO: SlcChecklistItemDef[] = [
  // --- Cultura organizzativa ---
  {
    id: "CX01", codice: "CX01",
    dimensione: "Cultura organizzativa",
    testo: "Esiste una politica aziendale per la gestione dello stress lavoro-correlato",
    area: "contesto",
  },
  {
    id: "CX02", codice: "CX02",
    dimensione: "Cultura organizzativa",
    testo: "Sono definite procedure per la gestione dei conflitti sul lavoro",
    area: "contesto",
  },
  {
    id: "CX03", codice: "CX03",
    dimensione: "Cultura organizzativa",
    testo: "Il management promuove attivamente il benessere dei lavoratori",
    area: "contesto",
  },
  {
    id: "CX04", codice: "CX04",
    dimensione: "Cultura organizzativa",
    testo: "I lavoratori vengono consultati sui cambiamenti organizzativi che li riguardano",
    area: "contesto",
  },
  {
    id: "CX05", codice: "CX05",
    dimensione: "Cultura organizzativa",
    testo: "È presente un sistema di segnalazione anonima delle criticità",
    area: "contesto",
  },
  // --- Ruolo nell'organizzazione ---
  {
    id: "CX06", codice: "CX06",
    dimensione: "Ruolo nell'organizzazione",
    testo: "I ruoli e le responsabilità sono chiaramente definiti per ogni lavoratore",
    area: "contesto",
  },
  {
    id: "CX07", codice: "CX07",
    dimensione: "Ruolo nell'organizzazione",
    testo: "Non esistono conflitti di ruolo o ambiguità sulle responsabilità",
    area: "contesto",
  },
  {
    id: "CX08", codice: "CX08",
    dimensione: "Ruolo nell'organizzazione",
    testo: "Le aspettative nei confronti dei lavoratori sono realistiche e comunicate",
    area: "contesto",
  },
  {
    id: "CX09", codice: "CX09",
    dimensione: "Ruolo nell'organizzazione",
    testo: "L'organigramma aziendale è aggiornato e accessibile",
    area: "contesto",
  },
  // --- Comunicazione ---
  {
    id: "CX10", codice: "CX10",
    dimensione: "Comunicazione",
    testo: "La comunicazione interna è efficace e tempestiva",
    area: "contesto",
  },
  {
    id: "CX11", codice: "CX11",
    dimensione: "Comunicazione",
    testo: "Sono previsti incontri periodici tra management e lavoratori",
    area: "contesto",
  },
  {
    id: "CX12", codice: "CX12",
    dimensione: "Comunicazione",
    testo: "I lavoratori ricevono feedback regolare sulle proprie prestazioni",
    area: "contesto",
  },
  {
    id: "CX13", codice: "CX13",
    dimensione: "Comunicazione",
    testo: "I cambiamenti aziendali vengono comunicati con adeguato preavviso",
    area: "contesto",
  },
  // --- Autonomia decisionale ---
  {
    id: "CX14", codice: "CX14",
    dimensione: "Autonomia decisionale",
    testo: "I lavoratori hanno un adeguato livello di autonomia nello svolgimento dei compiti",
    area: "contesto",
  },
  {
    id: "CX15", codice: "CX15",
    dimensione: "Autonomia decisionale",
    testo: "È possibile prendere decisioni operative senza eccessiva supervisione",
    area: "contesto",
  },
  {
    id: "CX16", codice: "CX16",
    dimensione: "Autonomia decisionale",
    testo: "I lavoratori possono proporre miglioramenti dei processi lavorativi",
    area: "contesto",
  },
  // --- Sviluppo di carriera ---
  {
    id: "CX17", codice: "CX17",
    dimensione: "Sviluppo di carriera",
    testo: "Sono presenti percorsi di crescita professionale e formazione continua",
    area: "contesto",
  },
  {
    id: "CX18", codice: "CX18",
    dimensione: "Sviluppo di carriera",
    testo: "I criteri di valutazione e promozione sono trasparenti",
    area: "contesto",
  },
  {
    id: "CX19", codice: "CX19",
    dimensione: "Sviluppo di carriera",
    testo: "La sicurezza del posto di lavoro è percepita come adeguata",
    area: "contesto",
  },
  {
    id: "CX20", codice: "CX20",
    dimensione: "Sviluppo di carriera",
    testo: "La retribuzione è percepita come adeguata rispetto al ruolo",
    area: "contesto",
  },
  // --- Interfaccia casa-lavoro ---
  {
    id: "CX21", codice: "CX21",
    dimensione: "Interfaccia casa-lavoro",
    testo: "L'azienda supporta la conciliazione tra vita lavorativa e familiare",
    area: "contesto",
  },
  {
    id: "CX22", codice: "CX22",
    dimensione: "Interfaccia casa-lavoro",
    testo: "Sono disponibili flessibilità orarie o permessi per esigenze personali",
    area: "contesto",
  },
  {
    id: "CX23", codice: "CX23",
    dimensione: "Interfaccia casa-lavoro",
    testo: "Non è richiesta reperibilità eccessiva fuori dall'orario di lavoro",
    area: "contesto",
  },
]

// =============================
// MODULO REMOTO / TECNOLOGIA
// =============================

export const CHECKLIST_REMOTO: SlcRemoteItemDef[] = [
  {
    id: "MR01", codice: "MR01",
    testo: "Sono fornite attrezzature tecnologiche adeguate per il lavoro da remoto (PC, monitor, connessione)",
  },
  {
    id: "MR02", codice: "MR02",
    testo: "È stata erogata formazione specifica sugli strumenti tecnologici utilizzati",
  },
  {
    id: "MR03", codice: "MR03",
    testo: "È stata erogata formazione specifica sulle modalità di lavoro da remoto",
  },
  {
    id: "MR04", codice: "MR04",
    testo: "Sono definite modalità efficaci di coordinamento per i lavoratori da remoto",
  },
  {
    id: "MR05", codice: "MR05",
    testo: "È stata verificata la compatibilità delle attività con la modalità di lavoro da remoto",
  },
  {
    id: "MR06", codice: "MR06",
    testo: "È garantito il diritto alla disconnessione per i lavoratori da remoto",
  },
  {
    id: "MR07", codice: "MR07",
    testo: "È stata fornita l'informativa sulla sicurezza per il lavoro da remoto",
  },
]
