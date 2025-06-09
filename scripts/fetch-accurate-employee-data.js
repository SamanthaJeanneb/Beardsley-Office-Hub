// Fetch the accurate employee CSV data from the provided URL
async function fetchAccurateEmployeeData() {
  try {
    console.log("Fetching accurate employee data from the new CSV...")

    // Use a CORS proxy or try different approaches
    const csvUrl =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Employees%20export_20250606_1351-DsxtR7CqYvPWVWL6gr7uspeS7C2kSk.csv"

    console.log("Attempting to fetch from:", csvUrl)

    const response = await fetch(csvUrl, {
      method: "GET",
      headers: {
        Accept: "text/csv,text/plain,*/*",
      },
      mode: "cors",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const csvText = await response.text()
    console.log("CSV Data fetched successfully")
    console.log("CSV length:", csvText.length)
    console.log("First 500 characters:", csvText.substring(0, 500))

    // Parse CSV manually to handle quoted fields properly
    function parseCSVLine(line) {
      const result = []
      let current = ""
      let inQuotes = false

      for (let i = 0; i < line.length; i++) {
        const char = line[i]

        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === "," && !inQuotes) {
          result.push(current.trim())
          current = ""
        } else {
          current += char
        }
      }

      result.push(current.trim())
      return result
    }

    const lines = csvText.split("\n").filter((line) => line.trim())
    const headers = parseCSVLine(lines[0])

    console.log("Headers found:", headers)
    console.log("Total data lines:", lines.length - 1)

    const employees = []
    const employeeMapping = {}

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = parseCSVLine(lines[i])

        const employee = {
          employeeNumber: values[0]?.replace(/"/g, "") || "",
          fullName: values[1]?.replace(/"/g, "") || "",
          locationDescription: values[2]?.replace(/"/g, "") || "",
          title: values[3]?.replace(/"/g, "") || "",
          email: values[4]?.replace(/"/g, "") || "",
          workPhone: values[5]?.replace(/"/g, "") || "",
          profitCenterName: values[6]?.replace(/"/g, "") || "",
          statusDescription: values[7]?.replace(/"/g, "") || "",
        }

        // Only add active employees with valid data
        if (employee.statusDescription === "Active" && employee.fullName && employee.employeeNumber) {
          employees.push(employee)
          employeeMapping[employee.fullName] = employee.employeeNumber
        }
      }
    }

    console.log(`\nProcessed ${employees.length} active employees`)
    console.log(`Employee mapping entries: ${Object.keys(employeeMapping).length}`)

    // Show sample data
    console.log("\nFirst 10 employees:")
    employees.slice(0, 10).forEach((emp, index) => {
      console.log(`${index + 1}. ${emp.fullName} (${emp.employeeNumber}) - ${emp.title}`)
    })

    // Location breakdown
    const locationCounts = {}
    employees.forEach((emp) => {
      locationCounts[emp.locationDescription] = (locationCounts[emp.locationDescription] || 0) + 1
    })

    console.log("\nEmployees by location:")
    Object.entries(locationCounts).forEach(([location, count]) => {
      console.log(`${location}: ${count} employees`)
    })

    // Generate corrected mapping
    console.log("\n=== CORRECTED EMPLOYEE NUMBER MAPPING ===")
    console.log("export const employeeNumberMap: Record<string, string> = {")
    Object.entries(employeeMapping)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([name, number]) => {
        console.log(`  "${name}": "${number}",`)
      })
    console.log("}")

    // Generate employee data array
    console.log("\n=== EMPLOYEE DATA ARRAY ===")
    console.log("export const employeeData: EmployeeData[] = [")
    employees.forEach((emp) => {
      console.log(`  {`)
      console.log(`    employeeNumber: "${emp.employeeNumber}",`)
      console.log(`    fullName: "${emp.fullName}",`)
      console.log(`    locationDescription: "${emp.locationDescription}",`)
      console.log(`    title: "${emp.title}",`)
      console.log(`    email: "${emp.email}",`)
      console.log(`    workPhone: "${emp.workPhone}",`)
      console.log(`    profitCenterName: "${emp.profitCenterName}",`)
      console.log(`    statusDescription: "${emp.statusDescription}",`)
      console.log(`  },`)
    })
    console.log("]")

    return { employees, employeeMapping, locationCounts }
  } catch (error) {
    console.error("Error fetching CSV data:", error)

    // Fallback: provide manual data based on the schema you provided
    console.log("\n=== FALLBACK: Using manual data entry ===")
    console.log("Since the CSV fetch failed, please manually update the employee data.")
    console.log("Based on your description of ~65 employees, here's the structure to follow:")

    console.log("\nExpected CSV Schema:")
    console.log(
      "Employee Number, Full Name, Location Description, Title, Email, Work Phone, Profit Center Name, Status Description",
    )

    console.log("\nTo fix the employee count and IDs:")
    console.log("1. The current code shows 84 employees but you mentioned ~65")
    console.log("2. This suggests there are inactive employees or duplicates in the current data")
    console.log("3. The employee IDs need to be updated to match the accurate CSV")

    console.log("\nRecommended next steps:")
    console.log("1. Manually download the CSV from the provided URL")
    console.log("2. Filter for only 'Active' status employees")
    console.log("3. Update the employeeNumberMap and employeeData arrays")
    console.log("4. Ensure the count matches your expected ~65 employees")

    return null
  }
}

// Execute the function
fetchAccurateEmployeeData()
