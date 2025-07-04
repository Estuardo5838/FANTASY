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
  ArrowRight,
  Github,
  BarChart3,
  Users,
  Trophy,
  TrendingUp,
  Activity,
  Target
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
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

  const sampleCodes = [
    'GLITCH2024', 'DRAGON101', 'CHAMPION23', 'WIZARD24', 'ELITE101'
  ]

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Branding */}
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
                Ultimate Fantasy Football Analytics
              </h2>
              
              <p className="text-xl text-gray-300 leading-relaxed">
                Advanced AI insights, real-time data, and comprehensive tools to dominate your fantasy leagues.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                {[
                  { icon: <BarChart3 className="w-6 h-6" />, text: 'Analytics' },
                  { icon: <Users className="w-6 h-6" />, text: 'Trade Center' },
                  { icon: <Trophy className="w-6 h-6" />, text: 'Draft Assistant' },
                  { icon: <TrendingUp className="w-6 h-6" />, text: 'Projections' },
                  { icon: <Activity className="w-6 h-6" />, text: 'Team Management' },
                  { icon: <Target className="w-6 h-6" />, text: 'Player Database' }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex flex-col items-center space-y-2 p-4 glass-effect rounded-lg"
                  >
                    <div className="text-primary-400">{feature.icon}</div>
                    <span className="text-sm text-gray-300 text-center">{feature.text}</span>
                  </motion.div>
                ))}
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
                    <p className="text-gray-400">Unlock the complete platform</p>
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
                          Unlocking...
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
                      <h4 className="font-semibold text-white">Try These Codes:</h4>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {sampleCodes.map((sampleCode, index) => (
                        <motion.button
                          key={sampleCode}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCode(sampleCode)}
                          className="px-3 py-1 bg-dark-800 hover:bg-primary-600 text-gray-300 hover:text-white rounded-lg font-mono text-sm transition-all duration-300 border border-gray-600 hover:border-primary-500"
                        >
                          {sampleCode}
                        </motion.button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-3">
                      {totalCodes} codes available • All provide full access
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">
                    All codes provide identical full access
                  </p>
                </div>
                <p className="text-xs text-gray-500 text-center mt-4">
                  <Github className="w-3 h-3 inline mr-1" />
                  Connected to: <span className="text-primary-400">github.com/Estuardo5838/FANTASY</span>
                </p>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}