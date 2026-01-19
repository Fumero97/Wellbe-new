// app/organizations/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Search, Building2, ArrowRight, AlertTriangle, LayoutGrid, List } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FrontEndUserDTO, getMe, getOrganizations, OrganizationDTO } from "@/lib/variables";

export default function Page() {
    const [user, setUser] = useState<FrontEndUserDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [organizations, setOrganizations] = useState<OrganizationDTO[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError(null);

            try {
                const me = await getMe();
                setUser(me);

                const organizationList = await getOrganizations();
                setOrganizations(organizationList);
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.message || "Errore nella comunicazione con il server.");
                } else {
                    setError("Errore sconosciuto.");
                }
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleOpen = (id: number) => {
        if (!user) return;
        const base = user.ruolo === "partner" ? "/partner_view" : "/dashboard_azienda";
        window.location.href = `${base}?id_azienda=${id}`;
    };

    const filteredOrgs = useMemo(() => {
        const q = search.trim().toLowerCase();
        return [...organizations]
            .sort((a, b) =>
                a.denominazione.localeCompare(b.denominazione, "it", { sensitivity: "base" })
            )
            .filter((org) => org.denominazione?.toLowerCase().includes(q));
    }, [organizations, search]);

    const roleLabel = user?.ruolo === "partner" ? "Partner" : user?.ruolo || "Utente";
    const fullName = [user?.nome, user?.cognome].filter(Boolean).join(" ") || user?.email || "";

    const getInitials = (name?: string) => {
        if (!name) return "WE";
        const parts = name.trim().split(/\s+/);
        const a = parts[0]?.[0] ?? "A";
        const b = parts.length > 1 ? parts[parts.length - 1][0] : "";
        return (a + b).toUpperCase();
    };


    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
             {/* Decorative Background */}
             <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl opacity-50 mix-blend-multiply filter" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-100/40 rounded-full blur-3xl opacity-50 mix-blend-multiply filter" />
            </div>

            {/* Top bar */}
            <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
                <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
                    <div className="flex items-center gap-3">
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/img/Wellbe-logo-blue.svg" alt="Wellbe Logo" className="h-6 sm:h-7" />
                    </div>

                    <div className="flex items-center gap-4">
                        {/* User Profile */}
                        <div className="hidden md:flex items-center gap-3 pl-4 border-l border-slate-200">
                             <div className="text-right">
                                <div className="text-sm font-semibold text-slate-900">{fullName}</div>
                                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">{roleLabel}</div>
                            </div>
                            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 p-[2px] shadow-sm">
                                <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-blue-700">
                                    {getInitials(fullName)}
                                </div>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full px-4"
                            onClick={() => (window.location.href = "/logout")}
                        >
                            Esci
                        </Button>
                    </div>
                </nav>
            </header>

            <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
                
                {/* Section Header */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                         <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                            Le tue Organizzazioni
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl">
                            Seleziona l&apos;azienda operativa per accedere alla dashboard di gestione benessere e CSR.
                        </p>
                    </div>
                   
                   {/* Search Bar */}
                   <div className="w-full md:w-auto relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <Input
                            className="w-full md:w-80 pl-10 pr-4 h-11 bg-white border-slate-200 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            placeholder="Cerca per nome..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                   </div>
                </div>


                {/* Loading State */}
                {loading && (
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="h-64 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm animate-pulse flex flex-col justify-between">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 rounded-2xl bg-slate-100" />
                                        <div className="space-y-2">
                                            <div className="h-4 w-32 bg-slate-100 rounded" />
                                            <div className="h-3 w-20 bg-slate-50 rounded" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 pt-2">
                                        <div className="h-2 w-full bg-slate-50 rounded" />
                                        <div className="h-2 w-2/3 bg-slate-50 rounded" />
                                    </div>
                                </div>
                                <div className="h-10 w-full bg-slate-50 rounded-xl" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="rounded-3xl border border-red-100 bg-red-50/50 p-8 text-center max-w-md mx-auto mt-10">
                         <div className="mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">Errore di caricamento</h3>
                        <p className="mt-2 text-slate-600">{error}</p>
                        <Button variant="outline" className="mt-6 border-red-200 text-red-700 hover:bg-red-100" onClick={() => window.location.reload()}>
                            Riprova
                        </Button>
                    </div>
                )}

                {/* Content */}
                {!loading && !error && (
                    <>
                        {filteredOrgs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                                    <Building2 className="h-10 w-10 text-slate-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900">Nessuna organizzazione trovata</h3>
                                <p className="mt-2 text-slate-500 max-w-sm mx-auto">
                                    Non abbiamo trovato aziende che corrispondono alla tua ricerca &quot;{search}&quot;.
                                </p>
                                <Button 
                                    className="mt-8 rounded-full bg-slate-900 text-white hover:bg-slate-800"
                                    onClick={() => setSearch("")}
                                >
                                    Mostra tutte
                                </Button>
                            </div>
                        ) : (
                            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {filteredOrgs.map((org) => (
                                    <div
                                        key={org.id}
                                        className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div>
                                            {/* Card Top */}
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shadow-inner">
                                                    {getInitials(org.denominazione)}
                                                </div>
                                                {org.tipo && (
                                                     <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 border border-slate-200">
                                                        {org.tipo}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Org Details */}
                                            <h3 className="font-bold text-xl text-slate-900 line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">
                                                {org.denominazione}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                                                <Building2 className="h-3.5 w-3.5" />
                                                <span className="truncate">{org.sedeLegale || "Sede non specificata"}</span>
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <Button
                                            className="w-full rounded-2xl h-11 bg-slate-900 text-white hover:bg-blue-600 shadow-lg shadow-slate-200 group-hover:shadow-blue-200 transition-all font-medium"
                                            onClick={() => handleOpen(org.id)}
                                        >
                                            Gestisci Workspace
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
