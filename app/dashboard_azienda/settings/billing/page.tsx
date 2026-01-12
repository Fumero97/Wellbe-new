"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, Package } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export default function BillingPage() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Essential tools for small businesses starting their CSR journey.",
      features: ["Basic Dashboard", "1 User Seat", "Standard Reports", "Community Support"],
      current: false,
      recommended: false
    },
    {
      name: "Professional",
      price: "€299/mo",
      description: "Advanced analytics and tools for growing companies.",
      features: ["All Starter Features", "Up to 5 User Seats", "Advanced Analytics", "Priority Support", "AI Insights"],
      current: true,
      recommended: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Full suite solutions for large organizations.",
      features: ["Unlimited Seats", "Custom Integrations", "Dedicated Account Manager", "SLA Support", "Audit Logs"],
      current: false,
      recommended: false
    }
  ]

  const modules = [
    {
      name: "Wellbeing Module",
      description: "Employee surveys, climate monitoring, and health tracking.",
      price: "Included in Pro",
      active: true,
      included: true
    },
    {
      name: "DEI Simulator",
      description: "Advanced diversity metrics, pay gap analysis, and simulation tools.",
      price: "+ €49/mo",
      active: false,
      included: false
    },
    {
      name: "Supply Chain Audit",
      description: "Supplier risk assessment, compliance tracking, and SA8000 tools.",
      price: "+ €89/mo",
      active: true,
      included: false
    },
    {
      name: "Safety & Incident Mgmt",
      description: "ISO 45001 compliance, incident reporting, and training logs.",
      price: "+ €59/mo",
      active: false,
      included: false
    }
  ]

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <CreditCard className="h-8 w-8 text-blue-600" />
            Plan & Billing
        </h1>
        <p className="text-slate-500">
          Manage your subscription plan and active modules.
        </p>
      </div>

      {/* Plans Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Subscription Plan</h2>
        <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
                <Card key={plan.name} className={`flex flex-col relative ${plan.current ? 'border-blue-600 shadow-md ring-1 ring-blue-600' : 'border-slate-200'}`}>
                    {plan.recommended && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full shadow-sm">
                            Recommended
                        </div>
                    )}
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            {plan.name}
                            {plan.current && <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">Current</Badge>}
                        </CardTitle>
                        <div className="mt-2">
                            <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                        </div>
                        <CardDescription className="pt-1.5">{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-3">
                        {plan.features.map((feature) => (
                            <div key={feature} className="flex items-start gap-2 text-sm text-slate-600">
                                <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                {feature}
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter>
                        <Button 
                            className="w-full" 
                            variant={plan.current ? "outline" : "default"}
                            disabled={plan.current}
                        >
                            {plan.current ? "Current Plan" : "Upgrade"}
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
      </section>

      {/* Modules Section */}
      <section className="space-y-4">
          <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-slate-700" />
              <h2 className="text-xl font-semibold text-slate-900">Add-on Modules</h2>
          </div>
          <Card className="border-slate-200">
              <CardContent className="p-0">
                 {modules.map((module, index) => (
                     <div key={module.name} className={`flex items-center justify-between p-6 ${index !== modules.length - 1 ? 'border-b border-slate-100' : ''}`}>
                         <div className="space-y-1">
                             <div className="flex items-center gap-2">
                                 <h3 className="font-semibold text-slate-900">{module.name}</h3>
                                 {module.included && <Badge variant="outline" className="text-xs bg-slate-50 text-slate-500 font-normal">Included in Plan</Badge>}
                             </div>
                             <p className="text-sm text-slate-500 max-w-xl">{module.description}</p>
                         </div>
                         <div className="flex items-center gap-6">
                             <span className={`text-sm font-medium ${module.included ? 'text-slate-400' : 'text-slate-900'}`}>
                                 {module.price}
                             </span>
                             <Switch 
                                checked={module.active || module.included} 
                                disabled={module.included}
                             />
                         </div>
                     </div>
                 ))}
              </CardContent>
          </Card>
      </section>
    </div>
  )
}
