// Fetch and update employee data from the new CSV
const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Employees%20export_20250606_1351-IbYXqivVPSeIT4J5I7PqDDj8HTGH6O.csv"

async function updateEmployeeData() {
  try {
    console.log("Fetching employee data from:", csvUrl)
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

    // Sample employee data
    console.log("\nSample employee:", employees[0])

    // Employee number mapping sample
    console.log("\nEmployee number mapping sample:")
    Object.entries(employeeNumberMap)
      .slice(0, 5)
      .forEach(([name, number]) => {
        console.log(`${name}: ${number}`)
      })

    return { employees, byLocation, employeeNumberMap }
  } catch (error) {
    console.error("Error fetching employee data:", error)
    return null
  }
}

// Execute the function
updateEmployeeData()
