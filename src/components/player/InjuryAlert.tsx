import React from 'react'
import { AlertTriangle, User, TrendingDown } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import type { Player } from '../../types'

interface InjuryAlertProps {
  injuredPlayers: Player[]
  onViewReplacements: (player: Player) => void
}

export function InjuryAlert({ injuredPlayers, onViewReplacements }: InjuryAlertProps) {
  if (injuredPlayers.length === 0) return null

  return (
    <Card className="border-error-600 bg-error-600/10">
      <CardHeader>
        <CardTitle className="flex items-center text-error-400">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Injury Report ({injuredPlayers.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {injuredPlayers.slice(0, 5).map((player) => (
            <div key={player.name} className="flex items-center justify-between glass-effect rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-error-400" />
                <div>
                  <div className="font-semibold text-white">{player.name}</div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="error" size="sm">{player.position}</Badge>
                    <span className="text-sm text-gray-400">{player.team}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-semibold text-white">
                    {player.total_fantasy_points.toFixed(1)} pts
                  </div>
                  <div className="text-xs text-gray-400">Season Total</div>
                </div>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onViewReplacements(player)}
                  className="flex items-center space-x-1"
                >
                  <TrendingDown className="w-3 h-3" />
                  <span>Find Replacement</span>
                </Button>
              </div>
            </div>
          ))}
          
          {injuredPlayers.length > 5 && (
            <div className="text-center pt-2">
              <span className="text-sm text-gray-400">
                +{injuredPlayers.length - 5} more injured players
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}