import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import LandingPage from './LandingPage'
import PantryPage from './pages/pantry/PantryPage'
import RecipeBatchingPage from './pages/recipes/RecipeBatchingPage'
import CounterPage from './pages/counter/CounterPage'
import OperationsLogsPage from './pages/logs/OperationsLogsPage'
import RoleProvider from './context/RoleProvider'
import Header from './components/layout/Header'

import { DEFAULT_ROUTE, useRole } from './types/roles'

function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-orange-50 to-rose-100">
      <Header />
      <main className="px-8 pb-10">{children}</main>
    </div>
  )
}

function Guarded({ path, children }: { path: string; children: ReactNode }) {
  const { user, canAccess } = useRole()
  if (!canAccess(path)) return <Navigate to={DEFAULT_ROUTE[user.role]} replace />
  return <AppLayout>{children}</AppLayout>
}

function App() {
  return (
    <BrowserRouter>
      <RoleProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pantry" element={<Guarded path="/pantry"><PantryPage /></Guarded>} />
          <Route path="/recipes" element={<Guarded path="/recipes"><RecipeBatchingPage /></Guarded>} />
          <Route path="/counter" element={<Guarded path="/counter"><CounterPage /></Guarded>} />
          <Route path="/logs" element={<Guarded path="/logs"><OperationsLogsPage /></Guarded>} />
        </Routes>
      </RoleProvider>
    </BrowserRouter>
  )
}

export default App