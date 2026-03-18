import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { ToastProvider } from '@/components/ui/Toast'

const OverviewScreen = lazy(() => import('@/components/screens/OverviewScreen'))
const LeadsScreen = lazy(() => import('@/components/screens/LeadsScreen'))
const BookingsScreen = lazy(() => import('@/components/screens/BookingsScreen'))
const ProjectsScreen = lazy(() => import('@/components/screens/ProjectsScreen'))
const AgentsScreen = lazy(() => import('@/components/screens/AgentsScreen'))
const ApprovalsScreen = lazy(() => import('@/components/screens/ApprovalsScreen'))
const AnalyticsScreen = lazy(() => import('@/components/screens/AnalyticsScreen'))
const SettingsScreen = lazy(() => import('@/components/screens/SettingsScreen'))

function ScreenLoader() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Suspense fallback={<ScreenLoader />}>
          <Routes>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<OverviewScreen />} />
              <Route path="/leads" element={<LeadsScreen />} />
              <Route path="/bookings" element={<BookingsScreen />} />
              <Route path="/projects" element={<ProjectsScreen />} />
              <Route path="/agents" element={<AgentsScreen />} />
              <Route path="/approvals" element={<ApprovalsScreen />} />
              <Route path="/analytics" element={<AnalyticsScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ToastProvider>
  )
}
