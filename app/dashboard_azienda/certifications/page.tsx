"use client"

import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
// Note: Assuming we have a Progress component or UI equivalent. Using standard one.
import { CheckCircle2, Circle, FileText, Award } from "lucide-react"

export default function CertificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Centro Certificazioni</h1>
        <p className="text-slate-500">
          Tracker di preparazione per audit e conformità standard (SA8000, ISO 45001, UNI PdR 125).
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {/* SA8000 Card */}
        <Card className="p-6">
           <div className="flex items-start justify-between">
              <div className="space-y-1">
                 <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    SA8000:2014
                 </CardTitle>
                 <CardDescription>Responsabilità Sociale</CardDescription>
              </div>
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                In Progress
              </span>
           </div>
           
           <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                 <span className="text-slate-500">Readiness Score</span>
                 <span className="font-medium text-slate-900">76%</span>
              </div>
              <Progress value={76} className="h-2" />
           </div>

           <div className="mt-6 space-y-4 border-t border-slate-100 pt-4">
              <h4 className="text-sm font-medium text-slate-900">Checklist Pre-Audit</h4>
              <ul className="space-y-3">
                 <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="text-sm text-slate-600">Policy sul Lavoro Infantile aggiornata e firmata.</span>
                 </li>
                 <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="text-sm text-slate-600">Registro ore lavoro e straordinari conforme.</span>
                 </li>
                 <li className="flex items-start gap-3">
                    <Circle className="h-5 w-5 text-slate-300 shrink-0" />
                    <span className="text-sm text-slate-600">Nomina rappresentanti SA8000 (Pendiente).</span>
                 </li>
              </ul>
           </div>
        </Card>

        {/* UNI PdR 125 Card */}
        <Card className="p-6">
           <div className="flex items-start justify-between">
              <div className="space-y-1">
                 <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    UNI/PdR 125:2022
                 </CardTitle>
                 <CardDescription>Parità di Genere</CardDescription>
              </div>
              <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                Audit Ready
              </span>
           </div>
           
           <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                 <span className="text-slate-500">Readiness Score</span>
                 <span className="font-medium text-slate-900">92%</span>
              </div>
              <Progress value={92} className="h-2" />
           </div>

           <div className="mt-6 space-y-4 border-t border-slate-100 pt-4">
              <h4 className="text-sm font-medium text-slate-900">Checklist Pre-Audit</h4>
               <ul className="space-y-3">
                 <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="text-sm text-slate-600">KPI Diversity calcolati e validati.</span>
                 </li>
                 <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="text-sm text-slate-600">Piano Strategico D&I pubblicato.</span>
                 </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="text-sm text-slate-600">Formazione bias cognitivi erogata al 100%.</span>
                 </li>
              </ul>
           </div>
        </Card>

         {/* ISO 45001 Card */}
        <Card className="p-6 bg-slate-50 border-dashed">
           <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="rounded-full bg-slate-100 p-3 mb-4">
                 <FileText className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">ISO 45001:2018</h3>
              <p className="mt-1 text-sm text-slate-500 max-w-sm">
                Salute e Sicurezza sul Lavoro. Configurazione non ancora avviata.
              </p>
              <button className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-800">
                Inizia Setup →
              </button>
           </div>
        </Card>
      </div>
    </div>
  )
}
