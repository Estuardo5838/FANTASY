import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Key, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Sparkles,
  Lock,
  Unlock,
  Gift,
  Star
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Card } from '../ui/Card'
import { useCodeAccess } from '../../hooks/useCodeAccess'

export function CodeAccess() {
  const [code, setCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { submitCode, error } = useCodeAccess()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const success = submitCode(code)
    if (!success) {
      setCode('')
    }
    
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center space-x-2 mb-8">
            <Zap className="w-8 h-8 text-primary-500" />
            <span className="text-2xl font-bold gradient-text">Fantasy Glitch</span>
          </div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Lock className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-white mb-2">Exclusive Access</h2>
          <p className="text-gray-400">Enter your access code to unlock Fantasy Glitch</p>
        </motion.div>

        {/* Access Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border border-primary-600 bg-gradient-to-br from-primary-600/10 to-secondary-600/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Gift className="w-5 h-5 text-primary-400" />
                  <span className="text-primary-400 font-semibold">100% FREE ACCESS</span>
                </div>
                <p className="text-sm text-gray-300">
                  No subscription required • Full premium features included
                </p>
              </div>

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
                  label="Access Code"
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
                    Access codes are case-insensitive and contain letters/numbers only
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
                      <Sparkles className="w-4 h-4" />
                    </motion.div>
                    Validating...
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4 mr-2" />
                    Unlock Platform
                  </>
                )}
              </Button>
            </form>

            {/* Features Preview */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h4 className="font-semibold text-white mb-3 text-center">What You'll Get:</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: <Star className="w-4 h-4" />, text: 'Advanced Analytics' },
                  { icon: <Zap className="w-4 h-4" />, text: 'AI Trade Analysis' },
                  { icon: <CheckCircle className="w-4 h-4" />, text: 'Draft Assistant' },
                  { icon: <Gift className="w-4 h-4" />, text: 'Team Management' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center space-x-2"
                  >
                    <div className="text-primary-400">{item.icon}</div>
                    <span className="text-sm text-gray-300">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <p className="text-xs text-gray-500">
            Don't have an access code? Contact us for exclusive access to Fantasy Glitch
          </p>
        </motion.div>
      </div>
    </div>
  )
}