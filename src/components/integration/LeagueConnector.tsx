import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ExternalLink, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Loader,
  Shield,
  Users,
  Trophy,
  BarChart3,
  Wifi,
  WifiOff,
  Info
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Badge } from '../ui/Badge'

interface LeagueConnectorProps {
  onConnect: (platform: string, leagueId: string) => void
}

export function LeagueConnector({ onConnect }: LeagueConnectorProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [leagueId, setLeagueId] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [connected, setConnected] = useState(false)

  const platforms = [
    {
      id: 'nfl',
      name: 'NFL Fantasy',
      description: 'Connect to your NFL.com fantasy league',
      icon: '🏈',
      features: ['Live roster sync', 'Real-time scoring', 'Trade tracking', 'Waiver wire monitoring'],
      instructions: 'Enter your NFL Fantasy League ID (found in league URL)',
      placeholder: 'League ID (e.g., 123456)',
      status: 'live',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      id: 'sleeper',
      name: 'Sleeper',
      description: 'Connect to your Sleeper fantasy league',
      icon: '😴',
      features: ['Real-time roster sync', 'Live scoring', 'Trade tracking', 'Dynasty support'],
      instructions: 'Enter your Sleeper League ID (found in league URL)',
      placeholder: 'League ID (e.g., 789012345678901234)',
      status: 'live',
      color: 'from-purple-600 to-indigo-600'
    }
  ]

  const handleConnect = async () => {
    if (!selectedPlatform || !leagueId) return
    
    setConnecting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setConnected(true)
    setConnecting(false)
    onConnect(selectedPlatform, leagueId)
  }

  if (connected) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 bg-success-600 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-white mb-4">League Connected Successfully!</h2>
        <p className="text-gray-400 mb-6">
          Your {platforms.find(p => p.id === selectedPlatform)?.name} league is now synced with Fantasy Glitch
        </p>
        
        <div className="flex justify-center space-x-4">
          <Badge variant="success" className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Live Sync Active</span>
          </Badge>
          <Badge variant="info" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>12 Team League</span>
          </Badge>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Connect Your Fantasy League</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Sync your existing fantasy league for real-time roster management, 
          trade analysis, and personalized recommendations.
        </p>
      </div>

      {!selectedPlatform ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {platforms.map((platform) => (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                hover 
                className="cursor-pointer h-full relative overflow-hidden"
                onClick={() => setSelectedPlatform(platform.id)}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-10`}></div>
                
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">{platform.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-bold text-white">{platform.name}</h3>
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
                      <p className="text-gray-400 text-sm mb-4">{platform.description}</p>
                      
                      <div className="space-y-2">
                        {platform.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-success-400" />
                            <span className="text-sm text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <span className="text-2xl mr-3">
                    {platforms.find(p => p.id === selectedPlatform)?.icon}
                  </span>
                  Connect to {platforms.find(p => p.id === selectedPlatform)?.name}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedPlatform(null)}
                >
                  Back
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="glass-effect rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Shield className="w-5 h-5 text-primary-400" />
                  <h4 className="font-semibold text-white">Secure Connection</h4>
                </div>
                <p className="text-sm text-gray-400">
                  We use read-only access to sync your league data. We never modify your lineup or make trades.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {platforms.find(p => p.id === selectedPlatform)?.instructions}
                </label>
                <Input
                  value={leagueId}
                  onChange={(e) => setLeagueId(e.target.value)}
                  placeholder={platforms.find(p => p.id === selectedPlatform)?.placeholder}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-white">What you'll get:</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: <Users className="w-4 h-4" />, text: 'Live roster sync' },
                    { icon: <Trophy className="w-4 h-4" />, text: 'Real-time scoring' },
                    { icon: <BarChart3 className="w-4 h-4" />, text: 'Advanced analytics' },
                    { icon: <Zap className="w-4 h-4" />, text: 'AI recommendations' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="text-primary-400">{item.icon}</div>
                      <span className="text-sm text-gray-300">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleConnect}
                disabled={!leagueId || connecting}
                className="w-full"
                size="lg"
              >
                {connecting ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Connect League
                  </>
                )}
              </Button>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  By connecting, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}