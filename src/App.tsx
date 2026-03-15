import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import OverviewScreen from '@/components/screens/OverviewScreen'
import LeadsScreen from '@/components/screens/LeadsScreen'
import BookingsScreen from '@/components/screens/BookingsScreen'
import ProjectsScreen from '@/components/screens/ProjectsScreen'
import AgentsScreen from '@/components/screens/AgentsScreen'
import ApprovalsScreen from '@/components/screens/ApprovalsScreen'
import AnalyticsScreen from '@/components/screens/AnalyticsScreen'
import SettingsScreen from '@/components/screens/SettingsScreen'

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}
