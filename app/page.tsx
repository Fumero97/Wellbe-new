"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MoveRight, Shield, BarChart3, Users } from "lucide-react";

export default function WelcomePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Navbar */}
            <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/img/Wellbe-logo-blue.svg" alt="Wellbe" className="h-8" />
                        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
                            <a href="#" className="hover:text-primary transition-colors">Cos’è</a>
                            <a href="#" className="hover:text-primary transition-colors">Perché ci scelgono</a>
                            <a href="#" className="hover:text-primary transition-colors">Contatti</a>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="text-slate-600 hover:text-primary hover:bg-blue-50" onClick={() => router.push("/login")}>
                            Login
                        </Button>
                        <Button className="rounded-full px-6 bg-primary hover:bg-blue-600 shadow-lg shadow-blue-200" onClick={() => router.push("/login")}>
                            Contattaci
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="pt-32 pb-16 lg:pt-48 lg:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Text Content */}
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                            Rivela insight <br />
                            per migliorare il <br />
                            <span className="text-primary">benessere</span> <br />
                            della tua azienda
                        </h1>
                        <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                            La prima piattaforma basata sui dati per misurare e migliorare la responsabilità sociale di impresa. 
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-blue-200" onClick={() => router.push("/login")}>
                                Inizia ora
                                <MoveRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2" onClick={() => router.push("/login")}>
                                Scopri di più
                            </Button>
                        </div>

                        
                    </div>

                    {/* Visual/Mockup */}
                    <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                        {/* Abstract Background Blob */}
                        <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 to-cyan-50 rounded-full blur-3xl opacity-70 -z-10" />

                        <div className="relative rounded-2xl border bg-white shadow-2xl p-2 select-none pointer-events-none transform rotate-1 hover:rotate-0 transition-transform duration-700">
                            <div className="rounded-xl bg-slate-50 border overflow-hidden p-6 aspect-[4/3] flex flex-col gap-6">
                                {/* Mock Dashboard Header */}
                                <div className="flex items-center justify-between border-b pb-4">
                                    <div className="flex gap-2">
                                        <div className="h-3 w-3 rounded-full bg-red-400/80" />
                                        <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                                        <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
                                    </div>
                                    <div className="h-2 w-20 rounded-full bg-slate-200" />
                                </div>
                                {/* Mock Charts */}
                                <div className="grid grid-cols-2 gap-4 flex-1">
                                     <div className="rounded-xl bg-white border p-4 shadow-sm flex flex-col items-center justify-center gap-3">
                                        <div className="relative h-24 w-24 rounded-full border-8 border-primary/20 border-t-primary animate-spin-slow" />
                                        <div className="h-2 w-16 bg-slate-100 rounded" />
                                     </div>
                                     <div className="rounded-xl bg-white border p-4 shadow-sm flex flex-col gap-2">
                                         <div className="h-2 w-full bg-slate-100 rounded" />
                                         <div className="h-2 w-2/3 bg-slate-100 rounded" />
                                         <div className="mt-auto h-20 w-full bg-blue-50 rounded-lg flex items-end gap-1 p-2 pb-0">
                                             <div className="w-1/4 h-[40%] bg-blue-200 rounded-t" />
                                             <div className="w-1/4 h-[70%] bg-blue-300 rounded-t" />
                                             <div className="w-1/4 h-[50%] bg-blue-200 rounded-t" />
                                             <div className="w-1/4 h-[90%] bg-primary rounded-t" />
                                         </div>
                                     </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Cards */}
                        <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border animate-bounce-slow">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500">Safety Score</div>
                                    <div className="font-bold text-slate-900 text-lg">98%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
