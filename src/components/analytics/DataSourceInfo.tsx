import React from 'react'
import { Github, Database, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'

interface DataSourceInfoProps {
  dataSource: string
  lastUpdated: Date | null
  loading: boolean
  error: string | null
  totalPlayers: number
  onRefresh: () => void
}

export function DataSourceInfo({
  dataSource,
  lastUpdated,
  loading,
  error,
  totalPlayers,
  onRefresh
}: DataSourceInfoProps) {
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
    <Card className="p-4 border-primary-600/30 bg-primary-600/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-primary-600/20 flex items-center justify-center">
            <Github className="w-5 h-5 text-primary-400" />
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-white">GitHub Data Source</h3>
              {dataSource === 'github' ? (
                <Badge variant="success" size="sm" className="flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Live</span>
                </Badge>
              ) : dataSource === 'demo' ? (
                <Badge variant="warning" size="sm" className="flex items-center space-x-1">
                  <Database className="w-3 h-3" />
                  <span>Fallback</span>
                </Badge>
              ) : (
                <Badge variant="info" size="sm" className="flex items-center space-x-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Loading</span>
                </Badge>
              )}
            </div>
            
            <div className="text-sm text-gray-400 mt-1">
              <span className="text-primary-400">github.com/Estuardo5838/FANTASY</span> • {totalPlayers} players • Updated {formatLastUpdated(lastUpdated)}
            </div>
          </div>
        </div>
        
        <button 
          onClick={onRefresh}
          disabled={loading}
          className="p-2 rounded-lg bg-primary-600/20 hover:bg-primary-600/30 transition-colors"
        >
          <RefreshCw className={`w-5 h-5 text-primary-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {error && (
        <div className="mt-3 p-3 bg-warning-600/20 border border-warning-600 rounded-lg flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-warning-400 mt-0.5" />
          <div>
            <p className="text-warning-400 text-sm font-medium">Using fallback data</p>
            <p className="text-gray-400 text-xs mt-1">
              Could not connect to GitHub repository. Using demo data instead.
            </p>
          </div>
        </div>
      )}
    </Card>
  )
}