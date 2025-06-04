"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { ZoomIn, ZoomOut, RotateCcw, Printer, DoorClosed, Bath, Coffee, Users, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { EmployeeHoverCard } from "@/components/employee-hover-card"
import { PrinterTooltip } from "@/components/printer-tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EnhancedSeatingChartProps {
  floorData: any
  allFloors: any[]
  currentFloorId: string
  onSelectEmployee: (employee: any) => void
  onFloorChange: (floorId: string) => void
}

export function EnhancedSeatingChart({
  floorData,
  allFloors,
  currentFloorId,
  onSelectEmployee,
  onFloorChange,
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
    if (e.button !== 0) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return
    setIsDragging(true)
    setDragStart({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y,
    })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - position.y,
    })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Handle hover events for employee cards
  const handleSeatMouseEnter = (employee: any, e: React.MouseEvent) => {
    if (!employee) return
    setHoveredEmployee(employee)

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const containerRect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 }

    setHoverPosition({
      x: rect.left - containerRect.left + rect.width,
      y: rect.top - containerRect.top,
    })
  }

  const handleSeatMouseLeave = () => {
    setHoveredEmployee(null)
  }

  // Handle hover events for printer tooltips
  const handlePrinterMouseEnter = (printer: any, e: React.MouseEvent) => {
    setHoveredPrinter(printer)

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const containerRect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 }

    setPrinterPosition({
      x: rect.left - containerRect.left + rect.width,
      y: rect.top - containerRect.top,
    })
  }

  const handlePrinterMouseLeave = () => {
    setHoveredPrinter(null)
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

    // Search across all floors
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

      // Switch to the floor where the employee was found
      if (foundFloor.id !== currentFloorId) {
        onFloorChange(foundFloor.id)
      }

      // Highlight the seat
      setHighlightedSeat(foundSeat.id)

      // Show employee details in sidebar
      onSelectEmployee(foundEmployee)

      // Center the view on the employee's seat after a brief delay to allow floor switch
      setTimeout(() => {
        if (containerRef.current && chartRef.current) {
          const containerWidth = containerRef.current.clientWidth
          const containerHeight = containerRef.current.clientHeight

          // Calculate position to center the seat using SVG coordinates
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
        return "bg-room-conference border-office-green"
      case "kitchen":
        return "bg-room-kitchen border-office-orange"
      case "reception":
        return "bg-room-reception border-blue-300"
      case "print":
        return "bg-room-print border-pink-300"
      case "restroom":
        return "bg-room-restroom border-gray-300"
      default:
        return "bg-room-office border-gray-300"
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
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
                onClick={clearSearch}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <Button type="submit" variant="default">
            Find
          </Button>
        </form>

        <div className="flex gap-2">
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

      {/* Search Result Banner */}
      {searchResult && (
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
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <div
          ref={chartRef}
          className="relative h-full w-full"
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transformOrigin: "0 0",
            transition: isDragging ? "none" : "transform 100ms",
          }}
        >
          {/* Floor plan SVG container */}
          <div className="absolute inset-0">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 1200 800"
              className="h-full w-full"
              preserveAspectRatio="xMidYMid meet"
              style={{ filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))" }}
            >
              {/* Floor background */}
              <rect width="1200" height="800" fill="#FAFAFA" stroke="#E5E7EB" strokeWidth="2" rx="8" />

              {/* First Floor - Left Side */}
              {/* Reception Area */}
              <rect x="50" y="50" width="200" height="150" fill="#E0E7FF" stroke="#3B82F6" strokeWidth="2" rx="4" />
              <text x="150" y="130" textAnchor="middle" className="fill-blue-700 text-sm font-medium">
                Reception
              </text>

              {/* Conference Room 1 */}
              <rect x="50" y="220" width="180" height="120" fill="#DCFCE7" stroke="#16A34A" strokeWidth="2" rx="4" />
              <text x="140" y="285" textAnchor="middle" className="fill-green-700 text-sm font-medium">
                Conference Room
              </text>

              {/* Kitchen */}
              <rect x="250" y="50" width="120" height="100" fill="#FED7AA" stroke="#EA580C" strokeWidth="2" rx="4" />
              <text x="310" y="105" textAnchor="middle" className="fill-orange-700 text-sm font-medium">
                Kitchen
              </text>

              {/* Open Office Area 1 */}
              <rect x="250" y="170" width="300" height="200" fill="#F1F5F9" stroke="#64748B" strokeWidth="2" rx="4" />
              <text x="400" y="275" textAnchor="middle" className="fill-slate-700 text-sm font-medium">
                Open Office
              </text>

              {/* Second Floor - Right Side */}
              {/* Conference Room 2 */}
              <rect x="650" y="50" width="200" height="120" fill="#DCFCE7" stroke="#16A34A" strokeWidth="2" rx="4" />
              <text x="750" y="115" textAnchor="middle" className="fill-green-700 text-sm font-medium">
                Conference Room
              </text>

              {/* Print Room */}
              <rect x="650" y="190" width="100" height="80" fill="#FCE7F3" stroke="#EC4899" strokeWidth="2" rx="4" />
              <text x="700" y="235" textAnchor="middle" className="fill-pink-700 text-sm font-medium">
                Print Room
              </text>

              {/* Kitchen 2 */}
              <rect x="770" y="190" width="80" height="80" fill="#FED7AA" stroke="#EA580C" strokeWidth="2" rx="4" />
              <text x="810" y="235" textAnchor="middle" className="fill-orange-700 text-sm font-medium">
                Kitchen
              </text>

              {/* Open Office Area 2 */}
              <rect x="650" y="290" width="350" height="200" fill="#F1F5F9" stroke="#64748B" strokeWidth="2" rx="4" />
              <text x="825" y="395" textAnchor="middle" className="fill-slate-700 text-sm font-medium">
                Open Office
              </text>

              {/* Executive Offices */}
              <rect x="870" y="50" width="130" height="120" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" rx="4" />
              <text x="935" y="115" textAnchor="middle" className="fill-amber-700 text-sm font-medium">
                Executive
              </text>

              {/* Restrooms */}
              <rect x="580" y="50" width="60" height="80" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="2" rx="4" />
              <text x="610" y="95" textAnchor="middle" className="fill-gray-700 text-xs font-medium">
                Restroom
              </text>

              {/* Stairs indicators */}
              <rect x="580" y="150" width="60" height="60" fill="#E5E7EB" stroke="#6B7280" strokeWidth="2" rx="4" />
              <text x="610" y="185" textAnchor="middle" className="fill-gray-700 text-xs font-medium">
                Stairs
              </text>

              <rect x="580" y="520" width="60" height="60" fill="#E5E7EB" stroke="#6B7280" strokeWidth="2" rx="4" />
              <text x="610" y="555" textAnchor="middle" className="fill-gray-700 text-xs font-medium">
                Stairs
              </text>

              {/* Employee seats as SVG elements */}
              {floorData.seats.map((seat: any) => (
                <g key={seat.id}>
                  <circle
                    cx={seat.x}
                    cy={seat.y}
                    r="20"
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:r-22",
                      seat.employee ? "fill-orange-400 stroke-red-900 stroke-2" : "fill-white stroke-gray-300 stroke-2",
                      highlightedSeat === seat.id && "animate-pulse stroke-green-500 stroke-4",
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      seat.employee && onSelectEmployee(seat.employee)
                    }}
                    onMouseEnter={(e) => seat.employee && handleSeatMouseEnter(seat.employee, e as any)}
                    onMouseLeave={handleSeatMouseLeave}
                    style={{
                      filter: seat.employee
                        ? "drop-shadow(0 4px 8px rgba(124, 45, 18, 0.3))"
                        : "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
                    }}
                  />
                  {seat.employee && (
                    <text
                      x={seat.x}
                      y={seat.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="fill-white text-xs font-bold pointer-events-none select-none"
                      style={{ fontSize: "10px" }}
                    >
                      {seat.employee.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </text>
                  )}
                </g>
              ))}

              {/* Office amenities as SVG elements */}
              {floorData.amenities?.map((amenity: any) => {
                const isPrinter = amenity.type === "printer"

                return (
                  <g key={amenity.id}>
                    <circle
                      cx={amenity.x}
                      cy={amenity.y}
                      r="16"
                      className={cn(
                        "transition-all duration-200",
                        isPrinter
                          ? "fill-white stroke-gray-300 stroke-2 cursor-pointer hover:stroke-red-900"
                          : "fill-white stroke-gray-300 stroke-2",
                      )}
                      onMouseEnter={isPrinter ? (e) => handlePrinterMouseEnter(amenity, e as any) : undefined}
                      onMouseLeave={isPrinter ? handlePrinterMouseLeave : undefined}
                      onClick={isPrinter ? () => window.open("#print-queue", "_blank") : undefined}
                      style={{
                        filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
                      }}
                    />
                    <foreignObject
                      x={amenity.x - 8}
                      y={amenity.y - 8}
                      width="16"
                      height="16"
                      className="pointer-events-none"
                    >
                      <div className="flex h-full w-full items-center justify-center">
                        {amenity.type === "printer" && <Printer className="h-4 w-4 text-red-900" />}
                        {amenity.type === "restroom" && <Bath className="h-4 w-4 text-blue-600" />}
                        {amenity.type === "exit" && <DoorClosed className="h-4 w-4 text-red-600" />}
                        {amenity.type === "kitchen" && <Coffee className="h-4 w-4 text-orange-600" />}
                        {amenity.type === "conference" && <Users className="h-4 w-4 text-green-600" />}
                      </div>
                    </foreignObject>
                  </g>
                )
              })}
            </svg>
          </div>
        </div>

        {/* Hover card for employees */}
        {hoveredEmployee && (
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

        {/* Tooltip for printers */}
        {hoveredPrinter && (
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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
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
            <span className="text-xs">Printer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-white to-gray-100 border border-gray-300">
              <Bath className="h-3 w-3 text-blue-600" />
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
        </div>
      </div>
    </div>
  )
}
