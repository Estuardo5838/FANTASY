import React from 'react'
import { TrendingUp, Star, Users } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { PlayerCard } from './PlayerCard'
import type { Player } from '../../types'

interface ReplacementSuggestionsProps {
  injuredPlayer: Player
  suggestions: Player[]
  onSelectReplacement: (player: Player) => void
  onClose: () => void
}

export function ReplacementSuggestions({ 
  injuredPlayer, 
  suggestions, 
  onSelectReplacement,
  onClose 
}: ReplacementSuggestionsProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Replacement Suggestions for {injuredPlayer.name}
                </CardTitle>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="error" size="sm">Injured</Badge>
                  <Badge variant="info" size="sm">{injuredPlayer.position}</Badge>
                  <span className="text-gray-400">{injuredPlayer.team}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {suggestions.length > 0 ? (
              <div className="space-y-6">
                <div className="glass-effect rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3">Injured Player Stats</h4>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-error-400">
                        {injuredPlayer.total_fantasy_points.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-400">Total Points</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">
                        {injuredPlayer.avg_fantasy_points.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-400">Avg Points</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-secondary-400">
                        {injuredPlayer.predicted_value.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-400">Predicted Value</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-warning-400">
                        {(injuredPlayer.volatility * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-400">Volatility</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-4 flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    Top Available Replacements
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suggestions.map((player, index) => (
                      <div key={player.name} className="relative">
                        <PlayerCard player={player} showDetails={false} />
                        
                        <div className="mt-3 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">vs Injured:</span>
                            <span className={`font-semibold ${
                              player.predicted_value > injuredPlayer.predicted_value 
                                ? 'text-success-400' 
                                : 'text-error-400'
                            }`}>
                              {player.predicted_value > injuredPlayer.predicted_value ? '+' : ''}
                              {(player.predicted_value - injuredPlayer.predicted_value).toFixed(1)}
                            </span>
                          </div>
                          
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => onSelectReplacement(player)}
                          >
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Select Replacement
                          </Button>
                        </div>
                        
                        {index === 0 && (
                          <div className="absolute -top-2 -right-2">
                            <Badge variant="success" size="sm">
                              <Star className="w-3 h-3 mr-1" />
                              Best
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Replacements Available</h3>
                <p className="text-gray-400">
                  No available players found for the {injuredPlayer.position} position.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}