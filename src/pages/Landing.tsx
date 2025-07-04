import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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
  Gift,
  Crown,
  Rocket,
  Lightning,
  Globe,
  Code,
  Database,
  Cpu,
  Layers,
  Hexagon,
  Circle
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { PlayerStatsCard } from '../components/player/PlayerStatsCard'
import { FantasyPointsChart } from '../components/charts/FantasyPointsChart'
import { PlayerComparisonChart } from '../components/charts/PlayerComparisonChart'
import { PositionDistributionChart } from '../components/charts/PositionDistributionChart'
import { usePlayerData } from '../hooks/usePlayerData'

export function Landing() {
  const [showDemo, setShowDemo] = useState(false)
  const [currentDemoStep, setCurrentDemoStep] = useState(0)
  const [selectedPlayers, setSelectedPlayers] = useState<any[]>([])
  const [tradePlayer1, setTradePlayer1] = useState<any>(null)
  const [tradePlayer2, setTradePlayer2] = useState<any>(null)
  const [demoTeam, setDemoTeam] = useState<any[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const { players, loading } = usePlayerData()

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'AI-Powered Analytics',
      description: 'Advanced machine learning algorithms analyze player performance and predict future outcomes',
      gradient: 'from-purple-500 to-pink-500',
      delay: 0.1
    },
    {
      icon: <ArrowLeftRight className="w-8 h-8" />,
      title: 'Smart Trade Engine',
      description: 'Get instant trade recommendations with confidence scores and detailed analysis',
      gradient: 'from-blue-500 to-cyan-500',
      delay: 0.2
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Draft Domination',
      description: 'Real-time draft guidance with tier rankings and value-based recommendations',
      gradient: 'from-green-500 to-emerald-500',
      delay: 0.3
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: 'Live Team Management',
      description: 'Complete roster optimization with injury tracking and lineup suggestions',
      gradient: 'from-orange-500 to-red-500',
      delay: 0.4
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: 'Real-Time Data',
      description: 'Live player stats, injury updates, and market trends updated every minute',
      gradient: 'from-indigo-500 to-purple-500',
      delay: 0.5
    },
    {
      icon: <Crown className="w-8 h-8" />,
      title: 'Championship Tools',
      description: 'Advanced analytics and insights used by fantasy football champions',
      gradient: 'from-yellow-500 to-orange-500',
      delay: 0.6
    }
  ]

  const testimonials = [
    {
      name: 'Mike "The Shark" Johnson',
      role: '3x Fantasy Champion',
      content: 'Fantasy Glitch transformed my game completely. The AI trade analysis helped me win my league three years running!',
      rating: 5,
      avatar: '🦈',
      league: '$10,000 Prize Pool'
    },
    {
      name: 'Sarah "Dynasty Queen" Chen',
      role: 'Dynasty League Expert',
      content: 'The predictive analytics are incredible. I can spot breakout players weeks before anyone else in my league.',
      rating: 5,
      avatar: '👑',
      league: '14-Team Dynasty'
    },
    {
      name: 'David "DFS King" Rodriguez',
      role: 'Daily Fantasy Pro',
      content: 'Best fantasy tool ever created. The volatility tracking and player projections are scary accurate.',
      rating: 5,
      avatar: '🎯',
      league: 'DFS Professional'
    },
    {
      name: 'Alex "The Analyst" Thompson',
      role: 'Fantasy Podcast Host',
      content: 'I use Fantasy Glitch for all my research. The depth of analytics is unmatched in the industry.',
      rating: 5,
      avatar: '📊',
      league: '50K+ Listeners'
    }
  ]

  const accessCodes = [
    'GLITCH2024', 'DRAGON101', 'CHAMPION23', 'WIZARD24',
    'ELITE101', 'VICTORY23', 'LEGEND101', 'MASTER24'
  ]

  const stats = [
    { number: '101', label: 'Access Codes', icon: <Key className="w-6 h-6" /> },
    { number: '100%', label: 'Free Access', icon: <Gift className="w-6 h-6" /> },
    { number: '50K+', label: 'Active Users', icon: <Users className="w-6 h-6" /> },
    { number: '99.9%', label: 'Uptime', icon: <Zap className="w-6 h-6" /> }
  ]

  const topDemoPlayers = players.slice(0, 6)
  
  const demoSteps = [
    {
      title: "AI Analytics Dashboard",
      description: "Advanced statistics and performance tracking with machine learning",
      icon: <Brain className="w-6 h-6" />,
      component: "analytics"
    },
    {
      title: "Smart Trade Engine",
      description: "AI-powered trade recommendations with confidence scoring",
      icon: <ArrowLeftRight className="w-6 h-6" />,
      component: "trades"
    },
    {
      title: "Draft Domination",
      description: "Real-time draft guidance with tier-based rankings",
      icon: <Target className="w-6 h-6" />,
      component: "draft"
    },
    {
      title: "Team Command Center",
      description: "Complete roster optimization with injury intelligence",
      icon: <Users className="w-6 h-6" />,
      component: "team"
    },
    {
      title: "Player Intelligence",
      description: "Deep performance analysis and comparison tools",
      icon: <BarChart3 className="w-6 h-6" />,
      component: "comparison"
    }
  ]

  useEffect(() => {
    if (showDemo && players.length > 0) {
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
                { label: "Total Players", value: players.length, color: "text-primary-400", icon: <Users className="w-5 h-5" /> },
                { label: "Avg Points", value: "18.7", color: "text-success-400", icon: <TrendingUp className="w-5 h-5" /> },
                { label: "Top Performer", value: players[0]?.name.split(' ').pop() || "N/A", color: "text-warning-400", icon: <Trophy className="w-5 h-5" /> },
                { label: "AI Accuracy", value: "94.2%", color: "text-secondary-400", icon: <Brain className="w-5 h-5" /> }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                  className="glass-effect rounded-xl p-4 text-center border border-primary-500/20 hover:border-primary-500/40 transition-all duration-300"
                >
                  <div className="flex items-center justify-center mb-2">
                    <div className={`${stat.color}`}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="glass-effect rounded-xl p-6 border border-primary-500/20"
            >
              <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-primary-400" />
                Performance Analytics
              </h4>
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
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="glass-effect rounded-xl p-4 border border-blue-500/20"
              >
                <h4 className="font-bold text-white mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2 text-blue-400" />
                  Your Player
                </h4>
                {tradePlayer1 && (
                  <PlayerStatsCard player={tradePlayer1} showDetails={false} animated={true} />
                )}
              </motion.div>
              
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="glass-effect rounded-xl p-6 text-center border border-success-500/20 bg-gradient-to-br from-success-500/10 to-primary-500/10"
              >
                <motion.div 
                  className="flex items-center justify-center mb-4"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <ArrowLeftRight className="w-8 h-8 text-primary-400" />
                </motion.div>
                <div className="text-3xl font-bold text-success-400 mb-2">ACCEPT</div>
                <div className="text-sm text-gray-400 mb-4">AI Confidence: 95%</div>
                <Badge variant="success" className="animate-pulse">+12.3 Value</Badge>
              </motion.div>
              
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="glass-effect rounded-xl p-4 border border-green-500/20"
              >
                <h4 className="font-bold text-white mb-3 flex items-center">
                  <Target className="w-4 h-4 mr-2 text-green-400" />
                  Target Player
                </h4>
                {tradePlayer2 && (
                  <PlayerStatsCard player={tradePlayer2} showDetails={false} animated={true} />
                )}
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-effect rounded-xl p-4 border border-primary-500/20"
            >
              <h4 className="font-bold text-white mb-3 flex items-center">
                <Brain className="w-4 h-4 mr-2 text-primary-400" />
                AI Analysis Engine
              </h4>
              <div className="space-y-2">
                {[
                  "Target player has higher predicted value (+12.3)",
                  "More consistent performer (lower volatility)",
                  "Better playoff schedule matchups",
                  "No injury concerns detected"
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
              {[
                { label: "Current Pick", value: "#12", color: "text-primary-400", icon: <Target className="w-6 h-6" /> },
                { label: "Next Your Pick", value: "#24", color: "text-secondary-400", icon: <Clock className="w-6 h-6" /> },
                { label: "Team Size", value: "12", color: "text-warning-400", icon: <Users className="w-6 h-6" /> }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ scale: 0, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                  className="glass-effect rounded-xl p-4 text-center border border-primary-500/20"
                >
                  <div className="flex items-center justify-center mb-2">
                    <div className={stat.color}>{stat.icon}</div>
                  </div>
                  <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="glass-effect rounded-xl p-6 border border-primary-500/20"
            >
              <h4 className="font-bold text-white mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-warning-400" />
                AI Draft Recommendations
              </h4>
              <div className="space-y-3">
                {topDemoPlayers.slice(0, 3).map((player, index) => (
                  <motion.div
                    key={player.name}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center justify-between glass-effect rounded-lg p-3 border border-success-500/20 hover:border-success-500/40 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm">
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
                      <div className="text-xs text-gray-400">AI Score</div>
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-xl p-4 border border-error-500/30 bg-gradient-to-r from-error-500/10 to-warning-500/10"
            >
              <div className="flex items-center mb-3">
                <AlertTriangle className="w-5 h-5 text-error-400 mr-2" />
                <h4 className="font-bold text-error-400">Injury Intelligence Alert</h4>
              </div>
              <div className="text-sm text-gray-300">
                {players[1]?.name} injury detected. AI suggests 3 optimal replacements below.
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="glass-effect rounded-xl p-6 border border-primary-500/20"
              >
                <h4 className="font-bold text-white mb-4 flex items-center">
                  <Users className="w-4 h-4 mr-2 text-primary-400" />
                  My Team (4/15)
                </h4>
                <div className="space-y-3">
                  {players.slice(0, 3).map((player, index) => (
                    <motion.div
                      key={player.name}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center space-x-3 glass-effect rounded-lg p-3 border border-secondary-500/20"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-secondary-500 to-primary-500 flex items-center justify-center text-white font-bold text-xs">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white">{player.name}</div>
                        <div className="text-sm text-gray-400">{player.position} • {player.team}</div>
                      </div>
                      {index === 1 && (
                        <Badge variant="error" size="sm" className="animate-pulse">Injured</Badge>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="glass-effect rounded-xl p-6 border border-success-500/20"
              >
                <h4 className="font-bold text-white mb-4 flex items-center">
                  <Target className="w-4 h-4 mr-2 text-success-400" />
                  Optimal Lineup
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {['QB', 'RB1', 'RB2', 'WR1', 'WR2', 'TE', 'FLEX', 'K'].map((position, index) => (
                    <motion.div
                      key={position}
                      initial={{ scale: 0, rotate: 180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.8 + index * 0.05, type: "spring" }}
                      className="glass-effect rounded-lg p-3 text-center border border-warning-500/20 hover:border-warning-500/40 transition-all duration-300"
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-xl p-6 border border-primary-500/20"
            >
              <h4 className="font-bold text-white mb-4 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2 text-primary-400" />
                Player Intelligence Radar
              </h4>
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
                  className="glass-effect rounded-xl p-4 border border-secondary-500/20"
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
    <div className="min-h-screen bg-dark-900 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-secondary-900/20 to-dark-900"></div>
        
        {/* Floating Orbs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-64 h-64 rounded-full opacity-10 ${
              i % 3 === 0 ? 'bg-primary-500' : i % 3 === 1 ? 'bg-secondary-500' : 'bg-success-500'
            }`}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 10}%`,
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 h-full">
            {[...Array(144)].map((_, i) => (
              <motion.div
                key={i}
                className="border border-primary-500"
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-50 bg-dark-900/95 backdrop-blur-lg border-b border-gray-800/50 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-8 h-8 text-primary-500" />
              </motion.div>
              <span className="text-2xl font-bold gradient-text">Fantasy Glitch</span>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <Code className="w-4 h-4 mr-2" />
                  Access Codes
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="sm" className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700">
                  <Key className="w-4 h-4 mr-2" />
                  Get Access
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <motion.h1 
                  className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  style={{
                    background: "linear-gradient(45deg, #3B82F6, #8B5CF6, #06D6A0, #3B82F6)",
                    backgroundSize: "300% 300%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Fantasy Glitch
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="flex items-center justify-center space-x-4 mb-8"
                >
                  <Badge variant="success" className="text-lg px-4 py-2 animate-pulse">
                    <Gift className="w-5 h-5 mr-2" />
                    100% FREE
                  </Badge>
                  <Badge variant="info" className="text-lg px-4 py-2">
                    <Key className="w-5 h-5 mr-2" />
                    101 Access Codes
                  </Badge>
                </motion.div>
              </motion.div>

              <motion.p 
                className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                The ultimate fantasy football analytics platform powered by{' '}
                <span className="gradient-text font-bold">artificial intelligence</span>.
                Make smarter decisions with advanced insights and predictive modeling.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    className="text-xl px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 shadow-2xl"
                    onClick={() => window.location.href = '/dashboard'}
                  >
                    <Rocket className="w-6 h-6 mr-3" />
                    Launch Platform
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="secondary" 
                    size="lg" 
                    className="text-xl px-8 py-4 border-2 border-primary-500 hover:bg-primary-500/10"
                    onClick={() => setShowDemo(true)}
                  >
                    <Play className="w-6 h-6 mr-3" />
                    Watch Demo
                  </Button>
                </motion.div>
              </motion.div>

              {/* Stats */}
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + index * 0.1, type: "spring" }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <div className="text-primary-400">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                      {stat.number}
                    </div>
                    <div className="text-gray-400 text-sm md:text-base">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 lg:py-32 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Dominate Your League
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                Comprehensive AI-powered tools and analytics to give you the ultimate competitive edge
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: feature.delay, duration: 0.8 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 5,
                    transition: { duration: 0.3 }
                  }}
                  className="group"
                >
                  <Card className="h-full border border-gray-700/50 hover:border-primary-500/50 transition-all duration-500 bg-gradient-to-br from-dark-800/50 to-dark-900/50 backdrop-blur-lg">
                    <div className="p-8">
                      <motion.div 
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <div className="text-white">
                          {feature.icon}
                        </div>
                      </motion.div>
                      
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      
                      <p className="text-gray-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 lg:py-32 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Trusted by Champions
              </h2>
              <p className="text-xl md:text-2xl text-gray-300">
                See what fantasy football legends are saying about Fantasy Glitch
              </p>
            </motion.div>
            
            <div className="relative max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border border-primary-500/30 bg-gradient-to-br from-primary-600/10 to-secondary-600/10 backdrop-blur-lg">
                    <div className="p-8 md:p-12 text-center">
                      <div className="text-6xl mb-6">
                        {testimonials[currentTestimonial].avatar}
                      </div>
                      
                      <div className="flex items-center justify-center mb-6">
                        {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <Star className="w-6 h-6 text-yellow-400 fill-current" />
                          </motion.div>
                        ))}
                      </div>
                      
                      <blockquote className="text-xl md:text-2xl text-gray-300 mb-8 italic leading-relaxed">
                        "{testimonials[currentTestimonial].content}"
                      </blockquote>
                      
                      <div>
                        <div className="font-bold text-white text-xl mb-1">
                          {testimonials[currentTestimonial].name}
                        </div>
                        <div className="text-primary-400 font-semibold mb-1">
                          {testimonials[currentTestimonial].role}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {testimonials[currentTestimonial].league}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </AnimatePresence>
              
              {/* Testimonial Indicators */}
              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <motion.button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial ? 'bg-primary-500 scale-125' : 'bg-gray-600'
                    }`}
                    onClick={() => setCurrentTestimonial(index)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Access Section */}
        <section className="py-20 lg:py-32 relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                100% Free Access
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 mb-12">
                Get full access to all premium features with any valid access code
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <Card className="border-2 border-primary-500 bg-gradient-to-br from-primary-600/20 to-secondary-600/20 backdrop-blur-lg">
                <div className="p-8 md:p-12">
                  <motion.div 
                    className="w-20 h-20 bg-gradient-to-br from-success-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-8"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    <Gift className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <h3 className="text-3xl font-bold text-white mb-4">Full Platform Access</h3>
                  
                  <div className="text-6xl font-bold gradient-text mb-4">
                    FREE
                  </div>
                  
                  <p className="text-gray-300 mb-8 text-lg">
                    101 access codes available • No restrictions • No tiers
                  </p>
                  
                  <div className="space-y-6 mb-8">
                    <div className="grid grid-cols-2 gap-4">
                      {accessCodes.slice(0, 4).map((code, index) => (
                        <motion.div
                          key={code}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          viewport={{ once: true }}
                          whileHover={{ scale: 1.05 }}
                          className="cursor-pointer"
                        >
                          <Badge 
                            variant="success" 
                            className="font-mono text-lg px-4 py-2 w-full justify-center hover:bg-success-500 transition-colors duration-300"
                          >
                            {code}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      viewport={{ once: true }}
                      className="glass-effect rounded-lg p-4"
                    >
                      <h4 className="font-semibold text-white mb-3">Try These Codes:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {accessCodes.slice(4, 8).map((code, index) => (
                          <motion.div
                            key={code}
                            whileHover={{ scale: 1.02 }}
                            className="cursor-pointer"
                          >
                            <Badge variant="info" className="font-mono text-sm w-full justify-center">
                              {code}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      size="lg" 
                      className="w-full text-xl py-4 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 shadow-2xl"
                      onClick={() => window.location.href = '/dashboard'}
                    >
                      <Key className="w-6 h-6 mr-3" />
                      Enter Platform
                      <Lightning className="w-6 h-6 ml-3" />
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-32 relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Ready to Dominate?
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 mb-12">
                Join thousands of fantasy managers using Fantasy Glitch to win their leagues
              </p>
            </motion.div>
            
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="glass-effect rounded-xl p-8 max-w-2xl mx-auto border border-primary-500/30">
                <h3 className="text-2xl font-bold text-white mb-6">Get Your Access Code</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {['GLITCH2024', 'FANTASY101', 'CHAMPION23', 'ELITE101'].map((code, index) => (
                    <motion.div
                      key={code}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05 }}
                      className="cursor-pointer"
                    >
                      <Badge 
                        variant="success" 
                        className="font-mono text-lg py-3 w-full justify-center hover:bg-success-500 transition-all duration-300"
                      >
                        {code}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
                <p className="text-sm text-gray-400 mb-6">
                  Use any of these codes for instant full access • 97 more available
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    className="w-full text-xl py-4 bg-gradient-to-r from-success-600 to-primary-600 hover:from-success-700 hover:to-primary-700"
                    onClick={() => window.location.href = '/dashboard'}
                  >
                    <Crown className="w-6 h-6 mr-3" />
                    Launch Fantasy Glitch
                    <Rocket className="w-6 h-6 ml-3" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-dark-800/50 backdrop-blur-lg border-t border-gray-700/50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <motion.div 
                className="flex items-center space-x-2 mb-4 md:mb-0"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-6 h-6 text-primary-500" />
                </motion.div>
                <span className="text-xl font-bold gradient-text">Fantasy Glitch</span>
              </motion.div>
              <div className="text-gray-400 text-sm">
                © 2024 Fantasy Glitch. All rights reserved. • 100% Free Access
              </div>
            </div>
          </div>
        </footer>
      </div>

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
            className="w-full max-w-7xl max-h-[95vh] overflow-hidden bg-dark-900/95 backdrop-blur-lg rounded-2xl border border-primary-500/30 shadow-2xl"
          >
            {/* Demo Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 border-b border-gray-700/50 bg-gradient-to-r from-primary-900/20 to-secondary-900/20">
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
                <p className="text-gray-400 text-sm md:text-base">Experience the power of AI-driven fantasy analytics</p>
                
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
              
              <motion.button
                onClick={() => setShowDemo(false)}
                className="text-gray-400 hover:text-white transition-colors mt-2 md:mt-0 p-2 rounded-lg hover:bg-gray-800"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Demo Navigation */}
            <div className="border-b border-gray-700/50 bg-dark-800/50">
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
                  <motion.button
                    onClick={prevStep}
                    className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 text-gray-400 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </motion.button>
                  
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
                  
                  <motion.button
                    onClick={nextStep}
                    className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 text-gray-400 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
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
            <div className="border-t border-gray-700/50 p-4 md:p-6 bg-gradient-to-r from-primary-600/10 to-secondary-600/10">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <div className="text-center md:text-left">
                  <h4 className="font-bold text-white mb-1">Ready to Dominate Your League?</h4>
                  <p className="text-gray-400 text-sm">
                    This is just a preview. Get full access with any valid code.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      size="lg" 
                      onClick={() => {
                        setShowDemo(false)
                        window.location.href = '/dashboard'
                      }}
                      className="w-full sm:w-auto bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
                    >
                      <ZapIcon className="w-4 h-4 mr-2" />
                      Get Free Access
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="secondary" 
                      size="lg"
                      onClick={() => setShowDemo(false)}
                      className="w-full sm:w-auto"
                    >
                      Close Demo
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Floating AI Badge */}
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div 
          className="glass-effect rounded-full p-3 border border-primary-600 bg-gradient-to-r from-primary-600/20 to-secondary-600/20"
          animate={{ 
            boxShadow: [
              "0 0 20px rgba(59, 130, 246, 0.3)",
              "0 0 40px rgba(139, 92, 246, 0.5)",
              "0 0 20px rgba(59, 130, 246, 0.3)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-4 h-4 text-primary-400" />
            </motion.div>
            <span>AI-Powered</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}