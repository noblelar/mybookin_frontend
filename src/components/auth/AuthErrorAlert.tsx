import { AlertCircle } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface AuthErrorAlertProps {
  title?: string
  message: string
  className?: string
}

export default function AuthErrorAlert({
  title = 'We could not complete that request',
  message,
  className,
}: AuthErrorAlertProps) {
  return (
    <Alert variant="destructive" className={className}>
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
        <div className="grid gap-1">
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </div>
      </div>
    </Alert>
  )
}
