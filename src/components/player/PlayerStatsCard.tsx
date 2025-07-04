import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target, 
  Zap,
  BarChart3,
  Eye,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { Card } from '../ui/Card'
import { Badge, PositionBadge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { formatNumber } from '../../lib/utils'
import type { Player } from '../../types'

interface PlayerStatsCardProps {
  player: Player
  onClick?: () => void
  showDetails?: boolean
  isInjured?: boolean
  showTrends?: boolean
  animated?: boolean
}

export function PlayerStatsCard({ 
  player, 
  onClick, 
  showDetails = true, 
  isInjured = false,
  showTrends = true,
  animated = true
}: PlayerStatsCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const getTrendIcon = (volatility: number) => {
    if (volatility > 0.3) return <TrendingDown className="w-4 h-4 text-error-400" />
    if (volatility < 0.15) return <TrendingUp className="w-4 h-4 text-success-400" />
    return <Activity className="w-4 h-4 text-warning-400" />
  }

  const getVolatilityColor = (volatility: number) => {
    if (volatility > 0.3) return 'text-error-400'
    if (volatility < 0.15) return 'text-success-400'
    return 'text-warning-400'
  }

  const getPerformanceGrade = () => {
    const score = (player.total_fantasy_points / 17) // Points per game
    if (score >= 20) return { grade: 'A+', color: 'text-success-400' }
    if (score >= 18) return { grade: 'A', color: 'text-success-400' }
    if (score >= 15) return { grade: 'B+', color: 'text-warning-400' }
    if (score >= 12) return { grade: 'B', color: 'text-warning-400' }
    if (score >= 10) return { grade: 'C+', color: 'text-gray-400' }
    return { grade: 'C', color: 'text-error-400' }
  }

  const getHealthStatus = () => {
    if (isInjured) return { status: 'Injured', color: 'text-error-400', icon: <AlertTriangle className="w-4 h-4" /> }
    return { status: 'Healthy', color: 'text-success-400', icon: <CheckCircle className="w-4 h-4" /> }
  }

  const performance = getPerformanceGrade()
  const health = getHealthStatus()

  const cardVariants = {
    initial: { scale: 1, rotateY: 0 },
    hover: { 
      scale: 1.02, 
      rotateY: 5,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  }

  const statsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  }

  const statItemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  }

  return (
    <motion.div
      variants={animated ? cardVariants : undefined}
      initial="initial"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative"
    >
      <Card 
        hover={!!onClick} 
        className={`cursor-pointer relative overflow-hidden ${
          isInjured ? 'border-error-600 bg-error-600/5' : ''
        }`}
        onClick={onClick}
      >
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-secondary-600/10 to-transparent opacity-0"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Header Section */}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <motion.h3 
                  className="text-lg font-bold text-white"
                  animate={{ scale: isHovered ? 1.05 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {player.name}
                </motion.h3>
                <PositionBadge position={player.position} />
                
                {/* Health Status */}
                <motion.div
                  className={`flex items-center space-x-1 ${health.color}`}
                  animate={{ scale: isInjured ? [1, 1.1, 1] : 1 }}
                  transition={{ duration: 0.5, repeat: isInjured ? Infinity : 0, repeatDelay: 2 }}
                >
                  {health.icon}
                  <span className="text-xs font-medium">{health.status}</span>
                </motion.div>
              </div>
              
              <div className="flex items-center space-x-3">
                <p className="text-gray-400 text-sm">{player.team}</p>
                <Badge variant="info" size="sm" className={performance.color}>
                  Grade: {performance.grade}
                </Badge>
              </div>
            </div>
            
            {/* Main Fantasy Points */}
            <div className="text-right">
              <motion.div 
                className="text-2xl font-bold text-primary-400"
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {formatNumber(player.total_fantasy_points)}
              </motion.div>
              <div className="text-xs text-gray-400">Total Points</div>
            </div>
          </div>

          {showDetails && (
            <motion.div
              variants={animated ? statsVariants : undefined}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {/* Key Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div variants={statItemVariants} className="text-center">
                  <div className="text-lg font-semibold text-white">
                    {player.avg_fantasy_points.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-400">Avg Points</div>
                </motion.div>
                
                <motion.div variants={statItemVariants} className="text-center">
                  <div className="text-lg font-semibold text-secondary-400">
                    {player.predicted_value.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-400">Predicted Value</div>
                </motion.div>
              </div>

              {/* Volatility & Trends */}
              {showTrends && (
                <motion.div 
                  variants={statItemVariants}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(player.volatility)}
                    <span className={`text-sm font-medium ${getVolatilityColor(player.volatility)}`}>
                      Volatility: {(player.volatility * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Badge variant="info" size="sm">
                    {player.games_played} games
                  </Badge>
                </motion.div>
              )}

              {/* Advanced Stats Toggle */}
              <motion.div variants={statItemVariants}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowAdvanced(!showAdvanced)
                  }}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Stats</span>
                </Button>
              </motion.div>

              {/* Advanced Stats Section */}
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3 pt-3 border-t border-gray-700"
                  >
                    {/* Position-specific stats */}
                    {player.position === 'QB' && (
                      <div className="grid grid-cols-3 gap-2">
                        <motion.div 
                          className="text-center"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <div className="text-sm font-semibold text-white">
                            {formatNumber(player.passing_yds_sum || 0)}
                          </div>
                          <div className="text-xs text-gray-400">Pass Yds</div>
                        </motion.div>
                        <motion.div 
                          className="text-center"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="text-sm font-semibold text-white">
                            {player.passing_td_sum || 0}
                          </div>
                          <div className="text-xs text-gray-400">Pass TDs</div>
                        </motion.div>
                        <motion.div 
                          className="text-center"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="text-sm font-semibold text-error-400">
                            {player.passing_int_sum || 0}
                          </div>
                          <div className="text-xs text-gray-400">INTs</div>
                        </motion.div>
                      </div>
                    )}

                    {player.position === 'RB' && (
                      <div className="grid grid-cols-2 gap-2">
                        <motion.div 
                          className="text-center"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <div className="text-sm font-semibold text-white">
                            {formatNumber(player.rushing_yds_sum || 0)}
                          </div>
                          <div className="text-xs text-gray-400">Rush Yds</div>
                        </motion.div>
                        <motion.div 
                          className="text-center"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="text-sm font-semibold text-white">
                            {player.rushing_td_sum || 0}
                          </div>
                          <div className="text-xs text-gray-400">Rush TDs</div>
                        </motion.div>
                      </div>
                    )}

                    {['WR', 'TE'].includes(player.position) && (
                      <div className="grid grid-cols-3 gap-2">
                        <motion.div 
                          className="text-center"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <div className="text-sm font-semibold text-white">
                            {formatNumber(player.receiving_yds_sum || 0)}
                          </div>
                          <div className="text-xs text-gray-400">Rec Yds</div>
                        </motion.div>
                        <motion.div 
                          className="text-center"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="text-sm font-semibold text-white">
                            {player.receiving_td_sum || 0}
                          </div>
                          <div className="text-xs text-gray-400">Rec TDs</div>
                        </motion.div>
                        <motion.div 
                          className="text-center"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="text-sm font-semibold text-white">
                            {player.receiving_rec_sum || 0}
                          </div>
                          <div className="text-xs text-gray-400">Receptions</div>
                        </motion.div>
                      </div>
                    )}

                    {/* Performance Metrics */}
                    <motion.div 
                      className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-700"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-primary-400" />
                        <div>
                          <div className="text-xs text-gray-400">Consistency</div>
                          <div className="text-sm font-semibold text-white">
                            {player.volatility < 0.2 ? 'High' : player.volatility < 0.3 ? 'Medium' : 'Low'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-secondary-400" />
                        <div>
                          <div className="text-xs text-gray-400">Upside</div>
                          <div className="text-sm font-semibold text-white">
                            {player.predicted_value > player.total_fantasy_points ? 'High' : 'Medium'}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Floating Action Indicators */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute top-2 right-2 flex space-x-1"
            >
              <motion.div
                className="w-2 h-2 bg-primary-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.div
                className="w-2 h-2 bg-secondary-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-2 h-2 bg-success-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Injury Overlay */}
        {isInjured && (
          <motion.div
            className="absolute inset-0 bg-error-600/20 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-error-600 text-white px-3 py-1 rounded-full text-sm font-bold"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              INJURED
            </motion.div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  )
}