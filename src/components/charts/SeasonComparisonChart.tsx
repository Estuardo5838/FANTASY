import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts'
import type { Player } from '../../types'

interface SeasonComparisonChartProps {
  players: Player[]
  type?: 'line' | 'bar' | 'area' | 'composed'
}

export function SeasonComparisonChart({ players, type = 'line' }: SeasonComparisonChartProps) {
  // Group players by season and calculate aggregated stats
  const seasonData = players.reduce((acc, player) => {
    const season = player.season || 2024
    if (!acc[season]) {
      acc[season] = {
        season,
        players: [],
        total_points: 0,
        avg_points: 0,
        total_players: 0,
        qb_avg: 0,
        rb_avg: 0,
        wr_avg: 0,
        te_avg: 0
      }
    }
    
    acc[season].players.push(player)
    acc[season].total_points += player.total_fantasy_points
    acc[season].total_players += 1
    
    return acc
  }, {} as Record<number, any>)

  // Calculate averages and position-specific stats
  const data = Object.values(seasonData).map((season: any) => {
    const qbs = season.players.filter((p: Player) => p.position === 'QB')
    const rbs = season.players.filter((p: Player) => p.position === 'RB')
    const wrs = season.players.filter((p: Player) => p.position === 'WR')
    const tes = season.players.filter((p: Player) => p.position === 'TE')
    
    return {
      season: season.season.toString(),
      total_points: season.total_points,
      avg_points: season.total_points / season.total_players,
      total_players: season.total_players,
      qb_avg: qbs.length > 0 ? qbs.reduce((sum: number, p: Player) => sum + p.total_fantasy_points, 0) / qbs.length : 0,
      rb_avg: rbs.length > 0 ? rbs.reduce((sum: number, p: Player) => sum + p.total_fantasy_points, 0) / rbs.length : 0,
      wr_avg: wrs.length > 0 ? wrs.reduce((sum: number, p: Player) => sum + p.total_fantasy_points, 0) / wrs.length : 0,
      te_avg: tes.length > 0 ? tes.reduce((sum: number, p: Player) => sum + p.total_fantasy_points, 0) / tes.length : 0,
      qb_count: qbs.length,
      rb_count: rbs.length,
      wr_count: wrs.length,
      te_count: tes.length,
      top_scorer: season.players.sort((a: Player, b: Player) => b.total_fantasy_points - a.total_fantasy_points)[0]
    }
  }).sort((a, b) => parseInt(a.season) - parseInt(b.season))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="glass-effect rounded-lg p-4 border border-gray-600 min-w-[280px]">
          <div className="font-bold text-white mb-2">{label} Season</div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Players:</span>
              <span className="text-white font-semibold">{data.total_players}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Avg Points:</span>
              <span className="text-white font-semibold">{data.avg_points.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Points:</span>
              <span className="text-white font-semibold">{data.total_points.toFixed(0)}</span>
            </div>
            
            <div className="border-t border-gray-600 pt-2 mt-2">
              <div className="text-sm text-gray-300 mb-2">Position Averages:</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-red-400">QB:</span>
                  <span className="text-white">{data.qb_avg.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-400">RB:</span>
                  <span className="text-white">{data.rb_avg.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-400">WR:</span>
                  <span className="text-white">{data.wr_avg.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-400">TE:</span>
                  <span className="text-white">{data.te_avg.toFixed(1)}</span>
                </div>
              </div>
            </div>
            
            {data.top_scorer && (
              <div className="border-t border-gray-600 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Top Scorer:</span>
                  <span className="text-primary-400 font-semibold">{data.top_scorer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Points:</span>
                  <span className="text-white">{data.top_scorer.total_fantasy_points.toFixed(1)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  if (type === 'composed') {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="season" stroke="#9CA3AF" fontSize={12} />
          <YAxis stroke="#9CA3AF" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          
          <Bar dataKey="total_players" fill="#374151" opacity={0.3} />
          <Line
            type="monotone"
            dataKey="avg_points"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    )
  }

  if (type === 'area') {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="season" stroke="#9CA3AF" fontSize={12} />
          <YAxis stroke="#9CA3AF" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          
          <Area
            type="monotone"
            dataKey="qb_avg"
            stackId="1"
            stroke="#EF4444"
            fill="#EF4444"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="rb_avg"
            stackId="1"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="wr_avg"
            stackId="1"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="te_avg"
            stackId="1"
            stroke="#F59E0B"
            fill="#F59E0B"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    )
  }

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="season" stroke="#9CA3AF" fontSize={12} />
          <YAxis stroke="#9CA3AF" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          
          <Bar dataKey="qb_avg" fill="#EF4444" name="QB Avg" />
          <Bar dataKey="rb_avg" fill="#10B981" name="RB Avg" />
          <Bar dataKey="wr_avg" fill="#3B82F6" name="WR Avg" />
          <Bar dataKey="te_avg" fill="#F59E0B" name="TE Avg" />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
        <XAxis dataKey="season" stroke="#9CA3AF" fontSize={12} />
        <YAxis stroke="#9CA3AF" fontSize={12} />
        <Tooltip content={<CustomTooltip />} />
        
        <Line
          type="monotone"
          dataKey="qb_avg"
          stroke="#EF4444"
          strokeWidth={3}
          dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
          name="QB Average"
        />
        <Line
          type="monotone"
          dataKey="rb_avg"
          stroke="#10B981"
          strokeWidth={3}
          dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
          name="RB Average"
        />
        <Line
          type="monotone"
          dataKey="wr_avg"
          stroke="#3B82F6"
          strokeWidth={3}
          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
          name="WR Average"
        />
        <Line
          type="monotone"
          dataKey="te_avg"
          stroke="#F59E0B"
          strokeWidth={3}
          dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
          name="TE Average"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}