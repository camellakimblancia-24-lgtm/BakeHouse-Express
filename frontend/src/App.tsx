import type { ReactNode } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './LandingPage'
import PantryPage from './pages/pantry/PantryPage'
import RecipeBatchingPage from './pages/recipes/RecipeBatchingPage'
import CounterPage from './pages/counter/CounterPage'
import OperationsLogsPage from './pages/logs/OperationsLogsPage'
import Header from './components/layout/Header'

function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-orange-50 to-rose-100">
      <Header />
      <main className="px-8 pb-10">{children}</main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pantry" element={<AppLayout><PantryPage /></AppLayout>} />
        <Route path="/recipes" element={<AppLayout><RecipeBatchingPage /></AppLayout>} />
        <Route path="/counter" element={<AppLayout><CounterPage /></AppLayout>} />
        <Route path="/logs" element={<AppLayout><OperationsLogsPage /></AppLayout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App