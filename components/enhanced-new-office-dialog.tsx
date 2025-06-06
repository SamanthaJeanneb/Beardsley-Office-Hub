"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Plus, Building, MapPin, Phone, Clock, Wifi, Upload, ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
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
import { Textarea } from "@/components/ui/textarea"
import { addNewLocation } from "@/lib/data"

interface EnhancedNewOfficeDialogProps {
  onOfficeAdded: () => void
}

export function EnhancedNewOfficeDialog({ onOfficeAdded }: EnhancedNewOfficeDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    hours: "Mon-Fri: 8:00 AM - 5:00 PM",
    wifi: "",
    image: null as File | null,
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Convert image to base64 if provided
      let imageDataUrl = "/placeholder.svg?height=200&width=400"
      if (formData.image) {
        const reader = new FileReader()
        imageDataUrl = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(formData.image!)
        })
      }

      // Create new location data structure
      const newLocation = {
        id: formData.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
        name: formData.name,
        address: formData.address,
        image: imageDataUrl,
        phone: formData.phone,
        hours: formData.hours,
        wifi: formData.wifi || `${formData.name}-Office-Net`,
        amenitiesList: [
          { name: "Printers" },
          { name: "Restrooms" },
          { name: "Emergency Exits" },
          { name: "Kitchen" },
          { name: "Conference Rooms" },
          { name: "Wi-Fi" },
        ],
        quickLinks: [
          { name: "IT Support", url: "#" },
          { name: "Book Room", url: "#" },
          { name: "Report Issue", url: "#" },
        ],
        floors: [
          {
            id: "floor-1",
            name: "Floor 1",
            rooms: [
              { id: "room-1", name: "Reception", x: 50, y: 50, width: 200, height: 100, type: "reception" },
              { id: "room-2", name: "Open Space", x: 50, y: 170, width: 400, height: 250, type: "office" },
              { id: "room-3", name: "Conference Room", x: 300, y: 50, width: 150, height: 100, type: "conference" },
            ],
            furniture: [
              // Default furniture layout
              { id: "desk-1", type: "desk", x: 120, y: 80, width: 60, height: 40, rotation: 0 },
              { id: "desk-2", type: "desk", x: 80, y: 200, width: 60, height: 40, rotation: 0 },
              { id: "desk-3", type: "desk", x: 160, y: 200, width: 60, height: 40, rotation: 0 },
              { id: "desk-4", type: "desk", x: 240, y: 200, width: 60, height: 40, rotation: 0 },
              { id: "desk-5", type: "desk", x: 320, y: 200, width: 60, height: 40, rotation: 0 },
              { id: "table-1", type: "table", x: 315, y: 75, width: 120, height: 50, rotation: 0 },
            ],
            amenities: [
              {
                id: "printer-1",
                type: "printer",
                name: "Office Printer",
                ipAddress: "192.168.1.101",
                queueName: "OFFICE-PRINT-01",
                status: "Online",
                x: 400,
                y: 120,
              },
              { id: "restroom-1", type: "restroom", name: "Restroom", x: 400, y: 50 },
              { id: "exit-1", type: "exit", name: "Emergency Exit", x: 470, y: 50 },
              { id: "kitchen-1", type: "kitchen", name: "Kitchen", x: 470, y: 120 },
            ],
            seats: Array.from({ length: 10 }, (_, index) => ({
              id: `seat-${index + 1}`,
              x: 110 + (index % 5) * 80,
              y: 220 + Math.floor(index / 5) * 80,
              rotation: 0,
              furnitureId: index < 5 ? `desk-${index + 2}` : null,
              employee: null, // Empty seats for new office
            })),
          },
        ],
      }

      const success = addNewLocation(newLocation)

      if (success) {
        // Reset form
        setFormData({
          name: "",
          address: "",
          phone: "",
          hours: "Mon-Fri: 8:00 AM - 5:00 PM",
          wifi: "",
          image: null,
        })
        setImagePreview(null)

        setIsOpen(false)
        onOfficeAdded()
      } else {
        alert("Failed to create office. An office with this name may already exist.")
      }
    } catch (error) {
      console.error("Error creating office:", error)
      alert("Failed to create office. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-office-maroon hover:bg-office-maroon-light text-white shadow-lg">
          <Plus className="mr-2 h-5 w-5" />
          Create New Office
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-office-maroon text-xl">
            <Building className="h-6 w-6" />
            Create New Office
          </DialogTitle>
          <DialogDescription className="text-base">
            Add a new office location to the system. You can customize the layout and add employees later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Office Image Upload */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base font-medium">
              <ImageIcon className="h-4 w-4 text-office-maroon" />
              Office Image
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-office-maroon transition-colors">
              {imagePreview ? (
                <div className="space-y-3">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Office preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setImagePreview(null)
                      setFormData((prev) => ({ ...prev, image: null }))
                      if (fileInputRef.current) fileInputRef.current.value = ""
                    }}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                    >
                      Upload Image
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">JPG, PNG up to 5MB</p>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="office-name" className="flex items-center gap-2 text-base font-medium">
              <Building className="h-4 w-4 text-office-maroon" />
              Office Name *
            </Label>
            <Input
              id="office-name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., Rochester Office"
              required
              disabled={isLoading}
              className="text-base"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="office-address" className="flex items-center gap-2 text-base font-medium">
              <MapPin className="h-4 w-4 text-office-maroon" />
              Address *
            </Label>
            <Textarea
              id="office-address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="123 Main Street, City, State 12345"
              required
              disabled={isLoading}
              rows={3}
              className="text-base"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="office-phone" className="flex items-center gap-2 text-base font-medium">
                <Phone className="h-4 w-4 text-office-maroon" />
                Phone Number
              </Label>
              <Input
                id="office-phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="(555) 123-4567"
                disabled={isLoading}
                className="text-base"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="office-wifi" className="flex items-center gap-2 text-base font-medium">
                <Wifi className="h-4 w-4 text-office-maroon" />
                Wi-Fi Network
              </Label>
              <Input
                id="office-wifi"
                value={formData.wifi}
                onChange={(e) => handleInputChange("wifi", e.target.value)}
                placeholder="Office-Guest"
                disabled={isLoading}
                className="text-base"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="office-hours" className="flex items-center gap-2 text-base font-medium">
              <Clock className="h-4 w-4 text-office-maroon" />
              Business Hours
            </Label>
            <Input
              id="office-hours"
              value={formData.hours}
              onChange={(e) => handleInputChange("hours", e.target.value)}
              placeholder="Mon-Fri: 8:00 AM - 5:00 PM"
              disabled={isLoading}
              className="text-base"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.name.trim() || !formData.address.trim()}
              className="flex-1 bg-office-maroon hover:bg-office-maroon-light"
            >
              {isLoading ? "Creating..." : "Create Office"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
