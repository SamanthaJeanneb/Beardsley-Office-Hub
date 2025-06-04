"use client"

import { useState } from "react"
import { Building, Phone, Clock, Wifi, ChevronDown, ChevronUp, Calendar, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface OfficeInfoProps {
  location: any
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
                <Badge variant="outline" className="flex items-center gap-1 border-office-maroon/20 bg-white">
                  <Wifi className="h-3 w-3 text-office-maroon" />
                  <span>Wi-Fi: {location.wifi || "Office-Guest"}</span>
                </Badge>

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
                      {link.icon && <link.icon className="h-3 w-3 text-office-maroon" />}
                      <span>{link.name}</span>
                    </a>
                  </Badge>
                ))}
              </div>
            </div>

            <Separator className="bg-office-maroon/10" />

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-office-maroon">Amenities</h4>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {location.amenitiesList?.map((amenity: any) => (
                  <div key={amenity.name} className="flex items-center gap-2">
                    {amenity.icon && <amenity.icon className="h-4 w-4 text-office-maroon" />}
                    <span className="text-sm">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
