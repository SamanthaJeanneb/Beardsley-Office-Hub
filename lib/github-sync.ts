export interface GitHubConfig {
  owner: string
  repo: string
  token: string
  branch?: string
}

export class GitHubSync {
  private config: GitHubConfig

  constructor(config: GitHubConfig) {
    this.config = {
      ...config,
      branch: config.branch || "main",
    }
  }

  async updateDataFile(data: any): Promise<boolean> {
    try {
      const content = this.generateDataFileContent(data)

      // Get current file SHA (if file exists)
      const currentFile = await this.getCurrentFile()

      // Update or create the file
      const response = await fetch(
        `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/lib/data.ts`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${this.config.token}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `Update office data - ${new Date().toISOString()}`,
            content: this.utf8ToBase64(content),
            sha: currentFile?.sha, // Only include SHA if file exists
            branch: this.config.branch,
          }),
        },
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`GitHub API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`)
      }

      return true
    } catch (error) {
      console.error("Failed to update GitHub repository:", error)
      throw error
    }
  }

  // UTF-8 safe Base64 encoding
  private utf8ToBase64(str: string): string {
    // First, encode the string as UTF-8
    const utf8Encoder = new TextEncoder()
    const utf8Bytes = utf8Encoder.encode(str)

    // Convert UTF-8 bytes to Base64
    let base64 = ""
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
    const byteLength = utf8Bytes.byteLength
    const byteRemainder = byteLength % 3
    const mainLength = byteLength - byteRemainder

    // Process 3 bytes at a time
    for (let i = 0; i < mainLength; i += 3) {
      const chunk = (utf8Bytes[i] << 16) | (utf8Bytes[i + 1] << 8) | utf8Bytes[i + 2]
      base64 += chars[(chunk >> 18) & 63] + chars[(chunk >> 12) & 63] + chars[(chunk >> 6) & 63] + chars[chunk & 63]
    }

    // Handle remaining bytes
    if (byteRemainder === 1) {
      const chunk = utf8Bytes[mainLength]
      base64 += chars[(chunk >> 2) & 63] + chars[(chunk << 4) & 63] + "=="
    } else if (byteRemainder === 2) {
      const chunk = (utf8Bytes[mainLength] << 8) | utf8Bytes[mainLength + 1]
      base64 += chars[(chunk >> 10) & 63] + chars[(chunk >> 4) & 63] + chars[(chunk << 2) & 63] + "="
    }

    return base64
  }

  private async getCurrentFile() {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/lib/data.ts?ref=${this.config.branch}`,
        {
          headers: {
            Authorization: `Bearer ${this.config.token}`,
            Accept: "application/vnd.github.v3+json",
          },
        },
      )

      if (response.ok) {
        return await response.json()
      }

      // File doesn't exist yet, which is fine for first push
      if (response.status === 404) {
        return null
      }

      throw new Error(`Failed to get current file: ${response.status} ${response.statusText}`)
    } catch (error) {
      console.error("Failed to get current file:", error)
      return null
    }
  }

  private generateDataFileContent(data: any): string {
    return `// Auto-generated office seating data - Last updated: ${new Date().toISOString()}
// This file is automatically updated when admins make changes through the Office Hub

// Storage key for localStorage
const STORAGE_KEY = "office-seating-charts-data"

// Default location data (updated from admin panel)
const defaultLocations = ${JSON.stringify(data, null, 2)}

// Initialize storage with current data
let currentData = loadFromStorage()

// Load data from localStorage or return default
function loadFromStorage(): any {
  if (typeof window === "undefined") return defaultLocations

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Merge with defaults to ensure all locations exist
      return { ...defaultLocations, ...parsed }
    }
  } catch (error) {
    console.error("Error loading from localStorage:", error)
  }

  return defaultLocations
}

// Save data to localStorage
function saveToStorage(data: any): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    console.log("✅ Data saved to localStorage successfully")
  } catch (error) {
    console.error("❌ Error saving to localStorage:", error)
  }
}

// Export functions to match the expected API
export function addNewLocation(locationData: any): boolean {
  return addLocation(locationData)
}

export function getLocationData(locationId: string) {
  return getLocationById(locationId)
}

export function updateLocationData(locationId: string, updatedData: any) {
  return updateLocation(locationId, updatedData)
}

export function saveLocationData(locationId: string, updatedData: any): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const result = updateLocation(locationId, updatedData)
      if (result) {
        resolve()
      } else {
        reject(new Error(\`Failed to save location data for \${locationId}\`))
      }
    } catch (error) {
      reject(error)
    }
  })
}

export function addNewFloor(locationId: string, floorData: any): boolean {
  return addFloor(locationId, floorData)
}

export function deleteFloor(locationId: string, floorId: string): boolean {
  const location = getLocationById(locationId)
  if (!location) return false

  location.floors = location.floors.filter((f: any) => f.id !== floorId)
  saveToStorage(currentData)
  return true
}

export function resetToDefaults(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY)
    currentData = defaultLocations
    console.log("🔄 Data reset to defaults")
  }
}

export function clearAllEmployees(): boolean {
  currentData = loadFromStorage()
  
  try {
    // Iterate through all locations and floors to clear employees
    for (const locationId in currentData) {
      const location = currentData[locationId]
      if (location.floors) {
        location.floors.forEach((floor: any) => {
          if (floor.seats) {
            floor.seats.forEach((seat: any) => {
              seat.employee = null
            })
          }
        })
      }
    }
    
    saveToStorage(currentData)
    console.log("✅ All employees cleared from all locations")
    return true
  } catch (error) {
    console.error("❌ Error clearing employees:", error)
    return false
  }
}

// Helper functions
export function getAllLocations() {
  currentData = loadFromStorage()
  return Object.values(currentData)
}

export function getLocationById(id: string) {
  currentData = loadFromStorage()
  return currentData[id as keyof typeof currentData] || null
}

export function updateLocation(id: string, updates: any) {
  currentData = loadFromStorage()

  if (currentData[id as keyof typeof currentData]) {
    currentData[id as keyof typeof currentData] = { ...currentData[id as keyof typeof currentData], ...updates }
    saveToStorage(currentData)
    return currentData[id as keyof typeof currentData]
  }
  return null
}

export function addLocation(location: any) {
  currentData = loadFromStorage()

  // Generate a unique ID if not provided
  if (!location.id) {
    location.id = location.name
      .toLowerCase()
      .replace(/\\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
  }

  currentData[location.id] = location
  saveToStorage(currentData)
  return location
}

export function deleteLocation(id: string) {
  currentData = loadFromStorage()
  delete currentData[id as keyof typeof currentData]
  saveToStorage(currentData)
}

export function updateEmployee(locationId: string, floorId: string, employee: any) {
  const location = getLocationById(locationId)
  if (!location) return null

  const floor = location.floors.find((f: any) => f.id === floorId)
  if (!floor) return null

  // Find the seat with this employee and update it
  const seat = floor.seats.find((s: any) => s.employee?.id === employee.id)
  if (seat) {
    seat.employee = employee
    updateLocation(locationId, location)
    return employee
  }
  return null
}

export function moveEmployee(employeeId: string, fromLocationId: string, toLocationId: string, toFloorId?: string) {
  // Find and remove employee from current location
  let employee = null
  const fromLocation = getLocationById(fromLocationId)
  if (fromLocation) {
    for (const floor of fromLocation.floors) {
      const seatIndex = floor.seats.findIndex((s: any) => s.employee?.id === employeeId)
      if (seatIndex !== -1) {
        employee = floor.seats[seatIndex].employee
        floor.seats[seatIndex].employee = null
        break
      }
    }
  }

  if (!employee) return false

  // Add employee to target location
  const toLocation = getLocationById(toLocationId)
  if (toLocation) {
    const targetFloor = toFloorId ? toLocation.floors.find((f: any) => f.id === toFloorId) : toLocation.floors[0]

    if (targetFloor) {
      // Find an empty seat
      const emptySeat = targetFloor.seats.find((s: any) => !s.employee)
      if (emptySeat) {
        emptySeat.employee = employee
        updateLocation(fromLocationId, fromLocation)
        updateLocation(toLocationId, toLocation)
        return true
      }
    }
  }

  return false
}

export function deleteEmployee(locationId: string, employeeId: string) {
  const location = getLocationById(locationId)
  if (!location) return false

  for (const floor of location.floors) {
    const seat = floor.seats.find((s: any) => s.employee?.id === employeeId)
    if (seat) {
      seat.employee = null
      updateLocation(locationId, location)
      return true
    }
  }
  return false
}

export function addEmployee(locationId: string, floorId: string, employee: any) {
  const location = getLocationById(locationId)
  if (!location) return false

  const floor = location.floors.find((f: any) => f.id === floorId)
  if (!floor) return false

  // Find an empty seat
  const emptySeat = floor.seats.find((s: any) => !s.employee)
  if (emptySeat) {
    emptySeat.employee = employee
    updateLocation(locationId, location)
    return true
  }
  return false
}

export function addSeat(locationId: string, floorId: string, seat: any) {
  const location = getLocationById(locationId)
  if (!location) return false

  const floor = location.floors.find((f: any) => f.id === floorId)
  if (!floor) return false

  floor.seats.push(seat)
  updateLocation(locationId, location)
  return true
}

export function addFurniture(locationId: string, floorId: string, furniture: any) {
  const location = getLocationById(locationId)
  if (!location) return false

  const floor = location.floors.find((f: any) => f.id === floorId)
  if (!floor) return false

  if (!floor.furniture) {
    floor.furniture = []
  }
  floor.furniture.push(furniture)
  updateLocation(locationId, location)
  return true
}

export function deleteFurniture(locationId: string, floorId: string, furnitureId: string) {
  const location = getLocationById(locationId)
  if (!location) return false

  const floor = location.floors.find((f: any) => f.id === floorId)
  if (!floor || !floor.furniture) return false

  floor.furniture = floor.furniture.filter((f: any) => f.id !== furnitureId)
  updateLocation(locationId, location)
  return true
}

export function addFloor(locationId: string, floor: any) {
  const location = getLocationById(locationId)
  if (!location) return false

  location.floors.push(floor)
  updateLocation(locationId, location)
  return true
}

export function exportData() {
  currentData = loadFromStorage()
  return JSON.stringify(currentData, null, 2)
}

export function importData(jsonData: string) {
  try {
    const newData = JSON.parse(jsonData)
    currentData = newData
    saveToStorage(currentData)
    return true
  } catch (error) {
    console.error("Error importing data:", error)
    return false
  }
}

// Initialize data from localStorage on module load
if (typeof window !== "undefined") {
  currentData = loadFromStorage()
}
`
  }
}

// Singleton instance
let githubSync: GitHubSync | null = null

export function initializeGitHubSync(config: GitHubConfig) {
  githubSync = new GitHubSync(config)
}

export function getGitHubSync(): GitHubSync | null {
  return githubSync
}

export async function pushToGitHub(data: any): Promise<boolean> {
  if (!githubSync) {
    console.error("GitHub sync not initialized")
    return false
  }

  return await githubSync.updateDataFile(data)
}
