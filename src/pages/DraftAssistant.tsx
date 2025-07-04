import React, { useState } from 'react'
import { Target, Users, Trophy, Clock, Star, TrendingUp } from 'lucide-react'
import { usePlayerData } from '../hooks/usePlayerData'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Select } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { LoadingSpinner, SkeletonCard } from '../components/ui/LoadingSpinner'
import { DataStatus } from '../components/ui/DataStatus'
import { DataSourceInfo } from '../components/analytics/DataSourceInfo'
import { PlayerCard } from '../components/player/PlayerCard'
import type { Player, DraftRecommendation } from '../types'

export function DraftAssistant() {
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
  const [currentPick, setCurrentPick] = useState(1)
  const [draftedPlayers, setDraftedPlayers] = useState<string[]>([])
  const [teamSize, setTeamSize] = useState(12)
  const [scoringType, setScoringType] = useState<'standard' | 'ppr' | 'half_ppr'>('ppr')
  const [myTeam, setMyTeam] = useState<Player[]>([])

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

  const healthyPlayers = getAvailablePlayers()
  const injuredPlayers = getInjuredPlayers()
  const availablePlayers = healthyPlayers.filter(p => !draftedPlayers.includes(p.name))

  const generateDraftRecommendations = (): DraftRecommendation[] => {
    const positionNeeds = getPositionNeeds()
    const recommendations: DraftRecommendation[] = []

    // Get top available players by position
    const positions = ['QB', 'RB', 'WR', 'TE']
    
    positions.forEach(position => {
      const positionPlayers = availablePlayers
        .filter(p => p.position === position)
        .sort((a, b) => b.total_fantasy_points - a.total_fantasy_points)
        .slice(0, 5)

      positionPlayers.forEach((player, index) => {
        const positionRank = index + 1
        const overallRank = availablePlayers
          .sort((a, b) => b.total_fantasy_points - a.total_fantasy_points)
          .findIndex(p => p.name === player.name) + 1

        const value = calculateDraftValue(player, currentPick, positionNeeds)
        const tier = getTier(player, position)
        
        const reasoning = generateReasoning(player, positionNeeds, tier, positionRank)
        
        // Adjust value for injury status
        let adjustedValue = value
        if (isPlayerInjured(player.name)) {
          adjustedValue *= 0.5 // Heavily penalize injured players
          reasoning.push(`⚠️ Currently injured - high risk pick`)
        }

        recommendations.push({
          player,
          value: adjustedValue,
          tier,
          position_rank: positionRank,
          overall_rank: overallRank,
          reasoning
        })
      })
    })

    return recommendations
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
  }

  const getPositionNeeds = () => {
    const needs = {
      QB: 1 - myTeam.filter(p => p.position === 'QB').length,
      RB: 2 - myTeam.filter(p => p.position === 'RB').length,
      WR: 2 - myTeam.filter(p => p.position === 'WR').length,
      TE: 1 - myTeam.filter(p => p.position === 'TE').length,
    }
    return needs
  }

  const calculateDraftValue = (player: Player, pick: number, needs: any): number => {
    let value = player.predicted_value
    
    // Adjust for position need
    const positionNeed = needs[player.position] || 0
    if (positionNeed > 0) {
      value *= (1 + positionNeed * 0.2)
    }
    
    // Adjust for pick position (later picks get bonus for value)
    if (pick > 50) {
      value *= 1.1
    }
    
    // Adjust for scoring type
    if (scoringType === 'ppr' && ['WR', 'RB', 'TE'].includes(player.position)) {
      value *= 1.05
    }
    
    return value
  }

  const getTier = (player: Player, position: string): number => {
    const positionPlayers = availablePlayers
      .filter(p => p.position === position)
      .sort((a, b) => b.total_fantasy_points - a.total_fantasy_points)
    
    const rank = positionPlayers.findIndex(p => p.name === player.name) + 1
    
    if (rank <= 3) return 1
    if (rank <= 8) return 2
    if (rank <= 15) return 3
    if (rank <= 25) return 4
    return 5
  }

  const generateReasoning = (player: Player, needs: any, tier: number, positionRank: number): string[] => {
    const reasoning: string[] = []
    
    if (needs[player.position] > 0) {
      reasoning.push(`Fills ${player.position} need on your roster`)
    }
    
    if (tier <= 2) {
      reasoning.push(`Tier ${tier} player - elite option at ${player.position}`)
    }
    
    if (player.volatility < 0.2) {
      reasoning.push('Highly consistent performer with low volatility')
    }
    
    if (player.predicted_value > player.total_fantasy_points) {
      reasoning.push('Projected for positive regression - good value')
    }
    
    if (positionRank <= 5) {
      reasoning.push(`Top 5 ${player.position} available`)
    }
    
    return reasoning
  }

  const draftPlayer = (player: Player) => {
    setDraftedPlayers([...draftedPlayers, player.name])
    
    // If it's our pick, add to our team
    const pickNumber = draftedPlayers.length + 1
    const ourPicks = []
    for (let i = 1; i <= 15; i++) {
      const round = Math.ceil(i / teamSize)
      const pickInRound = round % 2 === 1 ? i : (teamSize * round) - (i - (teamSize * (round - 1))) + 1
      ourPicks.push(pickInRound)
    }
    
    if (ourPicks.includes(pickNumber)) {
      setMyTeam([...myTeam, player])
    }
    
    setCurrentPick(pickNumber + 1)
  }

  const recommendations = generateDraftRecommendations()
  const nextOurPick = Math.ceil(currentPick / teamSize) % 2 === 1 
    ? currentPick + (teamSize - (currentPick % teamSize || teamSize))
    : currentPick + ((currentPick % teamSize) || teamSize)

  return (
    <div className="space-y-8">
      {/* Data Status */}
      <DataSourceInfo
        dataSource={dataSource}
        lastUpdated={lastUpdated}
        loading={loading}
        error={error}
        totalPlayers={players.length}
        onRefresh={refetch}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-white">Draft Assistant</h1>
          <p className="text-gray-400 mt-2">
            AI-powered draft recommendations and strategy
          </p>
        </div>
        <div className="flex items-center space-x-2 text-gray-400">
          <Target className="w-5 h-5" />
          <span>Smart Draft Guidance</span>
        </div>
      </div>

      {/* Draft Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Draft Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Pick
              </label>
              <div className="text-2xl font-bold text-primary-400">#{currentPick}</div>
            </div>
            <Select
              label="Team Size"
              value={teamSize.toString()}
              onChange={(e) => setTeamSize(parseInt(e.target.value))}
            >
              <option value="8">8 Teams</option>
              <option value="10">10 Teams</option>
              <option value="12">12 Teams</option>
              <option value="14">14 Teams</option>
            </Select>
            <Select
              label="Scoring Type"
              value={scoringType}
              onChange={(e) => setScoringType(e.target.value as any)}
            >
              <option value="standard">Standard</option>
              <option value="half_ppr">Half PPR</option>
              <option value="ppr">Full PPR</option>
            </Select>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Next Your Pick
              </label>
              <div className="text-lg font-bold text-secondary-400">#{nextOurPick}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Draft Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommendations */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Top Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.slice(0, 6).map((rec, index) => (
                  <div key={rec.player.name} className="glass-effect rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{rec.player.name}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant="info" size="sm">{rec.player.position}</Badge>
                            <span className="text-sm text-gray-400">{rec.player.team}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary-400">
                          {rec.value.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-400">Value Score</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-white">Tier {rec.tier}</div>
                        <div className="text-xs text-gray-400">Tier</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-white">#{rec.position_rank}</div>
                        <div className="text-xs text-gray-400">{rec.player.position} Rank</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-white">#{rec.overall_rank}</div>
                        <div className="text-xs text-gray-400">Overall</div>
                      </div>
                    </div>
                    
                    <div className="space-y-1 mb-3">
                      {rec.reasoning.map((reason, i) => (
                        <div key={i} className="text-xs text-gray-300 flex items-start space-x-2">
                          <span className="text-success-400 mt-1">•</span>
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={() => draftPlayer(rec.player)}
                      className="w-full"
                    >
                      Draft Player
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Team */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                My Team ({myTeam.length}/15)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {myTeam.length > 0 ? (
                <div className="space-y-3">
                  {myTeam.map((player, index) => (
                    <div key={player.name} className="flex items-center space-x-3 glass-effect rounded-lg p-3">
                      <div className="w-6 h-6 rounded-full bg-secondary-600 flex items-center justify-center text-white font-bold text-xs">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white">{player.name}</div>
                        <div className="text-sm text-gray-400">{player.position} • {player.team}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No players drafted yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Position Needs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(getPositionNeeds()).map(([position, need]) => (
                  <div key={position} className="flex justify-between items-center">
                    <span className="text-gray-400">{position}</span>
                    <Badge 
                      variant={need > 0 ? 'warning' : 'success'} 
                      size="sm"
                    >
                      {need > 0 ? `Need ${need}` : 'Filled'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Available Players by Position */}
      <Card>
        <CardHeader>
          <CardTitle>Available Players by Position</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['QB', 'RB', 'WR', 'TE'].map(position => (
              <div key={position}>
                <h4 className="font-semibold text-white mb-3 flex items-center">
                  <Badge variant="info" size="sm" className="mr-2">{position}</Badge>
                  Top Available
                </h4>
                <div className="space-y-2">
                  {availablePlayers
                    .filter(p => p.position === position)
                    .sort((a, b) => b.total_fantasy_points - a.total_fantasy_points)
                    .slice(0, 5)
                    .map((player, index) => (
                      <div key={player.name} className={`glass-effect rounded-lg p-3 ${
                        isPlayerInjured(player.name) ? 'border border-error-600' : ''
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-white">{player.name}</span>
                            {isPlayerInjured(player.name) && (
                              <Badge variant="error" size="sm">Injured</Badge>
                            )}
                          </div>
                          <span className="text-xs text-gray-400">#{index + 1}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Points:</span>
                          <span className="text-white">{player.total_fantasy_points.toFixed(1)}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-full mt-2"
                          onClick={() => draftPlayer(player)}
                        >
                          Draft
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}