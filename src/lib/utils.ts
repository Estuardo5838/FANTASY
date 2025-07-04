import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

export function formatPercentage(num: number): string {
  return `${(num * 100).toFixed(1)}%`
}

export function getPositionColor(position: string): string {
  const colors: Record<string, string> = {
    QB: 'bg-red-500',
    RB: 'bg-green-500',
    WR: 'bg-blue-500',
    TE: 'bg-yellow-500',
    K: 'bg-purple-500',
    DEF: 'bg-gray-500',
    DST: 'bg-gray-500',
  }
  return colors[position] || 'bg-gray-500'
}

export function getPositionTextColor(position: string): string {
  const colors: Record<string, string> = {
    QB: 'text-red-400',
    RB: 'text-green-400',
    WR: 'text-blue-400',
    TE: 'text-yellow-400',
    K: 'text-purple-400',
    DEF: 'text-gray-400',
    DST: 'text-gray-400',
  }
  return colors[position] || 'text-gray-400'
}

export function calculateFantasyPoints(stats: any): number {
  const {
    passing_yds = 0,
    passing_td = 0,
    passing_int = 0,
    rushing_yds = 0,
    rushing_td = 0,
    receiving_yds = 0,
    receiving_td = 0,
    receiving_rec = 0,
    fumbles_fl = 0,
  } = stats

  return (
    passing_yds * 0.04 +
    passing_td * 4 -
    passing_int * 1 +
    rushing_yds * 0.1 +
    rushing_td * 6 +
    receiving_yds * 0.1 +
    receiving_td * 6 +
    receiving_rec * 1 -
    fumbles_fl * 2
  )
}

export function getPlayerRank(value: number, allValues: number[]): number {
  const sorted = [...allValues].sort((a, b) => b - a)
  return sorted.indexOf(value) + 1
}

export function getPercentileRank(value: number, allValues: number[]): number {
  const sorted = [...allValues].sort((a, b) => a - b)
  const index = sorted.indexOf(value)
  return (index / (sorted.length - 1)) * 100
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}