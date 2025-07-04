import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  Key, 
  LogOut, 
  Crown,
  Sparkles,
  Gift,
  Zap
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { useCodeAccess } from '../../hooks/useCodeAccess'

export function AccessStatus() {
  const [showDetails, setShowDetails] = useState(false)
  const { revokeAccess, getStoredCode } = useCodeAccess()
  
  const storedCode = getStoredCode()

  const handleRevokeAccess = () => {
    if (window.confirm('Sign out of Fantasy Glitch? You\'ll need to enter your code again.')) {
      revokeAccess()
    }
    setShowDetails(false)
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center space-x-2"
      >
        <Zap className="w-4 h-4 text-success-400" />
        <span className="text-success-400">Full Access</span>
      </Button>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 mt-2 w-80 z-50"
          >
            <Card className="border border-success-600 bg-gradient-to-br from-success-600/10 to-primary-600/10">
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-success-500 to-primary-500 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Full Access Active</h3>
                    <p className="text-sm text-gray-400">All features unlocked</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Access Code:</span>
                    <Badge variant="success" className="font-mono">
                      {storedCode}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Status:</span>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-success-400" />
                      <span className="text-success-400 text-sm">Active</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Plan:</span>
                    <Badge variant="success" className="flex items-center space-x-1">
                      <Gift className="w-3 h-3" />
                      <span>Complete Access</span>
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <h4 className="font-semibold text-white text-sm">Available Features:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Advanced Analytics',
                      'AI Trade Analysis', 
                      'Draft Assistant',
                      'Team Management',
                      'League Integration',
                      'Real-time Data'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Sparkles className="w-3 h-3 text-primary-400" />
                        <span className="text-xs text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRevokeAccess}
                    className="flex-1 text-error-400 hover:text-error-300"
                  >
                    <LogOut className="w-3 h-3 mr-1" />
                    Sign Out
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetails(false)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}