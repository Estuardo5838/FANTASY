import React, { useState, useMemo } from 'react'
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react'
import { Input, Select } from '../ui/Input'
import { Button } from '../ui/Button'
import { debounce } from '../../lib/utils'
import type { Player } from '../../types'

interface PlayerSearchProps {
  players: Player[]
  onFilteredPlayersChange: (players: Player[]) => void
}

export function PlayerSearch({ players, onFilteredPlayersChange }: PlayerSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPosition, setSelectedPosition] = useState('')
  const [selectedTeam, setSelectedTeam] = useState('')
  const [sortBy, setSortBy] = useState('total_fantasy_points')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showFilters, setShowFilters] = useState(false)

  const positions = useMemo(() => {
    const uniquePositions = [...new Set(players.map(p => p.position))].sort()
    return uniquePositions
  }, [players])

  const teams = useMemo(() => {
    const uniqueTeams = [...new Set(players.map(p => p.team))].sort()
    return uniqueTeams
  }, [players])

  const sortOptions = [
    { value: 'total_fantasy_points', label: 'Total Fantasy Points' },
    { value: 'avg_fantasy_points', label: 'Average Points' },
    { value: 'predicted_value', label: 'Predicted Value' },
    { value: 'volatility', label: 'Volatility' },
    { value: 'name', label: 'Name' },
    { value: 'position', label: 'Position' },
    { value: 'team', label: 'Team' },
  ]

  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      filterAndSortPlayers(query, selectedPosition, selectedTeam, sortBy, sortOrder)
    }, 300),
    [selectedPosition, selectedTeam, sortBy, sortOrder, players]
  )

  const filterAndSortPlayers = (
    query: string,
    position: string,
    team: string,
    sort: string,
    order: 'asc' | 'desc'
  ) => {
    let filtered = [...players]

    // Apply search query
    if (query.trim()) {
      const lowercaseQuery = query.toLowerCase()
      filtered = filtered.filter(player =>
        player.name.toLowerCase().includes(lowercaseQuery) ||
        player.team.toLowerCase().includes(lowercaseQuery) ||
        player.position.toLowerCase().includes(lowercaseQuery)
      )
    }

    // Apply position filter
    if (position) {
      filtered = filtered.filter(player => player.position === position)
    }

    // Apply team filter
    if (team) {
      filtered = filtered.filter(player => player.team === team)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sort as keyof Player]
      let bValue = b[sort as keyof Player]

      // Handle string comparisons
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      // Handle numeric comparisons
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue
      }

      // Handle string comparisons
      if (aValue < bValue) return order === 'asc' ? -1 : 1
      if (aValue > bValue) return order === 'asc' ? 1 : -1
      return 0
    })

    onFilteredPlayersChange(filtered)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedSearch(query)
  }

  const handleFilterChange = (
    position?: string,
    team?: string,
    sort?: string,
    order?: 'asc' | 'desc'
  ) => {
    const newPosition = position !== undefined ? position : selectedPosition
    const newTeam = team !== undefined ? team : selectedTeam
    const newSort = sort !== undefined ? sort : sortBy
    const newOrder = order !== undefined ? order : sortOrder

    if (position !== undefined) setSelectedPosition(position)
    if (team !== undefined) setSelectedTeam(team)
    if (sort !== undefined) setSortBy(sort)
    if (order !== undefined) setSortOrder(order)

    filterAndSortPlayers(searchQuery, newPosition, newTeam, newSort, newOrder)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedPosition('')
    setSelectedTeam('')
    setSortBy('total_fantasy_points')
    setSortOrder('desc')
    onFilteredPlayersChange(players)
  }

  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc'
    handleFilterChange(undefined, undefined, undefined, newOrder)
  }

  // Initialize with all players
  React.useEffect(() => {
    filterAndSortPlayers(searchQuery, selectedPosition, selectedTeam, sortBy, sortOrder)
  }, [players])

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search players, teams, or positions..."
            value={searchQuery}
            onChange={handleSearchChange}
            icon={<Search className="w-5 h-5" />}
          />
        </div>
        <Button
          variant="secondary"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="glass-effect rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              label="Position"
              value={selectedPosition}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="">All Positions</option>
              {positions.map(position => (
                <option key={position} value={position}>{position}</option>
              ))}
            </Select>

            <Select
              label="Team"
              value={selectedTeam}
              onChange={(e) => handleFilterChange(undefined, e.target.value)}
            >
              <option value="">All Teams</option>
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </Select>

            <Select
              label="Sort By"
              value={sortBy}
              onChange={(e) => handleFilterChange(undefined, undefined, e.target.value)}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            <div className="flex items-end">
              <Button
                variant="secondary"
                onClick={toggleSortOrder}
                className="flex items-center space-x-2 w-full"
              >
                {sortOrder === 'asc' ? (
                  <SortAsc className="w-4 h-4" />
                ) : (
                  <SortDesc className="w-4 h-4" />
                )}
                <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-gray-700">
            <span className="text-sm text-gray-400">
              Showing {players.length} players
            </span>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}