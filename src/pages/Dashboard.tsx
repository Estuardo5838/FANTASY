import React from 'react'
import { TrendingUp, Users, Trophy, Target, Activity, BarChart3 } from 'lucide-react'
import { usePlayerData } from '../hooks/usePlayerData'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { LoadingSpinner, SkeletonCard } from '../components/ui/LoadingSpinner'
import { DataStatus } from '../components/ui/DataStatus'
import { InjuryAlert } from '../components/player/InjuryAlert'
import { ReplacementSuggestions } from '../components/player/ReplacementSuggestions'
import { FantasyPointsChart } from '../components/charts/FantasyPointsChart'
import { PositionDistributionChart } from '../components/charts/PositionDistributionChart'
import { formatNumber } from '../lib/utils'
import type { Player } from '../types'

export function Dashboard() {
  const { 
    players, 
    loading, 
    error, 
    lastUpdated, 
    getInjuredPlayers, 
    getAvailablePlayers,
    getReplacementSuggestions,
    refetch 
  } = usePlayerData()
  const [selectedInjuredPlayer, setSelectedInjuredPlayer] = React.useState<Player | null>(null)
  const [showReplacements, setShowReplacements] = React.useState(false)

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
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
  
  const topPlayers = availablePlayers
    .sort((a, b) => b.total_fantasy_points - a.total_fantasy_points)
    .slice(0, 5)

  const topQBs = availablePlayers
    .filter(p => p.position === 'QB')
    .sort((a, b) => b.total_fantasy_points - a.total_fantasy_points)
    .slice(0, 3)

  const topRBs = availablePlayers
    .filter(p => p.position === 'RB')
    .sort((a, b) => b.total_fantasy_points - a.total_fantasy_points)
    .slice(0, 3)

  const topWRs = availablePlayers
    .filter(p => p.position === 'WR')
    .sort((a, b) => b.total_fantasy_points - a.total_fantasy_points)
    .slice(0, 3)

  const stats = {
    totalPlayers: availablePlayers.length,
    avgPoints: availablePlayers.reduce((sum, p) => sum + p.total_fantasy_points, 0) / (availablePlayers.length || 1),
    topPerformer: topPlayers[0],
    positions: [...new Set(availablePlayers.map(p => p.position))].length
  }

  const handleViewReplacements = (player: Player) => {
    setSelectedInjuredPlayer(player)
    setShowReplacements(true)
  }

  const handleSelectReplacement = (replacement: Player) => {
    console.log('Selected replacement:', replacement.name, 'for', selectedInjuredPlayer?.name)
    setShowReplacements(false)
    setSelectedInjuredPlayer(null)
  }

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

      {/* Injury Alert */}
      {injuredPlayers.length > 0 && (
        <InjuryAlert
          injuredPlayers={injuredPlayers}
          onViewReplacements={handleViewReplacements}
        />
      )}

      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Welcome to Fantasy Glitch
        </h1>
        <p className="text-gray-400 text-lg">
          Your complete fantasy football analytics platform
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Players</p>
                <p className="text-2xl font-bold text-white">{formatNumber(stats.totalPlayers)}</p>
              </div>
              <Users className="w-8 h-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Fantasy Points</p>
                <p className="text-2xl font-bold text-white">{stats.avgPoints.toFixed(1)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-success-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Top Performer</p>
                <p className="text-lg font-bold text-white">{stats.topPerformer?.name || 'N/A'}</p>
                <p className="text-sm text-primary-400">
                  {stats.topPerformer?.total_fantasy_points.toFixed(1)} pts
                </p>
              </div>
              <Trophy className="w-8 h-8 text-warning-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Positions</p>
                <p className="text-2xl font-bold text-white">{stats.positions}</p>
              </div>
              <Target className="w-8 h-8 text-secondary-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FantasyPointsChart players={topPlayers} type="area" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Position Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PositionDistributionChart players={players} />
          </CardContent>
        </Card>
      </div>

      {/* Top Players by Position */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top QBs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-400">Top Quarterbacks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topQBs.map((player, index) => (
                <div key={player.name} className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">{player.name}</div>
                    <div className="text-sm text-gray-400">{player.team}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">{player.total_fantasy_points.toFixed(1)}</div>
                    <div className="text-xs text-gray-400">pts</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top RBs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-400">Top Running Backs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRBs.map((player, index) => (
                <div key={player.name} className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">{player.name}</div>
                    <div className="text-sm text-gray-400">{player.team}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">{player.total_fantasy_points.toFixed(1)}</div>
                    <div className="text-xs text-gray-400">pts</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top WRs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-400">Top Wide Receivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topWRs.map((player, index) => (
                <div key={player.name} className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">{player.name}</div>
                    <div className="text-sm text-gray-400">{player.team}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">{player.total_fantasy_points.toFixed(1)}</div>
                    <div className="text-xs text-gray-400">pts</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <button className="p-4 glass-effect rounded-lg hover:bg-primary-600/20 transition-colors text-left">
              <TrendingUp className="w-6 h-6 text-primary-500 mb-2" />
              <div className="font-semibold text-white">Analytics</div>
              <div className="text-sm text-gray-400">Player insights</div>
            </button>
            <button className="p-4 glass-effect rounded-lg hover:bg-success-600/20 transition-colors text-left">
              <Users className="w-6 h-6 text-success-500 mb-2" />
              <div className="font-semibold text-white">Trade Center</div>
              <div className="text-sm text-gray-400">Find trades</div>
            </button>
            <button className="p-4 glass-effect rounded-lg hover:bg-warning-600/20 transition-colors text-left">
              <Trophy className="w-6 h-6 text-warning-500 mb-2" />
              <div className="font-semibold text-white">Draft Assistant</div>
              <div className="text-sm text-gray-400">Draft help</div>
            </button>
            <button className="p-4 glass-effect rounded-lg hover:bg-secondary-600/20 transition-colors text-left">
              <Target className="w-6 h-6 text-secondary-500 mb-2" />
              <div className="font-semibold text-white">My Team</div>
              <div className="text-sm text-gray-400">Manage roster</div>
            </button>
            <button className="p-4 glass-effect rounded-lg hover:bg-purple-600/20 transition-colors text-left">
              <BarChart3 className="w-6 h-6 text-purple-500 mb-2" />
              <div className="font-semibold text-white">Players</div>
              <div className="text-sm text-gray-400">Player database</div>
            </button>
            <button className="p-4 glass-effect rounded-lg hover:bg-cyan-600/20 transition-colors text-left">
              <Activity className="w-6 h-6 text-cyan-500 mb-2" />
              <div className="font-semibold text-white">Live Data</div>
              <div className="text-sm text-gray-400">Real-time updates</div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Replacement Suggestions Modal */}
      {showReplacements && selectedInjuredPlayer && (
        <ReplacementSuggestions
          injuredPlayer={selectedInjuredPlayer}
          suggestions={getReplacementSuggestions(selectedInjuredPlayer.name)}
          onSelectReplacement={handleSelectReplacement}
          onClose={() => {
            setShowReplacements(false)
            setSelectedInjuredPlayer(null)
          }}
        />
      )}
    </div>
  )
}