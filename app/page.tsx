"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  MapPin,
  Users,
  Clock,
  Building2,
  Search,
  Shield,
  Printer,
  Plus,
  Award,
  Star,
  ArrowRight,
  CheckCircle,
  Phone,
  Car,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAllLocations } from "@/lib/data"
import { employeeData } from "@/lib/employee-data"
import { EnhancedNewOfficeDialog } from "@/components/enhanced-new-office-dialog"
import { EmployeeSearchDialog } from "@/components/employee-search-dialog"
import { GitHubPushButton } from "@/components/github-push-button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function HomePage() {
  const [locations, setLocations] = useState<any[]>([])

  // Load data on component mount and when offices are added
  const loadData = () => {
    const allLocations = getAllLocations()
    setLocations(allLocations)
  }

  useEffect(() => {
    loadData()
  }, [])

  // Calculate total employees across all locations
  const getLocationEmployeeCount = (location: any) => {
    return (
      location.floors?.reduce((total: number, floor: any) => {
        return total + (floor.seats?.filter((seat: any) => seat.employee).length || 0)
      }, 0) || 0
    )
  }

  const getLocationStatus = (location: any) => {
    const employeeCount = getLocationEmployeeCount(location)
    if (employeeCount === 0) return { status: "New", variant: "secondary" as const }
    if (employeeCount < 10) return { status: "Growing", variant: "outline" as const }
    if (employeeCount < 20) return { status: "Active", variant: "default" as const }
    return { status: "Full Capacity", variant: "destructive" as const }
  }

  const handleOfficeAdded = () => {
    loadData() // Refresh the data when a new office is added
  }

  // Use employee data count instead of calculated count
  const totalEmployees = employeeData.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 fade-in">
      {/* GitHub Push Button in Top-Right Corner */}
      <div className="fixed top-4 right-4 z-50">
        <GitHubPushButton
          variant="outline"
          size="icon"
          className="bg-white/80 backdrop-blur-sm hover:bg-white border-gray-200"
          showText={false}
        />
      </div>

      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-beardsley-red-dark via-beardsley-red to-beardsley-red-light">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative container px-4 py-20 md:py-32">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-white/90 backdrop-blur-sm">
              <Star className="h-4 w-4" />
              <span className="text-sm font-medium font-whitney">125+ Years of Service</span>
            </div>

            <h1 className="text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl font-interface">
              Beardsley
            </h1>
            <p className="mt-6 text-2xl text-white/90 md:text-3xl font-light font-interface">Office Hub</p>
            <p className="mt-8 text-xl text-white/80 md:text-2xl max-w-3xl mx-auto leading-relaxed font-whitney">
              Comprehensive office management and employee directory system for modern engineering teams
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Button
                size="default"
                variant="secondary"
                className="bg-white text-beardsley-red hover:bg-gray-100 shadow-lg px-6 py-3 font-whitney slide-in-bottom"
                asChild
              >
                <Link href="#locations">
                  <MapPin className="mr-2 h-4 w-4" />
                  Explore Locations
                </Link>
              </Button>

              <div className="slide-in-bottom">
                <EmployeeSearchDialog allLocations={locations} />
              </div>

              <Button
                size="default"
                variant="outline"
                className="bg-white text-beardsley-red hover:bg-gray-100 shadow-lg px-6 py-3 font-whitney slide-in-bottom"
                asChild
              >
                <Link href="/directory">
                  <Users className="mr-2 h-4 w-4" />
                  Employee Directory
                </Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white font-interface">{locations.length}</div>
                <div className="text-white/80 text-sm md:text-base font-whitney">Office Locations</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white font-interface">{totalEmployees}</div>
                <div className="text-white/80 text-sm md:text-base font-whitney">Active Employees</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white font-interface">125+</div>
                <div className="text-white/80 text-sm md:text-base font-whitney">Years of Service</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Company Stats */}
      <div className="container px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-slate-200 hover:shadow-lg transition-shadow slide-in-bottom">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-800 font-interface">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-beardsley-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800 font-interface">{totalEmployees}</div>
              <p className="text-xs text-muted-foreground font-whitney">Active team members</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 hover:shadow-lg transition-shadow slide-in-bottom">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-800 font-interface">Office Locations</CardTitle>
              <Building2 className="h-4 w-4 text-beardsley-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800 font-interface">{locations.length}</div>
              <p className="text-xs text-muted-foreground font-whitney">Across New York State</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 hover:shadow-lg transition-shadow slide-in-bottom">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-800 font-interface">Years of Service</CardTitle>
              <Award className="h-4 w-4 text-beardsley-red" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800 font-interface">125+</div>
              <p className="text-xs text-muted-foreground font-whitney">Engineering excellence</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Office Locations */}
      <div id="locations" className="container px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-slate-800 md:text-5xl font-interface">Our Locations</h2>
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto font-whitney">
              Explore our office locations across New York State and connect with your colleagues
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {locations.map((location) => {
              const employeeCount = getLocationEmployeeCount(location)
              const { status, variant } = getLocationStatus(location)

              return (
                <Card
                  key={location.id}
                  className="group overflow-hidden border-slate-200 transition-all duration-300 hover:border-beardsley-red hover:shadow-xl hover:-translate-y-1 slide-in-bottom"
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={location.image || "/placeholder.svg?height=300&width=600"}
                      alt={location.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl text-slate-800 group-hover:text-beardsley-red transition-colors font-interface">
                          {location.name}
                        </CardTitle>
                        <CardDescription className="mt-3 flex items-center text-muted-foreground text-base font-whitney">
                          <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                          {location.address}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Users className="mr-2 h-4 w-4 text-beardsley-green" />
                        <span className="font-medium font-whitney">{employeeCount} employees</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Building2 className="mr-2 h-4 w-4 text-beardsley-orange" />
                        <span className="font-medium font-whitney">{location.floors?.length || 0} floors</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Phone className="mr-2 h-4 w-4" />
                        <span className="font-whitney">{location.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        <span className="font-whitney">{location.hours}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        asChild
                        className="flex-1 bg-beardsley-red hover:bg-beardsley-red-dark text-lg py-6 group font-whitney"
                      >
                        <Link href={`/location/${location.id}`}>
                          View Office Layout
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-none bg-white text-beardsley-red border-beardsley-red hover:bg-beardsley-red hover:text-white"
                          >
                            <Car className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{location.name} Parking Map</DialogTitle>
                          </DialogHeader>
                          <div className="mt-4">
                            <img
                              src={location.parkingMap || `/placeholder.svg?height=600&width=800&query=Parking map for ${location.name} office building`}
                              alt={`${location.name} Parking Map`}
                              className="w-full rounded-md"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `/placeholder.svg?height=600&width=800&query=Parking map for ${location.name} office building`
                              }}
                            />
                            <div className="mt-4 p-4 bg-gray-50 rounded-md">
                              <h3 className="font-semibold text-lg mb-2">Parking Information</h3>
                              <ul className="space-y-2 text-sm">
                                <li className="flex items-center">
                                  <div className="w-4 h-4 bg-beardsley-red rounded-full mr-2"></div>
                                  <span>Reserved</span>
                                </li>
                                <li className="flex items-center">
                                  <div className="w-4 h-4 bg-beardsley-green rounded-full mr-2"></div>
                                  <span>Employee parking</span>
                                </li>
                                <li className="flex items-center">
                                  <div className="w-4 h-4 bg-beardsley-orange rounded-full mr-2"></div>
                                  <span>Visitor parking</span>
                                </li>
                                <li className="flex items-center">
                                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                                  <span>Accessible parking</span>
                                </li>
                              </ul>
                              <p className="mt-4 text-sm text-gray-600">
                                Parking hours: Monday-Friday, 7:00 AM - 7:00 PM
                              </p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Create Office Button moved below the office list */}
          <div className="mt-8 flex justify-center">
            <div className="h-auto">
              <EnhancedNewOfficeDialog
                onOfficeAdded={handleOfficeAdded}
                buttonProps={{
                  size: "lg",
                  className:
                    "bg-beardsley-red hover:bg-beardsley-red-dark text-white text-lg px-8 py-6 h-auto font-whitney",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Features Section */}
      <div className="bg-gradient-to-br from-slate-50 to-amber-50 py-20">
        <div className="container px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="text-4xl font-bold text-slate-800 md:text-5xl font-interface">Platform Features</h2>
              <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto font-whitney">
                Everything you need to manage your office spaces efficiently
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="text-center group">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-beardsley-green-light to-beardsley-green group-hover:from-beardsley-green group-hover:to-beardsley-green-dark transition-all duration-300">
                  <Search className="h-10 w-10 text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-semibold text-slate-800 font-interface">Smart Employee Search</h3>
                <p className="text-muted-foreground text-lg leading-relaxed font-whitney">
                  Find employees across all office locations with instant search results.
                </p>
              </div>

              <div className="text-center group">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-beardsley-orange-light to-beardsley-orange group-hover:from-beardsley-orange group-hover:to-beardsley-orange-dark transition-all duration-300">
                  <MapPin className="h-10 w-10 text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-semibold text-slate-800 font-interface">Interactive Floor Plans</h3>
                <p className="text-muted-foreground text-lg leading-relaxed font-whitney">
                  Navigate detailed floor plans with seating arrangements and office layouts.
                </p>
              </div>

              <div className="text-center group">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-beardsley-red-light to-beardsley-red group-hover:from-beardsley-red group-hover:to-beardsley-red-dark transition-all duration-300">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-semibold text-slate-800 font-interface">Admin Management</h3>
                <p className="text-muted-foreground text-lg leading-relaxed font-whitney">
                  Manage employees and office layouts with intuitive editing tools.
                </p>
              </div>

              <div className="text-center group">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-gray-200 group-hover:to-gray-300 transition-all duration-300">
                  <Printer className="h-10 w-10 text-slate-600" />
                </div>
                <h3 className="mb-4 text-2xl font-semibold text-slate-800 font-interface">Equipment Tracking</h3>
                <p className="text-muted-foreground text-lg leading-relaxed font-whitney">
                  Monitor office equipment including printers with driver access.
                </p>
              </div>

              <div className="text-center group">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-beardsley-green-light to-beardsley-green group-hover:from-beardsley-green group-hover:to-beardsley-green-dark transition-all duration-300">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-semibold text-slate-800 font-interface">Employee Profiles</h3>
                <p className="text-muted-foreground text-lg leading-relaxed font-whitney">
                  Comprehensive employee profiles with photos and contact information.
                </p>
              </div>

              <div className="text-center group">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-beardsley-orange-light to-beardsley-orange group-hover:from-beardsley-orange group-hover:to-beardsley-orange-dark transition-all duration-300">
                  <Plus className="h-10 w-10 text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-semibold text-slate-800 font-interface">Office Creation</h3>
                <p className="text-muted-foreground text-lg leading-relaxed font-whitney">
                  Create new office locations with customizable layouts and furniture placement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New CTA Section */}
      <div className="bg-beardsley-red py-20">
        <div className="container px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold text-white md:text-5xl font-interface">Ready to Get Started?</h2>
            <p className="mt-6 text-xl text-white/90 max-w-2xl mx-auto font-whitney">
              Join the future of office management with our comprehensive platform designed for modern engineering
              teams.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <div className="h-auto">
                <EmployeeSearchDialog allLocations={locations} />
              </div>
              <Button
                size="default"
                variant="secondary"
                className="bg-white text-beardsley-red hover:bg-gray-100 shadow-lg px-6 py-3 font-whitney slide-in-bottom"
                asChild
              >
                <Link href="#locations">
                  <MapPin className="mr-2 h-5 w-5" />
                  Explore All Locations
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="relative bg-white text-slate-800 border-t border-slate-200">
        {/* Background architectural pattern */}
        <div
          className="absolute inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/placeholder.svg?height=400&width=1200')`,
          }}
        />
        <div className="relative container px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-4">
              <div className="md:col-span-2">
                <h3 className="mb-4 text-2xl font-bold font-interface text-beardsley-red">Beardsley</h3>
                <p className="text-slate-600 text-lg leading-relaxed max-w-md font-whitney">
                  Professional engineering and architectural services across New York State for over 125 years.
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-beardsley-green" />
                    <span className="text-slate-600 font-whitney">ISO Certified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-beardsley-orange" />
                    <span className="text-slate-600 font-whitney">Award Winning</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-4 font-semibold text-lg font-interface text-slate-800">Quick Links</h4>
                <ul className="space-y-3 text-slate-600">
                  <li>
                    <Link href="#locations" className="hover:text-beardsley-red transition-colors font-whitney">
                      Office Locations
                    </Link>
                  </li>
                  <li>
                    <Link href="/directory" className="hover:text-beardsley-red transition-colors font-whitney">
                      Employee Directory
                    </Link>
                  </li>
                  <li>
                    <a
                      href="https://beardsley.sharepoint.com/sites/Intranet/SitePages/Employee-onboarding-team-home.aspx#send-a-help-desk-request"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-beardsley-red transition-colors font-whitney"
                    >
                      IT Support
                    </a>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-beardsley-red transition-colors font-whitney">
                      Admin Portal
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 font-semibold text-lg font-interface text-slate-800">Contact</h4>
                <div className="space-y-3 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span className="font-whitney">Main: 315-253-7301</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <a
                      href="https://beardsley.sharepoint.com/sites/Intranet/SitePages/Employee-onboarding-team-home.aspx#send-a-help-desk-request"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-whitney hover:text-beardsley-red transition-colors"
                    >
                      IT Support: ext. 2242
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="font-whitney">Emergency: 911</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 border-t border-slate-200 pt-8 text-center text-slate-500">
                <p className="font-whitney">
                &copy; {new Date().getFullYear()} Beardsley. All rights reserved. | Office Hub v2.0 | Powered by Next.js
                </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
