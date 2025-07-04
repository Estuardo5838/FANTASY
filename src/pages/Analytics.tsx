import React, { useState } from 'react'
import { BarChart3, TrendingUp, Users, Target, Plus, X } from 'lucide-react'
import { usePlayerData } from '../hooks/usePlayerData'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Select } from '../components/ui/Input'
import { LoadingSpinner, SkeletonCard } from '../components/ui/LoadingSpinner'
import { DataStatus } from '../components/ui/DataStatus'
import { FantasyPointsChart } from '../components/charts/FantasyPointsChart'
import { PlayerComparisonChart } from '../components/charts/PlayerComparisonChart'
import { PositionDistributionChart } from '../components/charts/PositionDistributionChart'
import { PlayerCard } from '../components/player/PlayerCard'
import type { Player } from '../types'
import React from 'react'

export function Analytics() {
  const { 
    players, 
    loading, 
    error, 
    lastUpdated, 
    getAvailablePlayers, 
    getInjuredPlayers,
    refetch 
  } = usePlayerData()
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([])
  const [comparisonType, setComparisonType] = useState<'radar' | 'bar'>('radar')
  const [chartType, setChartType] = useState<'line' | 'area'>('area')
  const [selectedPosition, setSelectedPosition] = useState('')

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  const availablePlayers = getAvailablePlayers()
  const injuredPlayers = getInjuredPlayers()
  const positions = [...new Set(players.map(p => p.position))].sort()
  const filteredPlayers = selectedPosition 
    ? availablePlayers.filter(p => p.position === selectedPosition)
    : availablePlayers

  const topPerformers = filteredPlayers
    .sort((a, b) => b.total_fantasy_points - a.total_fantasy_points)
    .slice(0, 10)

  const addPlayerToComparison = (player: Player) => {
    if (selectedPlayers.length < 5 && !selectedPlayers.find(p => p.name === player.name)) {
      setSelectedPlayers([...selectedPlayers, player])
    }
  }

  const removePlayerFromComparison = (playerName: string) => {
    setSelectedPlayers(selectedPlayers.filter(p => p.name !== playerName))
  }

  const getPositionStats = () => {
    const stats = positions.map(position => {
      const positionPlayers = availablePlayers.filter(p => p.position === position)
      return {
        position,
        count: positionPlayers.length,
        avgPoints: positionPlayers.reduce((sum, p) => sum + p.total_fantasy_points, 0) / positionPlayers.length,
        topPlayer: positionPlayers.sort((a, b) => b.total_fantasy_points - a.total_fantasy_points)[0]
      }
    })
    return stats.sort((a, b) => b.avgPoints - a.avgPoints)
  }

  const positionStats = getPositionStats()

  return (
    <div className="space-y-8">
      {/* Data Status */}
      <DataStatus
        loading={loading}
        error={error}
        lastUpdated={lastUpdated}
        onRefresh={refetch}
        totalPlayers={players.length}
        injuredCount={injuredPlayers.length}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-white">Advanced Analytics</h1>
          <p className="text-gray-400 mt-2">
            Deep insights and player comparisons
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
          >
            <option value="">All Positions</option>
            {positions.map(position => (
              <option key={position} value={position}>{position}</option>
            ))}
          </Select>
        </div>
      </div>

      {/* Overview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Top Performers
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant={chartType === 'line' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setChartType('line')}
                >
                  Line
                </Button>
                <Button
                  variant={chartType === 'area' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setChartType('area')}
                >
                  Area
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <FantasyPointsChart players={topPerformers} type={chartType} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Position Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PositionDistributionChart players={filteredPlayers} />
          </CardContent>
        </Card>
      </div>

      {/* Position Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Position Performance Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {positionStats.map((stat) => (
              <div key={stat.position} className="glass-effect rounded-lg p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-400 mb-2">
                    {stat.position}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-lg font-semibold text-white">
                        {stat.avgPoints.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-400">Avg Points</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {stat.topPlayer?.name}
                      </div>
                      <div className="text-xs text-gray-400">Top Player</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-300">{stat.count} players</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Player Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Player Comparison
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant={comparisonType === 'radar' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setComparisonType('radar')}
                  >
                    Radar
                  </Button>
                  <Button
                    variant={comparisonType === 'bar' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setComparisonType('bar')}
                  >
                    Bar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedPlayers.length > 0 ? (
                <PlayerComparisonChart players={selectedPlayers} type={comparisonType} />
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No players selected</h3>
                  <p className="text-gray-400">
                    Select players from the list to compare their performance
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Selected Players ({selectedPlayers.length}/5)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedPlayers.map((player) => (
                <div key={player.name} className="flex items-center justify-between glass-effect rounded-lg p-3">
                  <div>
                    <div className="font-semibold text-white">{player.name}</div>
                    <div className="text-sm text-gray-400">{player.team} • {player.position}</div>
                  </div>
                  <button
                    onClick={() => removePlayerFromComparison(player.name)}
                    className="text-error-400 hover:text-error-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {selectedPlayers.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">
                    Click on players below to add them for comparison
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Player Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Players to Compare</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {topPerformers.slice(0, 12).map((player) => (
              <div key={player.name} className="relative">
                <PlayerCard
                  player={player}
                  onClick={() => addPlayerToComparison(player)}
                  showDetails={false}
                />
                {selectedPlayers.find(p => p.name === player.name) && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-success-600 rounded-full flex items-center justify-center">
                    <Plus className="w-4 h-4 text-white rotate-45" />
                  </div>
                )}
                {selectedPlayers.length >= 5 && !selectedPlayers.find(p => p.name === player.name) && (
                  <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">Max 5 players</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}