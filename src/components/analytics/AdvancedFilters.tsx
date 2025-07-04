import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Filter, 
  X, 
  ChevronDown, 
  Search,
  Calendar,
  Users,
  TrendingUp,
  Target,
  BarChart3,
  Sliders
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Input, Select } from '../ui/Input'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import type { Player } from '../../types'

interface AdvancedFiltersProps {
  players: Player[]
  onFilterChange: (filteredPlayers: Player[]) => void
  onFiltersUpdate: (filters: FilterState) => void
}

interface FilterState {
  search: string
  positions: string[]
  teams: string[]
  seasons: string[]
  pointsRange: [number, number]
  volatilityRange: [number, number]
  gamesRange: [number, number]
  sortBy: string
  sortOrder: 'asc' | 'desc'
  showInjured: boolean
}

export function AdvancedFilters({ players, onFilterChange, onFiltersUpdate }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    positions: [],
    teams: [],
    seasons: [],
    pointsRange: [0, 500],
    volatilityRange: [0, 1],
    gamesRange: [0, 17],
    sortBy: 'total_fantasy_points',
    sortOrder: 'desc',
    showInjured: true
  })

  // Get unique values for filter options
  const positions = [...new Set(players.map(p => p.position))].sort()
  const teams = [...new Set(players.map(p => p.team))].sort()
  const seasons = [...new Set(players.map(p => p.season || 2024))].sort((a, b) => b - a)
  
  const maxPoints = Math.max(...players.map(p => p.total_fantasy_points))
  const maxVolatility = Math.max(...players.map(p => p.volatility))

  const applyFilters = (newFilters: FilterState) => {
    let filtered = [...players]

    // Search filter
    if (newFilters.search.trim()) {
      const searchTerm = newFilters.search.toLowerCase()
      filtered = filtered.filter(player =>
        player.name.toLowerCase().includes(searchTerm) ||
        player.team.toLowerCase().includes(searchTerm) ||
        player.position.toLowerCase().includes(searchTerm)
      )
    }

    // Position filter
    if (newFilters.positions.length > 0) {
      filtered = filtered.filter(player => newFilters.positions.includes(player.position))
    }

    // Team filter
    if (newFilters.teams.length > 0) {
      filtered = filtered.filter(player => newFilters.teams.includes(player.team))
    }

    // Season filter
    if (newFilters.seasons.length > 0) {
      filtered = filtered.filter(player => newFilters.seasons.includes((player.season || 2024).toString()))
    }

    // Points range filter
    filtered = filtered.filter(player => 
      player.total_fantasy_points >= newFilters.pointsRange[0] &&
      player.total_fantasy_points <= newFilters.pointsRange[1]
    )

    // Volatility range filter
    filtered = filtered.filter(player => 
      player.volatility >= newFilters.volatilityRange[0] &&
      player.volatility <= newFilters.volatilityRange[1]
    )

    // Games range filter
    filtered = filtered.filter(player => 
      player.games_played >= newFilters.gamesRange[0] &&
      player.games_played <= newFilters.gamesRange[1]
    )

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[newFilters.sortBy as keyof Player] as number
      let bValue = b[newFilters.sortBy as keyof Player] as number

      if (typeof aValue === 'string') aValue = aValue.toLowerCase() as any
      if (typeof bValue === 'string') bValue = bValue.toLowerCase() as any

      if (newFilters.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    onFilterChange(filtered)
    onFiltersUpdate(newFilters)
  }

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    applyFilters(newFilters)
  }

  const toggleArrayFilter = (key: 'positions' | 'teams' | 'seasons', value: string) => {
    const currentArray = filters[key]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    
    updateFilter(key, newArray)
  }

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      search: '',
      positions: [],
      teams: [],
      seasons: [],
      pointsRange: [0, maxPoints],
      volatilityRange: [0, maxVolatility],
      gamesRange: [0, 17],
      sortBy: 'total_fantasy_points',
      sortOrder: 'desc',
      showInjured: true
    }
    setFilters(defaultFilters)
    applyFilters(defaultFilters)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.search.trim()) count++
    if (filters.positions.length > 0) count++
    if (filters.teams.length > 0) count++
    if (filters.seasons.length > 0) count++
    if (filters.pointsRange[0] > 0 || filters.pointsRange[1] < maxPoints) count++
    if (filters.volatilityRange[0] > 0 || filters.volatilityRange[1] < maxVolatility) count++
    if (filters.gamesRange[0] > 0 || filters.gamesRange[1] < 17) count++
    return count
  }

  const activeFilterCount = getActiveFilterCount()

  return (
    <div className="space-y-4">
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2"
        >
          <Filter className="w-4 h-4" />
          <span>Advanced Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="primary" size="sm">{activeFilterCount}</Badge>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        )}
      </div>

      {/* Quick Search */}
      <Input
        placeholder="Search players, teams, or positions..."
        value={filters.search}
        onChange={(e) => updateFilter('search', e.target.value)}
        icon={<Search className="w-5 h-5" />}
      />

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 space-y-6">
              {/* Position & Team Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    <Users className="w-4 h-4 inline mr-2" />
                    Positions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {positions.map(position => (
                      <button
                        key={position}
                        onClick={() => toggleArrayFilter('positions', position)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          filters.positions.includes(position)
                            ? 'bg-primary-600 text-white'
                            : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                        }`}
                      >
                        {position}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    <Target className="w-4 h-4 inline mr-2" />
                    Teams
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {teams.map(team => (
                      <button
                        key={team}
                        onClick={() => toggleArrayFilter('teams', team)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          filters.teams.includes(team)
                            ? 'bg-success-600 text-white'
                            : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                        }`}
                      >
                        {team}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Season Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Seasons
                </label>
                <div className="flex flex-wrap gap-2">
                  {seasons.map(season => (
                    <button
                      key={season}
                      onClick={() => toggleArrayFilter('seasons', season.toString())}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        filters.seasons.includes(season.toString())
                          ? 'bg-warning-600 text-white'
                          : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                      }`}
                    >
                      {season}
                    </button>
                  ))}
                </div>
              </div>

              {/* Range Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    <TrendingUp className="w-4 h-4 inline mr-2" />
                    Fantasy Points Range
                  </label>
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.pointsRange[0]}
                        onChange={(e) => updateFilter('pointsRange', [parseInt(e.target.value) || 0, filters.pointsRange[1]])}
                        className="w-full"
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.pointsRange[1]}
                        onChange={(e) => updateFilter('pointsRange', [filters.pointsRange[0], parseInt(e.target.value) || maxPoints])}
                        className="w-full"
                      />
                    </div>
                    <div className="text-xs text-gray-400">
                      Range: 0 - {maxPoints.toFixed(0)}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    <BarChart3 className="w-4 h-4 inline mr-2" />
                    Volatility Range
                  </label>
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Min"
                        value={filters.volatilityRange[0]}
                        onChange={(e) => updateFilter('volatilityRange', [parseFloat(e.target.value) || 0, filters.volatilityRange[1]])}
                        className="w-full"
                      />
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Max"
                        value={filters.volatilityRange[1]}
                        onChange={(e) => updateFilter('volatilityRange', [filters.volatilityRange[0], parseFloat(e.target.value) || maxVolatility])}
                        className="w-full"
                      />
                    </div>
                    <div className="text-xs text-gray-400">
                      Range: 0.00 - {maxVolatility.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    <Sliders className="w-4 h-4 inline mr-2" />
                    Games Played Range
                  </label>
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.gamesRange[0]}
                        onChange={(e) => updateFilter('gamesRange', [parseInt(e.target.value) || 0, filters.gamesRange[1]])}
                        className="w-full"
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.gamesRange[1]}
                        onChange={(e) => updateFilter('gamesRange', [filters.gamesRange[0], parseInt(e.target.value) || 17])}
                        className="w-full"
                      />
                    </div>
                    <div className="text-xs text-gray-400">
                      Range: 0 - 17
                    </div>
                  </div>
                </div>
              </div>

              {/* Sort Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Sort By"
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                >
                  <option value="total_fantasy_points">Total Fantasy Points</option>
                  <option value="avg_fantasy_points">Average Points</option>
                  <option value="predicted_value">Predicted Value</option>
                  <option value="volatility">Volatility</option>
                  <option value="games_played">Games Played</option>
                  <option value="name">Name</option>
                  <option value="position">Position</option>
                  <option value="team">Team</option>
                </Select>

                <Select
                  label="Sort Order"
                  value={filters.sortOrder}
                  onChange={(e) => updateFilter('sortOrder', e.target.value as 'asc' | 'desc')}
                >
                  <option value="desc">Descending (High to Low)</option>
                  <option value="asc">Ascending (Low to High)</option>
                </Select>
              </div>

              {/* Active Filters Summary */}
              {activeFilterCount > 0 && (
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
                    </span>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="w-4 h-4 mr-1" />
                      Clear All
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}