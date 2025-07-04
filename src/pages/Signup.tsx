import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Zap, CheckCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'

export function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const { error } = await signUp(email, password, fullName)
      if (error) {
        setError(error.message)
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const benefits = [
    'Advanced player analytics',
    'AI-powered trade recommendations',
    'Real-time draft assistance',
    'Team management tools',
    'Market trend analysis',
    '7-day free trial'
  ]

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Benefits */}
        <div className="space-y-8">
          <div>
            <Link to="/" className="inline-flex items-center space-x-2 mb-8">
              <Zap className="w-8 h-8 text-primary-500" />
              <span className="text-2xl font-bold gradient-text">Fantasy Glitch</span>
            </Link>
            <h1 className="text-4xl font-bold text-white mb-4">
              Join the Elite Fantasy Managers
            </h1>
            <p className="text-xl text-gray-300">
              Get the competitive edge with advanced analytics and AI-powered insights
            </p>
          </div>

          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-success-400 flex-shrink-0" />
                <span className="text-gray-300">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="glass-effect rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-2">Premium Features</h3>
            <p className="text-gray-300 mb-4">
              Start your 7-day free trial, then just $20/month for unlimited access to all features.
            </p>
            <div className="text-3xl font-bold gradient-text">
              $20/month
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white">Create your account</h2>
            <p className="mt-2 text-gray-400">Start your free trial today</p>
          </div>

          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-error-600/20 border border-error-600 rounded-lg p-3">
                  <p className="text-error-400 text-sm">{error}</p>
                </div>
              )}

              <Input
                label="Full Name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                icon={<User className="w-5 h-5" />}
                required
              />

              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                icon={<Mail className="w-5 h-5" />}
                required
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password (min. 6 characters)"
                icon={<Lock className="w-5 h-5" />}
                required
              />

              <Button
                type="submit"
                loading={loading}
                className="w-full"
                size="lg"
              >
                Start Free Trial
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                By signing up, you agree to our Terms of Service and Privacy Policy.
                Cancel anytime during your free trial.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}