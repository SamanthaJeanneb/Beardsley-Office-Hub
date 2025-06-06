// Fetch and analyze the updated employee CSV data
const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Employees%20export_20250606_1351-ZOQcg7TDPckWi109ZoY5cH9aIc7mha.csv"

async function fetchUpdatedEmployeeData() {
  try {
    console.log("Fetching updated employee data from:", csvUrl)
    const response = await fetch(csvUrl)
    const csvText = await response.text()

    // Parse CSV
    const lines = csvText.split("\n").filter((line) => line.trim())
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())

    console.log("Headers found:", headers)

    const employees = []
    const employeeNumberMap = {}

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        // Handle CSV parsing with proper quote handling
        const values = []
        let currentValue = ""
        let inQuotes = false

        for (let j = 0; j < lines[i].length; j++) {
          const char = lines[i][j]
          if (char === '"') {
            inQuotes = !inQuotes
          } else if (char === "," && !inQuotes) {
            values.push(currentValue.trim())
            currentValue = ""
          } else {
            currentValue += char
          }
        }
        values.push(currentValue.trim()) // Add the last value

        const employee = {}
        headers.forEach((header, index) => {
          employee[header] = values[index] || ""
        })

        employees.push(employee)

        // Create employee number mapping
        const fullName = employee["Full Name"]
        const employeeNumber = employee["Employee Number"]
        if (fullName && employeeNumber) {
          employeeNumberMap[fullName] = employeeNumber
        }
      }
    }

    console.log(`Processed ${employees.length} employees`)

    // Group by location
    const byLocation = employees.reduce((acc, emp) => {
      const location = emp["Location Description"]?.toLowerCase() || "unknown"
      if (!acc[location]) acc[location] = []
      acc[location].push(emp)
      return acc
    }, {})

    console.log("Employees by location:")
    Object.keys(byLocation).forEach((location) => {
      console.log(`${location}: ${byLocation[location].length} employees`)
    })

    // Generate corrected employee number mapping
    console.log("\n=== CORRECTED EMPLOYEE NUMBER MAPPING ===")
    console.log("export const employeeNumberMap: Record<string, string> = {")
    Object.entries(employeeNumberMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([name, number]) => {
        console.log(`  "${name}": "${number}",`)
      })
    console.log("}")

    // Sample employee data
    console.log("\nSample employees:")
    employees.slice(0, 5).forEach((emp) => {
      console.log(`${emp["Full Name"]} (${emp["Employee Number"]}) - ${emp["Location Description"]} - ${emp["Title"]}`)
    })

    return { employees, byLocation, employeeNumberMap }
  } catch (error) {
    console.error("Error fetching employee data:", error)
    return null
  }
}

// Execute the function
fetchUpdatedEmployeeData()
