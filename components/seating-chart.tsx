"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { ZoomIn, ZoomOut, RotateCcw, Printer, DoorClosed, Bath, Coffee } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { EmployeeHoverCard } from "@/components/employee-hover-card"

interface SeatingChartProps {
  floorData: any
  onSelectEmployee: (employee: any) => void
}

export function SeatingChart({ floorData, onSelectEmployee }: SeatingChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [hoveredEmployee, setHoveredEmployee] = useState<any>(null)
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 })

  // Reset view to default
  const resetView = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  // Zoom functions with limits
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3))
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5))

  // Handle mouse wheel zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        if (e.deltaY < 0) {
          setScale((prev) => Math.min(prev + 0.1, 3))
        } else {
          setScale((prev) => Math.max(prev - 0.1, 0.5))
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
    if (e.button !== 0) return // Only left mouse button
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
      y: e.touches[0].clientY - dragStart.y,
    })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Handle hover events for employee cards
  const handleSeatMouseEnter = (employee: any, e: React.MouseEvent) => {
    if (!employee) return
    setHoveredEmployee(employee)

    // Calculate position relative to the container
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

  return (
    <div className="relative">
      {/* Controls */}
      <div className="absolute right-2 top-2 z-10 flex gap-2">
        <Button variant="outline" size="icon" onClick={zoomOut} title="Zoom out">
          <ZoomOut className="h-4 w-4" />
          <span className="sr-only">Zoom out</span>
        </Button>
        <Button variant="outline" size="icon" onClick={zoomIn} title="Zoom in">
          <ZoomIn className="h-4 w-4" />
          <span className="sr-only">Zoom in</span>
        </Button>
        <Button variant="outline" size="icon" onClick={resetView} title="Reset view">
          <RotateCcw className="h-4 w-4" />
          <span className="sr-only">Reset view</span>
        </Button>
      </div>

      {/* Map container with pan and zoom */}
      <div
        ref={containerRef}
        className="mt-8 h-[600px] overflow-hidden rounded-lg border bg-gray-50"
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
          className="relative h-full w-full transition-transform duration-100"
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transformOrigin: "0 0",
          }}
        >
          {/* Floor layout background */}
          <div className="absolute inset-0">
            {/* Room outlines */}
            {floorData.rooms.map((room: any) => (
              <div
                key={room.id}
                className="absolute border border-gray-400 bg-gray-50"
                style={{
                  left: `${room.x}px`,
                  top: `${room.y}px`,
                  width: `${room.width}px`,
                  height: `${room.height}px`,
                }}
              >
                <div className="p-1 text-xs text-gray-500">{room.name}</div>
              </div>
            ))}

            {/* Seats */}
            {floorData.seats.map((seat: any) => (
              <div
                key={seat.id}
                className={cn(
                  "absolute flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border transition-colors",
                  seat.employee ? "border-primary bg-primary/10 hover:bg-primary/20" : "border-gray-300 bg-gray-100",
                )}
                style={{
                  left: `${seat.x}px`,
                  top: `${seat.y}px`,
                  transform: `rotate(${seat.rotation || 0}deg)`,
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  seat.employee && onSelectEmployee(seat.employee)
                }}
                onMouseEnter={(e) => seat.employee && handleSeatMouseEnter(seat.employee, e)}
                onMouseLeave={handleSeatMouseLeave}
                title={seat.employee ? seat.employee.name : "Unassigned"}
              >
                {seat.employee && (
                  <span className="text-xs font-medium">
                    {seat.employee.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </span>
                )}
              </div>
            ))}

            {/* Office amenities */}
            {floorData.amenities?.map((amenity: any) => (
              <div
                key={amenity.id}
                className="absolute flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-700"
                style={{
                  left: `${amenity.x}px`,
                  top: `${amenity.y}px`,
                }}
                title={amenity.name}
              >
                {amenity.type === "printer" && <Printer className="h-4 w-4" />}
                {amenity.type === "restroom" && <Bath className="h-4 w-4" />}
                {amenity.type === "exit" && <DoorClosed className="h-4 w-4" />}
                {amenity.type === "kitchen" && <Coffee className="h-4 w-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Hover card */}
        {hoveredEmployee && (
          <div
            className="pointer-events-none absolute z-10 rounded-md border bg-white p-3 shadow-md"
            style={{
              left: `${hoverPosition.x}px`,
              top: `${hoverPosition.y}px`,
              transform: "translate(8px, -50%)",
            }}
          >
            <EmployeeHoverCard employee={hoveredEmployee} />
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full border border-primary bg-primary/10"></div>
          <span className="text-xs">Assigned</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full border border-gray-300 bg-gray-100"></div>
          <span className="text-xs">Unassigned</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200">
            <Printer className="h-3 w-3" />
          </div>
          <span className="text-xs">Printer</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200">
            <Bath className="h-3 w-3" />
          </div>
          <span className="text-xs">Restroom</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200">
            <DoorClosed className="h-3 w-3" />
          </div>
          <span className="text-xs">Exit</span>
        </div>
      </div>
    </div>
  )
}
