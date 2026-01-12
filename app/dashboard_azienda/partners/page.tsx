"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ExternalLink, Search, Filter, Handshake } from "lucide-react"

export default function PartnerPage() {
  const partners = [
    {
      name: "MindfulCorp",
      category: "Mental",
      price: "Starting at $1,200/month",
      description: "Comprehensive mental health support platform for employees.",
      color: "bg-blue-100 text-blue-700"
    },
    {
      name: "FitSpace",
      category: "Physical",
      price: "Custom pricing",
      description: "On-site and virtual fitness classes tailored for corporate teams.",
      color: "bg-emerald-100 text-emerald-700"
    },
    {
      name: "WorkLife Balance Co.",
      category: "Worklife",
      price: "Starting at $800/month",
      description: "Consultancy and tools to improve employee work-life balance.",
      color: "bg-amber-100 text-amber-700"
    },
    {
      name: "SocialConnect",
      category: "Social",
      price: "Starting at $500/event",
      description: "Organizing team building and social events for companies.",
      color: "bg-purple-100 text-purple-700"
    },
     {
      name: "NutriWell",
      category: "Physical",
      price: "Starting at $300/workshop",
      description: "Nutrition workshops and healthy personalized meal plans.",
      color: "bg-emerald-100 text-emerald-700"
    },
    {
      name: "ErgoComfort",
      category: "Physical",
      price: "Custom pricing",
      description: "Ergonomic assessments and furniture for a healthier office.",
      color: "bg-emerald-100 text-emerald-700"
    }
  ]

  return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Handshake className="h-8 w-8 text-blue-600" />
              Wellbeing Partners
          </h1>
          <p className="text-slate-500">
            Connect with trusted partners to enhance your wellbeing initiatives.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Search partners..."
                className="pl-9 bg-white border-slate-200"
              />
            </div>
            <Button variant="outline" className="gap-2 text-slate-600 border-slate-200 bg-white">
              <Filter className="h-4 w-4" />
              All categories
            </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <Card key={partner.name} className="flex flex-col border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Handshake className="h-5 w-5 text-slate-400" />
                </div>
                <Badge variant="secondary" className={`${partner.color} hover:${partner.color} border-none font-normal`}>
                      {partner.category}
                </Badge>
              </CardHeader>
              <CardContent className="flex-1 space-y-2 pt-2">
                <CardTitle className="text-lg font-bold text-slate-900">
                      {partner.name}
                </CardTitle>
                <p className="text-xs font-medium text-slate-500">{partner.price}</p>
                <CardDescription className="text-sm text-slate-600 line-clamp-3">
                  {partner.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="pt-4 border-t border-slate-50">
                <Button variant="outline" className="w-full gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                    <ExternalLink className="h-4 w-4" />
                    View services
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
  )
}
