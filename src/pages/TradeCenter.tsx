import React, { useState } from 'react'
import { ArrowLeftRight, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react'
import { usePlayerData } from '../hooks/usePlayerData'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Select } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { LoadingSpinner, SkeletonCard } from '../components/ui/LoadingSpinner'
import { DataStatus } from '../components/ui/DataStatus'
import { PlayerCard } from '../components/player/PlayerCard'

export function TradeCenter() {
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
  const [selectedPlayer1, setSelectedPlayer1] = useState<Player | null>(null)
  const [selectedPlayer2, setSelectedPlayer2] = useState<Player | null>(null)
  const [tradeAnalysis, setTradeAnalysis] = useState<TradeAnalysis | null>(null)

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

  const analyzeTradeValue = (player1: Player, player2: Player): TradeAnalysis => {
    const valueDiff = player1.predicted_value - player2.predicted_value
    const pointsDiff = player1.total_fantasy_points - player2.total_fantasy_points
    const volatilityDiff = player2.volatility - player1.volatility // Lower volatility is better
    
    const reasoning: string[] = []
    let recommendation: 'accept' | 'decline' | 'neutral' = 'neutral'
    let confidence = 50

    // Value analysis
    if (Math.abs(valueDiff) > 10) {
      if (valueDiff > 0) {
        reasoning.push(`${player1.name} has significantly higher predicted value (+${valueDiff.toFixed(1)})`)
        confidence += 15
      } else {
        reasoning.push(`${player2.name} has significantly higher predicted value (+${Math.abs(valueDiff).toFixed(1)})`)
        confidence += 15
      }
    }

    // Points analysis
    if (Math.abs(pointsDiff) > 20) {
      if (pointsDiff > 0) {
        reasoning.push(`${player1.name} has scored ${pointsDiff.toFixed(1)} more fantasy points`)
        confidence += 10
      } else {
        reasoning.push(`${player2.name} has scored ${Math.abs(pointsDiff).toFixed(1)} more fantasy points`)
        confidence += 10
      }
    }

    // Volatility analysis
    if (Math.abs(volatilityDiff) > 0.1) {
      if (volatilityDiff > 0) {
        reasoning.push(`${player1.name} is more consistent (lower volatility)`)
        confidence += 10
      } else {
        reasoning.push(`${player2.name} is more consistent (lower volatility)`)
        confidence += 10
      }
    }

    // Position considerations
    if (player1.position !== player2.position) {
      reasoning.push(`Consider positional needs: ${player1.position} vs ${player2.position}`)
    }
    
    // Injury status
    const player1Injured = isPlayerInjured(player1.name)
    const player2Injured = isPlayerInjured(player2.name)
    
    if (player1Injured && !player2Injured) {
      reasoning.push(`⚠️ ${player1.name} is currently injured - high risk trade`)
      confidence -= 20
      recommendation = 'decline'
    } else if (!player1Injured && player2Injured) {
      reasoning.push(`✅ ${player2.name} is injured - potential buy-low opportunity`)
      confidence += 10
    } else if (player1Injured && player2Injured) {
      reasoning.push(`⚠️ Both players are currently injured`)
      confidence -= 10
    }

    // Overall recommendation
    const totalAdvantage = valueDiff + (pointsDiff * 0.1) + (volatilityDiff * 50)
    
    if (totalAdvantage > 5) {
      recommendation = 'accept'
      reasoning.push(`Overall analysis favors ${player1.name}`)
    } else if (totalAdvantage < -5) {
      recommendation = 'decline'
      reasoning.push(`Overall analysis favors ${player2.name}`)
    } else {
      recommendation = 'neutral'
      reasoning.push('Trade appears fairly balanced')
    }

    return {
      player1,
      player2,
      value_difference: valueDiff,
      recommendation,
      reasoning,
      confidence: Math.min(confidence, 95)
    }
  }

  const handleAnalyzeTrade = () => {
    if (selectedPlayer1 && selectedPlayer2) {
      const analysis = analyzeTradeValue(selectedPlayer1, selectedPlayer2)
      setTradeAnalysis(analysis)
    }
  }

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'accept': return 'text-success-400'
      case 'decline': return 'text-error-400'
      default: return 'text-warning-400'
    }
  }

  const getRecommendationIcon = (rec: string) => {
    switch (rec) {
      case 'accept': return <CheckCircle className="w-5 h-5" />
      case 'decline': return <AlertCircle className="w-5 h-5" />
      default: return <TrendingUp className="w-5 h-5" />
    }
  }

  const availablePlayers = getAvailablePlayers()
  const injuredPlayers = getInjuredPlayers()
  
  const topPlayers = players
    .sort((a, b) => b.total_fantasy_points - a.total_fantasy_points)
    .slice(0, 20)

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
          <h1 className="text-3xl font-bold text-white">Trade Center</h1>
          <p className="text-gray-400 mt-2">
            Analyze trade values with AI-powered insights
          </p>
        </div>
        <div className="flex items-center space-x-2 text-gray-400">
          <ArrowLeftRight className="w-5 h-5" />
          <span>Smart Trade Analysis</span>
        </div>
      </div>

      {/* Trade Analyzer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Player 1 Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Your Player</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPlayer1 ? (
              <div className="space-y-4">
                <PlayerCard player={selectedPlayer1} />
                <Button
                  variant="secondary"
                  onClick={() => setSelectedPlayer1(null)}
                  className="w-full"
                >
                  Change Player
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <ArrowLeftRight className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Select a player to trade away</p>
                <Select
                  onChange={(e) => {
                    const player = players.find(p => p.name === e.target.value)
                    if (player) setSelectedPlayer1(player)
                  }}
                  value=""
                >
                  <option value="">Choose player...</option>
                  {topPlayers.map(player => (
                    <option 
                      key={player.name} 
                      value={player.name}
                      style={{ 
                        color: isPlayerInjured(player.name) ? '#ef4444' : 'inherit' 
                      }}
                    >
                      {player.name} ({player.position}) {isPlayerInjured(player.name) ? '🤕' : ''}
                    </option>
                  ))}
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trade Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Trade Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            {tradeAnalysis ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className={`flex items-center justify-center space-x-2 mb-2 ${getRecommendationColor(tradeAnalysis.recommendation)}`}>
                    {getRecommendationIcon(tradeAnalysis.recommendation)}
                    <span className="text-lg font-bold capitalize">
                      {tradeAnalysis.recommendation}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Confidence: {tradeAnalysis.confidence}%
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {tradeAnalysis.value_difference > 0 ? '+' : ''}{tradeAnalysis.value_difference.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-400">Value Difference</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-white">Analysis:</h4>
                  {tradeAnalysis.reasoning.map((reason, index) => (
                    <div key={index} className="text-sm text-gray-300 flex items-start space-x-2">
                      <span className="text-primary-400 mt-1">•</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => setTradeAnalysis(null)}
                  variant="secondary"
                  className="w-full"
                >
                  New Analysis
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">
                  Select two players to analyze the trade
                </p>
                <Button
                  onClick={handleAnalyzeTrade}
                  disabled={!selectedPlayer1 || !selectedPlayer2}
                  className="w-full"
                >
                  Analyze Trade
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Player 2 Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Target Player</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPlayer2 ? (
              <div className="space-y-4">
                <PlayerCard player={selectedPlayer2} />
                <Button
                  variant="secondary"
                  onClick={() => setSelectedPlayer2(null)}
                  className="w-full"
                >
                  Change Player
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <ArrowLeftRight className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Select a player to trade for</p>
                <Select
                  onChange={(e) => {
                    const player = players.find(p => p.name === e.target.value)
                    if (player) setSelectedPlayer2(player)
                  }}
                  value=""
                >
                  <option value="">Choose player...</option>
                  {topPlayers.map(player => (
                    <option 
                      key={player.name} 
                      value={player.name}
                      style={{ 
                        color: isPlayerInjured(player.name) ? '#ef4444' : 'inherit' 
                      }}
                    >
                      {player.name} ({player.position}) {isPlayerInjured(player.name) ? '🤕' : ''}
                    </option>
                  ))}
                </Select>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Trade Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Trending Trade Targets (Available Players)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {availablePlayers
              .sort((a, b) => b.predicted_value - a.predicted_value)
              .slice(0, 8)
              .map((player) => (
                <div key={player.name} className="glass-effect rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{player.name}</h4>
                    <Badge variant="info" size="sm">{player.position}</Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Value:</span>
                      <span className="text-primary-400">{player.predicted_value.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Points:</span>
                      <span className="text-white">{player.total_fantasy_points.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Trend:</span>
                      <span className="flex items-center text-success-400">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Hot
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-full mt-3"
                    onClick={() => setSelectedPlayer2(player)}
                  >
                    Analyze Trade
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Trade Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Trade Tips & Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Key Factors to Consider:</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start space-x-2">
                  <span className="text-primary-400 mt-1">•</span>
                  <span>Player consistency (volatility) vs upside potential</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-400 mt-1">•</span>
                  <span>Remaining schedule strength and matchups</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-400 mt-1">•</span>
                  <span>Injury history and current health status</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-400 mt-1">•</span>
                  <span>Team offensive trends and target share</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Best Practices:</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start space-x-2">
                  <span className="text-success-400 mt-1">•</span>
                  <span>Trade from strength to address weaknesses</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-success-400 mt-1">•</span>
                  <span>Consider playoff schedules for key players</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-success-400 mt-1">•</span>
                  <span>Factor in bye weeks and roster construction</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-success-400 mt-1">•</span>
                  <span>Don't trade just to trade - ensure clear upgrade</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}