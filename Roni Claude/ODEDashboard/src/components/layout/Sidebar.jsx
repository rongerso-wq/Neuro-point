import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, Sparkles, CheckCircle2, CalendarDays,
  Target, Camera, Video, BarChart3, Settings,
} from 'lucide-react'
import { t } from '../../lib/i18n.js'

const NAV = [
  { to: '/',            icon: LayoutDashboard, label: t('nav.dashboard') },
  { to: '/clients',     icon: Users,           label: t('nav.clients') },
  { to: '/factory',     icon: Sparkles,        label: t('nav.contentFactory') },
  { to: '/approvals',   icon: CheckCircle2,    label: t('nav.approvals') },
  { to: '/schedule',    icon: CalendarDays,    label: t('nav.schedule') },
  { to: '/campaigns',   icon: Target,          label: t('nav.campaigns') },
  { to: '/photo',       icon: Camera,          label: t('nav.photoStudio') },
  { to: '/video',       icon: Video,           label: t('nav.videoStudio') },
  { to: '/reports',     icon: BarChart3,       label: t('nav.reports') },
  { to: '/settings',    icon: Settings,        label: t('nav.settings') },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__mark">OD</div>
        <div className="sidebar__brand-text">
          <span className="sidebar__brand-name">{t('app.name')}</span>
          <span className="sidebar__brand-tag">{t('app.tagline')}</span>
        </div>
      </div>

      <nav className="sidebar__nav">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              'sidebar__link' + (isActive ? ' sidebar__link--active' : '')
            }
          >
            <Icon size={18} strokeWidth={1.6} className="sidebar__icon" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__avatar">ע</div>
          <div className="sidebar__user-meta">
            <span className="sidebar__user-name">עודד רגב</span>
            <span className="sidebar__user-role">מנהל סוכנות</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
