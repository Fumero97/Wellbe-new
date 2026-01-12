"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Download, FileText, Filter, Plus } from "lucide-react"

export default function ReportsPage() {
  const reports = [
    {
      title: "Social Responsibility Overview",
      description: "Complete CSR performance summary including all 5 pillars.",
      date: "Nov 28, 2024",
      tags: ["overview"],
      format: "PDF"
    },
    {
      title: "DEI Dashboard Report",
      description: "Detailed breakdown of Diversity, Equity & Inclusion metrics.",
      date: "Nov 28, 2024",
      tags: ["dei"],
      format: "PDF"
    },
    {
        title: "Wellbeing Climate Report",
        description: "Employee survey results and climate analysis.",
        date: "Nov 25, 2024",
        tags: ["wellbeing"],
        format: "PDF"
    },
    {
        title: "Safety Performance Report",
        description: "Workplace safety metrics, incidents and training.",
        date: "Nov 22, 2024",
        tags: ["safety"],
        format: "PDF"
    },
    {
        title: "Supply Chain Audit Summary",
        description: "Supplier compliance status and risk assessment.",
        date: "Nov 20, 2024",
        tags: ["supply chain"],
        format: "PDF"
    },
    {
        title: "SA8000 Readiness Document",
        description: "Current status and gap analysis for SA8000 certification.",
        date: "Nov 15, 2024",
        tags: ["certification"],
        format: "PDF"
    },
    {
        title: "UNI/PdR 125 Compliance Report",
        description: "Gender equality management system report.",
        date: "Nov 15, 2024",
        tags: ["certification"],
        format: "PDF"
    },
    {
        title: "ISO 45001 Status Report",
        description: "Occupational health and safety management system status.",
        date: "Nov 10, 2024",
        tags: ["certification"],
        format: "PDF"
    }
  ]

  const filters = ["All Reports", "Overview", "Certifications"]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-600" />
            Reports
        </h1>
        <p className="text-slate-500">
          Generate and export CSR reports and documentation.
        </p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
         {filters.map((filter, index) => (
             <Button 
                key={filter} 
                variant={index === 0 ? "default" : "outline"}
                size="sm"
                className={`rounded-full ${index === 0 ? 'bg-slate-900 text-white hover:bg-slate-800' : 'text-slate-600 border-slate-200 hover:bg-slate-100'}`}
             >
                {filter}
             </Button>
         ))}
         <Button variant="outline" size="sm" className="rounded-full text-slate-600 border-slate-200 gap-1 ml-auto md:ml-0">
            <Filter className="h-3 w-3" />
            More Filters
         </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {reports.map((report) => (
          <Card key={report.title} className="group transition-all hover:shadow-md border-slate-200">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
               <div className="space-y-1">
                 <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-100 font-normal">
                        {report.tags[0]}
                    </Badge>
                     <Badge variant="outline" className="text-slate-500 border-slate-200 font-mono text-[10px]">
                        {report.format}
                    </Badge>
                 </div>
                 <CardTitle className="text-base font-semibold text-slate-900 pt-1">
                    {report.title}
                 </CardTitle>
               </div>
               <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50">
                  <Download className="h-4 w-4" />
               </Button>
            </CardHeader>
            <CardContent>
               <CardDescription className="text-sm text-slate-500 line-clamp-2 mb-4">
                 {report.description}
               </CardDescription>
               <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="h-3 w-3" />
                  Generated: {report.date}
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Floating Action Button Mockup - Fixed position usually, but simpler centered button for now if fixed isn't preferred or creates layout issues */}
       <div className="fixed bottom-8 right-8 z-50">
         <Button size="icon" className="h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-6 w-6" />
         </Button>
      </div>
    </div>
  )
}
