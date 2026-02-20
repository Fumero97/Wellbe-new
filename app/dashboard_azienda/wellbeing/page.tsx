"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { 
    Download, 
    Filter, 
    RefreshCcw, 
    Calendar as CalendarIcon,
    TrendingUp,
    TrendingDown,
    Activity,
    Heart,
    Users,
    Brain,
    Coffee,
    AlertTriangle,
    Files,
    FileText,
    Check,
    ChevronsUpDown,
    Phone,
    MessageCircle,
    Mail,
    ChevronRight,
    Clock,
    Lock,
} from "lucide-react"
import { AreaChartDemo, BarChartDemo, ChartRadarLinesOnly, ChartLineMultiple } from "@/components/dashboard/charts"
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from "recharts"
import { ChartConfig } from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect, useMemo, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import type { SlcAssessment, SlcRiskLevel } from "@/lib/slc/types"
import { loadAssessments } from "@/lib/slc/mock-data"
import { PERCEPTION_QUESTIONS, DIMENSION_DEFS, INTEGRATIVE_QUESTIONS, INTEGRATIVE_DIMENSION_DEFS } from "@/lib/slc/perception-questions"
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { generatePDFReport } from "@/lib/pdf-service"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Label as UILabel } from "@/components/ui/label"
import { Eye } from "lucide-react"

function SurveyParamReader({ surveys, onSelect }: { surveys: { id: string }[], onSelect: (id: string) => void }) {
  const searchParams = useSearchParams()
  useEffect(() => {
    const param = searchParams.get("survey")
    if (param && surveys.some(s => s.id === param)) {
      onSelect(param)
    }
  }, [searchParams, surveys, onSelect])
  return null
}

export default function AnalyticsPage() {
  const surveys = [
    { id: "1", title: "Quarterly Wellness Assessment", type: "wellbeing",    status: "Active", date: "Nov 15, 2024" },
    { id: "2", title: "DEI & Inclusion Survey",        type: "dei",          status: "Draft",  date: "Dec 01, 2024" },
    { id: "3", title: "Safety Protocols Feedback",     type: "safety",       status: "Closed", date: "Sep 30, 2024" },
    { id: "4", title: "Vendor Satisfaction Survey",    type: "supply-chain", status: "Active", date: "Nov 20, 2024" },
    { id: "5", title: "Internal Stakeholder Review",   type: "stakeholders", status: "Draft",  date: "Dec 05, 2024" },
    { id: "6", title: "Valutazione approfondita",       type: "slc",          status: "Active", date: "Mar 15, 2025" },
  ]

  // Wellbeing sub-surveys (shown in the selector within the wellbeing view)
  const wellbeingSurveys = [
    { id: "wb-1", title: "Blue Wellbeing Survey - 2024 Q4", status: "Closed", date: "31 Dec 2024" },
    { id: "wb-2", title: "Blue Wellbeing Survey - 2024 Q3", status: "Closed", date: "30 Sep 2024" },
    { id: "wb-3", title: "Blue Wellbeing Survey - 2024 Q2", status: "Closed", date: "30 Jun 2024" },
  ]

  const router = useRouter()

  const [selectedSurveyId, setSelectedSurveyId] = useState(surveys[0].id)
  const selectedSurvey = surveys.find(s => s.id === selectedSurveyId) || surveys[0]

  const [slcAssessments, setSlcAssessments] = useState<SlcAssessment[]>([])

  useEffect(() => {
    setSlcAssessments(loadAssessments())
  }, [])

  // Reload SLC data whenever the user switches to the SLC survey
  useEffect(() => {
    if (selectedSurvey.type === "slc") {
      setSlcAssessments(loadAssessments())
    }
  }, [selectedSurvey.type])

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: addDays(new Date(2024, 0, 1), 180),
  })

  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    "Colleghi", "Appartenenza", "Coinvolgimento", "Work-life", 
    "Leadership", "Soddisfazione", "Tecnologia", "Sicurezza"
  ])
  const [selectedDimension, setSelectedDimension] = useState<keyof typeof demographicAnalysis>("role")
  const [attentionArea, setAttentionArea] = useState<string>("Colleghi")
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  const [reportConfig, setReportConfig] = useState({
    kpis: true,
    radar: true,
    insights: true,
    demographics: true,
    history: true,
    slcQuestions: true,
    slcGroups: true,
    slcIntegrative: true,
    orientation: 'portrait' as 'portrait' | 'landscape'
  })

  // PDF filter configuration: which groups and demographic dimensions to include
  const [pdfFilterConfig, setPdfFilterConfig] = useState<{
    selectedGroups: string[]; // ["all", "group-1", ...] 
    selectedDimensions: string[]; // ["Domanda", "Controllo", ...]
  }>({
    selectedGroups: ["all"],
    selectedDimensions: ["Domanda", "Controllo", "Supporto Management", "Supporto Colleghi", "Relazioni", "Ruolo", "Cambiamento"]
  })

  // SLC filters
  const [slcDemographicFilter, setSlcDemographicFilter] = useState<string>("all")
  const [slcGroupFilter, setSlcGroupFilter] = useState<string>("all")
  const [slcDimensionAnalysis, setSlcDimensionAnalysis] = useState<string>("general")

  const handleToggleSection = (section: keyof typeof reportConfig) => {
    setReportConfig(prev => ({ ...prev, [section]: !prev[section] }))
  }
  // Helper: wait for next frame (allow React to re-render after state change)
  const waitForRender = () => new Promise<void>(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(resolve, 300)))
  })

  const handlePreviewPDF = async () => {
    setIsPreviewing(true)
    const origGroup = slcGroupFilter
    const origDim = slcDimensionAnalysis

    try {
      setSlcDimensionAnalysis("general");
      const firstGroup = pdfFilterConfig.selectedGroups[0] || "all"
      setSlcGroupFilter(firstGroup)
      await waitForRender()

      const url = await generatePDFReport("wellbeing-report-content", "Preview", { 
        preview: true,
        orientation: reportConfig.orientation
      }) as string
      setPreviewUrl(url)
    } catch (error) {
      toast.error("Errore durante la generazione della preview")
    } finally {
      setSlcGroupFilter(origGroup)
      setSlcDimensionAnalysis(origDim)
      setIsPreviewing(false)
    }
  }

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    const toastId = toast.loading("Generazione PDF in corso...")
    const origGroup = slcGroupFilter
    const origDim = slcDimensionAnalysis

    try {
      const groups = pdfFilterConfig.selectedGroups.length > 0 ? pdfFilterConfig.selectedGroups : ["all"]
      setSlcDimensionAnalysis("general"); // Hardcoded, we don't split by demo anymore

      const container = document.getElementById("pdf-collection-container");
      if (container) container.innerHTML = '';

      for (let gi = 0; gi < groups.length; gi++) {
        setSlcGroupFilter(groups[gi])
        await waitForRender()
        const clone = document.getElementById("wellbeing-report-content")?.cloneNode(true) as HTMLElement;
        if (clone && container) {
          if (gi > 0) {
             const pb = document.createElement("div");
             pb.className = "page-break border-t border-slate-300 mt-8 pt-8";
             pb.style.pageBreakBefore = "always";
             pb.style.width = "100%";
             container.appendChild(pb);
          }
          container.appendChild(clone);
        }
      }

      await generatePDFReport("pdf-collection-container", "Report_SLC_Completo", {
        orientation: reportConfig.orientation
      })

      if (container) container.innerHTML = '';
      
      toast.success(`Report PDF completo generato con successo`, { id: toastId })
      setIsReportDialogOpen(false)
    } catch (error) {
      toast.error("Errore durante la generazione del PDF", { id: toastId })
    } finally {
      setSlcGroupFilter(origGroup)
      setSlcDimensionAnalysis(origDim)
      setIsGeneratingPDF(false)
    }
  }

  // Mock Data for Charts
  const wellbeingRadarData = [
    { area: "Colleghi", score: 5 },
    { area: "Appartenenza", score: 4 },
    { area: "Coinvolgimento", score: 6 },
    { area: "Work-life", score: 3 },
    { area: "Leadership", score: 5 },
    { area: "Soddisfazione", score: 4 },
    { area: "Tecnologia", score: 5 },
    { area: "Sicurezza", score: 6 },
  ]

  const trendData = [
    { name: "Jan", Overall: 62, Colleghi: 5, Appartenenza: 4, Coinvolgimento: 6, "Work-life": 3, Leadership: 5, Soddisfazione: 4, Tecnologia: 5, Sicurezza: 6 },
    { name: "Feb", Overall: 65, Colleghi: 5.2, Appartenenza: 4.1, Coinvolgimento: 6.1, "Work-life": 3.2, Leadership: 5.1, Soddisfazione: 4.2, Tecnologia: 5.2, Sicurezza: 6.1 },
    { name: "Mar", Overall: 68, Colleghi: 5.5, Appartenenza: 4.3, Coinvolgimento: 6.3, "Work-life": 3.5, Leadership: 5.3, Soddisfazione: 4.4, Tecnologia: 5.4, Sicurezza: 6.3 },
    { name: "Apr", Overall: 70, Colleghi: 5.7, Appartenenza: 4.5, Coinvolgimento: 6.5, "Work-life": 3.7, Leadership: 5.5, Soddisfazione: 4.6, Tecnologia: 5.6, Sicurezza: 6.5 },
    { name: "May", Overall: 71, Colleghi: 5.9, Appartenenza: 4.7, Coinvolgimento: 6.7, "Work-life": 4.0, Leadership: 5.7, Soddisfazione: 4.8, Tecnologia: 5.8, Sicurezza: 6.7 },
    { name: "Jun", Overall: 73, Colleghi: 6.0, Appartenenza: 4.9, Coinvolgimento: 6.9, "Work-life": 4.2, Leadership: 5.9, Soddisfazione: 5.0, Tecnologia: 6.0, Sicurezza: 6.9 },
  ]

  const demographicAnalysis = {
    age: {
        label: "Età",
        categories: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
        distribution: [
            { name: "18-24", value: 15, color: "#3b82f6" },
            { name: "25-34", value: 30, color: "#60a5fa" },
            { name: "35-44", value: 25, color: "#93c5fd" },
            { name: "45-54", value: 20, color: "#bfdbfe" },
            { name: "55-64", value: 10, color: "#dbeafe" },
        ],
        performance: [
            { name: "18-24", Colleghi: 5.5, Appartenenza: 4.2, Coinvolgimento: 5.8, "Work-life": 3.2, Leadership: 4.8, Soddisfazione: 4.1, Tecnologia: 5.7, Sicurezza: 5.9 },
            { name: "25-34", Colleghi: 5.2, Appartenenza: 4.5, Coinvolgimento: 6.0, "Work-life": 3.5, Leadership: 5.1, Soddisfazione: 4.4, Tecnologia: 5.5, Sicurezza: 6.2 },
            { name: "35-44", Colleghi: 5.0, Appartenenza: 4.3, Coinvolgimento: 6.1, "Work-life": 3.4, Leadership: 5.3, Soddisfazione: 4.2, Tecnologia: 5.4, Sicurezza: 6.0 },
            { name: "45-54", Colleghi: 4.8, Appartenenza: 4.1, Coinvolgimento: 5.9, "Work-life": 3.1, Leadership: 5.0, Soddisfazione: 4.0, Tecnologia: 5.2, Sicurezza: 5.8 },
            { name: "55-64", Colleghi: 4.6, Appartenenza: 4.0, Coinvolgimento: 5.7, "Work-life": 3.0, Leadership: 4.8, Soddisfazione: 3.8, Tecnologia: 5.0, Sicurezza: 5.6 },
            { name: "65+",   Colleghi: 4.9, Appartenenza: 4.2, Coinvolgimento: 5.8, "Work-life": 3.3, Leadership: 4.9, Soddisfazione: 4.0, Tecnologia: 5.1, Sicurezza: 5.7 },
        ]
    },
    education: {
        label: "Educazione",
        categories: ["Terza media", "Diploma", "Laurea Triennale", "Laurea Magistrale", "Superiore"],
        distribution: [
            { name: "Terza media", value: 5, color: "#8b5cf6" },
            { name: "Diploma", value: 35, color: "#a78bfa" },
            { name: "Laurea Triennale", value: 30, color: "#c4b5fd" },
            { name: "Laurea Magistrale", value: 25, color: "#ddd6fe" },
            { name: "Superiore", value: 5, color: "#ede9fe" },
        ],
        performance: [
            { name: "Terza media", Colleghi: 5.0, Appartenenza: 4.0, Coinvolgimento: 5.5, "Work-life": 3.0, Leadership: 4.5, Soddisfazione: 3.8, Tecnologia: 4.5, Sicurezza: 5.5 },
            { name: "Diploma", Colleghi: 5.2, Appartenenza: 4.2, Coinvolgimento: 5.8, "Work-life": 3.2, Leadership: 4.8, Soddisfazione: 4.1, Tecnologia: 5.0, Sicurezza: 5.8 },
            { name: "Laurea Triennale", Colleghi: 5.4, Appartenenza: 4.4, Coinvolgimento: 6.0, "Work-life": 3.4, Leadership: 5.1, Soddisfazione: 4.3, Tecnologia: 5.4, Sicurezza: 6.1 },
            { name: "Laurea Magistrale", Colleghi: 5.6, Appartenenza: 4.7, Coinvolgimento: 6.2, "Work-life": 3.7, Leadership: 5.4, Soddisfazione: 4.6, Tecnologia: 5.8, Sicurezza: 6.3 },
            { name: "Superiore", Colleghi: 5.8, Appartenenza: 4.9, Coinvolgimento: 6.5, "Work-life": 4.0, Leadership: 5.7, Soddisfazione: 4.9, Tecnologia: 6.0, Sicurezza: 6.5 },
        ]
    },
    children: {
        label: "Figli",
        categories: ["0", "1", "2", "3", "4+"],
        distribution: [
            { name: "0", value: 40, color: "#f43f5e" },
            { name: "1", value: 25, color: "#fb7185" },
            { name: "2", value: 20, color: "#fda4af" },
            { name: "3", value: 10, color: "#fecdd3" },
            { name: "4+", value: 5, color: "#fff1f2" },
        ],
        performance: [
            { name: "0", Colleghi: 5.5, Appartenenza: 4.5, Coinvolgimento: 6.2, "Work-life": 3.8, Leadership: 5.2, Soddisfazione: 4.5, Tecnologia: 5.8, Sicurezza: 6.2 },
            { name: "1", Colleghi: 5.3, Appartenenza: 4.3, Coinvolgimento: 6.0, "Work-life": 3.4, Leadership: 5.0, Soddisfazione: 4.2, Tecnologia: 5.6, Sicurezza: 6.0 },
            { name: "2", Colleghi: 5.1, Appartenenza: 4.1, Coinvolgimento: 5.8, "Work-life": 3.1, Leadership: 4.8, Soddisfazione: 3.9, Tecnologia: 5.4, Sicurezza: 5.8 },
            { name: "3", Colleghi: 4.9, Appartenenza: 3.9, Coinvolgimento: 5.6, "Work-life": 2.8, Leadership: 4.6, Soddisfazione: 3.7, Tecnologia: 5.2, Sicurezza: 5.6 },
            { name: "4+", Colleghi: 4.7, Appartenenza: 3.7, Coinvolgimento: 5.4, "Work-life": 2.5, Leadership: 4.4, Soddisfazione: 3.5, Tecnologia: 5.0, Sicurezza: 5.4 },
        ]
    },
    workMode: {
        label: "Modalità di lavoro",
        categories: ["In presenza", "Remoto", "Ibrida"],
        distribution: [
            { name: "In presenza", value: 30, color: "#10b981" },
            { name: "Remoto", value: 40, color: "#34d399" },
            { name: "Ibrida", value: 30, color: "#6ee7b7" },
        ],
        performance: [
            { name: "In presenza", Colleghi: 5.8, Appartenenza: 4.9, Coinvolgimento: 6.4, "Work-life": 2.8, Leadership: 5.5, Soddisfazione: 4.7, Tecnologia: 5.2, Sicurezza: 6.4 },
            { name: "Remoto", Colleghi: 4.8, Appartenenza: 4.2, Coinvolgimento: 5.7, "Work-life": 4.5, Leadership: 4.9, Soddisfazione: 4.3, Tecnologia: 6.0, Sicurezza: 5.8 },
            { name: "Ibrida", Colleghi: 5.4, Appartenenza: 4.6, Coinvolgimento: 6.1, "Work-life": 3.8, Leadership: 5.3, Soddisfazione: 4.6, Tecnologia: 5.7, Sicurezza: 6.2 },
        ]
    },
    role: {
        label: "Ruolo in azienda",
        categories: ["Dirigente o Management", "Intermedio o Team Leader", "Operazioni o collaboratore"],
        distribution: [
            { name: "Dirigente o Management", value: 10, color: "#f59e0b" },
            { name: "Intermedio o Team Leader", value: 20, color: "#fbbf24" },
            { name: "Operazioni o collaboratore", value: 70, color: "#fcd34d" },
        ],
        performance: [
            { name: "Dirigente o Management", Colleghi: 5.0, Appartenenza: 4.8, Coinvolgimento: 4.9, "Work-life": 4.6, Leadership: 4.9, Soddisfazione: 4.7, Tecnologia: 4.8, Sicurezza: 4.1 },
            { name: "Intermedio o Team Leader", Colleghi: 4.9, Appartenenza: 4.8, Coinvolgimento: 4.9, "Work-life": 4.5, Leadership: 5.0, Soddisfazione: 4.8, Tecnologia: 4.6, Sicurezza: 4.1 },
        ]
    },
    maritalStatus: {
        label: "Stato civile",
        categories: ["Coniugato/Convivente", "Single"],
        distribution: [
            { name: "Coniugato/Convivente", value: 65, color: "#ec4899" },
            { name: "Single", value: 35, color: "#f472b6" },
        ],
        performance: [
            { name: "Coniugato/Convivente", Colleghi: 5.4, Appartenenza: 4.6, Coinvolgimento: 6.1, "Work-life": 3.1, Leadership: 5.2, Soddisfazione: 4.4, Tecnologia: 5.6, Sicurezza: 6.3 },
            { name: "Single", Colleghi: 5.1, Appartenenza: 4.2, Coinvolgimento: 5.9, "Work-life": 3.8, Leadership: 4.9, Soddisfazione: 4.1, Tecnologia: 5.4, Sicurezza: 6.0 },
        ]
    },
    seniority: {
        label: "Anni di lavoro",
        categories: ["0-5", "6-10", "11-15", "16-25", "26-40", "40+"],
        distribution: [
            { name: "0-5", value: 40, color: "#6366f1" },
            { name: "6-10", value: 25, color: "#818cf8" },
            { name: "11-15", value: 15, color: "#a5b4fc" },
            { name: "16-25", value: 10, color: "#c7d2fe" },
            { name: "26-40", value: 7, color: "#e0e7ff" },
            { name: "40+", value: 3, color: "#f5f3ff" },
        ],
        performance: [
            { name: "0-5", Colleghi: 5.5, Appartenenza: 4.6, Coinvolgimento: 6.3, "Work-life": 3.8, Leadership: 5.3, Soddisfazione: 4.5, Tecnologia: 5.9, Sicurezza: 6.4 },
            { name: "6-10", Colleghi: 5.2, Appartenenza: 4.4, Coinvolgimento: 6.0, "Work-life": 3.4, Leadership: 5.1, Soddisfazione: 4.2, Tecnologia: 5.6, Sicurezza: 6.1 },
            { name: "11-15", Colleghi: 5.0, Appartenenza: 4.2, Coinvolgimento: 5.8, "Work-life": 3.2, Leadership: 4.9, Soddisfazione: 4.0, Tecnologia: 5.4, Sicurezza: 5.9 },
            { name: "16-25", Colleghi: 4.8, Appartenenza: 4.0, Coinvolgimento: 5.6, "Work-life": 3.0, Leadership: 4.7, Soddisfazione: 3.8, Tecnologia: 5.2, Sicurezza: 5.7 },
            { name: "26-40", Colleghi: 4.6, Appartenenza: 3.8, Coinvolgimento: 5.4, "Work-life": 2.8, Leadership: 4.5, Soddisfazione: 3.6, Tecnologia: 5.0, Sicurezza: 5.5 },
            { name: "40+", Colleghi: 4.7, Appartenenza: 3.9, Coinvolgimento: 5.5, "Work-life": 2.9, Leadership: 4.6, Soddisfazione: 3.7, Tecnologia: 5.1, Sicurezza: 5.6 },
        ]
    }
  }

  const slcDemographicAnalysis = useMemo(() => {
    const seed = slcGroupFilter === "all" ? 1 : (parseInt(slcGroupFilter.split('-')[1]) || 1);
    const scaleFactor = 0.8 + (seed % 5) * 0.1; // Variance between 0.8 and 1.2
    
    const baseData: any = {
      general: {
          label: "Valori Generali",
          categories: ["Media Aziendale"],
          distribution: [
              { name: "Media Aziendale", value: 100, color: "#8b5cf6" },
          ],
          performance: [
              { name: "Media Aziendale", Domanda: 52, Controllo: 50, "Supporto Management": 48, "Supporto Colleghi": 55, Relazioni: 50, Ruolo: 52, Cambiamento: 45 },
          ]
      },
      gender: {
          label: "Genere",
          categories: ["M", "F", "N/S"],
          distribution: [
              { name: "M", value: Math.round(55 * scaleFactor), color: "#06b6d4" },
              { name: "F", value: Math.round(40 * scaleFactor), color: "#22d3ee" },
              { name: "N/S", value: Math.round(5 * scaleFactor), color: "#67e8f9" },
          ],
          performance: [
              { name: "M", Domanda: 45, Controllo: 50, "Supporto Management": 48, "Supporto Colleghi": 55, Relazioni: 50, Ruolo: 52, Cambiamento: 45 },
              { name: "F", Domanda: 48, Controllo: 45, "Supporto Management": 50, "Supporto Colleghi": 52, Relazioni: 55, Ruolo: 48, Cambiamento: 50 },
              { name: "N/S", Domanda: 46, Controllo: 47, "Supporto Management": 49, "Supporto Colleghi": 53, Relazioni: 52, Ruolo: 50, Cambiamento: 47 },
          ]
      },
      age_range: {
          label: "Età",
          categories: ["Fino a 30 anni", "Da 31 a 50 anni", "51 anni e oltre"],
          distribution: [
              { name: "Fino a 30 anni", value: Math.round(30 * scaleFactor), color: "#8b5cf6" },
              { name: "Da 31 a 50 anni", value: Math.round(50 * scaleFactor), color: "#a78bfa" },
              { name: "51 anni e oltre", value: Math.round(20 * scaleFactor), color: "#c4b5fd" },
          ],
          performance: [
              { name: "Fino a 30 anni", Domanda: 40, Controllo: 55, "Supporto Management": 50, "Supporto Colleghi": 60, Relazioni: 55, Ruolo: 50, Cambiamento: 55 },
              { name: "Da 31 a 50 anni", Domanda: 50, Controllo: 45, "Supporto Management": 45, "Supporto Colleghi": 50, Relazioni: 48, Ruolo: 55, Cambiamento: 45 },
              { name: "51 anni e oltre", Domanda: 55, Controllo: 40, "Supporto Management": 40, "Supporto Colleghi": 45, Relazioni: 45, Ruolo: 45, Cambiamento: 40 },
          ]
      },
      nationality: {
          label: "Nazionalità",
          categories: ["Italiana", "Non italiana"],
          distribution: [
              { name: "Italiana", value: Math.round(85 * scaleFactor), color: "#f43f5e" },
              { name: "Non italiana", value: Math.round(15 * scaleFactor), color: "#fb7185" },
          ],
          performance: [
              { name: "Italiana", Domanda: 47, Controllo: 48, "Supporto Management": 47, "Supporto Colleghi": 53, Relazioni: 51, Ruolo: 51, Cambiamento: 47 },
              { name: "Non italiana", Domanda: 49, Controllo: 46, "Supporto Management": 49, "Supporto Colleghi": 51, Relazioni: 53, Ruolo: 49, Cambiamento: 49 },
          ]
      },
      contract_type: {
          label: "Tipologia contrattuale",
          categories: ["Tempo indeterminato", "Tempo determinato", "Collaborazione", "Lavoro somministrato", "Altro"],
          distribution: [
              { name: "Tempo indeterminato", value: Math.round(70 * scaleFactor), color: "#10b981" },
              { name: "Tempo determinato", value: Math.round(15 * scaleFactor), color: "#34d399" },
              { name: "Collaborazione", value: Math.round(5 * scaleFactor), color: "#6ee7b7" },
              { name: "Lavoro somministrato", value: Math.round(5 * scaleFactor), color: "#a7f3d0" },
              { name: "Altro", value: Math.round(5 * scaleFactor), color: "#d1fae5" },
          ],
          performance: [
              { name: "Tempo indeterminato", Domanda: 45, Controllo: 50, "Supporto Management": 48, "Supporto Colleghi": 55, Relazioni: 50, Ruolo: 52, Cambiamento: 45 },
              { name: "Tempo determinato", Domanda: 55, Controllo: 40, "Supporto Management": 42, "Supporto Colleghi": 48, Relazioni: 45, Ruolo: 45, Cambiamento: 40 },
              { name: "Collaborazione", Domanda: 50, Controllo: 45, "Supporto Management": 45, "Supporto Colleghi": 50, Relazioni: 48, Ruolo: 48, Cambiamento: 45 },
              { name: "Lavoro somministrato", Domanda: 60, Controllo: 35, "Supporto Management": 38, "Supporto Colleghi": 42, Relazioni: 40, Ruolo: 40, Cambiamento: 35 },
              { name: "Altro", Domanda: 52, Controllo: 48, "Supporto Management": 46, "Supporto Colleghi": 51, Relazioni: 49, Ruolo: 50, Cambiamento: 47 },
          ]
      },
      working_time: {
          label: "Tipologia orario di lavoro",
          categories: ["Full time", "Part time verticale", "Part time orizzontale", "Part time misto"],
          distribution: [
              { name: "Full time", value: Math.round(65 * scaleFactor), color: "#3b82f6" },
              { name: "Part time verticale", value: Math.round(15 * scaleFactor), color: "#60a5fa" },
              { name: "Part time orizzontale", value: Math.round(12 * scaleFactor), color: "#93c5fd" },
              { name: "Part time misto", value: Math.round(8 * scaleFactor), color: "#bfdbfe" },
          ],
          performance: [
              { name: "Full time", Domanda: 46, Controllo: 52, "Supporto Management": 49, "Supporto Colleghi": 54, Relazioni: 51, Ruolo: 53, Cambiamento: 47 },
              { name: "Part time verticale", Domanda: 48, Controllo: 48, "Supporto Management": 47, "Supporto Colleghi": 52, Relazioni: 53, Ruolo: 49, Cambiamento: 49 },
              { name: "Part time orizzontale", Domanda: 50, Controllo: 45, "Supporto Management": 46, "Supporto Colleghi": 50, Relazioni: 48, Ruolo: 51, Cambiamento: 46 },
              { name: "Part time misto", Domanda: 47, Controllo: 47, "Supporto Management": 48, "Supporto Colleghi": 53, Relazioni: 50, Ruolo: 50, Cambiamento: 48 },
          ]
      },
      remote_work: {
          label: "Lavoro da remoto",
          categories: ["No", "Lavoro agile", "Telelavoro", "Lavoro decentrato"],
          distribution: [
              { name: "No", value: Math.round(40 * scaleFactor), color: "#f59e0b" },
              { name: "Lavoro agile", value: Math.round(45 * scaleFactor), color: "#fbbf24" },
              { name: "Telelavoro", value: Math.round(10 * scaleFactor), color: "#fcd34d" },
              { name: "Lavoro decentrato", value: Math.round(5 * scaleFactor), color: "#fef3c7" },
          ],
          performance: [
              { name: "No", Domanda: 52, Controllo: 42, "Supporto Management": 45, "Supporto Colleghi": 48, Relazioni: 46, Ruolo: 50, Cambiamento: 43 },
              { name: "Lavoro agile", Domanda: 44, Controllo: 55, "Supporto Management": 52, "Supporto Colleghi": 58, Relazioni: 54, Ruolo: 55, Cambiamento: 52 },
              { name: "Telelavoro", Domanda: 42, Controllo: 58, "Supporto Management": 50, "Supporto Colleghi": 55, Relazioni: 52, Ruolo: 52, Cambiamento: 50 },
              { name: "Lavoro decentrato", Domanda: 48, Controllo: 47, "Supporto Management": 48, "Supporto Colleghi": 51, Relazioni: 49, Ruolo: 51, Cambiamento: 47 },
          ]
      }
    };
    return baseData;
  }, [slcGroupFilter]);

  const surveyHistory = [
    { name: "Blue WellBe Survey - 2025 Q1", count: 15, bwi: "69,80", date: "28/02/2025" },
    { name: "Blue WellBe Survey - 2025 Q1", count: 14, bwi: "70,69", date: "19/03/2025" },
    { name: "Blue WellBe Survey - 2025 Q1", count: 105, bwi: "75,35", date: "19/03/2025" },
    { name: "Blue WellBe Survey - 2025 Q3", count: 14, bwi: "79,55", date: "05/09/2025" },
  ]

  const metricsConfig = {
    Colleghi: { label: "Colleghi", color: "hsl(142, 71%, 45%)" },
    Appartenenza: { label: "Appartenenza", color: "hsl(199, 89%, 48%)" },
    Coinvolgimento: { label: "Coinvolgimento", color: "hsl(271, 91%, 65%)" },
    "Work-life": { label: "Work-life", color: "hsl(31, 90%, 55%)" },
    Leadership: { label: "Leadership", color: "hsl(346, 84%, 61%)" },
    Soddisfazione: { label: "Soddisfazione", color: "hsl(175, 77%, 42%)" },
    Tecnologia: { label: "Tecnologia", color: "hsl(215, 25%, 35%)" },
    Sicurezza: { label: "Sicurezza", color: "hsl(43, 96%, 58%)" },
  } satisfies ChartConfig

  const slcMetricsConfig = {
    Domanda: { label: "Domanda", color: "hsl(142, 71%, 45%)" },
    Controllo: { label: "Controllo", color: "hsl(199, 89%, 48%)" },
    "Supporto Management": { label: "Supporto Management", color: "hsl(271, 91%, 65%)" },
    "Supporto Colleghi": { label: "Supporto Colleghi", color: "hsl(31, 90%, 55%)" },
    Relazioni: { label: "Relazioni", color: "hsl(346, 84%, 61%)" },
    Ruolo: { label: "Ruolo", color: "hsl(175, 77%, 42%)" },
    Cambiamento: { label: "Cambiamento", color: "hsl(43, 96%, 58%)" },
  } satisfies ChartConfig

  const slcTrendData = [
    { name: "Gen", Domanda: 42, Controllo: 48, "Supporto Management": 45, "Supporto Colleghi": 52, Relazioni: 49, Ruolo: 50, Cambiamento: 43 },
    { name: "Feb", Domanda: 44, Controllo: 46, "Supporto Management": 47, "Supporto Colleghi": 50, Relazioni: 51, Ruolo: 52, Cambiamento: 45 },
    { name: "Mar", Domanda: 46, Controllo: 44, "Supporto Management": 49, "Supporto Colleghi": 48, Relazioni: 53, Ruolo: 54, Cambiamento: 47 },
    { name: "Apr", Domanda: 45, Controllo: 45, "Supporto Management": 48, "Supporto Colleghi": 49, Relazioni: 52, Ruolo: 53, Cambiamento: 46 },
    { name: "Mag", Domanda: 47, Controllo: 47, "Supporto Management": 50, "Supporto Colleghi": 51, Relazioni: 54, Ruolo: 55, Cambiamento: 48 },
    { name: "Giu", Domanda: 48, Controllo: 49, "Supporto Management": 51, "Supporto Colleghi": 53, Relazioni: 56, Ruolo: 57, Cambiamento: 50 },
  ]

  const radarConfig = {
    score: {
      label: "Punteggio",
      color: "#2563eb",
    },
  } satisfies ChartConfig

  const demographicData = [
    { name: "Engineering", value: 35, color: "#3b82f6" },
    { name: "Marketing", value: 20, color: "#8b5cf6" },
    { name: "Sales", value: 25, color: "#f43f5e" },
    { name: "HR", value: 10, color: "#10b981" },
    { name: "Product", value: 10, color: "#f59e0b" },
  ]

  const topArea = wellbeingRadarData.reduce((prev, current) => (prev.score > current.score) ? prev : current);
  const flopArea = wellbeingRadarData.reduce((prev, current) => (prev.score < current.score) ? prev : current);

  const kpiData = [
    { 
        title: "Blue Wellbeing Index", 
        value: "76/100", 
        trend: "+4%", 
        trendUp: true, 
        icon: Brain, 
        isSpecial: true 
    },
    { 
        title: "Numero compilazioni", 
        value: "145/200", 
        trend: "+12%", 
        trendUp: true, 
        icon: Users, 
        color: "text-emerald-600", 
        bg: "bg-emerald-100" 
    },
    { 
        title: "Crescita", 
        value: "+8%", 
        trend: "+2%", 
        trendUp: true, 
        icon: TrendingUp, 
        color: "text-purple-600", 
        bg: "bg-purple-100" 
    },
    { 
        title: "Top", 
        subtitle: topArea.area,
        value: `${topArea.score}/6`, 
        trend: "Best Area", 
        trendUp: true, 
        icon: Heart, 
        color: "text-pink-600", 
        bg: "bg-pink-100" 
    },
    { 
        title: "Flop", 
        subtitle: flopArea.area,
        value: `${flopArea.score}/6`, 
        trend: "Critical Area", 
        trendUp: false, 
        icon: AlertTriangle, 
        color: "text-amber-600", 
        bg: "bg-amber-100" 
    },
  ]

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <SurveyParamReader surveys={surveys} onSelect={setSelectedSurveyId} />
      </Suspense>
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
         <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Valutazione approfondita</h1>
            <p className="text-slate-500">Analisi dettagliata delle metriche di stress lavoro correlato.</p>
         </div>
         <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                Jan - Jun 2024
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
            </Button>
            <Button variant="ghost" size="icon">
                <RefreshCcw className="h-4 w-4" />
            </Button>
            <Button 
                size="sm" 
                variant="outline"
                className="gap-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                onClick={() => setIsReportDialogOpen(true)}
            >
                <Files className="h-4 w-4" />
                Report PDF
            </Button>
            <Button size="sm" className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
                <Download className="h-4 w-4" />
                Export
            </Button>
         </div>
      </div>

      <div id="wellbeing-report-content" className="space-y-6">
      {/* Survey Selector */}
      <Card className="border-slate-200 shadow-sm overflow-hidden bg-white mb-6">
        <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full border border-slate-200 flex items-center justify-center bg-slate-50 shrink-0">
                    <Files className="h-5 w-5 text-slate-500" />
                </div>
                <div className="space-y-1">
                    <h2 className="text-lg font-bold text-slate-900 leading-tight">
                        {selectedSurvey.title}
                    </h2>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-bold h-5 px-2">
                            {selectedSurvey.status}
                        </Badge>
                        <span className="text-xs text-slate-500 font-medium">
                            {selectedSurvey.date}
                        </span>
                    </div>
                </div>
            </div>
            
            <Select value={selectedSurveyId} onValueChange={setSelectedSurveyId}>
                <SelectTrigger className="w-10 h-10 p-0 rounded-full border-slate-200 bg-white hover:bg-slate-50 transition-colors flex items-center justify-center shrink-0 no-pdf">
                    <div className="sr-only">
                        <SelectValue placeholder="Select Survey" />
                    </div>
                </SelectTrigger>
                <SelectContent align="end">
                    {surveys.map((survey) => (
                        <SelectItem key={survey.id} value={survey.id}>
                            {survey.title}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </CardContent>
      </Card>

      {/* ===== SLC Results View ===== */}
      {selectedSurvey.type === "slc" && (
        <div className="space-y-6">

          {/* SLC KPI cards */}
          {(() => {
            const completedAssessments = slcAssessments.filter(a => a.fase2.status === "completata");
            const activeAssessments = slcGroupFilter === "all" ? completedAssessments : slcAssessments.filter(a => a.id === slcGroupFilter);
            
            const slcRadarData = DIMENSION_DEFS.map(dim => {
              let points = 0;
              let count = 0;
              
              activeAssessments.forEach(a => {
                const dimScore = a.fase2.dimensioni.find(d => d.nome === dim.nome);
                if (dimScore) {
                  // Invert relative to risk if necessary, or use as is
                  // For these charts, usually 100 = optimal wellbeing, but fase2.dimensioni score is usually risk
                  // Let's normalize it to a 1-5 or min-max range for points
                  const riskPercentage = dimScore.score;
                  const wellbeingPercentage = 100 - riskPercentage;
                  points += dim.minScore + (wellbeingPercentage / 100) * (dim.maxScore - dim.minScore);
                  count++;
                }
              });

              if (count === 0) {
                // Return seeded mock data if no real data found for this group
                const seed = slcGroupFilter === "all" ? 5 : parseInt(slcGroupFilter.split('-')[1]) || 5;
                const pseudoRandom = ((seed * (DIMENSION_DEFS.indexOf(dim) + 1)) % 100) / 100;
                const range = dim.maxScore - dim.minScore;
                points = dim.minScore + (0.4 + pseudoRandom * 0.4) * range;
              } else {
                points = points / count;
              }

              const score = Math.round(((points - dim.minScore) / (dim.maxScore - dim.minScore)) * 100);
              return { 
                area: dim.nome, 
                score: score, 
                points: Math.round(points), 
                maxPoints: dim.maxScore 
              };
            });
            const slcTotalPoints = slcRadarData.reduce((acc, curr) => acc + curr.points, 0);

            const integrativeRadarData = INTEGRATIVE_DIMENSION_DEFS.map((dim, idx) => {
              const seed = slcGroupFilter === "all" ? 12 : (parseInt(slcGroupFilter.split('-')[1]) || 12);
              const pseudoRandom = ((seed * (idx + 13)) % 100) / 100;
              const range = dim.maxScore - dim.minScore;
              const points = dim.minScore + (0.3 + pseudoRandom * 0.5) * range;
              const score = Math.round(((points - dim.minScore) / (dim.maxScore - dim.minScore)) * 100);
              return {
                area: dim.nome,
                shortName: dim.shortName,
                score: score, // This is 0-100 percentage
                points: Math.round(points), // This is total points
                maxPoints: dim.maxScore
              };
            });

            const integrativeOverallScore = (integrativeRadarData.reduce((acc, curr) => acc + (curr.points / (curr.maxPoints / 5)), 0) / integrativeRadarData.length).toFixed(1);
            const integrativeOverallStatus = (() => {
               const numScore = parseFloat(integrativeOverallScore);
               if (numScore >= 4.0) return { label: "Eccellente", color: "bg-indigo-100 text-indigo-700" };
               if (numScore >= 3.0) return { label: "Buono", color: "bg-blue-100 text-blue-700" };
               if (numScore >= 2.0) return { label: "Moderato", color: "bg-amber-100 text-amber-700" };
               return { label: "Critico", color: "bg-rose-100 text-rose-700" };
            })();

            const getSlcStatus = (score: number) => {
              if (score >= 80) return { label: "Ottimale", color: "bg-emerald-100 text-emerald-700" };
              if (score >= 60) return { label: "Buono", color: "bg-blue-100 text-blue-700" };
              if (score >= 40) return { label: "Basso", color: "bg-yellow-100 text-yellow-700" };
              return { label: "Critico", color: "bg-red-100 text-red-700" };
            };

            return <>
                {/* Single KPI Container Card */}
                <Card className={cn("border-slate-200 shadow-sm overflow-hidden bg-white mb-6 break-inside-avoid", !reportConfig.kpis && !reportConfig.radar && "hidden no-pdf")}>
                  <div className="bg-slate-50 border-b border-slate-100 px-6 py-3 flex items-center justify-between no-pdf">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-slate-400" />
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Filtra Risultati Dashboard</span>
                    </div>
                    <Select value={slcGroupFilter} onValueChange={setSlcGroupFilter}>
                      <SelectTrigger className="w-[250px] h-9 text-xs bg-white border-slate-200 shadow-sm">
                        <SelectValue placeholder="Tutti i gruppi omogenei" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tutti i gruppi omogenei</SelectItem>
                        {slcAssessments.map(a => (
                          <SelectItem key={a.id} value={a.id}>{a.setup.nomeGruppoOmogeneo}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row">
                      {/* Left Column: Totals & ISLC */}
                      <div className={cn("w-full lg:w-1/3 p-6 bg-slate-50/50 lg:border-r border-slate-100 flex flex-col justify-center gap-8", !reportConfig.kpis && "hidden no-pdf")}>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                             <Users className="h-3 w-3" /> Risposte totali
                          </p>
                          <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-black text-slate-900 tracking-tight">
                              {slcGroupFilter === "all" 
                                ? slcAssessments.reduce((acc, a) => acc + (a.fase2?.numPartecipanti || 0), 0)
                                : slcAssessments.find(a => a.id === slcGroupFilter)?.fase2?.numPartecipanti || 0
                              }
                            </span>
                          </div>
                        </div>

                        {(() => {
                           const totalPercentage = Math.round((slcTotalPoints / 175) * 100);
                           const status = getSlcStatus(totalPercentage);
                           // Map bg-color-100 to solid color-600
                           const solidColor = status.color.includes('emerald') ? 'bg-emerald-600' : 
                                              status.color.includes('blue')    ? 'bg-blue-600' :
                                              status.color.includes('yellow')  ? 'bg-amber-500' : 'bg-red-600';
                           
                           return (
                             <div className={`${solidColor} p-5 rounded-2xl shadow-lg relative overflow-hidden group`}>
                               <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                                 <Brain className="h-16 w-16 text-white" />
                               </div>
                               <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mb-1 relative z-10">
                                 Indice Stress Lavoro Correlato
                               </p>
                               <div className="flex items-baseline gap-1 text-white relative z-10">
                                 <span className="text-4xl font-black">{slcTotalPoints}</span>
                                 <span className="text-sm font-bold opacity-60">/ 175</span>
                               </div>
                               <div className="mt-3 relative z-10">
                                 <Badge className="bg-white/20 hover:bg-white/30 text-white border-none text-[10px] font-bold backdrop-blur-md px-3">
                                   Stato: {status.label}
                                 </Badge>
                               </div>
                             </div>
                           );
                        })()}
                      </div>

                      {/* Right Area: Dimension Grid */}
                      <div className={cn("flex-1 p-6 flex flex-col justify-center", !reportConfig.radar && "hidden no-pdf")}>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                          {slcRadarData.map((d) => {
                            const status = getSlcStatus(d.score);
                            return (
                              <div key={d.area} className="group p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-violet-200 hover:shadow-md transition-all duration-300">
                                <div className="flex items-center justify-between gap-2 mb-2">
                                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tight truncate">{d.area}</p>
                                  <Badge className={`${status.color} border-none text-[7px] font-bold uppercase h-3.5 px-1.5`}>
                                    {status.label}
                                  </Badge>
                                </div>
                                <div className="flex items-baseline gap-1">
                                  <span className="text-xl font-black text-slate-900 leading-none">{d.points}</span>
                                  <span className="text-[9px] font-bold text-slate-400">/ {d.maxPoints}</span>
                                </div>
                              </div>
                            );
                          })}
                          
                          {/* Integrative Dimension Badge */}
                          <div className="group p-3 rounded-xl bg-indigo-50/30 border border-indigo-100 hover:bg-white hover:border-indigo-300 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <p className="text-[8.5px] font-black text-indigo-600 uppercase tracking-tight truncate">Remote Work & Tech</p>
                              <Badge className={`${integrativeOverallStatus.color} border-none text-[7px] font-bold uppercase h-3.5 px-1.5`}>
                                {integrativeOverallStatus.label}
                              </Badge>
                            </div>
                            <div className="flex items-baseline gap-1">
                              <span className="text-xl font-black text-indigo-700 leading-none">{integrativeOverallScore}</span>
                              <span className="text-[9px] font-bold text-indigo-300">/ 5.0</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Question Detail (Swapped Order) */}
                <Card className={cn("border-slate-200 shadow-sm mt-8 break-inside-avoid", !reportConfig.slcQuestions && "hidden no-pdf")}>
                  <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
                    <div className="space-y-1">
                      <CardTitle className="text-base font-bold text-slate-900">Dettaglio Domande per Dimensione</CardTitle>
                      <CardDescription className="text-xs text-slate-500">Analisi granulare dei risultati per ogni item del questionario</CardDescription>
                    </div>
                    
                    <div className={cn("flex items-center gap-3", (isGeneratingPDF || isPreviewing) && "hidden no-pdf")}>
                      <Select 
                        value={attentionArea === "Colleghi" ? "Domanda" : attentionArea} 
                        onValueChange={(v) => setAttentionArea(v)}
                      >
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue placeholder="Scegli Dimensione" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(slcMetricsConfig).map((dim) => (
                            <SelectItem key={dim} value={dim}>{dim}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {/* Real Questions based on selected dimension */}
                      {(() => {
                        const dimsToRender = (isGeneratingPDF || isPreviewing) 
                            ? pdfFilterConfig.selectedDimensions 
                            : [attentionArea === "Colleghi" ? "Domanda" : attentionArea];

                        if (dimsToRender.length === 0) return null;

                        return (
                          <div className="space-y-12">
                            {dimsToRender.map((selectedDimName, dimIdx) => {
                              const dimDef = DIMENSION_DEFS.find(d => d.nome === selectedDimName);
                              const filteredQuestions = PERCEPTION_QUESTIONS.filter(q => q.dimensione === selectedDimName);
                              const showBreakdown = slcDimensionAnalysis !== 'general';
                              
                              const seed = slcGroupFilter === "all" ? 10 : (parseInt(slcGroupFilter.split('-')[1]) || 10);
                              const questionPoints = filteredQuestions.map((q, idx) => {
                                const qSeed = (seed + parseInt(q.id)) * 13;
                                return 2 + ((qSeed % 30) / 10);
                              });
                              const qScoreData = slcRadarData.find(d => d.area === selectedDimName);
                              const totalDimPoints = qScoreData ? qScoreData.points : 0;

                              const gridCols = showBreakdown 
                                ? "grid-cols-[60px_1fr_100px_100px_280px]" 
                                : "grid-cols-[60px_1fr_100px_100px]";

                              return (
                                <div key={selectedDimName} className={cn("break-inside-avoid shadow-none", dimIdx > 0 && "mt-12")}>
                                  <div className="bg-violet-50/50 p-4 rounded-xl border border-violet-100 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-violet-100 flex items-center justify-center border border-violet-200">
                                  <Brain className="h-6 w-6 text-violet-600" />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <p className="text-[10px] font-bold text-violet-600 uppercase tracking-widest leading-none">Dimensione Selezionata</p>
                                    {(() => {
                                      const d = slcRadarData.find(item => item.area === selectedDimName);
                                      if (!d) return null;
                                      const status = getSlcStatus(d.score);
                                      return (
                                        <Badge className={`${status.color} border-none text-[8px] font-bold uppercase h-3.5 px-1.5`}>
                                          {status.label}
                                        </Badge>
                                      );
                                    })()}
                                  </div>
                                  <h3 className="text-xl font-black text-violet-900 leading-none">{selectedDimName}</h3>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-6">
                                <div className="text-right border-violet-200">
                                  <p className="text-[10px] text-violet-500 font-bold uppercase tracking-tight">Punteggio Totale</p>
                                  <p className="text-2xl font-black text-violet-700">{totalDimPoints} <span className="text-xs font-medium text-violet-400">/ {dimDef?.maxScore || '--'} pts</span></p>
                                </div>
                              </div>
                            </div>

                             <div className="border border-slate-100 rounded-xl overflow-hidden bg-white">
                              <div className={`grid ${gridCols} bg-slate-50 border-b border-slate-200 py-3 px-4 mt-0`}>
                                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID</div>
                                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">Domanda</div>
                                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Punteggio</div>
                                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center w-[100px]">Stato</div>
                                 {showBreakdown && (
                                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Breakdown {(slcDemographicAnalysis as any)[slcDimensionAnalysis]?.label}</div>
                                 )}
                              </div>

                              <div className="divide-y divide-slate-100">
                                {filteredQuestions.map((q, qIdx) => {
                                  const qScore = questionPoints[qIdx];
                                  const qPercentage = ((qScore - 1) / 4) * 100;
                                  const currentDemo = (slcDemographicAnalysis as any)[slcDimensionAnalysis];
                                  const breakdownData = currentDemo.performance.map((p: any) => ({
                                    name: p.name,
                                    score: 1 + Math.random() * 4
                                  }));

                                  return (
                                    <div key={q.id} className={`grid ${gridCols} items-center py-4 px-4 hover:bg-slate-50/50 transition-colors group`}>
                                      <div className="text-xs font-bold text-slate-400">Q{q.id}</div>
                                      <div className="pr-4 text-sm text-slate-600 font-medium leading-tight group-hover:text-slate-900 line-clamp-2">
                                        {q.testo}
                                      </div>
                                      <div className="flex flex-col items-center gap-1.5 px-4">
                                        <div className="flex items-baseline gap-1">
                                          <span className="text-base font-black text-violet-700">{qScore.toFixed(1)}</span>
                                          <span className="text-[8px] font-bold text-slate-400 uppercase">/5</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                                          <div 
                                            className="h-full bg-violet-500 rounded-full" 
                                            style={{ width: `${qPercentage}%` }} 
                                          />
                                        </div>
                                      </div>
                                      <div className="flex justify-center w-[100px]">
                                        {(() => {
                                          let status = { label: "Critico", color: "bg-red-100 text-red-700" };
                                          if (qScore >= 4.0) status = { label: "Ottimo", color: "bg-emerald-100 text-emerald-700" };
                                          else if (qScore >= 3.0) status = { label: "Buono", color: "bg-blue-100 text-blue-700" };
                                          else if (qScore >= 2.0) status = { label: "Scarso", color: "bg-yellow-100 text-yellow-700" };
                                          
                                          return (
                                            <Badge className={`${status.color} border-none text-[9px] font-bold uppercase h-5 w-full justify-center`}>
                                              {status.label}
                                            </Badge>
                                          );
                                        })()}
                                      </div>
                                      {showBreakdown && (
                                        <div className="h-[50px] w-full">
                                          <ResponsiveContainer width="100%" height="100%">
                                            <BarChart 
                                              data={breakdownData} 
                                              margin={{ top: 15, right: 40, left: 40, bottom: 0 }}
                                            >
                                              <YAxis domain={[1, 6]} hide />
                                              <Bar dataKey="score" radius={[2, 2, 0, 0]} barSize={16}>
                                                {breakdownData.map((entry: any, index: number) => (
                                                  <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={currentDemo.distribution[index]?.color || '#8b5cf6'} 
                                                  />
                                                ))}
                                                <LabelList 
                                                  dataKey="score" 
                                                  position="top" 
                                                  offset={4}
                                                  fill="#64748b" 
                                                  fontSize={7} 
                                                  fontWeight="bold"
                                                  formatter={(val: number) => val.toFixed(1)}
                                                />
                                              </Bar>
                                            </BarChart>
                                          </ResponsiveContainer>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                              
                              {/* Table Footer with Centered Legend under Breakdown column */}
                              {showBreakdown && (
                                <div className={`bg-slate-50/50 border-t border-slate-100 py-3 px-4 grid ${gridCols}`}>
                                    <div className="col-start-5 flex flex-wrap gap-x-4 gap-y-1 justify-center align-middle">
                                      {(slcDemographicAnalysis as any)[slcDimensionAnalysis]?.distribution.map((entry: any, idx: number) => (
                                        <div key={idx} className="flex items-center gap-1.5">
                                          <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                          <span className="text-[7px] font-bold text-slate-500 uppercase tracking-tighter">{entry.name}</span>
                                        </div>
                                      ))}
                                    </div>
                                </div>
                              )}
                            </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  </CardContent>
                </Card>

                {/* Demographic Analysis (Swapped Order) */}
                <Card className={cn("border-slate-200 shadow-sm mt-8 break-inside-avoid", !reportConfig.demographics && "hidden no-pdf")}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle className="text-lg">Analisi per Dato Anagrafico</CardTitle>
                      <CardDescription>Confronto delle aree SLC tra diversi gruppi</CardDescription>
                    </div>
                    <Select value={slcDimensionAnalysis} onValueChange={setSlcDimensionAnalysis}>
                      <SelectTrigger className="w-[180px] h-8 text-xs no-pdf">
                        <SelectValue placeholder="Seleziona dimensione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">Generale</SelectItem>
                        <SelectItem value="gender">Genere</SelectItem>
                        <SelectItem value="age_range">Età</SelectItem>
                        <SelectItem value="nationality">Nazionalità</SelectItem>
                        <SelectItem value="contract_type">Tipologia contrattuale</SelectItem>
                        <SelectItem value="working_time">Tipologia orario di lavoro</SelectItem>
                        <SelectItem value="remote_work">Lavoro da remoto</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className={`grid gap-8 ${slcDimensionAnalysis === 'general' ? 'grid-cols-1' : 'md:grid-cols-5'}`}>
                    {/* Distribution - Hidden if General */}
                    {slcDimensionAnalysis !== 'general' && (
                      <div className="md:col-span-2 space-y-4 text-center md:text-left">
                        <h4 className="text-sm font-semibold text-slate-900 border-l-4 border-blue-500 pl-3">Distribuzione partecipanti</h4>
                        <div className="h-[220px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={(slcDemographicAnalysis as any)[slcDimensionAnalysis]?.distribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={85}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {(slcDemographicAnalysis as any)[slcDimensionAnalysis]?.distribution.map((entry: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                          {(slcDemographicAnalysis as any)[slcDimensionAnalysis]?.distribution.map((entry: any) => (
                            <div key={entry.name} className="flex items-center gap-1.5">
                              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              <span className="text-[10px] font-medium text-slate-500">{entry.name} ({entry.value}%)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Performance by Category - Grouped Bar Chart */}
                    <div className={`${slcDimensionAnalysis === 'general' ? 'col-span-1' : 'md:col-span-3'} space-y-4`}>
                      <h4 className="text-sm font-semibold text-slate-900 border-l-4 border-violet-500 pl-3">
                        {slcDimensionAnalysis === 'general' ? 'Punteggi Medi Generali' : 'Dettaglio Punteggi per Dimensione'}
                      </h4>
                      <div className="h-[300px] w-full pt-2">
                        {(() => {
                          const analysisData = (slcDemographicAnalysis as any)[slcDimensionAnalysis];
                          const categories = analysisData.categories;
                          const performance = analysisData.performance;
                          
                          // Transform data: we want one entry per dimension, with categories as keys
                          const chartData = DIMENSION_DEFS.map(dim => {
                            const entry: any = { name: dim.nome, max: dim.maxScore };
                            performance.forEach((p: any) => {
                              const percentage = p[dim.nome] || 50;
                              const points = dim.minScore + (percentage / 100) * (dim.maxScore - dim.minScore);
                              entry[p.name] = parseFloat(points.toFixed(1));
                            });
                            return entry;
                          });

                          return (
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-100" />
                                <XAxis 
                                  dataKey="name" 
                                  axisLine={false} 
                                  tickLine={false} 
                                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
                                />
                                <YAxis 
                                  axisLine={false} 
                                  tickLine={false} 
                                  tick={{ fill: '#64748b', fontSize: 10 }}
                                />
                                <Tooltip 
                                  cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }}
                                  content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                      const dim = DIMENSION_DEFS.find(d => d.nome === label);
                                      return (
                                        <div className="bg-white p-3 shadow-xl border border-slate-100 rounded-lg text-xs space-y-2">
                                          <p className="font-bold text-slate-900 border-b pb-1">{label}</p>
                                          <div className="space-y-1">
                                            {payload.map((entry: any, idx: number) => (
                                              <div key={idx} className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-1.5">
                                                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                                  <span className="text-slate-600">{entry.name}:</span>
                                                </div>
                                                <span className="font-bold text-slate-900">{entry.value} / {dim?.maxScore}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                                {categories.map((cat: string, index: number) => (
                                  <Bar 
                                    key={cat} 
                                    dataKey={cat} 
                                    fill={analysisData.distribution.find((d: any) => d.name === cat)?.color || `hsl(262, ${80 - index * 10}%, ${60 + index * 5}%)`} 
                                    radius={[4, 4, 0, 0]}
                                    barSize={categories.length > 3 ? 15 : 40}
                                  >
                                    <LabelList 
                                      dataKey={cat} 
                                      position="insideTop" 
                                      offset={8}
                                      fill="white" 
                                      fontSize={9} 
                                      fontWeight="bold"
                                      formatter={(val: number) => val.toFixed(1)}
                                    />
                                  </Bar>
                                ))}
                              </BarChart>
                            </ResponsiveContainer>
                          );
                        })()}
                      </div>
                      {slcDimensionAnalysis !== 'general' && (
                        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
                          {(slcDemographicAnalysis as any)[slcDimensionAnalysis]?.distribution.map((entry: any) => (
                            <div key={entry.name} className="flex items-center gap-1.5">
                              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{entry.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
              </CardContent>
            </Card>

            {/* NEW: Dimensioni Integrative Card */}
            <Card className={cn("border-indigo-200 shadow-sm mt-8 border-l-8 border-l-indigo-500 overflow-hidden break-inside-avoid", !reportConfig.slcIntegrative && "hidden no-pdf")}>
              <CardHeader className="bg-indigo-50/50 border-b border-indigo-100 flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-indigo-100/80 shadow-inner">
                        <Activity className="h-6 w-6 text-indigo-700" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-black text-indigo-900 tracking-tight text-indigo-950">Dimensioni integrative per il lavoro da remoto e innovazione tecnologica</CardTitle>
                        <CardDescription className="text-indigo-600/80 font-medium">Analisi trasversale dei nuovi paradigmi lavorativi digitali</CardDescription>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2 pr-4">
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-indigo-700 tracking-tighter leading-none">{integrativeOverallScore}</span>
                        <span className="text-xs font-bold text-indigo-300">/ 5.0</span>
                    </div>
                    <Badge className={`${integrativeOverallStatus.color} border-none text-[8px] font-black uppercase h-4 px-2 tracking-widest`}>
                        {integrativeOverallStatus.label}
                    </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left: Radar Chart */}
                    <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50/50 rounded-3xl border border-slate-100 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
                        <h4 className="text-xs font-black text-indigo-900 uppercase tracking-[0.2em] mb-8 bg-indigo-100/50 px-4 py-1.5 rounded-full">Radar delle Sottodimensioni</h4>
                        <div className="w-full h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                   <ChartRadarLinesOnly 
                                      data={integrativeRadarData.map(d => ({ area: d.shortName, score: (d.points / (d.maxPoints / 5)).toFixed(1) }))} 
                                      config={{
                                        score: { label: "Punteggio", color: "#6366f1" }
                                      }}
                                      showScoreInLabels={true}
                                      domain={[1, 5]}
                                   />
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Right: Detailed Table */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="border border-indigo-100 rounded-3xl overflow-hidden shadow-sm bg-white">
                            <div className="grid grid-cols-[1fr_80px_100px] bg-indigo-50/30 border-b border-indigo-100 py-4 px-6">
                                <div className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Sottodimensione / Item</div>
                                <div className="text-[10px] font-black text-indigo-900 uppercase tracking-widest text-center">Score</div>
                                <div className="text-[10px] font-black text-indigo-900 uppercase tracking-widest text-center">Stato</div>
                            </div>
                            <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto custom-scrollbar">
                                {INTEGRATIVE_DIMENSION_DEFS.map((dim) => {
                                    const dimData = integrativeRadarData.find(d => d.area === dim.nome);
                                    const dimQuestions = INTEGRATIVE_QUESTIONS.filter(q => q.dimensione === dim.shortName);
                                    const score = dimData?.score || 0;
                                    let status = { label: "Critico", color: "bg-rose-100 text-rose-700" };
                                    if (score >= 80) status = { label: "Ottimo", color: "bg-emerald-100 text-emerald-700" };
                                    else if (score >= 60) status = { label: "Buono", color: "bg-blue-100 text-blue-700" };
                                    else if (score >= 40) status = { label: "Scarso", color: "bg-amber-100 text-amber-700" };

                                    return (
                                        <div key={dim.nome} className="group">
                                            {/* Dimension Header Row */}
                                            <div className="grid grid-cols-[1fr_80px_100px] items-center py-4 px-6 bg-indigo-50/10 group-hover:bg-indigo-50/30 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-2 w-2 rounded-full bg-indigo-400" />
                                                    <span className="text-sm font-black text-indigo-900">{dim.nome}</span>
                                                </div>
                                                <div className="text-center">
                                                    <span className="text-sm font-black text-indigo-700">{(dimData?.points ? (dimData.points / (dimData.maxPoints / 5)).toFixed(1) : "0.0")}</span>
                                                </div>
                                                <div className="flex justify-center">
                                                    <Badge className={`${status.color} border-none text-[8px] font-black uppercase h-4 w-full justify-center`}>
                                                        {status.label}
                                                    </Badge>
                                                </div>
                                            </div>
                                            {/* Item Rows */}
                                            <div className="bg-white/50 divide-y divide-slate-50/50">
                                                {dimQuestions.map((q) => (
                                                    <div key={q.id} className="grid grid-cols-[1fr_80px] items-center py-3 pl-12 pr-6 hover:bg-slate-50/30 transition-colors">
                                                        <div className="flex items-start gap-3">
                                                            <span className="text-[10px] font-bold text-slate-300 mt-0.5">#{q.id}</span>
                                                            <span className="text-xs text-slate-500 font-medium leading-tight">{q.testo}</span>
                                                        </div>
                                                        <div className="flex justify-end pr-8">
                                                            <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                                                                <div 
                                                                    className="h-full bg-indigo-400 rounded-full" 
                                                                    style={{ width: `${30 + Math.random() * 60}%` }} 
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
              </CardContent>
            </Card>

          {/* Raw data / Single group view if filtered */}
          {slcGroupFilter !== "all" && (
            <Card className="border-violet-200 bg-violet-50/20 shadow-sm border-dashed">
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-violet-100">
                      <FileText className="h-6 w-6 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Dettaglio Gruppo: {slcAssessments.find(a => a.id === slcGroupFilter)?.setup.nomeGruppoOmogeneo}</h3>
                      <p className="text-sm text-slate-500">Puoi visualizzare il report completo e le azioni correttive per questo specifico gruppo.</p>
                    </div>
                  </div>
                  <Button 
                    className="bg-violet-600 hover:bg-violet-700"
                    onClick={() => router.push(`/dashboard_azienda/slc/${slcGroupFilter}/fase-1`)}
                  >
                    Vedi Analisi Completa
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assessment groups list (moved to bottom) */}
          <Card className={cn("border-slate-200 shadow-sm break-inside-avoid", !reportConfig.slcGroups && "hidden no-pdf")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Brain className="h-4 w-4 text-violet-600" />
                  Elenco Gruppi Omogenei
                </CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-2 text-violet-600 border-violet-200 hover:bg-violet-50 text-xs"
                onClick={() => router.push("/dashboard_azienda/slc")}
              >
                Gestisci tutti <ChevronRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {slcAssessments.map((a) => {
                  const rischioColor =
                    a.scores.rischioFase1 === "alto"
                      ? "bg-red-100 text-red-800"
                      : a.scores.rischioFase1 === "medio"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  const rischioLabel =
                    a.scores.rischioFase1.charAt(0).toUpperCase() + a.scores.rischioFase1.slice(1)
                  return (
                    <div
                      key={a.id}
                      className="flex items-center justify-between gap-4 p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/dashboard_azienda/slc/${a.id}/fase-1`)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-slate-900 truncate">
                          {a.setup.nomeGruppoOmogeneo || "Gruppo senza nome"}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {a.setup.numeroLavoratori != null ? `${a.setup.numeroLavoratori} lavoratori · ` : ""}
                          {a.setup.dataValutazione || "—"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Badge className={`${rischioColor} text-[10px] border-none font-medium h-5`}>{rischioLabel}</Badge>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  )
                })}
                </div>
              </CardContent>
            </Card>
          </>
        })()}
      </div>
    )}

      {/* ===== Coming-soon placeholder for other module types ===== */}
      {!["wellbeing", "slc"].includes(selectedSurvey.type) && (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="p-5 rounded-full bg-slate-100">
              <Files className="h-10 w-10 text-slate-400" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-semibold text-slate-900">Visualizzazione in arrivo</h3>
              <p className="text-sm text-slate-500 max-w-sm">
                L&apos;analisi dettagliata per il modulo{" "}
                <span className="font-medium text-slate-700">{selectedSurvey.title}</span> sarà disponibile
                prossimamente.
              </p>
            </div>
            <Badge variant="outline" className="text-slate-500 border-slate-200 bg-slate-50 uppercase tracking-wider text-[10px] font-bold">
              {selectedSurvey.type}
            </Badge>
          </CardContent>
        </Card>
      )}

      {/* ===== Wellbeing-specific content ===== */}
      {selectedSurvey.type === "wellbeing" && <>
      {/* Main Analysis Section */}
       <div id="wellbeing-section-kpi" className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-5 grid-pdf-3", !reportConfig.kpis && "hidden no-pdf")}>
          {kpiData.map((kpi) => (
              <Card key={kpi.title} className={`border-slate-200 shadow-sm ${kpi.isSpecial ? 'bg-blue-600 ring-2 ring-blue-600 ring-offset-2' : ''}`}>
                  <CardContent className="p-4 flex flex-col justify-between h-full space-y-2">
                     <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-lg ${kpi.isSpecial ? 'bg-blue-500/50' : kpi.bg}`}>
                            <kpi.icon className={`h-4 w-4 ${kpi.isSpecial ? 'text-white' : kpi.color}`} />
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          kpi.isSpecial 
                            ? 'bg-blue-400/30 text-white' 
                            : kpi.trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                            {kpi.trend}
                        </span>
                     </div>
                     <div>
                        <div className={`text-2xl font-bold ${kpi.isSpecial ? 'text-white' : 'text-slate-900'}`}>{kpi.value}</div>
                        <div className={`text-xs font-medium mt-1 ${kpi.isSpecial ? 'text-blue-100' : 'text-slate-500'}`}>
                          {kpi.title}
                          {kpi.subtitle && <span className="block opacity-80 text-[10px] uppercase tracking-wider">{kpi.subtitle}</span>}
                        </div>
                     </div>
                  </CardContent>
              </Card>
          ))}
       </div>

      <div id="wellbeing-section-radar" className={cn("grid gap-6 lg:grid-cols-1 grid-pdf", !reportConfig.radar && "hidden no-pdf")}>
         {/* Radar Wellbeing Areas */}
         <Card className="border-slate-200 shadow-sm flex flex-col relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="space-y-1">
                    <CardTitle>Wellbeing Radar</CardTitle>
                    <CardDescription>Punteggi da 1 a 6 per area.</CardDescription>
                </div>
                {/* Radar Legend (Inline small) */}
                <div className="flex flex-wrap gap-x-3 gap-y-1 max-w-[200px] justify-end text-[9px] font-bold text-slate-500">
                    {Object.entries(metricsConfig).map(([key, config]) => {
                        const abbr = key === "Coinvolgimento" ? "RCIC" : key === "Sicurezza" ? "CNL" : key === "Soddisfazione" ? "SDA" : key === "Leadership" ? "L" : key === "Appartenenza" ? "LEVP" : key === "Work-life" ? "S" : key === "Tecnologia" ? "T" : "SP";
                        return (
                            <div key={key} className="flex items-center gap-1">
                                <span className="text-slate-900">{abbr}:</span>
                                <span className="font-medium text-slate-400">{key}</span>
                            </div>
                        )
                    })}
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center min-h-[400px] w-full">
                <ChartRadarLinesOnly 
                    data={wellbeingRadarData.map(item => ({
                        ...item,
                        area: item.area === "Coinvolgimento" ? "RCIC" : item.area === "Sicurezza" ? "CNL" : item.area === "Soddisfazione" ? "SDA" : item.area === "Leadership" ? "L" : item.area === "Appartenenza" ? "LEVP" : item.area === "Work-life" ? "S" : item.area === "Tecnologia" ? "T" : "SP"
                    }))} 
                    config={radarConfig} 
                />
            </CardContent>
         </Card>

         {/* Overview Section */}
         <Card className="border-slate-200 shadow-sm overflow-hidden flex flex-col no-break">
            <CardHeader>
                <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed overflow-y-auto h-[400px] pr-2">
                    <p>
                        Il benessere lavorativo è un concetto multidimensionale che abbraccia la salute fisica, mentale e sociale dei dipendenti all'interno dell'organizzazione. I dati raccolti attraverso i radar di benessere offrono una fotografia istantanea ma dettagliata di come i collaboratori percepiscono il proprio ambiente di lavoro.
                    </p>
                    <p className="mt-4">
                        Questa visualizzazione permette di confrontare le aree di eccellenza con i potenziali punti di criticità, facilitando interventi mirati. L'analisi demografica sottostante permette di identificare pattern specifici per età, ruolo e altri parametri chiave.
                    </p>
                </div>
            </CardContent>
         </Card>
      </div>

       {/* Interactive Insights (Screen Only) */}
       <div id="wellbeing-section-insights" className={cn("grid gap-6 md:grid-cols-2 mt-6 grid-pdf no-pdf-block", !reportConfig.insights && "hidden no-pdf")}>
            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-purple-600" />
                        AI Insights
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-[10px] text-slate-400 italic pt-2">
                        La nostra AI ha riformulato i suggerimenti raccolti durante la compilazione per mantenere l'anonimato dei dipendenti
                    </p>
                    <div className="flex gap-3 items-start">
                        <div className="h-2 w-2 mt-2 rounded-full bg-blue-500 shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-slate-900">Demographic variation</p>
                            <p className="text-xs text-slate-500 mt-0.5">Analysis by {demographicAnalysis[selectedDimension].label} shows performance gaps in specific areas. Target these groups for improvement.</p>
                        </div>
                    </div>
                    
                </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            Attention Areas
                        </CardTitle>
                    </div>
                    <Select value={attentionArea} onValueChange={setAttentionArea}>
                        <SelectTrigger className="w-[140px] h-8 text-xs">
                            <SelectValue placeholder="Area" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(metricsConfig).map((area) => (
                                <SelectItem key={area} value={area} className="text-xs">
                                    {metricsConfig[area as keyof typeof metricsConfig].label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent className="space-y-3">
                    {(() => {
                        // Flatten all performance data from all dimensions
                        const allPerformance = Object.entries(demographicAnalysis).flatMap(([dimKey, dimData]) => 
                            dimData.performance.map(p => ({
                                ...p,
                                dimLabel: dimData.label
                            }))
                        );

                        return allPerformance
                            .sort((a: any, b: any) => (a[attentionArea] as number) - (b[attentionArea] as number))
                            .slice(0, 3)
                            .map((item: any, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 rounded-md bg-red-50 border border-red-100">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-red-500 uppercase tracking-wider">{item.dimLabel}</p>
                                        <p className="text-sm font-semibold text-red-700">{item.name}</p>
                                        <p className="text-[10px] text-red-600">Punteggio critico in {metricsConfig[attentionArea as keyof typeof metricsConfig].label}</p>
                                    </div>
                                    <span className="text-lg font-bold text-red-700">{(item[attentionArea] as number).toFixed(1)}/6</span>
                                </div>
                            ));
                    })()}
                </CardContent>
            </Card>
       </div>

        {/* PDF-Only Expanded Attention Areas */}
        <div className={cn("hidden pdf-visible space-y-8 mt-8", !reportConfig.insights && "no-pdf")}>
            <div className="page-break" />
            <h2 className="text-2xl font-bold text-slate-900 border-b pb-2 mb-6">Analisi Dettagliata per Area di Attenzione</h2>
            <div className="grid grid-cols-2 gap-6">
                {Object.keys(metricsConfig).map((area) => (
                    <Card key={area} className="border-slate-200 shadow-sm pdf-no-split">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                {metricsConfig[area as keyof typeof metricsConfig].label}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {(() => {
                                const allPerformance = Object.entries(demographicAnalysis).flatMap(([dimKey, dimData]) => 
                                    dimData.performance.map(p => ({
                                        ...p,
                                        dimLabel: dimData.label
                                    }))
                                );

                                return allPerformance
                                    .sort((a: any, b: any) => (a[area] as number) - (b[area] as number))
                                    .slice(0, 3)
                                    .map((item: any, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-2 rounded-md bg-red-50 border border-red-100">
                                            <div className="space-y-0.5">
                                                <p className="text-[9px] font-bold text-red-500 uppercase tracking-wider">{item.dimLabel}</p>
                                                <p className="text-xs font-semibold text-red-700">{item.name}</p>
                                            </div>
                                            <span className="text-sm font-bold text-red-700">{(item[area] as number).toFixed(1)}/6</span>
                                        </div>
                                    ));
                            })()}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>

       {/* Interactive Demographics (Screen Only) */}
       <div id="wellbeing-section-demographics" className={cn("grid gap-6 lg:grid-cols-3 mt-6 grid-pdf no-pdf-block", !reportConfig.demographics && "hidden no-pdf")}>
         {/* Demographic Distribution Card */}
         <Card className="lg:col-span-1 border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="space-y-1">
                    <CardTitle>Demographics</CardTitle>
                    <CardDescription>Distribution (%)</CardDescription>
                </div>
                <Select value={selectedDimension} onValueChange={(v) => setSelectedDimension(v as any)}>
                    <SelectTrigger className="w-[120px] h-8 text-xs">
                        <SelectValue placeholder="Scegli" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(demographicAnalysis).map(([key, dim]) => (
                            <SelectItem key={key} value={key} className="text-xs">
                                {dim.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
               <div className="h-[180px] w-full flex items-center justify-center">
                   <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie 
                             data={demographicAnalysis[selectedDimension].distribution} 
                             cx="50%" 
                             cy="50%" 
                             innerRadius={55} 
                             outerRadius={75} 
                             paddingAngle={5} 
                             dataKey="value"
                         >
                             {demographicAnalysis[selectedDimension].distribution.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={entry.color} />
                             ))}
                         </Pie>
                         <Tooltip />
                       </PieChart>
                   </ResponsiveContainer>
               </div>
                <div className="mt-4 space-y-1">
                     {demographicAnalysis[selectedDimension].distribution.map((item) => (
                          <div key={item.name} className="flex items-center justify-between text-[10px]">
                             <div className="flex items-center gap-2">
                                 <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                                 <span className="text-slate-600 truncate max-w-[100px]">{item.name}</span>
                             </div>
                             <span className="font-medium text-slate-900">{item.value}%</span>
                         </div>
                     ))}
                </div>
            </CardContent>
         </Card>

          {/* Wellbeing Areas - Demographic Performance (Widened) */}
          <Card className="lg:col-span-2 border-slate-200 shadow-sm">
             <CardHeader className="flex flex-col space-y-4 pb-2">
                 <div className="flex flex-row items-center justify-between w-full">
                    <CardTitle>Wellbeing Trends</CardTitle>
                    <CardDescription>Impatto {demographicAnalysis[selectedDimension].label} sulle aree del Wellbeing</CardDescription>
                    <div className="flex items-center gap-2 no-pdf">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 gap-2">
                                    <Activity className="h-4 w-4" />
                                    {selectedMetrics.length} Metriche
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0" align="end">
                                <Command>
                                    <CommandInput placeholder="Cerca area..." />
                                    <CommandList>
                                        <CommandEmpty>Nessuna area trovata.</CommandEmpty>
                                        <CommandGroup>
                                            {Object.keys(metricsConfig).map((metric) => (
                                                <CommandItem
                                                    key={metric}
                                                    onSelect={() => {
                                                        setSelectedMetrics(prev => 
                                                            prev.includes(metric) 
                                                            ? prev.filter(m => m !== metric)
                                                            : [...prev, metric]
                                                        )
                                                    }}
                                                >
                                                    <div className={cn(
                                                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                        selectedMetrics.includes(metric)
                                                            ? "bg-primary text-primary-foreground"
                                                            : "opacity-50 [&_svg]:invisible"
                                                    )}>
                                                        <Check className="h-4 w-4" />
                                                    </div>
                                                    <span className="flex-1">{metricsConfig[metric as keyof typeof metricsConfig].label}</span>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>

                        {/* Date Picker (Hidden or kept as per preference, image doesn't show it but good to have) */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    size="sm"
                                    className={cn(
                                        "h-8 justify-start text-left font-normal px-3",
                                        !dateRange && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dateRange?.from ? (
                                        dateRange.to ? (
                                            <>
                                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                                {format(dateRange.to, "LLL dd, y")}
                                            </>
                                        ) : (
                                            format(dateRange.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>Seleziona periodo</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={dateRange?.from}
                                    selected={dateRange}
                                    onSelect={setDateRange}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                 </div>
                 
                 {/* Legend Area like in the image */}
                 <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-bold text-slate-600">
                    {Object.entries(metricsConfig).map(([key, config]) => {
                        const isSelected = selectedMetrics.includes(key)
                        // Using abbreviations for legend as in image
                        const abbr = key === "Coinvolgimento" ? "RCIC" : key === "Sicurezza" ? "CNL" : key === "Soddisfazione" ? "SDA" : key === "Leadership" ? "L" : key === "Appartenenza" ? "LEVP" : key === "Work-life" ? "S" : key === "Tecnologia" ? "T" : "SP";
                        return (
                            <div key={key} className={cn("flex items-center gap-1", !isSelected && "opacity-30")}>
                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: config.color }} />
                                <span>{abbr}</span>
                            </div>
                        )
                    })}
                 </div>
             </CardHeader>
             <CardContent>
                <div className="h-[350px] w-full">
                    <ChartLineMultiple 
                        data={demographicAnalysis[selectedDimension].performance} 
                        config={metricsConfig} 
                        dataKeys={selectedMetrics} 
                    />
                </div>
             </CardContent>
          </Card>
      </div>

        {/* PDF-Only Expanded Demographics */}
        <div className={cn("hidden pdf-visible space-y-8 mt-8", !reportConfig.demographics && "no-pdf")}>
            <div className="page-break" />
            <h2 className="text-2xl font-bold text-slate-900 border-b pb-2 mb-6">Analisi Demografica Completa</h2>
            {Object.entries(demographicAnalysis).map(([dimKey, dimData]) => (
                <div key={dimKey} className="space-y-4 mb-8 pdf-no-split">
                    <h3 className="text-lg font-bold text-slate-800">{dimData.label}</h3>
                    <div className="grid grid-cols-3 gap-6">
                        <Card className="col-span-1 border-slate-200 shadow-sm">
                            <CardHeader className="py-3">
                                <CardTitle className="text-sm">Distribuzione %</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[150px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie 
                                                data={dimData.distribution} 
                                                cx="50%" cy="50%" innerRadius={40} outerRadius={60} 
                                                paddingAngle={5} dataKey="value"
                                            >
                                                {dimData.distribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-2 grid grid-cols-2 gap-1">
                                    {dimData.distribution.map((item) => (
                                        <div key={item.name} className="flex items-center justify-between text-[8px]">
                                            <div className="flex items-center gap-1">
                                                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                                                <span className="text-slate-600 truncate max-w-[60px]">{item.name}</span>
                                            </div>
                                            <span className="font-medium">{item.value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="col-span-2 border-slate-200 shadow-sm">
                            <CardHeader className="py-3">
                                <CardTitle className="text-sm">Trend Wellbeing</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[200px] w-full">
                                    <ChartLineMultiple 
                                        data={dimData.performance} 
                                        config={metricsConfig} 
                                        dataKeys={selectedMetrics} 
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ))}
        </div>
       
       <div id="wellbeing-section-history" className={cn(!reportConfig.history && "hidden no-pdf")}>
            <Card className="border-slate-200 shadow-sm mt-6">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800">Storico compilazioni</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="text-slate-400 font-medium border-b border-slate-50">
                                <th className="pb-4 pt-2 font-medium">Nome Survey</th>
                                <th className="pb-4 pt-2 font-medium text-right">Compilazioni</th>
                                <th className="pb-4 pt-2 font-medium text-center">BWI</th>
                                <th className="pb-4 pt-2 font-medium text-right">Data chiusura</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {surveyHistory.map((survey, i) => (
                                <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 text-slate-600">{survey.name}</td>
                                    <td className="py-4 text-slate-600 font-medium text-right">{survey.count}</td>
                                    <td className="py-4 text-center">
                                        <div className="inline-flex items-center justify-center px-6 py-1 border-2 border-[#1e40af] rounded-lg text-[#1e40af] font-bold bg-blue-50/30">
                                            {survey.bwi}
                                        </div>
                                    </td>
                                    <td className="py-4 text-slate-500 text-right">{survey.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
        </div>

        {/* Help Section */}
        <div className="mt-8 p-8 rounded-xl border border-blue-200 bg-blue-50/50 flex flex-col md:flex-row items-center justify-between gap-6 no-pdf">
            <div className="space-y-1">
                <h3 className="text-2xl font-bold text-blue-900">Hai bisogno di aiuto?</h3>
                <p className="text-slate-600">In chat, via mail o al telefono: siamo qui per te.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
                <Button variant="outline" className="h-20 w-24 flex flex-col gap-2 rounded-xl border-blue-100 bg-white hover:bg-blue-50 hover:text-blue-600 shadow-sm transition-all hover:scale-105 group">
                    <Phone className="h-6 w-6 text-blue-500 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Chiamaci</span>
                </Button>
                <Button variant="outline" className="h-20 w-24 flex flex-col gap-2 rounded-xl border-blue-100 bg-white hover:bg-blue-50 hover:text-blue-600 shadow-sm transition-all hover:scale-105 group">
                    <MessageCircle className="h-6 w-6 text-blue-500 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Chat</span>
                </Button>
                <Button variant="outline" className="h-20 w-24 flex flex-col gap-2 rounded-xl border-blue-100 bg-white hover:bg-blue-50 hover:text-blue-600 shadow-sm transition-all hover:scale-105 group">
                    <Mail className="h-6 w-6 text-blue-500 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Mail</span>
                </Button>
            </div>
        </div>

      </>}
      </div>

      {/* Hidden container to accumulate all PDF pages */}
      <div id="pdf-collection-container" className="hidden no-pdf" />
      
      {/* Report Customizer Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 overflow-hidden bg-slate-50">
           <DialogHeader className="p-6 bg-white border-b shrink-0">
             <div className="flex items-center justify-between">
               <div>
                  <DialogTitle className="text-xl font-bold text-slate-900">Personalizza Report PDF</DialogTitle>
                  <DialogDescription>Seleziona i blocchi da includere e verifica l'anteprima</DialogDescription>
               </div>
               <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={handlePreviewPDF} disabled={isPreviewing}>
                    {isPreviewing ? <RefreshCcw className="h-4 w-4 animate-spin mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                    Rigenera Anteprima
                  </Button>
                  <Button size="sm" onClick={handleDownloadPDF} disabled={isGeneratingPDF} className="bg-blue-600 hover:bg-blue-700">
                    {isGeneratingPDF ? <RefreshCcw className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                    Scarica PDF
                  </Button>
               </div>
             </div>
           </DialogHeader>
           
           <div className="flex-1 flex overflow-hidden">
              {/* Sidebar Configurator */}
              <div className="w-80 border-r bg-white p-5 space-y-5 overflow-y-auto shrink-0">
                {/* SLC-specific: Group Selection */}
                {selectedSurvey.type === "slc" && (
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-violet-500" />
                      Gruppi Omogenei
                    </h4>
                    <p className="text-[10px] text-slate-400">Seleziona i gruppi da includere nel report</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <Checkbox id="pdf-group-all" checked={pdfFilterConfig.selectedGroups.includes("all")}
                          onCheckedChange={(checked) => setPdfFilterConfig(prev => ({ ...prev, selectedGroups: checked ? [...prev.selectedGroups.filter(g => g !== "all"), "all"] : prev.selectedGroups.filter(g => g !== "all") }))} />
                        <UILabel htmlFor="pdf-group-all" className="text-xs font-semibold text-slate-700 cursor-pointer">Tutti i gruppi omogenei</UILabel>
                      </div>
                      {slcAssessments.map(a => (
                        <div key={a.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                          <Checkbox id={`pdf-group-${a.id}`} checked={pdfFilterConfig.selectedGroups.includes(a.id)}
                            onCheckedChange={(checked) => setPdfFilterConfig(prev => ({ ...prev, selectedGroups: checked ? [...prev.selectedGroups, a.id] : prev.selectedGroups.filter(g => g !== a.id) }))} />
                          <UILabel htmlFor={`pdf-group-${a.id}`} className="text-xs font-medium text-slate-600 cursor-pointer">{a.setup.nomeGruppoOmogeneo}</UILabel>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SLC-specific: Dettaglio Dimensioni Selection */}
                {selectedSurvey.type === "slc" && (
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                       <Activity className="h-3.5 w-3.5 text-blue-500" />
                       Dimensioni in Dettaglio
                    </h4>
                    <p className="text-[10px] text-slate-400">Dimensione stampate nel dettaglio domande</p>
                    <div className="space-y-1.5">
                      {["Domanda", "Controllo", "Supporto Management", "Supporto Colleghi", "Relazioni", "Ruolo", "Cambiamento"].map((label) => (
                        <div key={label} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                          <Checkbox id={`pdf-dim-${label}`} checked={pdfFilterConfig.selectedDimensions.includes(label)}
                            onCheckedChange={(checked) => setPdfFilterConfig(prev => ({ ...prev, selectedDimensions: checked ? [...prev.selectedDimensions, label] : prev.selectedDimensions.filter(d => d !== label) }))} />
                          <UILabel htmlFor={`pdf-dim-${label}`} className="text-xs font-medium text-slate-600 cursor-pointer">{label}</UILabel>
                        </div>
                      ))}
                      <div className="flex gap-2 pt-1">
                        <Button variant="ghost" size="sm" className="text-[10px] h-6 px-2 text-blue-600 hover:text-blue-700"
                          onClick={() => setPdfFilterConfig(prev => ({ ...prev, selectedDimensions: ["Domanda", "Controllo", "Supporto Management", "Supporto Colleghi", "Relazioni", "Ruolo", "Cambiamento"] }))}>Tutte</Button>
                        <Button variant="ghost" size="sm" className="text-[10px] h-6 px-2 text-slate-400 hover:text-slate-600"
                          onClick={() => setPdfFilterConfig(prev => ({ ...prev, selectedDimensions: [] }))}>Nessuna</Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Summary badge */}
                {selectedSurvey.type === "slc" && pdfFilterConfig.selectedGroups.length > 0 && (
                  <div className="bg-violet-50 border border-violet-200 rounded-xl p-3 space-y-1">
                    <p className="text-[10px] font-black text-violet-700 uppercase tracking-widest">Riepilogo Stampa</p>
                    <p className="text-xs text-violet-600">
                      Verrà generato 1 file PDF contenente l'analisi di <span className="font-bold">{pdfFilterConfig.selectedGroups.length}</span>{" "}
                      grupp{pdfFilterConfig.selectedGroups.length === 1 ? "o" : "i"}.
                    </p>
                  </div>
                )}

                <div className="space-y-4 pt-4 border-t">
                  <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Sezioni Report</h4>
                  <div className="space-y-4">
                    {(() => {
                      const sections = selectedSurvey.type === "slc" 
                        ? {
                            kpis: "Indice Stress (ISLC)",
                            radar: "Valutazione Aree",
                            slcQuestions: "Dettaglio Domande",
                            demographics: "Analisi Anagrafica",
                            slcIntegrative: "Analisi Remoto & Tech",
                            slcGroups: "Elenco Gruppi"
                          }
                        : {
                            kpis: "KPI Principali",
                            radar: "Wellbeing Radar",
                            insights: "AI Insights",
                            demographics: "Analisi Demografica",
                            history: "Storico Compilazioni"
                          };

                      return Object.entries(sections).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between">
                          <UILabel htmlFor={`section-${key}`} className="text-sm font-medium text-slate-700">{label}</UILabel>
                          <Switch 
                            id={`section-${key}`} 
                            checked={reportConfig[key as keyof (typeof reportConfig)] as boolean} 
                            onCheckedChange={() => handleToggleSection(key as keyof typeof reportConfig)}
                          />
                        </div>
                      ));
                    })()}
                  </div>

                  <div className="pt-6 border-t space-y-4">
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Orientamento Pagina</h4>
                    <Tabs value={reportConfig.orientation} onValueChange={(v) => setReportConfig(prev => ({ ...prev, orientation: v as any }))}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="portrait">Verticale</TabsTrigger>
                        <TabsTrigger value="landscape">Orizzontale</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </div>

              {/* Preview Area */}
              <div className="flex-1 p-8 overflow-y-auto flex flex-col items-center">
                 {previewUrl ? (
                   <div className="w-full h-full bg-white shadow-2xl rounded-lg overflow-hidden border border-slate-200">
                      <iframe src={previewUrl} className="w-full h-full border-none" />
                   </div>
                 ) : (
                   <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                      <div className="p-6 bg-slate-100 rounded-full">
                        <Files className="h-12 w-12" />
                      </div>
                      <p className="text-sm font-medium">Clicca su "Rigenera Anteprima" per visualizzare il report reale</p>
                   </div>
                 )}
              </div>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
