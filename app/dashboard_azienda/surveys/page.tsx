"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Search, Plus, Edit, Trash2, Eye, BarChart, FileText } from "lucide-react"

export default function SurveysPage() {
  const surveys = [
    {
      title: "Quarterly Wellness Assessment",
      status: "Active",
      module: "Wellbeing",
      created: "Oct 15, 2024",
      closes: "Nov 15, 2024",
      responses: 145,
      target: 200,
      rate: "73%",
      color: "bg-emerald-100 text-emerald-700"
    },
    {
      title: "DEI & Inclusion Survey",
      status: "Draft",
      module: "DEI",
      created: "Nov 02, 2024",
      closes: "Dec 01, 2024",
      responses: 0,
      target: 200,
      rate: "0%",
      color: "bg-yellow-100 text-yellow-700"
    },
    {
      title: "Safety Protocols Feedback",
      status: "Closed",
      module: "Safety",
      created: "Sep 01, 2024",
      closes: "Sep 30, 2024",
      responses: 188,
      target: 200,
      rate: "94%",
      color: "bg-slate-100 text-slate-700"
    },
    {
      title: "Vendor Satisfaction Survey",
      status: "Active",
      module: "Supply Chain",
      created: "Oct 20, 2024",
      closes: "Nov 20, 2024",
      responses: 45,
      target: 80,
      rate: "56%",
      color: "bg-emerald-100 text-emerald-700"
    },
      {
      title: "Internal Stakeholder Review",
      status: "Draft",
      module: "Stakeholders",
      created: "Nov 05, 2024",
      closes: "Dec 05, 2024",
      responses: 0,
      target: 50,
      rate: "0%",
      color: "bg-yellow-100 text-yellow-700"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
         <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <FileText className="h-8 w-8 text-blue-600" />
                Surveys
            </h1>
            <p className="text-slate-500">Manage and track employee feedback surveys.</p>
         </div>
         <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4" />
            New Survey
         </Button>
      </div>

       {/* Search & Filters */}
       <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
             <Input
               type="search"
               placeholder="Search surveys..."
               className="pl-9 bg-white border-slate-200"
             />
          </div>
       </div>

      {/* Survey Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         {surveys.map((survey) => (
            <Card key={survey.title} className="border-slate-200 shadow-sm flex flex-col">
               <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                     <Badge variant="outline" className="mb-2 text-slate-500 border-slate-200 bg-slate-50">
                        {survey.module}
                     </Badge>
                     <Badge className={`${survey.color} hover:${survey.color} border-none font-normal`}>
                        {survey.status}
                     </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold text-slate-900 leading-tight">
                     {survey.title}
                  </CardTitle>
               </CardHeader>
               <CardContent className="flex-1 pb-3">
                  <div className="space-y-3 text-sm text-slate-500">
                     <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                           <Calendar className="h-3.5 w-3.5" />
                           Created:
                        </span>
                        <span className="font-medium text-slate-700">{survey.created}</span>
                     </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                           <Calendar className="h-3.5 w-3.5 text-red-500" />
                           Closes:
                        </span>
                        <span className="font-medium text-slate-700">{survey.closes}</span>
                     </div>
                     
                     <div className="pt-2 border-t border-slate-100">
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-xs font-medium text-slate-500">Response Rate</span>
                            <span className="text-sm font-bold text-slate-900">{survey.rate}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                           <div 
                             className="bg-blue-600 h-2 rounded-full" 
                             style={{ width: survey.rate }} 
                           />
                        </div>
                        <p className="text-xs text-slate-400 mt-1 text-right">
                           {survey.responses} / {survey.target} responses
                        </p>
                     </div>
                  </div>
               </CardContent>
               <CardFooter className="grid grid-cols-3 gap-2 border-t border-slate-100 p-3 bg-slate-50/50 rounded-b-xl">
                  <Button variant="ghost" size="sm" className="w-full text-slate-600 hover:text-blue-600 hover:bg-white text-xs gap-1">
                     <Eye className="h-3.5 w-3.5" />
                     View
                  </Button>
                   <Button variant="ghost" size="sm" className="w-full text-slate-600 hover:text-blue-600 hover:bg-white text-xs gap-1">
                     <Edit className="h-3.5 w-3.5" />
                     Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full text-slate-600 hover:text-red-600 hover:bg-white text-xs gap-1">
                     <Trash2 className="h-3.5 w-3.5" />
                     Delete
                  </Button>
               </CardFooter>
            </Card>
         ))}
      </div>
    </div>
  )
}
