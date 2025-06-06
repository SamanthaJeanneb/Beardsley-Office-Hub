"use client"

import { useState, useEffect } from "react"
import { User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getPhotoUrl, checkPhotoExists } from "@/lib/employee-data"

interface EmployeeHoverCardProps {
  employee: any
}

export function EmployeeHoverCard({ employee }: EmployeeHoverCardProps) {
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

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10 border-2 border-office-maroon/20">
        {photoLoading ? (
          <AvatarFallback className="bg-gradient-to-br from-gray-200 to-gray-300">
            <User className="h-5 w-5 text-gray-400 animate-pulse" />
          </AvatarFallback>
        ) : (
          <>
            <AvatarImage
              src={photoUrl || "/placeholder.svg"}
              alt={employee.name}
              onError={() => setPhotoUrl("/placeholder.svg?height=40&width=40")}
            />
            <AvatarFallback className="bg-gradient-to-br from-office-maroon to-office-maroon-light text-white">
              {employee.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </>
        )}
      </Avatar>
      <div>
        <h4 className="text-sm font-medium text-office-maroon break-words leading-tight">{employee.name}</h4>
        <p className="text-xs text-muted-foreground break-words leading-tight">{employee.title}</p>
      </div>
    </div>
  )
}
