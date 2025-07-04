import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'
import type { Player } from '../../types'

interface FantasyPointsChartProps {
  players: Player[]
  type?: 'line' | 'area'
}

export function FantasyPointsChart({ players, type = 'line' }: FantasyPointsChartProps) {
  const data = players.slice(0, 10).map((player, index) => ({
    name: player.name.split(' ').pop(), // Last name only for space
    points: player.total_fantasy_points,
    avg: player.avg_fantasy_points,
    predicted: player.predicted_value,
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-effect rounded-lg p-3 border border-gray-600">
          <p className="text-white font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey === 'points' && 'Total Points: '}
              {entry.dataKey === 'avg' && 'Avg Points: '}
              {entry.dataKey === 'predicted' && 'Predicted Value: '}
              {entry.value.toFixed(1)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (type === 'area') {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="name" 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis stroke="#9CA3AF" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="points"
            stroke="#3B82F6"
            fill="url(#colorPoints)"
            strokeWidth={2}
          />
          <defs>
            <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="name" 
          stroke="#9CA3AF"
          fontSize={12}
        />
        <YAxis stroke="#9CA3AF" fontSize={12} />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="points"
          stroke="#3B82F6"
          strokeWidth={3}
          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="predicted"
          stroke="#10B981"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}