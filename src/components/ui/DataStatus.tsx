import React from 'react'
import { RefreshCw, AlertCircle, CheckCircle, Clock, Github, Database, Zap } from 'lucide-react'
import { Button } from './Button'
import { Badge } from './Badge'

interface DataStatusProps {
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  onRefresh: () => void
  totalPlayers: number
  injuredCount: number
}

export function DataStatus({ 
  loading, 
  error, 
  lastUpdated, 
  onRefresh, 
  totalPlayers, 
  injuredCount 
}: DataStatusProps) {
  const formatLastUpdated = (date: Date | null) => {
    if (!date) return 'Never'
    
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  return (
    <div className="glass-effect rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Github className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-white">
              {error ? 'Demo Data (Fallback)' : 'Live GitHub Data'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {error ? (
              <AlertCircle className="w-4 h-4 text-error-400" />
            ) : loading ? (
              <RefreshCw className="w-4 h-4 text-warning-400 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4 text-success-400" />
            )}
            
            <span className={`text-sm ${
              error ? 'text-error-400' : 
              loading ? 'text-warning-400' : 
              'text-success-400'
            }`}>
              {error ? 'Fallback Mode' : 
               loading ? 'Loading...' : 'Connected'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="text-center">
              <div className="text-lg font-bold text-white">{totalPlayers}</div>
              <div className="text-xs text-gray-400">Players</div>
            </div>
            
            {injuredCount > 0 && (
              <div className="text-center">
                <div className="text-lg font-bold text-error-400">{injuredCount}</div>
                <div className="text-xs text-gray-400">Injured</div>
              </div>
            )}
            
            <div className="text-center">
              <div className="text-sm font-medium text-gray-300">
                {formatLastUpdated(lastUpdated)}
              </div>
              <div className="text-xs text-gray-400">Last Updated</div>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-error-600/20 border border-error-600 rounded-lg">
          <p className="text-error-400 text-sm">{error}</p>
          <p className="text-gray-400 text-xs mt-1">
            Repository: https://github.com/Estuardo5838/FANTASY
          </p>
        </div>
      )}
    </div>
  )
}