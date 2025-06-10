import { Badge } from "@/components/ui/badge"
import { Users, UserCheck, UserX, Mail } from "lucide-react"
import { cn } from '@/lib/utils'

type ParticipationStatus = 'registered' | 'present' | 'absent' | 'invited'

interface ParticipationTagProps {
  status: ParticipationStatus
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

export function ParticipationTag({ 
  status, 
  className, 
  size = 'md', 
  showIcon = true 
}: ParticipationTagProps) {
  const getStatusConfig = (status: ParticipationStatus) => {
    switch (status) {
      case 'present':
        return {
          variant: 'default' as const,
          label: 'Present',
          icon: <UserCheck className="h-4 w-4" />
        }
      case 'absent':
        return {
          variant: 'destructive' as const,
          label: 'Absent',
          icon: <UserX className="h-4 w-4" />
        }
      case 'invited':
        return {
          variant: 'outline' as const,
          label: 'Invited',
          icon: <Mail className="h-4 w-4" />
        }
      case 'registered':
      default:
        return {
          variant: 'secondary' as const,
          label: 'Registered',
          icon: <Users className="h-4 w-4" />
        }
    }
  }

  const config = getStatusConfig(status)
  
  const sizeClasses = {
    sm: showIcon ? 'text-xs gap-1' : 'text-xs',
    md: showIcon ? 'text-sm gap-1' : 'text-sm', 
    lg: showIcon ? 'text-base gap-2' : 'text-base',
  }

  const iconSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <Badge 
      variant={config.variant}
      className={cn(
        'flex items-center justify-center min-w-fit',
        sizeClasses[size],
        className
      )}
    >
      {showIcon && (
        <span className={iconSizeClasses[size]}>
          {config.icon}
        </span>
      )}
      {config.label}
    </Badge>
  )
}