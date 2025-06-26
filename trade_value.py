import pandas as pd
import numpy as np
from glob import glob
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import time

# === Step 1: Load and Combine Datasets ===
all_files = glob("player_20*.csv")
print(f"📂 Found CSV files: {all_files}")
if not all_files:
    input("❌ No player CSV files found. Press Enter to exit...")
    raise ValueError("No player CSV files found.")

all_stats = []
for file in all_files:
    df = pd.read_csv(file)
    year = int(file.split("_")[1].split(".")[0])
    df['season'] = year
    all_stats.append(df)

data = pd.concat(all_stats, ignore_index=True)

# === Step 2: Clean and Fill ===
data = data.dropna(subset=['name'])
data = data.fillna(0)

# === Step 3: Fantasy Points Formula (offensive + defensive) ===
def calc_fantasy(row):
    if row['stat_type'] == 'offense':
        return (
            row.get('passing_yds', 0) * 0.04 +
            row.get('passing_td', 0) * 4 -
            row.get('passing_int', 0) * 1 +
            row.get('rushing_yds', 0) * 0.1 +
            row.get('rushing_td', 0) * 6 +
            row.get('receiving_yds', 0) * 0.1 +
            row.get('receiving_td', 0) * 6 +
            row.get('receiving_rec', 0) * 1 +  # Sleeper es PPR (1 punto por recepción)
            row.get('fumbles_fl', 0) * -2
        )
    
    elif row['stat_type'] == 'defense':
        return (
            row.get('tackles_solo', 0) * 1.5 +
            row.get('tackles_ast', 0) * 0.75 +
            row.get('def_sacks', 0) * 2 +
            row.get('def_interceptions_int', 0) * 3 +
            row.get('def_interceptions_pd', 0) * 1 +
            row.get('fumbles_ff', 0) * 3 +
            row.get('fumbles_fr', 0) * 2 +
            row.get('fumbles_td', 0) * 6 +
            row.get('def_interceptions_td', 0) * 6
        )
    
    return 0



data['fantasy_points'] = data.apply(calc_fantasy, axis=1)

# === Step 4: Aggregate Stats per Player-Season ===
aggs = {
    'fantasy_points': ['sum', 'mean', 'std'],
    'passing_cmp': 'sum', 'passing_att': 'sum', 'passing_yds': 'sum', 'passing_td': 'sum',
    'passing_int': 'sum', 'rushing_att': 'sum', 'rushing_yds': 'sum', 'rushing_td': 'sum',
    'receiving_tgt': 'sum', 'receiving_rec': 'sum', 'receiving_yds': 'sum', 'receiving_td': 'sum',
    'fumbles_fl': 'sum', 'game_url': pd.Series.nunique
}

# Add defensive features if present
defensive_cols = [
    'def_tackles_solo', 'def_tackles_ast', 'def_sacks', 'def_int', 'def_passes_defended',
    'def_fumbles_rec', 'def_forced_fumbles', 'def_fumbles_td', 'def_int_td'
]

for col in defensive_cols:
    if col in data.columns:
        aggs[col] = 'sum'

df_agg = data.groupby(['name', 'team', 'season', 'stat_type']).agg(aggs)
df_agg.columns = ['_'.join(col) if isinstance(col, tuple) else col for col in df_agg.columns]
df_agg = df_agg.reset_index()
df_agg = df_agg.rename(columns={
    'fantasy_points_sum': 'total_fantasy_points',
    'fantasy_points_mean': 'avg_fantasy_points',
    'fantasy_points_std': 'volatility',
    'game_url_nunique': 'games_played'
})

# === Step 5: Model Training ===
base_features = [
    'passing_yds_sum', 'passing_td_sum', 'passing_int_sum',
    'rushing_yds_sum', 'rushing_td_sum',
    'receiving_yds_sum', 'receiving_td_sum', 'receiving_rec_sum',
    'fumbles_fl_sum', 'games_played'
]
def_features = [f + '_sum' for f in defensive_cols if f + '_sum' in df_agg.columns]

features = base_features + def_features
df_model = df_agg.dropna(subset=features + ['total_fantasy_points'])
X = df_model[features]
y = df_model['total_fantasy_points']

if len(df_model) >= 10:
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = XGBRegressor(n_estimators=100, max_depth=4, random_state=42)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    print(f"✅ Model trained. Test MSE: {mse:.2f}")
else:
    print("⚠️ Not enough data — training on all.")
    model = XGBRegressor(n_estimators=100, max_depth=4, random_state=42)
    model.fit(X, y)

df_model['predicted_value'] = model.predict(X)

# === Step 6: Merge and Export ===
df_export = pd.merge(
    data,
    df_model[['name', 'team', 'season', 'stat_type', 'predicted_value', 'volatility']],
    on=['name', 'team', 'season', 'stat_type'],
    how='left'
)

# Save
df_export.to_csv("player_trade_value.csv", index=False)
print("\n📅 Trade values saved to player_trade_value.csv")
time.sleep(10)
