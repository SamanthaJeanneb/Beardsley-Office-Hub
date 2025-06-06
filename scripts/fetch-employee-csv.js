// Fetch and analyze the employee CSV data to get correct mappings
async function fetchEmployeeData() {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Employees%20export_20250606_1351-IbYXqivVPSeIT4J5I7PqDDj8HTGH6O.csv",
    )
    const csvText = await response.text()

    console.log("CSV Data fetched successfully")
    console.log("First 500 characters:", csvText.substring(0, 500))

    // Parse CSV
    const lines = csvText.split("\n")
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())
    console.log("Headers:", headers)

    const employees = []
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(",").map((v) => v.replace(/"/g, "").trim())
        const employee = {
          employeeNumber: values[0],
          fullName: values[1],
          locationDescription: values[2],
          title: values[3],
          email: values[4],
          workPhone: values[5],
          profitCenterName: values[6],
          statusDescription: values[7],
        }
        employees.push(employee)
      }
    }

    console.log(`Parsed ${employees.length} employees`)

    // Find Dan Whitman specifically
    const danWhitman = employees.find((emp) => emp.fullName.toLowerCase().includes("dan whitman"))
    if (danWhitman) {
      console.log("Dan Whitman found:", danWhitman)
    }

    // Create correct mapping
    const employeeMapping = {}
    employees.forEach((emp) => {
      if (emp.fullName && emp.employeeNumber) {
        employeeMapping[emp.fullName] = emp.employeeNumber
      }
    })

    console.log("Employee mapping created with", Object.keys(employeeMapping).length, "entries")
    console.log("Sample mappings:")
    Object.entries(employeeMapping)
      .slice(0, 10)
      .forEach(([name, id]) => {
        console.log(`"${name}": "${id}"`)
      })

    return { employees, employeeMapping }
  } catch (error) {
    console.error("Error fetching employee data:", error)
    return null
  }
}

// Execute the function
fetchEmployeeData()
