# Fantasy Glitch - GitHub-Connected Fantasy Football Platform

A premium fantasy football analytics platform that connects directly to your GitHub repository for real-time data updates.

## 🔗 GitHub Integration

### Required Files in Your Repository

1. **Player Data Files** (at least one required):
   - `player_trade_value.csv` - Complete player data with predictions (preferred)
   - `player_2024.csv` - Current season stats
   - `player_2023.csv` - Previous season stats

2. **Injury Data File** (optional):
   - `injured.csv` - Daily updated list of injured players

### Setting Up GitHub Connection

1. Update the GitHub configuration in `src/hooks/usePlayerData.ts`:
   ```typescript
   const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main'
   ```

2. Replace `YOUR_USERNAME` and `YOUR_REPO` with your actual GitHub details

3. Ensure your repository is **public** for the platform to access the files

### CSV File Formats

#### Player Data CSV (player_trade_value.csv)
Required columns:
- `name` - Player name
- `team` - Team abbreviation
- `position` - Player position (QB, RB, WR, TE, etc.)
- `total_fantasy_points` - Season total fantasy points
- `avg_fantasy_points` - Average fantasy points per game
- `volatility` - Performance volatility (0-1)
- `predicted_value` - AI-predicted player value
- `games_played` - Number of games played

Optional stat columns:
- `passing_yds_sum`, `passing_td_sum`, `passing_int_sum`
- `rushing_yds_sum`, `rushing_td_sum`
- `receiving_yds_sum`, `receiving_td_sum`, `receiving_rec_sum`

#### Injury Data CSV (injured.csv)
Required columns:
- `Name` or `Player` - Player name (must match names in player data)

Optional columns:
- `Injury` - Type of injury
- `Status` - Injury status
- `Expected Return` - Expected return date

## 🚀 Features

### Real-Time Data Updates
- Automatic polling every 5 minutes for new data
- Manual refresh capability
- Live injury status tracking
- No mock data - shows "No information" when data unavailable

### Injury Management
- Daily injury report integration
- Automatic replacement suggestions for injured players
- Trade analysis considers injury status
- Draft recommendations avoid injured players
- Team management highlights injured roster players

### Advanced Analytics
- Player comparison tools with injury considerations
- Trade value analysis with injury risk assessment
- Draft assistant with health-based recommendations
- Market analysis excluding injured players

### Premium Features
- $20/month subscription model
- 7-day free trial
- Complete analytics suite
- Real-time GitHub data synchronization

## 🛠 Technical Implementation

### Data Loading Strategy
1. **Primary**: Load `player_trade_value.csv` (most complete)
2. **Fallback**: Load season files (`player_2024.csv`, `player_2023.csv`)
3. **Injury Data**: Load `injured.csv` (optional)
4. **No Mock Data**: Display empty states when no data available

### Automatic Updates
- Platform checks GitHub every 5 minutes for updates
- Users can manually refresh data
- Injury status updates affect all recommendations
- Real-time status indicators show data freshness

### Error Handling
- Graceful handling of missing files
- Clear error messages for connection issues
- Fallback to previous data if updates fail
- User-friendly status indicators

## 📊 Data Flow

1. **GitHub Repository** → Raw CSV files
2. **Platform Polling** → Fetch latest data every 5 minutes
3. **CSV Parsing** → Convert to structured player data
4. **Injury Integration** → Mark injured players
5. **Analytics Engine** → Generate insights excluding injured players
6. **User Interface** → Display real-time data with injury indicators

## 🔧 Setup Instructions

1. Clone this repository
2. Update GitHub configuration in `src/hooks/usePlayerData.ts`
3. Ensure your GitHub repo contains the required CSV files
4. Run `npm install` and `npm run dev`
5. Platform will automatically connect to your GitHub data

## 📈 Data Updates

When you update your CSV files in GitHub:
1. Platform automatically detects changes within 5 minutes
2. All analytics, trades, and recommendations update automatically
3. Injury status changes immediately affect all suggestions
4. Users see real-time data freshness indicators

The platform is now fully connected to your GitHub repository and will provide live, accurate fantasy football analytics based on your data!