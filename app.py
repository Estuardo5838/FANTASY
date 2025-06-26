import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

# Page config
st.set_page_config(page_title="Fantasy Football Manager", page_icon="🏈", layout="wide")

# Custom CSS for modern look
st.markdown("""
<style>
    .stTabs [data-baseweb="tab-list"] {
        gap: 24px;
    }
    .stTabs [data-baseweb="tab"] {
        height: 50px;
        padding-left: 20px;
        padding-right: 20px;
        background-color: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
    }
    .stTabs [aria-selected="true"] {
        background-color: rgba(255, 75, 75, 0.2);
    }
    div[data-testid="metric-container"] {
        background-color: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'my_team' not in st.session_state:
    st.session_state.my_team = []
if 'drafted_players' not in st.session_state:
    st.session_state.drafted_players = {}  # {player_name: team_owner}
# Ensure drafted_players is always a dict (fix for legacy data)
if isinstance(st.session_state.drafted_players, list):
    # Convert list to dict if needed
    temp_dict = {}
    for player in st.session_state.drafted_players:
        temp_dict[player] = 'Unknown Team'
    st.session_state.drafted_players = temp_dict
if 'competition_teams' not in st.session_state:
    st.session_state.competition_teams = {}  # {team_name: [players]}
if 'market_updates' not in st.session_state:
    st.session_state.market_updates = []  # [{action: 'drop/add', player:, team:, timestamp:}]
if 'free_agents' not in st.session_state:
    st.session_state.free_agents = []
if 'season_weights' not in st.session_state:
    st.session_state.season_weights = {}

# Load and process data
@st.cache_data
def load_data():
    df_trade = pd.read_csv('player_trade_value.csv')
    df_2023 = pd.read_csv('player_2023.csv')
    df_2024 = pd.read_csv('player_2024.csv')
    
    df_2023['season'] = 2023
    df_2024['season'] = 2024
    
    df_historical = pd.concat([df_2023, df_2024], ignore_index=True)
    
    return df_trade, df_historical

# Calculate weighted fantasy points with percentage-based flexible season weighting
def calculate_weighted_stats(df_historical, player_name, season_weights):
    player_data = df_historical[df_historical['name'] == player_name].copy()
    
    if player_data.empty:
        return None
    
    # Calculate fantasy points if not already present
    if 'fantasy_points_calc' not in player_data.columns:
        player_data['fantasy_points_calc'] = (
            player_data['passing_yds'].fillna(0) * 0.04 +
            player_data['passing_td'].fillna(0) * 4 +
            player_data['passing_int'].fillna(0) * -2 +
            player_data['rushing_yds'].fillna(0) * 0.1 +
            player_data['rushing_td'].fillna(0) * 6 +
            player_data['receiving_yds'].fillna(0) * 0.1 +
            player_data['receiving_td'].fillna(0) * 6 +
            player_data['fumbles_fl'].fillna(0) * -2 +
            # Defense scoring
            player_data['def_interceptions_int'].fillna(0) * 2 +
            player_data['def_interceptions_td'].fillna(0) * 6 +
            player_data['def_sacks'].fillna(0) * 1 +
            player_data['fumbles_fr'].fillna(0) * 2 +
            player_data['fumbles_td'].fillna(0) * 6 +
            player_data['tackles_solo'].fillna(0) * 0.5 +
            player_data['tackles_ast'].fillna(0) * 0.25
        )
    
    season_stats = player_data.groupby('season').agg({
        'fantasy_points_calc': ['sum', 'mean', 'std'],
        'passing_yds': 'sum',
        'passing_td': 'sum',
        'rushing_yds': 'sum',
        'rushing_td': 'sum',
        'receiving_yds': 'sum',
        'receiving_td': 'sum',
        'def_interceptions_int': 'sum',
        'def_sacks': 'sum',
        'tackles_comb': 'sum',
        'fumbles_fr': 'sum',
        'game_date': 'count'
    })
    
    season_stats.columns = ['_'.join(col).strip() for col in season_stats.columns.values]
    season_stats.rename(columns={'game_date_count': 'games_played'}, inplace=True)
    
    # Calculate weighted stats based on percentage weights
    weighted_stats = {}
    total_weight = sum(season_weights.get(season, 0) for season in season_stats.index)
    
    if total_weight > 0:
        for col in season_stats.columns:
            weighted_sum = 0
            for season in season_stats.index:
                # Use raw percentage weight
                weight = season_weights.get(season, 0) / 100.0
                weighted_sum += season_stats.loc[season, col] * weight
            weighted_stats[col] = weighted_sum
    else:
        # If no weights, use equal weights
        for col in season_stats.columns:
            weighted_stats[col] = season_stats[col].mean()
    
    return weighted_stats

# Main app
def main():
    st.title("🏈 Fantasy Football Manager Pro")
    st.markdown("### Advanced Fantasy Football Analysis & Competition Tool")
    
    # Load data
    df_trade, df_historical = load_data()
    
    # Get unique players
    available_players = df_trade[['name', 'team', 'predicted_value', 'volatility']].drop_duplicates()
    available_players = available_players.sort_values('predicted_value', ascending=False)
    
    # Create tabs
    tabs = st.tabs(["📊 Statistics", "👥 Team Management", "📋 Draft", "💱 Trade Analyzer", 
                     "🏆 Competition", "📈 Market", "📝 Market Updates"])
    
    # Tab 1: Statistics
    with tabs[0]:
        st.header("Player Statistics & Analysis")
        
        # Get available seasons from data
        available_seasons = sorted(df_historical['season'].unique())
        
        col1, col2 = st.columns([1, 3])
        
        with col1:
            selected_player = st.selectbox(
                "Select a player to analyze",
                available_players['name'].unique()
            )
            
            st.subheader("Season Weights (%)")
            
            # Initialize season weights if not set
            if not st.session_state.season_weights:
                for season in available_seasons:
                    if season == max(available_seasons):
                        st.session_state.season_weights[season] = 100
                    else:
                        st.session_state.season_weights[season] = 0
            
            # Season weight sliders
            season_weights = {}
            for season in available_seasons:
                weight = st.slider(
                    f"{season} Weight (%)", 
                    min_value=0, 
                    max_value=200, 
                    value=int(st.session_state.season_weights.get(season, 0)),
                    step=10,
                    key=f"weight_{season}",
                    help="Set to 100% for normal weight, 200% for double weight, etc."
                )
                season_weights[season] = weight
                st.session_state.season_weights[season] = weight
            
            # Show total weight
            total_weight = sum(season_weights.values())
            if total_weight > 0:
                st.info(f"Total weight: {total_weight}%")
                if total_weight != 100:
                    st.caption("Note: Weights don't need to sum to 100%")
            else:
                st.error("Please set at least one weight > 0")
            
        with col2:
            if selected_player:
                player_info = available_players[available_players['name'] == selected_player].iloc[0]
                
                st.subheader(f"{selected_player} - {player_info['team']} ({player_type})")
                
                col_a, col_b, col_c, col_d = st.columns(4)
                with col_a:
                    st.metric("Predicted Value", f"{player_info['predicted_value']:.1f}")
                with col_b:
                    st.metric("Volatility", f"{player_info['volatility']:.2f}")
                with col_c:
                    weighted = calculate_weighted_stats(df_historical, selected_player, season_weights)
                    if weighted:
                        st.metric("Weighted Fantasy Points", f"{weighted['fantasy_points_calc_sum']:.1f}")
                with col_d:
                    if weighted and weighted.get('fantasy_points_calc_std', 0) > 0 and weighted.get('fantasy_points_calc_mean', 0) > 0:
                        st.metric("Consistency Score", f"{100 - (weighted['fantasy_points_calc_std']/weighted['fantasy_points_calc_mean']*100):.0f}%")
        
        # Player performance visualization
        if selected_player:
            player_historical = df_historical[df_historical['name'] == selected_player].copy()
            
            if not player_historical.empty:
                # Remove games with no data
                player_historical = player_historical[player_historical['fantasy_points_calc'] != 0]
                
                # Performance over time with different colors per season
                fig = go.Figure()
                
                # Color palette for seasons
                colors = ['#FF4B4B', '#4B7BFF', '#4BFF4B', '#FFD700', '#FF69B4']
                
                # Process each season separately to avoid gaps
                for idx, season in enumerate(sorted(player_historical['season'].unique())):
                    season_data = player_historical[player_historical['season'] == season].sort_values('game_date')
                    
                    if not season_data.empty:
                        color = colors[idx % len(colors)]
                        
                        # Convert dates to datetime for proper handling
                        season_data['game_date'] = pd.to_datetime(season_data['game_date'])
                        
                        fig.add_trace(go.Scatter(
                            x=season_data['game_date'],
                            y=season_data['fantasy_points_calc'],
                            mode='lines+markers',
                            name=f'Season {season}',
                            line=dict(color=color, width=3),
                            marker=dict(size=8, color=color),
                            hovertemplate='<b>Date:</b> %{x|%Y-%m-%d}<br><b>Points:</b> %{y:.1f}<extra></extra>'
                        ))
                
                fig.update_layout(
                    title=f"{selected_player} - Fantasy Points by Game",
                    xaxis_title="Game Date",
                    yaxis_title="Fantasy Points",
                    height=400,
                    template="plotly_dark",
                    hovermode='x unified',
                    xaxis=dict(
                        type="date",
                        tickformat="%b %Y"
                    )
                )
                st.plotly_chart(fig, use_container_width=True)
                
                # Create columns for charts
                col1, col2 = st.columns(2)
                
                with col1:
                    # Season comparison bar chart
                    season_summary = player_historical.groupby('season').agg({
                        'fantasy_points_calc': ['sum', 'mean'],
                        'game_date': 'count'
                    }).reset_index()
                    season_summary.columns = ['Season', 'Total Points', 'Avg Points', 'Games']
                    
                    fig_bar = px.bar(
                        season_summary,
                        x='Season',
                        y=['Total Points', 'Avg Points'],
                        title="Season Performance Comparison",
                        barmode='group',
                        color_discrete_map={'Total Points': '#FF4B4B', 'Avg Points': '#4B7BFF'},
                        template="plotly_dark"
                    )
                    fig_bar.update_layout(height=350)
                    st.plotly_chart(fig_bar, use_container_width=True)
                
                with col2:
                    # Volatility visualization
                    volatility_data = []
                    for season in player_historical['season'].unique():
                        season_points = player_historical[player_historical['season'] == season]['fantasy_points_calc']
                        if len(season_points) > 1:
                            volatility_data.append({
                                'Season': str(season),
                                'Std Dev': season_points.std(),
                                'Coefficient of Variation': (season_points.std() / season_points.mean() * 100) if season_points.mean() > 0 else 0
                            })
                    
                    if volatility_data:
                        vol_df = pd.DataFrame(volatility_data)
                        fig_vol = px.bar(
                            vol_df,
                            x='Season',
                            y='Coefficient of Variation',
                            title="Fantasy Points Volatility by Season",
                            color='Coefficient of Variation',
                            color_continuous_scale='Reds',
                            template="plotly_dark"
                        )
                        fig_vol.update_layout(height=350)
                        st.plotly_chart(fig_vol, use_container_width=True)
                
                # Stats breakdown radar chart
                if weighted:
                    # Detect player type
                    player_type = df_historical.stat_type(df_historical, selected_player)
                    
                    if player_type == 'Defense':
                        categories = ['Interceptions', 'Sacks', 'Tackles', 'Fumble Rec', 'Def TDs']
                        values = [
                            weighted.get('def_interceptions_int_sum', 0),
                            weighted.get('def_sacks_sum', 0),
                            weighted.get('tackles_comb_sum', 0) / 10,  # Scale down
                            weighted.get('fumbles_fr_sum', 0),
                            (weighted.get('def_interceptions_td_sum', 0) + weighted.get('fumbles_td_sum', 0))
                        ]
                    else:
                        categories = ['Passing', 'Rushing', 'Receiving']
                        values = [
                            weighted.get('passing_yds_sum', 0) / 100,  # Scale down for radar
                            weighted.get('rushing_yds_sum', 0) / 10,
                            weighted.get('receiving_yds_sum', 0) / 10
                        ]
                    
                    fig_radar = go.Figure(data=go.Scatterpolar(
                        r=values,
                        theta=categories,
                        fill='toself',
                        name='Player Profile'
                    ))
                    
                    fig_radar.update_layout(
                        polar=dict(
                            radialaxis=dict(
                                visible=True,
                                range=[0, max(values) * 1.2] if values else [0, 1]
                            )),
                        showlegend=False,
                        title=f"Player Profile ({player_type})",
                        template="plotly_dark",
                        height=400
                    )
                    st.plotly_chart(fig_radar, use_container_width=True)
    
    # Tab 2: Team Management
    with tabs[1]:
        st.header("Team Management")
        
        col1, col2 = st.columns([1, 2])
        
        with col1:
            st.subheader("Add Players to Your Team")
            
            # Filter available players (not in team and not drafted)
            drafted_player_names = list(st.session_state.drafted_players.keys()) if isinstance(st.session_state.drafted_players, dict) else st.session_state.drafted_players
            available_for_team = available_players[~available_players['name'].isin(st.session_state.my_team)]
            available_for_team = available_for_team[~available_for_team['name'].isin(drafted_player_names)]
            
            player_to_add = st.selectbox(
                "Select player to add",
                available_for_team['name'].unique(),
                key="add_player"
            )
            
            if st.button("Add to Team", use_container_width=True):
                if player_to_add and player_to_add not in st.session_state.my_team:
                    st.session_state.my_team.append(player_to_add)
                    st.success(f"Added {player_to_add} to your team!")
                    st.rerun()
        
        with col2:
            st.subheader("Your Current Team")
            
            if st.session_state.my_team:
                team_data = []
                for player in st.session_state.my_team:
                    player_info = available_players[available_players['name'] == player].iloc[0]
                    weighted = calculate_weighted_stats(df_historical, player, st.session_state.season_weights)
                    
                    team_data.append({
                        'Name': player,
                        'Team': player_info['team'],
                        'Position': detect_player_type(df_historical, player),
                        'Predicted Value': player_info['predicted_value'],
                        'Weighted Fantasy Points': weighted['fantasy_points_calc_sum'] if weighted else 0,
                        'Volatility': player_info['volatility']
                    })
                
                team_df = pd.DataFrame(team_data)
                
                # Team value visualization
                fig_team = px.bar(
                    team_df,
                    x='Name',
                    y=['Predicted Value', 'Weighted Fantasy Points'],
                    title="Team Composition",
                    barmode='group',
                    color_discrete_map={'Predicted Value': '#FF4B4B', 'Weighted Fantasy Points': '#4B7BFF'},
                    template="plotly_dark"
                )
                fig_team.update_layout(height=400)
                st.plotly_chart(fig_team, use_container_width=True)
                
                # Team metrics
                col_a, col_b, col_c = st.columns(3)
                with col_a:
                    st.metric("Total Team Value", f"{team_df['Predicted Value'].sum():.1f}")
                with col_b:
                    st.metric("Total Projected Points", f"{team_df['Weighted Fantasy Points'].sum():.1f}")
                with col_c:
                    st.metric("Avg Team Volatility", f"{team_df['Volatility'].mean():.2f}")
                
                # Remove player option
                player_to_remove = st.selectbox("Remove player from team", st.session_state.my_team)
                if st.button("Remove Player", use_container_width=True):
                    st.session_state.my_team.remove(player_to_remove)
                    # Add to free agents
                    st.session_state.free_agents.append(player_to_remove)
                    # Log market update
                    st.session_state.market_updates.append({
                        'action': 'drop',
                        'player': player_to_remove,
                        'team': 'Your Team',
                        'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M")
                    })
                    st.rerun()
            else:
                st.info("No players in your team yet. Add players from the left panel.")
    
    # Tab 3: Draft
    with tabs[2]:
        st.header("Draft Assistant")
        
        # Add team management
        col_team1, col_team2 = st.columns([1, 1])
        with col_team1:
            new_team = st.text_input("Add new team to competition")
            if st.button("Add Team", use_container_width=True):
                if new_team and new_team not in st.session_state.competition_teams:
                    st.session_state.competition_teams[new_team] = []
                    st.success(f"Added {new_team} to competition!")
                    st.rerun()
        
        with col_team2:
            if st.session_state.competition_teams:
                st.write("Current Teams:", ", ".join(st.session_state.competition_teams.keys()))
        
        st.divider()
        
        col1, col2 = st.columns([2, 1])
        
        with col1:
            st.subheader("Available Players")
            
            # Filter out drafted players
            drafted_player_names = list(st.session_state.drafted_players.keys()) if isinstance(st.session_state.drafted_players, dict) else st.session_state.drafted_players
            undrafted = available_players[~available_players['name'].isin(drafted_player_names)]
            undrafted = undrafted.sort_values('predicted_value', ascending=False)
            
            # Create visual representation
            if not undrafted.empty:
                fig_draft = px.scatter(
                    undrafted.head(30),
                    x='volatility',
                    y='predicted_value',
                    size='predicted_value',
                    color='predicted_value',
                    hover_data=['name', 'team'],
                    title="Top Available Players (Value vs Volatility)",
                    color_continuous_scale='Viridis',
                    template="plotly_dark"
                )
                fig_draft.update_layout(height=400)
                st.plotly_chart(fig_draft, use_container_width=True)
        
        with col2:
            st.subheader("Draft Controls")
            
            # Select player and team
            player_to_draft = st.selectbox(
                "Select player",
                undrafted['name'].unique() if not undrafted.empty else []
            )
            
            draft_team = st.selectbox(
                "Draft to team",
                ["Your Team"] + list(st.session_state.competition_teams.keys())
            )
            
            if st.button("Draft Player", use_container_width=True):
                if player_to_draft and draft_team:
                    st.session_state.drafted_players[player_to_draft] = draft_team
                    
                    if draft_team == "Your Team":
                        if player_to_draft not in st.session_state.my_team:
                            st.session_state.my_team.append(player_to_draft)
                    else:
                        st.session_state.competition_teams[draft_team].append(player_to_draft)
                    
                    st.success(f"{player_to_draft} drafted to {draft_team}!")
                    st.rerun()
            
            # Draft summary
            st.subheader("Draft Summary")
            st.metric("Total Players Drafted", len(st.session_state.drafted_players))
            
            # Show recent drafts
            if st.session_state.drafted_players:
                recent_drafts = list(st.session_state.drafted_players.items())[-5:]
                st.write("Recent Drafts:")
                for player, team in reversed(recent_drafts):
                    st.write(f"• {player} → {team}")
    
    # Tab 4: Trade Analyzer
    with tabs[3]:
        st.header("Trade Analyzer")
        
        col1, col2 = st.columns([1, 1])
        
        with col1:
            st.subheader("Players I'm Trading Away")
            
            trade_away = st.multiselect(
                "Select players to trade away",
                st.session_state.my_team,
                key="trade_away"
            )
            
            if trade_away:
                give_data = []
                for player in trade_away:
                    player_info = available_players[available_players['name'] == player].iloc[0]
                    weighted = calculate_weighted_stats(df_historical, player, st.session_state.season_weights)
                    
                    give_data.append({
                        'Name': player,
                        'Position': detect_player_type(df_historical, player),
                        'Predicted Value': player_info['predicted_value'],
                        'Weighted Fantasy Points': weighted['fantasy_points_calc_sum'] if weighted else 0,
                        'Volatility': player_info['volatility']
                    })
                
                give_df = pd.DataFrame(give_data)
                
                # Visualize trade away
                fig_give = px.bar(
                    give_df,
                    x='Name',
                    y='Predicted Value',
                    color='Volatility',
                    title="Trading Away",
                    color_continuous_scale='Reds',
                    template="plotly_dark"
                )
                fig_give.update_layout(height=300)
                st.plotly_chart(fig_give, use_container_width=True)
                
                total_give_value = give_df['Predicted Value'].sum()
                total_give_points = give_df['Weighted Fantasy Points'].sum()
                
                col_g1, col_g2 = st.columns(2)
                with col_g1:
                    st.metric("Total Value Trading Away", f"{total_give_value:.1f}")
                with col_g2:
                    st.metric("Total Points Trading Away", f"{total_give_points:.1f}")
        
        with col2:
            st.subheader("Players I'm Receiving")
            
            # Get all players not on my team
            available_to_receive = available_players[~available_players['name'].isin(st.session_state.my_team)]
            
            trade_receive = st.multiselect(
                "Select players to receive",
                available_to_receive['name'].unique(),
                key="trade_receive"
            )
            
            if trade_receive:
                receive_data = []
                for player in trade_receive:
                    player_info = available_players[available_players['name'] == player].iloc[0]
                    weighted = calculate_weighted_stats(df_historical, player, st.session_state.season_weights)
                    
                    receive_data.append({
                        'Name': player,
                        'Position': detect_player_type(df_historical, player),
                        'Predicted Value': player_info['predicted_value'],
                        'Weighted Fantasy Points': weighted['fantasy_points_calc_sum'] if weighted else 0,
                        'Volatility': player_info['volatility']
                    })
                
                receive_df = pd.DataFrame(receive_data)
                
                # Visualize receiving
                fig_receive = px.bar(
                    receive_df,
                    x='Name',
                    y='Predicted Value',
                    color='Volatility',
                    title="Receiving",
                    color_continuous_scale='Greens',
                    template="plotly_dark"
                )
                fig_receive.update_layout(height=300)
                st.plotly_chart(fig_receive, use_container_width=True)
                
                total_receive_value = receive_df['Predicted Value'].sum()
                total_receive_points = receive_df['Weighted Fantasy Points'].sum()
                
                col_r1, col_r2 = st.columns(2)
                with col_r1:
                    st.metric("Total Value Receiving", f"{total_receive_value:.1f}")
                with col_r2:
                    st.metric("Total Points Receiving", f"{total_receive_points:.1f}")
        
        # Trade Analysis
        if trade_away and trade_receive:
            st.subheader("Trade Analysis")
            
            value_diff = total_receive_value - total_give_value
            points_diff = total_receive_points - total_give_points
            
            # Create trade comparison visualization
            comparison_data = pd.DataFrame({
                'Metric': ['Value', 'Fantasy Points'],
                'Trading Away': [total_give_value, total_give_points],
                'Receiving': [total_receive_value, total_receive_points],
                'Difference': [value_diff, points_diff]
            })
            
            fig_comparison = go.Figure()
            fig_comparison.add_trace(go.Bar(
                name='Trading Away',
                x=comparison_data['Metric'],
                y=comparison_data['Trading Away'],
                marker_color='#FF4B4B'
            ))
            fig_comparison.add_trace(go.Bar(
                name='Receiving',
                x=comparison_data['Metric'],
                y=comparison_data['Receiving'],
                marker_color='#4BFF4B'
            ))
            
            fig_comparison.update_layout(
                title="Trade Comparison",
                barmode='group',
                template="plotly_dark",
                height=350
            )
            st.plotly_chart(fig_comparison, use_container_width=True)
            
            # Trade recommendation
            col_a, col_b = st.columns(2)
            
            with col_a:
                if value_diff > 0:
                    st.success(f"Value Gain: +{value_diff:.1f}")
                else:
                    st.error(f"Value Loss: {value_diff:.1f}")
            
            with col_b:
                if points_diff > 0:
                    st.success(f"Points Gain: +{points_diff:.1f}")
                else:
                    st.error(f"Points Loss: {points_diff:.1f}")
            
            # Overall recommendation
            trade_score = (value_diff / total_give_value * 50) + (points_diff / total_give_points * 50) if total_give_value > 0 and total_give_points > 0 else 0
            
            if trade_score > 10:
                st.success(f"✅ STRONG BUY - Trade Score: {trade_score:.0f}%")
            elif trade_score > 0:
                st.warning(f"⚠️ NEUTRAL - Trade Score: {trade_score:.0f}%")
            else:
                st.error(f"❌ REJECT - Trade Score: {trade_score:.0f}%")
    
    # Tab 5: Competition
    with tabs[4]:
        st.header("🏆 League Competition")
        
        if st.session_state.competition_teams:
            # Calculate team stats
            teams_data = []
            
            # Add your team
            if st.session_state.my_team:
                your_value = sum(available_players[available_players['name'].isin(st.session_state.my_team)]['predicted_value'])
                your_points = sum([calculate_weighted_stats(df_historical, p, st.session_state.season_weights)['fantasy_points_calc_sum'] 
                                 if calculate_weighted_stats(df_historical, p, st.session_state.season_weights) else 0 
                                 for p in st.session_state.my_team])
                
                teams_data.append({
                    'Team': 'Your Team',
                    'Players': len(st.session_state.my_team),
                    'Total Value': your_value,
                    'Projected Points': your_points,
                    'Avg Value per Player': your_value / len(st.session_state.my_team) if st.session_state.my_team else 0
                })
            
            # Add competition teams
            for team_name, players in st.session_state.competition_teams.items():
                if players:
                    team_value = sum(available_players[available_players['name'].isin(players)]['predicted_value'])
                    team_points = sum([calculate_weighted_stats(df_historical, p, st.session_state.season_weights)['fantasy_points_calc_sum'] 
                                     if calculate_weighted_stats(df_historical, p, st.session_state.season_weights) else 0 
                                     for p in players])
                    
                    teams_data.append({
                        'Team': team_name,
                        'Players': len(players),
                        'Total Value': team_value,
                        'Projected Points': team_points,
                        'Avg Value per Player': team_value / len(players) if players else 0
                    })
            
            if teams_data:
                teams_df = pd.DataFrame(teams_data).sort_values('Total Value', ascending=False)
                
                # League standings visualization
                fig_standings = px.bar(
                    teams_df,
                    x='Team',
                    y=['Total Value', 'Projected Points'],
                    title="League Standings",
                    barmode='group',
                    color_discrete_map={'Total Value': '#FF4B4B', 'Projected Points': '#4B7BFF'},
                    template="plotly_dark"
                )
                fig_standings.update_layout(height=400)
                st.plotly_chart(fig_standings, use_container_width=True)
                
                # Power rankings
                col1, col2 = st.columns([1, 1])
                
                with col1:
                    st.subheader("📊 Power Rankings")
                    teams_df['Power Score'] = teams_df['Total Value'] * 0.4 + teams_df['Projected Points'] * 0.6
                    power_rankings = teams_df.sort_values('Power Score', ascending=False)[['Team', 'Power Score']]
                    
                    for idx, row in power_rankings.iterrows():
                        rank = idx + 1
                        emoji = "🥇" if rank == 1 else "🥈" if rank == 2 else "🥉" if rank == 3 else f"{rank}."
                        st.write(f"{emoji} **{row['Team']}** - Score: {row['Power Score']:.1f}")
                
                with col2:
                    # Team comparison radar
                    st.subheader("📈 Team Comparison")
                    
                    selected_teams = st.multiselect(
                        "Select teams to compare",
                        teams_df['Team'].tolist(),
                        default=teams_df['Team'].tolist()[:3]
                    )
                    
                    if selected_teams:
                        fig_radar = go.Figure()
                        
                        for team in selected_teams:
                            team_data = teams_df[teams_df['Team'] == team].iloc[0]
                            
                            categories = ['Total Value', 'Projected Points', 'Avg Value/Player', 'Players']
                            values = [
                                team_data['Total Value'] / teams_df['Total Value'].max() * 100,
                                team_data['Projected Points'] / teams_df['Projected Points'].max() * 100,
                                team_data['Avg Value per Player'] / teams_df['Avg Value per Player'].max() * 100,
                                team_data['Players'] / teams_df['Players'].max() * 100
                            ]
                            
                            fig_radar.add_trace(go.Scatterpolar(
                                r=values,
                                theta=categories,
                                fill='toself',
                                name=team
                            ))
                        
                        fig_radar.update_layout(
                            polar=dict(
                                radialaxis=dict(
                                    visible=True,
                                    range=[0, 100]
                                )),
                            showlegend=True,
                            template="plotly_dark",
                            height=400
                        )
                        st.plotly_chart(fig_radar, use_container_width=True)
                
                # Team details expander
                st.subheader("Team Rosters")
                for team_name in teams_df['Team']:
                    with st.expander(f"{team_name} Roster"):
                        if team_name == 'Your Team':
                            roster = st.session_state.my_team
                        else:
                            roster = st.session_state.competition_teams.get(team_name, [])
                        
                        if roster:
                            roster_data = []
                            for player in roster:
                                player_info = available_players[available_players['name'] == player]
                                if not player_info.empty:
                                    roster_data.append({
                                        'Player': player,
                                        'Position': detect_player_type(df_historical, player),
                                        'Team': player_info.iloc[0]['team'],
                                        'Value': player_info.iloc[0]['predicted_value'],
                                        'Volatility': player_info.iloc[0]['volatility']
                                    })
                            
                            if roster_data:
                                roster_df = pd.DataFrame(roster_data)
                                st.dataframe(roster_df.style.format({
                                    'Value': '{:.1f}',
                                    'Volatility': '{:.2f}'
                                }))
        else:
            st.info("No competition teams added yet. Go to the Draft tab to add teams.")
    
    # Tab 6: Market
    with tabs[5]:
        st.header("📈 Market Opportunities & Trends")
        
        # Load weekly stats for trend analysis
        weekly_stats = calculate_weekly_stats(df_historical)
        
        # Free agents and dropped players
        all_free_agents = list(set(st.session_state.free_agents))
        
        # Add undrafted players to free agents
        drafted_player_names = list(st.session_state.drafted_players.keys()) if isinstance(st.session_state.drafted_players, dict) else st.session_state.drafted_players
        undrafted_names = available_players[~available_players['name'].isin(drafted_player_names)]['name'].tolist()
        undrafted_names = [p for p in undrafted_names if p not in st.session_state.my_team]
        
        all_available = list(set(all_free_agents + undrafted_names))
        
        if all_available:
            # Get player data for available players with trend analysis
            available_data = []
            for player in all_available:
                player_info = available_players[available_players['name'] == player]
                if not player_info.empty:
                    weighted = calculate_weighted_stats(df_historical, player, st.session_state.season_weights)
                    
                    # Calculate trend metrics
                    player_weekly = weekly_stats[weekly_stats['name'] == player].copy()
                    if not player_weekly.empty:
                        # Sort by date
                        player_weekly = player_weekly.sort_values('game_date')
                        
                        # Calculate recent form (last 5 weeks)
                        recent_games = player_weekly.tail(5)
                        older_games = player_weekly.iloc[:-5] if len(player_weekly) > 5 else player_weekly
                        
                        recent_avg = recent_games['fantasy_points_calc'].mean() if not recent_games.empty else 0
                        older_avg = older_games['fantasy_points_calc'].mean() if not older_games.empty else 0
                        
                        # Calculate trend direction
                        if len(player_weekly) >= 3:
                            x = np.arange(len(player_weekly))
                            y = player_weekly['fantasy_points_calc'].values
                            z = np.polyfit(x, y, 1)
                            trend_slope = z[0]
                        else:
                            trend_slope = 0
                        
                        # Calculate consistency (coefficient of variation)
                        consistency = 100 - (player_weekly['fantasy_points_calc'].std() / player_weekly['fantasy_points_calc'].mean() * 100) if player_weekly['fantasy_points_calc'].mean() > 0 else 0
                    else:
                        recent_avg = 0
                        older_avg = 0
                        trend_slope = 0
                        consistency = 0
                    
                    available_data.append({
                        'Name': player,
                        'Team': player_info.iloc[0]['team'],
                        'Position': detect_player_type(df_historical, player),
                        'Predicted Value': player_info.iloc[0]['predicted_value'],
                        'Projected Points': weighted['fantasy_points_calc_sum'] if weighted else 0,
                        'Recent Avg (5 games)': recent_avg,
                        'Season Avg': weighted['fantasy_points_calc_mean'] if weighted else 0,
                        'Trend': trend_slope,
                        'Consistency': consistency,
                        'Volatility': player_info.iloc[0]['volatility'],
                        'Status': 'Dropped' if player in all_free_agents else 'Undrafted',
                        'Form': 'Hot' if recent_avg > older_avg * 1.2 else 'Cold' if recent_avg < older_avg * 0.8 else 'Stable'
                    })
            
            available_df = pd.DataFrame(available_data)
            
            # Market visualization tabs
            market_tabs = st.tabs(["Overview", "Trends", "Deep Analysis"])
            
            with market_tabs[0]:
                col1, col2 = st.columns([2, 1])
                
                with col1:
                    # Enhanced scatter plot with form indicators
                    fig_market = px.scatter(
                        available_df.head(50),
                        x='Volatility',
                        y='Predicted Value',
                        size='Recent Avg (5 games)',
                        color='Form',
                        hover_data=['Name', 'Team', 'Trend', 'Consistency'],
                        title="Market Opportunities - Top 50 (Size = Recent Performance)",
                        color_discrete_map={'Hot': '#FF4B4B', 'Stable': '#4B7BFF', 'Cold': '#808080'},
                        template="plotly_dark"
                    )
                    fig_market.update_layout(height=500)
                    st.plotly_chart(fig_market, use_container_width=True)
                
                with col2:
                    st.subheader("🎯 Smart Filters")
                    
                    # Position filter
                    positions = available_df['Position'].unique()
                    position_filter = st.selectbox("Position", ['All'] + list(positions))
                    
                    # Advanced filters
                    form_filter = st.selectbox("Player Form", ['All', 'Hot', 'Stable', 'Cold'])
                    min_consistency = st.slider("Min Consistency %", 0, 100, 50)
                    trend_direction = st.select_slider(
                        "Trend Direction",
                        options=['Declining', 'Stable', 'Rising'],
                        value='Stable'
                    )
                    
                    # Apply filters
                    filtered_df = available_df.copy()
                    
                    if position_filter != 'All':
                        filtered_df = filtered_df[filtered_df['Position'] == position_filter]
                    
                    if form_filter != 'All':
                        filtered_df = filtered_df[filtered_df['Form'] == form_filter]
                    
                    filtered_df = filtered_df[filtered_df['Consistency'] >= min_consistency]
                    
                    if trend_direction == 'Rising':
                        filtered_df = filtered_df[filtered_df['Trend'] > 0.5]
                    elif trend_direction == 'Declining':
                        filtered_df = filtered_df[filtered_df['Trend'] < -0.5]
                    else:
                        filtered_df = filtered_df[abs(filtered_df['Trend']) <= 0.5]
                    
                    # Show top opportunities
                    st.write("**Top Opportunities:**")
                    top_players = filtered_df.nlargest(10, 'Recent Avg (5 games)')
                    for idx, player in top_players.iterrows():
                        trend_emoji = "📈" if player['Trend'] > 0.5 else "📉" if player['Trend'] < -0.5 else "➡️"
                        form_emoji = "🔥" if player['Form'] == 'Hot' else "❄️" if player['Form'] == 'Cold' else "⚖️"
                        st.write(f"{form_emoji}{trend_emoji} **{player['Name']}** ({player['Position']}) - {player['Recent Avg (5 games)']:.1f} pts/game")
                        min_consistency = st.slider("Min Consistency %", 0, 100, 50)
                    trend_direction = st.select_slider(
                        "Trend Direction",
                        options=['Declining', 'Stable', 'Rising'],
                        value='Stable'
                    )
                    
                    # Apply filters
                    filtered_df = available_df.copy()
                    if form_filter != 'All':
                        filtered_df = filtered_df[filtered_df['Form'] == form_filter]
                    
                    filtered_df = filtered_df[filtered_df['Consistency'] >= min_consistency]
                    
                    if trend_direction == 'Rising':
                        filtered_df = filtered_df[filtered_df['Trend'] > 0.5]
                    elif trend_direction == 'Declining':
                        filtered_df = filtered_df[filtered_df['Trend'] < -0.5]
                    else:
                        filtered_df = filtered_df[abs(filtered_df['Trend']) <= 0.5]
                    
                    # Show top opportunities
                    st.write("**Top Opportunities:**")
                    top_players = filtered_df.nlargest(10, 'Recent Avg (5 games)')
                    for idx, player in top_players.iterrows():
                        trend_emoji = "📈" if player['Trend'] > 0.5 else "📉" if player['Trend'] < -0.5 else "➡️"
                        form_emoji = "🔥" if player['Form'] == 'Hot' else "❄️" if player['Form'] == 'Cold' else "⚖️"
                        st.write(f"{form_emoji}{trend_emoji} **{player['Name']}** - {player['Recent Avg (5 games)']:.1f} pts/game")
            
            with market_tabs[1]:
                st.subheader("Player Trends Analysis")
                
                # Select players to compare trends
                trend_players = st.multiselect(
                    "Select players to analyze trends",
                    available_df.nlargest(20, 'Predicted Value')['Name'].tolist(),
                    default=available_df.nlargest(5, 'Recent Avg (5 games)')['Name'].tolist()[:3]
                )
                
                if trend_players:
                    # Create trend chart
                    fig_trends = go.Figure()
                    
                    for player in trend_players:
                        player_weekly_data = weekly_stats[weekly_stats['name'] == player].sort_values('game_date')
                        if not player_weekly_data.empty:
                            # Calculate moving average
                            player_weekly_data['MA3'] = player_weekly_data['fantasy_points_calc'].rolling(window=3, center=True).mean()
                            
                            fig_trends.add_trace(go.Scatter(
                                x=player_weekly_data['game_date'],
                                y=player_weekly_data['MA3'],
                                mode='lines+markers',
                                name=player,
                                line=dict(width=3)
                            ))
                    
                    fig_trends.update_layout(
                        title="Player Performance Trends (3-Game Moving Average)",
                        xaxis_title="Date",
                        yaxis_title="Fantasy Points",
                        template="plotly_dark",
                        height=400,
                        hovermode='x unified'
                    )
                    st.plotly_chart(fig_trends, use_container_width=True)
                
                # Trend leaders
                col1, col2 = st.columns(2)
                
                with col1:
                    st.subheader("📈 Rising Stars")
                    rising = available_df.nlargest(10, 'Trend')[['Name', 'Trend', 'Recent Avg (5 games)', 'Form']]
                    st.dataframe(rising.style.format({
                        'Trend': '{:.2f}',
                        'Recent Avg (5 games)': '{:.1f}'
                    }))
                
                with col2:
                    st.subheader("📉 Declining Players")
                    declining = available_df.nsmallest(10, 'Trend')[['Name', 'Trend', 'Recent Avg (5 games)', 'Form']]
                    st.dataframe(declining.style.format({
                        'Trend': '{:.2f}',
                        'Recent Avg (5 games)': '{:.1f}'
                    }))
            
            with market_tabs[2]:
                st.subheader("Deep Market Analysis")
                
                # Opportunity score calculation
                available_df['Opportunity Score'] = (
                    available_df['Recent Avg (5 games)'] * 0.4 +
                    available_df['Predicted Value'] * 0.3 +
                    available_df['Consistency'] * 0.2 +
                    (available_df['Trend'] + 10) * 5  # Normalize trend
                )
                
                # Best overall opportunities
                col1, col2 = st.columns([1, 1])
                
                with col1:
                    # Radar chart for top opportunities
                    top_opportunities = available_df.nlargest(5, 'Opportunity Score')
                    
                    fig_radar = go.Figure()
                    
                    for idx, player in top_opportunities.iterrows():
                        values = [
                            player['Recent Avg (5 games)'] / available_df['Recent Avg (5 games)'].max() * 100,
                            player['Predicted Value'] / available_df['Predicted Value'].max() * 100,
                            player['Consistency'],
                            (player['Trend'] + 5) * 10,  # Normalize to 0-100
                            100 - player['Volatility']  # Invert volatility
                        ]
                        
                        fig_radar.add_trace(go.Scatterpolar(
                            r=values,
                            theta=['Recent Form', 'Value', 'Consistency', 'Trend', 'Stability'],
                            fill='toself',
                            name=player['Name']
                        ))
                    
                    fig_radar.update_layout(
                        polar=dict(radialaxis=dict(visible=True, range=[0, 100])),
                        showlegend=True,
                        title="Top 5 Opportunities - Multi-Factor Analysis",
                        template="plotly_dark",
                        height=400
                    )
                    st.plotly_chart(fig_radar, use_container_width=True)
                
                with col2:
                    # Heatmap of correlations
                    metrics_df = available_df[['Predicted Value', 'Recent Avg (5 games)', 'Consistency', 'Trend', 'Volatility']]
                    correlation = metrics_df.corr()
                    
                    fig_heatmap = px.imshow(
                        correlation,
                        labels=dict(color="Correlation"),
                        x=correlation.columns,
                        y=correlation.columns,
                        title="Metric Correlations",
                        color_continuous_scale='RdBu',
                        template="plotly_dark"
                    )
                    fig_heatmap.update_layout(height=400)
                    st.plotly_chart(fig_heatmap, use_container_width=True)
                
                # Detailed opportunity table
                st.subheader("Complete Market Analysis")
                
                display_cols = ['Name', 'Position', 'Team', 'Opportunity Score', 'Recent Avg (5 games)', 
                               'Trend', 'Consistency', 'Form', 'Status']
                
                st.dataframe(
                    available_df[display_cols].sort_values('Opportunity Score', ascending=False).head(20).style.format({
                        'Opportunity Score': '{:.1f}',
                        'Recent Avg (5 games)': '{:.1f}',
                        'Trend': '{:.2f}',
                        'Consistency': '{:.0f}%'
                    }).background_gradient(subset=['Opportunity Score', 'Recent Avg (5 games)'], cmap='Greens')
                )
        else:
            st.info("No players available in the market currently.")
    
    # Tab 7: Market Updates
    with tabs[6]:
        st.header("📝 Market Updates")
        
        col1, col2 = st.columns([2, 1])
        
        with col1:
            st.subheader("Transaction Log")
            
            if st.session_state.market_updates:
                # Create DataFrame from updates
                updates_df = pd.DataFrame(st.session_state.market_updates)
                updates_df = updates_df.sort_values('timestamp', ascending=False)
                
                # Display updates with styling
                for idx, update in updates_df.iterrows():
                    if update['action'] == 'drop':
                        st.error(f"🔻 **{update['team']}** dropped **{update['player']}** - {update['timestamp']}")
                    else:
                        st.success(f"🔺 **{update['team']}** added **{update['player']}** - {update['timestamp']}")
            else:
                st.info("No market updates yet.")
        
        with col2:
            st.subheader("Manual Update")
            
            # Manual transaction entry
            action = st.selectbox("Action", ['Add', 'Drop'])
            
            team_options = ['Your Team'] + list(st.session_state.competition_teams.keys())
            team = st.selectbox("Team", team_options)
            
            if action == 'Add':
                # Show available players
                drafted_player_names = list(st.session_state.drafted_players.keys()) if isinstance(st.session_state.drafted_players, dict) else st.session_state.drafted_players
                available_for_add = available_players[~available_players['name'].isin(drafted_player_names)]
                player = st.selectbox("Player", available_for_add['name'].unique())
            else:
                # Show team's players
                if team == 'Your Team':
                    team_players = st.session_state.my_team
                else:
                    team_players = st.session_state.competition_teams.get(team, [])
                
                player = st.selectbox("Player", team_players if team_players else ['No players'])
            
            if st.button("Submit Update", use_container_width=True):
                if player and player != 'No players':
                    # Process the update
                    st.session_state.market_updates.append({
                        'action': action.lower(),
                        'player': player,
                        'team': team,
                        'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M")
                    })
                    
                    # Update team rosters
                    if action == 'Add':
                        st.session_state.drafted_players[player] = team
                        if team == 'Your Team':
                            st.session_state.my_team.append(player)
                        else:
                            st.session_state.competition_teams[team].append(player)
                        
                        # Remove from free agents if present
                        if player in st.session_state.free_agents:
                            st.session_state.free_agents.remove(player)
                    
                    elif action == 'Drop':
                        # Remove from team
                        if team == 'Your Team' and player in st.session_state.my_team:
                            st.session_state.my_team.remove(player)
                        elif team in st.session_state.competition_teams and player in st.session_state.competition_teams[team]:
                            st.session_state.competition_teams[team].remove(player)
                        
                        # Remove from drafted players and add to free agents
                        if player in st.session_state.drafted_players:
                            del st.session_state.drafted_players[player]
                        st.session_state.free_agents.append(player)
                    
                    st.success(f"Update recorded: {team} {action.lower()}ed {player}")
                    st.rerun()
        
        # Market trends
        if st.session_state.market_updates:
            st.subheader("Market Trends")
            
            # Most active teams
            team_activity = {}
            for update in st.session_state.market_updates:
                team = update['team']
                team_activity[team] = team_activity.get(team, 0) + 1
            
            if team_activity:
                activity_df = pd.DataFrame(list(team_activity.items()), columns=['Team', 'Transactions'])
                activity_df = activity_df.sort_values('Transactions', ascending=False)
                
                fig_activity = px.bar(
                    activity_df,
                    x='Team',
                    y='Transactions',
                    title="Most Active Teams",
                    color='Transactions',
                    color_continuous_scale='Blues',
                    template="plotly_dark"
                )
                fig_activity.update_layout(height=350)
                st.plotly_chart(fig_activity, use_container_width=True)

if __name__ == "__main__":
    main()