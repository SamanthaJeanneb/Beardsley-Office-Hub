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

// Corrected employee number mapping based on the updated CSV data
export const employeeNumberMap: Record<string, string> = {
  "Adrianna Mondello": "00374",
  "Alex Clement": "00009",
  "Alexander Morgenthaler": "00375",
  "Allie Henderson": "00006",
  "Andrea DeLany": "00024",
  "Barry Halperin": "00002",
  "Bernie Brown": "00376",
  "Brandi Murray": "00377",
  "Brandon Blumer": "00029",
  "Brandon Marks": "00378",
  "Brittany Varengo": "00014",
  "Caleb Sayers": "00015",
  "Carmen Lapine": "00379",
  "Chelsea Armstrong": "00380",
  "Chelsea Bush": "00011",
  "Chris Kwasniewski": "00381",
  "Chris Peris": "00382",
  "Dan Whitman": "00020",
  "Dennis McCarthy": "00023",
  "Doug Porter": "00033",
  "Drew Ingram": "00026",
  "Ed Onori": "00028",
  "Felicia Fiacco": "00042",
  "Fred Saxton": "00383",
  "Gabriel Amaya": "00017",
  "Gig Elliott": "00384",
  "Glenn Hewitt": "00019",
  "Hannah Wambach": "00385",
  "Jace Brown": "00386",
  "Jacob Perez Gangi": "00008",
  "James Warren": "00387",
  "Jared Bracken": "00041",
  "Jared Heinl": "00001",
  "Jason Coe": "00039",
  "Jeff Velte": "00025",
  "Joanne Butler": "00012",
  "Joanne Maddox Kinslow": "00035",
  "Joe Kime": "00031",
  "John Hewitt": "00040",
  "John MacArthur": "00388",
  "Joshua Marris": "00049",
  "Josh Mason": "00389",
  "Julia Furlong": "00034",
  "Justin Chiera": "00016",
  "Karen Jones": "00390",
  "Katherine Sincebaugh": "00391",
  "Kathy Mietz": "00030",
  "Kathy Quigley": "00018",
  "Kristin Ostiguy": "00392",
  "Kurt Olsen": "00038",
  "Kyle Daddario": "00045",
  "Larry Liberatore": "00393",
  "Lillian Marshall": "00005",
  "Luke Picciano": "00394",
  "Madison McCall": "00395",
  "Mark Rebich": "00022",
  "Mathew Milne": "00047",
  "Megan Litzenberger": "00050",
  "Michael Reynolds": "00396",
  "Michelle Thompson": "00013",
  "Mike Naber": "00043",
  "Mike Picciano": "00021",
  "Mitch Grohal": "00397",
  "Natalie Seagriff": "00398",
  "Nathan Stultz": "00046",
  "Nicholas Hartung": "00010",
  "Nicholas Lapine": "00399",
  "Nicolette Havrish": "00400",
  "Paul Shrimpton": "00027",
  "Paul Smith": "00401",
  "Pete Veale": "00402",
  "Phil Beyel": "00036",
  "Ria Kelsick": "00403",
  "Rob Trujillo": "00404",
  "Ryan Mumby": "00405",
  "Scott Folts": "00007",
  "Seth Livermore": "00004",
  "Stephen Bart": "00406",
  "Tesa Sweet": "00407",
  "Thomas Ascienzo": "00003",
  "Tim McSweeney": "00037",
  "Tom Wight": "00032",
  "Tracey Carr": "00044",
  "Ty Hlywa": "00408",
}

// Printer driver links mapping
export const printerDriverLinks: Record<string, string> = {
  "HP LaserJet Pro": "file://License/HP_LaserJet_Pro_Drivers",
  "HP OfficeJet Pro 9015e": "file://License/HP_OfficeJet_Pro_9015e_Drivers",
  "Canon PIXMA TR8620": "file://License/Canon_PIXMA_TR8620_Drivers",
  "Brother MFC-L8900CDW": "file://License/Brother_MFC_L8900CDW_Drivers",
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

// Export the employee data for use in other modules
export const employeeData: EmployeeData[] = Object.entries(employeeNumberMap).map(([fullName, employeeNumber]) => ({
  employeeNumber,
  fullName,
  locationDescription: "Syracuse", // Default location, can be updated
  title: "Employee", // Default title, can be updated
  email: `${fullName.toLowerCase().replace(/\s+/g, ".")}@beardsley.com`,
  workPhone: "315-555-0000", // Default phone
  profitCenterName: "Beardsley",
  statusDescription: "Active",
}))
