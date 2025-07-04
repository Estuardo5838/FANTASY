import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Zap, 
  Key, 
  CheckCircle, 
  AlertCircle, 
  Sparkles,
  Lock,
  Unlock,
  Gift,
  Star,
  BarChart3,
  Users,
  Trophy,
  TrendingUp,
  ArrowRight,
  Crown,
  Wifi,
  Activity
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { useCodeAccess } from '../hooks/useCodeAccess'

export function Landing() {
  const [code, setCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { submitCode, error, totalCodes } = useCodeAccess()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const success = submitCode(code)
    if (!success) {
      setCode('')
    }
    
    setIsSubmitting(false)
  }

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Advanced Analytics',
      description: 'Deep statistical analysis with AI-powered insights and predictive modeling'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Trade Center',
      description: 'Smart trade recommendations with confidence scoring and value analysis'
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: 'Draft Assistant',
      description: 'Real-time draft guidance with tier-based recommendations and strategy'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Player Projections',
      description: 'Machine learning predictions based on comprehensive performance data'
    },
    {
      icon: <Wifi className="w-8 h-8" />,
      title: 'League Integration',
      description: 'Connect NFL Fantasy and Sleeper leagues for real-time data synchronization'
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: 'Team Management',
      description: 'Complete roster optimization with injury tracking and lineup suggestions'
    }
  ]

  const sampleCodes = [
    'GLITCH2024', 'DRAGON101', 'CHAMPION23', 'WIZARD24', 'ELITE101'
  ]

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-success-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Branding & Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-12 h-12 text-primary-500" />
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                  Fantasy Glitch
                </h1>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="space-y-6"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  The Ultimate Fantasy Football Analytics Platform
                </h2>
                
                <p className="text-xl text-gray-300 leading-relaxed">
                  Advanced AI-powered insights, real-time league integration, and comprehensive analytics 
                  to dominate your fantasy football leagues.
                </p>

                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <Badge variant="success" size="lg" className="flex items-center space-x-2">
                    <Gift className="w-4 h-4" />
                    <span>100% FREE</span>
                  </Badge>
                  <Badge variant="info" size="lg" className="flex items-center space-x-2">
                    <Key className="w-4 h-4" />
                    <span>{totalCodes} Access Codes</span>
                  </Badge>
                  <Badge variant="warning" size="lg" className="flex items-center space-x-2">
                    <Crown className="w-4 h-4" />
                    <span>Full Features</span>
                  </Badge>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Try These Codes:</h3>
                  <div className="flex flex-wrap gap-2">
                    {sampleCodes.map((sampleCode, index) => (
                      <motion.button
                        key={sampleCode}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCode(sampleCode)}
                        className="px-3 py-1 bg-dark-800 hover:bg-primary-600 text-gray-300 hover:text-white rounded-lg font-mono text-sm transition-all duration-300 border border-gray-600 hover:border-primary-500"
                      >
                        {sampleCode}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Access Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="w-full max-w-md">
                <Card className="border-2 border-primary-600 bg-gradient-to-br from-primary-600/10 via-secondary-600/10 to-success-600/10 backdrop-blur-xl">
                  <div className="p-8">
                    <div className="text-center mb-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                        className="w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4"
                      >
                        <Lock className="w-8 h-8 text-white" />
                      </motion.div>
                      
                      <h3 className="text-2xl font-bold text-white mb-2">Enter Access Code</h3>
                      <p className="text-gray-400">Unlock the complete platform instantly</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center space-x-2 p-3 bg-error-600/20 border border-error-600 rounded-lg"
                        >
                          <AlertCircle className="w-4 h-4 text-error-400" />
                          <span className="text-error-400 text-sm">{error}</span>
                        </motion.div>
                      )}

                      <div className="space-y-4">
                        <Input
                          type="text"
                          value={code}
                          onChange={(e) => setCode(e.target.value.toUpperCase())}
                          placeholder="Enter your access code"
                          icon={<Key className="w-5 h-5" />}
                          className="text-center font-mono text-lg tracking-wider"
                          required
                        />
                        
                        <div className="text-center">
                          <p className="text-xs text-gray-500">
                            All {totalCodes} codes provide identical full access
                          </p>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        loading={isSubmitting}
                        className="w-full"
                        size="lg"
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="mr-2"
                            >
                              <Sparkles className="w-5 h-5" />
                            </motion.div>
                            Unlocking Platform...
                          </>
                        ) : (
                          <>
                            <Unlock className="w-5 h-5 mr-2" />
                            Access Platform
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <div className="text-center mb-4">
                        <h4 className="font-semibold text-white">Instant Access To:</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { icon: <BarChart3 className="w-4 h-4" />, text: 'Advanced Analytics' },
                          { icon: <Users className="w-4 h-4" />, text: 'Trade Analysis' },
                          { icon: <Trophy className="w-4 h-4" />, text: 'Draft Assistant' },
                          { icon: <Activity className="w-4 h-4" />, text: 'Team Management' },
                          { icon: <Wifi className="w-4 h-4" />, text: 'League Sync' },
                          { icon: <Star className="w-4 h-4" />, text: 'All Features' }
                        ].map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                            className="flex items-center space-x-2"
                          >
                            <div className="text-primary-400">{item.icon}</div>
                            <span className="text-sm text-gray-300">{item.text}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-dark-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                Everything You Need to Dominate
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Comprehensive tools and analytics designed for serious fantasy football managers
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className="group"
                >
                  <Card hover className="text-center h-full bg-gradient-to-br from-dark-800 to-dark-700 border-gray-600 group-hover:border-primary-500 transition-all duration-500">
                    <div className="p-8">
                      <motion.div
                        className="text-primary-500 mb-6 flex justify-center group-hover:text-secondary-400 transition-colors duration-300"
                        whileHover={{ scale: 1.2, rotate: 5 }}
                      >
                        {feature.icon}
                      </motion.div>
                      <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors duration-300">
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

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-4xl font-bold text-white">
                Ready to Transform Your Fantasy Game?
              </h2>
              <p className="text-xl text-gray-300">
                Join thousands of fantasy managers using Fantasy Glitch to gain the competitive edge
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="success" size="lg" className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>No Subscription Required</span>
                </Badge>
                <Badge variant="info" size="lg" className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Instant Access</span>
                </Badge>
                <Badge variant="warning" size="lg" className="flex items-center space-x-2">
                  <Star className="w-5 h-5" />
                  <span>All Features Included</span>
                </Badge>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="text-xl px-12 py-4"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <Key className="w-6 h-6 mr-3" />
                  Get Your Access Code
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </motion.div>
            </motion.div>
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
                © 2024 Fantasy Glitch. The ultimate fantasy football analytics platform.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}