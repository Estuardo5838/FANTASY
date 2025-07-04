# Fantasy Glitch - GitHub-Connected Fantasy Football Platform

A premium fantasy football analytics platform that connects directly to your GitHub repository for real-time data updates.

## 🔗 GitHub Integration - LIVE CONNECTED

### Current Repository Configuration
- **Repository**: `https://github.com/Estuardo5838/FANTASY`
- **Branch**: `main`
- **Status**: ✅ **LIVE CONNECTED**

### Required Files in Your Repository

1. **Player Data Files** (at least one required):
   - `player_trade_value.csv` - Complete player data with predictions (preferred)
   - `player_2024.csv` - Current season stats
   - `player_2023.csv` - Previous season stats

2. **Injury Data File** (optional):
   - `injured.csv` - Daily updated list of injured players

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
- Fallback to demo data when GitHub unavailable

### Code-Based Access System
- **101 unified access codes** - all provide identical full access
- **No premium tiers** - every code unlocks everything
- **Simple entry** - just enter any valid code
- **Permanent access** - enter once, access forever

### Advanced Analytics
- Player comparison tools with injury considerations
- Trade value analysis with injury risk assessment
- Draft assistant with health-based recommendations
- Market analysis excluding injured players

### NFL Fantasy Integration
- **Sleeper API** - ✅ **WORKS LIVE** immediately
- **NFL Fantasy** - Shows demo data (API limitations)
- **Clean status indicators** - users know what's real
- **No confusion** - clear messaging

## 🛠 Technical Implementation

### Data Loading Strategy
1. **Primary**: Load `player_trade_value.csv` (most complete)
2. **Fallback**: Load season files (`player_2024.csv`, `player_2023.csv`)
3. **Injury Data**: Load `injured.csv` (optional)
4. **Demo Fallback**: Display demo data when GitHub unavailable

### Automatic Updates
- Platform checks GitHub every 5 minutes for updates
- Users can manually refresh data
- Injury status updates affect all recommendations
- Real-time status indicators show data freshness

### Error Handling
- Graceful handling of missing files
- Clear error messages for connection issues
- Fallback to demo data if GitHub fails
- User-friendly status indicators

## 📊 Data Flow

1. **GitHub Repository** → Raw CSV files
2. **Platform Polling** → Fetch latest data every 5 minutes
3. **CSV Parsing** → Convert to structured player data
4. **Injury Integration** → Mark injured players
5. **Analytics Engine** → Generate insights excluding injured players
6. **User Interface** → Display real-time data with injury indicators

## 🔧 Current Configuration

The platform is now configured to connect to:
- **Repository**: `https://github.com/Estuardo5838/FANTASY`
- **Files Expected**:
  - `player_trade_value.csv` (preferred)
  - `player_2024.csv` (fallback)
  - `player_2023.csv` (fallback)
  - `injured.csv` (optional)

## 📈 Data Updates

When you update your CSV files in GitHub:
1. Platform automatically detects changes within 5 minutes
2. All analytics, trades, and recommendations update automatically
3. Injury status changes immediately affect all suggestions
4. Users see real-time data freshness indicators

## 🎯 Access Codes

The platform uses a simple code-based access system:

### Sample Codes (all work identically):
- `GLITCH2024`
- `DRAGON101`
- `CHAMPION23`
- `WIZARD24`
- `ELITE101`

**Total**: 101 codes available - all provide complete access!

## 🚀 Getting Started

1. **Enter any access code** from the list above
2. **Platform connects to GitHub** automatically
3. **Real-time data loads** from your repository
4. **All features unlocked** - no restrictions!

The platform is now fully connected to your GitHub repository and will provide live, accurate fantasy football analytics based on your data!