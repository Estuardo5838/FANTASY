import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Users, Trophy } from 'lucide-react'
import { TeamManagementDashboard } from '../components/team/TeamManagementDashboard'
import { useLeagueConnection } from '../hooks/useLeagueConnection'

export function TeamManagement() {
  const { isConnected } = useLeagueConnection()

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Team Management</h1>
          <p className="text-gray-400 mt-2">
            {isConnected() 
              ? 'Manage your connected fantasy teams with real-time data'
              : 'Connect your league for advanced team management features'
            }
          </p>
        </div>
        <div className="flex items-center space-x-2 text-gray-400">
          {isConnected() ? (
            <>
              <Zap className="w-5 h-5 text-success-400" />
              <span className="text-success-400">Live Connected</span>
            </>
          ) : (
            <>
              <Users className="w-5 h-5" />
              <span>Team Analytics</span>
            </>
          )}
        </div>
      </motion.div>

      <TeamManagementDashboard />
    </div>
  )
}