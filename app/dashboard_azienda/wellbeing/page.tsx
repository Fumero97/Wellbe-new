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
    Check,
    ChevronsUpDown,
    Phone,
    MessageCircle,
    Mail
} from "lucide-react"
import { AreaChartDemo, BarChartDemo, ChartRadarLinesOnly, ChartLineMultiple } from "@/components/dashboard/charts"
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { ChartConfig } from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
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

export default function AnalyticsPage() {
  const surveys = [
    {
      id: "1",
      title: "Blue Wellbeing Survey - 2024 Q4",
      status: "Closed",
      date: "31 Dec 2024",
    },
    {
      id: "2",
      title: "Blue Wellbeing Survey - 2024 Q3",
      status: "Closed",
      date: "30 Sep 2024",
    },
    {
        id: "3",
        title: "Blue Wellbeing Survey - 2024 Q2",
        status: "Closed",
        date: "30 Jun 2024",
      }
  ]

  const [selectedSurveyId, setSelectedSurveyId] = useState(surveys[0].id)
  const selectedSurvey = surveys.find(s => s.id === selectedSurveyId) || surveys[0]

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
            { name: "Operazioni o collaboratore", Colleghi: 4.4, Appartenenza: 4.1, Coinvolgimento: 4.2, "Work-life": 4.0, Leadership: 4.4, Soddisfazione: 4.1, Tecnologia: 4.2, Sicurezza: 4.0 },
        ]
    },
    gender: {
        label: "Genere",
        categories: ["M", "F", "N/S"],
        distribution: [
            { name: "M", value: 55, color: "#06b6d4" },
            { name: "F", value: 40, color: "#22d3ee" },
            { name: "N/S", value: 5, color: "#67e8f9" },
        ],
        performance: [
            { name: "M", Colleghi: 5.2, Appartenenza: 4.4, Coinvolgimento: 6.0, "Work-life": 3.4, Leadership: 5.0, Soddisfazione: 4.2, Tecnologia: 5.5, Sicurezza: 6.1 },
            { name: "F", Colleghi: 5.3, Appartenenza: 4.5, Coinvolgimento: 6.1, "Work-life": 3.3, Leadership: 5.1, Soddisfazione: 4.3, Tecnologia: 5.6, Sicurezza: 6.2 },
            { name: "N/S", Colleghi: 5.1, Appartenenza: 4.3, Coinvolgimento: 5.9, "Work-life": 3.5, Leadership: 4.9, Soddisfazione: 4.1, Tecnologia: 5.4, Sicurezza: 6.0 },
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
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
         <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Analytics</h1>
            <p className="text-slate-500">Deep dive into organization wellbeing metrics.</p>
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
            <Button size="sm" className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
                <Download className="h-4 w-4" />
                Export
            </Button>
         </div>
      </div>

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
                <SelectTrigger className="w-10 h-10 p-0 rounded-full border-slate-200 bg-white hover:bg-slate-50 transition-colors flex items-center justify-center shrink-0">
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

      {/* Main Analysis Section */}
       {/* Detailed Metrics Grid */}
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
      <div className="grid gap-6 lg:grid-cols-2">
         {/* Radar Wellbeing Areas */}
         <Card className="border-slate-200 shadow-sm flex flex-col">
            <CardHeader>
                <CardTitle>Wellbeing Radar</CardTitle>
                <CardDescription>Punteggi da 1 a 6 per area.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center min-h-[400px] w-full">
                <ChartRadarLinesOnly data={wellbeingRadarData} config={radarConfig} />
            </CardContent>
         </Card>

         {/* Overview Section */}
         <Card className="border-slate-200 shadow-sm overflow-hidden flex flex-col">
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

{/* Bottom Section: Insights & Hotspots */}
       <div className="grid gap-6 md:grid-cols-2 mt-6">
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
       
      <div className="grid gap-6 lg:grid-cols-3 mt-6">
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
                    <div className="flex items-center gap-2">
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
                                                        <Check className={cn("h-4 w-4")} />
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

       

        {/* Storico Compilazioni */}
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

        {/* Help Section */}
        <div className="mt-8 p-8 rounded-xl border border-blue-200 bg-blue-50/50 flex flex-col md:flex-row items-center justify-between gap-6">
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
    </div>
  )
}
