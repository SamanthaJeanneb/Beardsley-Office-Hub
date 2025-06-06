"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Building, MapPin, Phone, Clock, Wifi } from "lucide-react"

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

interface NewOfficeDialogProps {
  onOfficeAdded: () => void
}

export function NewOfficeDialog({ onOfficeAdded }: NewOfficeDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    hours: "Mon-Fri: 8:00 AM - 5:00 PM",
    wifi: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create new location data structure
      const newLocation = {
        id: formData.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
        name: formData.name,
        address: formData.address,
        image: "/placeholder.svg?height=200&width=400",
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
            seats: Array.from({ length: 20 }, (_, index) => ({
              id: `seat-${index + 1}`,
              x: 80 + (index % 5) * 70,
              y: 200 + Math.floor(index / 5) * 70,
              rotation: 0,
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
        })

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
        <Button className="bg-office-maroon hover:bg-office-maroon-light">
          <Plus className="mr-2 h-4 w-4" />
          Create New Office
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-office-maroon">
            <Building className="h-5 w-5" />
            Create New Office
          </DialogTitle>
          <DialogDescription>
            Add a new office location to the system. You can customize the layout and add employees later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="office-name" className="flex items-center gap-2">
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="office-address" className="flex items-center gap-2">
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
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="office-phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-office-maroon" />
              Phone Number
            </Label>
            <Input
              id="office-phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="(555) 123-4567"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="office-hours" className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-office-maroon" />
              Business Hours
            </Label>
            <Input
              id="office-hours"
              value={formData.hours}
              onChange={(e) => handleInputChange("hours", e.target.value)}
              placeholder="Mon-Fri: 8:00 AM - 5:00 PM"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="office-wifi" className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-office-maroon" />
              Wi-Fi Network
            </Label>
            <Input
              id="office-wifi"
              value={formData.wifi}
              onChange={(e) => handleInputChange("wifi", e.target.value)}
              placeholder="Office-Guest (optional)"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-2 pt-4">
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
