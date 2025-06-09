import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface EmployeeSearchDialogProps {
  allLocations: any[]
  buttonProps?: any
}

export function EmployeeSearchDialog({ allLocations, buttonProps = {} }: EmployeeSearchDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          variant="secondary"
          className="bg-white text-beardsley-red hover:bg-gray-100 shadow-lg text-lg px-8 py-6 h-auto font-whitney"
          {...buttonProps}
        >
          <Search className="mr-2 h-5 w-5" />
          Find Employees
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Find Employees</DialogTitle>
          <DialogDescription>Search for employees across all locations.</DialogDescription>
        </DialogHeader>
        {/* TODO: Add search functionality here */}
      </DialogContent>
    </Dialog>
  )
}
