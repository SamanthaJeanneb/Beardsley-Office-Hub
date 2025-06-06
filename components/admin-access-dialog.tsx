"use client"

import type React from "react"

import { useState } from "react"
import { MoreHorizontal, Lock, Eye, EyeOff, Download, Upload, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { exportData, importData, resetToDefaults } from "@/lib/data"

interface AdminAccessDialogProps {
  onAdminAccess: (isAdmin: boolean) => void
  isAdminMode: boolean
}

export function AdminAccessDialog({ onAdminAccess, isAdminMode }: AdminAccessDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const ADMIN_PASSWORD = "B3ARd$L3YY"

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate a brief loading delay for security
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (password === ADMIN_PASSWORD) {
      onAdminAccess(true)
      setIsDialogOpen(false)
      setPassword("")
      setError("")
    } else {
      setError("Incorrect password. Access denied.")
      setPassword("")
    }

    setIsLoading(false)
  }

  const handleExitAdmin = () => {
    onAdminAccess(false)
    setPassword("")
    setError("")
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setPassword("")
    setError("")
  }

  const handleExportData = () => {
    try {
      const data = exportData()
      const blob = new Blob([data], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `office-seating-charts-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export failed:", error)
    }
  }

  const handleImportData = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string
            if (importData(content)) {
              window.location.reload() // Reload to show imported data
            } else {
              alert("Failed to import data. Please check the file format.")
            }
          } catch (error) {
            alert("Failed to import data. Invalid file format.")
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleResetData = () => {
    if (confirm("Are you sure you want to reset all data to defaults? This cannot be undone.")) {
      resetToDefaults()
      window.location.reload()
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Office options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!isAdminMode ? (
          <>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Lock className="mr-2 h-4 w-4" />
                  Admin Panel
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-office-maroon" />
                    Admin Access Required
                  </DialogTitle>
                  <DialogDescription>Enter the admin password to access the office management panel.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="admin-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter admin password"
                        className="pr-10"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={handleDialogClose} disabled={isLoading}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading || !password.trim()}>
                      {isLoading ? "Verifying..." : "Access Admin Panel"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleImportData}>
              <Upload className="mr-2 h-4 w-4" />
              Import Data
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleResetData} className="text-red-600">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset to Defaults
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={handleExitAdmin}>
              <Lock className="mr-2 h-4 w-4" />
              Exit Admin Mode
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleImportData}>
              <Upload className="mr-2 h-4 w-4" />
              Import Data
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleResetData} className="text-red-600">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset to Defaults
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
