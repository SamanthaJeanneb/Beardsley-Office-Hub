"use client"

import { useState } from "react"
import {
  Settings,
  Users,
  Building,
  Printer,
  Save,
  X,
  Trash2,
  ArrowRight,
  UserPlus,
  Upload,
  Hash,
  Plus,
} from "lucide-react"

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
import { PhotoUpload } from "@/components/photo-upload"
import { getPhotoUrl, openPrinterDriverLocation } from "@/lib/employee-data"

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
  onAddSeat: (seat: any, floorId: string) => void
  onAddFurniture: (furniture: any, floorId: string) => void
  onDeleteFurniture: (furnitureId: string, floorId: string) => void
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
  onAddSeat,
  onAddFurniture,
  onDeleteFurniture,
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
    employeeNumber: "",
    photo: null as string | null,
  })
  const [showAddEmployee, setShowAddEmployee] = useState(false)
  const [showUploadEmployee, setShowUploadEmployee] = useState(false)
  const [uploadEmployeeNumber, setUploadEmployeeNumber] = useState("")
  const [uploadCsvData, setUploadCsvData] = useState("")
  const [uploadEmployeeNumbers, setUploadEmployeeNumbers] = useState("")
  const [selectedTargetOffice, setSelectedTargetOffice] = useState("")
  const [selectedTargetFloor, setSelectedTargetFloor] = useState("")
  const [showAddSeatDialog, setShowAddSeatDialog] = useState(false)
  const [newSeat, setNewSeat] = useState({
    x: 100,
    y: 100,
    rotation: 0,
  })
  const [showAddFurnitureDialog, setShowAddFurnitureDialog] = useState(false)
  const [newFurniture, setNewFurniture] = useState({
    type: "desk",
    x: 100,
    y: 100,
    width: 60,
    height: 40,
    rotation: 0,
  })

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
      const photoUrl = newEmployee.photo || getPhotoUrl(newEmployee.name)

      onAddEmployee(
        {
          ...newEmployee,
          id: `emp-${Date.now()}`,
          profileUrl: "#",
          avatar: photoUrl,
        },
        currentFloorId,
      )
      setNewEmployee({
        name: "",
        title: "",
        email: "",
        phone: "",
        notes: "",
        employeeNumber: "",
        photo: null,
      })
      setShowAddEmployee(false)
    }
  }

  const handleUploadEmployee = () => {
    if (!uploadEmployeeNumbers || !uploadCsvData) {
      alert("Please provide both employee numbers and CSV data.")
      return
    }

    try {
      // Parse employee numbers (comma-separated)
      const employeeNumbers = uploadEmployeeNumbers
        .split(",")
        .map((num) => num.trim())
        .filter((num) => num.length > 0)

      if (employeeNumbers.length === 0) {
        alert("Please provide at least one employee number.")
        return
      }

      // Parse CSV data
      const csvLines = uploadCsvData.trim().split("\n")
      if (csvLines.length < 2) {
        alert("CSV data must contain at least a header row and one data row.")
        return
      }

      const headers = csvLines[0].split(",").map((h) => h.trim().toLowerCase())
      const addedEmployees: any[] = []

      // Process each employee number
      for (const targetNumber of employeeNumbers) {
        let employeeData: any = null

        // Find the employee with matching number
        for (let i = 1; i < csvLines.length; i++) {
          const values = csvLines[i].split(",").map((v) => v.trim())
          const empObj: any = {}

          headers.forEach((header, index) => {
            empObj[header] = values[index] || ""
          })

          // Check various possible column names for employee number
          const empNumber = empObj.employeenumber || empObj["employee number"] || empObj.number || empObj.id
          if (empNumber === targetNumber) {
            employeeData = empObj
            break
          }
        }

        if (employeeData) {
          // Create employee object with proper mapping
          const newEmp = {
            id: `emp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: employeeData.name || employeeData.fullname || employeeData["full name"] || "Unknown Employee",
            title: employeeData.title || employeeData.position || employeeData.role || "Employee",
            email:
              employeeData.email ||
              employeeData["email address"] ||
              `${(employeeData.name || "employee").toLowerCase().replace(/\s+/g, ".")}@beardsley.com`,
            phone: employeeData.phone || employeeData["phone number"] || employeeData.telephone || "",
            employeeNumber: targetNumber,
            profileUrl: "#",
            avatar: getPhotoUrl(employeeData.name || "Unknown Employee"),
            notes:
              employeeData.notes ||
              employeeData.description ||
              `Imported from CSV data on ${new Date().toLocaleDateString()}.`,
          }

          // Add employee to current floor
          onAddEmployee(newEmp, currentFloorId)
          addedEmployees.push(newEmp)
        }
      }

      if (addedEmployees.length > 0) {
        alert(
          `Successfully added ${addedEmployees.length} employee(s)!\n\nAdded: ${addedEmployees.map((emp) => emp.name).join(", ")}`,
        )
      } else {
        alert("No employees found with the provided numbers.")
      }

      // Clear form if any employees were added
      if (addedEmployees.length > 0) {
        setUploadEmployeeNumbers("")
        setUploadCsvData("")
        setShowUploadEmployee(false)
      }
    } catch (error) {
      console.error("Error parsing CSV data:", error)
      alert("Error parsing CSV data. Please check the format and try again.")
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

  const handlePrinterDriverAccess = (printerName: string) => {
    openPrinterDriverLocation(printerName)
  }

  const handleAddSeat = () => {
    if (!currentFloorId) return

    const newSeatObj = {
      id: `seat-${Date.now()}`,
      ...newSeat,
      employee: null,
    }

    onAddSeat(newSeatObj, currentFloorId)
    setShowAddSeatDialog(false)
    setNewSeat({
      x: 100,
      y: 100,
      rotation: 0,
    })
  }

  const handleAddFurniture = () => {
    if (!currentFloorId) return

    const newFurnitureObj = {
      id: `furniture-${Date.now()}`,
      ...newFurniture,
    }

    onAddFurniture(newFurnitureObj, currentFloorId)
    setShowAddFurnitureDialog(false)
    setNewFurniture({
      type: "desk",
      x: 100,
      y: 100,
      width: 60,
      height: 40,
      rotation: 0,
    })
  }

  // Get available floors for the selected target office
  const getTargetOfficeFloors = () => {
    if (!selectedTargetOffice) return []
    const targetOffice = allLocations.find((loc) => loc.id === selectedTargetOffice)
    return targetOffice?.floors || []
  }

  // Get first and last name for photo upload
  const getNameParts = (fullName: string) => {
    const parts = fullName.split(" ")
    return {
      firstName: parts[0] || "",
      lastName: parts[parts.length - 1] || "",
    }
  }

  if (!isEditMode) {
    return (
      <Card className="border-beardsley-red/20 bg-white shadow-sm">
        <CardHeader className="bg-gradient-to-r from-beardsley-red to-beardsley-red-light">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Admin Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Button onClick={onToggleEditMode} className="w-full bg-beardsley-red hover:bg-beardsley-red-light">
            <Settings className="mr-2 h-4 w-4" />
            Enable Edit Mode
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-beardsley-red/20 bg-white shadow-sm">
      <CardHeader className="bg-gradient-to-r from-beardsley-red to-beardsley-red-light">
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
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="new-name">Name *</Label>
                    <Input
                      id="new-name"
                      value={newEmployee.name}
                      onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="new-employee-number">Employee Number</Label>
                    <Input
                      id="new-employee-number"
                      value={newEmployee.employeeNumber}
                      onChange={(e) => setNewEmployee({ ...newEmployee, employeeNumber: e.target.value })}
                      placeholder="e.g., 00053"
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

                  {/* Photo Upload */}
                  {newEmployee.name && (
                    <PhotoUpload
                      firstName={getNameParts(newEmployee.name).firstName}
                      lastName={getNameParts(newEmployee.name).lastName}
                      onPhotoChange={(photoUrl) => setNewEmployee({ ...newEmployee, photo: photoUrl })}
                      currentPhoto={newEmployee.photo}
                    />
                  )}

                  <div>
                    <Label htmlFor="new-notes">Notes</Label>
                    <Textarea
                      id="new-notes"
                      value={newEmployee.notes}
                      onChange={(e) => setNewEmployee({ ...newEmployee, notes: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddNewEmployee}
                      className="flex-1 bg-beardsley-red hover:bg-beardsley-red-dark"
                    >
                      Add Employee
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddEmployee(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Upload Employee by Number */}
            <Dialog open={showUploadEmployee} onOpenChange={setShowUploadEmployee}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full border-beardsley-orange text-beardsley-orange hover:bg-beardsley-orange hover:text-white"
                >
                  <Hash className="mr-1 h-3 w-3" />
                  Upload Employee by Number
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload Employee Data</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="upload-employee-numbers">Employee Numbers (comma-separated)</Label>
                    <Input
                      id="upload-employee-numbers"
                      value={uploadEmployeeNumbers}
                      onChange={(e) => setUploadEmployeeNumbers(e.target.value)}
                      placeholder="e.g., 00053, 00054, 00055"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter multiple employee numbers separated by commas
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="upload-csv-data">CSV Data</Label>
                    <Textarea
                      id="upload-csv-data"
                      value={uploadCsvData}
                      onChange={(e) => setUploadCsvData(e.target.value)}
                      placeholder="name,title,email,phone,employeeNumber&#10;John Doe,Engineer,john@beardsley.com,555-1234,00053"
                      rows={6}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Format: name,title,email,phone,employeeNumber (header row required)
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleUploadEmployee}
                      className="flex-1 bg-beardsley-orange hover:bg-beardsley-orange-dark"
                    >
                      <Upload className="mr-1 h-3 w-3" />
                      Upload
                    </Button>
                    <Button variant="outline" onClick={() => setShowUploadEmployee(false)} className="flex-1">
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
                  <h4 className="font-medium text-beardsley-red">Edit Employee</h4>
                  <Badge variant="outline" className="max-w-[150px] truncate">
                    {selectedEmployee.name}
                  </Badge>
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
                      <Label htmlFor="emp-employee-number">Employee Number</Label>
                      <Input
                        id="emp-employee-number"
                        value={editingEmployee.employeeNumber || ""}
                        onChange={(e) => setEditingEmployee({ ...editingEmployee, employeeNumber: e.target.value })}
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

                    {/* Photo Upload for editing */}
                    {editingEmployee.name && (
                      <PhotoUpload
                        firstName={getNameParts(editingEmployee.name).firstName}
                        lastName={getNameParts(editingEmployee.name).lastName}
                        onPhotoChange={(photoUrl) => setEditingEmployee({ ...editingEmployee, avatar: photoUrl })}
                        currentPhoto={editingEmployee.avatar}
                      />
                    )}

                    <div>
                      <Label htmlFor="emp-notes">Notes</Label>
                      <Textarea
                        id="emp-notes"
                        value={editingEmployee.notes}
                        onChange={(e) => setEditingEmployee({ ...editingEmployee, notes: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveEmployee}
                        size="sm"
                        className="flex-1 bg-beardsley-green hover:bg-beardsley-green-dark"
                      >
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
                        <Button
                          onClick={handleMoveEmployee}
                          className="w-full"
                          size="sm"
                          variant="outline"
                          className="border-beardsley-orange text-beardsley-orange hover:bg-beardsley-orange hover:text-white"
                        >
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
              <h4 className="font-medium text-beardsley-red">Office Settings</h4>
              <Badge variant="outline">{location.name}</Badge>
            </div>

            {/* Add Seat Dialog */}
            <Dialog open={showAddSeatDialog} onOpenChange={setShowAddSeatDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full border-beardsley-green text-beardsley-green hover:bg-beardsley-green hover:text-white"
                >
                  <UserPlus className="mr-1 h-3 w-3" />
                  Add Seat
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Seat</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="seat-x">X Position</Label>
                    <Input
                      id="seat-x"
                      type="number"
                      value={newSeat.x}
                      onChange={(e) => setNewSeat({ ...newSeat, x: Number.parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="seat-y">Y Position</Label>
                    <Input
                      id="seat-y"
                      type="number"
                      value={newSeat.y}
                      onChange={(e) => setNewSeat({ ...newSeat, y: Number.parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="seat-rotation">Rotation (degrees)</Label>
                    <Input
                      id="seat-rotation"
                      type="number"
                      value={newSeat.rotation}
                      onChange={(e) => setNewSeat({ ...newSeat, rotation: Number.parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddSeat} className="flex-1 bg-beardsley-green hover:bg-beardsley-green-dark">
                      Add Seat
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddSeatDialog(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Add Empty Seat Button */}
            <Button
              variant="outline"
              className="w-full border-gray-400 text-gray-600 hover:bg-gray-100"
              onClick={() => {
                const newSeatObj = {
                  id: `seat-${Date.now()}`,
                  x: 100 + Math.random() * 200,
                  y: 100 + Math.random() * 200,
                  rotation: 0,
                  employee: null,
                }
                onAddSeat(newSeatObj, currentFloorId)
              }}
            >
              <Plus className="mr-1 h-3 w-3" />
              Add Empty Seat
            </Button>

            {/* Add Furniture Dialog */}
            <Dialog open={showAddFurnitureDialog} onOpenChange={setShowAddFurnitureDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full border-beardsley-orange text-beardsley-orange hover:bg-beardsley-orange hover:text-white"
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Add Furniture
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Furniture</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="furniture-type">Type</Label>
                    <Select
                      value={newFurniture.type}
                      onValueChange={(value) => setNewFurniture({ ...newFurniture, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select furniture type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desk">Desk</SelectItem>
                        <SelectItem value="table">Table</SelectItem>
                        <SelectItem value="cabinet">Cabinet</SelectItem>
                        <SelectItem value="bookshelf">Bookshelf</SelectItem>
                        <SelectItem value="plant">Plant</SelectItem>
                        <SelectItem value="whiteboard">Whiteboard</SelectItem>
                        <SelectItem value="chair">Chair</SelectItem>
                        <SelectItem value="sofa">Sofa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="furniture-x">X Position</Label>
                    <Input
                      id="furniture-x"
                      type="number"
                      value={newFurniture.x}
                      onChange={(e) => setNewFurniture({ ...newFurniture, x: Number.parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="furniture-y">Y Position</Label>
                    <Input
                      id="furniture-y"
                      type="number"
                      value={newFurniture.y}
                      onChange={(e) => setNewFurniture({ ...newFurniture, y: Number.parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="furniture-width">Width</Label>
                    <Input
                      id="furniture-width"
                      type="number"
                      value={newFurniture.width}
                      onChange={(e) =>
                        setNewFurniture({ ...newFurniture, width: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="furniture-height">Height</Label>
                    <Input
                      id="furniture-height"
                      type="number"
                      value={newFurniture.height}
                      onChange={(e) =>
                        setNewFurniture({ ...newFurniture, height: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="furniture-rotation">Rotation (degrees)</Label>
                    <Input
                      id="furniture-rotation"
                      type="number"
                      value={newFurniture.rotation}
                      onChange={(e) =>
                        setNewFurniture({ ...newFurniture, rotation: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddFurniture}
                      className="flex-1 bg-beardsley-orange hover:bg-beardsley-orange-dark"
                    >
                      Add Furniture
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddFurnitureDialog(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Separator />

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
                  <Button
                    onClick={handleSaveLocation}
                    size="sm"
                    className="flex-1 bg-beardsley-green hover:bg-beardsley-green-dark"
                  >
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
              <h4 className="font-medium text-beardsley-red">Equipment Management</h4>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              <Label>Printers in this office:</Label>
              <div className="space-y-3">
                {location.floors?.map((floor: any) =>
                  floor.amenities
                    ?.filter((amenity: any) => amenity.type === "printer")
                    .map((printer: any) => (
                      <div key={printer.id} className="flex flex-col gap-3 p-3 border rounded-lg bg-gray-50">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-beardsley-red truncate">{printer.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{printer.ipAddress}</p>
                          <p className="text-xs text-beardsley-green">{printer.status}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            onClick={() => handlePrinterDriverAccess(printer.name)}
                            variant="outline"
                            size="sm"
                            className="border-beardsley-orange text-beardsley-orange hover:bg-beardsley-orange hover:text-white flex-1 min-w-0"
                          >
                            Drivers
                          </Button>
                          <Select onValueChange={(value) => onMovePrinter(printer.id, value)}>
                            <SelectTrigger className="flex-1 min-w-0">
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
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
