import requests
from bs4 import BeautifulSoup, Comment
import pandas as pd
import time
import re

BASE_URL = "https://www.pro-football-reference.com"
YEAR = 2023
WEEKS = range(1, 2)  # Change this range to include more weeks

def get_game_links(week):
    url = f"{BASE_URL}/years/{YEAR}/week_{week}.htm"
    response = requests.get(url)
    if response.status_code != 200:
        print(f"❌ Failed to fetch Week {week}: Status {response.status_code}")
        return []
    soup = BeautifulSoup(response.content, "html.parser")
    summaries = soup.select("div.game_summary")

    links = []
    for summary in summaries:
        first_row = summary.select_one("tr.winner, tr.loser")
        if first_row:
            link_tag = first_row.select_one("td.gamelink a")
            if link_tag and 'href' in link_tag.attrs:
                links.append(BASE_URL + link_tag['href'])
    return links

def parse_stat_table(soup, table_id, url, game_date, label):
    table = soup.find("table", {"id": table_id})
    if not table:
        comments = soup.find_all(string=lambda text: isinstance(text, Comment))
        for comment in comments:
            if table_id in comment:
                comment_soup = BeautifulSoup(comment, "html.parser")
                table = comment_soup.find("table", {"id": table_id})
                if table:
                    break

    if table:
        try:
            df = pd.read_html(str(table), header=[0, 1])[0]
            df.columns = ['_'.join([str(c).strip().lower() for c in col if c and 'unnamed' not in str(c).lower()]) for col in df.columns.values]
            df.columns = [c if c else f"col_{i}" for i, c in enumerate(df.columns)]
            df['stat_type'] = label
            df['game_url'] = url
            df['game_date'] = game_date
            return df
        except Exception as e:
            print(f"❌ Error parsing {label} table from {url}: {e}")
    return pd.DataFrame()

def get_stats_from_game(url):
    response = requests.get(url)
    if response.status_code != 200:
        print(f"❌ Failed to fetch game page: {url}")
        return pd.DataFrame()

    soup = BeautifulSoup(response.content, "html.parser")
    game_date_tag = soup.select_one("div.scorebox_meta > div")
    game_date = game_date_tag.text.strip() if game_date_tag else None

    offense_df = parse_stat_table(soup, "player_offense", url, game_date, "offense")
    defense_df = parse_stat_table(soup, "player_defense", url, game_date, "defense")

    return pd.concat([offense_df, defense_df], ignore_index=True)

def standardize_columns(df):
    rename_map = {
        'player': 'name',
        'tm': 'team',
        'passing_yds_1': 'passing_yds_sacked',
        'int': 'def_int', 'yds': 'def_int_yds', 'td': 'def_int_td', 'lng': 'def_int_lng',
        'pd': 'def_passes_defended',
        'sk': 'def_sacks',
        'solo': 'def_tackles_solo', 'ast': 'def_tackles_ast', 'comb': 'def_tackles_comb',
        'tfl': 'def_tackles_for_loss', 'qbhits': 'def_qb_hits',
        'fr': 'def_fumbles_rec', 'yds_1': 'def_fumbles_yds', 'td_1': 'def_fumbles_td',
        'ff': 'def_forced_fumbles'
    }
    df.columns = df.columns.str.lower().str.strip().str.replace("__", "_").str.replace(" ", "_")
    df = df.rename(columns=rename_map)
    return df

# Step 1: Scrape and collect all stats
all_stats_raw = []
for week in WEEKS:
    print(f"\n🔎 Scraping Week {week}")
    try:
        links = get_game_links(week)
        print(f"  ✅ Found {len(links)} games")
        for link in links:
            print(f"    📅 {link}")
            stats = get_stats_from_game(link)
            if not stats.empty:
                all_stats_raw.append(stats)
            time.sleep(6)  # Delay between games
    except Exception as e:
        print(f"❌ Error scraping week {week}: {e}")

# Step 2: Combine and clean data
if all_stats_raw:
    all_stats = pd.concat(all_stats_raw, ignore_index=True)
    all_stats = standardize_columns(all_stats)
    all_stats = all_stats[~all_stats['name'].astype(str).str.contains("Player|Cmp|Att|Yds|TD|Int|Sk|Rate", na=False)]
    all_stats = all_stats[all_stats['name'].notna()].reset_index(drop=True)
    all_stats['game_date'] = pd.to_datetime(all_stats['game_date'], errors='coerce')
    all_stats = all_stats.loc[:, ~all_stats.columns.duplicated()]
    all_stats = all_stats.dropna(axis=1, how='all')

    # Save final cleaned stats
    all_stats.to_csv("player_2026.csv", index=False)
    print("\n✅ Data cleaned and saved as player_2026.csv")
else:
    print("\n❌ No data scraped.")
