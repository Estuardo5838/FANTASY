import axios from 'axios'

export interface SleeperLeague {
  league_id: string
  name: string
  total_rosters: number
  scoring_settings: any
  roster_positions: string[]
  season: string
  week: number
}

export interface SleeperUser {
  user_id: string
  username: string
  display_name: string
  avatar: string
}

export interface SleeperRoster {
  roster_id: number
  owner_id: string
  players: string[]
  starters: string[]
  settings: {
    wins: number
    losses: number
    ties: number
    fpts: number
  }
}

export interface SleeperPlayer {
  player_id: string
  full_name: string
  position: string
  team: string
  fantasy_positions: string[]
  injury_status?: string
}

class SleeperAPI {
  private baseURL = 'https://api.sleeper.app/v1'

  async getLeague(leagueId: string): Promise<SleeperLeague> {
    try {
      // For demo, return mock data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return {
        league_id: leagueId,
        name: 'Dynasty Legends League',
        total_rosters: 12,
        scoring_settings: {
          rec: 1, // PPR
          pass_td: 4,
          rush_td: 6,
          rec_td: 6
        },
        roster_positions: ['QB', 'RB', 'RB', 'WR', 'WR', 'TE', 'FLEX', 'K', 'DEF'],
        season: '2024',
        week: 15
      }
    } catch (error) {
      throw new Error('Failed to fetch Sleeper league data')
    }
  }

  async getUsers(leagueId: string): Promise<SleeperUser[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return Array.from({ length: 12 }, (_, i) => ({
        user_id: `user_${i + 1}`,
        username: `manager${i + 1}`,
        display_name: `Fantasy Manager ${i + 1}`,
        avatar: `avatar_${i + 1}`
      }))
    } catch (error) {
      throw new Error('Failed to fetch league users')
    }
  }

  async getRosters(leagueId: string): Promise<SleeperRoster[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return Array.from({ length: 12 }, (_, i) => ({
        roster_id: i + 1,
        owner_id: `user_${i + 1}`,
        players: this.generateMockPlayerIds(),
        starters: this.generateMockStarterIds(),
        settings: {
          wins: Math.floor(Math.random() * 10) + 3,
          losses: Math.floor(Math.random() * 8) + 2,
          ties: 0,
          fpts: Math.floor(Math.random() * 500) + 1200
        }
      }))
    } catch (error) {
      throw new Error('Failed to fetch rosters')
    }
  }

  async getPlayers(): Promise<Record<string, SleeperPlayer>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock player data
      const players: Record<string, SleeperPlayer> = {
        '4046': {
          player_id: '4046',
          full_name: 'Josh Allen',
          position: 'QB',
          team: 'BUF',
          fantasy_positions: ['QB']
        },
        '4035': {
          player_id: '4035',
          full_name: 'Christian McCaffrey',
          position: 'RB',
          team: 'SF',
          fantasy_positions: ['RB']
        },
        '6797': {
          player_id: '6797',
          full_name: 'Tyreek Hill',
          position: 'WR',
          team: 'MIA',
          fantasy_positions: ['WR']
        },
        '4881': {
          player_id: '4881',
          full_name: 'Travis Kelce',
          position: 'TE',
          team: 'KC',
          fantasy_positions: ['TE']
        }
      }
      
      return players
    } catch (error) {
      throw new Error('Failed to fetch player data')
    }
  }

  async getTrades(leagueId: string): Promise<any[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return [
        {
          transaction_id: 'trade_1',
          type: 'trade',
          status: 'complete',
          roster_ids: [1, 2],
          adds: { '4046': 2 }, // Josh Allen to roster 2
          drops: { '4035': 1 }, // Christian McCaffrey from roster 1
          created: Date.now() - 86400000 // 1 day ago
        }
      ]
    } catch (error) {
      throw new Error('Failed to fetch trades')
    }
  }

  async getWaiverClaims(leagueId: string, week: number): Promise<any[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return [
        {
          transaction_id: 'waiver_1',
          type: 'waiver',
          status: 'complete',
          roster_ids: [1],
          adds: { '6797': 1 }, // Added Tyreek Hill
          drops: null,
          waiver_budget: [
            { sender: 1, receiver: 0, amount: 15 }
          ],
          created: Date.now() - 3600000 // 1 hour ago
        }
      ]
    } catch (error) {
      throw new Error('Failed to fetch waiver claims')
    }
  }

  private generateMockPlayerIds(): string[] {
    return ['4046', '4035', '6797', '4881', '5045', '6794', '7564', '8123', '9456', '1234', '5678', '9012', '3456', '7890', '2468']
  }

  private generateMockStarterIds(): string[] {
    return ['4046', '4035', '6797', '4881', '5045', '6794', '7564', '8123', '9456']
  }
}

export const sleeperAPI = new SleeperAPI()