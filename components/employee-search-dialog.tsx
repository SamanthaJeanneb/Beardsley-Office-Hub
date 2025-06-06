"use client"

import { useState, useEffect } from "react"
import { Search, User, MapPin, Mail, ExternalLink, X } from "lucide-react"

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
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { searchEmployees } from "@/lib/employee-data"
import { getVantagePointUrl, getPhotoUrl, checkPhotoExists } from "@/lib/employee-data"

interface EmployeeSearchDialogProps {
  allLocations: any[]
}

export function EmployeeSearchDialog({ allLocations }: EmployeeSearchDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({})

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        setIsSearching(true)
        const results = searchEmployees(searchQuery, allLocations)
        setSearchResults(results)
        setIsSearching(false)
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, allLocations])

  // Load photos for search results
  useEffect(() => {
    const loadPhotos = async () => {
      const newPhotoUrls: Record<string, string> = {}

      for (const result of searchResults) {
        const employee = result.employee
        if (employee?.name && !photoUrls[employee.name]) {
          // First try the uploaded photo if it exists
          if (employee.avatar && employee.avatar !== "/placeholder.svg?height=40&width=40") {
            const exists = await checkPhotoExists(employee.avatar)
            if (exists) {
              newPhotoUrls[employee.name] = employee.avatar
              continue
            }
          }

          // Then try the standard naming convention
          const standardPhotoUrl = getPhotoUrl(employee.name)
          const exists = await checkPhotoExists(standardPhotoUrl)
          newPhotoUrls[employee.name] = exists ? standardPhotoUrl : "/placeholder.svg?height=40&width=40"
        }
      }

      if (Object.keys(newPhotoUrls).length > 0) {
        setPhotoUrls((prev) => ({ ...prev, ...newPhotoUrls }))
      }
    }

    if (searchResults.length > 0) {
      loadPhotos()
    }
  }, [searchResults, photoUrls])

  const handleEmployeeClick = (result: any) => {
    setIsOpen(false)
    // Navigate to the employee's location
    window.location.href = `/location/${result.location.id}`
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-office-maroon/20 bg-white hover:bg-office-maroon hover:text-white">
          <Search className="mr-2 h-4 w-4" />
          Find Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-office-maroon">
            <Search className="h-5 w-5" />
            Employee Search
          </DialogTitle>
          <DialogDescription>
            Search for employees across all office locations by name, title, email, or employee number.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, title, email, or employee number..."
              className="pl-10 pr-10"
              autoFocus
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Search Results */}
          <div className="flex-1 overflow-y-auto">
            {isSearching && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-office-maroon mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Searching...</p>
                </div>
              </div>
            )}

            {!isSearching && searchQuery && searchResults.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No employees found matching "{searchQuery}"</p>
                </div>
              </div>
            )}

            {!isSearching && searchResults.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-3">
                  Found {searchResults.length} employee{searchResults.length !== 1 ? "s" : ""}
                </p>

                {searchResults.map((result, index) => {
                  const employee = result.employee
                  const location = result.location
                  const floor = result.floor
                  const vantagePointUrl = getVantagePointUrl(employee.name)
                  const photoUrl = photoUrls[employee.name] || "/placeholder.svg?height=40&width=40"

                  return (
                    <div
                      key={`${employee.id}-${index}`}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleEmployeeClick(result)}
                    >
                      <Avatar className="h-12 w-12 border-2 border-office-maroon/20">
                        <AvatarImage
                          src={photoUrl || "/placeholder.svg"}
                          alt={employee.name}
                          onError={() => {
                            setPhotoUrls((prev) => ({
                              ...prev,
                              [employee.name]: "/placeholder.svg?height=40&width=40",
                            }))
                          }}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-office-maroon to-office-maroon-light text-white">
                          {employee.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-office-maroon truncate">{employee.name}</h4>
                          {employee.employeeNumber && (
                            <Badge variant="outline" className="text-xs">
                              #{employee.employeeNumber}
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground truncate mb-1">{employee.title}</p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>
                              {location.name} - {floor.name}
                            </span>
                          </div>
                          {employee.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span className="truncate max-w-[150px]">{employee.email}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEmployeeClick(result)
                          }}
                        >
                          <MapPin className="h-3 w-3 mr-1" />
                          View
                        </Button>

                        {vantagePointUrl !== "#" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-7"
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(vantagePointUrl, "_blank")
                            }}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Profile
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {!searchQuery && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Start typing to search for employees</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Search by name, title, email, phone, or employee number
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
