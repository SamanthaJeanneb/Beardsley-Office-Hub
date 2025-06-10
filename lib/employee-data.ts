// Employee data utilities with corrected employee numbers from updated CSV
export interface EmployeeData {
  employeeNumber: string
  fullName: string
  locationDescription: string
  title: string
  email: string
  workPhone: string
  profitCenterName: string
  statusDescription: string
}

// Employee number mapping - cleared for custom upload
export const employeeNumberMap: Record<string, string> = {}

// Printer driver links mapping
export const printerDriverLinks: Record<string, string> = {
  "HP LaserJet Pro": "file://License/HP_LaserJet_Pro_Drivers",
  "HP OfficeJet Pro 9015e": "file://License/HP_OfficeJet_Pro_9015e_Drivers",
  "Canon PIXMA TR8620": "file://License/Canon_PIXMA_TR8620_Drivers",
  "Brother MFC-L8900CDW": "file://License/Brother_MFC-L8900CDW_Drivers",
  "HP LaserJet First Floor": "file://License/HP_LaserJet_Pro_Drivers",
}

export function getEmployeeNumber(fullName: string): string | null {
  // Try exact match first
  if (employeeNumberMap[fullName]) {
    return employeeNumberMap[fullName]
  }

  // Try partial matches for names with different formats
  const searchName = fullName.toLowerCase()
  for (const [name, number] of Object.entries(employeeNumberMap)) {
    if (name.toLowerCase().includes(searchName) || searchName.includes(name.toLowerCase())) {
      return number
    }
  }

  return null
}

export function getVantagePointUrl(employeeName: string): string {
  const employeeNumber = getEmployeeNumber(employeeName)
  if (employeeNumber) {
    return `https://beardsley.deltekfirst.com/Beardsley/app/#!Employees/view/0/0/${employeeNumber}/hybrid`
  }
  return "#" // Fallback if no employee number found
}

// Function to add employee to mapping when they're created
export function addEmployeeToMapping(employeeName: string, employeeNumber: string): void {
  if (employeeName && employeeNumber) {
    employeeNumberMap[employeeName] = employeeNumber
    console.log(`✅ Added employee mapping: ${employeeName} -> ${employeeNumber}`)
  }
}

export function getPrinterDriverUrl(printerName: string): string {
  return printerDriverLinks[printerName] || "#"
}

// Utility function to generate photo filename from full name
export function generatePhotoFilename(fullName: string): string {
  // Handle names with multiple parts (e.g., "Joanne Maddox Kinslow" -> "Joanne-Kinslow_Resume.jpg")
  const nameParts = fullName.trim().split(/\s+/)
  if (nameParts.length === 0) return "Unknown_Resume.jpg"

  const firstName = nameParts[0].replace(/[^a-zA-Z]/g, "")
  const lastName = nameParts[nameParts.length - 1].replace(/[^a-zA-Z]/g, "")

  return `${firstName}-${lastName}_Resume.jpg`
}

// Utility function to get photo URL with fallback
export function getPhotoUrl(employeeName: string): string {
  if (!employeeName) return "/placeholder.svg?height=40&width=40"

  const filename = generatePhotoFilename(employeeName)
  return `/photos/${filename}`
}

// Check if photo exists (client-side check)
export async function checkPhotoExists(photoUrl: string): Promise<boolean> {
  try {
    const response = await fetch(photoUrl, { method: "HEAD" })
    return response.ok
  } catch {
    return false
  }
}

// Get photo URL with existence check
export async function getPhotoUrlWithCheck(employeeName: string): Promise<string> {
  const photoUrl = getPhotoUrl(employeeName)
  const exists = await checkPhotoExists(photoUrl)
  return exists ? photoUrl : "/placeholder.svg?height=40&width=40"
}

// Utility to get all expected photo filenames for current employees
export function getAllExpectedPhotoFilenames(): string[] {
  return Object.keys(employeeNumberMap).map((name) => generatePhotoFilename(name))
}

// Generate a mapping of employee names to their expected photo filenames
export function getEmployeePhotoMapping(): Record<string, string> {
  const mapping: Record<string, string> = {}
  Object.keys(employeeNumberMap).forEach((name) => {
    mapping[name] = generatePhotoFilename(name)
  })
  return mapping
}

// Add function to open file system location
export function openPrinterDriverLocation(printerName: string): void {
  const driverPath = printerDriverLinks[printerName]
  if (driverPath && driverPath.startsWith("file://")) {
    // For Windows file system access
    const windowsPath = driverPath.replace("file://", "\\\\")
    try {
      // Try to open with Windows Explorer
      window.open(`file://${windowsPath}`, "_blank")
    } catch (error) {
      // Fallback: copy path to clipboard and show instruction
      navigator.clipboard
        .writeText(windowsPath)
        .then(() => {
          alert(`Driver location copied to clipboard: ${windowsPath}\nOpen File Explorer and paste this path.`)
        })
        .catch(() => {
          alert(`Please navigate to: ${windowsPath}`)
        })
    }
  }
}

// Add function to upload employee data by employee number
export function uploadEmployeeByNumber(employeeNumber: string, csvData: string): boolean {
  try {
    const lines = csvData.split("\n")
    const headers = lines[0].split(",")

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",")
      const empNumber = values[0]?.trim().replace(/"/g, "")

      if (empNumber === employeeNumber) {
        // Found matching employee, extract data
        const employeeData = {
          employeeNumber: empNumber,
          fullName: values[1]?.trim().replace(/"/g, "") || "",
          title: values[2]?.trim().replace(/"/g, "") || "",
          email: values[3]?.trim().replace(/"/g, "") || "",
          phone: values[4]?.trim().replace(/"/g, "") || "",
          location: values[5]?.trim().replace(/"/g, "") || "",
          department: values[6]?.trim().replace(/"/g, "") || "",
        }

        // Update the employee number mapping
        if (employeeData.fullName) {
          employeeNumberMap[employeeData.fullName] = employeeNumber
        }

        return true
      }
    }
    return false
  } catch (error) {
    console.error("Error parsing CSV data:", error)
    return false
  }
}

// Employee data array - cleared for custom upload
export const employeeData: EmployeeData[] = []

// Function to add employee data from CSV upload
export function addEmployeeDataFromCSV(csvData: string): boolean {
  try {
    const lines = csvData.split('\n')
    if (lines.length < 2) return false
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
      if (values.length < headers.length) continue
      
      const employee: EmployeeData = {
        employeeNumber: values[0] || '',
        fullName: values[1] || '',
        locationDescription: values[2] || '',
        title: values[3] || '',
        email: values[4] || '',
        workPhone: values[5] || '',
        profitCenterName: values[6] || '',
        statusDescription: values[7] || 'Active'
      }
      
      if (employee.fullName && employee.employeeNumber) {
        employeeData.push(employee)
        employeeNumberMap[employee.fullName] = employee.employeeNumber
      }
    }
    
    console.log(`✅ Successfully added ${employeeData.length} employees`)
    return true
  } catch (error) {
    console.error('❌ Error parsing CSV data:', error)
    return false
  }
}

// Function to clear all employee data
export function clearEmployeeData(): void {
  employeeData.length = 0
  Object.keys(employeeNumberMap).forEach(key => delete employeeNumberMap[key])
  console.log('✅ All employee data cleared')
}

// Get total employee count
export function getTotalEmployeeCount(): number {
  return Object.keys(employeeNumberMap).length
}

// Search employees across all locations
export function searchEmployees(query: string, allLocations: any[]): any[] {
  if (!query.trim()) return []

  const searchTerm = query.toLowerCase()
  const results: any[] = []

  allLocations.forEach((location) => {
    location.floors?.forEach((floor: any) => {
      floor.seats?.forEach((seat: any) => {
        if (seat.employee) {
          const employee = seat.employee
          const matchesName = employee.name?.toLowerCase().includes(searchTerm)
          const matchesTitle = employee.title?.toLowerCase().includes(searchTerm)
          const matchesEmail = employee.email?.toLowerCase().includes(searchTerm)
          const matchesPhone = employee.phone?.toLowerCase().includes(searchTerm)
          const matchesEmployeeNumber = employee.employeeNumber?.toLowerCase().includes(searchTerm)

          if (matchesName || matchesTitle || matchesEmail || matchesPhone || matchesEmployeeNumber) {
            results.push({
              employee,
              location,
              floor,
              seat,
            })
          }
        }
      })
    })
  })

  return results
}

// Furniture types for office layouts
export const furnitureTypes = {
  desk: {
    name: "Desk",
    width: 60,
    height: 40,
    color: "#8B4513",
    strokeColor: "#654321",
    canSeatEmployee: true,
  },
  table: {
    name: "Conference Table",
    width: 120,
    height: 80,
    color: "#A0522D",
    strokeColor: "#8B4513",
    canSeatEmployee: false,
  },
  chair: {
    name: "Chair",
    width: 20,
    height: 20,
    color: "#2F4F4F",
    strokeColor: "#1C3A3A",
    canSeatEmployee: true,
  },
  couch: {
    name: "Couch",
    width: 80,
    height: 35,
    color: "#4682B4",
    strokeColor: "#2F4F4F",
    canSeatEmployee: false,
  },
  bookshelf: {
    name: "Bookshelf",
    width: 30,
    height: 100,
    color: "#8B4513",
    strokeColor: "#654321",
    canSeatEmployee: false,
  },
  cabinet: {
    name: "Filing Cabinet",
    width: 40,
    height: 30,
    color: "#696969",
    strokeColor: "#2F2F2F",
    canSeatEmployee: false,
  },
}

// Generate office image path
export function getOfficeImagePath(locationId: string): string {
  const imageMap: Record<string, string> = {
    syracuse: "/SyracuseOffice.jpg",
    auburn: "/AuburnOffice.jpg",
    albany: "/AlbanyOffice.jpg",
    malone: "/MaloneOffice.jpg",
  }

  return imageMap[locationId] || "/placeholder.svg?height=200&width=400"
}

// Function to get employee data by employee number
export function getEmployeeDataByNumber(employeeNumber: string): EmployeeData | null {
  return employeeData.find((emp) => emp.employeeNumber === employeeNumber) || null
}

// Function to get employee data by full name
export function getEmployeeDataByName(fullName: string): EmployeeData | null {
  return employeeData.find((emp) => emp.fullName.toLowerCase() === fullName.toLowerCase()) || null
}

// Function to get all employees for a specific location
export function getEmployeesByLocation(location: string): EmployeeData[] {
  return employeeData.filter((emp) => emp.locationDescription.toLowerCase() === location.toLowerCase())
}

// Function to get all active employees
export function getAllActiveEmployees(): EmployeeData[] {
  return employeeData.filter((emp) => emp.statusDescription === "Active")
}

// Function to search employees by various criteria
export function searchEmployeeData(query: string): EmployeeData[] {
  const searchTerm = query.toLowerCase()
  return employeeData.filter(
    (emp) =>
      emp.fullName.toLowerCase().includes(searchTerm) ||
      emp.title.toLowerCase().includes(searchTerm) ||
      emp.email.toLowerCase().includes(searchTerm) ||
      emp.employeeNumber.includes(searchTerm) ||
      emp.locationDescription.toLowerCase().includes(searchTerm),
  )
}

// Function to validate employee number format
export function isValidEmployeeNumber(employeeNumber: string): boolean {
  // Employee numbers can be 1-3 digits, sometimes with leading zeros
  return /^\d{1,3}$/.test(employeeNumber.replace(/^0+/, "")) && employeeNumber.length <= 3
}

// Function to format employee number with leading zeros
export function formatEmployeeNumber(employeeNumber: string): string {
  const num = employeeNumber.replace(/^0+/, "") // Remove leading zeros
  return num.padStart(3, "0") // Add leading zeros to make it 3 digits
}

// Function to get employee count by location
export function getEmployeeCountByLocation(): Record<string, number> {
  const counts: Record<string, number> = {}
  employeeData.forEach((emp) => {
    const location = emp.locationDescription
    counts[location] = (counts[location] || 0) + 1
  })
  return counts
}

// Function to get unique job titles
export function getUniqueJobTitles(): string[] {
  const titles = new Set(employeeData.map((emp) => emp.title))
  return Array.from(titles).sort()
}

// Function to get unique locations
export function getUniqueLocations(): string[] {
  const locations = new Set(employeeData.map((emp) => emp.locationDescription))
  return Array.from(locations).sort()
}

// Function to generate employee directory data
export function generateEmployeeDirectory(): Record<string, EmployeeData[]> {
  const directory: Record<string, EmployeeData[]> = {}
  employeeData.forEach((emp) => {
    const firstLetter = emp.fullName.charAt(0).toUpperCase()
    if (!directory[firstLetter]) {
      directory[firstLetter] = []
    }
    directory[firstLetter].push(emp)
  })

  // Sort employees within each letter group
  Object.keys(directory).forEach((letter) => {
    directory[letter].sort((a, b) => a.fullName.localeCompare(b.fullName))
  })

  return directory
}

// Function to export employee data as CSV
export function exportEmployeeDataAsCSV(): string {
  const headers = ["Employee Number", "Full Name", "Location", "Title", "Email", "Work Phone", "Status"]
  const rows = employeeData.map((emp) => [
    emp.employeeNumber,
    emp.fullName,
    emp.locationDescription,
    emp.title,
    emp.email,
    emp.workPhone,
    emp.statusDescription,
  ])

  const csvContent = [headers, ...rows].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

  return csvContent
}

// Function to get employee statistics
export function getEmployeeStatistics(): {
  totalEmployees: number
  locationCounts: Record<string, number>
  titleCounts: Record<string, number>
  averageEmployeesPerLocation: number
} {
  const totalEmployees = employeeData.length
  const locationCounts = getEmployeeCountByLocation()
  const titleCounts: Record<string, number> = {}

  employeeData.forEach((emp) => {
    titleCounts[emp.title] = (titleCounts[emp.title] || 0) + 1
  })

  const averageEmployeesPerLocation = totalEmployees / Object.keys(locationCounts).length

  return {
    totalEmployees,
    locationCounts,
    titleCounts,
    averageEmployeesPerLocation: Math.round(averageEmployeesPerLocation * 100) / 100,
  }
}
