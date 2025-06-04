"use client"

import { X, Mail, Phone, ExternalLink, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

interface EmployeeCardProps {
  employee: any
  onClose: () => void
}

export function EmployeeCard({ employee, onClose }: EmployeeCardProps) {
  if (!employee) return null

  return (
    <div className="relative space-y-4">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 text-office-maroon hover:bg-office-maroon/10"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Button>

      <div className="flex items-center gap-4 pt-2">
        <Avatar className="h-16 w-16 border-2 border-office-maroon/20">
          <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
          <AvatarFallback className="bg-gradient-to-br from-office-maroon to-office-maroon-light text-white text-lg">
            {employee.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-office-maroon">{employee.name}</h3>
          <p className="text-sm text-muted-foreground">{employee.title}</p>
        </div>
      </div>

      <Separator className="bg-office-maroon/10" />

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-office-maroon" />
          <a href={`mailto:${employee.email}`} className="text-sm hover:text-office-maroon hover:underline">
            {employee.email}
          </a>
        </div>

        {employee.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-office-maroon" />
            <a href={`tel:${employee.phone}`} className="text-sm hover:text-office-maroon hover:underline">
              {employee.phone}
            </a>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 border-office-maroon/20 bg-white hover:bg-office-maroon hover:text-white"
            asChild
          >
            <a href={employee.profileUrl} target="_blank" rel="noopener noreferrer">
              <span>VantagePoint</span>
              <ExternalLink className="ml-2 h-3 w-3" />
            </a>
          </Button>

          <Button
            variant="outline"
            className="flex-1 border-office-maroon/20 bg-white hover:bg-office-green hover:text-white"
            asChild
          >
            <a href="#" target="_blank" rel="noopener noreferrer">
              <Calendar className="mr-2 h-3 w-2" />
              <span>Schedule</span>
            </a>
          </Button>
        </div>
      </div>

      {employee.notes && (
        <>
          <Separator className="bg-office-maroon/10" />
          <div>
            <h4 className="mb-2 text-sm font-medium text-office-maroon">Notes</h4>
            <p className="text-sm text-muted-foreground">{employee.notes}</p>
          </div>
        </>
      )}
    </div>
  )
}
