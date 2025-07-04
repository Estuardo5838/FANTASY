import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Star, 
  Target,
  Activity,
  Calendar,
  Zap,
  BarChart3,
  RefreshCw,
  Plus,
  Settings,
  Trophy,
  Clock,
  CheckCircle,
  ExternalLink
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Input, Select } from '../ui/Input'
import { PlayerStatsCard } from '../player/PlayerStatsCard'
import { usePlayerData } from '../../hooks/usePlayerData'
import { QuickConnect } from '../integration/QuickConnect'
import { LeagueStatus } from '../integration/LeagueStatus'
import { useLeagueConnection } from '../../hooks/useLeagueConnection'
import type { Player } from '../../types'

interface TeamManagementDashboardProps {
  // Remove unused prop
}

export function TeamManagementDashboard() {
  const { 
    players, 
    loading, 
    getAvailablePlayers, 
    getInjuredPlayers, 
    isPlayerInjured,
    getReplacementSuggestions 
  } = usePlayerData()
  
  const [myTeam, setMyTeam] = useState<Player[]>([])
  const [teamName, setTeamName] = useState('My Fantasy Team')
  const [leagueConnected, setLeagueConnected] = useState(false)
  const [selectedWeek, setSelectedWeek] = useState(1)
  const [showWaiverWire, setShowWaiverWire] = useState(false)
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [showConnector, setShowConnector] = useState(false)
  const { connections, isConnected } = useLeagueConnection()

  // Simulate team data
  useEffect(() => {
    if (players.length > 0 && myTeam.length === 0) {
      // Auto-populate with sample team
      const sampleTeam = [
        players.find(p => p.position === 'QB'),
        players.find(p => p.position === 'RB'),
        players.find(p => p.position === 'RB' && p !== players.find(p => p.position === 'RB')),
        players.find(p => p.position === 'WR'),
        players.find(p => p.position === 'WR' && p !== players.find(p => p.position === 'WR')),
        players.find(p => p.position === 'TE'),
      ].filter(Boolean) as Player[]
      
      setMyTeam(sampleTeam)
    }
  }, [players])

  // Generate weekly opportunities
  useEffect(() => {
    if (players.length > 0) {
      const availablePlayers = getAvailablePlayers()
      const weeklyOpportunities = [
        {
          type: 'trending_up',
          player: availablePlayers.find(p => p.position === 'WR'),
          reason: 'Target share increased 15% over last 3 games',
          confidence: 85,
          action: 'Add from Waiver Wire'
        },
        {
          type: 'matchup',
          player: availablePlayers.find(p => p.position === 'RB'),
          reason: 'Favorable matchup vs #32 ranked run defense',
          confidence: 78,
          action: 'Start This Week'
        },
        {
          type: 'injury_return',
          player: availablePlayers.find(p => p.position === 'TE'),
          reason: 'Expected to return from injury this week',
          confidence: 92,
          action: 'Monitor Status'
        }
      ].filter(opp => opp.player)
      
      setOpportunities(weeklyOpportunities)
    }
  }, [players, selectedWeek])

  const getTeamStats = () => {
    if (myTeam.length === 0) return { totalPoints: 0, avgPoints: 0, projectedPoints: 0, healthyPlayers: 0 }
    
    const totalPoints = myTeam.reduce((sum, p) => sum + p.total_fantasy_points, 0)
    const avgPoints = totalPoints / myTeam.length
    const projectedPoints = myTeam.reduce((sum, p) => sum + p.predicted_value, 0)
    const healthyPlayers = myTeam.filter(p => !isPlayerInjured(p.name)).length
    
    return { totalPoints, avgPoints, projectedPoints, healthyPlayers }
  }

  const getOptimalLineup = () => {
    const lineup = {
      QB: myTeam.filter(p => p.position === 'QB').sort((a, b) => b.avg_fantasy_points - a.avg_fantasy_points)[0],
      RB1: myTeam.filter(p => p.position === 'RB').sort((a, b) => b.avg_fantasy_points - a.avg_fantasy_points)[0],
      RB2: myTeam.filter(p => p.position === 'RB').sort((a, b) => b.avg_fantasy_points - a.avg_fantasy_points)[1],
      WR1: myTeam.filter(p => p.position === 'WR').sort((a, b) => b.avg_fantasy_points - a.avg_fantasy_points)[0],
      WR2: myTeam.filter(p => p.position === 'WR').sort((a, b) => b.avg_fantasy_points - a.avg_fantasy_points)[1],
      TE: myTeam.filter(p => p.position === 'TE').sort((a, b) => b.avg_fantasy_points - a.avg_fantasy_points)[0],
    }
    return lineup
  }

  const injuredTeamPlayers = myTeam.filter(p => isPlayerInjured(p.name))
  const teamStats = getTeamStats()
  const optimalLineup = getOptimalLineup()
  const availablePlayers = getAvailablePlayers()

  return (
    <div className="space-y-8">
      {/* League Connection */}
      {isConnected() ? (
        <LeagueStatus />
      ) : (
        <div className="text-center py-12">
          <Zap className="w-16 h-16 text-primary-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Leagues Connected</h2>
          <p className="text-gray-400 mb-6">
            Connect your fantasy league to access team management features
          </p>
        </div>
      )}

      {/* Team Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            label: 'Team Points', 
            value: teamStats.totalPoints.toFixed(1), 
            icon: <Trophy className="w-6 h-6" />, 
            color: 'text-primary-400',
            change: '+12.3 vs last week'
          },
          { 
            label: 'Projected Points', 
            value: teamStats.projectedPoints.toFixed(1), 
            icon: <Target className="w-6 h-6" />, 
            color: 'text-secondary-400',
            change: '+5.7 trending up'
          },
          { 
            label: 'Healthy Players', 
            value: `${teamStats.healthyPlayers}/${myTeam.length}`, 
            icon: <CheckCircle className="w-6 h-6" />, 
            color: teamStats.healthyPlayers === myTeam.length ? 'text-success-400' : 'text-warning-400',
            change: injuredTeamPlayers.length > 0 ? `${injuredTeamPlayers.length} injured` : 'All healthy'
          },
          { 
            label: 'League Rank', 
            value: '#3', 
            icon: <Star className="w-6 h-6" />, 
            color: 'text-warning-400',
            change: 'Up 2 spots'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.change}</p>
                  </div>
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Injury Alerts */}
      {injuredTeamPlayers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-effect rounded-lg p-6 border border-error-600 bg-error-600/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-error-400" />
              <h3 className="text-lg font-bold text-error-400">Injury Alert</h3>
              <Badge variant="error">{injuredTeamPlayers.length}</Badge>
            </div>
            <Button variant="secondary" size="sm">View All Replacements</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {injuredTeamPlayers.map((player) => (
              <motion.div
                key={player.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-effect rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-semibold text-white">{player.name}</div>
                    <div className="text-sm text-gray-400">{player.position} • {player.team}</div>
                  </div>
                  <Badge variant="error" size="sm">Injured</Badge>
                </div>
                <div className="text-sm text-gray-300 mb-3">
                  Avg: {player.avg_fantasy_points.toFixed(1)} pts/game
                </div>
                <Button variant="secondary" size="sm" className="w-full">
                  Find Replacement
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Weekly Opportunities */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Week {selectedWeek} Opportunities
            </CardTitle>
            <div className="flex items-center space-x-3">
              <Select
                value={selectedWeek.toString()}
                onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
              >
                {Array.from({ length: 17 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>Week {i + 1}</option>
                ))}
              </Select>
              <Button variant="ghost" size="sm">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {opportunities.map((opp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-effect rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      opp.type === 'trending_up' ? 'bg-success-400' :
                      opp.type === 'matchup' ? 'bg-warning-400' :
                      'bg-primary-400'
                    }`} />
                    
                    <div>
                      <div className="font-semibold text-white">
                        {opp.player.name} ({opp.player.position})
                      </div>
                      <div className="text-sm text-gray-400">{opp.reason}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm font-semibold text-success-400">
                        {opp.confidence}% confidence
                      </div>
                      <div className="text-xs text-gray-400">{opp.action}</div>
                    </div>
                    <Button variant="primary" size="sm">
                      {opp.action.includes('Add') ? 'Add Player' : 
                       opp.action.includes('Start') ? 'Set Lineup' : 'Monitor'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimal Lineup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Optimal Lineup - Week {selectedWeek}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(optimalLineup).map(([position, player]) => (
              <motion.div
                key={position}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Object.keys(optimalLineup).indexOf(position) * 0.1 }}
                className="text-center"
              >
                <div className={`glass-effect rounded-lg p-4 ${
                  player && isPlayerInjured(player.name) ? 'border border-error-600' : ''
                }`}>
                  <Badge variant="info" size="sm" className="mb-3">{position}</Badge>
                  {player ? (
                    <div>
                      <div className="font-semibold text-white mb-1">{player.name}</div>
                      <div className="text-sm text-gray-400 mb-2">{player.team}</div>
                      <div className="text-lg font-bold text-primary-400">
                        {player.avg_fantasy_points.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-400">Projected</div>
                      {isPlayerInjured(player.name) && (
                        <Badge variant="error" size="sm" className="mt-2">Injured</Badge>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <div className="text-sm">Empty</div>
                      <div className="text-xs">No player</div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Waiver Wire Targets */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Waiver Wire Targets
            </CardTitle>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setShowWaiverWire(!showWaiverWire)}
            >
              {showWaiverWire ? 'Hide' : 'Show'} All Available
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availablePlayers
              .sort((a, b) => b.predicted_value - a.predicted_value)
              .slice(0, showWaiverWire ? 12 : 6)
              .map((player, index) => (
                <motion.div
                  key={player.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <PlayerStatsCard
                    player={player}
                    showDetails={false}
                    isInjured={isPlayerInjured(player.name)}
                    animated={true}
                  />
                  <div className="mt-2 flex space-x-2">
                    <Button variant="primary" size="sm" className="flex-1">
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                    <Button variant="secondary" size="sm">
                      <BarChart3 className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* My Team Roster */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              {teamName} ({myTeam.length}/15)
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-48"
                placeholder="Team name"
              />
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myTeam.map((player, index) => (
              <motion.div
                key={player.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <PlayerStatsCard
                  player={player}
                  isInjured={isPlayerInjured(player.name)}
                  showTrends={true}
                  animated={true}
                />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}