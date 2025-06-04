import Link from "next/link"
import Image from "next/image"
import { Building, MapPin } from "lucide-react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"

const locations = [
  {
    id: "syracuse",
    name: "Syracuse",
    address: "1115 Solar Street, Ste 102 Syracuse, NY 13204",
    image: "/placeholder.svg?height=200&width=400",
    floors: 1,
  },
  {
    id: "malone",
    name: "Malone",
    address: "320 West Main St. Ste 2 Malone, NY 12953",
    image: "/placeholder.svg?height=200&width=400",
    floors: 1,
  },
  {
    id: "albany",
    name: "Albany",
    address: "69 State Street, Suite 1100D Albany, NY 12207",
    image: "/placeholder.svg?height=200&width=400",
    floors: 1,
  },
  {
    id: "auburn",
    name: "Auburn",
    address: "64 South Street, Auburn, NY 13021",
    image: "/placeholder.svg?height=200&width=400",
    floors: 1,
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-office-maroon md:text-4xl">Office Locations</h1>
          <p className="mt-2 text-muted-foreground">Select an office to view its seating chart</p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {locations.map((location) => (
            <Link
              href={`/location/${location.id}`}
              key={location.id}
              className="transition-transform hover:scale-[1.02]"
            >
              <Card className="h-full overflow-hidden border-office-maroon/20 shadow-sm hover:shadow-md">
                <div className="aspect-video w-full overflow-hidden">
                  <Image
                    src={location.image || "/placeholder.svg"}
                    alt={location.name}
                    width={400}
                    height={200}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold text-office-maroon">{location.name}</h2>
                  <div className="mt-2 flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-4 w-4 text-office-maroon" />
                    <span>{location.address}</span>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-office-maroon/10 p-4 pt-3">
                  <div className="flex items-center text-sm">
                    <Building className="mr-1 h-4 w-4 text-office-maroon" />
                    <span>
                      {location.floors} {location.floors === 1 ? "Floor" : "Floors"}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
