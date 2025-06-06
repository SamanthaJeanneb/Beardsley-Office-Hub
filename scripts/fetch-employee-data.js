// Fetch and process the employee data from the CSV
const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Employees%20export_20250606_1351-nYIveZ1xXBOPQ8Ra1rzIOmYlJ38pMJ.csv"

async function fetchEmployeeData() {
  try {
    const response = await fetch(csvUrl)
    const csvText = await response.text()

    // Parse CSV
    const lines = csvText.split("\n")
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())

    const employees = []
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(",").map((v) => v.replace(/"/g, "").trim())
        const employee = {}
        headers.forEach((header, index) => {
          employee[header] = values[index] || ""
        })
        employees.push(employee)
      }
    }

    console.log("Total employees:", employees.length)
    console.log("Sample employee:", employees[0])

    // Group by location
    const byLocation = employees.reduce((acc, emp) => {
      const location = emp["Location Description"].toLowerCase()
      if (!acc[location]) acc[location] = []
      acc[location].push(emp)
      return acc
    }, {})

    console.log("Employees by location:")
    Object.keys(byLocation).forEach((location) => {
      console.log(`${location}: ${byLocation[location].length} employees`)
    })

    // Create employee number mapping for easy lookup
    const employeeNumberMap = {}
    employees.forEach((emp) => {
      const fullName = emp["Full Name"]
      const employeeNumber = emp["Employee Number"]
      if (fullName && employeeNumber) {
        employeeNumberMap[fullName] = employeeNumber
      }
    })

    console.log("Employee number mapping created for", Object.keys(employeeNumberMap).length, "employees")
    console.log("Sample mappings:", Object.entries(employeeNumberMap).slice(0, 5))

    return { employees, byLocation, employeeNumberMap }
  } catch (error) {
    console.error("Error fetching employee data:", error)
    return null
  }
}

// Execute the function
fetchEmployeeData()
