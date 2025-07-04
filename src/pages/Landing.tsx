import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { 
  Zap, 
  BarChart3, 
  Users, 
  Trophy, 
  TrendingUp, 
  Shield,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  X,
  Activity,
  Target,
  Brain,
  Smartphone,
  Monitor,
  ArrowLeftRight,
  AlertTriangle,
  Sparkles,
  Zap as ZapIcon,
  ChevronRight,
  ChevronLeft,
  Key,
  Gift
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { PlayerStatsCard } from '../components/player/PlayerStatsCard'
import { FantasyPointsChart } from '../components/charts/FantasyPointsChart'
import { PlayerComparisonChart } from '../components/charts/PlayerComparisonChart'
import { PositionDistributionChart } from '../components/charts/PositionDistributionChart'
import { usePlayerData } from '../hooks/usePlayerData'
import { motion, AnimatePresence } from 'framer-motion'

export function Landing() {
  const [showDemo, setShowDemo] = useState(false)
  const [currentDemoStep, setCurrentDemoStep] = useState(0)
  const [selectedPlayers, setSelectedPlayers] = useState<any[]>([])
  const [tradePlayer1, setTradePlayer1] = useState<any>(null)
  const [tradePlayer2, setTradePlayer2] = useState<any>(null)
  const [demoTeam, setDemoTeam] = useState<any[]>([])
  const { players, loading } = usePlayerData()

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Advanced Analytics',
      description: 'Deep statistical analysis with predictive modeling and volatility tracking'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Trade Center',
      description: 'Smart trade recommendations with AI-powered value analysis'
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: 'Draft Assistant',
      description: 'Real-time draft guidance with tier-based recommendations'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Player Projections',
      description: 'Machine learning predictions based on historical performance'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Team Management',
      description: 'Complete roster management with lineup optimization'
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Market Analysis',
      description: 'Track player values and market trends in real-time'
    }
  ]

  const testimonials = [
    {
      name: 'Mike Johnson',
      role: 'Fantasy Champion 2023',
      content: 'Fantasy Glitch helped me win my league with incredible trade insights and player analysis.',
      rating: 5
    },
    {
      name: 'Sarah Chen',
      role: 'Dynasty League Manager',
      content: 'The predictive analytics are game-changing. I can see player trends weeks ahead.',
      rating: 5
    },
    {
      name: 'David Rodriguez',
      role: 'DFS Professional',
      content: 'Best fantasy tool I\'ve ever used. The volatility tracking is incredibly accurate.',
      rating: 5
    }
  ]

  const pricingFeatures = [
    'Advanced player analytics',
    'Trade value calculator',
    'Draft assistant with AI',
    'Team management tools',
    'Market trend analysis',
    'League integration',
    'Injury tracking',
    'Player comparison tools'
  ]

  const topDemoPlayers = players.slice(0, 6)
  
  const demoSteps = [
    {
      title: "Player Analytics Dashboard",
      description: "Advanced statistics and performance tracking",
      icon: <Activity className="w-6 h-6" />,
      component: "analytics"
    },
    {
      title: "AI-Powered Trade Analysis",
      description: "Smart trade recommendations with confidence scores",
      icon: <ArrowLeftRight className="w-6 h-6" />,
      component: "trades"
    },
    {
      title: "Draft Assistant",
      description: "Real-time draft guidance and tier rankings",
      icon: <Target className="w-6 h-6" />,
      component: "draft"
    },
    {
      title: "Team Management",
      description: "Optimize your roster with injury tracking",
      icon: <Users className="w-6 h-6" />,
      component: "team"
    },
    {
      title: "Player Comparison",
      description: "Side-by-side performance analysis",
      icon: <BarChart3 className="w-6 h-6" />,
      component: "comparison"
    }
  ]

  useEffect(() => {
    if (showDemo && players.length > 0) {
      // Auto-populate demo data
      setSelectedPlayers([players[0], players[1]])
      setTradePlayer1(players[0])
      setTradePlayer2(players[1])
      setDemoTeam(players.slice(0, 4))
    }
  }, [showDemo, players])

  const nextStep = () => {
    setCurrentDemoStep((prev) => (prev + 1) % demoSteps.length)
  }

  const prevStep = () => {
    setCurrentDemoStep((prev) => (prev - 1 + demoSteps.length) % demoSteps.length)
  }

  const renderDemoContent = () => {
    const step = demoSteps[currentDemoStep]
    
    switch (step.component) {
      case "analytics":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Players", value: players.length, color: "text-primary-400" },
                { label: "Avg Points", value: "18.7", color: "text-success-400" },
                { label: "Top Performer", value: players[0]?.name.split(' ').pop() || "N/A", color: "text-warning-400" },
                { label: "Positions", value: "4", color: "text-secondary-400" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-effect rounded-lg p-4 text-center"
                >
                  <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="glass-effect rounded-lg p-6"
            >
              <h4 className="text-lg font-bold text-white mb-4">Performance Chart</h4>
              {topDemoPlayers.length > 0 && (
                <FantasyPointsChart players={topDemoPlayers} type="area" />
              )}
            </motion.div>
          </motion.div>
        )
        
      case "trades":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="glass-effect rounded-lg p-4"
              >
                <h4 className="font-bold text-white mb-3">Your Player</h4>
                {tradePlayer1 && (
                  <PlayerStatsCard player={tradePlayer1} showDetails={false} animated={true} />
                )}
              </motion.div>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
                className="glass-effect rounded-lg p-6 text-center"
              >
                <div className="flex items-center justify-center mb-4">
                  <ArrowLeftRight className="w-8 h-8 text-primary-400" />
                </div>
                <div className="text-2xl font-bold text-success-400 mb-2">ACCEPT</div>
                <div className="text-sm text-gray-400 mb-4">95% Confidence</div>
                <Badge variant="success">+12.3 Value</Badge>
              </motion.div>
              
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="glass-effect rounded-lg p-4"
              >
                <h4 className="font-bold text-white mb-3">Target Player</h4>
                {tradePlayer2 && (
                  <PlayerStatsCard player={tradePlayer2} showDetails={false} animated={true} />
                )}
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="glass-effect rounded-lg p-4"
            >
              <h4 className="font-bold text-white mb-3">AI Analysis</h4>
              <div className="space-y-2">
                {[
                  "Target player has higher predicted value (+12.3)",
                  "More consistent performer (lower volatility)",
                  "Better playoff schedule matchups",
                  "No injury concerns"
                ].map((reason, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center space-x-2 text-sm text-gray-300"
                  >
                    <CheckCircle className="w-4 h-4 text-success-400" />
                    <span>{reason}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )
        
      case "draft":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="glass-effect rounded-lg p-4 text-center"
              >
                <div className="text-3xl font-bold text-primary-400 mb-2">#12</div>
                <div className="text-sm text-gray-400">Current Pick</div>
              </motion.div>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="glass-effect rounded-lg p-4 text-center"
              >
                <div className="text-3xl font-bold text-secondary-400 mb-2">#24</div>
                <div className="text-sm text-gray-400">Next Your Pick</div>
              </motion.div>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
                className="glass-effect rounded-lg p-4 text-center"
              >
                <div className="text-3xl font-bold text-warning-400 mb-2">12</div>
                <div className="text-sm text-gray-400">Team Size</div>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="glass-effect rounded-lg p-6"
            >
              <h4 className="font-bold text-white mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2" />
                AI Recommendations
              </h4>
              <div className="space-y-3">
                {topDemoPlayers.slice(0, 3).map((player, index) => (
                  <motion.div
                    key={player.name}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center justify-between glass-effect rounded-lg p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{player.name}</div>
                        <div className="text-sm text-gray-400">{player.position} • {player.team}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary-400">
                        {(95 - index * 5).toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-400">Value Score</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )
        
      case "team":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-lg p-4 border border-error-600 bg-error-600/10"
            >
              <div className="flex items-center mb-3">
                <AlertTriangle className="w-5 h-5 text-error-400 mr-2" />
                <h4 className="font-bold text-error-400">Injury Alert</h4>
              </div>
              <div className="text-sm text-gray-300">
                {players[1]?.name} is injured. Find replacement suggestions below.
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="glass-effect rounded-lg p-6"
              >
                <h4 className="font-bold text-white mb-4">My Team (4/15)</h4>
                <div className="space-y-3">
                  {players.slice(0, 3).map((player, index) => (
                    <motion.div
                      key={player.name}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center space-x-3 glass-effect rounded-lg p-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-secondary-600 flex items-center justify-center text-white font-bold text-xs">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white">{player.name}</div>
                        <div className="text-sm text-gray-400">{player.position} • {player.team}</div>
                      </div>
                      {index === 1 && (
                        <Badge variant="error" size="sm">Injured</Badge>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="glass-effect rounded-lg p-6"
              >
                <h4 className="font-bold text-white mb-4">Optimal Lineup</h4>
                <div className="grid grid-cols-2 gap-3">
                  {['QB', 'RB1', 'RB2', 'WR1', 'WR2', 'TE', 'FLEX', 'K'].map((position, index) => (
                    <motion.div
                      key={position}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.05 }}
                      className="glass-effect rounded-lg p-3 text-center"
                    >
                      <Badge variant="info" size="sm" className="mb-2">{position}</Badge>
                      <div className="text-sm font-medium text-white">
                        {index < demoTeam.length ? demoTeam[index].name.split(' ').pop() : 'Empty'}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )
        
      case "comparison":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-lg p-6"
            >
              <h4 className="font-bold text-white mb-4">Player Comparison Radar</h4>
              {selectedPlayers.length > 0 && (
                <PlayerComparisonChart players={selectedPlayers} type="radar" />
              )}
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedPlayers.slice(0, 2).map((player, index) => (
                <motion.div
                  key={player.name}
                  initial={{ x: index === 0 ? -50 : 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.2 }}
                  className="glass-effect rounded-lg p-4"
                >
                  <PlayerStatsCard player={player} animated={true} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )
        
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="bg-dark-900/95 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-primary-500" />
              <span className="text-2xl font-bold gradient-text">Fantasy Glitch</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-secondary-900/20 to-dark-900"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">Fantasy Glitch</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            The ultimate fantasy football analytics platform. Make smarter decisions with AI-powered insights, 
            advanced statistics, and predictive modeling.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button 
              variant="secondary" 
              size="lg" 
              className="w-full sm:w-auto"
              onClick={() => setShowDemo(true)}
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need to Dominate
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Comprehensive tools and analytics to give you the competitive edge in fantasy football
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} hover className="text-center">
                <div className="text-primary-500 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by Champions
            </h2>
            <p className="text-xl text-gray-300">
              See what our users are saying about Fantasy Glitch
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      {/* Access Section */}
      <section className="py-20 bg-dark-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            100% Free Access
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Get full access to all features with any valid access code
          </p>
          
          <Card className="max-w-md mx-auto" gradient>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Full Access</h3>
              <div className="text-5xl font-bold gradient-text mb-2">
                FREE
              </div>
              <p className="text-gray-300 mb-6">101 access codes available</p>
              
              <div className="space-y-3 mb-8">
                {pricingFeatures.slice(0, 6).map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-success-400 mr-3" />
                    <span className="text-white">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                <div className="glass-effect rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Try These Codes:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {['GLITCH2024', 'DRAGON101', 'CHAMPION23', 'WIZARD24'].map(code => (
                      <Badge key={code} variant="success" className="font-mono">
                        {code}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button size="lg" className="w-full" onClick={() => setShowDemo(true)}>
                  <Key className="w-4 h-4 mr-2" />
                  Get Access Code
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Win Your League?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of fantasy managers using Fantasy Glitch with free access codes
          </p>
          <div className="space-y-4">
            <div className="glass-effect rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-white mb-4">Get Your Access Code</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {['GLITCH2024', 'FANTASY101', 'CHAMPION23', 'ELITE101'].map(code => (
                  <Badge key={code} variant="success" className="font-mono text-center py-2">
                    {code}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Use any of these codes for instant full access
              </p>
              <Button size="lg" className="w-full" onClick={() => window.location.href = '/dashboard'}>
                <Key className="w-4 h-4 mr-2" />
                Enter Platform
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-800 border-t border-gray-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Zap className="w-6 h-6 text-primary-500" />
              <span className="text-xl font-bold gradient-text">Fantasy Glitch</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 Fantasy Glitch. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      {showDemo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center p-2 md:p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-7xl max-h-[95vh] overflow-hidden bg-dark-900 rounded-xl border border-gray-700 shadow-2xl"
          >
            {/* Demo Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 border-b border-gray-700 bg-gradient-to-r from-primary-900/20 to-secondary-900/20">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-6 h-6 text-primary-400" />
                  </motion.div>
                  <h2 className="text-xl md:text-2xl font-bold gradient-text">Fantasy Glitch Demo</h2>
                </div>
                <p className="text-gray-400 text-sm md:text-base">Experience the power of advanced fantasy analytics</p>
                
                {/* Device indicators */}
                <div className="flex items-center space-x-4 mt-3">
                  <div className="flex items-center space-x-2">
                    <Monitor className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-400 hidden md:inline">Desktop Optimized</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-400 hidden md:inline">Mobile Responsive</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setShowDemo(false)}
                className="text-gray-400 hover:text-white transition-colors mt-2 md:mt-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Demo Navigation */}
            <div className="border-b border-gray-700 bg-dark-800/50">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                  <motion.div
                    key={currentDemoStep}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="text-primary-400">
                      {demoSteps[currentDemoStep].icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm md:text-base">
                        {demoSteps[currentDemoStep].title}
                      </h3>
                      <p className="text-gray-400 text-xs md:text-sm">
                        {demoSteps[currentDemoStep].description}
                      </p>
                    </div>
                  </motion.div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={prevStep}
                    className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 text-gray-400 hover:text-white transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <div className="flex space-x-1">
                    {demoSteps.map((_, index) => (
                      <motion.div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentDemoStep ? 'bg-primary-400' : 'bg-gray-600'
                        }`}
                        animate={{
                          scale: index === currentDemoStep ? 1.2 : 1
                        }}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={nextStep}
                    className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 text-gray-400 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Demo Content */}
            <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
              <AnimatePresence mode="wait">
                {renderDemoContent()}
              </AnimatePresence>
            </div>

            {/* Demo Footer */}
            <div className="border-t border-gray-700 p-4 md:p-6 bg-gradient-to-r from-primary-600/10 to-secondary-600/10">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <div className="text-center md:text-left">
                  <h4 className="font-bold text-white mb-1">Ready to Dominate Your League?</h4>
                  <p className="text-gray-400 text-sm">
                    This is just a preview. Get full access with your free trial.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/signup">
                    <Button size="lg" onClick={() => setShowDemo(false)} className="w-full sm:w-auto">
                      <ZapIcon className="w-4 h-4 mr-2" />
                      Start Free Trial
                    </Button>
                  </Link>
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={() => setShowDemo(false)}
                    className="w-full sm:w-auto"
                  >
                    Close Demo
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Auto-advance demo steps */}
      {showDemo && (
        <motion.div
          className="fixed bottom-4 right-4 z-50"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="glass-effect rounded-lg p-3 border border-primary-600">
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <Brain className="w-4 h-4 text-primary-400" />
              <span>AI-Powered Demo</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}