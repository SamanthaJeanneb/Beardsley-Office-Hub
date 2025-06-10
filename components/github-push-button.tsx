"use client"

import { useState } from "react"
import { GitBranch, Loader2, CheckCircle, AlertCircle, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  const [showConfig, setShowConfig] = useState(false)

  // GitHub configuration state
  const [githubConfig, setGithubConfig] = useState({
    owner: process.env.NEXT_PUBLIC_GITHUB_OWNER || "SamanthaJeanneb",
    repo: process.env.NEXT_PUBLIC_GITHUB_REPO || "Beardsley-Office-Hub",
    token: process.env.NEXT_PUBLIC_GITHUB_TOKEN || "",
    branch: process.env.NEXT_PUBLIC_GITHUB_BRANCH || "main",
  })

  const handlePushToGitHub = async () => {
    setIsLoading(true)
    setStatus("idle")
    setMessage("")

    try {
      // Validate configuration
      if (!githubConfig.token) {
        throw new Error("GitHub token is required. Please configure your GitHub settings.")
      }

      if (!githubConfig.owner || !githubConfig.repo) {
        throw new Error("GitHub owner and repository name are required.")
      }

      // Test repository access first
      const testResponse = await fetch(`https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}`, {
        headers: {
          Authorization: `Bearer ${githubConfig.token}`,
          Accept: "application/vnd.github.v3+json",
        },
      })

      if (!testResponse.ok) {
        if (testResponse.status === 404) {
          throw new Error(
            `Repository '${githubConfig.owner}/${githubConfig.repo}' not found. Please check the repository name and ensure it exists.`,
          )
        } else if (testResponse.status === 401) {
          throw new Error(
            "Invalid GitHub token. Please check your token has the correct permissions (repo scope required).",
          )
        } else {
          throw new Error(`Cannot access repository: ${testResponse.status} ${testResponse.statusText}`)
        }
      }

      initializeGitHubSync(githubConfig)

      // Get current data
      const currentData = JSON.parse(exportData())

      // Push to GitHub
      const success = await pushToGitHub(currentData)

      if (success) {
        setStatus("success")
        setMessage(
          `Successfully pushed changes to ${githubConfig.owner}/${githubConfig.repo}! Vercel will deploy automatically.`,
        )
      } else {
        throw new Error("Failed to push to GitHub")
      }
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "An unexpected error occurred")
      console.error("GitHub push failed:", error)
    } finally {
      setIsLoading(false)

      // Clear status after 8 seconds
      setTimeout(() => {
        setStatus("idle")
        setMessage("")
      }, 8000)
    }
  }

  const handleConfigSave = () => {
    setShowConfig(false)
    setStatus("idle")
    setMessage("Configuration updated. Try pushing again.")
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
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

        <Dialog open={showConfig} onOpenChange={setShowConfig}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" title="Configure GitHub settings">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>GitHub Configuration</DialogTitle>
              <DialogDescription>Configure your GitHub repository settings for automatic deployment.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="owner">GitHub Owner/Username</Label>
                <Input
                  id="owner"
                  value={githubConfig.owner}
                  onChange={(e) => setGithubConfig((prev) => ({ ...prev, owner: e.target.value }))}
                  placeholder="BeardsleyAE"
                />
              </div>
              <div>
                <Label htmlFor="repo">Repository Name</Label>
                <Input
                  id="repo"
                  value={githubConfig.repo}
                  onChange={(e) => setGithubConfig((prev) => ({ ...prev, repo: e.target.value }))}
                  placeholder="Beardsley-Office-Hub"
                />
              </div>
              <div>
                <Label htmlFor="token">GitHub Token</Label>
                <Input
                  id="token"
                  type="password"
                  value={githubConfig.token}
                  onChange={(e) => setGithubConfig((prev) => ({ ...prev, token: e.target.value }))}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Create a token at GitHub Settings → Developer settings → Personal access tokens
                </p>
              </div>
              <div>
                <Label htmlFor="branch">Branch</Label>
                <Input
                  id="branch"
                  value={githubConfig.branch}
                  onChange={(e) => setGithubConfig((prev) => ({ ...prev, branch: e.target.value }))}
                  placeholder="main"
                />
              </div>
              <Button onClick={handleConfigSave} className="w-full">
                Save Configuration
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {message && (
        <Alert variant={status === "error" ? "destructive" : "default"} className="max-w-md">
          <AlertDescription className="text-sm">{message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
