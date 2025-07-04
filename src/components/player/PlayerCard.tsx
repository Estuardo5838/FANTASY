import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card } from '../ui/Card'
import { Badge, PositionBadge } from '../ui/Badge'
import { formatNumber } from '../../lib/utils'
import type { Player } from '../../types'

interface PlayerCardProps {
  player: Player
  onClick?: () => void
  showDetails?: boolean
}

export function PlayerCard({ player, onClick, showDetails = true }: PlayerCardProps) {
  const getTrendIcon = (volatility: number) => {
    if (volatility > 0.3) return <TrendingDown className="w-4 h-4 text-error-400" />
    if (volatility < 0.15) return <TrendingUp className="w-4 h-4 text-success-400" />
    return <Minus className="w-4 h-4 text-warning-400" />
  }

  const getVolatilityColor = (volatility: number) => {
    if (volatility > 0.3) return 'text-error-400'
    if (volatility < 0.15) return 'text-success-400'
    return 'text-warning-400'
  }

  return (
    <Card hover={!!onClick} className="cursor-pointer" onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-bold text-white">{player.name}</h3>
            <PositionBadge position={player.position} />
          </div>
          <p className="text-gray-400 text-sm">{player.team}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-400">
            {formatNumber(player.total_fantasy_points)}
          </div>
          <div className="text-xs text-gray-400">Total Points</div>
        </div>
      </div>

      {showDetails && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400">Avg Points</div>
              <div className="text-lg font-semibold text-white">
                {player.avg_fantasy_points.toFixed(1)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Predicted Value</div>
              <div className="text-lg font-semibold text-secondary-400">
                {player.predicted_value.toFixed(1)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getTrendIcon(player.volatility)}
              <span className={`text-sm font-medium ${getVolatilityColor(player.volatility)}`}>
                Volatility: {(player.volatility * 100).toFixed(1)}%
              </span>
            </div>
            <Badge variant="info" size="sm">
              {player.games_played} games
            </Badge>
          </div>

          {/* Position-specific stats */}
          {player.position === 'QB' && (
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-700">
              <div className="text-center">
                <div className="text-xs text-gray-400">Pass Yds</div>
                <div className="text-sm font-semibold text-white">
                  {formatNumber(player.passing_yds_sum || 0)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400">Pass TDs</div>
                <div className="text-sm font-semibold text-white">
                  {player.passing_td_sum || 0}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400">INTs</div>
                <div className="text-sm font-semibold text-error-400">
                  {player.passing_int_sum || 0}
                </div>
              </div>
            </div>
          )}

          {player.position === 'RB' && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-700">
              <div className="text-center">
                <div className="text-xs text-gray-400">Rush Yds</div>
                <div className="text-sm font-semibold text-white">
                  {formatNumber(player.rushing_yds_sum || 0)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400">Rush TDs</div>
                <div className="text-sm font-semibold text-white">
                  {player.rushing_td_sum || 0}
                </div>
              </div>
            </div>
          )}

          {['WR', 'TE'].includes(player.position) && (
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-700">
              <div className="text-center">
                <div className="text-xs text-gray-400">Rec Yds</div>
                <div className="text-sm font-semibold text-white">
                  {formatNumber(player.receiving_yds_sum || 0)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400">Rec TDs</div>
                <div className="text-sm font-semibold text-white">
                  {player.receiving_td_sum || 0}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400">Receptions</div>
                <div className="text-sm font-semibold text-white">
                  {player.receiving_rec_sum || 0}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}