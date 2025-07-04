import React, { useState } from 'react'
import { Search, Filter, BarChart3 } from 'lucide-react'
import { usePlayerData } from '../hooks/usePlayerData'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { LoadingSpinner, SkeletonCard } from '../components/ui/LoadingSpinner'
import { DataStatus } from '../components/ui/DataStatus'
import { PlayerCard } from '../components/player/PlayerCard'
import { PlayerSearch } from '../components/player/PlayerSearch'
import { PositionDistributionChart } from '../components/charts/PositionDistributionChart'
import type { Player } from '../types'
import React from 'react'

export function Players() {
  const { 
    players, 
    loading, 
    error, 
    lastUpdated, 
    getAvailablePlayers, 
    getInjuredPlayers, 
    isPlayerInjured,
    refetch 
  } = usePlayerData()
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([])
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [showInjuredOnly, setShowInjuredOnly] = useState(false)

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SkeletonCard />
          </div>
          <SkeletonCard />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  const availablePlayers = getAvailablePlayers()
  const injuredPlayers = getInjuredPlayers()
  
  const basePlayerList = showInjuredOnly ? injuredPlayers : players
  const displayedPlayers = filteredPlayers.length > 0 ? filteredPlayers : basePlayerList

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-white">Player Database</h1>
          <p className="text-gray-400 mt-2">
            Comprehensive analytics for {players.length} active players
          </p>
        </div>
        <div className="flex items-center space-x-2 text-gray-400">
          <BarChart3 className="w-5 h-5" />
          <span>Advanced Analytics</span>
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => setShowInjuredOnly(!showInjuredOnly)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                showInjuredOnly 
                  ? 'bg-error-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {showInjuredOnly ? 'Showing Injured' : 'Show Injured Only'}
            </button>
            {injuredPlayers.length > 0 && (
              <Badge variant="error" size="sm">
                {injuredPlayers.length} injured
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Data Status */}
      <DataStatus
        loading={loading}
        error={error}
        lastUpdated={lastUpdated}
        onRefresh={refetch}
        totalPlayers={players.length}
        injuredCount={injuredPlayers.length}
      />

      {/* Search and Filters */}
      <PlayerSearch 
        players={basePlayerList} 
        onFilteredPlayersChange={setFilteredPlayers}
      />

      {/* Overview Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Position Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <PositionDistributionChart players={displayedPlayers} />
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Players</span>
                <span className="font-bold text-white">{displayedPlayers.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Avg Fantasy Points</span>
                <span className="font-bold text-white">
                  {displayedPlayers.length > 0 
                    ? (displayedPlayers.reduce((sum, p) => sum + p.total_fantasy_points, 0) / displayedPlayers.length).toFixed(1)
                    : '0.0'
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Top Performer</span>
                <span className="font-bold text-primary-400">
                  {displayedPlayers.sort((a, b) => b.total_fantasy_points - a.total_fantasy_points)[0]?.name || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Positions</span>
                <span className="font-bold text-white">
                  {[...new Set(displayedPlayers.map(p => p.position))].length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Player Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedPlayers.map((player) => (
          <div key={player.name} className="relative">
            <PlayerCard
              player={player}
              onClick={() => setSelectedPlayer(player)}
            />
            {isPlayerInjured(player.name) && (
              <div className="absolute top-2 right-2">
                <Badge variant="error" size="sm">
                  Injured
                </Badge>
              </div>
            )}
          </div>
        ))}
      </div>

      {displayedPlayers.length === 0 && (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No players found</h3>
              <p className="text-gray-400">
                Try adjusting your search criteria or filters
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{selectedPlayer.name}</CardTitle>
                    <p className="text-gray-400">{selectedPlayer.team} • {selectedPlayer.position}</p>
                  </div>
                  <button
                    onClick={() => setSelectedPlayer(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Key Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-400">
                        {selectedPlayer.total_fantasy_points.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-400">Total Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary-400">
                        {selectedPlayer.avg_fantasy_points.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-400">Avg Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success-400">
                        {selectedPlayer.predicted_value.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-400">Predicted Value</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-warning-400">
                        {(selectedPlayer.volatility * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-400">Volatility</div>
                    </div>
                    {isPlayerInjured(selectedPlayer.name) && (
                      <div className="text-center">
                        <Badge variant="error" size="lg">
                          INJURED
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Detailed Stats */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Season Statistics</h4>
                    
                    {selectedPlayer.position === 'QB' && (
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-lg font-bold text-white">
                            {selectedPlayer.passing_yds_sum?.toLocaleString() || 0}
                          </div>
                          <div className="text-sm text-gray-400">Passing Yards</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white">
                            {selectedPlayer.passing_td_sum || 0}
                          </div>
                          <div className="text-sm text-gray-400">Passing TDs</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-error-400">
                            {selectedPlayer.passing_int_sum || 0}
                          </div>
                          <div className="text-sm text-gray-400">Interceptions</div>
                        </div>
                      </div>
                    )}

                    {selectedPlayer.position === 'RB' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-lg font-bold text-white">
                            {selectedPlayer.rushing_yds_sum?.toLocaleString() || 0}
                          </div>
                          <div className="text-sm text-gray-400">Rushing Yards</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white">
                            {selectedPlayer.rushing_td_sum || 0}
                          </div>
                          <div className="text-sm text-gray-400">Rushing TDs</div>
                        </div>
                      </div>
                    )}

                    {['WR', 'TE'].includes(selectedPlayer.position) && (
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-lg font-bold text-white">
                            {selectedPlayer.receiving_yds_sum?.toLocaleString() || 0}
                          </div>
                          <div className="text-sm text-gray-400">Receiving Yards</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white">
                            {selectedPlayer.receiving_td_sum || 0}
                          </div>
                          <div className="text-sm text-gray-400">Receiving TDs</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white">
                            {selectedPlayer.receiving_rec_sum || 0}
                          </div>
                          <div className="text-sm text-gray-400">Receptions</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Games Played */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                    <span className="text-gray-400">Games Played</span>
                    <span className="font-bold text-white">{selectedPlayer.games_played}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}