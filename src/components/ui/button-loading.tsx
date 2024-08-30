import { Loader } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ButtonLoadingProps {
  text: string;
  className?: string;
}

export function ButtonLoading({ text, className }: ButtonLoadingProps) {
  return (
    <Button className={className} disabled>
      <Loader className="mr-2 h-4 w-4 animate-spin" />
      {text}
    </Button>
  )
}


