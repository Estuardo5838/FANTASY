import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  Activity,
  Calendar,
  Zap,
  Filter,
  Eye,
  Download,
  Share,
  RefreshCw
} from 'lucide-react'
import { usePlayerData } from '../hooks/usePlayerData'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { LoadingSpinner, SkeletonCard } from '../components/ui/LoadingSpinner'
import { DataStatus } from '../components/ui/DataStatus'
import { FantasyPointsChart } from '../components/charts/FantasyPointsChart'
import { PlayerComparisonChart } from '../components/charts/PlayerComparisonChart'
import { PositionDistributionChart } from '../components/charts/PositionDistributionChart'
import { SeasonComparisonChart } from '../components/charts/SeasonComparisonChart'
import { AdvancedFilters } from '../components/analytics/AdvancedFilters'
import { PlayerStatsCard } from '../components/player/PlayerStatsCard'
import { DataSourceInfo } from '../components/analytics/DataSourceInfo'
import type { Player } from '../types'

export function Analytics() {
  const { 
    players, 
    loading, 
    error, 
    lastUpdated, 
    getAvailablePlayers, 
    getInjuredPlayers,
    isPlayerInjured,
    refetch,
    dataSource
  } = usePlayerData()

  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([])
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([])
  const [activeView, setActiveView] = useState<'overview' | 'comparison' | 'trends' | 'detailed'>('overview')
  const [chartTypes, setChartTypes] = useState({
    performance: 'area' as 'line' | 'area' | 'bar' | 'composed',
    comparison: 'bar' as 'bar' | 'line' | 'area' | 'stacked',
    position: 'bar' as 'bar' | 'line' | 'area',
    season: 'line' as 'line' | 'bar' | 'area' | 'composed'
  })

  // Initialize filtered players
  React.useEffect(() => {
    if (players.length > 0 && filteredPlayers.length === 0) {
      setFilteredPlayers(players)
    }
  }, [players])

  const availablePlayers = getAvailablePlayers()
  const injuredPlayers = getInjuredPlayers()
  
  // Advanced analytics calculations
  const analytics = useMemo(() => {
    if (filteredPlayers.length === 0) return null

    const seasons = [...new Set(filteredPlayers.map(p => p.season || 2024))]
    const positions = [...new Set(filteredPlayers.map(p => p.position))]
    
    // Performance metrics
    const avgPoints = filteredPlayers.reduce((sum, p) => sum + p.total_fantasy_points, 0) / filteredPlayers.length
    const avgVolatility = filteredPlayers.reduce((sum, p) => sum + p.volatility, 0) / filteredPlayers.length
    const avgGames = filteredPlayers.reduce((sum, p) => sum + p.games_played, 0) / filteredPlayers.length
    
    // Top performers
    const topPerformers = [...filteredPlayers]
      .sort((a, b) => b.total_fantasy_points - a.total_fantasy_points)
      .slice(0, 10)
    
    // Most consistent players (lowest volatility)
    const mostConsistent = [...filteredPlayers]
      .sort((a, b) => a.volatility - b.volatility)
      .slice(0, 5)
    
    // Best value players (high predicted value vs current points)
    const bestValue = [...filteredPlayers]
      .filter(p => p.predicted_value > p.total_fantasy_points)
      .sort((a, b) => (b.predicted_value - b.total_fantasy_points) - (a.predicted_value - a.total_fantasy_points))
      .slice(0, 5)
    
    // Position analysis
    const positionAnalysis = positions.map(position => {
      const posPlayers = filteredPlayers.filter(p => p.position === position)
      return {
        position,
        count: posPlayers.length,
        avgPoints: posPlayers.reduce((sum, p) => sum + p.total_fantasy_points, 0) / posPlayers.length,
        topPlayer: posPlayers.sort((a, b) => b.total_fantasy_points - a.total_fantasy_points)[0],
        avgVolatility: posPlayers.reduce((sum, p) => sum + p.volatility, 0) / posPlayers.length
      }
    }).sort((a, b) => b.avgPoints - a.avgPoints)

    return {
      seasons,
      positions,
      avgPoints,
      avgVolatility,
      avgGames,
      topPerformers,
      mostConsistent,
      bestValue,
      positionAnalysis,
      totalPlayers: filteredPlayers.length,
      injuredCount: filteredPlayers.filter(p => isPlayerInjured(p.name)).length
    }
  }, [filteredPlayers, isPlayerInjured])

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

  const addPlayerToComparison = (player: Player) => {
    if (selectedPlayers.length < 6 && !selectedPlayers.find(p => p.name === player.name)) {
      setSelectedPlayers([...selectedPlayers, player])
    }
  }

  const removePlayerFromComparison = (playerName: string) => {
    setSelectedPlayers(selectedPlayers.filter(p => p.name !== playerName))
  }

  const views = [
    { id: 'overview', name: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'comparison', name: 'Comparison', icon: <Users className="w-4 h-4" /> },
    { id: 'trends', name: 'Trends', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'detailed', name: 'Detailed', icon: <Activity className="w-4 h-4" /> }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Advanced Analytics</h1>
          <p className="text-gray-400 mt-2">
            Professional-grade fantasy football statistics and insights
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={refetch}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="secondary" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </motion.div>

      {/* Data Status */}
      <DataSourceInfo
        dataSource={dataSource}
        lastUpdated={lastUpdated}
        loading={loading}
        error={error}
        totalPlayers={players.length}
        onRefresh={refetch}
      />

      {/* Advanced Filters */}
      <AdvancedFilters
        players={players}
        onFilterChange={setFilteredPlayers}
        onFiltersUpdate={() => {}}
      />

      {/* View Navigation */}
      <div className="flex items-center space-x-2 overflow-x-auto">
        {views.map((view) => (
          <Button
            key={view.id}
            variant={activeView === view.id ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveView(view.id as any)}
            className="flex items-center space-x-2 whitespace-nowrap"
          >
            {view.icon}
            <span>{view.name}</span>
          </Button>
        ))}
      </div>

      {/* Analytics Content */}
      {analytics && (
        <>
          {/* Overview Stats */}
          {activeView === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Total Players</p>
                        <p className="text-2xl font-bold text-white">{analytics.totalPlayers}</p>
                        <p className="text-xs text-gray-500">{analytics.seasons.length} seasons</p>
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
                        <p className="text-2xl font-bold text-white">{analytics.avgPoints.toFixed(1)}</p>
                        <p className="text-xs text-gray-500">{analytics.avgGames.toFixed(1)} avg games</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-success-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Avg Volatility</p>
                        <p className="text-2xl font-bold text-white">{(analytics.avgVolatility * 100).toFixed(1)}%</p>
                        <p className="text-xs text-gray-500">Consistency metric</p>
                      </div>
                      <Activity className="w-8 h-8 text-warning-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Positions</p>
                        <p className="text-2xl font-bold text-white">{analytics.positions.length}</p>
                        <p className="text-xs text-gray-500">{analytics.injuredCount} injured</p>
                      </div>
                      <Target className="w-8 h-8 text-secondary-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2" />
                        Top Performers
                      </CardTitle>
                      <div className="flex space-x-1">
                        {['area', 'line', 'bar', 'composed'].map((type) => (
                          <Button
                            key={type}
                            variant={chartTypes.performance === type ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setChartTypes(prev => ({ ...prev, performance: type as any }))}
                            className="text-xs px-2 py-1"
                          >
                            {type}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <FantasyPointsChart 
                      players={analytics.topPerformers} 
                      type={chartTypes.performance}
                      showPredicted={true}
                      showVolatility={chartTypes.performance === 'composed'}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center">
                        <Target className="w-5 h-5 mr-2" />
                        Position Analysis
                      </CardTitle>
                      <div className="flex space-x-1">
                        {['bar', 'line', 'area'].map((type) => (
                          <Button
                            key={type}
                            variant={chartTypes.position === type ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setChartTypes(prev => ({ ...prev, position: type as any }))}
                            className="text-xs px-2 py-1"
                          >
                            {type}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <PositionDistributionChart 
                      players={filteredPlayers} 
                      type={chartTypes.position}
                      metric="avg_points"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Position Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Position Performance Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {analytics.positionAnalysis.map((pos) => (
                      <div key={pos.position} className="glass-effect rounded-lg p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary-400 mb-2">
                            {pos.position}
                          </div>
                          <div className="space-y-2">
                            <div>
                              <div className="text-lg font-semibold text-white">
                                {pos.avgPoints.toFixed(1)}
                              </div>
                              <div className="text-xs text-gray-400">Avg Points</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">
                                {pos.topPlayer?.name}
                              </div>
                              <div className="text-xs text-gray-400">Top Player</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-300">{pos.count} players</div>
                              <div className="text-xs text-gray-400">
                                {(pos.avgVolatility * 100).toFixed(1)}% volatility
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Player Comparison View */}
          {activeView === 'comparison' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center">
                          <Users className="w-5 h-5 mr-2" />
                          Player Comparison ({selectedPlayers.length}/6)
                        </CardTitle>
                        <div className="flex space-x-1">
                          {['bar', 'line', 'area', 'stacked'].map((type) => (
                            <Button
                              key={type}
                              variant={chartTypes.comparison === type ? 'primary' : 'ghost'}
                              size="sm"
                              onClick={() => setChartTypes(prev => ({ ...prev, comparison: type as any }))}
                              className="text-xs px-2 py-1"
                            >
                              {type}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {selectedPlayers.length > 0 ? (
                        <PlayerComparisonChart 
                          players={selectedPlayers} 
                          type={chartTypes.comparison}
                        />
                      ) : (
                        <div className="text-center py-12">
                          <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-white mb-2">No players selected</h3>
                          <p className="text-gray-400">
                            Select up to 6 players from the list to compare their performance
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Selected Players</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedPlayers.map((player) => (
                        <div key={player.name} className="flex items-center justify-between glass-effect rounded-lg p-3">
                          <div>
                            <div className="font-semibold text-white">{player.name}</div>
                            <div className="text-sm text-gray-400">{player.team} • {player.position}</div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removePlayerFromComparison(player.name)}
                            className="text-error-400 hover:text-error-300"
                          >
                            ×
                          </Button>
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

              {/* Player Selection Grid */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Players to Compare</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {analytics.topPerformers.slice(0, 16).map((player) => (
                      <div key={player.name} className="relative">
                        <PlayerStatsCard
                          player={player}
                          onClick={() => addPlayerToComparison(player)}
                          showDetails={false}
                          isInjured={isPlayerInjured(player.name)}
                          animated={true}
                        />
                        {selectedPlayers.find(p => p.name === player.name) && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-success-600 rounded-full flex items-center justify-center">
                            <Eye className="w-4 h-4 text-white" />
                          </div>
                        )}
                        {selectedPlayers.length >= 6 && !selectedPlayers.find(p => p.name === player.name) && (
                          <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">Max 6 players</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Trends View */}
          {activeView === 'trends' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Season Comparison
                    </CardTitle>
                    <div className="flex space-x-1">
                      {['line', 'bar', 'area', 'composed'].map((type) => (
                        <Button
                          key={type}
                          variant={chartTypes.season === type ? 'primary' : 'ghost'}
                          size="sm"
                          onClick={() => setChartTypes(prev => ({ ...prev, season: type as any }))}
                          className="text-xs px-2 py-1"
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <SeasonComparisonChart 
                    players={filteredPlayers} 
                    type={chartTypes.season}
                  />
                </CardContent>
              </Card>

              {/* Trend Analysis Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-success-400">Most Consistent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.mostConsistent.map((player, index) => (
                        <div key={player.name} className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-success-600 flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-white">{player.name}</div>
                            <div className="text-sm text-gray-400">{player.team} • {player.position}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-success-400">{(player.volatility * 100).toFixed(1)}%</div>
                            <div className="text-xs text-gray-400">volatility</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-warning-400">Best Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.bestValue.map((player, index) => (
                        <div key={player.name} className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-warning-600 flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-white">{player.name}</div>
                            <div className="text-sm text-gray-400">{player.team} • {player.position}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-warning-400">
                              +{(player.predicted_value - player.total_fantasy_points).toFixed(1)}
                            </div>
                            <div className="text-xs text-gray-400">upside</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-primary-400">Season Leaders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.topPerformers.slice(0, 5).map((player, index) => (
                        <div key={player.name} className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-white">{player.name}</div>
                            <div className="text-sm text-gray-400">{player.team} • {player.position}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-primary-400">{player.total_fantasy_points.toFixed(1)}</div>
                            <div className="text-xs text-gray-400">points</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Detailed View */}
          {activeView === 'detailed' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPlayers.slice(0, 20).map((player) => (
                  <PlayerStatsCard
                    key={player.name}
                    player={player}
                    isInjured={isPlayerInjured(player.name)}
                    showTrends={true}
                    animated={true}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}