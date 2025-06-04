import { Printer, CheckCircle, AlertCircle, AlertTriangle } from "lucide-react"

interface PrinterTooltipProps {
  printer: any
}

export function PrinterTooltip({ printer }: PrinterTooltipProps) {
  // Default values if not provided
  const printerName = printer.name || "Office Printer"
  const ipAddress = printer.ipAddress || "192.168.1.100"
  const queueName = printer.queueName || "PRINT-QUEUE-01"
  const status = printer.status || "Online"

  // Determine status icon and color
  const getStatusInfo = () => {
    switch (status.toLowerCase()) {
      case "online":
        return { icon: <CheckCircle className="h-4 w-4 text-green-500" />, color: "text-green-500" }
      case "offline":
        return { icon: <AlertCircle className="h-4 w-4 text-red-500" />, color: "text-red-500" }
      case "low toner":
      case "low paper":
        return { icon: <AlertTriangle className="h-4 w-4 text-amber-500" />, color: "text-amber-500" }
      default:
        return { icon: <CheckCircle className="h-4 w-4 text-green-500" />, color: "text-green-500" }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-office-maroon/10">
          <Printer className="h-5 w-5 text-office-maroon" />
        </div>
        <div>
          <h4 className="text-sm font-medium">{printerName}</h4>
          <div className="flex items-center gap-1">
            {statusInfo.icon}
            <span className={`text-xs ${statusInfo.color}`}>{status}</span>
          </div>
        </div>
      </div>

      <div className="space-y-1 rounded-md bg-gray-50 p-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-500">IP Address:</span>
          <span className="font-mono">{ipAddress}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Queue:</span>
          <span className="font-mono">{queueName}</span>
        </div>
      </div>

      <div className="text-xs text-gray-500">Click to open print queue</div>
    </div>
  )
}
