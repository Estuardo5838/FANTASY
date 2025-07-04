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
  AreaChart,
  BarChart,
  Bar,
  ComposedChart
} from 'recharts'
import type { Player } from '../../types'

interface FantasyPointsChartProps {
  players: Player[]
  type?: 'line' | 'area' | 'bar' | 'composed'
  showPredicted?: boolean
  showVolatility?: boolean
}

export function FantasyPointsChart({ 
  players, 
  type = 'area', 
  showPredicted = true,
  showVolatility = false 
}: FantasyPointsChartProps) {
  const data = players.slice(0, 15).map((player, index) => ({
    name: player.name.length > 12 ? player.name.split(' ').pop() : player.name,
    fullName: player.name,
    position: player.position,
    team: player.team,
    points: player.total_fantasy_points,
    avg: player.avg_fantasy_points,
    predicted: player.predicted_value,
    volatility: player.volatility * 100,
    games: player.games_played,
    efficiency: player.total_fantasy_points / (player.games_played || 1),
    consistency: 100 - (player.volatility * 100),
    rank: index + 1
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="glass-effect rounded-lg p-4 border border-gray-600 min-w-[250px]">
          <div className="font-bold text-white mb-2">{data.fullName}</div>
          <div className="text-sm text-gray-300 mb-2">{data.position} • {data.team}</div>
          
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">
                  {entry.dataKey === 'points' && 'Total Points:'}
                  {entry.dataKey === 'avg' && 'Avg Points:'}
                  {entry.dataKey === 'predicted' && 'Predicted:'}
                  {entry.dataKey === 'efficiency' && 'Efficiency:'}
                  {entry.dataKey === 'consistency' && 'Consistency:'}
                  {entry.dataKey === 'volatility' && 'Volatility:'}
                </span>
                <span style={{ color: entry.color }} className="font-semibold">
                  {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
                  {(entry.dataKey === 'volatility' || entry.dataKey === 'consistency') && '%'}
                </span>
              </div>
            ))}
            <div className="border-t border-gray-600 pt-1 mt-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Games:</span>
                <span>{data.games}</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`

  if (type === 'composed') {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
          
          <Bar dataKey="points" fill="#3B82F6" opacity={0.8} radius={[2, 2, 0, 0]} />
          
          {showPredicted && (
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              strokeDasharray="5 5"
            />
          )}
          
          {showVolatility && (
            <Line
              type="monotone"
              dataKey="volatility"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    )
  }

  if (type === 'bar') {
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
          
          <Bar 
            dataKey="points" 
            fill="url(#barGradient)" 
            radius={[4, 4, 0, 0]}
          />
          
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={1}/>
              <stop offset="100%" stopColor="#1E40AF" stopOpacity={0.8}/>
            </linearGradient>
          </defs>
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
            dataKey="points"
            stroke="#3B82F6"
            fill={`url(#${gradientId})`}
            strokeWidth={3}
          />
          
          {showPredicted && (
            <Area
              type="monotone"
              dataKey="predicted"
              stroke="#10B981"
              fill="url(#predictedGradient)"
              strokeWidth={2}
              fillOpacity={0.3}
            />
          )}
          
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    )
  }

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
        
        <Line
          type="monotone"
          dataKey="points"
          stroke="#3B82F6"
          strokeWidth={3}
          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
          activeDot={{ r: 7, stroke: '#3B82F6', strokeWidth: 2 }}
        />
        
        {showPredicted && (
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#10B981"
            strokeWidth={2}
            strokeDasharray="8 4"
            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
          />
        )}
        
        {showVolatility && (
          <Line
            type="monotone"
            dataKey="volatility"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}