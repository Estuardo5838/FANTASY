import React, { useState } from 'react'
import { Users, Plus, Trash2, Star, TrendingUp, Settings } from 'lucide-react'
import { usePlayerData } from '../hooks/usePlayerData'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input, Select } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { LoadingSpinner, SkeletonCard } from '../components/ui/LoadingSpinner'
import { PlayerCard } from '../components/player/PlayerCard'
import type { Player } from '../types'

export function TeamManagement() {
  const { 
    players, 
    loading, 
    error, 
    lastUpdated, 
    getAvailablePlayers, 
    getInjuredPlayers, 
    isPlayerInjured,
    getReplacementSuggestions,
    refetch 
  } = usePlayerData()
  const [myRoster, setMyRoster] = useState<Player[]>([])
  const [teamName, setTeamName] = useState('My Fantasy Team')
  const [selectedPosition, setSelectedPosition] = useState('')
  const [showAddPlayer, setShowAddPlayer] = useState(false)
  const [showInjuryAlert, setShowInjuryAlert] = useState(false)

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  const addPlayerToRoster = (player: Player) => {
    if (!myRoster.find(p => p.name === player.name)) {
      setMyRoster([...myRoster, player])
      setShowAddPlayer(false)
    }
  }

  const removePlayerFromRoster = (playerName: string) => {
    setMyRoster(myRoster.filter(p => p.name !== playerName))
  }
  
  const getInjuredRosterPlayers = () => {
    return myRoster.filter(player => isPlayerInjured(player.name))
  }

  const getPositionPlayers = (position: string) => {
    return myRoster.filter(p => p.position === position)
  }

  const getTeamStats = () => {
    if (myRoster.length === 0) return { totalPoints: 0, avgPoints: 0, topPlayer: null }
    
    const totalPoints = myRoster.reduce((sum, p) => sum + p.total_fantasy_points, 0)
    const avgPoints = totalPoints / myRoster.length
    const topPlayer = myRoster.sort((a, b) => b.total_fantasy_points - a.total_fantasy_points)[0]
    
    return { totalPoints, avgPoints, topPlayer }
  }

  const getOptimalLineup = () => {
    const lineup = {
      QB: getPositionPlayers('QB').sort((a, b) => b.avg_fantasy_points - a.avg_fantasy_points)[0],
      RB1: getPositionPlayers('RB').sort((a, b) => b.avg_fantasy_points - a.avg_fantasy_points)[0],
      RB2: getPositionPlayers('RB').sort((a, b) => b.avg_fantasy_points - a.avg_fantasy_points)[1],
      WR1: getPositionPlayers('WR').sort((a, b) => b.avg_fantasy_points - a.avg_fantasy_points)[0],
      WR2: getPositionPlayers('WR').sort((a, b) => b.avg_fantasy_points - a.avg_fantasy_points)[1],
      TE: getPositionPlayers('TE').sort((a, b) => b.avg_fantasy_points - a.avg_fantasy_points)[0],
      FLEX: [...getPositionPlayers('RB'), ...getPositionPlayers('WR'), ...getPositionPlayers('TE')]
        .filter(p => p !== lineup.RB1 && p !== lineup.RB2 && p !== lineup.WR1 && p !== lineup.WR2 && p !== lineup.TE)
        .sort((a, b) => b.avg_fantasy_points - a.avg_fantasy_points)[0]
    }
    return lineup
  }

  const availablePlayers = getAvailablePlayers().filter(p => !myRoster.find(r => r.name === p.name))
  const injuredPlayers = getInjuredPlayers()
  const injuredRosterPlayers = getInjuredRosterPlayers()
  
  const filteredAvailable = selectedPosition 
    ? availablePlayers.filter(p => p.position === selectedPosition)
    : availablePlayers

  const teamStats = getTeamStats()
  const optimalLineup = getOptimalLineup()
  const positions = ['QB', 'RB', 'WR', 'TE']

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

      {/* Injury Alert for Roster */}
      {injuredRosterPlayers.length > 0 && (
        <InjuryAlert
          injuredPlayers={injuredRosterPlayers}
          onViewReplacements={(player) => {
            // Auto-suggest replacements for injured roster players
            console.log('Finding replacements for injured roster player:', player.name)
          }}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-white">Team Management</h1>
          <p className="text-gray-400 mt-2">
            Build and optimize your fantasy roster
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Input
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-48"
            placeholder="Team name"
          />
          <Button
            onClick={() => setShowAddPlayer(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Player</span>
          </Button>
        </div>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Roster Size</p>
                <p className="text-2xl font-bold text-white">{myRoster.length}</p>
              </div>
              <Users className="w-8 h-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Points</p>
                <p className="text-2xl font-bold text-white">{teamStats.totalPoints.toFixed(1)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-success-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Points</p>
                <p className="text-2xl font-bold text-white">{teamStats.avgPoints.toFixed(1)}</p>
              </div>
              <Star className="w-8 h-8 text-warning-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Top Player</p>
                <p className="text-lg font-bold text-white">
                  {teamStats.topPlayer?.name.split(' ').pop() || 'None'}
                </p>
              </div>
              <Settings className="w-8 h-8 text-secondary-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optimal Lineup */}
      <Card>
        <CardHeader>
          <CardTitle>Optimal Lineup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {Object.entries(optimalLineup).map(([position, player]) => (
              <div key={position} className="text-center">
                <div className="glass-effect rounded-lg p-4">
                  <Badge variant="info" size="sm" className="mb-3">{position}</Badge>
                  {player ? (
                    <div>
                      <div className="font-semibold text-white mb-1">{player.name}</div>
                      <div className="text-sm text-gray-400">{player.team}</div>
                      <div className="text-lg font-bold text-primary-400 mt-2">
                        {player.avg_fantasy_points.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-400">Avg Points</div>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <div className="text-sm">Empty</div>
                      <div className="text-xs">No player</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Roster by Position */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {positions.map(position => (
          <Card key={position}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{position} ({getPositionPlayers(position).length})</span>
                <Badge variant="info" size="sm">{position}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getPositionPlayers(position).length > 0 ? (
                <div className="space-y-3">
                  {getPositionPlayers(position)
                    .sort((a, b) => b.total_fantasy_points - a.total_fantasy_points)
                    .map((player) => (
                      <div key={player.name} className="flex items-center justify-between glass-effect rounded-lg p-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-white">{player.name}</span>
                            {isPlayerInjured(player.name) && (
                              <Badge variant="error" size="sm">Injured</Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-400">{player.team}</div>
                          <div className="text-sm text-primary-400">
                            {player.total_fantasy_points.toFixed(1)} pts
                          </div>
                        </div>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removePlayerFromRoster(player.name)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-4">No {position} players</div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSelectedPosition(position)
                      setShowAddPlayer(true)
                    }}
                  >
                    Add {position}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Player Modal */}
      {showAddPlayer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Add Player to Roster</CardTitle>
                  <button
                    onClick={() => setShowAddPlayer(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Select
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                  >
                    <option value="">All Positions</option>
                    {positions.map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {filteredAvailable
                    .sort((a, b) => b.total_fantasy_points - a.total_fantasy_points)
                    .slice(0, 20)
                    .map((player) => (
                      <div key={player.name} className="relative">
                        <PlayerCard
                          player={player}
                          onClick={() => addPlayerToRoster(player)}
                          showDetails={false}
                        />
                        {isPlayerInjured(player.name) && (
                          <div className="absolute top-2 right-2">
                            <Badge variant="error" size="sm">Injured</Badge>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Team Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Team Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-4">Strengths</h4>
              <div className="space-y-2">
                {positions.map(position => {
                  const posPlayers = getPositionPlayers(position)
                  const avgPoints = posPlayers.reduce((sum, p) => sum + p.avg_fantasy_points, 0) / (posPlayers.length || 1)
                  const isStrong = avgPoints > 15
                  
                  return isStrong ? (
                    <div key={position} className="flex items-center space-x-2">
                      <Badge variant="success" size="sm">{position}</Badge>
                      <span className="text-sm text-gray-300">
                        Strong depth with {avgPoints.toFixed(1)} avg points
                      </span>
                    </div>
                  ) : null
                })}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Areas for Improvement</h4>
              <div className="space-y-2">
                {/* Show injured players first */}
                {injuredRosterPlayers.map(player => (
                  <div key={`injured-${player.name}`} className="flex items-center space-x-2">
                    <Badge variant="error" size="sm">INJURED</Badge>
                    <span className="text-sm text-gray-300">
                      {player.name} ({player.position}) needs replacement
                    </span>
                  </div>
                ))}
                
                {positions.map(position => {
                  const posPlayers = getPositionPlayers(position)
                  const avgPoints = posPlayers.reduce((sum, p) => sum + p.avg_fantasy_points, 0) / (posPlayers.length || 1)
                  const isWeak = posPlayers.length === 0 || avgPoints < 10
                  
                  return isWeak ? (
                    <div key={position} className="flex items-center space-x-2">
                      <Badge variant="warning" size="sm">{position}</Badge>
                      <span className="text-sm text-gray-300">
                        {posPlayers.length === 0 ? 'No players' : `Low scoring (${avgPoints.toFixed(1)} avg)`}
                      </span>
                    </div>
                  ) : null
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}