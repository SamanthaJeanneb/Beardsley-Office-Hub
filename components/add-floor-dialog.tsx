"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Building } from "lucide-react"

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
import { addNewFloor } from "@/lib/data"

interface AddFloorDialogProps {
  locationId: string
  onFloorAdded: () => void
}

export function AddFloorDialog({ locationId, onFloorAdded }: AddFloorDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [floorName, setFloorName] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!floorName.trim()) return

    setIsLoading(true)

    try {
      const success = addNewFloor(locationId, {
        name: floorName.trim(),
      })

      if (success) {
        setFloorName("")
        setIsOpen(false)
        onFloorAdded()
      } else {
        alert("Failed to add floor. Please try again.")
      }
    } catch (error) {
      console.error("Error adding floor:", error)
      alert("Failed to add floor. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50 h-10 px-4">
          <Plus className="mr-2 h-4 w-4" />
          Add Floor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-800">
            <Building className="h-5 w-5" />
            Add New Floor
          </DialogTitle>
          <DialogDescription>
            Add a new floor to this office location. You can customize the layout after creation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="floor-name">Floor Name</Label>
            <Input
              id="floor-name"
              value={floorName}
              onChange={(e) => setFloorName(e.target.value)}
              placeholder="e.g., Second Floor, Basement, Mezzanine"
              required
              disabled={isLoading}
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
              disabled={isLoading || !floorName.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Adding..." : "Add Floor"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
