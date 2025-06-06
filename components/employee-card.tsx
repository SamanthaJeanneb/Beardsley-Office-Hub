"use client"

import { useState, useEffect } from "react"
import { X, Mail, Phone, ExternalLink, Calendar, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { getVantagePointUrl, getPhotoUrl, checkPhotoExists } from "@/lib/employee-data"

interface EmployeeCardProps {
  employee: any
  onClose: () => void
}

export function EmployeeCard({ employee, onClose }: EmployeeCardProps) {
  const [photoUrl, setPhotoUrl] = useState<string>("/placeholder.svg?height=40&width=40")
  const [photoLoading, setPhotoLoading] = useState(true)

  useEffect(() => {
    if (employee?.name) {
      const checkAndSetPhoto = async () => {
        setPhotoLoading(true)

        // First try the uploaded photo if it exists
        if (employee.avatar && employee.avatar !== "/placeholder.svg?height=40&width=40") {
          const exists = await checkPhotoExists(employee.avatar)
          if (exists) {
            setPhotoUrl(employee.avatar)
            setPhotoLoading(false)
            return
          }
        }

        // Then try the standard naming convention
        const standardPhotoUrl = getPhotoUrl(employee.name)
        const exists = await checkPhotoExists(standardPhotoUrl)

        if (exists) {
          setPhotoUrl(standardPhotoUrl)
        } else {
          setPhotoUrl("/placeholder.svg?height=40&width=40")
        }

        setPhotoLoading(false)
      }

      checkAndSetPhoto()
    }
  }, [employee?.name, employee?.avatar])

  if (!employee) return null

  const vantagePointUrl = getVantagePointUrl(employee.name)

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
        <div className="relative">
          <Avatar className="h-16 w-16 border-2 border-office-maroon/20">
            {photoLoading ? (
              <AvatarFallback className="bg-gradient-to-br from-gray-200 to-gray-300">
                <User className="h-8 w-8 text-gray-400 animate-pulse" />
              </AvatarFallback>
            ) : (
              <>
                <AvatarImage
                  src={photoUrl || "/placeholder.svg"}
                  alt={employee.name}
                  onError={() => setPhotoUrl("/placeholder.svg?height=40&width=40")}
                />
                <AvatarFallback className="bg-gradient-to-br from-office-maroon to-office-maroon-light text-white text-lg">
                  {employee.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </>
            )}
          </Avatar>

          {/* Photo indicator */}
          {!photoLoading && photoUrl !== "/placeholder.svg?height=40&width=40" && (
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
              <User className="h-2 w-2 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name with proper wrapping */}
          <h3 className="font-semibold text-office-maroon break-words leading-tight text-sm sm:text-base">
            {employee.name}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground break-words leading-tight">{employee.title}</p>
          {employee.employeeNumber && <p className="text-xs text-muted-foreground">ID: {employee.employeeNumber}</p>}
        </div>
      </div>

      <Separator className="bg-office-maroon/10" />

      <div className="space-y-3">
        <div className="flex items-center gap-2 min-w-0">
          <Mail className="h-4 w-4 text-office-maroon flex-shrink-0" />
          <a
            href={`mailto:${employee.email}`}
            className="text-xs sm:text-sm hover:text-office-maroon hover:underline break-all"
            title={employee.email}
          >
            {employee.email}
          </a>
        </div>

        {employee.phone && (
          <div className="flex items-center gap-2 min-w-0">
            <Phone className="h-4 w-4 text-office-maroon flex-shrink-0" />
            <a
              href={`tel:${employee.phone}`}
              className="text-xs sm:text-sm hover:text-office-maroon hover:underline break-all"
              title={employee.phone}
            >
              {employee.phone}
            </a>
          </div>
        )}

        <div className="grid grid-cols-1 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full border-office-maroon/20 bg-white hover:bg-office-maroon hover:text-white text-xs"
            asChild
          >
            <a
              href={vantagePointUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (vantagePointUrl === "#") {
                  e.preventDefault()
                  alert("Employee number not available for VantagePoint profile")
                }
              }}
            >
              <ExternalLink className="mr-1 h-3 w-3 flex-shrink-0" />
              <span className="truncate">
                {vantagePointUrl !== "#" ? "VantagePoint Profile" : "VantagePoint (No ID)"}
              </span>
            </a>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full border-office-maroon/20 bg-white hover:bg-office-green hover:text-white text-xs"
            asChild
          >
            <a href="#" target="_blank" rel="noopener noreferrer">
              <Calendar className="mr-1 h-3 w-3 flex-shrink-0" />
              <span className="truncate">Schedule Meeting</span>
            </a>
          </Button>
        </div>
      </div>

      {employee.notes && (
        <>
          <Separator className="bg-office-maroon/10" />
          <div>
            <h4 className="mb-2 text-sm font-medium text-office-maroon">Notes</h4>
            <p className="text-xs sm:text-sm text-muted-foreground break-words whitespace-pre-wrap">{employee.notes}</p>
          </div>
        </>
      )}

      {/* Photo debug info (only in development) */}
      {process.env.NODE_ENV === "development" && (
        <div className="text-xs text-gray-400 border-t pt-2">
          <p>Expected photo: {getPhotoUrl(employee.name)}</p>
          <p>Current photo: {photoUrl}</p>
        </div>
      )}
    </div>
  )
}
