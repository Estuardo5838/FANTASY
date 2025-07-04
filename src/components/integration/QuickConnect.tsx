import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, 
  ExternalLink, 
  CheckCircle, 
  Loader, 
  AlertCircle,
  Copy,
  Eye,
  EyeOff,
  Info,
  Wifi,
  WifiOff
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { useLeagueConnection } from '../../hooks/useLeagueConnection'

interface QuickConnectProps {
  onSuccess?: () => void
}

export function QuickConnect({ onSuccess }: QuickConnectProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('')
  const [leagueId, setLeagueId] = useState('')
  const [teamId, setTeamId] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const { connectLeague, loading, error } = useLeagueConnection()

  const platforms = [
    {
      id: 'nfl',
      name: 'NFL Fantasy',
      icon: '🏈',
      color: 'bg-blue-600',
      description: 'Connect your NFL.com league',
      example: 'League ID: 123456',
      status: 'live',
      instructions: [
        'Go to your NFL Fantasy league',
        'Look at the URL: fantasy.nfl.com/league/[LEAGUE_ID]',
        'Copy the League ID (6-digit number)',
        'Paste it below for instant connection'
      ]
    },
    {
      id: 'sleeper',
      name: 'Sleeper',
      icon: '😴',
      color: 'bg-purple-600',
      description: 'Connect your Sleeper league',
      example: 'League ID: 789012345678901234',
      status: 'live',
      instructions: [
        'Go to your Sleeper league',
        'Look at the URL: sleeper.app/leagues/[LEAGUE_ID]/team',
        'Copy the League ID (long number)',
        'Paste it below'
      ]
    }
  ]

  const handleConnect = async () => {
    if (!selectedPlatform || !leagueId) return

    try {
      console.log(`🔗 Attempting to connect ${selectedPlatform} league: ${leagueId}`)
      await connectLeague(selectedPlatform, leagueId, teamId || undefined)
      console.log('✅ Connection successful!')
      onSuccess?.()
    } catch (err) {
      console.error('❌ Connection failed:', err)
      // Error is handled by the hook and displayed in UI
    }
  }

  const copyExampleId = (example: string) => {
    const id = example.split(': ')[1]
    navigator.clipboard.writeText(id)
    setLeagueId(id)
  }

  const selectedPlatformData = platforms.find(p => p.id === selectedPlatform)

  return (
    <div className="space-y-6">
      {/* Platform Selection */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Choose Your Platform</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {platforms.map((platform) => (
            <motion.div
              key={platform.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                hover
                className={`cursor-pointer transition-all duration-300 ${
                  selectedPlatform === platform.id 
                    ? 'ring-2 ring-primary-500 bg-primary-600/10' 
                    : ''
                }`}
                onClick={() => setSelectedPlatform(platform.id)}
              >
                <div className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-12 h-12 ${platform.color} rounded-lg flex items-center justify-center text-2xl`}>
                      {platform.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-white">{platform.name}</h4>
                        {platform.status === 'live' ? (
                          <Badge variant="success" size="sm" className="flex items-center space-x-1">
                            <Wifi className="w-3 h-3" />
                            <span>Live</span>
                          </Badge>
                        ) : (
                          <Badge variant="warning" size="sm" className="flex items-center space-x-1">
                            <WifiOff className="w-3 h-3" />
                            <span>Demo</span>
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{platform.description}</p>
                    </div>
                    {selectedPlatform === platform.id && (
                      <CheckCircle className="w-5 h-5 text-success-400" />
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Connection Form */}
      <AnimatePresence>
        {selectedPlatform && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Instructions */}
            {selectedPlatformData && (
              <div className="glass-effect rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3 flex items-center">
                  <Info className="w-4 h-4 mr-2" />
                  How to find your {selectedPlatformData.name} League ID
                </h4>
                <ol className="space-y-2">
                  {selectedPlatformData.instructions.map((instruction, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-start space-x-2">
                      <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* League ID Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">
                  League ID
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const platform = platforms.find(p => p.id === selectedPlatform)
                    if (platform) copyExampleId(platform.example)
                  }}
                  className="text-xs flex items-center space-x-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Use Example</span>
                </Button>
              </div>
              
              <Input
                value={leagueId}
                onChange={(e) => setLeagueId(e.target.value)}
                placeholder={platforms.find(p => p.id === selectedPlatform)?.example}
                className="w-full"
              />
              
              <p className="text-xs text-gray-500 mt-1">
                Find this in your league settings or URL
              </p>
            </div>

            {/* Advanced Options */}
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center space-x-2"
              >
                {showAdvanced ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>Advanced Options</span>
              </Button>

              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3"
                  >
                    <Input
                      label="Team ID (Optional)"
                      value={teamId}
                      onChange={(e) => setTeamId(e.target.value)}
                      placeholder="Your team ID in the league"
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave blank to auto-detect your team
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 p-3 bg-error-600/20 border border-error-600 rounded-lg"
              >
                <AlertCircle className="w-4 h-4 text-error-400" />
                <span className="text-error-400 text-sm">{error}</span>
              </motion.div>
            )}

            {/* Connect Button */}
            <Button
              onClick={handleConnect}
              disabled={!leagueId || loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Connecting to {selectedPlatformData?.name}...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Connect {selectedPlatformData?.name} League
                </>
              )}
            </Button>

            {/* Status Info */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                {selectedPlatformData?.status === 'live' 
                  ? 'Real-time data will be synced automatically'
                  : 'Demo mode - shows sample data for testing'
                }
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}