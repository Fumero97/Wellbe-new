"use client"

import React, { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { Search, Building2, ArrowUpDown, Filter, X, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FrontEndUserDTO, getMe, getOrganizations, OrganizationDTO } from "@/lib/variables"

export default function AziendePage() {
  const [user, setUser] = useState<FrontEndUserDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [organizations, setOrganizations] = useState<OrganizationDTO[]>([])
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("name-asc")
  const [filterTipo, setFilterTipo] = useState("all")
  const [filterSede, setFilterSede] = useState("all")

  useEffect(() => {
    (async () => {
      setLoading(true)
      setError(null)

      try {
        const me = await getMe()
        setUser(me)

        const organizationList = await getOrganizations()
        setOrganizations(organizationList)
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Errore nella comunicazione con il server.")
        } else {
          setError("Errore sconosciuto.")
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleOpen = (id: number) => {
    if (!user) return
    // Partners access the same company dashboard as admins
    window.location.href = `/dashboard_azienda?id_azienda=${id}`
  }

  const getInitials = (name?: string) => {
    if (!name) return "WE"
    const parts = name.trim().split(/\s+/)
    const a = parts[0]?.[0] ?? "A"
    const b = parts.length > 1 ? parts[parts.length - 1][0] : ""
    return (a + b).toUpperCase()
  }

  // Extract unique sedi and tipi
  const uniqueSedi = useMemo(() => {
    return [...new Set(organizations.map(o => o.sedeLegale).filter((s): s is string => Boolean(s)))]
  }, [organizations])

  const uniqueTipi = useMemo(() => {
    return [...new Set(organizations.map(o => o.tipo).filter((t): t is string => Boolean(t)))]
  }, [organizations])

  // Filtered and sorted data
  const filteredOrgs = useMemo(() => {
    return organizations
      .filter(org => {
        const matchesSearch = org.denominazione.toLowerCase().includes(search.toLowerCase())
        const matchesTipo = filterTipo === 'all' || org.tipo === filterTipo
        const matchesSede = filterSede === 'all' || org.sedeLegale === filterSede
        return matchesSearch && matchesTipo && matchesSede
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') {
          return a.denominazione.localeCompare(b.denominazione, 'it')
        }
        if (sortBy === 'name-desc') {
          return b.denominazione.localeCompare(a.denominazione, 'it')
        }
        return 0
      })
  }, [organizations, search, filterTipo, filterSede, sortBy])

  const clearFilters = () => {
    setSearch("")
    setFilterTipo("all")
    setFilterSede("all")
    setSortBy("name-asc")
  }

  const hasActiveFilters = filterTipo !== 'all' || filterSede !== 'all' || search !== ''

  if (loading) {
    return (
      <div className="space-y-6 mt-6">
        <Card className="border-slate-200 shadow-sm animate-pulse">
          <CardHeader>
            <div className="h-6 bg-slate-200 rounded w-1/4"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-16 bg-slate-100 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 mt-6">
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader>
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <CardTitle>Errore di caricamento</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">{error}</p>
            <Button
              variant="outline"
              className="mt-4 border-red-200 text-red-700 hover:bg-red-100"
              onClick={() => window.location.reload()}
            >
              Riprova
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 mt-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Building2 className="h-8 w-8 text-blue-600" />
          Aziende
        </h1>
        <p className="text-slate-500">Gestisci le aziende clienti</p>
      </div>

      {/* Filters & Controls */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cerca per nome..."
                className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Nome A-Z</SelectItem>
                <SelectItem value="name-desc">Nome Z-A</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter Tipo */}
            {uniqueTipi.length > 0 && (
              <Select value={filterTipo} onValueChange={setFilterTipo}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Tutti i tipi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i tipi</SelectItem>
                  {uniqueTipi.map(tipo => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Filter Sede */}
            {uniqueSedi.length > 0 && (
              <Select value={filterSede} onValueChange={setFilterSede}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Tutte le sedi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutte le sedi</SelectItem>
                  {uniqueSedi.map(sede => (
                    <SelectItem key={sede} value={sede}>{sede}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Cancella filtri
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Desktop Table View */}
      <Card className="border-slate-200 shadow-sm hidden md:block">
        <CardHeader>
          <CardTitle>Elenco Aziende ({filteredOrgs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrgs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]"></TableHead>
                  <TableHead>Denominazione</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Sede Legale</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrgs.map(org => (
                  <TableRow key={org.id} className="hover:bg-slate-50">
                    <TableCell>
                      <Avatar className="h-10 w-10 border border-slate-200">
                        <AvatarFallback className="bg-gradient-to-br from-blue-50 to-white text-blue-600 font-semibold">
                          {getInitials(org.denominazione)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">{org.denominazione}</TableCell>
                    <TableCell>
                      {org.tipo && (
                        <Badge variant="secondary" className="font-normal">
                          {org.tipo}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-600">{org.sedeLegale || "Non specificata"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        className="bg-slate-900 hover:bg-blue-600 text-white"
                        onClick={() => handleOpen(org.id)}
                      >
                        Gestisci
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Building2 className="h-12 w-12 mb-3" />
              <p>Nessuna azienda trovata</p>
              {hasActiveFilters && (
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Cancella filtri
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {filteredOrgs.length > 0 ? (
          filteredOrgs.map(org => (
            <Card key={org.id} className="border-slate-200 shadow-sm">
              <CardHeader className="flex-row items-center gap-3 pb-3">
                <Avatar className="h-12 w-12 border border-slate-200">
                  <AvatarFallback className="bg-gradient-to-br from-blue-50 to-white text-blue-600 font-semibold">
                    {getInitials(org.denominazione)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg line-clamp-1">{org.denominazione}</CardTitle>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {org.tipo && (
                      <Badge variant="secondary" className="font-normal text-xs">
                        {org.tipo}
                      </Badge>
                    )}
                    <span className="text-sm text-slate-600">{org.sedeLegale || "Non specificata"}</span>
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="pt-0">
                <Button
                  className="w-full bg-slate-900 hover:bg-blue-600 text-white"
                  onClick={() => handleOpen(org.id)}
                >
                  Gestisci Workspace
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Card className="border-slate-200">
            <CardContent className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Building2 className="h-12 w-12 mb-3" />
              <p>Nessuna azienda trovata</p>
              {hasActiveFilters && (
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Cancella filtri
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
