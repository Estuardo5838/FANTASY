export interface Player {
  name: string
  team: string
  position: string
  total_fantasy_points: number
  avg_fantasy_points: number
  volatility: number
  predicted_value: number
  games_played: number
  passing_yds_sum?: number
  passing_td_sum?: number
  passing_int_sum?: number
  rushing_yds_sum?: number
  rushing_td_sum?: number
  receiving_yds_sum?: number
  receiving_td_sum?: number
  receiving_rec_sum?: number
  fumbles_fl_sum?: number
  season: number
  stat_type: 'offense' | 'defense'
}

export interface User {
  id: string
  email: string
  full_name: string | null
  subscription_status: 'free' | 'premium' | 'trial'
  subscription_end: string | null
  created_at: string
  updated_at: string
}

export interface Team {
  id: string
  user_id: string
  name: string
  players: string[]
  created_at: string
  updated_at: string
}

export interface Trade {
  id: string
  from_user_id: string
  to_user_id: string
  from_players: string[]
  to_players: string[]
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
}

export interface DraftPick {
  round: number
  pick: number
  player: Player | null
  user_id: string | null
}

export interface League {
  id: string
  name: string
  commissioner_id: string
  teams: Team[]
  draft_order: string[]
  settings: LeagueSettings
  created_at: string
}

export interface LeagueSettings {
  team_count: number
  roster_size: number
  scoring_type: 'standard' | 'ppr' | 'half_ppr'
  trade_deadline: string
  playoff_weeks: number[]
}

export interface PlayerStats {
  week: number
  opponent: string
  fantasy_points: number
  passing_yds?: number
  passing_td?: number
  passing_int?: number
  rushing_yds?: number
  rushing_td?: number
  receiving_yds?: number
  receiving_td?: number
  receiving_rec?: number
  fumbles_fl?: number
}

export interface TradeAnalysis {
  player1: Player
  player2: Player
  value_difference: number
  recommendation: 'accept' | 'decline' | 'neutral'
  reasoning: string[]
  confidence: number
}

export interface WeeklyOpportunity {
  type: 'trending_up' | 'matchup' | 'injury_return' | 'waiver_target'
  player: Player
  reason: string
  confidence: number
  action: string
  week?: number
}

export interface LeagueConnection {
  platform: 'nfl' | 'sleeper' | 'espn' | 'yahoo'
  leagueId: string
  leagueName: string
  connected: boolean
  lastSync: Date
  teamCount: number
  scoringType: string
}

export interface DraftRecommendation {
  player: Player
  value: number
  tier: number
  position_rank: number
  overall_rank: number
  reasoning: string[]
}

export interface MarketPlayer {
  player: Player
  asking_price: number
  owner_id: string | null
  available: boolean
  trending: 'up' | 'down' | 'stable'
}

export interface Notification {
  id: string
  user_id: string
  type: 'trade_offer' | 'trade_accepted' | 'trade_rejected' | 'draft_reminder' | 'player_news'
  title: string
  message: string
  read: boolean
  created_at: string
}