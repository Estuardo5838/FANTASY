import pandas as pd
import time
import random

# Pro-Football-Reference team codes for 2024
pfr_teams = {
    'crd': 'Arizona Cardinals', 'atl': 'Atlanta Falcons', 'rav': 'Baltimore Ravens',
    'buf': 'Buffalo Bills', 'car': 'Carolina Panthers', 'chi': 'Chicago Bears',
    'cin': 'Cincinnati Bengals', 'cle': 'Cleveland Browns', 'dal': 'Dallas Cowboys',
    'den': 'Denver Broncos', 'det': 'Detroit Lions', 'gnb': 'Green Bay Packers',
    'htx': 'Houston Texans', 'clt': 'Indianapolis Colts', 'jax': 'Jacksonville Jaguars',
    'kan': 'Kansas City Chiefs', 'rai': 'Las Vegas Raiders', 'sdg': 'Los Angeles Chargers',
    'ram': 'Los Angeles Rams', 'mia': 'Miami Dolphins', 'min': 'Minnesota Vikings',
    'nwe': 'New England Patriots', 'nor': 'New Orleans Saints', 'nyg': 'New York Giants',
    'nyj': 'New York Jets', 'phi': 'Philadelphia Eagles', 'pit': 'Pittsburgh Steelers',
    'sfo': 'San Francisco 49ers', 'sea': 'Seattle Seahawks', 'tam': 'Tampa Bay Buccaneers',
    'oti': 'Tennessee Titans', 'was': 'Washington Commanders'
}

# List to store player data
all_players = []

for code, team_name in pfr_teams.items():
    url = f'https://www.pro-football-reference.com/teams/{code}/2024_roster.htm'
    print(f"🔍 Scraping {team_name} — {url}")
    try:
        tables = pd.read_html(url)
        roster = tables[0]

        if 'Player' in roster.columns and 'Pos' in roster.columns:
            for _, row in roster.iterrows():
                name = str(row['Player']).strip()
                pos = str(row['Pos']).strip()

                # Filter: skip rows like "Offensive Starters" or empty positions
                if name and pos and not name.lower().startswith(('offensive', 'defensive')):
                    all_players.append([name, team_name, pos])

        time.sleep(random.uniform(4, 6))

    except Exception as e:
        print(f"⚠️ Could not scrape {team_name}: {e}")

# Convert to DataFrame
df = pd.DataFrame(all_players, columns=['Name', 'Team', 'POS'])

# Save cleaned CSV
df.to_csv('active_player_positions.csv', index=False)
print("✅ Done! Cleaned data saved to 'active_player_positions.csv'")
