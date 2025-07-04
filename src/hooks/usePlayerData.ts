import { useState, useEffect } from 'react'
import type { Player } from '../types'

export function usePlayerData() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPlayerData()
  }, [])

  const loadPlayerData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Try to load from trade value CSV first
      const tradeValueResponse = await fetch('/player_trade_value.csv')
      if (tradeValueResponse.ok) {
        const csvText = await tradeValueResponse.text()
        const parsedPlayers = parseCSV(csvText)
        setPlayers(parsedPlayers)
        setLoading(false)
        return
      }

      // Fallback to mock data if CSV not available
      const mockPlayers = generateMockPlayers()
      setPlayers(mockPlayers)
      setLoading(false)
    } catch (err) {
      console.error('Error loading player data:', err)
      setError('Failed to load player data')
      
      // Use mock data as fallback
      const mockPlayers = generateMockPlayers()
      setPlayers(mockPlayers)
      setLoading(false)
    }
  }

  const parseCSV = (csvText: string): Player[] => {
    const lines = csvText.split('\n')
    const headers = lines[0].split(',').map(h => h.trim())
    
    return lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        const values = line.split(',').map(v => v.trim())
        const player: any = {}
        
        headers.forEach((header, index) => {
          const value = values[index]
          if (value && value !== 'undefined' && value !== 'null') {
            // Convert numeric fields
            if (['total_fantasy_points', 'avg_fantasy_points', 'volatility', 'predicted_value', 'games_played', 'season'].includes(header)) {
              player[header] = parseFloat(value) || 0
            } else {
              player[header] = value
            }
          }
        })
        
        return player as Player
      })
      .filter(player => player.name && player.position)
  }

  const generateMockPlayers = (): Player[] => {
    const positions = ['QB', 'RB', 'WR', 'TE']
    const teams = ['KC', 'BUF', 'CIN', 'DAL', 'SF', 'PHI', 'MIA', 'LAC']
    const names = [
      'Patrick Mahomes', 'Josh Allen', 'Joe Burrow', 'Dak Prescott',
      'Christian McCaffrey', 'Austin Ekeler', 'Derrick Henry', 'Nick Chubb',
      'Cooper Kupp', 'Davante Adams', 'Tyreek Hill', 'Stefon Diggs',
      'Travis Kelce', 'Mark Andrews', 'George Kittle', 'T.J. Hockenson'
    ]

    return names.map((name, index) => ({
      name,
      team: teams[index % teams.length],
      position: positions[index % positions.length],
      total_fantasy_points: Math.random() * 300 + 150,
      avg_fantasy_points: Math.random() * 20 + 10,
      volatility: Math.random() * 0.3 + 0.1,
      predicted_value: Math.random() * 100 + 50,
      games_played: Math.floor(Math.random() * 17) + 1,
      season: 2024,
      stat_type: 'offense' as const,
      passing_yds_sum: positions[index % positions.length] === 'QB' ? Math.random() * 4000 + 2000 : 0,
      passing_td_sum: positions[index % positions.length] === 'QB' ? Math.random() * 30 + 15 : 0,
      rushing_yds_sum: ['RB', 'QB'].includes(positions[index % positions.length]) ? Math.random() * 1500 + 500 : 0,
      rushing_td_sum: ['RB', 'QB'].includes(positions[index % positions.length]) ? Math.random() * 15 + 5 : 0,
      receiving_yds_sum: ['WR', 'TE', 'RB'].includes(positions[index % positions.length]) ? Math.random() * 1200 + 400 : 0,
      receiving_td_sum: ['WR', 'TE', 'RB'].includes(positions[index % positions.length]) ? Math.random() * 12 + 3 : 0,
      receiving_rec_sum: ['WR', 'TE', 'RB'].includes(positions[index % positions.length]) ? Math.random() * 80 + 20 : 0,
    }))
  }

  const getPlayersByPosition = (position: string) => {
    return players.filter(player => player.position === position)
  }

  const getTopPlayers = (limit: number = 10) => {
    return [...players]
      .sort((a, b) => b.total_fantasy_points - a.total_fantasy_points)
      .slice(0, limit)
  }

  const searchPlayers = (query: string) => {
    if (!query.trim()) return players
    
    const lowercaseQuery = query.toLowerCase()
    return players.filter(player =>
      player.name.toLowerCase().includes(lowercaseQuery) ||
      player.team.toLowerCase().includes(lowercaseQuery) ||
      player.position.toLowerCase().includes(lowercaseQuery)
    )
  }

  const getPlayerByName = (name: string) => {
    return players.find(player => player.name === name)
  }

  return {
    players,
    loading,
    error,
    getPlayersByPosition,
    getTopPlayers,
    searchPlayers,
    getPlayerByName,
    refetch: loadPlayerData,
  }
}