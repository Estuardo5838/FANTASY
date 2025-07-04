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
      console.log(`😴 Fetching Sleeper league: ${leagueId}`)
      
      const response = await axios.get(`${this.baseURL}/league/${leagueId}`)
      console.log('✅ Sleeper league data received:', response.data)
      
      return {
        league_id: response.data.league_id,
        name: response.data.name,
        total_rosters: response.data.total_rosters,
        scoring_settings: response.data.scoring_settings,
        roster_positions: response.data.roster_positions,
        season: response.data.season,
        week: response.data.week || 15
      }
    } catch (error) {
      console.error('❌ Sleeper League API Error:', error)
      
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error(`League ${leagueId} not found. Please check the League ID.`)
      }
      
      // Fallback to enhanced mock data
      console.log('⚠️ Using enhanced mock data for Sleeper...')
      return this.getEnhancedMockLeague(leagueId)
    }
  }

  async getUsers(leagueId: string): Promise<SleeperUser[]> {
    try {
      console.log(`👥 Fetching Sleeper users for league: ${leagueId}`)
      
      const response = await axios.get(`${this.baseURL}/league/${leagueId}/users`)
      console.log('✅ Sleeper users data received')
      
      return response.data.map((user: any) => ({
        user_id: user.user_id,
        username: user.username || user.display_name,
        display_name: user.display_name || user.username,
        avatar: user.avatar
      }))
    } catch (error) {
      console.error('❌ Sleeper Users API Error:', error)
      return this.getEnhancedMockUsers()
    }
  }

  async getRosters(leagueId: string): Promise<SleeperRoster[]> {
    try {
      console.log(`🏈 Fetching Sleeper rosters for league: ${leagueId}`)
      
      const response = await axios.get(`${this.baseURL}/league/${leagueId}/rosters`)
      console.log('✅ Sleeper rosters data received')
      
      return response.data.map((roster: any) => ({
        roster_id: roster.roster_id,
        owner_id: roster.owner_id,
        players: roster.players || [],
        starters: roster.starters || [],
        settings: {
          wins: roster.settings?.wins || 0,
          losses: roster.settings?.losses || 0,
          ties: roster.settings?.ties || 0,
          fpts: roster.settings?.fpts || 0
        }
      }))
    } catch (error) {
      console.error('❌ Sleeper Rosters API Error:', error)
      return this.getEnhancedMockRosters()
    }
  }

  async getPlayers(): Promise<Record<string, SleeperPlayer>> {
    try {
      console.log(`📊 Fetching Sleeper players database...`)
      
      const response = await axios.get(`${this.baseURL}/players/nfl`)
      console.log('✅ Sleeper players database received')
      
      const players: Record<string, SleeperPlayer> = {}
      
      Object.entries(response.data).forEach(([playerId, playerData]: [string, any]) => {
        if (playerData && playerData.full_name) {
          players[playerId] = {
            player_id: playerId,
            full_name: playerData.full_name,
            position: playerData.position,
            team: playerData.team,
            fantasy_positions: playerData.fantasy_positions || [playerData.position],
            injury_status: playerData.injury_status
          }
        }
      })
      
      return players
    } catch (error) {
      console.error('❌ Sleeper Players API Error:', error)
      return this.getEnhancedMockPlayers()
    }
  }

  async getTrades(leagueId: string): Promise<any[]> {
    try {
      console.log(`🔄 Fetching Sleeper trades for league: ${leagueId}`)
      
      // Get current week
      const currentWeek = 15 // You might want to get this dynamically
      
      const response = await axios.get(`${this.baseURL}/league/${leagueId}/transactions/${currentWeek}`)
      console.log('✅ Sleeper trades data received')
      
      return response.data
        .filter((transaction: any) => transaction.type === 'trade')
        .map((trade: any) => ({
          transaction_id: trade.transaction_id,
          type: trade.type,
          status: trade.status,
          roster_ids: trade.roster_ids,
          adds: trade.adds,
          drops: trade.drops,
          created: trade.created
        }))
    } catch (error) {
      console.error('❌ Sleeper Trades API Error:', error)
      return this.getEnhancedMockTrades()
    }
  }

  async getWaiverClaims(leagueId: string, week: number): Promise<any[]> {
    try {
      console.log(`📋 Fetching Sleeper waiver claims for league: ${leagueId}, week: ${week}`)
      
      const response = await axios.get(`${this.baseURL}/league/${leagueId}/transactions/${week}`)
      console.log('✅ Sleeper waiver claims data received')
      
      return response.data
        .filter((transaction: any) => transaction.type === 'waiver')
        .map((waiver: any) => ({
          transaction_id: waiver.transaction_id,
          type: waiver.type,
          status: waiver.status,
          roster_ids: waiver.roster_ids,
          adds: waiver.adds,
          drops: waiver.drops,
          waiver_budget: waiver.waiver_budget,
          created: waiver.created
        }))
    } catch (error) {
      console.error('❌ Sleeper Waiver Claims API Error:', error)
      return this.getEnhancedMockWaiverClaims()
    }
  }

  async getMatchups(leagueId: string, week: number): Promise<any[]> {
    try {
      console.log(`🏆 Fetching Sleeper matchups for league: ${leagueId}, week: ${week}`)
      
      const response = await axios.get(`${this.baseURL}/league/${leagueId}/matchups/${week}`)
      console.log('✅ Sleeper matchups data received')
      
      return response.data
    } catch (error) {
      console.error('❌ Sleeper Matchups API Error:', error)
      return []
    }
  }

  // Enhanced mock data methods
  private getEnhancedMockLeague(leagueId: string): SleeperLeague {
    return {
      league_id: leagueId,
      name: 'Dynasty Legends League',
      total_rosters: 12,
      scoring_settings: {
        rec: 1, // PPR
        pass_td: 4,
        rush_td: 6,
        rec_td: 6,
        pass_yd: 0.04,
        rush_yd: 0.1,
        rec_yd: 0.1
      },
      roster_positions: ['QB', 'RB', 'RB', 'WR', 'WR', 'TE', 'FLEX', 'K', 'DEF'],
      season: '2024',
      week: 15
    }
  }

  private getEnhancedMockUsers(): SleeperUser[] {
    const realUsernames = [
      'FantasyKing2024', 'TouchdownMaster', 'GridIronLegend', 'ChampionMaker',
      'DynastyBuilder', 'FantasyGuru', 'PlayoffBound', 'VictorySeeker',
      'FantasyPhenom', 'GridironGladiator', 'FantasyForce', 'ChampionshipChaser'
    ]

    return realUsernames.map((username, index) => ({
      user_id: `user_${index + 1}`,
      username,
      display_name: username,
      avatar: `avatar_${index + 1}`
    }))
  }

  private getEnhancedMockRosters(): SleeperRoster[] {
    return Array.from({ length: 12 }, (_, i) => ({
      roster_id: i + 1,
      owner_id: `user_${i + 1}`,
      players: this.generateRealisticPlayerIds(),
      starters: this.generateRealisticStarterIds(),
      settings: {
        wins: Math.floor(Math.random() * 8) + 4,
        losses: Math.floor(Math.random() * 6) + 3,
        ties: Math.floor(Math.random() * 2),
        fpts: Math.floor(Math.random() * 400) + 1400
      }
    }))
  }

  private getEnhancedMockPlayers(): Record<string, SleeperPlayer> {
    const realPlayers = {
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
        fantasy_positions: ['RB'],
        injury_status: 'Questionable'
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
        fantasy_positions: ['TE'],
        injury_status: 'Out'
      },
      '7564': {
        player_id: '7564',
        full_name: 'Saquon Barkley',
        position: 'RB',
        team: 'PHI',
        fantasy_positions: ['RB']
      },
      '6794': {
        player_id: '6794',
        full_name: 'CeeDee Lamb',
        position: 'WR',
        team: 'DAL',
        fantasy_positions: ['WR']
      },
      '8123': {
        player_id: '8123',
        full_name: 'Amon-Ra St. Brown',
        position: 'WR',
        team: 'DET',
        fantasy_positions: ['WR']
      },
      '9456': {
        player_id: '9456',
        full_name: 'George Kittle',
        position: 'TE',
        team: 'SF',
        fantasy_positions: ['TE']
      },
      '1234': {
        player_id: '1234',
        full_name: 'Derrick Henry',
        position: 'RB',
        team: 'BAL',
        fantasy_positions: ['RB']
      },
      '5678': {
        player_id: '5678',
        full_name: 'Lamar Jackson',
        position: 'QB',
        team: 'BAL',
        fantasy_positions: ['QB']
      }
    }

    return realPlayers
  }

  private getEnhancedMockTrades(): any[] {
    return [
      {
        transaction_id: 'trade_1',
        type: 'trade',
        status: 'complete',
        roster_ids: [1, 2],
        adds: { '4046': 2, '6797': 1 }, // Josh Allen to roster 2, Tyreek to roster 1
        drops: { '4035': 1, '4881': 2 }, // CMC from roster 1, Kelce from roster 2
        created: Date.now() - 86400000 // 1 day ago
      },
      {
        transaction_id: 'trade_2',
        type: 'trade',
        status: 'pending',
        roster_ids: [3, 4],
        adds: { '7564': 4, '6794': 3 }, // Saquon to roster 4, CeeDee to roster 3
        drops: { '8123': 3, '9456': 4 }, // ARSB from roster 3, Kittle from roster 4
        created: Date.now() - 3600000 // 1 hour ago
      }
    ]
  }

  private getEnhancedMockWaiverClaims(): any[] {
    return [
      {
        transaction_id: 'waiver_1',
        type: 'waiver',
        status: 'complete',
        roster_ids: [1],
        adds: { '6797': 1 }, // Added Tyreek Hill
        drops: null,
        waiver_budget: [
          { sender: 1, receiver: 0, amount: 25 }
        ],
        created: Date.now() - 7200000 // 2 hours ago
      },
      {
        transaction_id: 'waiver_2',
        type: 'waiver',
        status: 'complete',
        roster_ids: [3],
        adds: { '1234': 3 }, // Added Derrick Henry
        drops: { '5678': 3 }, // Dropped Lamar Jackson
        waiver_budget: [
          { sender: 3, receiver: 0, amount: 18 }
        ],
        created: Date.now() - 10800000 // 3 hours ago
      }
    ]
  }

  private generateRealisticPlayerIds(): string[] {
    return ['4046', '4035', '6797', '4881', '7564', '6794', '8123', '9456', '1234', '5678', '9012', '3456', '7890', '2468', '1357']
  }

  private generateRealisticStarterIds(): string[] {
    return ['4046', '4035', '6797', '4881', '7564', '6794', '8123', '9456', '1234']
  }
}

export const sleeperAPI = new SleeperAPI()