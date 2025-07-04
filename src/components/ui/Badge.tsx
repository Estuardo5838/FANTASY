import React from 'react'
import { cn } from '../../lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  const baseClasses = 'inline-flex items-center font-semibold rounded-full'
  
  const variantClasses = {
    default: 'bg-gray-700 text-gray-300',
    success: 'bg-success-600 text-white',
    warning: 'bg-warning-600 text-white',
    error: 'bg-error-600 text-white',
    info: 'bg-primary-600 text-white'
  }
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  )
}

export function PositionBadge({ position }: { position: string }) {
  const getPositionColor = (pos: string) => {
    const colors: Record<string, string> = {
      QB: 'bg-red-600 text-white',
      RB: 'bg-green-600 text-white',
      WR: 'bg-blue-600 text-white',
      TE: 'bg-yellow-600 text-white',
      K: 'bg-purple-600 text-white',
      DEF: 'bg-gray-600 text-white',
      DST: 'bg-gray-600 text-white',
    }
    return colors[pos] || 'bg-gray-600 text-white'
  }

  return (
    <Badge className={getPositionColor(position)} size="sm">
      {position}
    </Badge>
  )
}