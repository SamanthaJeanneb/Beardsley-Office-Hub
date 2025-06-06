"use client"

import { useState } from "react"
import { Settings, Users, Building, Printer, Save, X, Trash2, ArrowRight, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface EnhancedEditModePanelProps {
  location: any
  selectedEmployee: any
  onUpdateEmployee: (employee: any) => void
  onUpdateLocation: (location: any) => void
  onMoveEmployee: (employeeId: string, targetOffice: string, targetFloor?: string) => void
  onDeleteEmployee: (employeeId: string) => void
  onAddEmployee: (employee: any, floorId?: string) => void
  onUpdatePrinter: (printer: any) => void
  onMovePrinter: (printerId: string, targetOffice: string) => void
  onDeletePrinter: (printerId: string) => void
  allLocations: any[]
  isEditMode: boolean
  onToggleEditMode: () => void
  currentFloorId: string
}

export function EnhancedEditModePanel({
  location,
  selectedEmployee,
  onUpdateEmployee,
  onUpdateLocation,
  onMoveEmployee,
  onDeleteEmployee,
  onAddEmployee,
  onUpdatePrinter,
  onMovePrinter,
  onDeletePrinter,
  allLocations,
  isEditMode,
  onToggleEditMode,
  currentFloorId,
}: EnhancedEditModePanelProps) {
  const [editingEmployee, setEditingEmployee] = useState<any>(null)
  const [editingLocation, setEditingLocation] = useState<any>(null)
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    notes: "",
  })
  const [showAddEmployee, setShowAddEmployee] = useState(false)
  const [selectedTargetOffice, setSelectedTargetOffice] = useState("")
  const [selectedTargetFloor, setSelectedTargetFloor] = useState("")

  const handleSaveEmployee = () => {
    if (editingEmployee) {
      onUpdateEmployee(editingEmployee)
      setEditingEmployee(null)
    }
  }

  const handleSaveLocation = () => {
    if (editingLocation) {
      onUpdateLocation(editingLocation)
      setEditingLocation(null)
    }
  }

  const handleAddNewEmployee = () => {
    if (newEmployee.name && newEmployee.email) {
      onAddEmployee(
        {
          ...newEmployee,
          id: `emp-${Date.now()}`,
          profileUrl: "#",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        currentFloorId,
      )
      setNewEmployee({
        name: "",
        title: "",
        email: "",
        phone: "",
        notes: "",
      })
      setShowAddEmployee(false)
    }
  }

  const handleMoveEmployee = () => {
    if (selectedEmployee && selectedTargetOffice) {
      onMoveEmployee(selectedEmployee.id, selectedTargetOffice, selectedTargetFloor)
      setSelectedTargetOffice("")
      setSelectedTargetFloor("")
    }
  }

  const handleDeleteEmployee = () => {
    if (selectedEmployee) {
      onDeleteEmployee(selectedEmployee.id)
    }
  }

  // Get available floors for the selected target office
  const getTargetOfficeFloors = () => {
    if (!selectedTargetOffice) return []
    const targetOffice = allLocations.find((loc) => loc.id === selectedTargetOffice)
    return targetOffice?.floors || []
  }

  if (!isEditMode) {
    return (
      <Card className="border-office-maroon/20 bg-white shadow-sm">
        <CardHeader className="bg-gradient-to-r from-office-maroon to-office-maroon-light">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Admin Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Button onClick={onToggleEditMode} className="w-full bg-office-maroon hover:bg-office-maroon-light">
            <Settings className="mr-2 h-4 w-4" />
            Enable Edit Mode
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-office-maroon/20 bg-white shadow-sm">
      <CardHeader className="bg-gradient-to-r from-office-maroon to-office-maroon-light">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Edit Mode
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onToggleEditMode} className="text-white hover:bg-white/20">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue="employee" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="employee">
              <Users className="mr-1 h-3 w-3" />
              Employee
            </TabsTrigger>
            <TabsTrigger value="office">
              <Building className="mr-1 h-3 w-3" />
              Office
            </TabsTrigger>
            <TabsTrigger value="equipment">
              <Printer className="mr-1 h-3 w-3" />
              Equipment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="employee" className="space-y-4">
            {/* Add New Employee Button */}
            <Dialog open={showAddEmployee} onOpenChange={setShowAddEmployee}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <UserPlus className="mr-1 h-3 w-3" />
                  Add New Employee to {location.floors.find((f: any) => f.id === currentFloorId)?.name}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="new-name">Name *</Label>
                    <Input
                      id="new-name"
                      value={newEmployee.name}
                      onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-title">Title</Label>
                    <Input
                      id="new-title"
                      value={newEmployee.title}
                      onChange={(e) => setNewEmployee({ ...newEmployee, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-email">Email *</Label>
                    <Input
                      id="new-email"
                      type="email"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-phone">Phone</Label>
                    <Input
                      id="new-phone"
                      value={newEmployee.phone}
                      onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-notes">Notes</Label>
                    <Textarea
                      id="new-notes"
                      value={newEmployee.notes}
                      onChange={(e) => setNewEmployee({ ...newEmployee, notes: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddNewEmployee} className="flex-1">
                      Add Employee
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddEmployee(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Separator />

            {selectedEmployee ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-office-maroon">Edit Employee</h4>
                  <Badge variant="outline">{selectedEmployee.name}</Badge>
                </div>

                {editingEmployee ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="emp-name">Name</Label>
                      <Input
                        id="emp-name"
                        value={editingEmployee.name}
                        onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="emp-title">Title</Label>
                      <Input
                        id="emp-title"
                        value={editingEmployee.title}
                        onChange={(e) => setEditingEmployee({ ...editingEmployee, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="emp-email">Email</Label>
                      <Input
                        id="emp-email"
                        type="email"
                        value={editingEmployee.email}
                        onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="emp-phone">Phone</Label>
                      <Input
                        id="emp-phone"
                        value={editingEmployee.phone}
                        onChange={(e) => setEditingEmployee({ ...editingEmployee, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="emp-notes">Notes</Label>
                      <Textarea
                        id="emp-notes"
                        value={editingEmployee.notes}
                        onChange={(e) => setEditingEmployee({ ...editingEmployee, notes: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveEmployee} size="sm" className="flex-1">
                        <Save className="mr-1 h-3 w-3" />
                        Save
                      </Button>
                      <Button variant="outline" onClick={() => setEditingEmployee(null)} size="sm" className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button
                      onClick={() => setEditingEmployee({ ...selectedEmployee })}
                      variant="outline"
                      className="w-full"
                    >
                      Edit Details
                    </Button>

                    <Separator />

                    <div className="space-y-3">
                      <Label>Move Employee</Label>

                      {/* Office Selection */}
                      <div>
                        <Label className="text-sm text-muted-foreground">Target Office</Label>
                        <Select value={selectedTargetOffice} onValueChange={setSelectedTargetOffice}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select office" />
                          </SelectTrigger>
                          <SelectContent>
                            {allLocations.map((loc) => (
                              <SelectItem key={loc.id} value={loc.id}>
                                {loc.name} {loc.id === location.id && "(Current)"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Floor Selection (only if target office is selected) */}
                      {selectedTargetOffice && (
                        <div>
                          <Label className="text-sm text-muted-foreground">Target Floor</Label>
                          <Select value={selectedTargetFloor} onValueChange={setSelectedTargetFloor}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select floor" />
                            </SelectTrigger>
                            <SelectContent>
                              {getTargetOfficeFloors().map((floor: any) => (
                                <SelectItem key={floor.id} value={floor.id}>
                                  {floor.name}{" "}
                                  {floor.id === currentFloorId && selectedTargetOffice === location.id && "(Current)"}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {selectedTargetOffice && (
                        <Button onClick={handleMoveEmployee} className="w-full" size="sm">
                          <ArrowRight className="mr-1 h-3 w-3" />
                          Move Employee
                        </Button>
                      )}
                    </div>

                    <Separator />

                    <Button onClick={handleDeleteEmployee} variant="destructive" size="sm" className="w-full">
                      <Trash2 className="mr-1 h-3 w-3" />
                      Delete Employee
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <p>Select an employee to edit</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="office" className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-office-maroon">Office Settings</h4>
              <Badge variant="outline">{location.name}</Badge>
            </div>

            {editingLocation ? (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="office-name">Office Name</Label>
                  <Input
                    id="office-name"
                    value={editingLocation.name}
                    onChange={(e) => setEditingLocation({ ...editingLocation, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="office-address">Address</Label>
                  <Textarea
                    id="office-address"
                    value={editingLocation.address}
                    onChange={(e) => setEditingLocation({ ...editingLocation, address: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="office-phone">Phone</Label>
                  <Input
                    id="office-phone"
                    value={editingLocation.phone}
                    onChange={(e) => setEditingLocation({ ...editingLocation, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="office-hours">Hours</Label>
                  <Input
                    id="office-hours"
                    value={editingLocation.hours}
                    onChange={(e) => setEditingLocation({ ...editingLocation, hours: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="office-wifi">Wi-Fi Network</Label>
                  <Input
                    id="office-wifi"
                    value={editingLocation.wifi}
                    onChange={(e) => setEditingLocation({ ...editingLocation, wifi: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveLocation} size="sm" className="flex-1">
                    <Save className="mr-1 h-3 w-3" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setEditingLocation(null)} size="sm" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setEditingLocation({ ...location })} variant="outline" className="w-full">
                Edit Office Details
              </Button>
            )}
          </TabsContent>

          <TabsContent value="equipment" className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-office-maroon">Equipment Management</h4>
            </div>

            <div className="space-y-2">
              <Label>Printers in this office:</Label>
              {location.floors?.map((floor: any) =>
                floor.amenities
                  ?.filter((amenity: any) => amenity.type === "printer")
                  .map((printer: any) => (
                    <div key={printer.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium">{printer.name}</p>
                        <p className="text-sm text-muted-foreground">{printer.ipAddress}</p>
                      </div>
                      <div className="flex gap-1">
                        <Select onValueChange={(value) => onMovePrinter(printer.id, value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Move" />
                          </SelectTrigger>
                          <SelectContent>
                            {allLocations
                              .filter((loc) => loc.id !== location.id)
                              .map((loc) => (
                                <SelectItem key={loc.id} value={loc.id}>
                                  {loc.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <Button onClick={() => onDeletePrinter(printer.id)} variant="destructive" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )),
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
