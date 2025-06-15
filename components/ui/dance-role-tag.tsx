import { DanceRole } from '@/types';
import { cn } from '@/lib/utils';

interface DanceRoleTagProps {
  role?: DanceRole | string | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function DanceRoleTag({
  role,
  className,
  size = 'md',
}: DanceRoleTagProps) {
  const getRoleColor = (role: string | null | undefined) => {
    switch (role) {
      case 'LEADER':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'FOLLOWER':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleLabel = (role: string | null | undefined) => {
    switch (role) {
      case 'LEADER':
        return 'Leader';
      case 'FOLLOWER':
        return 'Follower';
      default:
        return 'No Role';
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        getRoleColor(role),
        sizeClasses[size],
        className
      )}
    >
      {getRoleLabel(role)}
    </span>
  );
}
