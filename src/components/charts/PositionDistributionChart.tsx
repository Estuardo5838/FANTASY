import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts'
import type { Player } from '../../types'

interface PositionDistributionChartProps {
  players: Player[]
  type?: 'pie' | 'bar'
}

export function PositionDistributionChart({ players, type = 'pie' }: PositionDistributionChartProps) {
  const positionCounts = players.reduce((acc, player) => {
    acc[player.position] = (acc[player.position] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const data = Object.entries(positionCounts).map(([position, count]) => ({
    position,
    count,
    percentage: ((count / players.length) * 100).toFixed(1)
  }))

  const COLORS = {
    QB: '#EF4444',
    RB: '#10B981',
    WR: '#3B82F6',
    TE: '#F59E0B',
    K: '#8B5CF6',
    DEF: '#6B7280',
    DST: '#6B7280',
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="glass-effect rounded-lg p-3 border border-gray-600">
          <p className="text-white font-semibold">{data.position}</p>
          <p className="text-gray-300">Count: {data.count}</p>
          <p className="text-gray-300">Percentage: {data.percentage}%</p>
        </div>
      )
    }
    return null
  }

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="position" stroke="#9CA3AF" fontSize={12} />
          <YAxis stroke="#9CA3AF" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ position, percentage }) => `${position} (${percentage}%)`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="count"
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[entry.position as keyof typeof COLORS] || '#6B7280'} 
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ color: '#9CA3AF' }}
          formatter={(value, entry) => (
            <span style={{ color: entry.color }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}