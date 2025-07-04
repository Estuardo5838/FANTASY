import React from 'react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'
import type { Player } from '../../types'

interface PlayerComparisonChartProps {
  players: Player[]
  type?: 'radar' | 'bar'
}

export function PlayerComparisonChart({ players, type = 'radar' }: PlayerComparisonChartProps) {
  if (players.length === 0) return null

  const normalizeValue = (value: number, max: number) => {
    return Math.min((value / max) * 100, 100)
  }

  const maxValues = {
    fantasy_points: Math.max(...players.map(p => p.total_fantasy_points)),
    consistency: Math.max(...players.map(p => 1 / (p.volatility || 1))),
    predicted_value: Math.max(...players.map(p => p.predicted_value)),
    games_played: 17, // Max games in a season
  }

  if (type === 'radar') {
    const radarData = [
      {
        subject: 'Fantasy Points',
        ...players.reduce((acc, player, index) => {
          acc[`player${index}`] = normalizeValue(player.total_fantasy_points, maxValues.fantasy_points)
          return acc
        }, {} as any)
      },
      {
        subject: 'Consistency',
        ...players.reduce((acc, player, index) => {
          acc[`player${index}`] = normalizeValue(1 / (player.volatility || 1), maxValues.consistency)
          return acc
        }, {} as any)
      },
      {
        subject: 'Predicted Value',
        ...players.reduce((acc, player, index) => {
          acc[`player${index}`] = normalizeValue(player.predicted_value, maxValues.predicted_value)
          return acc
        }, {} as any)
      },
      {
        subject: 'Games Played',
        ...players.reduce((acc, player, index) => {
          acc[`player${index}`] = normalizeValue(player.games_played, maxValues.games_played)
          return acc
        }, {} as any)
      },
    ]

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

    return (
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={{ fill: '#9CA3AF', fontSize: 10 }}
          />
          {players.map((player, index) => (
            <Radar
              key={player.name}
              name={player.name}
              dataKey={`player${index}`}
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
              fillOpacity={0.1}
              strokeWidth={2}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    )
  }

  const barData = players.map(player => ({
    name: player.name.split(' ').pop(),
    fantasy_points: player.total_fantasy_points,
    predicted_value: player.predicted_value,
    consistency: 1 / (player.volatility || 1) * 10, // Scale for visibility
  }))

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={barData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
        <YAxis stroke="#9CA3AF" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(17, 24, 39, 0.95)',
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#fff'
          }}
        />
        <Legend />
        <Bar dataKey="fantasy_points" fill="#3B82F6" name="Fantasy Points" />
        <Bar dataKey="predicted_value" fill="#10B981" name="Predicted Value" />
        <Bar dataKey="consistency" fill="#F59E0B" name="Consistency" />
      </BarChart>
    </ResponsiveContainer>
  )
}