"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { 
    Download, 
    Filter, 
    RefreshCcw, 
    Calendar,
    TrendingUp,
    TrendingDown,
    Activity,
    Heart,
    Users,
    Brain,
    Coffee,
    AlertTriangle
} from "lucide-react"
import { AreaChartDemo, BarChartDemo } from "@/components/dashboard/charts" // Reusing reports/dashboard charts
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

export default function AnalyticsPage() {

  // Mock Data for Charts
  const trendData = [
    { name: "Jan", Mental: 65, Physical: 55, Social: 70, WorkLife: 60, Overall: 62 },
    { name: "Feb", Mental: 68, Physical: 58, Social: 72, WorkLife: 62, Overall: 65 },
    { name: "Mar", Mental: 70, Physical: 60, Social: 75, WorkLife: 65, Overall: 68 },
    { name: "Apr", Mental: 72, Physical: 63, Social: 78, WorkLife: 63, Overall: 70 },
    { name: "May", Mental: 75, Physical: 65, Social: 80, WorkLife: 64, Overall: 71 },
    { name: "Jun", Mental: 76, Physical: 68, Social: 82, WorkLife: 65, Overall: 73 },
  ]

  const demographicData = [
    { name: "Engineering", value: 35, color: "#3b82f6" },
    { name: "Marketing", value: 20, color: "#8b5cf6" },
    { name: "Sales", value: 25, color: "#f43f5e" },
    { name: "HR", value: 10, color: "#10b981" },
    { name: "Product", value: 10, color: "#f59e0b" },
  ]

  const kpiData = [
    { title: "Mental Health", value: "76%", trend: "+4%", trendUp: true, icon: Brain, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Physical Health", value: "68%", trend: "-2%", trendUp: false, icon: Activity, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Social Wellbeing", value: "82%", trend: "+5%", trendUp: true, icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Work-Life Balance", value: "65%", trend: "+1%", trendUp: true, icon: Coffee, color: "text-amber-600", bg: "bg-amber-100" },
    { title: "Overall Wellbeing", value: "73%", trend: "+2%", trendUp: true, icon: Heart, color: "text-pink-600", bg: "bg-pink-100" },
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
                <Calendar className="h-4 w-4" />
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

      {/* Main Analysis Section */}
      <div className="grid gap-6 lg:grid-cols-3">
         {/* Wellbeing Areas - Large Chart */}
         <Card className="lg:col-span-2 border-slate-200 shadow-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                   <CardTitle>Wellbeing Areas Trend</CardTitle>
                   <Tabs defaultValue="trend" className="w-[200px]">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="trend">Trend</TabsTrigger>
                        <TabsTrigger value="metrics">Metrics</TabsTrigger>
                      </TabsList>
                   </Tabs>
                </div>
                <CardDescription>Performance across key dimensions over time.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <AreaChartDemo data={trendData} dataKey="Overall" color="#3b82f6" />
                </div>
            </CardContent>
         </Card>

         {/* Demographic Clusters */}
         <Card className="border-slate-200 shadow-sm">
            <CardHeader>
                <CardTitle>Demographics</CardTitle>
                <CardDescription>Response distribution by department.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="h-[200px] w-full flex items-center justify-center">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                         <Pie 
                            data={demographicData} 
                            cx="50%" 
                            cy="50%" 
                            innerRadius={60} 
                            outerRadius={80} 
                            paddingAngle={5} 
                            dataKey="value"
                        >
                            {demographicData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                   </ResponsiveContainer>
               </div>
               <div className="mt-4 space-y-2">
                    {demographicData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-slate-600">{item.name}</span>
                            </div>
                            <span className="font-medium text-slate-900">{item.value}%</span>
                        </div>
                    ))}
               </div>
            </CardContent>
         </Card>
      </div>

       {/* Detailed Metrics Grid */}
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {kpiData.map((kpi) => (
              <Card key={kpi.title} className="border-slate-200 shadow-sm">
                  <CardContent className="p-4 flex flex-col justify-between h-full space-y-2">
                     <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-lg ${kpi.bg}`}>
                            <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                        </div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${kpi.trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {kpi.trend}
                        </span>
                     </div>
                     <div>
                        <div className="text-2xl font-bold text-slate-900">{kpi.value}</div>
                        <div className="text-xs text-slate-500 font-medium mt-1">{kpi.title}</div>
                     </div>
                  </CardContent>
              </Card>
          ))}
       </div>

       {/* Bottom Section: Insights & Hotspots */}
       <div className="grid gap-6 md:grid-cols-2">
            {/* AI Insights */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-purple-600" />
                        AI Insights
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-3 items-start">
                        <div className="h-2 w-2 mt-2 rounded-full bg-blue-500 shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-slate-900">Mental health variation</p>
                            <p className="text-xs text-slate-500 mt-0.5">Engineering shows a 15% lower score than average. Consider targeted workshops.</p>
                        </div>
                    </div>
                    <div className="flex gap-3 items-start">
                        <div className="h-2 w-2 mt-2 rounded-full bg-green-500 shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-slate-900">Social connection strength</p>
                            <p className="text-xs text-slate-500 mt-0.5">Remote teams reported a 10% increase in social bonding after recent virtual events.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Hotspots */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        Attention Areas
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-md bg-red-50 border border-red-100">
                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-red-700">High Stress Levels</p>
                            <p className="text-xs text-red-600">Sales Team • +12% vs last month</p>
                        </div>
                        <span className="text-lg font-bold text-red-700">78/100</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-md bg-amber-50 border border-amber-100">
                        <div className="space-y-1">
                             <p className="text-sm font-semibold text-amber-700">Burnout Risk</p>
                             <p className="text-xs text-amber-600">Support Team • 35% at risk</p>
                        </div>
                        <span className="text-lg font-bold text-amber-700">High</span>
                    </div>
                </CardContent>
            </Card>
       </div>
    </div>
  )
}
