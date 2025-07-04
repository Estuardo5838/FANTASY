import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useCodeAccess } from './hooks/useCodeAccess'
import { Layout } from './components/layout/Layout'
import { LoadingSpinner } from './components/ui/LoadingSpinner'
import { CodeAccess } from './components/auth/CodeAccess'

// Pages
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Dashboard } from './pages/Dashboard'
import { Players } from './pages/Players'
import { Analytics } from './pages/Analytics'
import { TradeCenter } from './pages/TradeCenter'
import { DraftAssistant } from './pages/DraftAssistant'
import { TeamManagement } from './pages/TeamManagement'

function App() {
  const { hasAccess, loading } = useCodeAccess()

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Show code access screen if user doesn't have access
  if (!hasAccess) {
    return <CodeAccess />
  }

  return (
    <Router>
      <Routes>
        {/* All routes are now accessible with valid code */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/players" element={<Players />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/trades" element={<TradeCenter />} />
              <Route path="/draft" element={<DraftAssistant />} />
              <Route path="/team" element={<TeamManagement />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  )
}

export default App