// Generate a list of all expected photo filenames for easy reference
import { getAllExpectedPhotoFilenames, getEmployeePhotoMapping } from "../lib/employee-data.js"

console.log("=== EMPLOYEE PHOTO REFERENCE ===\n")

const photoMapping = getEmployeePhotoMapping()
const allFilenames = getAllExpectedPhotoFilenames()

console.log(`Total employees: ${allFilenames.length}`)
console.log(`Expected photo files:\n`)

// Group by office for easier organization
const offices = {
  syracuse: [
    "Jared Heinl",
    "Barry Halperin",
    "Thomas Ascienzo",
    "Seth Livermore",
    "Lillian Spencer",
    "Allie Henderson",
    "Scott Folts",
    "Jacob Perez Gangi",
    "Alex Clement",
    "Nicholas Hartung",
    "Chelsea Bush",
    "Michelle Thompson",
    "Brittany Varengo",
    "Caleb Sayers",
    "Justin Chiera",
    "Gabriel Amaya",
    "Adrianna Mondello",
  ],
  auburn: [
    "Joanne Butler",
    "Dan Whitman",
    "Glenn Hewitt",
    "Kathy Quigley",
    "Michael Picciano",
    "Mark Rebich",
    "Dennis McCarthy",
    "Andrea DeLany",
    "Jeff Velte",
    "Andrew Ingram",
    "Paul Shrimpton",
    "Ed Onori",
    "Brandon Blumer",
    "Kathy Mietz",
    "Joe Kime",
    "Thomas Wight",
    "Doug Porter",
    "Julia Furlong",
    "Joanne Maddox Kinslow",
    "Phillip Beyel",
    "Tim McSweeney",
    "Kurt Olsen",
    "Jason Coe",
    "John Hewitt",
    "Jared Bracken",
    "Felicia Fiacco",
    "Michael Naber",
    "Tracey Carr",
    "Kyle Daddario",
    "Nathan Stultz",
    "Mathew Milne",
    "Dominic Seils",
    "Joshua Marris",
    "Megan Litzenberger",
    "Samantha Brown",
    "Evan Moore",
  ],
  albany: [
    "Cameron Beardsley",
    "Caroline Beardsley",
    "Catherine Beardsley",
    "Charles Beardsley",
    "Charlotte Beardsley",
    "Christopher Beardsley",
    "Claire Beardsley",
    "Daniel Beardsley",
    "David Beardsley",
    "Diana Beardsley",
  ],
  malone: [
    "Edward Beardsley",
    "Elizabeth Beardsley",
    "Emily Beardsley",
    "Emma Beardsley",
    "Eric Beardsley",
    "Ethan Beardsley",
  ],
}

Object.entries(offices).forEach(([office, employees]) => {
  console.log(`\n--- ${office.toUpperCase()} OFFICE ---`)
  employees.forEach((name) => {
    if (photoMapping[name]) {
      console.log(`${name} → ${photoMapping[name]}`)
    }
  })
})

console.log("\n=== QUICK COPY LIST ===")
console.log("Copy these filenames to create placeholder files:\n")
allFilenames.forEach((filename) => {
  console.log(filename)
})

console.log("\n=== BASH COMMAND TO CREATE PLACEHOLDER FILES ===")
console.log("Run this in your /public/photos/ directory:\n")
console.log("touch " + allFilenames.join(" "))

console.log("\n=== INSTRUCTIONS ===")
console.log("1. Create the /public/photos/ directory if it doesn't exist")
console.log("2. Add employee photos using the exact filenames listed above")
console.log("3. The system will automatically detect and display the photos")
console.log("4. Use the photo upload feature in the admin panel for new employees")
