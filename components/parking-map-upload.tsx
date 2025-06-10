"use client"

import React, { useState, useRef } from "react"
import { Upload, X, Car, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ParkingMapUploadProps {
  locationName: string
  onMapChange: (mapUrl: string | null) => void
  currentMap?: string | null
}

export function ParkingMapUpload({ locationName, onMapChange, currentMap }: ParkingMapUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentMap || null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    // Validate file size (max 10MB for parking maps)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB")
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

      // Generate the expected filename for parking maps
      const filename = `${locationName.replace(/\s+/g, "")}ParkingMap.jpg`
      const mapUrl = `/parking-maps/${filename}`

      // In a real app, you would save the file with this name to the parking-maps folder
      console.log(`Parking map would be saved as: ${filename}`)

      onMapChange(mapUrl)
    } catch (error) {
      console.error("Error uploading parking map:", error)
      alert("Error uploading parking map. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveMap = () => {
    setPreview(null)
    onMapChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const expectedFilename = `${locationName.replace(/\s+/g, "")}ParkingMap.jpg`

  return (
    <div className="space-y-3">
      <Label>Parking Map</Label>

      <div className="flex items-center gap-4">
        {/* Map Preview */}
        <div className="relative">
          <div className="h-24 w-32 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden">
            {preview ? (
              <img
                src={preview}
                alt="Parking map preview"
                className="h-full w-full object-cover"
                onError={() => setPreview("/placeholder.svg?height=96&width=128")}
              />
            ) : (
              <Car className="h-8 w-8 text-gray-400" />
            )}
          </div>

          {preview && preview !== "/placeholder.svg?height=96&width=128" && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              onClick={handleRemoveMap}
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
            id="parking-map-upload"
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload Parking Map"}
          </Button>

          <p className="text-xs text-muted-foreground">
            Will be saved as: <code className="bg-gray-100 px-1 rounded">{expectedFilename}</code>
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, GIF. Max size: 10MB.</p>
        <p className="text-xs text-muted-foreground">
          <strong>To add parking maps manually:</strong> Place image files in the <code>/public/parking-maps/</code> folder using
          the naming convention above.
        </p>
      </div>

      {currentMap && (
        <Alert className="border-green-200 bg-green-50">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Parking map is configured for this location.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
