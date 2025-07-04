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
  users?: any[]
  rosters?: any[]
  matchups?: any[]
  connectionStatus: 'connecting' | 'connected' | 'error' | 'disconnected'
  errorMessage?: string
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
        const savedConnections = JSON.parse(saved)
        setConnections(savedConnections.map((conn: any) => ({
          ...conn,
          lastSync: new Date(conn.lastSync),
          connectionStatus: 'disconnected' // Reset status on load
        })))
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
    
    console.log(`🚀 Starting connection process for ${platform} league: ${leagueId}`)

    // Create initial connection object
    const initialConnection: LeagueConnection = {
      platform: platform as 'nfl' | 'sleeper',
      leagueId,
      leagueName: 'Connecting...',
      connected: false,
      lastSync: new Date(),
      teamCount: 0,
      scoringType: 'unknown',
      currentWeek: 15,
      myTeamId: teamId,
      connectionStatus: 'connecting'
    }

    // Add to connections immediately to show connecting state
    setConnections(prev => [...prev.filter(c => c.leagueId !== leagueId), initialConnection])

    try {
      let leagueData: any
      let connection: LeagueConnection

      console.log(`🔗 Fetching league data from ${platform} API...`)

      switch (platform) {
        case 'nfl':
          try {
            leagueData = await nflFantasyAPI.getLeague(leagueId)
            console.log('✅ NFL Fantasy league connected:', leagueData.name, `(${leagueData.status})`)
            
            connection = {
              platform: 'nfl',
              leagueId,
              leagueName: leagueData.name,
              connected: true,
              lastSync: new Date(),
              teamCount: leagueData.size,
              scoringType: leagueData.scoringType,
              currentWeek: leagueData.currentWeek,
              myTeamId: teamId,
              connectionStatus: 'connected'
            }
          } catch (nflError) {
            console.error('❌ NFL Fantasy connection failed completely:', nflError)
            throw new Error(`Failed to connect to NFL Fantasy league: ${nflError}`)
          }
          break

        case 'sleeper':
          console.log('😴 Connecting to Sleeper API...')
          try {
            leagueData = await sleeperAPI.getLeague(leagueId)
            console.log('✅ Sleeper league data received:', leagueData.name)
            
            connection = {
              platform: 'sleeper',
              leagueId,
              leagueName: leagueData.name,
              connected: true,
              lastSync: new Date(),
              teamCount: leagueData.total_rosters,
              scoringType: leagueData.scoring_settings?.rec ? 'ppr' : 'standard',
              currentWeek: leagueData.week,
              myTeamId: teamId,
              connectionStatus: 'connected'
            }
          } catch (sleeperError) {
            console.error('❌ Sleeper connection failed:', sleeperError)
            throw new Error(`Failed to connect to Sleeper league: ${sleeperError}`)
          }
          break

        default:
          throw new Error(`Platform ${platform} not supported`)
      }

      // Sync initial data
      console.log('🔄 Syncing initial league data...')
      await syncLeagueData(connection)

      setConnections(prev => [...prev.filter(c => c.leagueId !== leagueId), connection])
      
      console.log(`🎉 Successfully connected and synced ${platform} league: ${connection.leagueName}`)
      return connection
    } catch (err) {
      console.error('❌ League connection process failed:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect league'
      setError(errorMessage)
      
      // Update connection with error status
      setConnections(prev => prev.map(c => 
        c.leagueId === leagueId 
          ? { ...c, connectionStatus: 'error', errorMessage }
          : c
      ))
      
      throw err
    } finally {
      setLoading(false)
    }
  }

  const syncLeagueData = async (connection: LeagueConnection) => {
    setSyncing(true)
    setError(null)
    
    console.log(`🔄 Starting data sync for ${connection.platform} league...`)

    try {
      let updatedConnection = { ...connection }

      switch (connection.platform) {
        case 'nfl':
          try {
            const [roster, waiverWire, trades] = await Promise.all([
              connection.myTeamId ? nflFantasyAPI.getTeamRoster(connection.leagueId, connection.myTeamId) : Promise.resolve([]),
              nflFantasyAPI.getWaiverWire(connection.leagueId),
              nflFantasyAPI.getTrades(connection.leagueId)
            ])
            
            updatedConnection = {
              ...updatedConnection,
              myRoster: roster,
              waiverWire,
              trades,
              lastSync: new Date(),
              connectionStatus: 'connected'
            }
            
            console.log('✅ NFL Fantasy data synced successfully')
          } catch (nflSyncError) {
            console.warn('⚠️ NFL Fantasy sync partially failed, using available data:', nflSyncError)
            updatedConnection.errorMessage = 'Partial sync - some data in demo mode'
          }
          break

        case 'sleeper':
          try {
            const [users, rosters, trades, waivers] = await Promise.all([
              sleeperAPI.getUsers(connection.leagueId),
              sleeperAPI.getRosters(connection.leagueId),
              sleeperAPI.getTrades(connection.leagueId),
              sleeperAPI.getWaiverClaims(connection.leagueId, connection.currentWeek)
            ])
            
            // Find user's roster if teamId provided
            const myRoster = connection.myTeamId 
              ? rosters.find(r => r.owner_id === connection.myTeamId)
              : null

            updatedConnection = {
              ...updatedConnection,
              users,
              rosters,
              myRoster: myRoster?.players || [],
              trades,
              waiverWire: waivers,
              lastSync: new Date(),
              connectionStatus: 'connected'
            }
            
            console.log('✅ Sleeper data synced successfully')
          } catch (sleeperSyncError) {
            console.warn('⚠️ Sleeper sync partially failed:', sleeperSyncError)
            updatedConnection.errorMessage = 'Partial sync - some data unavailable'
          }
          break
      }

      setConnections(prev => 
        prev.map(c => c.leagueId === connection.leagueId ? updatedConnection : c)
      )

      return updatedConnection
    } catch (err) {
      console.error('❌ Data sync failed:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync league data'
      setError(errorMessage)
      
      // Update connection with error status
      setConnections(prev => prev.map(c => 
        c.leagueId === connection.leagueId 
          ? { ...c, connectionStatus: 'error', errorMessage }
          : c
      ))
      
      throw err
    } finally {
      setSyncing(false)
    }
  }

  const syncAllLeagues = async () => {
    setSyncing(true)
    setError(null)

    try {
      console.log('🔄 Syncing all connected leagues...')
      const syncPromises = connections
        .filter(c => c.connected)
        .map(connection => syncLeagueData(connection))
      
      await Promise.allSettled(syncPromises)
      console.log('✅ All leagues sync completed')
    } catch (err) {
      console.error('❌ Sync all failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to sync leagues')
    } finally {
      setSyncing(false)
    }
  }

  const disconnectLeague = (leagueId: string) => {
    console.log(`🔌 Disconnecting league: ${leagueId}`)
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

  const getConnectionsByPlatform = (platform: string) => {
    return connections.filter(c => c.platform === platform)
  }

  const getActiveConnections = () => {
    return connections.filter(c => c.connected && c.connectionStatus === 'connected')
  }

  // Auto-sync every 5 minutes for connected leagues
  useEffect(() => {
    const connectedLeagues = connections.filter(c => c.connected && c.connectionStatus === 'connected')
    if (connectedLeagues.length === 0) return

    console.log(`⏰ Setting up auto-sync for ${connectedLeagues.length} leagues`)
    
    const interval = setInterval(() => {
      console.log('🔄 Auto-syncing leagues...')
      syncAllLeagues()
    }, 5 * 60 * 1000) // 5 minutes

    return () => {
      console.log('⏰ Clearing auto-sync interval')
      clearInterval(interval)
    }
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
    isConnected,
    getConnectionsByPlatform,
    getActiveConnections
  }
}