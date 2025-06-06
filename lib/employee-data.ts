// Employee data utilities with real employee numbers from CSV
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

// Employee number mapping based on the CSV data
export const employeeNumberMap: Record<string, string> = {
  "Adrianna Mondello": "00374",
  "Jared Heinl": "00001",
  "Barry Halperin": "00002",
  "Thomas Ascienzo": "00003",
  "Seth Livermore": "00004",
  "Lillian Spencer": "00005",
  "Allie Henderson": "00006",
  "Scott Folts": "00007",
  "Jacob Perez Gangi": "00008",
  "Alex Clement": "00009",
  "Nicholas Hartung": "00010",
  "Chelsea Bush": "00011",
  "Michelle Thompson": "00012",
  "Brittany Varengo": "00013",
  "Caleb Sayers": "00014",
  "Justin Chiera": "00015",
  "Gabriel Amaya": "00016",
  "Joanne Butler": "00017",
  "Dan Whitman": "00018",
  "Glenn Hewitt": "00019",
  "Kathy Quigley": "00020",
  "Michael Picciano": "00021",
  "Mark Rebich": "00022",
  "Dennis McCarthy": "00023",
  "Andrea DeLany": "00024",
  "Jeff Velte": "00025",
  "Andrew Ingram": "00026",
  "Paul Shrimpton": "00027",
  "Ed Onori": "00028",
  "Brandon Blumer": "00029",
  "Kathy Mietz": "00030",
  "Joe Kime": "00031",
  "Thomas Wight": "00032",
  "Doug Porter": "00033",
  "Julia Furlong": "00034",
  "Joanne Maddox Kinslow": "00035",
  "Phillip Beyel": "00036",
  "Tim McSweeney": "00037",
  "Kurt Olsen": "00038",
  "Jason Coe": "00039",
  "John Hewitt": "00040",
  "Jared Bracken": "00041",
  "Felicia Fiacco": "00042",
  "Michael Naber": "00043",
  "Tracey Carr": "00044",
  "Kyle Daddario": "00045",
  "Nathan Stultz": "00046",
  "Mathew Milne": "00047",
  "Dominic Seils": "00048",
  "Joshua Marris": "00049",
  "Megan Litzenberger": "00050",
  "Samantha Brown": "00051",
  "Evan Moore": "00052",
}

// Printer driver links mapping
export const printerDriverLinks: Record<string, string> = {
  "HP LaserJet Pro": "https://support.hp.com/us-en/drivers/selfservice/hp-laserjet-pro-400-printer-series/5390879",
  "HP OfficeJet Pro 9015e":
    "https://support.hp.com/us-en/drivers/selfservice/hp-officejet-pro-9015e-all-in-one-printer-series/2101946438",
  "Canon PIXMA TR8620":
    "https://www.usa.canon.com/internet/portal/us/home/support/details/printers/inkjet-single-function/pixma-tr-series/pixma-tr8620",
  "Brother MFC-L8900CDW": "https://support.brother.com/g/b/downloadlist.aspx?c=us&lang=en&prod=mfcl8900cdw_us_eu_as",
  "HP LaserJet First Floor":
    "https://support.hp.com/us-en/drivers/selfservice/hp-laserjet-pro-400-printer-series/5390879",
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
