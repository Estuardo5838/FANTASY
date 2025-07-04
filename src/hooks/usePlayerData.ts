import { useState, useEffect } from 'react'
import type { Player } from '../types'

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main'

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
      setError('Failed to load data from GitHub')
      setPlayers([])
      setInjuredPlayers([])
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