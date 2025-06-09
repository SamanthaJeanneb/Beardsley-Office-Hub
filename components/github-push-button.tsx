"use client"

import { useState } from "react"
import { GitBranch, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { exportData } from "@/lib/data"
import { pushToGitHub, initializeGitHubSync } from "@/lib/github-sync"

interface GitHubPushButtonProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showText?: boolean
}

export function GitHubPushButton({
  variant = "default",
  size = "default",
  className = "",
  showText = true,
}: GitHubPushButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handlePushToGitHub = async () => {
    setIsLoading(true)
    setStatus("idle")
    setMessage("")

    try {
      // Initialize GitHub sync with environment variables
      // In production, these would be set in Vercel environment variables
      const githubConfig = {
        owner: process.env.NEXT_PUBLIC_GITHUB_OWNER || "your-username",
        repo: process.env.NEXT_PUBLIC_GITHUB_REPO || "office-seating-charts",
        token: process.env.NEXT_PUBLIC_GITHUB_TOKEN || "",
        branch: process.env.NEXT_PUBLIC_GITHUB_BRANCH || "main",
      }

      if (!githubConfig.token) {
        throw new Error("GitHub token not configured. Please set NEXT_PUBLIC_GITHUB_TOKEN environment variable.")
      }

      initializeGitHubSync(githubConfig)

      // Get current data
      const currentData = JSON.parse(exportData())

      // Push to GitHub
      const success = await pushToGitHub(currentData)

      if (success) {
        setStatus("success")
        setMessage("Successfully pushed changes to GitHub! Vercel will deploy automatically.")
      } else {
        throw new Error("Failed to push to GitHub")
      }
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "An unexpected error occurred")
      console.error("GitHub push failed:", error)
    } finally {
      setIsLoading(false)

      // Clear status after 5 seconds
      setTimeout(() => {
        setStatus("idle")
        setMessage("")
      }, 5000)
    }
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handlePushToGitHub}
        disabled={isLoading}
        variant={variant}
        size={size}
        className={className}
        title="Push changes to GitHub and deploy to Vercel"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : status === "success" ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : status === "error" ? (
          <AlertCircle className="h-4 w-4 text-red-600" />
        ) : (
          <GitBranch className="h-4 w-4" />
        )}
        {showText && (
          <span className="ml-2">
            {isLoading
              ? "Pushing..."
              : status === "success"
                ? "Pushed!"
                : status === "error"
                  ? "Failed"
                  : "Push to GitHub"}
          </span>
        )}
      </Button>

      {message && (
        <Alert variant={status === "error" ? "destructive" : "default"} className="max-w-md">
          <AlertDescription className="text-sm">{message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
