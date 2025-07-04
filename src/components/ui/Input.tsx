import React from 'react'
import { cn } from '../../lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export function Input({
  label,
  error,
  icon,
  className,
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400">
              {icon}
            </div>
          </div>
        )}
        <input
          className={cn(
            'input-field w-full',
            icon && 'pl-10',
            error && 'border-error-500 focus:ring-error-500',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-error-400">{error}</p>
      )}
    </div>
  )
}

export function Textarea({
  label,
  error,
  className,
  ...props
}: {
  label?: string
  error?: string
  className?: string
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'input-field w-full min-h-[100px] resize-y',
          error && 'border-error-500 focus:ring-error-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-error-400">{error}</p>
      )}
    </div>
  )
}

export function Select({
  label,
  error,
  children,
  className,
  ...props
}: {
  label?: string
  error?: string
  children: React.ReactNode
  className?: string
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <select
        className={cn(
          'input-field w-full',
          error && 'border-error-500 focus:ring-error-500',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-sm text-error-400">{error}</p>
      )}
    </div>
  )
}