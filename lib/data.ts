// Mock data for the application with real employee data
// In a real application, this would come from an API or database
// Remove these icon imports at the top
// import { Printer, Bath, DoorClosed, Coffee, Wifi } from 'lucide-react'

// Real employee data organized by location based on the CSV file
const employeeData = {
  syracuse: [
    { name: "Jared Heinl, PE RLA", title: "Principal", email: "jheinl@beardsley.com", phone: "518-483-1585 4231" },
    { name: "Barry Halperin, R.A.", title: "Principal", email: "bhalperin@beardsley.com", phone: "315-472-6980 3311" },
    {
      name: "Thomas Ascienzo, LEED AP BD+C",
      title: "Electrical Senior Designer",
      email: "tascienzo@beardsley.com",
      phone: "315-472-6980 3323",
    },
    {
      name: "Seth Livermore, P.E.",
      title: "Civil Engineer V",
      email: "slivermore@beardsley.com",
      phone: "315-472-6980 3315",
    },
    {
      name: "Lillian Spencer",
      title: "Administrative Assistant",
      email: "lmarshall@beardsley.com",
      phone: "315-472-6980 3327",
    },
    {
      name: "Allie Henderson, P.E.",
      title: "Engineer IV",
      email: "ahenderson@beardsley.com",
      phone: "315-472-6980 3325",
    },
    { name: "Scott Folts", title: "Senior Architect", email: "sfolts@beardsley.com", phone: "315-253-7301" },
    {
      name: "Jacob Perez Gangi, EIT",
      title: "Structural Engineer II",
      email: "jperez@beardsley.com",
      phone: "315-472-6980",
    },
    {
      name: "Alex Clement, R.A. AIA",
      title: "Senior Architect",
      email: "aclement@beardsley.com",
      phone: "315-472-6980",
    },
    {
      name: "Nicholas Hartung",
      title: "Architectural Designer",
      email: "nhartung@beardsley.com",
      phone: "315-253-7301",
    },
    {
      name: "Chelsea Bush, P.E.",
      title: "Civil Engineer IV",
      email: "cbush@beardsley.com",
      phone: "315-472-6980 3312",
    },
    {
      name: "Michelle Thompson",
      title: "Assistant Controller",
      email: "mthompson@beardsley.com",
      phone: "315-253-7301 2241",
    },
    { name: "Brittany Varengo, R.A.", title: "Architect", email: "bvarengo@beardsley.com", phone: "315-472-6980 3314" },
    { name: "Caleb Sayers, R.A.", title: "Architect", email: "csayers@beardsley.com", phone: "315-472-6980 3320" },
    { name: "Justin Chiera, P.E.", title: "Civil Engineer IV", email: "jchiera@beardsley.com", phone: "315-472-6980" },
    {
      name: "Gabriel Amaya, P.E.",
      title: "Structural Engineer IV",
      email: "gamaya@beardsley.com",
      phone: "315-472-6980",
    },
    { name: "Adrianna Mondello", title: "Intern", email: "amondello@beardsley.com", phone: "315-472-6980 3320" },
  ],

  auburn: [
    {
      name: "Joanne Butler",
      title: "Landscape Senior Designer",
      email: "jbutler@beardsley.com",
      phone: "315-253-7301 2271",
    },
    {
      name: "Dan Whitman, CPD",
      title: "Plumbing Senior Designer",
      email: "dwhitman@beardsley.com",
      phone: "315-253-7301 2227",
    },
    {
      name: "Glenn Hewitt, CFPS, SET",
      title: "Fire Protection Senior Designer",
      email: "ghewitt@beardsley.com",
      phone: "315-253-7301 2254",
    },
    {
      name: "Kathy Quigley",
      title: "Computer System Administrator",
      email: "kquigley@beardsley.com",
      phone: "315-253-7301 2242",
    },
    {
      name: "Michael Picciano, P.E., LEED AP",
      title: "Electrical Engineer V",
      email: "mpicciano@beardsley.com",
      phone: "315-253-7301 2258",
    },
    {
      name: "Mark Rebich, P.E., LEED AP",
      title: "Principal",
      email: "mrebich@beardsley.com",
      phone: "315-253-7301 2261",
    },
    {
      name: "Dennis McCarthy, P.E., LEED AP",
      title: "Principal",
      email: "dmccarthy@beardsley.com",
      phone: "315-253-7301 2252",
    },
    {
      name: "Andrea DeLany, CBCP",
      title: "Mechanical Senior Designer",
      email: "adelany@beardsley.com",
      phone: "315-253-7301 2264",
    },
    {
      name: "Jeff Velte",
      title: "Structural Senior Designer",
      email: "jvelte@beardsley.com",
      phone: "315-253-7301 2232",
    },
    {
      name: "Andrew Ingram, R.L.A.",
      title: "Senior Landscape Architect",
      email: "dingram@beardsley.com",
      phone: "315-253-7301",
    },
    {
      name: "Paul Shrimpton",
      title: "Mechanical Senior Designer",
      email: "pshrimpton@beardsley.com",
      phone: "315-253-7301 2217",
    },
    {
      name: "Ed Onori",
      title: "Architectural Senior Designer",
      email: "eonori@beardsley.com",
      phone: "315-253-7301 2253",
    },
    {
      name: "Brandon Blumer",
      title: "Senior Electrical Designer",
      email: "bblumer@beardsley.com",
      phone: "315-253-7301 2297",
    },
    {
      name: "Kathy Mietz",
      title: "Administrative Assistant",
      email: "kmietz@beardsley.com",
      phone: "315-253-7301 2210",
    },
    { name: "Joe Kime, PE", title: "Principal", email: "jkime@beardsley.com", phone: "315-253-7301 2328" },
    {
      name: "Thomas Wight",
      title: "Business Development Manager",
      email: "twight@beardsley.com",
      phone: "315-253-7301 2222",
    },
    {
      name: "Doug Porter, P.E.",
      title: "Associate Principal",
      email: "dporter@beardsley.com",
      phone: "315-472-6980 3318",
    },
    { name: "Julia Furlong", title: "Marketing Manager", email: "jfurlong@beardsley.com", phone: "315-253-7301 2280" },
    {
      name: "Joanne Maddox Kinslow, AIA NYSCEO LEED Green Assoc",
      title: "Senior Architect",
      email: "jkinslow@beardsley.com",
      phone: "315-253-7301",
    },
    {
      name: "Phillip Beyel, PE",
      title: "Structural Engineer IV",
      email: "jbeyel@beardsley.com",
      phone: "315-253-7301 2274",
    },
    {
      name: "Tim McSweeney",
      title: "Electrical Designer",
      email: "tmcsweeney@beardsley.com",
      phone: "315-253-7301 2247",
    },
    {
      name: "Kurt Olsen, P.E.",
      title: "Mechanical Engineer V",
      email: "kolsen@beardsley.com",
      phone: "315-253-7301 2220",
    },
    { name: "Jason Coe, R.A.", title: "Senior Architect", email: "jcoe@beardsley.com", phone: "315-253-7301 2302" },
    { name: "John Hewitt, PE", title: "Mechanical Engineer V", email: "jhewitt@beardsley.com", phone: "315-253-7301" },
    {
      name: "Jared Bracken, R.A.",
      title: "Senior Architect",
      email: "jbracken@beardsley.com",
      phone: "315-253-7301 2211",
    },
    { name: "Felicia Fiacco", title: "Architectural Designer", email: "ffiacco@beardsley.com", phone: "315-253-7301" },
    {
      name: "Michael Naber, P.E.",
      title: "Structural Engineer IV",
      email: "mnaber@beardsley.com",
      phone: "315-253-7301 2273",
    },
    {
      name: "Tracey Carr",
      title: "Architectural Senior Designer",
      email: "tcarr@beardsley.com",
      phone: "315-253-7301 2216",
    },
    {
      name: "Kyle Daddario",
      title: "Architectural Designer",
      email: "kdaddario@beardsley.com",
      phone: "315-253-7301 2293",
    },
    { name: "Nathan Stultz", title: "Plumbing Designer", email: "nstultz@beardsley.com", phone: "315-253-7301 2228" },
    { name: "Mathew Milne", title: "Electrical Engineer I", email: "mathewrmilne@gmail.com", phone: "315-253-7301" },
    {
      name: "Dominic Seils",
      title: "Structural Intern Engineer",
      email: "dseils@beardsley.com",
      phone: "315-253-7301",
    },
    { name: "Joshua Marris", title: "Mechanical Engineer I", email: "jmarris@beardsley.com", phone: "315-253-7301" },
    { name: "Megan Litzenberger", title: "Accountant", email: "MLitzenberger@Beardsley.com", phone: "315-253-7301" },
    { name: "Samantha Brown", title: "Intern", email: "sbrown@beardsley.com", phone: "315-253-7301" },
    { name: "Evan Moore", title: "Intern", email: "emoore@beardsley.com", phone: "315-253-7301" },
  ],

  albany: [
    { name: "Cameron Beardsley", title: "Principal", email: "cbeardsley@beardsley.com", phone: "518-555-0100" },
    { name: "Caroline Beardsley", title: "Principal", email: "cabeardsley@beardsley.com", phone: "518-555-0101" },
    { name: "Catherine Beardsley", title: "Principal", email: "catbeardsley@beardsley.com", phone: "518-555-0102" },
    { name: "Charles Beardsley", title: "Principal", email: "chbeardsley@beardsley.com", phone: "518-555-0103" },
    { name: "Charlotte Beardsley", title: "Principal", email: "charbeardsley@beardsley.com", phone: "518-555-0104" },
    { name: "Christopher Beardsley", title: "Principal", email: "chrbeardsley@beardsley.com", phone: "518-555-0105" },
    { name: "Claire Beardsley", title: "Principal", email: "clbeardsley@beardsley.com", phone: "518-555-0106" },
    { name: "Daniel Beardsley", title: "Principal", email: "dbeardsley@beardsley.com", phone: "518-555-0107" },
    { name: "David Beardsley", title: "Principal", email: "dabeardsley@beardsley.com", phone: "518-555-0108" },
    { name: "Diana Beardsley", title: "Principal", email: "dibeardsley@beardsley.com", phone: "518-555-0109" },
  ],

  malone: [
    { name: "Edward Beardsley", title: "Principal", email: "ebeardsley@beardsley.com", phone: "518-555-0200" },
    { name: "Elizabeth Beardsley", title: "Principal", email: "elbeardsley@beardsley.com", phone: "518-555-0201" },
    { name: "Emily Beardsley", title: "Principal", email: "embeardsley@beardsley.com", phone: "518-555-0202" },
    { name: "Emma Beardsley", title: "Principal", email: "emmbeardsley@beardsley.com", phone: "518-555-0203" },
    { name: "Eric Beardsley", title: "Principal", email: "erbeardsley@beardsley.com", phone: "518-555-0204" },
    { name: "Ethan Beardsley", title: "Principal", email: "etbeardsley@beardsley.com", phone: "518-555-0205" },
  ],
}

// Default location data (fallback when no saved data exists)
const defaultLocations = {
  syracuse: {
    id: "syracuse",
    name: "Syracuse Office",
    address: "1115 Solar Street, Ste 102 Syracuse, NY 13204",
    image: "/placeholder.svg?height=200&width=400",
    phone: "315-472-6980",
    hours: "Mon-Fri: 8:00 AM - 5:00 PM",
    wifi: "Syracuse-Office-Net",
    amenitiesList: [
      { name: "Printers (4)" },
      { name: "Restrooms" },
      { name: "Emergency Exits" },
      { name: "Kitchen/Café" },
      { name: "Conference Rooms (6)" },
      { name: "Wi-Fi" },
    ],
    quickLinks: [
      { name: "IT Support", url: "#" },
      { name: "Book Room", url: "#" },
      { name: "Report Issue", url: "#" },
    ],
    floors: [
      {
        id: "floor-1",
        name: "Floor 1",
        rooms: [
          { id: "room-1", name: "Reception", x: 50, y: 50, width: 200, height: 100 },
          { id: "room-2", name: "Open Space", x: 50, y: 170, width: 500, height: 300 },
          { id: "room-3", name: "Meeting Room A", x: 300, y: 50, width: 150, height: 100 },
          { id: "room-4", name: "Meeting Room B", x: 470, y: 50, width: 150, height: 100 },
        ],
        amenities: [
          {
            id: "printer-1",
            type: "printer",
            name: "HP LaserJet Pro",
            ipAddress: "192.168.1.101",
            queueName: "SYR-PRINT-01",
            status: "Online",
            x: 450,
            y: 120,
          },
          { id: "restroom-1", type: "restroom", name: "Restroom", x: 450, y: 50 },
          { id: "exit-1", type: "exit", name: "Emergency Exit", x: 520, y: 50 },
          { id: "kitchen-1", type: "kitchen", name: "Kitchen", x: 520, y: 120 },
        ],
        seats: employeeData.syracuse.slice(0, 15).map((emp, index) => ({
          id: `seat-${index + 1}`,
          x: 80 + (index % 5) * 70,
          y: 200 + Math.floor(index / 5) * 70,
          rotation: 0,
          employee: {
            id: `emp-${index + 1}`,
            name: emp.name,
            title: emp.title,
            email: emp.email,
            phone: emp.phone,
            profileUrl: "#",
            avatar: "/placeholder.svg?height=40&width=40",
            notes: `Works at the Syracuse office.`,
          },
        })),
      },
    ],
  },
  albany: {
    id: "albany",
    name: "Albany Office",
    address: "69 State Street, Suite 1100D Albany, NY 12207",
    image: "/placeholder.svg?height=200&width=400",
    phone: "518-555-0100",
    hours: "Mon-Fri: 8:30 AM - 5:30 PM",
    wifi: "Albany-Office-Net",
    amenitiesList: [
      { name: "Printers (2)" },
      { name: "Restrooms" },
      { name: "Emergency Exits" },
      { name: "Kitchen" },
      { name: "Conference Rooms (3)" },
      { name: "Wi-Fi" },
    ],
    quickLinks: [
      { name: "IT Support", url: "#" },
      { name: "Book Room", url: "#" },
      { name: "Report Issue", url: "#" },
    ],
    floors: [
      {
        id: "floor-1",
        name: "Floor 1",
        rooms: [
          { id: "room-1", name: "Lobby", x: 50, y: 50, width: 200, height: 100 },
          { id: "room-2", name: "Open Space", x: 50, y: 170, width: 400, height: 250 },
        ],
        amenities: [
          {
            id: "printer-1",
            type: "printer",
            name: "Brother MFC-L8900CDW",
            ipAddress: "192.168.2.101",
            queueName: "ALB-PRINT-01",
            status: "Online",
            x: 350,
            y: 120,
          },
          { id: "restroom-1", type: "restroom", name: "Restroom", x: 350, y: 50 },
          { id: "exit-1", type: "exit", name: "Emergency Exit", x: 420, y: 50 },
          { id: "kitchen-1", type: "kitchen", name: "Kitchen", x: 420, y: 120 },
        ],
        seats: employeeData.albany.map((emp, index) => ({
          id: `seat-${index + 1}`,
          x: 100 + (index % 4) * 80,
          y: 200 + Math.floor(index / 4) * 80,
          rotation: 0,
          employee: {
            id: `emp-${index + 1}`,
            name: emp.name,
            title: emp.title,
            email: emp.email,
            phone: emp.phone,
            profileUrl: "#",
            avatar: "/placeholder.svg?height=40&width=40",
            notes: `Works at the Albany office.`,
          },
        })),
      },
    ],
  },
  malone: {
    id: "malone",
    name: "Malone Office",
    address: "320 West Main St. Ste 2 Malone, NY 12953",
    image: "/placeholder.svg?height=200&width=400",
    phone: "518-555-0200",
    hours: "Mon-Fri: 8:00 AM - 5:00 PM",
    wifi: "Malone-Office-Net",
    amenitiesList: [
      { name: "Printers (1)" },
      { name: "Restrooms" },
      { name: "Emergency Exits" },
      { name: "Kitchen" },
      { name: "Conference Rooms (2)" },
      { name: "Wi-Fi" },
    ],
    quickLinks: [
      { name: "IT Support", url: "#" },
      { name: "Book Room", url: "#" },
      { name: "Report Issue", url: "#" },
    ],
    floors: [
      {
        id: "floor-1",
        name: "Floor 1",
        rooms: [
          { id: "room-1", name: "Reception", x: 50, y: 50, width: 150, height: 100 },
          { id: "room-2", name: "Open Space", x: 220, y: 50, width: 300, height: 200 },
          { id: "room-3", name: "Conference Room", x: 50, y: 170, width: 150, height: 100 },
        ],
        amenities: [
          {
            id: "printer-1",
            type: "printer",
            name: "Canon PIXMA TR8620",
            ipAddress: "192.168.3.101",
            queueName: "MAL-PRINT-01",
            status: "Online",
            x: 450,
            y: 120,
          },
          { id: "restroom-1", type: "restroom", name: "Restroom", x: 450, y: 50 },
          { id: "exit-1", type: "exit", name: "Emergency Exit", x: 520, y: 50 },
          { id: "kitchen-1", type: "kitchen", name: "Kitchen", x: 520, y: 120 },
        ],
        seats: employeeData.malone.map((emp, index) => ({
          id: `seat-${index + 1}`,
          x: 250 + (index % 3) * 80,
          y: 100 + Math.floor(index / 3) * 80,
          rotation: 0,
          employee: {
            id: `emp-${index + 1}`,
            name: emp.name,
            title: emp.title,
            email: emp.email,
            phone: emp.phone,
            profileUrl: "#",
            avatar: "/placeholder.svg?height=40&width=40",
            notes: `Works at the Malone office.`,
          },
        })),
      },
    ],
  },
  auburn: {
    id: "auburn",
    name: "Auburn Office",
    address: "64 South Street, Auburn, NY 13021",
    image: "/placeholder.svg?height=200&width=400",
    phone: "315-253-7301",
    hours: "Mon-Fri: 8:00 AM - 5:30 PM",
    wifi: "Auburn-Office-Net",
    amenitiesList: [
      { name: "Printers (3)" },
      { name: "Restrooms" },
      { name: "Emergency Exits" },
      { name: "Kitchen Areas (2)" },
      { name: "Conference Rooms (6)" },
      { name: "Wi-Fi" },
    ],
    quickLinks: [
      { name: "IT Support", url: "#" },
      { name: "Book Room", url: "#" },
      { name: "Report Issue", url: "#" },
    ],
    floors: [
      {
        id: "basement",
        name: "Basement",
        rooms: [
          { id: "storage-1", name: "Storage", x: 100, y: 100, width: 200, height: 150, type: "storage" },
          { id: "mechanical", name: "Mechanical Room", x: 350, y: 100, width: 150, height: 150, type: "mechanical" },
          { id: "archive", name: "Archive", x: 100, y: 300, width: 400, height: 200, type: "storage" },
        ],
        amenities: [
          { id: "exit-basement", type: "exit", name: "Emergency Exit", x: 550, y: 200 },
          { id: "stairs-basement", type: "stairs", name: "Stairs to First Floor", x: 300, y: 350 },
        ],
        seats: [],
      },
      {
        id: "first-floor",
        name: "First Floor",
        rooms: [
          { id: "lobby", name: "Lobby/Reception", x: 100, y: 100, width: 300, height: 150, type: "reception" },
          { id: "conf-main", name: "Main Conference", x: 450, y: 100, width: 200, height: 150, type: "conference" },
          { id: "kitchen-main", name: "Kitchen", x: 100, y: 300, width: 150, height: 100, type: "kitchen" },
          { id: "open-first", name: "Open Office Area", x: 300, y: 300, width: 350, height: 200, type: "office" },
        ],
        amenities: [
          {
            id: "printer-first",
            type: "printer",
            name: "HP LaserJet First Floor",
            ipAddress: "192.168.4.201",
            queueName: "AUBURN-FIRST-01",
            status: "Online",
            x: 500,
            y: 350,
          },
          { id: "restroom-first", type: "restroom", name: "Restroom", x: 270, y: 300 },
          { id: "exit-main", type: "exit", name: "Main Entrance", x: 200, y: 100 },
          { id: "stairs-first", type: "stairs", name: "Stairs to Second Floor", x: 300, y: 450 },
        ],
        seats: employeeData.auburn.slice(0, 8).map((emp, index) => ({
          id: `first-seat-${index + 1}`,
          x: 320 + (index % 4) * 70,
          y: 320 + Math.floor(index / 4) * 70,
          rotation: 0,
          employee: {
            id: `emp-first-${index + 1}`,
            name: emp.name,
            title: emp.title,
            email: emp.email,
            phone: emp.phone,
            profileUrl: "#",
            avatar: "/placeholder.svg?height=40&width=40",
            notes: `Works on the first floor of the Auburn office.`,
          },
        })),
      },
      {
        id: "second-floor",
        name: "Second Floor",
        rooms: [
          // Left wing
          { id: "beardsley-office", name: "Beardsley Office", x: 50, y: 50, width: 80, height: 100, type: "office" },
          { id: "reilly-office", name: "Reilly Office", x: 140, y: 50, width: 80, height: 100, type: "office" },
          { id: "conf-left-1", name: "Conference Room", x: 50, y: 160, width: 80, height: 80, type: "conference" },
          { id: "conf-left-2", name: "Conference Room", x: 140, y: 160, width: 80, height: 80, type: "conference" },
          { id: "kitchen-left", name: "Kitchen", x: 230, y: 80, width: 60, height: 60, type: "kitchen" },

          // Center area
          { id: "conf-center", name: "Green Conference", x: 300, y: 80, width: 120, height: 100, type: "conference" },
          { id: "open-center", name: "Open Area", x: 300, y: 200, width: 200, height: 150, type: "office" },

          // Right wing - upper
          { id: "jlv-office", name: "JLV Office", x: 550, y: 50, width: 60, height: 60, type: "office" },
          { id: "awd-office", name: "AWD Office", x: 620, y: 50, width: 60, height: 60, type: "office" },
          { id: "dep-office", name: "DEP Office", x: 690, y: 50, width: 60, height: 60, type: "office" },
          {
            id: "conf-arch",
            name: "Architectural Conference",
            x: 760,
            y: 50,
            width: 120,
            height: 100,
            type: "conference",
          },

          // Right wing - middle
          { id: "faf-office", name: "FAF Office", x: 550, y: 150, width: 60, height: 60, type: "office" },
          { id: "tac-office", name: "TAC Office", x: 690, y: 150, width: 60, height: 60, type: "office" },
          { id: "print-room", name: "Print Room", x: 620, y: 150, width: 60, height: 80, type: "print" },

          // Right wing - lower
          { id: "jehl-office", name: "JEHL Office", x: 550, y: 250, width: 60, height: 60, type: "office" },
          { id: "phs-office", name: "PHS Office", x: 620, y: 250, width: 60, height: 60, type: "office" },
          { id: "kjq-office", name: "KJQ Office", x: 550, y: 320, width: 60, height: 60, type: "office" },
          { id: "jmp-office", name: "JMP Office", x: 620, y: 320, width: 60, height: 60, type: "office" },
          { id: "mjp-office", name: "MJP Office", x: 690, y: 250, width: 60, height: 60, type: "office" },
          { id: "mrm-office", name: "MRM Office", x: 690, y: 320, width: 60, height: 60, type: "office" },
          { id: "tbm-office", name: "TBM Office", x: 760, y: 320, width: 60, height: 60, type: "office" },

          // Left wing lower
          { id: "mel-office", name: "MEL Office", x: 50, y: 280, width: 80, height: 80, type: "office" },
          { id: "mar-office", name: "MAR Office", x: 140, y: 280, width: 80, height: 80, type: "office" },
          { id: "dgm-office", name: "DGM Office", x: 230, y: 280, width: 80, height: 80, type: "office" },
        ],
        amenities: [
          // Printers
          {
            id: "printer-main",
            type: "printer",
            name: "HP OfficeJet Pro 9015e",
            ipAddress: "192.168.4.101",
            queueName: "AUBURN-PRINT-01",
            status: "Online",
            x: 640,
            y: 180,
          },
          {
            id: "printer-arch",
            type: "printer",
            name: "Canon PIXMA TR8620",
            ipAddress: "192.168.4.102",
            queueName: "AUBURN-PRINT-02",
            status: "Low Paper",
            x: 800,
            y: 80,
          },

          // Doors (represented as small rectangles)
          { id: "door-1", type: "door", name: "Door", x: 130, y: 100 },
          { id: "door-2", type: "door", name: "Door", x: 220, y: 100 },
          { id: "door-3", type: "door", name: "Door", x: 290, y: 130 },
          { id: "door-4", type: "door", name: "Door", x: 420, y: 130 },
          { id: "door-5", type: "door", name: "Door", x: 540, y: 80 },
          { id: "door-6", type: "door", name: "Door", x: 540, y: 180 },
          { id: "door-7", type: "door", name: "Door", x: 540, y: 280 },

          // Restrooms
          { id: "restroom-1", type: "restroom", name: "Restroom", x: 500, y: 120 },

          // Exits
          { id: "exit-1", type: "exit", name: "Emergency Exit", x: 50, y: 200 },
          { id: "exit-2", type: "exit", name: "Emergency Exit", x: 850, y: 200 },

          // Stairs
          { id: "stairs-1", type: "stairs", name: "Stairs", x: 50, y: 400 },
          { id: "stairs-2", type: "stairs", name: "Stairs", x: 850, y: 400 },

          // Kitchen amenities
          { id: "kitchen-1", type: "kitchen", name: "Kitchen", x: 250, y: 100 },

          // Conference room amenities
          { id: "conference-1", type: "conference", name: "Conference Room", x: 80, y: 180 },
          { id: "conference-2", type: "conference", name: "Conference Room", x: 170, y: 180 },
          { id: "conference-3", type: "conference", name: "Green Conference", x: 360, y: 130 },
          { id: "conference-4", type: "conference", name: "Architectural Conference", x: 820, y: 100 },

          // Furniture (couches/seating areas)
          { id: "couch-1", type: "furniture", name: "Seating Area", x: 320, y: 220 },
          { id: "couch-2", type: "furniture", name: "Seating Area", x: 450, y: 220 },
        ],
        doors: [
          // Door connections between rooms
          { from: "beardsley-office", to: "reilly-office", x: 130, y: 100 },
          { from: "reilly-office", to: "kitchen-left", x: 220, y: 100 },
          { from: "kitchen-left", to: "conf-center", x: 290, y: 130 },
          { from: "conf-center", to: "jlv-office", x: 420, y: 130 },
          { from: "open-center", to: "faf-office", x: 500, y: 200 },
        ],
        seats: [
          // Based on the floor plan image, placing employees in their designated spots
          // JSK
          {
            id: "jsk-seat",
            x: 250,
            y: 120,
            rotation: 0,
            employee: {
              id: "emp-jsk",
              ...employeeData.auburn.find((emp) => emp.name.includes("Joe Kime")),
              profileUrl: "#",
              avatar: "/placeholder.svg?height=40&width=40",
              notes: `Works on the second floor of the Auburn office.`,
            },
          },
          // JLW, NBS, DJM positions in center conference area
          {
            id: "jlw-seat",
            x: 340,
            y: 120,
            rotation: 0,
            employee: {
              id: "emp-jlw",
              ...employeeData.auburn.find((emp) => emp.name.includes("Joanne")),
              profileUrl: "#",
              avatar: "/placeholder.svg?height=40&width=40",
              notes: `Works on the second floor of the Auburn office.`,
            },
          },
          {
            id: "nbs-seat",
            x: 380,
            y: 120,
            rotation: 0,
            employee: {
              id: "emp-nbs",
              ...employeeData.auburn.find((emp) => emp.name.includes("Nathan")),
              profileUrl: "#",
              avatar: "/placeholder.svg?height=40&width=40",
              notes: `Works on the second floor of the Auburn office.`,
            },
          },
          // JLV, AWD, DEP in upper right offices
          {
            id: "jlv-seat",
            x: 580,
            y: 80,
            rotation: 0,
            employee: {
              id: "emp-jlv",
              ...employeeData.auburn.find((emp) => emp.name.includes("Jeff Velte")),
              profileUrl: "#",
              avatar: "/placeholder.svg?height=40&width=40",
              notes: `Works on the second floor of the Auburn office.`,
            },
          },
          {
            id: "awd-seat",
            x: 650,
            y: 80,
            rotation: 0,
            employee: {
              id: "emp-awd",
              ...employeeData.auburn.find((emp) => emp.name.includes("Andrea DeLany")),
              profileUrl: "#",
              avatar: "/placeholder.svg?height=40&width=40",
              notes: `Works on the second floor of the Auburn office.`,
            },
          },
          {
            id: "dep-seat",
            x: 720,
            y: 80,
            rotation: 0,
            employee: {
              id: "emp-dep",
              ...employeeData.auburn.find((emp) => emp.name.includes("Doug Porter")),
              profileUrl: "#",
              avatar: "/placeholder.svg?height=40&width=40",
              notes: `Works on the second floor of the Auburn office.`,
            },
          },
          // DJM, JMB, JBD in center open area
          {
            id: "djm-seat",
            x: 350,
            y: 240,
            rotation: 0,
            employee: {
              id: "emp-djm",
              ...employeeData.auburn.find((emp) => emp.name.includes("Dennis McCarthy")),
              profileUrl: "#",
              avatar: "/placeholder.svg?height=40&width=40",
              notes: `Works on the second floor of the Auburn office.`,
            },
          },
          {
            id: "jmb-seat",
            x: 420,
            y: 240,
            rotation: 0,
            employee: {
              id: "emp-jmb",
              ...employeeData.auburn.find((emp) => emp.name.includes("Jared Bracken")),
              profileUrl: "#",
              avatar: "/placeholder.svg?height=40&width=40",
              notes: `Works on the second floor of the Auburn office.`,
            },
          },
          {
            id: "jbd-seat",
            x: 470,
            y: 240,
            rotation: 0,
            employee: {
              id: "emp-jbd",
              ...employeeData.auburn.find((emp) => emp.name.includes("Phillip Beyel")),
              profileUrl: "#",
              avatar: "/placeholder.svg?height=40&width=40",
              notes: `Works on the second floor of the Auburn office.`,
            },
          },
          // FAF, TAC in middle right
          {
            id: "faf-seat",
            x: 580,
            y: 180,
            rotation: 0,
            employee: {
              id: "emp-faf",
              ...employeeData.auburn.find((emp) => emp.name.includes("Felicia Fiacco")),
              profileUrl: "#",
              avatar: "/placeholder.svg?height=40&width=40",
              notes: `Works on the second floor of the Auburn office.`,
            },
          },
          {
            id: "tac-seat",
            x: 720,
            y: 180,
            rotation: 0,
            employee: {
              id: "emp-tac",
              ...employeeData.auburn.find((emp) => emp.name.includes("Tracey Carr")),
              profileUrl: "#",
              avatar: "/placeholder.svg?height=40&width=40",
              notes: `Works on the second floor of the Auburn office.`,
            },
          },
          // JFC, HMK in right area
          {
            id: "jfc-seat",
            x: 750,
            y: 240,
            rotation: 0,
            employee: {
              id: "emp-jfc",
              ...employeeData.auburn.find((emp) => emp.name.includes("Jason Coe")),
              profileUrl: "#",
              avatar: "/placeholder.svg?height=40&width=40",
              notes: `Works on the second floor of the Auburn office.`,
            },
          },
          {
            id: "hmk-seat",
            x: 790,
            y: 240,
            rotation: 0,
            employee: {
              id: "emp-hmk",
              ...employeeData.auburn.find((emp) => emp.name.includes("John Hewitt")),
              profileUrl: "#",
              avatar: "/placeholder.svg?height=40&width=40",
              notes: `Works on the second floor of the Auburn office.`,
            },
          },
          // JEHL, PHS in lower right
          {
            id: "jehl-seat",
            x: 580,
            y: 280,
            rotation: 0,
            employee: {
              id: "emp-jehl",
              ...employeeData.auburn.find((emp) => emp.name.includes("Joanne Maddox")),
              profileUrl: "#",
              avatar: "/placeholder.svg?height=40&width=40",
              notes: `Works on the second floor of the Auburn office.`,
            },
          },
          {
            id: "phs-seat",
            x: 650,
            y: 280,
            rotation: 0,
            employee: {
              id: "emp-phs",
              ...employeeData.auburn.find((emp) => emp.name.includes("Paul Shrimpton")),
              profileUrl: "#",
              avatar: "/placeholder.svg?height=40&width=40",
              notes: `Works on the second floor of the Auburn office.`,
            },
          },
          // KJQ, JMP in bottom right
          {
            id: "kjq-seat",
            x: 580,
            y: 350,
            rotation: 0,
            employee: {
              id: "emp-kjq",
              ...employeeData.auburn.find((emp) => emp.name.includes("Kathy Quigley")),
              profileUrl: "#",
              avatar: "/placeholder.svg?height=40&width=40",
              notes: `Works on the second floor of the Auburn office.`,
            },
          },
          {
            id: "jmp-seat",
            x: 650,
            y: 350,
            rotation: 0,
            employee: {
              id: "emp-jmp",
              ...employeeData.auburn.find((emp) => emp.name.includes("Joshua Marris")),
              profileUrl: "#",
              avatar: "/placeholder.svg?height=40&width=40",
              notes: `Works on the second floor of the Auburn office.`,
            },
          },
          // MJP, MRM, TBM in far right
          {
            id: "mjp-seat",
            x: 720,
            y: 280,
            rotation: 0,
            employee: {
              id: "emp-mjp",
              ...employeeData.auburn.find((emp) => emp.name.includes("Michael Picciano")),
              profileUrl: "#",
              avatar: "/placeholder.svg?height=40&width=40",
              notes: `Works on the second floor of the Auburn office.`,
            },
          },
          {
            id: "mrm-seat",
            x: 720,
            y: 350,
            rotation: 0,
            employee: {
              id: "emp-mrm",
              ...employeeData.auburn.find((emp) => emp.name.includes("Mark Rebich")),
              profileUrl: "#",
              avatar: "/placeholder.svg?height=40&width=40",
              notes: `Works on the second floor of the Auburn office.`,
            },
          },
          {
            id: "tbm-seat",
            x: 790,
            y: 350,
            rotation: 0,
            employee: {
              id: "emp-tbm",
              ...employeeData.auburn.find((emp) => emp.name.includes("Tim McSweeney")),
              profileUrl: "#",
              avatar: "/placeholder.svg?height=40&width=40",
              notes: `Works on the second floor of the Auburn office.`,
            },
          },
          // MEL, MAR, DGM in left lower area
          {
            id: "mel-seat",
            x: 90,
            y: 320,
            rotation: 0,
            employee: {
              id: "emp-mel",
              ...employeeData.auburn.find((emp) => emp.name.includes("Megan Litzenberger")),
              profileUrl: "#",
              avatar: "/placeholder.svg?height=40&width=40",
              notes: `Works on the second floor of the Auburn office.`,
            },
          },
          {
            id: "mar-seat",
            x: 180,
            y: 320,
            rotation: 0,
            employee: {
              id: "emp-mar",
              ...employeeData.auburn.find((emp) => emp.name.includes("Michael Naber")),
              profileUrl: "#",
              avatar: "/placeholder.svg?height=40&width=40",
              notes: `Works on the second floor of the Auburn office.`,
            },
          },
          {
            id: "dgm-seat",
            x: 270,
            y: 320,
            rotation: 0,
            employee: {
              id: "emp-dgm",
              ...employeeData.auburn.find((emp) => emp.name.includes("Dan Whitman")),
              profileUrl: "#",
              avatar: "/placeholder.svg?height=40&width=40",
              notes: `Works on the second floor of the Auburn office.`,
            },
          },
          // KMW in left area
          {
            id: "kmw-seat",
            x: 90,
            y: 220,
            rotation: 0,
            employee: {
              id: "emp-kmw",
              ...employeeData.auburn.find((emp) => emp.name.includes("Kathy Mietz")),
              profileUrl: "#",
              avatar: "/placeholder.svg?height=40&width=40",
              notes: `Works on the second floor of the Auburn office.`,
            },
          },
          // Additional seats for remaining employees
          ...employeeData.auburn.slice(20).map((emp, index) => ({
            id: `additional-seat-${index + 1}`,
            x: 100 + (index % 3) * 80,
            y: 450 + Math.floor(index / 3) * 60,
            rotation: 0,
            employee: {
              id: `emp-additional-${index + 1}`,
              name: emp.name,
              title: emp.title,
              email: emp.email,
              phone: emp.phone,
              profileUrl: "#",
              avatar: "/placeholder.svg?height=40&width=40",
              notes: `Works on the second floor of the Auburn office.`,
            },
          })),
        ].filter((seat) => seat.employee), // Only include seats with employees
      },
    ],
  },
}

// Storage key for localStorage
const STORAGE_KEY = "office-seating-charts-data"

// Load data from localStorage or return default
function loadFromStorage(): any {
  if (typeof window === "undefined") return defaultLocations

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Merge with defaults to ensure all locations exist
      return { ...defaultLocations, ...parsed }
    }
  } catch (error) {
    console.error("Error loading from localStorage:", error)
  }

  return defaultLocations
}

// Save data to localStorage
function saveToStorage(data: any): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    console.log("✅ Data saved to localStorage successfully")
  } catch (error) {
    console.error("❌ Error saving to localStorage:", error)
  }
}

// Initialize storage with current data
let currentData = loadFromStorage()

export function getLocationData(locationId: string) {
  // Always load fresh data from storage
  currentData = loadFromStorage()
  return currentData[locationId as keyof typeof currentData] || null
}

export function getAllLocations() {
  // Always load fresh data from storage
  currentData = loadFromStorage()
  return Object.values(currentData)
}

export function updateLocationData(locationId: string, updatedData: any) {
  // Load current data from storage
  currentData = loadFromStorage()

  if (currentData[locationId as keyof typeof currentData]) {
    currentData[locationId as keyof typeof currentData] = updatedData
    saveToStorage(currentData)
    return true
  }
  return false
}

// Save location data with persistence
export async function saveLocationData(locationId: string, updatedData: any): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Load current data from storage
      currentData = loadFromStorage()

      // Update the specific location
      if (currentData[locationId as keyof typeof currentData]) {
        currentData[locationId as keyof typeof currentData] = updatedData

        // Save to localStorage
        saveToStorage(currentData)

        console.log(`✅ Location data for ${locationId} saved successfully`)
        resolve()
      } else {
        reject(new Error(`❌ Failed to save location data for ${locationId}: Location not found`))
      }
    } catch (error) {
      console.error("❌ Error in saveLocationData:", error)
      reject(error)
    }
  })
}

// Reset to default data (useful for testing)
export function resetToDefaults(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY)
    currentData = defaultLocations
    console.log("🔄 Data reset to defaults")
  }
}

// Export data for backup
export function exportData(): string {
  currentData = loadFromStorage()
  return JSON.stringify(currentData, null, 2)
}

// Import data from backup
export function importData(jsonData: string): boolean {
  try {
    const parsed = JSON.parse(jsonData)
    saveToStorage(parsed)
    currentData = parsed
    console.log("📥 Data imported successfully")
    return true
  } catch (error) {
    console.error("❌ Error importing data:", error)
    return false
  }
}
