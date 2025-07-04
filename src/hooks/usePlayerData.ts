import { useState, useEffect } from 'react'
import type { Player } from '../types'

// Demo data for fully functional demo
const DEMO_PLAYERS: Player[] = [
  {
    name: 'Josh Allen',
    team: 'BUF',
    position: 'QB',
    total_fantasy_points: 387.2,
    avg_fantasy_points: 22.8,
    volatility: 0.15,
    predicted_value: 95.5,
    games_played: 17,
    passing_yds_sum: 4306,
    passing_td_sum: 29,
    passing_int_sum: 18,
    rushing_yds_sum: 524,
    rushing_td_sum: 15,
    season: 2024,
    stat_type: 'offense'
  },
  {
    name: 'Christian McCaffrey',
    team: 'SF',
    position: 'RB',
    total_fantasy_points: 342.8,
    avg_fantasy_points: 20.2,
    volatility: 0.12,
    predicted_value: 92.3,
    games_played: 17,
    rushing_yds_sum: 1459,
    rushing_td_sum: 14,
    receiving_yds_sum: 564,
    receiving_td_sum: 7,
    receiving_rec_sum: 67,
    season: 2024,
    stat_type: 'offense'
  },
  {
    name: 'Tyreek Hill',
    team: 'MIA',
    position: 'WR',
    total_fantasy_points: 298.4,
    avg_fantasy_points: 17.6,
    volatility: 0.22,
    predicted_value: 88.7,
    games_played: 17,
    receiving_yds_sum: 1799,
    receiving_td_sum: 13,
    receiving_rec_sum: 119,
    season: 2024,
    stat_type: 'offense'
  },
  {
    name: 'Travis Kelce',
    team: 'KC',
    position: 'TE',
    total_fantasy_points: 267.3,
    avg_fantasy_points: 15.7,
    volatility: 0.18,
    predicted_value: 85.2,
    games_played: 17,
    receiving_yds_sum: 984,
    receiving_td_sum: 5,
    receiving_rec_sum: 93,
    season: 2024,
    stat_type: 'offense'
  },
  {
    name: 'Lamar Jackson',
    team: 'BAL',
    position: 'QB',
    total_fantasy_points: 356.7,
    avg_fantasy_points: 21.0,
    volatility: 0.19,
    predicted_value: 91.8,
    games_played: 17,
    passing_yds_sum: 3678,
    passing_td_sum: 24,
    passing_int_sum: 7,
    rushing_yds_sum: 821,
    rushing_td_sum: 5,
    season: 2024,
    stat_type: 'offense'
  },
  {
    name: 'Derrick Henry',
    team: 'BAL',
    position: 'RB',
    total_fantasy_points: 289.6,
    avg_fantasy_points: 17.0,
    volatility: 0.16,
    predicted_value: 82.4,
    games_played: 17,
    rushing_yds_sum: 1921,
    rushing_td_sum: 16,
    receiving_yds_sum: 169,
    receiving_td_sum: 1,
    receiving_rec_sum: 11,
    season: 2024,
    stat_type: 'offense'
  },
  {
    name: 'CeeDee Lamb',
    team: 'DAL',
    position: 'WR',
    total_fantasy_points: 276.8,
    avg_fantasy_points: 16.3,
    volatility: 0.21,
    predicted_value: 86.9,
    games_played: 17,
    receiving_yds_sum: 1749,
    receiving_td_sum: 12,
    receiving_rec_sum: 135,
    season: 2024,
    stat_type: 'offense'
  },
  {
    name: 'Amon-Ra St. Brown',
    team: 'DET',
    position: 'WR',
    total_fantasy_points: 264.2,
    avg_fantasy_points: 15.5,
    volatility: 0.17,
    predicted_value: 84.1,
    games_played: 17,
    receiving_yds_sum: 1515,
    receiving_td_sum: 10,
    receiving_rec_sum: 119,
    season: 2024,
    stat_type: 'offense'
  },
  {
    name: 'Saquon Barkley',
    team: 'PHI',
    position: 'RB',
    total_fantasy_points: 378.9,
    avg_fantasy_points: 22.3,
    volatility: 0.14,
    predicted_value: 94.7,
    games_played: 17,
    rushing_yds_sum: 2005,
    rushing_td_sum: 13,
    receiving_yds_sum: 278,
    receiving_td_sum: 2,
    receiving_rec_sum: 33,
    season: 2024,
    stat_type: 'offense'
  },
  {
    name: 'George Kittle',
    team: 'SF',
    position: 'TE',
    total_fantasy_points: 198.7,
    avg_fantasy_points: 11.7,
    volatility: 0.25,
    predicted_value: 76.3,
    games_played: 17,
    receiving_yds_sum: 1106,
    receiving_td_sum: 8,
    receiving_rec_sum: 65,
    season: 2024,
    stat_type: 'offense'
  }
]

const DEMO_INJURED_PLAYERS = ['Christian McCaffrey', 'Travis Kelce']

// Set to demo mode - change this to your GitHub URL when ready
const GITHUB_RAW_BASE = 'DEMO_MODE'

export function usePlayerData() {
  const [players, setPlayers] = useState<Player[]>([])
  const [injuredPlayers, setInjuredPlayers] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    loadAllData()
    
    // Set up polling for updates every 5 minutes
    const interval = setInterval(loadAllData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const loadAllData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check if GitHub is configured
      if (GITHUB_RAW_BASE === 'DEMO_MODE' || GITHUB_RAW_BASE.includes('YOUR_USERNAME')) {
        // Use demo data for fully functional demo
        console.log('Using demo data - GitHub not configured')
        setPlayers(DEMO_PLAYERS)
        setInjuredPlayers(DEMO_INJURED_PLAYERS)
        setLastUpdated(new Date())
        setLoading(false)
        return
      }

      // Load player data and injury data in parallel
      const [playerData, injuryData] = await Promise.all([
        loadPlayerDataFromGitHub(),
        loadInjuryDataFromGitHub()
      ])

      setPlayers(playerData)
      setInjuredPlayers(injuryData)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load data from GitHub - using demo data')
      
      // Fallback to demo data
      setPlayers(DEMO_PLAYERS)
      setInjuredPlayers(DEMO_INJURED_PLAYERS)
      setLastUpdated(new Date())
    } finally {
      setLoading(false)
    }
  }

  const loadPlayerDataFromGitHub = async (): Promise<Player[]> => {
    try {
      // Try to load trade value CSV first (most complete data)
      const tradeValueResponse = await fetch(`${GITHUB_RAW_BASE}/player_trade_value.csv`)
      if (tradeValueResponse.ok) {
        const csvText = await tradeValueResponse.text()
        return parsePlayerCSV(csvText)
      }

      // Fallback to season files
      const seasonFiles = ['player_2024.csv', 'player_2023.csv']
      for (const file of seasonFiles) {
        try {
          const response = await fetch(`${GITHUB_RAW_BASE}/${file}`)
          if (response.ok) {
            const csvText = await response.text()
            return parsePlayerCSV(csvText)
          }
        } catch (err) {
          console.warn(`Failed to load ${file}:`, err)
        }
      }

      throw new Error('No player data files found')
    } catch (err) {
      throw new Error(`Failed to load player data: ${err}`)
    }
  }

  const loadInjuryDataFromGitHub = async (): Promise<string[]> => {
    try {
      const response = await fetch(`${GITHUB_RAW_BASE}/injured.csv`)
      if (!response.ok) {
        console.warn('No injury data found')
        return []
      }

      const csvText = await response.text()
      return parseInjuryCSV(csvText)
    } catch (err) {
      console.warn('Failed to load injury data:', err)
      return []
    }
  }

  const parsePlayerCSV = (csvText: string): Player[] => {
    const lines = csvText.split('\n').filter(line => line.trim())
    if (lines.length === 0) return []

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    
    return lines.slice(1)
      .map(line => {
        const values = parseCSVLine(line)
        const player: any = {}
        
        headers.forEach((header, index) => {
          const value = values[index]?.replace(/"/g, '').trim()
          if (value && value !== 'undefined' && value !== 'null' && value !== '') {
            // Convert numeric fields
            if (['total_fantasy_points', 'avg_fantasy_points', 'volatility', 'predicted_value', 'games_played', 'season'].includes(header)) {
              player[header] = parseFloat(value) || 0
            } else if (header.includes('_sum') || header.includes('_td') || header.includes('_int') || header.includes('_yds')) {
              player[header] = parseFloat(value) || 0
            } else {
              player[header] = value
            }
          }
        })
        
        return player as Player
      })
      .filter(player => player.name && player.position && player.team)
  }

  const parseInjuryCSV = (csvText: string): string[] => {
    const lines = csvText.split('\n').filter(line => line.trim())
    if (lines.length === 0) return []

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    const nameIndex = headers.findIndex(h => h.toLowerCase().includes('name') || h.toLowerCase().includes('player'))
    
    if (nameIndex === -1) return []

    return lines.slice(1)
      .map(line => {
        const values = parseCSVLine(line)
        return values[nameIndex]?.replace(/"/g, '').trim()
      })
      .filter(name => name && name !== '')
  }

  const parseCSVLine = (line: string): string[] => {
    const result = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current)
        current = ''
      } else {
        current += char
      }
    }
    
    result.push(current)
    return result
  }

  const getAvailablePlayers = () => {
    return players.filter(player => !injuredPlayers.includes(player.name))
  }

  const getInjuredPlayers = () => {
    return players.filter(player => injuredPlayers.includes(player.name))
  }

  const getPlayersByPosition = (position: string, includeInjured: boolean = true) => {
    const filteredPlayers = includeInjured ? players : getAvailablePlayers()
    return filteredPlayers.filter(player => player.position === position)
  }

  const getTopPlayers = (limit: number = 10, includeInjured: boolean = true) => {
    const filteredPlayers = includeInjured ? players : getAvailablePlayers()
    return [...filteredPlayers]
      .sort((a, b) => b.total_fantasy_points - a.total_fantasy_points)
      .slice(0, limit)
  }

  const searchPlayers = (query: string, includeInjured: boolean = true) => {
    if (!query.trim()) return includeInjured ? players : getAvailablePlayers()
    
    const filteredPlayers = includeInjured ? players : getAvailablePlayers()
    const lowercaseQuery = query.toLowerCase()
    return filteredPlayers.filter(player =>
      player.name.toLowerCase().includes(lowercaseQuery) ||
      player.team.toLowerCase().includes(lowercaseQuery) ||
      player.position.toLowerCase().includes(lowercaseQuery)
    )
  }

  const getPlayerByName = (name: string) => {
    return players.find(player => player.name === name)
  }

  const isPlayerInjured = (playerName: string) => {
    return injuredPlayers.includes(playerName)
  }

  const getReplacementSuggestions = (injuredPlayerName: string) => {
    const injuredPlayer = getPlayerByName(injuredPlayerName)
    if (!injuredPlayer) return []

    return getAvailablePlayers()
      .filter(player => 
        player.position === injuredPlayer.position &&
        player.name !== injuredPlayerName
      )
      .sort((a, b) => b.predicted_value - a.predicted_value)
      .slice(0, 5)
  }

  return {
    players,
    injuredPlayers,
    loading,
    error,
    lastUpdated,
    getAvailablePlayers,
    getInjuredPlayers,
    getPlayersByPosition,
    getTopPlayers,
    searchPlayers,
    getPlayerByName,
    isPlayerInjured,
    getReplacementSuggestions,
    refetch: loadAllData,
  }
}