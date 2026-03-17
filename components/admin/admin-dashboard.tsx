"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Logo } from "@/components/ui/logo"
import {
  Shield,
  Users,
  MessageSquare,
  Flag,
  AlertTriangle,
  Eye,
  Ban,
  Check,
  X,
  Search,
  ChevronDown,
  MoreHorizontal,
  ArrowLeft,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Report {
  id: string
  type: "character" | "chat"
  targetName: string
  targetId: string
  reason: string
  reporter: string
  reporterEmail: string
  snippet?: string
  status: "pending" | "reviewed" | "resolved" | "dismissed"
  createdAt: string
}

const MOCK_REPORTS: Report[] = [
  {
    id: "rep-1",
    type: "character",
    targetName: "Dark Lord Malice",
    targetId: "char-evil",
    reason: "Inappropriate content",
    reporter: "user_123",
    reporterEmail: "user123@email.com",
    status: "pending",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "rep-2",
    type: "character",
    targetName: "Celebrity Clone",
    targetId: "char-clone",
    reason: "Impersonation",
    reporter: "moderator_5",
    reporterEmail: "mod5@idolchat.com",
    status: "reviewed",
    createdAt: "2024-01-14T15:45:00Z",
  },
  {
    id: "rep-3",
    type: "chat",
    targetName: "Luna Starweaver",
    targetId: "char-1",
    reason: "Harmful advice",
    reporter: "concerned_user",
    reporterEmail: "concerned@email.com",
    snippet: "The character suggested unsafe behavior when asked about...",
    status: "pending",
    createdAt: "2024-01-15T08:20:00Z",
  },
  {
    id: "rep-4",
    type: "chat",
    targetName: "Study Buddy AI",
    targetId: "char-study",
    reason: "Off-topic responses",
    reporter: "student_42",
    reporterEmail: "student42@edu.com",
    snippet: "Instead of helping with homework, the character started...",
    status: "resolved",
    createdAt: "2024-01-13T20:00:00Z",
  },
  {
    id: "rep-5",
    type: "character",
    targetName: "Spam Bot",
    targetId: "char-spam",
    reason: "Spam/Advertising",
    reporter: "admin_1",
    reporterEmail: "admin@idolchat.com",
    status: "resolved",
    createdAt: "2024-01-12T12:00:00Z",
  },
]

const STATUS_COLORS = {
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  reviewed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  resolved: "bg-green-500/20 text-green-400 border-green-500/30",
  dismissed: "bg-muted text-muted-foreground border-border",
}

export function AdminDashboard() {
  const [reports, setReports] = useState(MOCK_REPORTS)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reporter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const characterReports = filteredReports.filter((r) => r.type === "character")
  const chatReports = filteredReports.filter((r) => r.type === "chat")

  const updateReportStatus = (id: string, status: Report["status"]) => {
    setReports(reports.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === "pending").length,
    reviewed: reports.filter((r) => r.status === "reviewed").length,
    resolved: reports.filter((r) => r.status === "resolved").length,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/discover" className="flex items-center gap-2">
              <Logo className="w-8 h-8" />
              <span className="font-bold text-lg">IdolChat</span>
            </Link>
            <Badge variant="outline" className="border-primary/30 text-primary">
              <Shield className="w-3 h-3 mr-1" />
              Admin
            </Badge>
          </div>

          <Link href="/discover">
            <Button variant="outline" size="sm" className="border-border/50 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to App
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Moderation Dashboard</h1>
          <p className="text-muted-foreground">Review and manage reported content</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-card/50 border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Flag className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Reports</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card/50 border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card/50 border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.reviewed}</p>
                <p className="text-sm text-muted-foreground">In Review</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card/50 border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.resolved}</p>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50 border-border/50"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-border/50 min-w-[140px] justify-between bg-transparent">
                {statusFilter === "all" ? "All Status" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Status</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("reviewed")}>Reviewed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("resolved")}>Resolved</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("dismissed")}>Dismissed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="characters" className="space-y-6">
          <TabsList className="bg-secondary/50 border border-border/50">
            <TabsTrigger value="characters" className="data-[state=active]:bg-primary/20">
              <Users className="w-4 h-4 mr-2" />
              Characters ({characterReports.length})
            </TabsTrigger>
            <TabsTrigger value="chats" className="data-[state=active]:bg-primary/20">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chats ({chatReports.length})
            </TabsTrigger>
          </TabsList>

          {/* Character Reports */}
          <TabsContent value="characters">
            <Card className="bg-card/50 border-border/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-secondary/30">
                      <th className="text-left p-4 font-medium text-muted-foreground">Character</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Reason</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Reporter</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {characterReports.length > 0 ? (
                      characterReports.map((report) => (
                        <tr key={report.id} className="border-b border-border/30 hover:bg-secondary/20">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary/30 to-accent/30 flex items-center justify-center font-bold">
                                {report.targetName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium">{report.targetName}</p>
                                <p className="text-xs text-muted-foreground">{report.targetId}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-sm">{report.reason}</span>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="text-sm">{report.reporter}</p>
                              <p className="text-xs text-muted-foreground">{report.reporterEmail}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className={STATUS_COLORS[report.status]}>{report.status}</Badge>
                          </td>
                          <td className="p-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => updateReportStatus(report.id, "reviewed")}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Review
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateReportStatus(report.id, "resolved")}>
                                  <Check className="w-4 h-4 mr-2" />
                                  Resolve
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-amber-400">
                                  <AlertTriangle className="w-4 h-4 mr-2" />
                                  Warn Creator
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <Ban className="w-4 h-4 mr-2" />
                                  Hide Character
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateReportStatus(report.id, "dismissed")}>
                                  <X className="w-4 h-4 mr-2" />
                                  Dismiss
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                          No character reports found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Chat Reports */}
          <TabsContent value="chats">
            <Card className="bg-card/50 border-border/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-secondary/30">
                      <th className="text-left p-4 font-medium text-muted-foreground">Chat/Character</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Snippet</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Reporter</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chatReports.length > 0 ? (
                      chatReports.map((report) => (
                        <tr key={report.id} className="border-b border-border/30 hover:bg-secondary/20">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{report.targetName}</p>
                                <p className="text-xs text-muted-foreground">{report.reason}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 max-w-[300px]">
                            <p className="text-sm text-muted-foreground truncate">
                              {report.snippet || "No snippet available"}
                            </p>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="text-sm">{report.reporter}</p>
                              <p className="text-xs text-muted-foreground">{report.reporterEmail}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className={STATUS_COLORS[report.status]}>{report.status}</Badge>
                          </td>
                          <td className="p-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => updateReportStatus(report.id, "reviewed")}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Review
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateReportStatus(report.id, "resolved")}>
                                  <Check className="w-4 h-4 mr-2" />
                                  Resolve
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-amber-400">
                                  <AlertTriangle className="w-4 h-4 mr-2" />
                                  Warn Creator
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateReportStatus(report.id, "dismissed")}>
                                  <X className="w-4 h-4 mr-2" />
                                  Dismiss
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                          No chat reports found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
