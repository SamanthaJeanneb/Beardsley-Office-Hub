"use client"

import { useState, useMemo } from "react"
import { Search, MapPin, Building2, User, Phone, Mail, Filter, Users, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { employeeData, getPhotoUrl, getVantagePointUrl } from "@/lib/employee-data"
import { getAllLocations } from "@/lib/data"

export default function DirectoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  const locations = getAllLocations()

  // Get unique departments
  const departments = useMemo(() => {
    const depts = new Set(employeeData.map((emp) => emp.profitCenterName))
    return Array.from(depts).sort()
  }, [])

  // Get unique locations
  const locationNames = useMemo(() => {
    const locs = new Set(employeeData.map((emp) => emp.locationDescription))
    return Array.from(locs).sort()
  }, [])

  // Filter and sort employees
  const filteredEmployees = useMemo(() => {
    const filtered = employeeData.filter((employee) => {
      const matchesSearch =
        employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.profitCenterName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesLocation = locationFilter === "all" || employee.locationDescription === locationFilter
      const matchesDepartment = departmentFilter === "all" || employee.profitCenterName === departmentFilter

      return matchesSearch && matchesLocation && matchesDepartment
    })

    // Sort employees
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.fullName.localeCompare(b.fullName)
        case "title":
          return a.title.localeCompare(b.title)
        case "department":
          return a.profitCenterName.localeCompare(b.profitCenterName)
        case "location":
          return a.locationDescription.localeCompare(b.locationDescription)
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, locationFilter, departmentFilter, sortBy])

  const exportDirectory = () => {
    const csvContent = [
      ["Name", "Title", "Department", "Location", "Email", "Phone", "Employee Number"].join(","),
      ...filteredEmployees.map((emp) =>
        [
          emp.fullName,
          emp.title,
          emp.profitCenterName,
          emp.locationDescription,
          emp.email,
          emp.workPhone,
          emp.employeeNumber,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "employee-directory.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
      <div className="container px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 font-interface">Employee Directory</h1>
              <p className="text-xl text-muted-foreground mt-2 font-whitney">
                Complete directory of all Beardsley employees
              </p>
            </div>
            <Button onClick={exportDirectory} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-beardsley-red" />
                  <div>
                    <p className="text-2xl font-bold">{filteredEmployees.length}</p>
                    <p className="text-sm text-muted-foreground">
                      {filteredEmployees.length === employeeData.length ? "Total" : "Filtered"} Employees
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-beardsley-orange" />
                  <div>
                    <p className="text-2xl font-bold">{locationNames.length}</p>
                    <p className="text-sm text-muted-foreground">Locations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-beardsley-green" />
                  <div>
                    <p className="text-2xl font-bold">{departments.length}</p>
                    <p className="text-sm text-muted-foreground">Departments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-beardsley-red" />
                  <div>
                    <p className="text-2xl font-bold">{employeeData.length}</p>
                    <p className="text-sm text-muted-foreground">Total Staff</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locationNames.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="department">Department</SelectItem>
                <SelectItem value="location">Location</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Employee Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <Card
              key={employee.employeeNumber}
              className="hover:shadow-lg transition-shadow border-l-4 border-l-beardsley-red"
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16 flex-shrink-0">
                    <AvatarImage src={getPhotoUrl(employee.fullName) || "/placeholder.svg"} alt={employee.fullName} />
                    <AvatarFallback className="text-lg font-semibold bg-beardsley-red text-white">
                      {employee.fullName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{employee.fullName}</h3>
                        <p className="text-sm text-gray-600">{employee.title}</p>
                      </div>
                      <Badge variant="outline" className="ml-2 text-xs">
                        #{employee.employeeNumber}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Building2 className="h-3 w-3 mr-2 text-beardsley-orange" />
                        <span className="truncate">{employee.profitCenterName}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-3 w-3 mr-2 text-beardsley-green" />
                        <span className="truncate">{employee.locationDescription}</span>
                      </div>
                    </div>

                    <div className="space-y-1 mb-4">
                      <a
                        href={`mailto:${employee.email}`}
                        className="flex items-center text-sm text-beardsley-red hover:underline"
                      >
                        <Mail className="h-3 w-3 mr-2" />
                        <span className="truncate">{employee.email}</span>
                      </a>
                      <a
                        href={`tel:${employee.workPhone}`}
                        className="flex items-center text-sm text-beardsley-orange hover:underline"
                      >
                        <Phone className="h-3 w-3 mr-2" />
                        <span>{employee.workPhone}</span>
                      </a>
                    </div>

                    <div className="flex gap-2">
                      <Button asChild size="sm" className="bg-beardsley-red hover:bg-beardsley-red-dark text-xs">
                        <a href={getVantagePointUrl(employee.fullName)} target="_blank" rel="noopener noreferrer">
                          VantagePoint
                        </a>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="text-xs">
                        <a href={`mailto:${employee.email}`}>Email</a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No employees found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
