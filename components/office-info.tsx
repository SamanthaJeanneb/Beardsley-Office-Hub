"use client"

import { useState } from "react"
import {
  Building,
  Phone,
  Clock,
  Wifi,
  ChevronDown,
  ChevronUp,
  Calendar,
  Users,
  Printer,
  Bath,
  DoorClosed,
  Coffee,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface OfficeInfoProps {
  location: any
}

const getAmenityIcon = (name: string) => {
  if (name.toLowerCase().includes("printer")) return Printer
  if (name.toLowerCase().includes("restroom")) return Bath
  if (name.toLowerCase().includes("exit")) return DoorClosed
  if (name.toLowerCase().includes("kitchen") || name.toLowerCase().includes("café")) return Coffee
  if (name.toLowerCase().includes("conference")) return Users
  if (name.toLowerCase().includes("wi-fi")) return Wifi
  return Building // default icon
}

export function OfficeInfo({ location }: OfficeInfoProps) {
  const [expanded, setExpanded] = useState(true)

  if (!location) return null

  return (
    <Card className="border-office-maroon/20 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-office-maroon to-office-maroon-light pb-2">
        <CardTitle className="text-lg text-white">Office Information</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="text-white hover:bg-white/20"
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CardHeader>
      {expanded && (
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Building className="mt-0.5 h-4 w-4 text-office-maroon" />
                <div>
                  <p className="font-medium">{location.name}</p>
                  <p className="text-sm text-muted-foreground">{location.address}</p>
                </div>
              </div>

              {location.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-office-maroon" />
                  <a href={`tel:${location.phone}`} className="text-sm hover:underline">
                    {location.phone}
                  </a>
                </div>
              )}

              {location.hours && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-office-maroon" />
                  <span className="text-sm">{location.hours}</span>
                </div>
              )}
            </div>

            <Separator className="bg-office-maroon/10" />

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-office-maroon">Quick Links</h4>
              <div className="flex flex-wrap gap-2">
                {location.amenitiesList?.map((amenity: any) => {
                  const IconComponent = getAmenityIcon(amenity.name)
                  return (
                    <Badge
                      key={amenity.name}
                      variant="outline"
                      className="flex items-center gap-1 border-office-maroon/20 bg-white"
                    >
                      <IconComponent className="h-3 w-3 text-office-maroon" />
                      <span>{amenity.name}</span>
                    </Badge>
                  )
                })}

                <Badge variant="outline" className="flex items-center gap-1 border-office-maroon/20 bg-white">
                  <Calendar className="h-3 w-3 text-office-green" />
                  <a href="#" className="hover:text-office-green">
                    Book Room
                  </a>
                </Badge>

                <Badge variant="outline" className="flex items-center gap-1 border-office-maroon/20 bg-white">
                  <Users className="h-3 w-3 text-office-orange" />
                  <a href="#" className="hover:text-office-orange">
                    Directory
                  </a>
                </Badge>

                {location.quickLinks?.map((link: any) => (
                  <Badge
                    key={link.name}
                    variant="outline"
                    className="cursor-pointer border-office-maroon/20 bg-white hover:bg-gray-50"
                  >
                    <a href={link.url} className="flex items-center gap-1">
                      <span>{link.name}</span>
                    </a>
                  </Badge>
                ))}
              </div>
            </div>

            <Separator className="bg-office-maroon/10" />
          </div>
        </CardContent>
      )}
    </Card>
  )
}
