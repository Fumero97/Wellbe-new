import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface OverviewCardProps {
  title: string
  value: string
  description?: string
  icon: LucideIcon
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  className?: string
}

export function OverviewCard({ title, value, description, icon: Icon, trend, trendValue, className }: OverviewCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        {(description || trendValue) && (
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            {trend === "up" && <span className="text-emerald-600 font-medium">↑ {trendValue}</span>}
            {trend === "down" && <span className="text-rose-600 font-medium">↓ {trendValue}</span>}
            {trend === "neutral" && <span className="text-slate-600 font-medium">→ {trendValue}</span>}
            <span className="opacity-80">{description}</span>
          </p>
        )}
      </CardContent>
    </Card>
  )
}
