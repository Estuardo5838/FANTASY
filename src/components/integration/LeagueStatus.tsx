import React from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  RefreshCw, 
  ExternalLink, 
  Users, 
  Trophy,
  Calendar,
  Zap,
  Settings,
  X
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { useLeagueConnection } from '../../hooks/useLeagueConnection'
import { formatDistanceToNow } from 'date-fns'

export function LeagueStatus() {
  const { connections, syncing, syncAllLeagues, disconnectLeague } = useLeagueConnection()

  if (connections.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Connected Leagues</h3>
        <Button
          variant="secondary"
          size="sm"
          onClick={syncAllLeagues}
          disabled={syncing}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          <span>Sync All</span>
        </Button>
      </div>

      <div className="space-y-3">
        {connections.map((connection) => (
          <motion.div
            key={connection.leagueId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            layout
          >
            <Card className="border border-success-600/30 bg-success-600/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                        connection.platform === 'nfl' ? 'bg-blue-600' : 'bg-purple-600'
                      }`}>
                        {connection.platform === 'nfl' ? '🏈' : '😴'}
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-white">{connection.leagueName}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="success" size="sm" className="flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Connected</span>
                          </Badge>
                          <span className="text-xs text-gray-400 capitalize">
                            {connection.platform}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="hidden md:flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-white">{connection.teamCount}</div>
                        <div className="text-xs text-gray-400">Teams</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm font-semibold text-white">Week {connection.currentWeek}</div>
                        <div className="text-xs text-gray-400">Current</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm font-semibold text-white capitalize">{connection.scoringType}</div>
                        <div className="text-xs text-gray-400">Scoring</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm font-semibold text-success-400">
                          {formatDistanceToNow(connection.lastSync, { addSuffix: true })}
                        </div>
                        <div className="text-xs text-gray-400">Last Sync</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {connection.myRoster && (
                      <Badge variant="info" size="sm" className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{connection.myRoster.length} players</span>
                      </Badge>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => disconnectLeague(connection.leagueId)}
                      className="text-gray-400 hover:text-error-400"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Mobile Stats */}
                <div className="md:hidden mt-3 grid grid-cols-4 gap-2">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-white">{connection.teamCount}</div>
                    <div className="text-xs text-gray-400">Teams</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-white">Week {connection.currentWeek}</div>
                    <div className="text-xs text-gray-400">Current</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-white capitalize">{connection.scoringType}</div>
                    <div className="text-xs text-gray-400">Scoring</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-semibold text-success-400">
                      {formatDistanceToNow(connection.lastSync, { addSuffix: true })}
                    </div>
                    <div className="text-xs text-gray-400">Synced</div>
                  </div>
                </div>

                {/* Quick Actions */}
                {connection.myRoster && connection.myRoster.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        My Team: {connection.myRoster.filter((p: any) => p.isStarter).length} starters, 
                        {connection.myRoster.filter((p: any) => p.isInjured).length} injured
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="text-xs">
                          <Trophy className="w-3 h-3 mr-1" />
                          View Lineup
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Open League
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}