// Questionario INAIL-HSE — Sondaggio di Percezione del Rischio da Stress Lavoro Correlato
// Fase di Valutazione Approfondita (Fase 2)
// 35 domande, 7 dimensioni, scala Likert 1–5 (dove MAGGIORE = migliore benessere)

export type ScaleType =
  | "frequency_reverse"   // 1=Sempre … 5=Mai  (item negativo, scala già invertita)
  | "frequency_direct"    // 1=Mai … 5=Sempre
  | "agreement_direct"    // 1=Fortemente in disaccordo … 5=Fortemente d'accordo
  | "agreement_reverse"   // 1=Fortemente d'accordo … 5=Fortemente in disaccordo

export interface PerceptionQuestion {
  id: string               // "1"–"35" (numero d'ordine nel questionario)
  dimensione: string
  testo: string
  scale_type: ScaleType
  reverse_scored: boolean  // true = item negativo (la scala è già invertita di conseguenza)
}

export interface DimensionDef {
  nome: string
  minScore: number   // n_items × 1
  maxScore: number   // n_items × 5
}

export const SCALE_LABELS: Record<ScaleType, Record<number, string>> = {
  frequency_reverse: { 1: "Sempre",                    2: "Spesso",   3: "Qualche volta", 4: "Raramente", 5: "Mai"                      },
  frequency_direct:  { 1: "Mai",                        2: "Raramente", 3: "Qualche volta", 4: "Spesso",    5: "Sempre"                   },
  agreement_direct:  { 1: "Fortemente in disaccordo",   2: "In disaccordo", 3: "Né d'accordo né in disaccordo", 4: "D'accordo", 5: "Fortemente d'accordo"  },
  agreement_reverse: { 1: "Fortemente d'accordo",       2: "D'accordo", 3: "Né d'accordo né in disaccordo", 4: "In disaccordo", 5: "Fortemente in disaccordo" },
}

// Ordine originale del questionario (per id numerico 1–35)
export const PERCEPTION_QUESTIONS: PerceptionQuestion[] = [
  { id: "1",  dimensione: "Ruolo",               testo: "Ho chiaro cosa ci si aspetta da me al lavoro",                                                                           scale_type: "frequency_direct",  reverse_scored: false },
  { id: "2",  dimensione: "Controllo",            testo: "Posso decidere quando fare una pausa",                                                                                  scale_type: "frequency_direct",  reverse_scored: false },
  { id: "3",  dimensione: "Domanda",              testo: "Le richieste di lavoro che mi vengono fatte da varie persone/uffici sono difficili da combinare fra loro",               scale_type: "frequency_reverse", reverse_scored: true  },
  { id: "4",  dimensione: "Ruolo",               testo: "So come svolgere il mio lavoro",                                                                                        scale_type: "frequency_direct",  reverse_scored: false },
  { id: "5",  dimensione: "Relazioni",            testo: "Sono soggetto a molestie personali sotto forma di parole o comportamenti scortesi",                                     scale_type: "frequency_reverse", reverse_scored: true  },
  { id: "6",  dimensione: "Domanda",              testo: "Ho scadenze irraggiungibili",                                                                                           scale_type: "frequency_reverse", reverse_scored: true  },
  { id: "7",  dimensione: "Supporto Colleghi",    testo: "Se il lavoro diventa difficile, posso contare sull'aiuto dei miei colleghi",                                            scale_type: "frequency_direct",  reverse_scored: false },
  { id: "8",  dimensione: "Supporto Management",  testo: "Ricevo informazioni di supporto che mi aiutano nel lavoro che svolgo",                                                  scale_type: "frequency_direct",  reverse_scored: false },
  { id: "9",  dimensione: "Domanda",              testo: "Devo lavorare molto intensamente",                                                                                      scale_type: "frequency_reverse", reverse_scored: true  },
  { id: "10", dimensione: "Controllo",            testo: "Ho voce in capitolo nel decidere la velocità con la quale svolgere il mio lavoro",                                      scale_type: "frequency_direct",  reverse_scored: false },
  { id: "11", dimensione: "Ruolo",               testo: "Ho chiari i compiti e le mie responsabilità",                                                                           scale_type: "frequency_direct",  reverse_scored: false },
  { id: "12", dimensione: "Domanda",              testo: "Devo trascurare alcuni compiti perché ho troppo da fare",                                                               scale_type: "frequency_reverse", reverse_scored: true  },
  { id: "13", dimensione: "Ruolo",               testo: "Mi sono chiari gli obiettivi e i traguardi del mio reparto/ufficio",                                                    scale_type: "frequency_direct",  reverse_scored: false },
  { id: "14", dimensione: "Relazioni",            testo: "Ci sono attriti o conflitti fra i colleghi",                                                                            scale_type: "frequency_reverse", reverse_scored: true  },
  { id: "15", dimensione: "Controllo",            testo: "Ho libertà di scelta nel decidere come svolgere il mio lavoro",                                                         scale_type: "frequency_direct",  reverse_scored: false },
  { id: "16", dimensione: "Domanda",              testo: "Non ho la possibilità di prendere sufficienti pause",                                                                   scale_type: "frequency_reverse", reverse_scored: true  },
  { id: "17", dimensione: "Ruolo",               testo: "Capisco in che modo il mio lavoro si inserisce negli obiettivi generali dell'organizzazione",                           scale_type: "frequency_direct",  reverse_scored: false },
  { id: "18", dimensione: "Domanda",              testo: "Ricevo pressioni per lavorare oltre l'orario",                                                                          scale_type: "frequency_reverse", reverse_scored: true  },
  { id: "19", dimensione: "Controllo",            testo: "Ho libertà di scelta nel decidere cosa fare al lavoro",                                                                 scale_type: "frequency_direct",  reverse_scored: false },
  { id: "20", dimensione: "Domanda",              testo: "Devo svolgere il mio lavoro molto velocemente",                                                                         scale_type: "frequency_reverse", reverse_scored: true  },
  { id: "21", dimensione: "Relazioni",            testo: "Al lavoro sono soggetto a prepotenze e vessazioni",                                                                     scale_type: "frequency_reverse", reverse_scored: true  },
  { id: "22", dimensione: "Domanda",              testo: "Ho scadenze temporali impossibili da rispettare",                                                                       scale_type: "frequency_reverse", reverse_scored: true  },
  { id: "23", dimensione: "Supporto Management",  testo: "Posso fare affidamento sul mio capo nel caso avessi problemi di lavoro",                                               scale_type: "frequency_direct",  reverse_scored: false },
  { id: "24", dimensione: "Supporto Colleghi",    testo: "I colleghi mi danno l'aiuto e il supporto di cui ho bisogno",                                                           scale_type: "agreement_direct",  reverse_scored: false },
  { id: "25", dimensione: "Controllo",            testo: "Ho voce in capitolo su come svolgere il mio lavoro",                                                                    scale_type: "agreement_direct",  reverse_scored: false },
  { id: "26", dimensione: "Cambiamento",          testo: "Ho sufficienti opportunità di chiedere spiegazioni ai dirigenti sui cambiamenti relativi al lavoro",                   scale_type: "agreement_direct",  reverse_scored: false },
  { id: "27", dimensione: "Supporto Colleghi",    testo: "Al lavoro i miei colleghi mi dimostrano il rispetto che merito",                                                        scale_type: "agreement_direct",  reverse_scored: false },
  { id: "28", dimensione: "Cambiamento",          testo: "Il personale viene sempre consultato in merito ai cambiamenti nel lavoro",                                              scale_type: "agreement_direct",  reverse_scored: false },
  { id: "29", dimensione: "Supporto Management",  testo: "Se qualcosa al lavoro mi ha disturbato o infastidito posso parlarne con il mio responsabile",                          scale_type: "agreement_direct",  reverse_scored: false },
  { id: "30", dimensione: "Controllo",            testo: "Il mio orario di lavoro può essere flessibile",                                                                         scale_type: "agreement_direct",  reverse_scored: false },
  { id: "31", dimensione: "Supporto Colleghi",    testo: "I colleghi sono disponibili ad ascoltare i miei problemi di lavoro",                                                    scale_type: "agreement_direct",  reverse_scored: false },
  { id: "32", dimensione: "Cambiamento",          testo: "Quando ci sono dei cambiamenti di lavoro, mi è chiaro che effetto avranno in pratica",                                  scale_type: "agreement_direct",  reverse_scored: false },
  { id: "33", dimensione: "Supporto Management",  testo: "Sono supportato in lavori emotivamente impegnativi",                                                                    scale_type: "agreement_direct",  reverse_scored: false },
  { id: "34", dimensione: "Relazioni",            testo: "Le relazioni sul luogo di lavoro sono tese",                                                                            scale_type: "agreement_reverse", reverse_scored: true  },
  { id: "35", dimensione: "Supporto Management",  testo: "Il mio responsabile mi incoraggia nel lavoro",                                                                          scale_type: "agreement_direct",  reverse_scored: false },
]

// Dimensioni con range di punteggio per la normalizzazione
export const DIMENSION_DEFS: DimensionDef[] = [
  { nome: "Domanda",             minScore: 8,  maxScore: 40 },  // 8 items × [1,5]
  { nome: "Controllo",           minScore: 6,  maxScore: 30 },  // 6 items × [1,5]
  { nome: "Supporto Management", minScore: 5,  maxScore: 25 },  // 5 items × [1,5]
  { nome: "Supporto Colleghi",   minScore: 4,  maxScore: 20 },  // 4 items × [1,5]
  { nome: "Relazioni",           minScore: 4,  maxScore: 20 },  // 4 items × [1,5]
  { nome: "Ruolo",               minScore: 5,  maxScore: 25 },  // 5 items × [1,5]
  { nome: "Cambiamento",         minScore: 3,  maxScore: 15 },  // 3 items × [1,5]
]

export const PERCEPTION_DIMENSIONI = DIMENSION_DEFS.map((d) => d.nome)

export type PerceptionDimensione = (typeof PERCEPTION_DIMENSIONI)[number]

// ===== DATI SOCIO-DEMOGRAFICI =====
// Non contribuiscono al punteggio (included_in_scoring: false).
// Usati esclusivamente per l'analisi disaggregata dei risultati.

export interface SociodemographicFieldDef {
  id: string
  label: string
  type: "single_choice"
  options: string[]
}

export const SOCIODEMOGRAPHIC_FIELDS: SociodemographicFieldDef[] = [
  {
    id: "gender",
    label: "Genere",
    type: "single_choice",
    options: ["M", "F"],
  },
  {
    id: "age_range",
    label: "Età",
    type: "single_choice",
    options: ["Fino a 30 anni", "Da 31 a 50 anni", "51 anni e oltre"],
  },
  {
    id: "nationality",
    label: "Nazionalità",
    type: "single_choice",
    options: ["Italiana", "Non italiana"],
  },
  {
    id: "contract_type",
    label: "Tipologia contrattuale",
    type: "single_choice",
    options: [
      "Tempo indeterminato",
      "Tempo determinato",
      "Collaborazione",
      "Lavoro interinale",
      "Altro",
    ],
  },
]

// ===== DIMENSIONI INTEGRATIVE (Lavoro da remoto e innovazione tecnologica) =====
export const INTEGRATIVE_QUESTIONS: PerceptionQuestion[] = [
  { id: "36", dimensione: "Carico tecnologico",   testo: "Sono costretto dalle tecnologie a lavorare molto più velocemente", scale_type: "frequency_reverse", reverse_scored: true },
  { id: "37", dimensione: "Carico tecnologico",   testo: "Sono costretto dalle tecnologie a fare più lavoro di quello che riesco a gestire", scale_type: "frequency_reverse", reverse_scored: true },
  { id: "38", dimensione: "Carico tecnologico",   testo: "Sono costretto a cambiare le mie abitudini lavorative per adattarmi alle tecnologie", scale_type: "frequency_reverse", reverse_scored: true },
  { id: "39", dimensione: "Invasione tecnologica", testo: "Trascorro meno tempo con la mia famiglia a causa delle nuove tecnologie", scale_type: "frequency_reverse", reverse_scored: true },
  { id: "40", dimensione: "Invasione tecnologica", testo: "Devo rimanere in contatto con il mio lavoro anche durante le vacanze, le serate e i weekend a causa della tecnologia", scale_type: "frequency_reverse", reverse_scored: true },
  { id: "41", dimensione: "Invasione tecnologica", testo: "Sento che la mia vita personale è stata invasa dalle tecnologie", scale_type: "frequency_reverse", reverse_scored: true },
  { id: "42", dimensione: "Complessità tecnologica", testo: "Non so abbastanza di tecnologia per gestire il mio lavoro in modo soddisfacente", scale_type: "frequency_reverse", reverse_scored: true },
  { id: "43", dimensione: "Complessità tecnologica", testo: "Ho bisogno di molto tempo per comprendere e utilizzare nuove tecnologie", scale_type: "frequency_reverse", reverse_scored: true },
  { id: "44", dimensione: "Complessità tecnologica", testo: "Trovo spesso troppo complesso per me capire e usare le nuove tecnologie", scale_type: "frequency_reverse", reverse_scored: true },
  { id: "45", dimensione: "Conflitto casa-lavoro",  testo: "Le richieste del mio lavoro interferiscono con la mia vita familiare /privata", scale_type: "agreement_reverse", reverse_scored: true },
  { id: "46", dimensione: "Conflitto casa-lavoro",  testo: "Le richieste della mia famiglia/vita privata interferiscono con il mio lavoro", scale_type: "agreement_reverse", reverse_scored: true },
  { id: "47", dimensione: "Accettabilità strumenti", testo: "Gli strumenti tecnologici in dotazione migliorano le mie prestazioni nel lavoro", scale_type: "agreement_direct", reverse_scored: false },
  { id: "48", dimensione: "Accettabilità strumenti", testo: "Gli strumenti tecnologici in dotazione sono utili per lo svolgimento della mia attività lavorativa", scale_type: "agreement_direct", reverse_scored: false },
  { id: "49", dimensione: "Accettabilità strumenti", testo: "Gli strumenti tecnologici in dotazione migliorano le interazioni con i miei colleghi", scale_type: "agreement_direct", reverse_scored: false },
  { id: "50", dimensione: "Accettabilità strumenti", testo: "Gli strumenti tecnologici in dotazione mi permettono di rimanere aggiornato", scale_type: "agreement_direct", reverse_scored: false },
  { id: "51", dimensione: "Accettabilità strumenti", testo: "Gli strumenti tecnologici in dotazione sono semplici da usare", scale_type: "agreement_direct", reverse_scored: false },
  { id: "52", dimensione: "Accettabilità strumenti", testo: "Gli strumenti tecnologici in dotazione favoriscono il bilanciamento tra la mia vita privata e lavorativa", scale_type: "agreement_direct", reverse_scored: false },
  { id: "53", dimensione: "Criticità remoto",       testo: "Problemi tecnici (es. connessione, velocità del computer, aggiornamenti che rallentano)", scale_type: "frequency_reverse", reverse_scored: true },
  { id: "54", dimensione: "Criticità remoto",       testo: "Mancanza di interazione sociale con i colleghi", scale_type: "frequency_reverse", reverse_scored: true },
  { id: "55", dimensione: "Criticità remoto",       testo: "Difficoltà di tipo fisico (es. la postazione a casa non è comoda come la postazione in ufficio in termini di comfort, illuminazione, rumorosità, aereazione, temperatura)", scale_type: "frequency_reverse", reverse_scored: true },
  { id: "56", dimensione: "Criticità remoto",       testo: "Distrazioni (es. interruzioni da parte dei bambini, della famiglia, rumori)", scale_type: "frequency_reverse", reverse_scored: true },
  { id: "57", dimensione: "Criticità remoto",       testo: "Difficoltà di comunicazione (es. ricevere informazioni/spiegazioni via mail non è come riceverle verbalmente o di persona)", scale_type: "frequency_reverse", reverse_scored: true },
  { id: "58", dimensione: "Criticità remoto",       testo: "Difficoltà nella supervisione (es. controllare il lavoro di un dipendente mentre lavora da remoto)", scale_type: "frequency_reverse", reverse_scored: true },
  { id: "59", dimensione: "Criticità remoto",       testo: "Isolamento dal team di lavoro", scale_type: "frequency_reverse", reverse_scored: true },
  { id: "60", dimensione: "Criticità remoto",       testo: "Mancanza di informazioni/conoscenze utili per svolgere il mio lavoro", scale_type: "frequency_reverse", reverse_scored: true },
  { id: "61", dimensione: "Interazioni remoto",     testo: "Con quale frequenza interagisce con il suo diretto responsabile?", scale_type: "frequency_direct", reverse_scored: false },
  { id: "62", dimensione: "Interazioni remoto",     testo: "Con quale frequenza interagisce con i suoi colleghi?", scale_type: "frequency_direct", reverse_scored: false },
]

export const INTEGRATIVE_DIMENSION_DEFS: (DimensionDef & { shortName: string })[] = [
  { nome: "Carico di lavoro dovuto alle tecnologie", shortName: "Carico tecnologico",   minScore: 3, maxScore: 15 },
  { nome: "Invasione delle tecnologie",              shortName: "Invasione tecnologica", minScore: 3, maxScore: 15 },
  { nome: "Complessità delle tecnologie",            shortName: "Complessità tecnologica", minScore: 3, maxScore: 15 },
  { nome: "Conflitto casa-lavoro",                   shortName: "Conflitto casa-lavoro",  minScore: 2, maxScore: 10 },
  { nome: "Accettabilità degli strumenti tecnologici", shortName: "Accettabilità strumenti", minScore: 6, maxScore: 30 },
  { nome: "Criticità del lavoro da remoto",          shortName: "Criticità remoto",       minScore: 8, maxScore: 40 },
  { nome: "Interazioni nel lavoro da remoto",         shortName: "Interazioni remoto",     minScore: 2, maxScore: 10 },
]
