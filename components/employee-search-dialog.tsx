"use client"

import { useState } from "react"
import { Search, MapPin, Building2, User, Phone, Mail, ExternalLink } from "lucide-react"
import Link from "next/link"
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
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Employee {
  id: string
  name: string
  title: string
  department: string
  email: string
  phone: string
  photo?: string
}

interface EmployeeSearchDialogProps {
  allLocations: any[]
  buttonProps?: any
}

export function EmployeeSearchDialog({ allLocations, buttonProps }: EmployeeSearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Get all employees from all locations
  const getAllEmployees = () => {
    const employees: any[] = []
    allLocations.forEach((location) => {
      location.floors?.forEach((floor: any) => {
        floor.seats?.forEach((seat: any) => {
          if (seat.employee) {
            employees.push({
              ...seat.employee,
              locationId: location.id,
              locationName: location.name,
              floorName: floor.name,
              seatId: seat.id,
            })
          }
        })
      })
    })
    return employees
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (term.trim() === "") {
      setSearchResults([])
      return
    }

    const allEmployees = getAllEmployees()
    const filtered = allEmployees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(term.toLowerCase()) ||
        employee.title?.toLowerCase().includes(term.toLowerCase()) ||
        employee.department?.toLowerCase().includes(term.toLowerCase()) ||
        employee.email?.toLowerCase().includes(term.toLowerCase()),
    )
    setSearchResults(filtered)
  }

  const defaultButtonProps = {
    size: "default" as const,
    variant: "secondary" as const,
    className: "bg-white text-beardsley-red hover:bg-gray-100 shadow-lg px-6 py-3 font-whitney",
  }

  const finalButtonProps = { ...defaultButtonProps, ...buttonProps }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button {...finalButtonProps}>
          <Search className="mr-2 h-4 w-4" />
          Find Employees
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Employee Directory</DialogTitle>
          <DialogDescription>Search for employees across all office locations</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name, title, department, or email..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 text-lg py-6"
              autoFocus
            />
          </div>

          <div className="max-h-[55vh] overflow-y-auto space-y-3">
            {searchTerm && searchResults.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <User className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg">No employees found matching "{searchTerm}"</p>
              </div>
            )}

            {searchResults.map((employee, index) => (
              <Card
                key={`${employee.locationName}-${employee.floorName}-${employee.seatId}-${index}`}
                className="hover:shadow-md transition-shadow border-l-4 border-l-beardsley-red"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-6">
                    <Avatar className="h-20 w-20 flex-shrink-0">
                      <AvatarImage src={employee.photo ? `/photos/${employee.photo}` : undefined} alt={employee.name} />
                      <AvatarFallback className="text-xl font-semibold bg-beardsley-red text-white">
                        {employee.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-2xl font-semibold text-gray-900">{employee.name}</h3>
                          <p className="text-lg text-gray-600 mt-1">{employee.title}</p>
                        </div>
                        <Badge variant="outline" className="ml-4 text-sm px-3 py-1">
                          {employee.department || "Staff"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-600">
                            <Building2 className="h-4 w-4 mr-2 text-beardsley-orange" />
                            <span className="font-medium">Location:</span>
                            <span className="ml-1">{employee.locationName}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 text-beardsley-green" />
                            <span className="font-medium">Floor:</span>
                            <span className="ml-1">{employee.floorName}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {employee.email && (
                            <div className="flex items-center text-gray-600">
                              <Mail className="h-4 w-4 mr-2 text-beardsley-red" />
                              <a
                                href={`mailto:${employee.email}`}
                                className="text-beardsley-red hover:underline truncate"
                              >
                                {employee.email}
                              </a>
                            </div>
                          )}
                          {employee.phone && (
                            <div className="flex items-center text-gray-600">
                              <Phone className="h-4 w-4 mr-2 text-beardsley-orange" />
                              <a href={`tel:${employee.phone}`} className="text-beardsley-orange hover:underline">
                                {employee.phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button asChild size="sm" className="bg-beardsley-red hover:bg-beardsley-red-dark">
                          <Link href={`/location/${employee.locationId}`} onClick={() => setIsOpen(false)}>
                            <MapPin className="h-4 w-4 mr-1" />
                            View Seating Chart
                          </Link>
                        </Button>

                        {employee.vantagePointId && (
                          <Button asChild size="sm" variant="outline">
                            <a
                              href={`https://vantagepoint.beardsley.com/employee/${employee.vantagePointId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              VantagePoint Profile
                            </a>
                          </Button>
                        )}

                        <Button asChild size="sm" variant="outline">
                          <a href={`mailto:${employee.email}`}>
                            <Mail className="h-4 w-4 mr-1" />
                            Send Email
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
