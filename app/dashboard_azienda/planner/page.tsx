"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Plus, MoreHorizontal, Clock, CheckCircle2, Circle } from "lucide-react"

export default function PlannerPage() {
  const tasks = [
    {
      id: "1",
      title: "Mental health awareness workshop",
      assignedTo: "HR Team",
      description: "Organize a company-wide session on stress management.",
      priority: "High",
      category: "Mental",
      date: "15/12/2024",
      status: "To Do",
      color: "bg-blue-100 text-blue-700"
    },
    {
      id: "2",
      title: "Weekly yoga sessions",
      assignedTo: "Wellness Committee",
      description: "Setup vendor for Thursday morning classes.",
      priority: "Medium",
      category: "Physical",
      date: "20/12/2024",
      status: "To Do",
      color: "bg-emerald-100 text-emerald-700"
    },
    {
      id: "3",
      title: "Update remote work policy",
      assignedTo: "Management",
      description: "Draft new guidelines for flexible working hours.",
      priority: "High",
      category: "Worklife",
      date: "01/12/2024",
      status: "In Progress",
      color: "bg-amber-100 text-amber-700"
    },
    {
      id: "4",
      title: "Team building lunch",
      assignedTo: "Social Comm.",
      description: "Book venue for end of quarter celebration.",
      priority: "Low",
      category: "Social",
      date: "10/12/2024",
      status: "Done",
      color: "bg-purple-100 text-purple-700"
    },
     {
      id: "5",
      title: "Ergonomic workspace audit",
      assignedTo: "Facilities",
      description: "Check all workstations for proper setup.",
      priority: "Medium",
      category: "Physical",
      date: "05/11/2024",
      status: "Done",
      color: "bg-emerald-100 text-emerald-700"
    }
  ]

  const columns = [
      { id: "To Do", title: "To Do", icon: Circle, color: "text-slate-500" },
      { id: "In Progress", title: "In Progress", icon: Clock, color: "text-blue-500" },
      { id: "Done", title: "Done", icon: CheckCircle2, color: "text-green-500" }
  ]

  return (
      <div className="space-y-6 h-full flex flex-col">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Wellbeing Action Planner</h1>
          <p className="text-slate-500">
            Plan and track wellbeing initiatives across your organization.
          </p>
        </div>

        <div className="flex-1 overflow-x-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-w-[800px] h-full">
                {columns.map((col) => {
                    const columnTasks = tasks.filter(t => t.status === col.id)
                    return (
                        <div key={col.id} className="flex flex-col h-full bg-slate-50/50 rounded-xl border border-slate-100">
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white rounded-t-xl">
                                <div className="flex items-center gap-2">
                                    <col.icon className={`h-5 w-5 ${col.color}`} />
                                    <h3 className="font-semibold text-slate-900">{col.title}</h3>
                                    <Badge variant="secondary" className="ml-1 bg-slate-100 text-slate-600">
                                        {columnTasks.length}
                                    </Badge>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 text-slate-400">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            
                            <div className="p-3 flex-1 overflow-y-auto space-y-3">
                                {columnTasks.map((task) => (
                                    <Card key={task.id} className="cursor-pointer hover:shadow-md transition-all border-slate-200 group">
                                        <CardContent className="p-4 space-y-3">
                                            <div className="space-y-1">
                                                <div className="flex justify-between items-start">
                                                    <Badge variant="outline" className={`border-0 ${task.color} font-normal uppercase text-[10px] tracking-wider`}>
                                                        {task.category}
                                                    </Badge>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-2 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <p className="font-semibold text-slate-900 leading-tight">{task.title}</p>
                                            </div>
                                            
                                            <p className="text-xs text-slate-500 line-clamp-2">
                                                {task.description}
                                            </p>

                                            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                                    {task.assignedTo}
                                                </span>
                                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                                     <Calendar className="h-3 w-3" />
                                                     {task.date}
                                                </div>
                                            </div>
                                           
                                            <div className="flex gap-2">
                                                {task.priority === "High" && (
                                                    <Badge variant="destructive" className="h-5 px-1.5 text-[10px] bg-red-100 text-red-700 hover:bg-red-100 border-none shadow-none">High Priority</Badge>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                
                                {columnTasks.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                                        <p className="text-sm">No tasks</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
      </div>
  )
}
