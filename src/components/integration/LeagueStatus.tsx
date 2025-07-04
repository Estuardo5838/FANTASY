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
  X,
  AlertTriangle,
  Wifi,
  WifiOff,
  Clock,
  Activity
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <Wifi className="w-4 h-4 text-success-400" />
      case 'connecting':
        return <RefreshCw className="w-4 h-4 text-warning-400 animate-spin" />
      case 'error':
        return <WifiOff className="w-4 h-4 text-error-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-success-400'
      case 'connecting':
        return 'text-warning-400'
      case 'error':
        return 'text-error-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Connected'
      case 'connecting':
        return 'Connecting...'
      case 'error':
        return 'Error'
      default:
        return 'Disconnected'
    }
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
            <Card className={`border ${
              connection.connectionStatus === 'connected' 
                ? 'border-success-600/30 bg-success-600/5'
                : connection.connectionStatus === 'error'
                ? 'border-error-600/30 bg-error-600/5'
                : 'border-warning-600/30 bg-warning-600/5'
            }`}>
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
                          <Badge 
                            variant={connection.connectionStatus === 'connected' ? 'success' : 
                                   connection.connectionStatus === 'error' ? 'error' : 'warning'} 
                            size="sm" 
                            className="flex items-center space-x-1"
                          >
                            {getStatusIcon(connection.connectionStatus)}
                            <span>{getStatusText(connection.connectionStatus)}</span>
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
                    {connection.myRoster && connection.myRoster.length > 0 && (
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

                {/* Error Message */}
                {connection.errorMessage && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="flex items-center space-x-2 p-2 bg-warning-600/20 border border-warning-600 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-warning-400" />
                      <span className="text-warning-400 text-sm">{connection.errorMessage}</span>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                {connection.connected && connection.connectionStatus === 'connected' && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        {connection.myRoster && connection.myRoster.length > 0 ? (
                          <>My Team: {connection.myRoster.length} players</>
                        ) : (
                          <>League data synced successfully</>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="text-xs">
                          <Activity className="w-3 h-3 mr-1" />
                          View Data
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Open League
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Connection Details */}
                {connection.connectionStatus === 'connected' && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div className="text-center">
                        <div className="text-white font-semibold">
                          {connection.trades?.length || 0}
                        </div>
                        <div className="text-gray-400">Trades</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white font-semibold">
                          {connection.waiverWire?.length || 0}
                        </div>
                        <div className="text-gray-400">Waivers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white font-semibold">
                          {connection.users?.length || connection.teamCount}
                        </div>
                        <div className="text-gray-400">Managers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-success-400 font-semibold">
                          Live
                        </div>
                        <div className="text-gray-400">Status</div>
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