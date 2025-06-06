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
  Zap,
  Globe,
  Star,
  ArrowRight,
  CheckCircle,
  Phone,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAllLocations } from "@/lib/data"
import { getTotalEmployeeCount } from "@/lib/employee-data"
import { EnhancedNewOfficeDialog } from "@/components/enhanced-new-office-dialog"
import { EmployeeSearchDialog } from "@/components/employee-search-dialog"

export default function HomePage() {
  const [locations, setLocations] = useState<any[]>([])
  const [totalEmployees, setTotalEmployees] = useState(0)

  // Load data on component mount and when offices are added
  const loadData = () => {
    const allLocations = getAllLocations()
    const employeeCount = getTotalEmployeeCount()
    setLocations(allLocations)
    setTotalEmployees(employeeCount)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-700 to-blue-800">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative container px-4 py-20 md:py-32">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-white/90 backdrop-blur-sm">
              <Star className="h-4 w-4" />
              <span className="text-sm font-medium font-whitney">125+ Years of Engineering Excellence</span>
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
                size="lg"
                variant="secondary"
                className="bg-white text-slate-800 hover:bg-gray-100 shadow-lg text-lg px-8 py-6 h-auto font-whitney"
                asChild
              >
                <Link href="#locations">
                  <MapPin className="mr-2 h-5 w-5" />
                  Explore Locations
                </Link>
              </Button>

              <div className="h-auto">
                <EmployeeSearchDialog allLocations={locations} />
              </div>

              <div className="h-auto">
                <EnhancedNewOfficeDialog onOfficeAdded={handleOfficeAdded} />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
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
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white font-interface">24/7</div>
                <div className="text-white/80 text-sm md:text-base font-whitney">System Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Company Stats */}
      <div className="container px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-800 font-interface">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800 font-interface">{totalEmployees}</div>
              <p className="text-xs text-muted-foreground font-whitney">Active team members</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-800 font-interface">Office Locations</CardTitle>
              <Building2 className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800 font-interface">{locations.length}</div>
              <p className="text-xs text-muted-foreground font-whitney">Across New York State</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-800 font-interface">Years of Service</CardTitle>
              <Award className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800 font-interface">125+</div>
              <p className="text-xs text-muted-foreground font-whitney">Engineering excellence</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-800 font-interface">System Uptime</CardTitle>
              <Zap className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800 font-interface">99.9%</div>
              <p className="text-xs text-muted-foreground font-whitney">Reliable performance</p>
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
                  className="group overflow-hidden border-slate-200 transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1"
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
                        <CardTitle className="text-2xl text-slate-800 group-hover:text-blue-700 transition-colors font-interface">
                          {location.name}
                        </CardTitle>
                        <CardDescription className="mt-3 flex items-center text-muted-foreground text-base font-whitney">
                          <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                          {location.address}
                        </CardDescription>
                      </div>
                      <Badge variant={variant} className="ml-4 text-sm px-3 py-1 font-whitney">
                        {status}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Users className="mr-2 h-4 w-4 text-blue-600" />
                        <span className="font-medium font-whitney">{employeeCount} employees</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Building2 className="mr-2 h-4 w-4 text-emerald-600" />
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

                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6 group font-whitney">
                      <Link href={`/location/${location.id}`}>
                        View Office Layout
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* Enhanced Features Section */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 py-20">
        <div className="container px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="text-4xl font-bold text-slate-800 md:text-5xl font-interface">Platform Features</h2>
              <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto font-whitney">
                Everything you need to manage your office spaces efficiently with cutting-edge technology
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="text-center group">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-50 group-hover:from-blue-200 group-hover:to-blue-100 transition-all duration-300">
                  <Search className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="mb-4 text-2xl font-semibold text-slate-800 font-interface">Smart Employee Search</h3>
                <p className="text-muted-foreground text-lg leading-relaxed font-whitney">
                  Instantly find any employee across all office locations with our AI-powered search functionality and
                  real-time results.
                </p>
              </div>

              <div className="text-center group">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 group-hover:from-emerald-200 group-hover:to-emerald-100 transition-all duration-300">
                  <MapPin className="h-10 w-10 text-emerald-600" />
                </div>
                <h3 className="mb-4 text-2xl font-semibold text-slate-800 font-interface">Interactive Floor Plans</h3>
                <p className="text-muted-foreground text-lg leading-relaxed font-whitney">
                  Navigate detailed floor plans with real-time seating arrangements, furniture layouts, and office
                  amenities.
                </p>
              </div>

              <div className="text-center group">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-50 group-hover:from-amber-200 group-hover:to-amber-100 transition-all duration-300">
                  <Shield className="h-10 w-10 text-amber-600" />
                </div>
                <h3 className="mb-4 text-2xl font-semibold text-slate-800 font-interface">Admin Management</h3>
                <p className="text-muted-foreground text-lg leading-relaxed font-whitney">
                  Secure admin panel for managing employees, office layouts, and equipment with intuitive drag-and-drop
                  editing.
                </p>
              </div>

              <div className="text-center group">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-purple-50 group-hover:from-purple-200 group-hover:to-purple-100 transition-all duration-300">
                  <Printer className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="mb-4 text-2xl font-semibold text-slate-800 font-interface">Equipment Tracking</h3>
                <p className="text-muted-foreground text-lg leading-relaxed font-whitney">
                  Monitor and manage office equipment including printers, with direct access to driver downloads and
                  status monitoring.
                </p>
              </div>

              <div className="text-center group">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-rose-50 group-hover:from-rose-200 group-hover:to-rose-100 transition-all duration-300">
                  <Users className="h-10 w-10 text-rose-600" />
                </div>
                <h3 className="mb-4 text-2xl font-semibold text-slate-800 font-interface">Employee Profiles</h3>
                <p className="text-muted-foreground text-lg leading-relaxed font-whitney">
                  Comprehensive employee profiles with photos, contact information, and seamless VantagePoint
                  integration.
                </p>
              </div>

              <div className="text-center group">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-teal-50 group-hover:from-teal-200 group-hover:to-teal-100 transition-all duration-300">
                  <Plus className="h-10 w-10 text-teal-600" />
                </div>
                <h3 className="mb-4 text-2xl font-semibold text-slate-800 font-interface">Office Creation</h3>
                <p className="text-muted-foreground text-lg leading-relaxed font-whitney">
                  Easily create new office locations with customizable layouts, furniture placement, and employee
                  management tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New CTA Section */}
      <div className="bg-slate-800 py-20">
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
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-slate-800 text-lg px-8 py-6 h-auto font-whitney"
                asChild
              >
                <Link href="#locations">
                  <Globe className="mr-2 h-5 w-5" />
                  Explore All Locations
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="container px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-4">
              <div className="md:col-span-2">
                <h3 className="mb-4 text-2xl font-bold font-interface">Beardsley</h3>
                <p className="text-slate-300 text-lg leading-relaxed max-w-md font-whitney">
                  Professional engineering and architectural services across New York State for over 125 years.
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                    <span className="text-slate-300 font-whitney">ISO Certified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-400" />
                    <span className="text-slate-300 font-whitney">Award Winning</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-4 font-semibold text-lg font-interface">Quick Links</h4>
                <ul className="space-y-3 text-slate-300">
                  <li>
                    <Link href="#locations" className="hover:text-white transition-colors font-whitney">
                      Office Locations
                    </Link>
                  </li>
                  <li>
                    <button className="hover:text-white transition-colors font-whitney">Employee Directory</button>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-colors font-whitney">
                      IT Support
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-colors font-whitney">
                      Admin Portal
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 font-semibold text-lg font-interface">Contact</h4>
                <div className="space-y-3 text-slate-300">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span className="font-whitney">Main: 315-253-7301</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="font-whitney">IT Support: ext. 2242</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="font-whitney">Emergency: 911</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 border-t border-slate-700 pt-8 text-center text-slate-400">
              <p className="font-whitney">
                &copy; 2024 Beardsley. All rights reserved. | Office Hub v2.0 | Powered by Next.js
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
