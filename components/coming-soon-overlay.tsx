"use client"

import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"

export function ComingSoonOverlay({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  
  return (
    <div className="relative min-h-[500px]">
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm rounded-lg">
        <div className="flex flex-col items-center gap-4 p-8 text-center bg-white border border-slate-200 shadow-xl rounded-2xl max-w-sm mx-auto">
            <div className="h-16 flex items-center justify-center mb-2">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/img/Wellbe-logo-blue.svg" alt="Wellbe" className="h-10" />
            </div>
            <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">{t('comingSoon')}</h3>
                <p className="text-slate-500 text-sm">
                    {t('moduleUnderDevelopment')}
                </p>
            </div>
            <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                {t('workInProgress')}
            </Badge>
        </div>
      </div>
      <div className="opacity-40 pointer-events-none select-none filter blur-[2px]">
          {children}
      </div>
    </div>
  )
}
