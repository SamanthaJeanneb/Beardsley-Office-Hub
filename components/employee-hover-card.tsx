import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface EmployeeHoverCardProps {
  employee: any
}

export function EmployeeHoverCard({ employee }: EmployeeHoverCardProps) {
  if (!employee) return null

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10 border-2 border-office-maroon/20">
        <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
        <AvatarFallback className="bg-gradient-to-br from-office-maroon to-office-maroon-light text-white">
          {employee.name
            .split(" ")
            .map((n: string) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div>
        <h4 className="text-sm font-medium text-office-maroon">{employee.name}</h4>
        <p className="text-xs text-muted-foreground">{employee.title}</p>
      </div>
    </div>
  )
}
