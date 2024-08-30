import { AlertCircle } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

interface AlertDestructiveProps {
  message: string,
  className?: string,
  variant?: "destructive" | "default" | "success" | "info" | "warning" | null | undefined,
}

export function AlertDestructive({ message, className, variant }: AlertDestructiveProps) {
  if (!variant) variant = "destructive"
  return (
    <Alert variant={variant} className={className}>
      <AlertCircle className="h-4 w-4" />
      {variant === "destructive" ? (<AlertTitle>Error</AlertTitle>) : (<AlertTitle>Success</AlertTitle>)}
      <AlertDescription>
        {message}
      </AlertDescription>
    </Alert>
  )
}
