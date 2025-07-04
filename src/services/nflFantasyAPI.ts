import axios from 'axios'

export interface NFLLeague {
  id: string
  name: string
  size: number
  scoringType: 'standard' | 'ppr' | 'half_ppr'
  teams: NFLTeam[]
  currentWeek: number
  season: number
}

export interface NFLTeam {
  id: string
  name: string
  ownerId: string
  roster: NFLPlayer[]
  record: {
    wins: number
    losses: number
    ties: number
  }
}

export interface NFLPlayer {
  id: string
  name: string
  position: string
  team: string
  isStarter: boolean
  isInjured: boolean
  fantasyPoints: number
  projectedPoints: number
}

class NFLFantasyAPI {
  private baseURL = 'https://api.nfl.com/v1/fantasy'
  private proxyURL = 'https://cors-anywhere.herokuapp.com/' // For demo purposes

  async getLeague(leagueId: string): Promise<NFLLeague> {
    try {
      // Simulate NFL Fantasy API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data for demonstration
      return {
        id: leagueId,
        name: 'The Best Fantasy League',
        size: 12,
        scoringType: 'ppr',
        currentWeek: 15,
        season: 2024,
        teams: this.generateMockTeams()
      }
    } catch (error) {
      throw new Error('Failed to fetch NFL Fantasy league data')
    }
  }

  async getTeamRoster(leagueId: string, teamId: string): Promise<NFLPlayer[]> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return this.generateMockRoster()
    } catch (error) {
      throw new Error('Failed to fetch team roster')
    }
  }

  async getWaiverWire(leagueId: string): Promise<NFLPlayer[]> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return this.generateMockWaiverPlayers()
    } catch (error) {
      throw new Error('Failed to fetch waiver wire players')
    }
  }

  async getTrades(leagueId: string): Promise<any[]> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return [
        {
          id: '1',
          fromTeam: 'Team A',
          toTeam: 'Team B',
          fromPlayers: ['Josh Allen'],
          toPlayers: ['Lamar Jackson'],
          status: 'pending',
          timestamp: new Date()
        }
      ]
    } catch (error) {
      throw new Error('Failed to fetch trades')
    }
  }

  private generateMockTeams(): NFLTeam[] {
    const teamNames = [
      'The Champions', 'Fantasy Kings', 'Touchdown Masters', 'Grid Iron Heroes',
      'End Zone Elite', 'Fantasy Legends', 'Victory Squad', 'Championship Bound',
      'Fantasy Phenoms', 'Gridiron Gladiators', 'Fantasy Force', 'Victory Vipers'
    ]

    return teamNames.map((name, index) => ({
      id: `team_${index + 1}`,
      name,
      ownerId: `owner_${index + 1}`,
      roster: this.generateMockRoster(),
      record: {
        wins: Math.floor(Math.random() * 10) + 3,
        losses: Math.floor(Math.random() * 8) + 2,
        ties: Math.floor(Math.random() * 2)
      }
    }))
  }

  private generateMockRoster(): NFLPlayer[] {
    const mockPlayers = [
      { name: 'Josh Allen', position: 'QB', team: 'BUF', fantasyPoints: 387.2, projectedPoints: 24.5 },
      { name: 'Christian McCaffrey', position: 'RB', team: 'SF', fantasyPoints: 342.8, projectedPoints: 22.1 },
      { name: 'Tyreek Hill', position: 'WR', team: 'MIA', fantasyPoints: 298.4, projectedPoints: 18.7 },
      { name: 'Travis Kelce', position: 'TE', team: 'KC', fantasyPoints: 267.3, projectedPoints: 16.2 },
      { name: 'Saquon Barkley', position: 'RB', team: 'PHI', fantasyPoints: 378.9, projectedPoints: 21.8 },
      { name: 'CeeDee Lamb', position: 'WR', team: 'DAL', fantasyPoints: 276.8, projectedPoints: 17.9 },
      { name: 'Amon-Ra St. Brown', position: 'WR', team: 'DET', fantasyPoints: 264.2, projectedPoints: 16.8 }
    ]

    return mockPlayers.map((player, index) => ({
      id: `player_${index}`,
      name: player.name,
      position: player.position,
      team: player.team,
      isStarter: index < 9, // First 9 are starters
      isInjured: Math.random() < 0.1, // 10% chance of injury
      fantasyPoints: player.fantasyPoints,
      projectedPoints: player.projectedPoints
    }))
  }

  private generateMockWaiverPlayers(): NFLPlayer[] {
    const waiverPlayers = [
      { name: 'Jayden Reed', position: 'WR', team: 'GB', fantasyPoints: 156.3, projectedPoints: 12.4 },
      { name: 'Rachaad White', position: 'RB', team: 'TB', fantasyPoints: 189.7, projectedPoints: 14.2 },
      { name: 'Gus Edwards', position: 'RB', team: 'LAC', fantasyPoints: 134.8, projectedPoints: 9.8 },
      { name: 'Romeo Doubs', position: 'WR', team: 'GB', fantasyPoints: 142.1, projectedPoints: 11.6 }
    ]

    return waiverPlayers.map((player, index) => ({
      id: `waiver_${index}`,
      name: player.name,
      position: player.position,
      team: player.team,
      isStarter: false,
      isInjured: false,
      fantasyPoints: player.fantasyPoints,
      projectedPoints: player.projectedPoints
    }))
  }
}

export const nflFantasyAPI = new NFLFantasyAPI()