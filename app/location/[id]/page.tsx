"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeft, Printer, Bath, DoorClosed, Coffee, Wifi } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnhancedSeatingChart } from "@/components/enhanced-seating-chart"
import { EmployeeCard } from "@/components/employee-card"
import { OfficeInfo } from "@/components/office-info"
import { EditModePanel } from "@/components/edit-mode-panel"
import { getLocationData, updateLocationData, getAllLocations } from "@/lib/data"

export default function LocationPage({ params }: { params: { id: string } }) {
  const [location, setLocation] = useState<any>(null)
  const [selectedFloor, setSelectedFloor] = useState<string>("")
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [allLocations, setAllLocations] = useState<any[]>([])

  useEffect(() => {
    // Fetch location data
    const locationData = getLocationData(params.id)
    const allLocationData = getAllLocations()

    // Add amenities to each floor if they don't exist
    if (locationData && locationData.floors) {
      locationData.floors = locationData.floors.map((floor: any) => {
        if (!floor.amenities) {
          floor.amenities = [
            {
              id: `printer-${floor.id}`,
              type: "printer",
              name: "HP LaserJet Pro",
              ipAddress: "192.168.1.101",
              queueName: "OFFICE-PRINT-01",
              status: "Online",
              x: 450,
              y: 120,
            },
            { id: `restroom-${floor.id}`, type: "restroom", name: "Restroom", x: 450, y: 50 },
            { id: `exit-${floor.id}`, type: "exit", name: "Emergency Exit", x: 520, y: 50 },
            { id: `kitchen-${floor.id}`, type: "kitchen", name: "Kitchen", x: 520, y: 120 },
          ]
        } else {
          // Add printer details if they don't exist
          floor.amenities = floor.amenities.map((amenity: any) => {
            if (amenity.type === "printer" && !amenity.ipAddress) {
              return {
                ...amenity,
                ipAddress: "192.168.1.101",
                queueName: "OFFICE-PRINT-01",
                status: "Online",
              }
            }
            return amenity
          })
        }
        return floor
      })

      // Add office amenities list and quick links if they don't exist
      if (!locationData.amenitiesList) {
        locationData.amenitiesList = [
          { name: "Printers", icon: Printer },
          { name: "Restrooms", icon: Bath },
          { name: "Emergency Exits", icon: DoorClosed },
          { name: "Kitchen", icon: Coffee },
          { name: "Wi-Fi", icon: Wifi },
        ]
      }

      if (!locationData.quickLinks) {
        locationData.quickLinks = [
          { name: "IT Support", url: "#", icon: Wifi },
          { name: "Book Room", url: "#" },
          { name: "Report Issue", url: "#" },
        ]
      }

      // Add phone and hours if they don't exist
      if (!locationData.phone) {
        locationData.phone = "555-123-4567"
      }

      if (!locationData.hours) {
        locationData.hours = "Mon-Fri: 8:00 AM - 6:00 PM"
      }

      if (!locationData.wifi) {
        locationData.wifi = "Office-Guest"
      }
    }

    setLocation(locationData)
    setAllLocations(allLocationData)

    // Set default floor
    if (locationData && locationData.floors.length > 0) {
      setSelectedFloor(locationData.floors[0].id)
    }
  }, [params.id])

  const handleFloorChange = (floorId: string) => {
    setSelectedFloor(floorId)
  }

  const handleUpdateSeatPosition = (seatId: string, x: number, y: number) => {
    if (!location) return

    const updatedLocation = { ...location }
    updatedLocation.floors = updatedLocation.floors.map((floor: any) => {
      if (floor.id === selectedFloor) {
        return {
          ...floor,
          seats: floor.seats.map((seat: any) => (seat.id === seatId ? { ...seat, x, y } : seat)),
        }
      }
      return floor
    })

    setLocation(updatedLocation)
    updateLocationData(params.id, updatedLocation)
  }

  const handleMoveSeat = (fromSeatId: string, toSeatId: string) => {
    if (!location) return

    const updatedLocation = { ...location }
    updatedLocation.floors = updatedLocation.floors.map((floor: any) => {
      if (floor.id === selectedFloor) {
        const fromSeat = floor.seats.find((seat: any) => seat.id === fromSeatId)
        const toSeat = floor.seats.find((seat: any) => seat.id === toSeatId)

        if (fromSeat && toSeat) {
          return {
            ...floor,
            seats: floor.seats.map((seat: any) => {
              if (seat.id === fromSeatId) {
                return { ...seat, employee: toSeat.employee }
              }
              if (seat.id === toSeatId) {
                return { ...seat, employee: fromSeat.employee }
              }
              return seat
            }),
          }
        }
      }
      return floor
    })

    setLocation(updatedLocation)
    updateLocationData(params.id, updatedLocation)
  }

  const handleUpdateEmployee = (updatedEmployee: any) => {
    if (!location) return

    const updatedLocation = { ...location }
    updatedLocation.floors = updatedLocation.floors.map((floor: any) => ({
      ...floor,
      seats: floor.seats.map((seat: any) =>
        seat.employee?.id === updatedEmployee.id ? { ...seat, employee: updatedEmployee } : seat,
      ),
    }))

    setLocation(updatedLocation)
    updateLocationData(params.id, updatedLocation)
    setSelectedEmployee(updatedEmployee)
  }

  const handleUpdateLocation = (updatedLocation: any) => {
    setLocation(updatedLocation)
    updateLocationData(params.id, updatedLocation)
  }

  const handleMoveEmployee = (employeeId: string, targetOffice: string) => {
    // Implementation for moving employee to different office
    console.log(`Moving employee ${employeeId} to office ${targetOffice}`)
  }

  const handleDeleteEmployee = (employeeId: string) => {
    if (!location) return

    const updatedLocation = { ...location }
    updatedLocation.floors = updatedLocation.floors.map((floor: any) => ({
      ...floor,
      seats: floor.seats.map((seat: any) => (seat.employee?.id === employeeId ? { ...seat, employee: null } : seat)),
    }))

    setLocation(updatedLocation)
    updateLocationData(params.id, updatedLocation)
    setSelectedEmployee(null)
  }

  const handleAddEmployee = (newEmployee: any) => {
    // Find first empty seat and assign employee
    if (!location) return

    const updatedLocation = { ...location }
    let assigned = false

    updatedLocation.floors = updatedLocation.floors.map((floor: any) => {
      if (!assigned) {
        const emptySeat = floor.seats.find((seat: any) => !seat.employee)
        if (emptySeat) {
          assigned = true
          return {
            ...floor,
            seats: floor.seats.map((seat: any) =>
              seat.id === emptySeat.id ? { ...seat, employee: newEmployee } : seat,
            ),
          }
        }
      }
      return floor
    })

    if (assigned) {
      setLocation(updatedLocation)
      updateLocationData(params.id, updatedLocation)
    }
  }

  const handleUpdatePrinter = (updatedPrinter: any) => {
    // Implementation for updating printer details
    console.log("Updating printer:", updatedPrinter)
  }

  const handleMovePrinter = (printerId: string, targetOffice: string) => {
    // Implementation for moving printer to different office
    console.log(`Moving printer ${printerId} to office ${targetOffice}`)
  }

  const handleDeletePrinter = (printerId: string) => {
    // Implementation for deleting printer
    console.log(`Deleting printer ${printerId}`)
  }

  if (!location) {
    return (
      <div className="container flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-office-maroon">Loading...</h2>
        </div>
      </div>
    )
  }

  const currentFloor = location.floors.find((floor: any) => floor.id === selectedFloor)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container px-4 py-8">
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            asChild
            className="border-office-maroon/20 bg-white hover:bg-office-maroon hover:text-white"
          >
            <Link href="/">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back to locations</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-office-maroon md:text-3xl">{location.name}</h1>
            <p className="text-muted-foreground">{location.address}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <Tabs value={selectedFloor} onValueChange={setSelectedFloor} className="w-full">
              <TabsList className="w-full justify-start bg-white border border-office-maroon/20">
                {location.floors.map((floor: any) => (
                  <TabsTrigger
                    key={floor.id}
                    value={floor.id}
                    className="data-[state=active]:bg-office-maroon data-[state=active]:text-white"
                  >
                    {floor.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {location.floors.map((floor: any) => (
                <TabsContent key={floor.id} value={floor.id} className="mt-4">
                  <div className="rounded-lg bg-background">
                    <EnhancedSeatingChart
                      floorData={floor}
                      allFloors={location.floors}
                      currentFloorId={selectedFloor}
                      onSelectEmployee={(employee) => setSelectedEmployee(employee)}
                      onFloorChange={handleFloorChange}
                      isEditMode={isEditMode}
                      onUpdateSeatPosition={handleUpdateSeatPosition}
                      onMoveSeat={handleMoveSeat}
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className="space-y-6">
            <OfficeInfo location={location} />

            {isEditMode ? (
              <EditModePanel
                location={location}
                selectedEmployee={selectedEmployee}
                onUpdateEmployee={handleUpdateEmployee}
                onUpdateLocation={handleUpdateLocation}
                onMoveEmployee={handleMoveEmployee}
                onDeleteEmployee={handleDeleteEmployee}
                onAddEmployee={handleAddEmployee}
                onUpdatePrinter={handleUpdatePrinter}
                onMovePrinter={handleMovePrinter}
                onDeletePrinter={handleDeletePrinter}
                allLocations={allLocations}
                isEditMode={isEditMode}
                onToggleEditMode={() => setIsEditMode(!isEditMode)}
              />
            ) : (
              <div className="space-y-6">
                <EditModePanel
                  location={location}
                  selectedEmployee={selectedEmployee}
                  onUpdateEmployee={handleUpdateEmployee}
                  onUpdateLocation={handleUpdateLocation}
                  onMoveEmployee={handleMoveEmployee}
                  onDeleteEmployee={handleDeleteEmployee}
                  onAddEmployee={handleAddEmployee}
                  onUpdatePrinter={handleUpdatePrinter}
                  onMovePrinter={handleMovePrinter}
                  onDeletePrinter={handleDeletePrinter}
                  allLocations={allLocations}
                  isEditMode={isEditMode}
                  onToggleEditMode={() => setIsEditMode(!isEditMode)}
                />

                <div className="h-fit rounded-lg border border-office-maroon/20 bg-white p-4 shadow-sm lg:sticky lg:top-4">
                  {selectedEmployee ? (
                    <EmployeeCard employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />
                  ) : (
                    <div className="flex h-[300px] flex-col items-center justify-center text-center text-muted-foreground">
                      <p>Select a seat to view employee details</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
