import { createBrowserRouter } from 'react-router-dom'
import AppShell from './components/layout/AppShell.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Clients from './pages/Clients.jsx'
import ContentFactory from './pages/ContentFactory.jsx'
import Approvals from './pages/Approvals.jsx'
import Schedule from './pages/Schedule.jsx'
import Campaigns from './pages/Campaigns.jsx'
import PhotoStudio from './pages/PhotoStudio.jsx'
import VideoStudio from './pages/VideoStudio.jsx'
import Reports from './pages/Reports.jsx'
import Settings from './pages/Settings.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true,         element: <Dashboard /> },
      { path: 'clients',     element: <Clients /> },
      { path: 'factory',     element: <ContentFactory /> },
      { path: 'approvals',   element: <Approvals /> },
      { path: 'schedule',    element: <Schedule /> },
      { path: 'campaigns',   element: <Campaigns /> },
      { path: 'photo',       element: <PhotoStudio /> },
      { path: 'video',       element: <VideoStudio /> },
      { path: 'reports',     element: <Reports /> },
      { path: 'settings',    element: <Settings /> },
    ],
  },
])
