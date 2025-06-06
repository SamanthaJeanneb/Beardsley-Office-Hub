import { getEmployeeNumber, getVantagePointUrl, getOfficeImagePath } from "./employee-data"

// Sample employee data with proper structure
const sampleEmployees = [
  {
    id: "emp-001",
    name: "Alex Clement",
    title: "Senior Developer",
    email: "alex.clement@beardsley.com",
    phone: "315-555-0101",
    employeeNumber: getEmployeeNumber("Alex Clement") || "00009",
    vantagePointUrl: getVantagePointUrl("Alex Clement"),
    startDate: "2020-03-15",
    department: "Engineering",
  },
  {
    id: "emp-002",
    name: "Barry Halperin",
    title: "Project Manager",
    email: "barry.halperin@beardsley.com",
    phone: "315-555-0102",
    employeeNumber: getEmployeeNumber("Barry Halperin") || "00002",
    vantagePointUrl: getVantagePointUrl("Barry Halperin"),
    startDate: "2019-01-10",
    department: "Management",
  },
  {
    id: "emp-003",
    name: "Allie Henderson",
    title: "UX Designer",
    email: "allie.henderson@beardsley.com",
    phone: "315-555-0103",
    employeeNumber: getEmployeeNumber("Allie Henderson") || "00006",
    vantagePointUrl: getVantagePointUrl("Allie Henderson"),
    startDate: "2021-06-01",
    department: "Design",
  },
  {
    id: "emp-004",
    name: "Dan Whitman",
    title: "DevOps Engineer",
    email: "dan.whitman@beardsley.com",
    phone: "315-555-0104",
    employeeNumber: getEmployeeNumber("Dan Whitman") || "00020",
    vantagePointUrl: getVantagePointUrl("Dan Whitman"),
    startDate: "2020-09-15",
    department: "Engineering",
  },
  {
    id: "emp-005",
    name: "Andrea DeLany",
    title: "Marketing Specialist",
    email: "andrea.delany@beardsley.com",
    phone: "315-555-0105",
    employeeNumber: getEmployeeNumber("Andrea DeLany") || "00024",
    vantagePointUrl: getVantagePointUrl("Andrea DeLany"),
    startDate: "2021-02-20",
    department: "Marketing",
  },
  {
    id: "emp-006",
    name: "Brandon Blumer",
    title: "Software Engineer",
    email: "brandon.blumer@beardsley.com",
    phone: "315-555-0106",
    employeeNumber: getEmployeeNumber("Brandon Blumer") || "00029",
    vantagePointUrl: getVantagePointUrl("Brandon Blumer"),
    startDate: "2020-11-01",
    department: "Engineering",
  },
]

// Mock data for the application with real employee data
// In a real application, this would come from an API or database

// Real employee data organized by location based on the CSV file
const employeeDataOriginal = {
  syracuse: [
    {
      name: "Jared Heinl",
      title: "Principal",
      email: "jheinl@beardsley.com",
      phone: "518-483-1585 4231",
      employeeNumber: "00001",
    },
    {
      name: "Barry Halperin",
      title: "Principal",
      email: "bhalperin@beardsley.com",
      phone: "315-472-6980 3311",
      employeeNumber: "00002",
    },
    {
      name: "Thomas Ascienzo",
      title: "Electrical Senior Designer",
      email: "tascienzo@beardsley.com",
      phone: "315-472-6980 3323",
      employeeNumber: "00003",
    },
    {
      name: "Seth Livermore",
      title: "Civil Engineer V",
      email: "slivermore@beardsley.com",
      phone: "315-472-6980 3315",
      employeeNumber: "00004",
    },
    {
      name: "Lillian Marshall",
      title: "Administrative Assistant",
      email: "lmarshall@beardsley.com",
      phone: "315-472-6980 3327",
      employeeNumber: "00005",
    },
    {
      name: "Allie Henderson",
      title: "Landscape Designer",
      email: "ahenderson@beardsley.com",
      phone: "315-472-6980 3328",
      employeeNumber: "00006",
    },
    {
      name: "Scott Folts",
      title: "Civil Engineer",
      email: "sfolts@beardsley.com",
      phone: "315-472-6980 3329",
      employeeNumber: "00007",
    },
    {
      name: "Jacob Perez Gangi",
      title: "Architectural Designer",
      email: "jperezgangi@beardsley.com",
      phone: "315-472-6980 3330",
      employeeNumber: "00008",
    },
    {
      name: "Alex Clement",
      title: "Civil Engineer",
      email: "aclement@beardsley.com",
      phone: "315-472-6980 3331",
      employeeNumber: "00009",
    },
    {
      name: "Nicholas Hartung",
      title: "Electrical Designer",
      email: "nhartung@beardsley.com",
      phone: "315-472-6980 3332",
      employeeNumber: "00010",
    },
    {
      name: "Chelsea Bush",
      title: "Administrative Assistant",
      email: "cbush@beardsley.com",
      phone: "315-472-6980 3333",
      employeeNumber: "00011",
    },
    {
      name: "Michelle Thompson",
      title: "Project Manager",
      email: "mthompson@beardsley.com",
      phone: "315-472-6980 3334",
      employeeNumber: "00013",
    },
    {
      name: "Brittany Varengo",
      title: "Marketing Coordinator",
      email: "bvarengo@beardsley.com",
      phone: "315-472-6980 3335",
      employeeNumber: "00014",
    },
    {
      name: "Caleb Sayers",
      title: "Civil Engineer",
      email: "csayers@beardsley.com",
      phone: "315-472-6980 3336",
      employeeNumber: "00015",
    },
    {
      name: "Justin Chiera",
      title: "Electrical Engineer",
      email: "jchiera@beardsley.com",
      phone: "315-472-6980 3337",
      employeeNumber: "00016",
    },
    {
      name: "Gabriel Amaya",
      title: "Architectural Designer",
      email: "gamaya@beardsley.com",
      phone: "315-472-6980 3338",
      employeeNumber: "00017",
    },
    {
      name: "Adrianna Mondello",
      title: "Intern",
      email: "amondello@beardsley.com",
      phone: "518-940-4554",
      employeeNumber: "00374",
    },
  ],

  auburn: [
    {
      name: "Joanne Butler",
      title: "Landscape Senior Designer",
      email: "jbutler@beardsley.com",
      phone: "315-253-7301 2271",
      employeeNumber: "00012",
    },
    {
      name: "Kathy Quigley",
      title: "Computer System Administrator",
      email: "kquigley@beardsley.com",
      phone: "315-253-7301 2242",
      employeeNumber: "00018",
    },
    {
      name: "Glenn Hewitt",
      title: "Fire Protection Senior Designer",
      email: "ghewitt@beardsley.com",
      phone: "315-253-7301 2254",
      employeeNumber: "00019",
    },
    {
      name: "Dan Whitman",
      title: "Plumbing Senior Designer",
      email: "dwhitman@beardsley.com",
      phone: "315-253-7301 2227",
      employeeNumber: "00020",
    },
    {
      name: "Mike Picciano",
      title: "Electrical Engineer V",
      email: "mpicciano@beardsley.com",
      phone: "315-253-7301 2258",
      employeeNumber: "00021",
    },
    {
      name: "Mark Rebich",
      title: "Civil Engineer",
      email: "mrebich@beardsley.com",
      phone: "315-253-7301 2259",
      employeeNumber: "00022",
    },
    {
      name: "Dennis McCarthy",
      title: "Mechanical Engineer",
      email: "dmccarthy@beardsley.com",
      phone: "315-253-7301 2260",
      employeeNumber: "00023",
    },
    {
      name: "Andrea DeLany",
      title: "Administrative Assistant",
      email: "adelany@beardsley.com",
      phone: "315-253-7301 2261",
      employeeNumber: "00024",
    },
    {
      name: "Jeff Velte",
      title: "Civil Engineer",
      email: "jvelte@beardsley.com",
      phone: "315-253-7301 2262",
      employeeNumber: "00025",
    },
    {
      name: "Drew Ingram",
      title: "Electrical Engineer",
      email: "dingram@beardsley.com",
      phone: "315-253-7301 2263",
      employeeNumber: "00026",
    },
    {
      name: "Paul Shrimpton",
      title: "Mechanical Engineer",
      email: "pshrimpton@beardsley.com",
      phone: "315-253-7301 2264",
      employeeNumber: "00027",
    },
    {
      name: "Ed Onori",
      title: "Civil Engineer",
      email: "eonori@beardsley.com",
      phone: "315-253-7301 2265",
      employeeNumber: "00028",
    },
    {
      name: "Brandon Blumer",
      title: "Electrical Engineer",
      email: "bblumer@beardsley.com",
      phone: "315-253-7301 2266",
      employeeNumber: "00029",
    },
    {
      name: "Kathy Mietz",
      title: "Project Manager",
      email: "kmietz@beardsley.com",
      phone: "315-253-7301 2267",
      employeeNumber: "00030",
    },
    {
      name: "Joe Kime",
      title: "Civil Engineer",
      email: "jkime@beardsley.com",
      phone: "315-253-7301 2268",
      employeeNumber: "00031",
    },
    {
      name: "Tom Wight",
      title: "Mechanical Engineer",
      email: "twight@beardsley.com",
      phone: "315-253-7301 2269",
      employeeNumber: "00032",
    },
    {
      name: "Doug Porter",
      title: "Civil Engineer",
      email: "dporter@beardsley.com",
      phone: "315-253-7301 2270",
      employeeNumber: "00033",
    },
    {
      name: "Julia Furlong",
      title: "Administrative Assistant",
      email: "jfurlong@beardsley.com",
      phone: "315-253-7301 2271",
      employeeNumber: "00034",
    },
    {
      name: "Joanne Maddox Kinslow",
      title: "Project Manager",
      email: "jkinslow@beardsley.com",
      phone: "315-253-7301 2272",
      employeeNumber: "00035",
    },
    {
      name: "Phil Beyel",
      title: "Electrical Engineer",
      email: "pbeyel@beardsley.com",
      phone: "315-253-7301 2273",
      employeeNumber: "00036",
    },
    {
      name: "Tim McSweeney",
      title: "Civil Engineer",
      email: "tmcsweeney@beardsley.com",
      phone: "315-253-7301 2274",
      employeeNumber: "00037",
    },
    {
      name: "Kurt Olsen",
      title: "Mechanical Engineer",
      email: "kolsen@beardsley.com",
      phone: "315-253-7301 2275",
      employeeNumber: "00038",
    },
    {
      name: "Jason Coe",
      title: "Civil Engineer",
      email: "jcoe@beardsley.com",
      phone: "315-253-7301 2276",
      employeeNumber: "00039",
    },
    {
      name: "John Hewitt",
      title: "Fire Protection Engineer",
      email: "jhewitt@beardsley.com",
      phone: "315-253-7301 2277",
      employeeNumber: "00040",
    },
    {
      name: "Jared Bracken",
      title: "Civil Engineer",
      email: "jbracken@beardsley.com",
      phone: "315-253-7301 2278",
      employeeNumber: "00041",
    },
    {
      name: "Felicia Fiacco",
      title: "Administrative Assistant",
      email: "ffiacco@beardsley.com",
      phone: "315-253-7301 2279",
      employeeNumber: "00042",
    },
    {
      name: "Mike Naber",
      title: "Electrical Engineer",
      email: "mnaber@beardsley.com",
      phone: "315-253-7301 2280",
      employeeNumber: "00043",
    },
    {
      name: "Tracey Carr",
      title: "Project Manager",
      email: "tcarr@beardsley.com",
      phone: "315-253-7301 2281",
      employeeNumber: "00044",
    },
    {
      name: "Kyle Daddario",
      title: "Civil Engineer",
      email: "kdaddario@beardsley.com",
      phone: "315-253-7301 2282",
      employeeNumber: "00045",
    },
    {
      name: "Nathan Stultz",
      title: "Electrical Engineer",
      email: "nstultz@beardsley.com",
      phone: "315-253-7301 2283",
      employeeNumber: "00046",
    },
    {
      name: "Mathew Milne",
      title: "Civil Engineer",
      email: "mmilne@beardsley.com",
      phone: "315-253-7301 2284",
      employeeNumber: "00047",
    },
    {
      name: "Joshua Marris",
      title: "Mechanical Engineer",
      email: "jmarris@beardsley.com",
      phone: "315-253-7301 2285",
      employeeNumber: "00049",
    },
    {
      name: "Megan Litzenberger",
      title: "Administrative Assistant",
      email: "mlitzenberger@beardsley.com",
      phone: "315-253-7301 2286",
      employeeNumber: "00050",
    },
  ],

  albany: [
    {
      name: "Cameron Beardsley",
      title: "Principal",
      email: "cbeardsley@beardsley.com",
      phone: "518-555-0100",
      employeeNumber: "00053",
    },
    {
      name: "Caroline Beardsley",
      title: "Principal",
      email: "cabeardsley@beardsley.com",
      phone: "518-555-0101",
      employeeNumber: "00054",
    },
  ],

  malone: [
    {
      name: "Edward Beardsley",
      title: "Principal",
      email: "ebeardsley@beardsley.com",
      phone: "518-555-0200",
      employeeNumber: "00063",
    },
    {
      name: "Elizabeth Beardsley",
      title: "Principal",
      email: "elbeardsley@beardsley.com",
      phone: "518-555-0201",
      employeeNumber: "00064",
    },
  ],
}

// Default location data (fallback when no saved data exists)
const defaultLocations = {
  syracuse: {
    id: "syracuse",
    name: "Syracuse Office",
    address: "1115 Solar Street, Ste 102 Syracuse, NY 13204",
    image: getOfficeImagePath("syracuse"),
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
          { id: "room-1", name: "Reception", x: 50, y: 50, width: 200, height: 100, type: "reception" },
          { id: "room-2", name: "Open Space", x: 50, y: 170, width: 500, height: 300, type: "office" },
          { id: "room-3", name: "Meeting Room A", x: 300, y: 50, width: 150, height: 100, type: "conference" },
          { id: "room-4", name: "Meeting Room B", x: 470, y: 50, width: 150, height: 100, type: "conference" },
        ],
        furniture: [
          // Reception area furniture
          { id: "desk-1", type: "desk", x: 120, y: 80, width: 60, height: 40, rotation: 0 },
          { id: "chair-1", type: "chair", x: 140, y: 125, width: 20, height: 20, rotation: 0 },

          // Open space desks
          { id: "desk-2", type: "desk", x: 80, y: 200, width: 60, height: 40, rotation: 0 },
          { id: "desk-3", type: "desk", x: 160, y: 200, width: 60, height: 40, rotation: 0 },
          { id: "desk-4", type: "desk", x: 240, y: 200, width: 60, height: 40, rotation: 0 },
          { id: "desk-5", type: "desk", x: 320, y: 200, width: 60, height: 40, rotation: 0 },
          { id: "desk-6", type: "desk", x: 400, y: 200, width: 60, height: 40, rotation: 0 },

          { id: "desk-7", type: "desk", x: 80, y: 280, width: 60, height: 40, rotation: 0 },
          { id: "desk-8", type: "desk", x: 160, y: 280, width: 60, height: 40, rotation: 0 },
          { id: "desk-9", type: "desk", x: 240, y: 280, width: 60, height: 40, rotation: 0 },
          { id: "desk-10", type: "desk", x: 320, y: 280, width: 60, height: 40, rotation: 0 },
          { id: "desk-11", type: "desk", x: 400, y: 280, width: 60, height: 40, rotation: 0 },

          // Conference room tables
          { id: "table-1", type: "table", x: 315, y: 75, width: 120, height: 50, rotation: 0 },
          { id: "table-2", type: "table", x: 485, y: 75, width: 120, height: 50, rotation: 0 },

          // Filing cabinets
          { id: "cabinet-1", type: "cabinet", x: 480, y: 200, width: 40, height: 30, rotation: 0 },
          { id: "cabinet-2", type: "cabinet", x: 480, y: 240, width: 40, height: 30, rotation: 0 },
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
        seats: employeeDataOriginal.syracuse.map((emp, index) => ({
          id: `seat-${index + 1}`,
          x: 110 + (index % 5) * 80, // Position on desks
          y: 220 + Math.floor(index / 5) * 80,
          rotation: 0,
          furnitureId: `desk-${index + 2}`, // Link to furniture
          employee: {
            id: `emp-${index + 1}`,
            name: emp.name,
            title: emp.title,
            email: emp.email,
            phone: emp.phone,
            employeeNumber: emp.employeeNumber,
            profileUrl: "#",
            avatar: "/placeholder.svg?height=40&width=40",
            notes: `Works at the Syracuse office.`,
          },
        })),
      },
    ],
  },

  auburn: {
    id: "auburn",
    name: "Auburn Office",
    address: "64 South Street, Auburn, NY 13021",
    image: getOfficeImagePath("auburn"),
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
        id: "first-floor",
        name: "First Floor",
        rooms: [
          { id: "lobby", name: "Lobby", x: 50, y: 50, width: 150, height: 100, type: "reception" },
          { id: "conf-room-1", name: "Conference Room 1", x: 220, y: 50, width: 120, height: 80, type: "conference" },
          { id: "open-area-1", name: "Open Area", x: 50, y: 170, width: 400, height: 200, type: "office" },
        ],
        furniture: [
          { id: "desk-f1-1", type: "desk", x: 80, y: 200, width: 60, height: 40, rotation: 0 },
          { id: "desk-f1-2", type: "desk", x: 160, y: 200, width: 60, height: 40, rotation: 0 },
          { id: "desk-f1-3", type: "desk", x: 240, y: 200, width: 60, height: 40, rotation: 0 },
          { id: "desk-f1-4", type: "desk", x: 320, y: 200, width: 60, height: 40, rotation: 0 },
          { id: "desk-f1-5", type: "desk", x: 80, y: 280, width: 60, height: 40, rotation: 0 },
          { id: "desk-f1-6", type: "desk", x: 160, y: 280, width: 60, height: 40, rotation: 0 },
          { id: "desk-f1-7", type: "desk", x: 240, y: 280, width: 60, height: 40, rotation: 0 },
          { id: "desk-f1-8", type: "desk", x: 320, y: 280, width: 60, height: 40, rotation: 0 },
        ],
        amenities: [
          {
            id: "printer-f1",
            type: "printer",
            name: "HP OfficeJet Pro 9015e",
            ipAddress: "192.168.4.101",
            queueName: "AUBURN-F1-PRINT-01",
            status: "Online",
            x: 400,
            y: 120,
          },
          { id: "restroom-f1", type: "restroom", name: "Restroom", x: 400, y: 50 },
          { id: "exit-f1", type: "exit", name: "Emergency Exit", x: 470, y: 50 },
          { id: "kitchen-f1", type: "kitchen", name: "Kitchen", x: 470, y: 120 },
        ],
        seats: employeeDataOriginal.auburn.slice(0, 15).map((emp, index) => ({
          id: `auburn-f1-seat-${index + 1}`,
          x: 110 + (index % 4) * 80,
          y: 220 + Math.floor(index / 4) * 80,
          rotation: 0,
          furnitureId: `desk-f1-${(index % 8) + 1}`,
          employee: {
            id: `emp-auburn-f1-${index + 1}`,
            name: emp.name,
            title: emp.title,
            email: emp.email,
            phone: emp.phone,
            employeeNumber: emp.employeeNumber,
            profileUrl: "#",
            avatar: "/placeholder.svg?height=40&width=40",
            notes: `Works at the Auburn office, First Floor.`,
          },
        })),
      },
      {
        id: "second-floor",
        name: "Second Floor",
        rooms: [
          { id: "open-center", name: "Open Area", x: 300, y: 200, width: 200, height: 150, type: "office" },
          { id: "conf-center", name: "Green Conference", x: 300, y: 80, width: 120, height: 100, type: "conference" },
        ],
        furniture: [
          // Individual office desks
          { id: "desk-kjq", type: "desk", x: 560, y: 340, width: 60, height: 40, rotation: 0 },
          { id: "desk-jmp", type: "desk", x: 640, y: 340, width: 60, height: 40, rotation: 0 },
          { id: "desk-dgm", type: "desk", x: 250, y: 310, width: 60, height: 40, rotation: 0 },
          { id: "desk-tac", type: "desk", x: 700, y: 170, width: 60, height: 40, rotation: 0 },
          { id: "desk-faf", type: "desk", x: 560, y: 170, width: 60, height: 40, rotation: 0 },

          // Conference table
          { id: "table-conf", type: "table", x: 330, y: 110, width: 120, height: 60, rotation: 0 },
        ],
        amenities: [
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
          { id: "restroom-1", type: "restroom", name: "Restroom", x: 500, y: 120 },
          { id: "exit-1", type: "exit", name: "Emergency Exit", x: 50, y: 200 },
          { id: "kitchen-1", type: "kitchen", name: "Kitchen", x: 250, y: 100 },
        ],
        seats: employeeDataOriginal.auburn.slice(15).map((emp, index) => {
          const furnitureIds = ["desk-kjq", "desk-jmp", "desk-dgm", "desk-tac", "desk-faf"]
          const positions = [
            { x: 590, y: 360 }, // KJQ position
            { x: 670, y: 360 }, // JMP position
            { x: 280, y: 330 }, // DGM position
            { x: 730, y: 190 }, // TAC position
            { x: 590, y: 190 }, // FAF position
          ]

          return {
            id: `auburn-seat-${index + 16}`,
            x: positions[index]?.x || 100 + index * 80,
            y: positions[index]?.y || 300,
            rotation: 0,
            furnitureId: furnitureIds[index] || null,
            employee: {
              id: `emp-auburn-${index + 16}`,
              name: emp.name,
              title: emp.title,
              email: emp.email,
              phone: emp.phone,
              employeeNumber: emp.employeeNumber,
              profileUrl: "#",
              avatar: "/placeholder.svg?height=40&width=40",
              notes: `Works at the Auburn office, Second Floor.`,
            },
          }
        }),
      },
    ],
  },

  albany: {
    id: "albany",
    name: "Albany Office",
    address: "69 State Street, Suite 1100D Albany, NY 12207",
    image: getOfficeImagePath("albany"),
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
          { id: "room-1", name: "Lobby", x: 50, y: 50, width: 200, height: 100, type: "reception" },
          { id: "room-2", name: "Open Space", x: 50, y: 170, width: 400, height: 250, type: "office" },
        ],
        furniture: [
          { id: "desk-alb-1", type: "desk", x: 100, y: 200, width: 60, height: 40, rotation: 0 },
          { id: "desk-alb-2", type: "desk", x: 200, y: 200, width: 60, height: 40, rotation: 0 },
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
        seats: employeeDataOriginal.albany.map((emp, index) => ({
          id: `albany-seat-${index + 1}`,
          x: 130 + index * 100,
          y: 220,
          rotation: 0,
          furnitureId: `desk-alb-${index + 1}`,
          employee: {
            id: `emp-albany-${index + 1}`,
            name: emp.name,
            title: emp.title,
            email: emp.email,
            phone: emp.phone,
            employeeNumber: emp.employeeNumber,
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
    image: getOfficeImagePath("malone"),
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
          { id: "room-1", name: "Reception", x: 50, y: 50, width: 150, height: 100, type: "reception" },
          { id: "room-2", name: "Open Space", x: 220, y: 50, width: 300, height: 200, type: "office" },
          { id: "room-3", name: "Conference Room", x: 50, y: 170, width: 150, height: 100, type: "conference" },
        ],
        furniture: [
          { id: "desk-mal-1", type: "desk", x: 250, y: 100, width: 60, height: 40, rotation: 0 },
          { id: "desk-mal-2", type: "desk", x: 350, y: 100, width: 60, height: 40, rotation: 0 },
          { id: "table-mal-1", type: "table", x: 75, y: 195, width: 100, height: 50, rotation: 0 },
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
        seats: employeeDataOriginal.malone.map((emp, index) => ({
          id: `malone-seat-${index + 1}`,
          x: 280 + index * 100,
          y: 120,
          rotation: 0,
          furnitureId: `desk-mal-${index + 1}`,
          employee: {
            id: `emp-malone-${index + 1}`,
            name: emp.name,
            title: emp.title,
            email: emp.email,
            phone: emp.phone,
            employeeNumber: emp.employeeNumber,
            profileUrl: "#",
            avatar: "/placeholder.svg?height=40&width=40",
            notes: `Works at the Malone office.`,
          },
        })),
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

// Add new location
export function addNewLocation(locationData: any): boolean {
  try {
    currentData = loadFromStorage()

    // Generate a unique ID if not provided
    if (!locationData.id) {
      locationData.id = locationData.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    }

    // Check if location already exists
    if (currentData[locationData.id]) {
      return false // Location already exists
    }

    // Add the new location
    currentData[locationData.id] = locationData
    saveToStorage(currentData)

    console.log(`✅ New location ${locationData.id} added successfully`)
    return true
  } catch (error) {
    console.error("❌ Error adding new location:", error)
    return false
  }
}

// Add new floor to a location
export function addNewFloor(locationId: string, floorData: any): boolean {
  try {
    currentData = loadFromStorage()

    if (currentData[locationId]) {
      // Generate a unique floor ID if not provided
      if (!floorData.id) {
        const existingFloorCount = currentData[locationId].floors?.length || 0
        floorData.id = `floor-${existingFloorCount + 1}`
      }

      // Ensure floors array exists
      if (!currentData[locationId].floors) {
        currentData[locationId].floors = []
      }

      // Add default structure if not provided
      const defaultFloor = {
        id: floorData.id,
        name: floorData.name || `Floor ${currentData[locationId].floors.length + 1}`,
        rooms: floorData.rooms || [
          { id: "room-1", name: "Open Space", x: 50, y: 50, width: 400, height: 300, type: "office" },
        ],
        furniture: floorData.furniture || [
          { id: "desk-1", type: "desk", x: 100, y: 100, width: 60, height: 40, rotation: 0 },
          { id: "desk-2", type: "desk", x: 200, y: 100, width: 60, height: 40, rotation: 0 },
        ],
        amenities: floorData.amenities || [
          {
            id: "printer-1",
            type: "printer",
            name: "Office Printer",
            ipAddress: "192.168.1.101",
            queueName: "OFFICE-PRINT-01",
            status: "Online",
            x: 350,
            y: 120,
          },
          { id: "restroom-1", type: "restroom", name: "Restroom", x: 350, y: 50 },
          { id: "exit-1", type: "exit", name: "Emergency Exit", x: 420, y: 50 },
        ],
        seats:
          floorData.seats ||
          Array.from({ length: 10 }, (_, index) => ({
            id: `seat-${index + 1}`,
            x: 130 + (index % 5) * 80,
            y: 120 + Math.floor(index / 5) * 80,
            rotation: 0,
            furnitureId: index < 2 ? `desk-${index + 1}` : null,
            employee: null, // Empty seats for new floor
          })),
        ...floorData,
      }

      currentData[locationId].floors.push(defaultFloor)
      saveToStorage(currentData)

      console.log(`✅ New floor ${floorData.id} added to location ${locationId}`)
      return true
    }

    return false
  } catch (error) {
    console.error("❌ Error adding new floor:", error)
    return false
  }
}

// Delete location
export function deleteLocation(locationId: string): boolean {
  try {
    currentData = loadFromStorage()

    if (currentData[locationId]) {
      delete currentData[locationId]
      saveToStorage(currentData)
      console.log(`✅ Location ${locationId} deleted successfully`)
      return true
    }

    return false
  } catch (error) {
    console.error("❌ Error deleting location:", error)
    return false
  }
}

// Delete floor from location
export function deleteFloor(locationId: string, floorId: string): boolean {
  try {
    currentData = loadFromStorage()

    if (currentData[locationId] && currentData[locationId].floors) {
      const floorIndex = currentData[locationId].floors.findIndex((floor: any) => floor.id === floorId)
      if (floorIndex !== -1) {
        currentData[locationId].floors.splice(floorIndex, 1)
        saveToStorage(currentData)
        console.log(`✅ Floor ${floorId} deleted from location ${locationId}`)
        return true
      }
    }

    return false
  } catch (error) {
    console.error("❌ Error deleting floor:", error)
    return false
  }
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
