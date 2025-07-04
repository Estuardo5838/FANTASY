import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  ComposedChart
} from 'recharts'
import type { Player } from '../../types'

interface PlayerComparisonChartProps {
  players: Player[]
  type?: 'bar' | 'line' | 'area' | 'stacked'
  metric?: 'points' | 'efficiency' | 'consistency' | 'all'
}

export function PlayerComparisonChart({ 
  players, 
  type = 'bar',
  metric = 'all'
}: PlayerComparisonChartProps) {
  if (players.length === 0) return null

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']

  const data = players.map((player, index) => ({
    name: player.name.length > 15 ? player.name.split(' ').pop() : player.name,
    fullName: player.name,
    position: player.position,
    team: player.team,
    fantasy_points: player.total_fantasy_points,
    avg_points: player.avg_fantasy_points,
    predicted_value: player.predicted_value,
    consistency: Math.round((1 / (player.volatility || 1)) * 10),
    efficiency: Math.round(player.total_fantasy_points / (player.games_played || 1)),
    games_played: player.games_played,
    volatility: Math.round(player.volatility * 100),
    color: colors[index % colors.length]
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const playerData = payload[0].payload
      return (
        <div className="glass-effect rounded-lg p-4 border border-gray-600 min-w-[280px]">
          <div className="font-bold text-white mb-2">{playerData.fullName}</div>
          <div className="text-sm text-gray-300 mb-3">{playerData.position} • {playerData.team}</div>
          
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">
                  {entry.dataKey === 'fantasy_points' && 'Fantasy Points:'}
                  {entry.dataKey === 'avg_points' && 'Avg Points:'}
                  {entry.dataKey === 'predicted_value' && 'Predicted Value:'}
                  {entry.dataKey === 'consistency' && 'Consistency:'}
                  {entry.dataKey === 'efficiency' && 'Efficiency:'}
                  {entry.dataKey === 'volatility' && 'Volatility:'}
                </span>
                <span style={{ color: entry.color }} className="font-semibold">
                  {entry.value}
                  {(entry.dataKey === 'volatility') && '%'}
                </span>
              </div>
            ))}
            
            <div className="border-t border-gray-600 pt-2 mt-3">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Games Played:</span>
                <span>{playerData.games_played}</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  if (type === 'stacked') {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="name" 
            stroke="#9CA3AF" 
            fontSize={11}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="#9CA3AF" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          <Bar dataKey="fantasy_points" stackId="a" fill="#3B82F6" name="Fantasy Points" />
          <Bar dataKey="predicted_value" stackId="a" fill="#10B981" name="Predicted Value" />
          <Bar dataKey="consistency" stackId="a" fill="#F59E0B" name="Consistency" />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  if (type === 'area') {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="name" 
            stroke="#9CA3AF" 
            fontSize={11}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="#9CA3AF" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          
          <Area
            type="monotone"
            dataKey="fantasy_points"
            stackId="1"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="predicted_value"
            stackId="1"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    )
  }

  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="name" 
            stroke="#9CA3AF" 
            fontSize={11}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="#9CA3AF" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          <Line
            type="monotone"
            dataKey="fantasy_points"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            name="Fantasy Points"
          />
          <Line
            type="monotone"
            dataKey="predicted_value"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            name="Predicted Value"
          />
          <Line
            type="monotone"
            dataKey="consistency"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }}
            name="Consistency"
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  // Default bar chart
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
        <XAxis 
          dataKey="name" 
          stroke="#9CA3AF" 
          fontSize={11}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis stroke="#9CA3AF" fontSize={12} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        
        {metric === 'all' ? (
          <>
            <Bar dataKey="fantasy_points" fill="#3B82F6" name="Fantasy Points" />
            <Bar dataKey="predicted_value" fill="#10B981" name="Predicted Value" />
            <Bar dataKey="consistency" fill="#F59E0B" name="Consistency" />
          </>
        ) : (
          <Bar 
            dataKey={
              metric === 'points' ? 'fantasy_points' :
              metric === 'efficiency' ? 'efficiency' :
              metric === 'consistency' ? 'consistency' : 'fantasy_points'
            } 
            fill="#3B82F6" 
            name={
              metric === 'points' ? 'Fantasy Points' :
              metric === 'efficiency' ? 'Efficiency' :
              metric === 'consistency' ? 'Consistency' : 'Fantasy Points'
            }
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  )
}