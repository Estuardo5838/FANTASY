import { useState, useEffect } from 'react'
import { nflFantasyAPI, type NFLLeague } from '../services/nflFantasyAPI'
import { sleeperAPI, type SleeperLeague } from '../services/sleeperAPI'

export interface LeagueConnection {
  platform: 'nfl' | 'sleeper' | 'espn' | 'yahoo'
  leagueId: string
  leagueName: string
  connected: boolean
  lastSync: Date
  teamCount: number
  scoringType: string
  currentWeek: number
  myTeamId?: string
  myRoster?: any[]
  waiverWire?: any[]
  trades?: any[]
}

export function useLeagueConnection() {
  const [connections, setConnections] = useState<LeagueConnection[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)

  // Load saved connections from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('fantasy-glitch-connections')
    if (saved) {
      try {
        setConnections(JSON.parse(saved))
      } catch (err) {
        console.error('Failed to load saved connections:', err)
      }
    }
  }, [])

  // Save connections to localStorage
  useEffect(() => {
    if (connections.length > 0) {
      localStorage.setItem('fantasy-glitch-connections', JSON.stringify(connections))
    }
  }, [connections])

  const connectLeague = async (platform: string, leagueId: string, teamId?: string) => {
    setLoading(true)
    setError(null)

    try {
      let leagueData: any
      let connection: LeagueConnection

      switch (platform) {
        case 'nfl':
          leagueData = await nflFantasyAPI.getLeague(leagueId)
          connection = {
            platform: 'nfl',
            leagueId,
            leagueName: leagueData.name,
            connected: true,
            lastSync: new Date(),
            teamCount: leagueData.size,
            scoringType: leagueData.scoringType,
            currentWeek: leagueData.currentWeek,
            myTeamId: teamId
          }
          break

        case 'sleeper':
          leagueData = await sleeperAPI.getLeague(leagueId)
          connection = {
            platform: 'sleeper',
            leagueId,
            leagueName: leagueData.name,
            connected: true,
            lastSync: new Date(),
            teamCount: leagueData.total_rosters,
            scoringType: leagueData.scoring_settings.rec ? 'ppr' : 'standard',
            currentWeek: leagueData.week,
            myTeamId: teamId
          }
          break

        default:
          throw new Error(`Platform ${platform} not yet supported`)
      }

      // Sync initial data
      await syncLeagueData(connection)

      setConnections(prev => [...prev.filter(c => c.leagueId !== leagueId), connection])
      return connection
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect league')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const syncLeagueData = async (connection: LeagueConnection) => {
    setSyncing(true)
    setError(null)

    try {
      let updatedConnection = { ...connection }

      switch (connection.platform) {
        case 'nfl':
          if (connection.myTeamId) {
            const roster = await nflFantasyAPI.getTeamRoster(connection.leagueId, connection.myTeamId)
            const waiverWire = await nflFantasyAPI.getWaiverWire(connection.leagueId)
            const trades = await nflFantasyAPI.getTrades(connection.leagueId)
            
            updatedConnection = {
              ...updatedConnection,
              myRoster: roster,
              waiverWire,
              trades,
              lastSync: new Date()
            }
          }
          break

        case 'sleeper':
          const rosters = await sleeperAPI.getRosters(connection.leagueId)
          const players = await sleeperAPI.getPlayers()
          const trades = await sleeperAPI.getTrades(connection.leagueId)
          const waivers = await sleeperAPI.getWaiverClaims(connection.leagueId, connection.currentWeek)
          
          // Find user's roster
          const myRoster = rosters.find(r => r.owner_id === connection.myTeamId)
          
          updatedConnection = {
            ...updatedConnection,
            myRoster: myRoster?.players.map(playerId => players[playerId]).filter(Boolean) || [],
            trades,
            waiverWire: waivers,
            lastSync: new Date()
          }
          break
      }

      setConnections(prev => 
        prev.map(c => c.leagueId === connection.leagueId ? updatedConnection : c)
      )

      return updatedConnection
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync league data')
      throw err
    } finally {
      setSyncing(false)
    }
  }

  const syncAllLeagues = async () => {
    setSyncing(true)
    setError(null)

    try {
      const syncPromises = connections.map(connection => syncLeagueData(connection))
      await Promise.all(syncPromises)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync leagues')
    } finally {
      setSyncing(false)
    }
  }

  const disconnectLeague = (leagueId: string) => {
    setConnections(prev => prev.filter(c => c.leagueId !== leagueId))
    
    // Also remove from localStorage
    const remaining = connections.filter(c => c.leagueId !== leagueId)
    if (remaining.length === 0) {
      localStorage.removeItem('fantasy-glitch-connections')
    } else {
      localStorage.setItem('fantasy-glitch-connections', JSON.stringify(remaining))
    }
  }

  const getConnection = (leagueId: string) => {
    return connections.find(c => c.leagueId === leagueId)
  }

  const isConnected = (platform?: string) => {
    if (platform) {
      return connections.some(c => c.platform === platform && c.connected)
    }
    return connections.some(c => c.connected)
  }

  // Auto-sync every 5 minutes
  useEffect(() => {
    if (connections.length === 0) return

    const interval = setInterval(() => {
      syncAllLeagues()
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [connections])

  return {
    connections,
    loading,
    error,
    syncing,
    connectLeague,
    syncLeagueData,
    syncAllLeagues,
    disconnectLeague,
    getConnection,
    isConnected
  }
}