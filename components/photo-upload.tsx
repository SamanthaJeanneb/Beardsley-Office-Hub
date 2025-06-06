"use client"

import React from "react"

import { useState, useRef } from "react"
import { Upload, X, User, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { generatePhotoFilename, getPhotoUrl, checkPhotoExists } from "@/lib/employee-data"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PhotoUploadProps {
  employeeName: string
  onPhotoChange: (photoUrl: string | null) => void
  currentPhoto?: string | null
}

export function PhotoUpload({ employeeName, onPhotoChange, currentPhoto }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentPhoto || null)
  const [isUploading, setIsUploading] = useState(false)
  const [existingPhotoExists, setExistingPhotoExists] = useState(false)
  const [checkingExisting, setCheckingExisting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Check if photo already exists when component mounts or name changes
  React.useEffect(() => {
    if (employeeName) {
      const checkExistingPhoto = async () => {
        setCheckingExisting(true)
        const standardPhotoUrl = getPhotoUrl(employeeName)
        const exists = await checkPhotoExists(standardPhotoUrl)
        setExistingPhotoExists(exists)

        // If no current photo is set but a standard photo exists, use it
        if (!currentPhoto && exists) {
          setPreview(standardPhotoUrl)
          onPhotoChange(standardPhotoUrl)
        }

        setCheckingExisting(false)
      }

      checkExistingPhoto()
    }
  }, [employeeName, currentPhoto, onPhotoChange])

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB")
      return
    }

    setIsUploading(true)

    try {
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreview(result)
      }
      reader.readAsDataURL(file)

      // In a real application, you would upload to a server here
      // For now, we'll simulate the upload and use the local preview
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate upload delay

      // Generate the expected filename
      const filename = generatePhotoFilename(employeeName)
      const photoUrl = `/photos/${filename}`

      // In a real app, you would save the file with this name to the photos folder
      console.log(`Photo would be saved as: ${filename}`)

      onPhotoChange(photoUrl)
    } catch (error) {
      console.error("Error uploading photo:", error)
      alert("Error uploading photo. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemovePhoto = () => {
    setPreview(null)
    onPhotoChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const expectedFilename = employeeName ? generatePhotoFilename(employeeName) : ""

  return (
    <div className="space-y-3">
      <Label>Employee Photo</Label>

      {/* Existing photo notification */}
      {existingPhotoExists && !checkingExisting && (
        <Alert className="border-green-200 bg-green-50">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Photo already exists for this employee:{" "}
            <code className="bg-green-100 px-1 rounded">{expectedFilename}</code>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-4">
        {/* Photo Preview */}
        <div className="relative">
          <div className="h-20 w-20 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden">
            {checkingExisting ? (
              <User className="h-8 w-8 text-gray-400 animate-pulse" />
            ) : preview ? (
              <img
                src={preview || "/placeholder.svg"}
                alt="Employee photo preview"
                className="h-full w-full object-cover"
                onError={() => setPreview("/placeholder.svg?height=40&width=40")}
              />
            ) : (
              <User className="h-8 w-8 text-gray-400" />
            )}
          </div>

          {preview && preview !== "/placeholder.svg?height=40&width=40" && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              onClick={handleRemovePhoto}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex-1 space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="photo-upload"
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || checkingExisting}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : checkingExisting ? "Checking..." : "Upload Photo"}
          </Button>

          {expectedFilename && (
            <p className="text-xs text-muted-foreground">
              Will be saved as: <code className="bg-gray-100 px-1 rounded">{expectedFilename}</code>
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, GIF. Max size: 5MB.</p>
        <p className="text-xs text-muted-foreground">
          <strong>To add photos manually:</strong> Place image files in the <code>/public/photos/</code> folder using
          the naming convention above.
        </p>
      </div>
    </div>
  )
}
