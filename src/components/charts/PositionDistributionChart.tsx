import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts'
import type { Player } from '../../types'

interface PositionDistributionChartProps {
  players: Player[]
  type?: 'bar' | 'line' | 'area'
  metric?: 'count' | 'avg_points' | 'total_points'
}

export function PositionDistributionChart({ 
  players, 
  type = 'bar',
  metric = 'count'
}: PositionDistributionChartProps) {
  const positionStats = players.reduce((acc, player) => {
    if (!acc[player.position]) {
      acc[player.position] = {
        position: player.position,
        count: 0,
        total_points: 0,
        players: []
      }
    }
    
    acc[player.position].count += 1
    acc[player.position].total_points += player.total_fantasy_points
    acc[player.position].players.push(player)
    
    return acc
  }, {} as Record<string, any>)

  const data = Object.values(positionStats).map((stat: any) => ({
    position: stat.position,
    count: stat.count,
    avg_points: stat.total_points / stat.count,
    total_points: stat.total_points,
    percentage: ((stat.count / players.length) * 100).toFixed(1),
    top_player: stat.players.sort((a: Player, b: Player) => b.total_fantasy_points - a.total_fantasy_points)[0]?.name,
    efficiency: stat.total_points / stat.count / 17 // Points per game average
  })).sort((a, b) => {
    const order = ['QB', 'RB', 'WR', 'TE', 'K', 'DEF', 'DST']
    return order.indexOf(a.position) - order.indexOf(b.position)
  })

  const COLORS = {
    QB: '#EF4444',
    RB: '#10B981', 
    WR: '#3B82F6',
    TE: '#F59E0B',
    K: '#8B5CF6',
    DEF: '#6B7280',
    DST: '#6B7280',
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="glass-effect rounded-lg p-4 border border-gray-600 min-w-[250px]">
          <div className="font-bold text-white mb-2">{data.position} Position</div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Players:</span>
              <span className="text-white font-semibold">{data.count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Percentage:</span>
              <span className="text-white font-semibold">{data.percentage}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Avg Points:</span>
              <span className="text-white font-semibold">{data.avg_points.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Points:</span>
              <span className="text-white font-semibold">{data.total_points.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Efficiency:</span>
              <span className="text-white font-semibold">{data.efficiency.toFixed(1)}</span>
            </div>
            
            {data.top_player && (
              <div className="border-t border-gray-600 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Top Player:</span>
                  <span className="text-primary-400 font-semibold">{data.top_player}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  const getBarColor = (position: string) => {
    return COLORS[position as keyof typeof COLORS] || '#6B7280'
  }

  if (type === 'area') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="position" stroke="#9CA3AF" fontSize={12} />
          <YAxis stroke="#9CA3AF" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          
          <Area
            type="monotone"
            dataKey={metric === 'count' ? 'count' : metric === 'avg_points' ? 'avg_points' : 'total_points'}
            stroke="#3B82F6"
            fill="url(#positionGradient)"
            strokeWidth={3}
          />
          
          <defs>
            <linearGradient id="positionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    )
  }

  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="position" stroke="#9CA3AF" fontSize={12} />
          <YAxis stroke="#9CA3AF" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          
          <Line
            type="monotone"
            dataKey={metric === 'count' ? 'count' : metric === 'avg_points' ? 'avg_points' : 'total_points'}
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
        <XAxis dataKey="position" stroke="#9CA3AF" fontSize={12} />
        <YAxis stroke="#9CA3AF" fontSize={12} />
        <Tooltip content={<CustomTooltip />} />
        
        <Bar 
          dataKey={metric === 'count' ? 'count' : metric === 'avg_points' ? 'avg_points' : 'total_points'}
          fill="#3B82F6"
          radius={[4, 4, 0, 0]}
        >
          {data.map((entry, index) => (
            <Bar key={`cell-${index}`} fill={getBarColor(entry.position)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}