"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Printer,
  DoorClosed,
  Bath,
  Coffee,
  Users,
  Search,
  X,
  Sofa,
  StepBackIcon as Stairs,
  Settings,
  Plus,
  Edit3,
  Move,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { openPrinterDriverLocation, furnitureTypes } from "@/lib/employee-data"
import { EmployeeHoverCard } from "@/components/employee-hover-card"
import { PrinterTooltip } from "@/components/printer-tooltip"

interface EnhancedSeatingChartProps {
  floorData: any
  allFloors: any[]
  currentFloorId: string
  onSelectEmployee: (employee: any) => void
  onFloorChange: (floorId: string) => void
  isEditMode?: boolean
  onUpdateSeatPosition?: (seatId: string, x: number, y: number) => void
  onMoveSeat?: (fromSeatId: string, toSeatId: string) => void
  onUpdateRoom?: (roomId: string, updates: any) => void
  onDeleteRoom?: (roomId: string) => void
  onAddRoom?: (room: any) => void
  onAddAmenity?: (amenity: any) => void
  onUpdateAmenity?: (amenityId: string, updates: any) => void
  onDeleteAmenity?: (amenityId: string) => void
  onUpdateFurniture?: (furnitureId: string, updates: any) => void
  onDeleteFurniture?: (furnitureId: string) => void
  onAddFurniture?: (furniture: any) => void
}

export function EnhancedSeatingChart({
  floorData,
  allFloors,
  currentFloorId,
  onSelectEmployee,
  onFloorChange,
  isEditMode = false,
  onUpdateSeatPosition,
  onMoveSeat,
  onUpdateRoom,
  onDeleteRoom,
  onAddRoom,
  onAddAmenity,
  onUpdateAmenity,
  onDeleteAmenity,
  onUpdateFurniture,
  onDeleteFurniture,
}: EnhancedSeatingChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.8)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [hoveredEmployee, setHoveredEmployee] = useState<any>(null)
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 })
  const [hoveredPrinter, setHoveredPrinter] = useState<any>(null)
  const [printerPosition, setPrinterPosition] = useState({ x: 0, y: 0 })
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResult, setSearchResult] = useState<any>(null)
  const [highlightedSeat, setHighlightedSeat] = useState<string | null>(null)

  // Edit mode specific states
  const [draggedSeat, setDraggedSeat] = useState<any>(null)
  const [draggedSeatOffset, setDraggedSeatOffset] = useState({ x: 0, y: 0 })
  const [isDraggingSeat, setIsDraggingSeat] = useState(false)
  const [dropTarget, setDropTarget] = useState<string | null>(null)

  // Room editing states
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [isDraggingRoom, setIsDraggingRoom] = useState(false)
  const [isResizingRoom, setIsResizingRoom] = useState(false)
  const [draggedRoom, setDraggedRoom] = useState<any>(null)
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  const [roomDragOffset, setRoomDragOffset] = useState({ x: 0, y: 0 })
  const [showAddAmenityDialog, setShowAddAmenityDialog] = useState(false)
  const [showAddRoomDialog, setShowAddRoomDialog] = useState(false)
  const [newAmenity, setNewAmenity] = useState({
    type: "printer",
    name: "",
    x: 100,
    y: 100,
  })
  const [newRoom, setNewRoom] = useState({
    name: "",
    type: "office",
    x: 100,
    y: 100,
    width: 150,
    height: 100,
  })

  // Amenity editing states
  const [selectedAmenity, setSelectedAmenity] = useState<any>(null)
  const [isDraggingAmenity, setIsDraggingAmenity] = useState(false)
  const [draggedAmenity, setDraggedAmenity] = useState<any>(null)

  // Furniture editing states
  const [selectedFurniture, setSelectedFurniture] = useState<any>(null)
  const [isDraggingFurniture, setIsDraggingFurniture] = useState(false)
  const [draggedFurniture, setDraggedFurniture] = useState<any>(null)
  const [furnitureDragOffset, setFurnitureDragOffset] = useState({ x: 0, y: 0 })

  // Reset view to default
  const resetView = () => {
    setScale(0.8)
    setPosition({ x: 0, y: 0 })
  }

  // Zoom functions with limits
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 2))
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.3))

  // Handle mouse wheel zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        if (e.deltaY < 0) {
          setScale((prev) => Math.min(prev + 0.1, 2))
        } else {
          setScale((prev) => Math.max(prev - 0.1, 0.3))
        }
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false })
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel)
      }
    }
  }, [])

  // Handle mouse drag for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (
      e.button !== 0 ||
      isEditMode ||
      isDraggingSeat ||
      isDraggingRoom ||
      isDraggingAmenity ||
      isResizingRoom ||
      isDraggingFurniture
    )
      return
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingSeat) {
      handleSeatDrag(e)
      return
    }
    if (isDraggingRoom) {
      handleRoomDrag(e)
      return
    }
    if (isResizingRoom) {
      handleRoomResize(e)
      return
    }
    if (isDraggingAmenity) {
      handleAmenityDrag(e)
      return
    }
    if (isDraggingFurniture) {
      handleFurnitureDrag(e)
      return
    }
    if (!isDragging || isEditMode) return
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDraggingSeat) {
      handleSeatDrop()
      return
    }
    if (isDraggingRoom || isResizingRoom) {
      handleRoomDrop()
      return
    }
    if (isDraggingAmenity) {
      handleAmenityDrop()
      return
    }
    if (isDraggingFurniture) {
      handleFurnitureDrop()
      return
    }
    setIsDragging(false)
  }

  // Room drag and drop handlers
  const handleRoomMouseDown = (room: any, e: React.MouseEvent, handle?: string) => {
    if (!isEditMode) return
    e.stopPropagation()

    const containerRect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 }
    const svgX = (e.clientX - containerRect.left - position.x) / scale
    const svgY = (e.clientY - containerRect.top - position.y) / scale

    if (handle) {
      setIsResizingRoom(true)
      setResizeHandle(handle)
      setDraggedRoom({ ...room })
    } else {
      setIsDraggingRoom(true)
      setDraggedRoom({ ...room })
      setRoomDragOffset({
        x: svgX - room.x,
        y: svgY - room.y,
      })
    }

    setSelectedRoom(room)
  }

  const handleRoomDrag = (e: React.MouseEvent) => {
    if (!isDraggingRoom || !draggedRoom) return

    e.preventDefault()

    const containerRect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 }
    const svgX = (e.clientX - containerRect.left - position.x) / scale
    const svgY = (e.clientY - containerRect.top - position.y) / scale

    setDraggedRoom({
      ...draggedRoom,
      x: Math.max(0, svgX - roomDragOffset.x),
      y: Math.max(0, svgY - roomDragOffset.y),
    })
  }

  const handleRoomResize = (e: React.MouseEvent) => {
    if (!isResizingRoom || !draggedRoom || !resizeHandle) return

    e.preventDefault()

    const containerRect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 }
    const svgX = (e.clientX - containerRect.left - position.x) / scale
    const svgY = (e.clientY - containerRect.top - position.y) / scale

    const newRoom = { ...draggedRoom }
    const minSize = 50

    switch (resizeHandle) {
      case "bottom-right":
        newRoom.width = Math.max(minSize, svgX - newRoom.x)
        newRoom.height = Math.max(minSize, svgY - newRoom.y)
        break
      case "top-left":
        const newWidth = newRoom.width + (newRoom.x - svgX)
        const newHeight = newRoom.height + (newRoom.y - svgY)
        if (newWidth >= minSize) {
          newRoom.x = svgX
          newRoom.width = newWidth
        }
        if (newHeight >= minSize) {
          newRoom.y = svgY
          newRoom.height = newHeight
        }
        break
      case "top-right":
        newRoom.width = Math.max(minSize, svgX - newRoom.x)
        const newHeightTR = newRoom.height + (newRoom.y - svgY)
        if (newHeightTR >= minSize) {
          newRoom.y = svgY
          newRoom.height = newHeightTR
        }
        break
      case "bottom-left":
        const newWidthBL = newRoom.width + (newRoom.x - svgX)
        if (newWidthBL >= minSize) {
          newRoom.x = svgX
          newRoom.width = newWidthBL
        }
        newRoom.height = Math.max(minSize, svgY - newRoom.y)
        break
    }

    setDraggedRoom(newRoom)
  }

  const handleRoomDrop = () => {
    if (!draggedRoom || !onUpdateRoom) return

    onUpdateRoom(draggedRoom.id, {
      x: draggedRoom.x,
      y: draggedRoom.y,
      width: draggedRoom.width,
      height: draggedRoom.height,
    })

    setIsDraggingRoom(false)
    setIsResizingRoom(false)
    setDraggedRoom(null)
    setResizeHandle(null)
  }

  // Amenity drag and drop handlers
  const handleAmenityMouseDown = (amenity: any, e: React.MouseEvent) => {
    if (!isEditMode) return
    e.stopPropagation()

    setIsDraggingAmenity(true)
    setDraggedAmenity({ ...amenity })
    setSelectedAmenity(amenity)

    const containerRect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 }
    const svgX = (e.clientX - containerRect.left - position.x) / scale
    const svgY = (e.clientY - containerRect.top - position.y) / scale

    setDraggedSeatOffset({
      x: svgX - amenity.x,
      y: svgY - amenity.y,
    })
  }

  const handleAmenityDrag = (e: React.MouseEvent) => {
    if (!isDraggingAmenity || !draggedAmenity) return

    e.preventDefault()

    const containerRect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 }
    const svgX = (e.clientX - containerRect.left - position.x) / scale
    const svgY = (e.clientY - containerRect.top - position.y) / scale

    setDraggedAmenity({
      ...draggedAmenity,
      x: Math.max(0, svgX - draggedSeatOffset.x),
      y: Math.max(0, svgY - draggedSeatOffset.y),
    })
  }

  const handleAmenityDrop = () => {
    if (!isDraggingAmenity || !draggedAmenity || !onUpdateAmenity) return

    onUpdateAmenity(draggedAmenity.id, {
      x: draggedAmenity.x,
      y: draggedAmenity.y,
    })

    setIsDraggingAmenity(false)
    setDraggedAmenity(null)
  }

  // Furniture drag and drop handlers
  const handleFurnitureMouseDown = (furniture: any, e: React.MouseEvent) => {
    if (!isEditMode) return
    e.stopPropagation()

    setIsDraggingFurniture(true)
    setDraggedFurniture({ ...furniture })
    setSelectedFurniture(furniture)

    const containerRect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 }
    const svgX = (e.clientX - containerRect.left - position.x) / scale
    const svgY = (e.clientY - containerRect.top - position.y) / scale

    setFurnitureDragOffset({
      x: svgX - furniture.x,
      y: svgY - furniture.y,
    })
  }

  const handleFurnitureDrag = (e: React.MouseEvent) => {
    if (!isDraggingFurniture || !draggedFurniture) return

    e.preventDefault()

    const containerRect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 }
    const svgX = (e.clientX - containerRect.left - position.x) / scale
    const svgY = (e.clientY - containerRect.top - position.y) / scale

    setDraggedFurniture({
      ...draggedFurniture,
      x: Math.max(0, svgX - furnitureDragOffset.x),
      y: Math.max(0, svgY - furnitureDragOffset.y),
    })
  }

  const handleFurnitureDrop = () => {
    if (!isDraggingFurniture || !draggedFurniture || !onUpdateFurniture) return

    onUpdateFurniture(draggedFurniture.id, {
      x: draggedFurniture.x,
      y: draggedFurniture.y,
    })

    setIsDraggingFurniture(false)
    setDraggedFurniture(null)
  }

  // Seat drag and drop handlers (existing functionality)
  const handleSeatMouseDown = (seat: any, e: React.MouseEvent) => {
    if (!isEditMode) return

    e.stopPropagation()
    setIsDraggingSeat(true)
    setDraggedSeat(seat)

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const containerRect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 }

    setDraggedSeatOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleSeatDrag = (e: React.MouseEvent) => {
    if (!isDraggingSeat || !draggedSeat) return

    e.preventDefault()

    const containerRect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 }
    const svgX = (e.clientX - containerRect.left - position.x) / scale - draggedSeatOffset.x
    const svgY = (e.clientY - containerRect.top - position.y) / scale - draggedSeatOffset.y

    setDraggedSeat({ ...draggedSeat, x: svgX, y: svgY })
  }

  const handleSeatDrop = () => {
    if (!isDraggingSeat || !draggedSeat) return

    setIsDraggingSeat(false)

    if (dropTarget && onMoveSeat) {
      onMoveSeat(draggedSeat.id, dropTarget)
    } else if (onUpdateSeatPosition) {
      onUpdateSeatPosition(draggedSeat.id, draggedSeat.x, draggedSeat.y)
    }

    setDraggedSeat(null)
    setDropTarget(null)
  }

  // Add new amenity
  const handleAddAmenity = () => {
    if (!onAddAmenity) return

    const amenity = {
      id: `amenity-${Date.now()}`,
      type: newAmenity.type,
      name: newAmenity.name || `New ${newAmenity.type}`,
      x: newAmenity.x,
      y: newAmenity.y,
      ...(newAmenity.type === "printer" && {
        ipAddress: "192.168.1.100",
        queueName: "NEW-PRINT-01",
        status: "Online",
      }),
    }

    onAddAmenity(amenity)
    setShowAddAmenityDialog(false)
    setNewAmenity({
      type: "printer",
      name: "",
      x: 100,
      y: 100,
    })
  }

  // Add new room
  const handleAddRoom = () => {
    if (!onAddRoom) return

    const room = {
      id: `room-${Date.now()}`,
      name: newRoom.name || `New ${newRoom.type}`,
      type: newRoom.type,
      x: newRoom.x,
      y: newRoom.y,
      width: newRoom.width,
      height: newRoom.height,
    }

    onAddRoom(room)
    setShowAddRoomDialog(false)
    setNewRoom({
      name: "",
      type: "office",
      x: 100,
      y: 100,
      width: 150,
      height: 100,
    })
  }

  // Delete selected room
  const handleDeleteRoom = () => {
    if (!selectedRoom || !onDeleteRoom) return

    if (confirm(`Are you sure you want to delete the room "${selectedRoom.name}"?`)) {
      onDeleteRoom(selectedRoom.id)
      setSelectedRoom(null)
    }
  }

  // Delete selected amenity
  const handleDeleteAmenity = () => {
    if (!selectedAmenity || !onDeleteAmenity) return

    if (confirm(`Are you sure you want to delete "${selectedAmenity.name}"?`)) {
      onDeleteAmenity(selectedAmenity.id)
      setSelectedAmenity(null)
    }
  }

  // Delete selected furniture
  const handleDeleteFurniture = () => {
    if (!selectedFurniture || !onDeleteFurniture) return

    if (confirm(`Are you sure you want to delete this ${selectedFurniture.type}?`)) {
      onDeleteFurniture(selectedFurniture.id)
      setSelectedFurniture(null)
    }
  }

  // Handle hover events for employee cards
  const handleSeatMouseEnter = (employee: any, e: React.MouseEvent) => {
    if (!employee || isEditMode) return
    setHoveredEmployee(employee)

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const containerRect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 }

    setHoverPosition({
      x: rect.left - containerRect.left + rect.width,
      y: rect.top - containerRect.top,
    })
  }

  const handleSeatMouseLeave = () => {
    if (!isEditMode) {
      setHoveredEmployee(null)
    }
  }

  // Handle hover events for printer tooltips
  const handlePrinterMouseEnter = (printer: any, e: React.MouseEvent) => {
    if (isEditMode) return
    setHoveredPrinter(printer)

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const containerRect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 }

    setPrinterPosition({
      x: rect.left - containerRect.left + rect.width,
      y: rect.top - containerRect.top,
    })
  }

  const handlePrinterMouseLeave = () => {
    if (!isEditMode) {
      setHoveredPrinter(null)
    }
  }

  // Handle printer click to open driver download
  const handlePrinterClick = (printer: any) => {
    if (!isEditMode) {
      openPrinterDriverLocation(printer.name)
    }
  }

  // Handle search functionality across all floors
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchQuery.trim()) {
      clearSearch()
      return
    }

    const query = searchQuery.toLowerCase()
    let foundEmployee = null
    let foundFloor = null
    let foundSeat = null

    for (const floor of allFloors) {
      const seat = floor.seats.find(
        (seat: any) =>
          seat.employee &&
          (seat.employee.name.toLowerCase().includes(query) ||
            seat.employee.title.toLowerCase().includes(query) ||
            seat.employee.email.toLowerCase().includes(query)),
      )

      if (seat) {
        foundEmployee = seat.employee
        foundFloor = floor
        foundSeat = seat
        break
      }
    }

    if (foundEmployee && foundFloor && foundSeat) {
      setSearchResult({
        employee: foundEmployee,
        floor: foundFloor,
        seat: foundSeat,
      })

      if (foundFloor.id !== currentFloorId) {
        onFloorChange(foundFloor.id)
      }

      setHighlightedSeat(foundSeat.id)
      onSelectEmployee(foundEmployee)

      setTimeout(() => {
        if (containerRef.current && chartRef.current) {
          const containerWidth = containerRef.current.clientWidth
          const containerHeight = containerRef.current.clientHeight

          const seatX = foundSeat.x * scale
          const seatY = foundSeat.y * scale

          const newX = -(seatX - containerWidth / 2)
          const newY = -(seatY - containerHeight / 2)

          setPosition({ x: newX, y: newY })
        }
      }, 100)
    } else {
      setSearchResult(null)
      setHighlightedSeat(null)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResult(null)
    setHighlightedSeat(null)
  }

  // Get room color based on type
  const getRoomColor = (roomType: string) => {
    switch (roomType) {
      case "conference":
        return "#D1FAE5"
      case "kitchen":
        return "#FED7AA"
      case "reception":
        return "#FEE2E2"
      case "print":
        return "#FCE7F3"
      case "restroom":
        return "#F3F4F6"
      case "office":
        return "#F1F5F9"
      case "storage":
        return "#FEF3C7"
      case "mechanical":
        return "#E5E7EB"
      default:
        return "#F9FAFB"
    }
  }

  const getRoomStroke = (roomType: string) => {
    switch (roomType) {
      case "conference":
        return "#10B981"
      case "kitchen":
        return "#EA580C"
      case "reception":
        return "#DC2626"
      case "print":
        return "#EC4899"
      case "restroom":
        return "#9CA3AF"
      case "office":
        return "#64748B"
      case "storage":
        return "#F59E0B"
      case "mechanical":
        return "#6B7280"
      default:
        return "#E5E7EB"
    }
  }

  return (
    <div className="relative">
      {/* Search and Controls */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="text"
              placeholder="Search by name, title, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
              disabled={isEditMode}
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
                onClick={clearSearch}
                disabled={isEditMode}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <Button type="submit" variant="default" disabled={isEditMode}>
            Find
          </Button>
        </form>

        <div className="flex gap-2">
          {isEditMode && (
            <>
              <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-md text-sm">
                <Settings className="h-3 w-3" />
                Edit Mode Active
              </div>

              {/* Add Room Dialog */}
              <Dialog open={showAddRoomDialog} onOpenChange={setShowAddRoomDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-office-green text-office-green">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Room
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Room</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="room-name">Room Name</Label>
                      <Input
                        id="room-name"
                        value={newRoom.name}
                        onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                        placeholder="Enter room name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="room-type">Type</Label>
                      <Select value={newRoom.type} onValueChange={(value) => setNewRoom({ ...newRoom, type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="office">Office</SelectItem>
                          <SelectItem value="conference">Conference Room</SelectItem>
                          <SelectItem value="kitchen">Kitchen</SelectItem>
                          <SelectItem value="reception">Reception</SelectItem>
                          <SelectItem value="restroom">Restroom</SelectItem>
                          <SelectItem value="storage">Storage</SelectItem>
                          <SelectItem value="mechanical">Mechanical</SelectItem>
                          <SelectItem value="print">Print Room</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="room-x">X Position</Label>
                        <Input
                          id="room-x"
                          type="number"
                          value={newRoom.x}
                          onChange={(e) => setNewRoom({ ...newRoom, x: Number.parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="room-y">Y Position</Label>
                        <Input
                          id="room-y"
                          type="number"
                          value={newRoom.y}
                          onChange={(e) => setNewRoom({ ...newRoom, y: Number.parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="room-width">Width</Label>
                        <Input
                          id="room-width"
                          type="number"
                          value={newRoom.width}
                          onChange={(e) =>
                            setNewRoom({ ...newRoom, width: Math.max(50, Number.parseInt(e.target.value) || 50) })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="room-height">Height</Label>
                        <Input
                          id="room-height"
                          type="number"
                          value={newRoom.height}
                          onChange={(e) =>
                            setNewRoom({ ...newRoom, height: Math.max(50, Number.parseInt(e.target.value) || 50) })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddRoom} className="flex-1">
                        Add Room
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddRoomDialog(false)} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Add Amenity Dialog */}
              <Dialog open={showAddAmenityDialog} onOpenChange={setShowAddAmenityDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-office-orange text-office-orange">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Amenity
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Amenity</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="amenity-type">Type</Label>
                      <Select
                        value={newAmenity.type}
                        onValueChange={(value) => setNewAmenity({ ...newAmenity, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="printer">Printer</SelectItem>
                          <SelectItem value="restroom">Restroom</SelectItem>
                          <SelectItem value="kitchen">Kitchen</SelectItem>
                          <SelectItem value="exit">Emergency Exit</SelectItem>
                          <SelectItem value="conference">Conference Room</SelectItem>
                          <SelectItem value="furniture">Furniture</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="amenity-name">Name</Label>
                      <Input
                        id="amenity-name"
                        value={newAmenity.name}
                        onChange={(e) => setNewAmenity({ ...newAmenity, name: e.target.value })}
                        placeholder={`New ${newAmenity.type}`}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="amenity-x">X Position</Label>
                        <Input
                          id="amenity-x"
                          type="number"
                          value={newAmenity.x}
                          onChange={(e) => setNewAmenity({ ...newAmenity, x: Number.parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="amenity-y">Y Position</Label>
                        <Input
                          id="amenity-y"
                          type="number"
                          value={newAmenity.y}
                          onChange={(e) => setNewAmenity({ ...newAmenity, y: Number.parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddAmenity} className="flex-1">
                        Add Amenity
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddAmenityDialog(false)} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Delete buttons for selected items */}
              {selectedRoom && (
                <Button variant="destructive" size="sm" onClick={handleDeleteRoom}>
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete Room
                </Button>
              )}
              {selectedAmenity && (
                <Button variant="destructive" size="sm" onClick={handleDeleteAmenity}>
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete Amenity
                </Button>
              )}
              {selectedFurniture && (
                <Button variant="destructive" size="sm" onClick={handleDeleteFurniture}>
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete Furniture
                </Button>
              )}
            </>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={zoomOut}
            title="Zoom out"
            className="bg-white/90 backdrop-blur"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={zoomIn} title="Zoom in" className="bg-white/90 backdrop-blur">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={resetView}
            title="Reset view"
            className="bg-white/90 backdrop-blur"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Edit Mode Instructions */}
      {isEditMode && (
        <Alert className="mb-4 border-orange-200 bg-orange-50">
          <Settings className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Edit Mode:</strong> Drag employees to move them. Drag rooms to reposition them. Drag room corners to
            resize. Click items to select them, then use delete buttons. Add new rooms and amenities with the buttons
            above.
          </AlertDescription>
        </Alert>
      )}

      {/* Search Result Banner */}
      {searchResult && !isEditMode && (
        <Alert className="mb-4 border-office-green bg-office-green/5">
          <Search className="h-4 w-4 text-office-green" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              Found <strong>{searchResult.employee.name}</strong> on {searchResult.floor.name}
            </span>
            <Button variant="ghost" size="sm" onClick={clearSearch} className="h-6 w-6 p-0">
              <X className="h-3 w-3" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Map container with pan and zoom */}
      <div
        ref={containerRef}
        className="h-[700px] overflow-hidden rounded-xl border-2 border-office-maroon/20 bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? "grabbing" : isEditMode ? "default" : "grab" }}
      >
        <div
          ref={chartRef}
          className="relative h-full w-full"
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transformOrigin: "0 0",
            transition:
              isDragging ||
              isDraggingSeat ||
              isDraggingRoom ||
              isDraggingAmenity ||
              isResizingRoom ||
              isDraggingFurniture
                ? "none"
                : "transform 100ms",
          }}
        >
          {/* Floor plan SVG container */}
          <div className="absolute inset-0">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 1000 600"
              className="h-full w-full"
              preserveAspectRatio="xMidYMid meet"
              style={{ filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))" }}
            >
              {/* Floor background */}
              <rect width="1000" height="600" fill="#FAFAFA" stroke="#E5E7EB" strokeWidth="2" rx="8" />

              {/* Render rooms */}
              {floorData.rooms?.map((room: any) => {
                const isDraggedRoom = (isDraggingRoom || isResizingRoom) && draggedRoom && draggedRoom.id === room.id
                const displayRoom = isDraggedRoom ? draggedRoom : room

                return (
                  <g key={room.id}>
                    <rect
                      x={displayRoom.x}
                      y={displayRoom.y}
                      width={displayRoom.width}
                      height={displayRoom.height}
                      fill={getRoomColor(displayRoom.type)}
                      stroke={getRoomStroke(displayRoom.type)}
                      strokeWidth={selectedRoom?.id === room.id ? "4" : "2"}
                      rx="4"
                      className={cn(
                        isEditMode && "cursor-move hover:stroke-office-maroon",
                        selectedRoom?.id === room.id && "stroke-office-maroon",
                      )}
                      onMouseDown={(e) => handleRoomMouseDown(room, e as any)}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (isEditMode) setSelectedRoom(room)
                      }}
                    />
                    <text
                      x={displayRoom.x + displayRoom.width / 2}
                      y={displayRoom.y + displayRoom.height / 2}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-xs font-medium pointer-events-none select-none"
                      fill={getRoomStroke(displayRoom.type)}
                    >
                      {displayRoom.name}
                    </text>

                    {/* Resize handles for selected room in edit mode */}
                    {isEditMode && selectedRoom?.id === room.id && (
                      <>
                        {/* Corner resize handles */}
                        <circle
                          cx={displayRoom.x + displayRoom.width}
                          cy={displayRoom.y + displayRoom.height}
                          r="6"
                          fill="#DC2626"
                          stroke="#FFFFFF"
                          strokeWidth="2"
                          className="cursor-se-resize"
                          onMouseDown={(e) => {
                            e.stopPropagation()
                            handleRoomMouseDown(room, e as any, "bottom-right")
                          }}
                        />
                        <circle
                          cx={displayRoom.x}
                          cy={displayRoom.y}
                          r="6"
                          fill="#DC2626"
                          stroke="#FFFFFF"
                          strokeWidth="2"
                          className="cursor-nw-resize"
                          onMouseDown={(e) => {
                            e.stopPropagation()
                            handleRoomMouseDown(room, e as any, "top-left")
                          }}
                        />
                        <circle
                          cx={displayRoom.x + displayRoom.width}
                          cy={displayRoom.y}
                          r="6"
                          fill="#DC2626"
                          stroke="#FFFFFF"
                          strokeWidth="2"
                          className="cursor-ne-resize"
                          onMouseDown={(e) => {
                            e.stopPropagation()
                            handleRoomMouseDown(room, e as any, "top-right")
                          }}
                        />
                        <circle
                          cx={displayRoom.x}
                          cy={displayRoom.y + displayRoom.height}
                          r="6"
                          fill="#DC2626"
                          stroke="#FFFFFF"
                          strokeWidth="2"
                          className="cursor-sw-resize"
                          onMouseDown={(e) => {
                            e.stopPropagation()
                            handleRoomMouseDown(room, e as any, "bottom-left")
                          }}
                        />
                      </>
                    )}
                  </g>
                )
              })}

              {/* Render furniture */}
              {floorData.furniture?.map((furniture: any) => {
                const furnitureType = furnitureTypes[furniture.type as keyof typeof furnitureTypes]
                if (!furnitureType) return null

                const isDraggedFurniture =
                  isDraggingFurniture && draggedFurniture && draggedFurniture.id === furniture.id
                const displayFurniture = isDraggedFurniture ? draggedFurniture : furniture

                return (
                  <g key={furniture.id}>
                    <rect
                      x={displayFurniture.x}
                      y={displayFurniture.y}
                      width={displayFurniture.width || furnitureType.width}
                      height={displayFurniture.height || furnitureType.height}
                      fill={furnitureType.color}
                      stroke={furnitureType.strokeColor}
                      strokeWidth={selectedFurniture?.id === furniture.id ? "4" : "2"}
                      rx="2"
                      className={cn(
                        "drop-shadow-sm",
                        isEditMode && "cursor-move hover:stroke-office-maroon",
                        selectedFurniture?.id === furniture.id && "stroke-office-maroon",
                        isDraggedFurniture && "opacity-70",
                      )}
                      onMouseDown={isEditMode ? (e) => handleFurnitureMouseDown(furniture, e as any) : undefined}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (isEditMode) setSelectedFurniture(furniture)
                      }}
                    />
                    <text
                      x={displayFurniture.x + (displayFurniture.width || furnitureType.width) / 2}
                      y={displayFurniture.y + (displayFurniture.height || furnitureType.height) / 2}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-xs font-medium pointer-events-none select-none fill-white"
                      style={{ fontSize: "8px" }}
                    >
                      {furnitureType.name.split(" ")[0]}
                    </text>
                  </g>
                )
              })}

              {/* Employee seats as SVG elements */}
              {floorData.seats?.map((seat: any) => {
                const isDraggedSeat = draggedSeat && draggedSeat.id === seat.id
                const displaySeat = isDraggedSeat ? draggedSeat : seat

                return (
                  <g key={seat.id}>
                    <circle
                      cx={displaySeat.x}
                      cy={displaySeat.y}
                      r="15"
                      className={cn(
                        "transition-all duration-200",
                        seat.employee
                          ? "fill-orange-400 stroke-red-900 stroke-2"
                          : "fill-white stroke-gray-300 stroke-2",
                        highlightedSeat === seat.id && "animate-pulse stroke-green-500 stroke-4",
                        isEditMode && "cursor-move hover:stroke-office-maroon",
                        isDraggedSeat && "opacity-70",
                        dropTarget === seat.id && "stroke-green-500 stroke-4",
                        !isEditMode && seat.employee && "cursor-pointer",
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!isEditMode && seat.employee) {
                          onSelectEmployee(seat.employee)
                        } else if (isEditMode && seat.employee) {
                          onSelectEmployee(seat.employee)
                        }
                      }}
                      onMouseDown={(e) => handleSeatMouseDown(seat, e as any)}
                      onMouseEnter={(e) => {
                        if (isDraggingSeat && seat.id !== draggedSeat?.id) {
                          setDropTarget(seat.id)
                        } else {
                          seat.employee && handleSeatMouseEnter(seat.employee, e as any)
                        }
                      }}
                      onMouseLeave={() => {
                        if (isDraggingSeat) {
                          setDropTarget(null)
                        } else {
                          handleSeatMouseLeave()
                        }
                      }}
                      style={{
                        filter: seat.employee
                          ? "drop-shadow(0 4px 8px rgba(124, 45, 18, 0.3))"
                          : "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
                      }}
                    />
                    {seat.employee && (
                      <text
                        x={displaySeat.x}
                        y={displaySeat.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="fill-white text-xs font-bold pointer-events-none select-none"
                        style={{ fontSize: "8px" }}
                      >
                        {seat.employee.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .substring(0, 3)}
                      </text>
                    )}
                  </g>
                )
              })}

              {/* Office amenities as SVG elements */}
              {floorData.amenities?.map((amenity: any) => {
                const isPrinter = amenity.type === "printer"
                const isFurniture = amenity.type === "furniture"
                const isDraggedAmenity = draggedAmenity && draggedAmenity.id === amenity.id
                const displayAmenity = isDraggedAmenity ? draggedAmenity : amenity

                return (
                  <g key={amenity.id}>
                    <circle
                      cx={displayAmenity.x}
                      cy={displayAmenity.y}
                      r={isFurniture ? "12" : "10"}
                      className={cn(
                        "transition-all duration-200",
                        isPrinter
                          ? "fill-white stroke-gray-300 stroke-2 cursor-pointer hover:stroke-red-900"
                          : isFurniture
                            ? "fill-amber-100 stroke-amber-500 stroke-2"
                            : "fill-white stroke-gray-300 stroke-2",
                        isEditMode && "cursor-move hover:stroke-office-maroon",
                        selectedAmenity?.id === amenity.id && "stroke-office-maroon stroke-4",
                        isDraggedAmenity && "opacity-70",
                      )}
                      onMouseEnter={
                        isPrinter && !isEditMode ? (e) => handlePrinterMouseEnter(amenity, e as any) : undefined
                      }
                      onMouseLeave={isPrinter && !isEditMode ? handlePrinterMouseLeave : undefined}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (isPrinter && !isEditMode) {
                          handlePrinterClick(amenity)
                        } else if (isEditMode) {
                          setSelectedAmenity(amenity)
                        }
                      }}
                      onMouseDown={isEditMode ? (e) => handleAmenityMouseDown(amenity, e as any) : undefined}
                      style={{
                        filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
                      }}
                    />
                    <foreignObject
                      x={displayAmenity.x - 6}
                      y={displayAmenity.y - 6}
                      width="12"
                      height="12"
                      className="pointer-events-none"
                    >
                      <div className="flex h-full w-full items-center justify-center">
                        {amenity.type === "printer" && <Printer className="h-3 w-3 text-red-900" />}
                        {amenity.type === "restroom" && <Bath className="h-3 w-3 text-office-green" />}
                        {amenity.type === "exit" && <DoorClosed className="h-3 w-3 text-red-600" />}
                        {amenity.type === "kitchen" && <Coffee className="h-3 w-3 text-orange-600" />}
                        {amenity.type === "conference" && <Users className="h-3 w-3 text-office-green" />}
                        {amenity.type === "stairs" && <Stairs className="h-3 w-3 text-gray-600" />}
                        {amenity.type === "furniture" && <Sofa className="h-3 w-3 text-amber-600" />}
                        {amenity.type === "door" && <DoorClosed className="h-3 w-3 text-purple-600" />}
                      </div>
                    </foreignObject>
                  </g>
                )
              })}
            </svg>
          </div>
        </div>

        {/* Hover card for employees (only in non-edit mode) */}
        {hoveredEmployee && !isEditMode && (
          <div
            className="pointer-events-none absolute z-20 rounded-lg border-2 border-office-maroon/20 bg-white/95 p-3 shadow-xl backdrop-blur-sm"
            style={{
              left: `${hoverPosition.x}px`,
              top: `${hoverPosition.y}px`,
              transform: "translate(8px, -50%)",
            }}
          >
            <EmployeeHoverCard employee={hoveredEmployee} />
          </div>
        )}

        {/* Tooltip for printers (only in non-edit mode) */}
        {hoveredPrinter && !isEditMode && (
          <div
            className="pointer-events-none absolute z-20 rounded-lg border-2 border-office-maroon/20 bg-white/95 p-3 shadow-xl backdrop-blur-sm"
            style={{
              left: `${printerPosition.x}px`,
              top: `${printerPosition.y}px`,
              transform: "translate(8px, -50%)",
              minWidth: "200px",
            }}
          >
            <PrinterTooltip printer={hoveredPrinter} />
          </div>
        )}
      </div>

      {/* Enhanced Legend */}
      <div className="mt-6 rounded-lg border border-office-maroon/20 bg-white p-4 shadow-sm">
        <h4 className="mb-3 text-sm font-semibold text-office-maroon">Legend</h4>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-8">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full border-2 border-office-maroon bg-gradient-to-br from-office-orange to-office-orange-light"></div>
            <span className="text-xs">Assigned</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full border-2 border-gray-300 bg-white"></div>
            <span className="text-xs">Unassigned</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-white to-gray-100 border border-gray-300">
              <Printer className="h-3 w-3 text-office-maroon" />
            </div>
            <span className="text-xs">Printer (Click for drivers)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-white to-gray-100 border border-gray-300">
              <Bath className="h-3 w-3 text-office-green" />
            </div>
            <span className="text-xs">Restroom</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-white to-gray-100 border border-gray-300">
              <DoorClosed className="h-3 w-3 text-red-600" />
            </div>
            <span className="text-xs">Exit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-white to-gray-100 border border-gray-300">
              <Coffee className="h-3 w-3 text-office-orange" />
            </div>
            <span className="text-xs">Kitchen</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-500">
              <Sofa className="h-3 w-3 text-amber-600" />
            </div>
            <span className="text-xs">Furniture</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-2 bg-purple-500 border border-purple-600 rounded-sm"></div>
            <span className="text-xs">Doors</span>
          </div>
        </div>
        {isEditMode && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h5 className="text-sm font-medium text-office-maroon mb-2">Edit Mode Controls</h5>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Move className="h-3 w-3" />
                <span>Drag to move items</span>
              </div>
              <div className="flex items-center gap-2">
                <Edit3 className="h-3 w-3" />
                <span>Drag corners to resize rooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Plus className="h-3 w-3" />
                <span>Add new rooms/amenities</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="h-3 w-3" />
                <span>Click items to select</span>
              </div>
              <div className="flex items-center gap-2">
                <Trash2 className="h-3 w-3" />
                <span>Delete selected items</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
