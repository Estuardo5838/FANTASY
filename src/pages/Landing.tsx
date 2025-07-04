import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
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
  X
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PlayerCard } from '../components/player/PlayerCard'
import { FantasyPointsChart } from '../components/charts/FantasyPointsChart'
import { usePlayerData } from '../hooks/usePlayerData'

export function Landing() {
  const [showDemo, setShowDemo] = useState(false)
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
    'Real-time notifications',
    'Premium support',
    '7-day free trial'
  ]

  const topDemoPlayers = players.slice(0, 6)

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
      <section className="py-20 bg-dark-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Get access to all premium features for one low monthly price
          </p>
          
          <Card className="max-w-md mx-auto" gradient>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
              <div className="text-5xl font-bold text-white mb-2">
                $20
                <span className="text-lg text-gray-300">/month</span>
              </div>
              <p className="text-gray-300 mb-6">7-day free trial included</p>
              
              <div className="space-y-3 mb-8">
                {pricingFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-success-400 mr-3" />
                    <span className="text-white">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Link to="/signup">
                <Button size="lg" className="w-full">
                  Start Free Trial
                </Button>
              </Link>
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
            Join thousands of fantasy managers who trust Fantasy Glitch for their competitive edge
          </p>
          <Link to="/signup">
            <Button size="lg">
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="max-w-6xl w-full max-h-[90vh] overflow-y-auto bg-dark-900 rounded-xl border border-gray-700">
            {/* Demo Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-white">Fantasy Glitch Demo</h2>
                <p className="text-gray-400 mt-1">Experience the power of advanced fantasy analytics</p>
              </div>
              <button
                onClick={() => setShowDemo(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Demo Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <div className="text-center p-4">
                    <div className="text-3xl font-bold text-primary-400 mb-2">{players.length}</div>
                    <div className="text-gray-400">Active Players</div>
                  </div>
                </Card>
                <Card>
                  <div className="text-center p-4">
                    <div className="text-3xl font-bold text-success-400 mb-2">95%</div>
                    <div className="text-gray-400">Prediction Accuracy</div>
                  </div>
                </Card>
                <Card>
                  <div className="text-center p-4">
                    <div className="text-3xl font-bold text-warning-400 mb-2">24/7</div>
                    <div className="text-gray-400">Live Updates</div>
                  </div>
                </Card>
                <Card>
                  <div className="text-center p-4">
                    <div className="text-3xl font-bold text-secondary-400 mb-2">AI</div>
                    <div className="text-gray-400">Powered Analytics</div>
                  </div>
                </Card>
              </div>

              {/* Demo Chart */}
              <Card>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Top Performers Analytics
                  </h3>
                  {!loading && players.length > 0 && (
                    <FantasyPointsChart players={topDemoPlayers} type="area" />
                  )}
                </div>
              </Card>

              {/* Demo Players */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Elite Player Analysis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topDemoPlayers.map((player) => (
                    <PlayerCard key={player.name} player={player} />
                  ))}
                </div>
              </div>

              {/* Demo Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-white mb-3 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Advanced Analytics
                    </h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-success-400 mr-2" />
                        Volatility tracking and consistency scores
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-success-400 mr-2" />
                        AI-powered performance predictions
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-success-400 mr-2" />
                        Real-time market value analysis
                      </li>
                    </ul>
                  </div>
                </Card>

                <Card>
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-white mb-3 flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Smart Tools
                    </h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-success-400 mr-2" />
                        Trade analyzer with confidence scores
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-success-400 mr-2" />
                        Draft assistant with tier rankings
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-success-400 mr-2" />
                        Injury tracking and replacements
                      </li>
                    </ul>
                  </div>
                </Card>
              </div>

              {/* Demo CTA */}
              <div className="text-center bg-gradient-to-r from-primary-600/20 to-secondary-600/20 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Ready to Dominate Your League?</h3>
                <p className="text-gray-300 mb-6">
                  This is just a preview. Get full access to all features with your free trial.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/signup">
                    <Button size="lg" onClick={() => setShowDemo(false)}>
                      Start Free Trial
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={() => setShowDemo(false)}
                  >
                    Close Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}