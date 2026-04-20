import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader.jsx'
import { useAppState } from '../context/ClientContext.jsx'
import './pages.css'

const TYPE_LABEL = { feed: 'פוסט', reel: 'ריל', story: 'סטורי', carousel: 'קרוסלה' }

const STATUS_DOT = {
  pending:   'dot dot--warn',
  inEdit:    'dot',
  approved:  'dot dot--success',
  scheduled: 'dot dot--info',
  published: 'dot dot--success',
  failed:    'dot dot--danger',
}

const STATUS_LABEL = {
  pending:   'ממתין',
  inEdit:    'בעריכה',
  approved:  'מאושר',
  scheduled: 'מתוזמן',
  published: 'פורסם',
  failed:    'נכשל',
}

function relativeTime(ts) {
  const diff = Date.now() - ts
  const h = Math.floor(diff / 3600000)
  if (h < 1) return 'לפני פחות משעה'
  if (h < 24) return `לפני ${h} שעות`
  const d = Math.floor(h / 24)
  return `לפני ${d} ימים`
}

function dayLabel(ts) {
  const d = new Date(ts)
  const today = new Date()
  const diff = Math.round((d - today) / 86400000)
  if (diff === 0) return 'היום'
  if (diff === 1) return 'מחר'
  return d.toLocaleDateString('he-IL', { weekday: 'short', day: 'numeric' })
}

// Mock engagement for top posts
const MOCK_REACH  = [12400, 8700, 5300]
const MOCK_ENGAGE = [840, 620, 390]

export default function Dashboard() {
  const navigate = useNavigate()
  const { clients, posts, campaigns, activity } = useAppState()

  // KPIs
  const postsThisWeek = posts.filter(p => {
    const ago7 = Date.now() - 7 * 86400000
    return p.scheduledAt >= ago7
  }).length

  const pendingApproval = posts.filter(p => p.status === 'pending').length
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length
  const avgRoas = campaigns.length
    ? (campaigns.reduce((s, c) => s + c.roas, 0) / campaigns.length).toFixed(1)
    : '—'

  // Next 7 days posts, sorted ascending
  const now = Date.now()
  const next7 = useMemo(() => {
    return posts
      .filter(p => p.scheduledAt >= now - 86400000 && p.scheduledAt <= now + 7 * 86400000)
      .sort((a, b) => a.scheduledAt - b.scheduledAt)
      .slice(0, 7)
  }, [posts])

  // Top published posts
  const topPosts = useMemo(() => {
    return posts.filter(p => p.status === 'published').slice(0, 3)
  }, [posts])

  function clientName(id) {
    return clients.find(c => c.id === id)?.name ?? id
  }

  return (
    <>
      <PageHeader
        eyebrow="סקירה כללית"
        title="דשבורד"
        description="תמונת מצב יומית של הסוכנות — לקוחות, פוסטים, קמפיינים."
        actions={
          <button className="btn btn-primary" onClick={() => navigate('/factory')}>
            + יצירת תוכן
          </button>
        }
      />

      {/* KPIs */}
      <div className="kpis">
        <div className="kpi">
          <span className="kpi__label">פוסטים השבוע</span>
          <span className="kpi__value numeric">{postsThisWeek}</span>
          <span className="kpi__meta">מתוזמנים ומפורסמים</span>
        </div>
        <div className="kpi">
          <span className="kpi__label">ממתינים לאישור</span>
          <span className="kpi__value numeric">{pendingApproval}</span>
          <span className="kpi__meta">
            {pendingApproval > 0 && (
              <><span className="dot dot--warn" style={{ marginInlineEnd: 6 }} />דורשים תשומת לב</>
            )}
            {pendingApproval === 0 && 'הכל מסודר'}
          </span>
        </div>
        <div className="kpi">
          <span className="kpi__label">קמפיינים פעילים</span>
          <span className="kpi__value numeric">{activeCampaigns}</span>
          <span className="kpi__meta">מתוך {campaigns.length} סה״כ</span>
        </div>
        <div className="kpi">
          <span className="kpi__label">ROAS ממוצע</span>
          <span className="kpi__value numeric">{avgRoas}x</span>
          <span className="kpi__meta">כל הקמפיינים הפעילים</span>
        </div>
      </div>

      {/* Main grid: timeline + activity */}
      <div className="dashboard-grid section">
        <div className="card" style={{ padding: 'var(--sp-5)' }}>
          <div className="section__head" style={{ marginBottom: 'var(--sp-3)' }}>
            <span className="section__title">7 הימים הקרובים</span>
            <span className="section__hint">{next7.length} פריטים</span>
          </div>
          {next7.length === 0 && (
            <div className="empty">
              <div className="empty__title">אין פוסטים מתוזמנים</div>
              <p style={{ fontSize: 'var(--fs-13)', color: 'var(--text-subtle)' }}>
                צור תוכן חדש כדי לאכלס את הלוח
              </p>
            </div>
          )}
          <ul className="timeline">
            {next7.map((p) => (
              <li key={p.id} className="timeline__item">
                <span className="timeline__day">{dayLabel(p.scheduledAt)}</span>
                <div className="timeline__body">
                  <span className="timeline__title">{p.title}</span>
                  <span className="timeline__meta">{clientName(p.clientId)} · {TYPE_LABEL[p.type]}</span>
                </div>
                <span className="pill" style={{ gap: 6 }}>
                  <span className={STATUS_DOT[p.status]} />
                  {STATUS_LABEL[p.status]}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card" style={{ padding: 'var(--sp-5)' }}>
          <div className="section__head" style={{ marginBottom: 'var(--sp-3)' }}>
            <span className="section__title">פעילות אחרונה</span>
          </div>
          <ul className="activity">
            {activity.map((a) => (
              <li key={a.id} className="activity__item">
                <span className="activity__bullet" />
                <span className="activity__text">{a.text}</span>
                <span className="activity__when">{relativeTime(a.at)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Top posts */}
      {topPosts.length > 0 && (
        <div className="section">
          <div className="section__head">
            <span className="section__title">פוסטים מובילים</span>
            <button
              className="btn btn-ghost"
              style={{ fontSize: 'var(--fs-13)', height: 32, padding: '0 var(--sp-3)' }}
              onClick={() => navigate('/approvals')}
            >
              כל הפוסטים
              <ArrowLeft size={14} style={{ marginInlineStart: 4 }} />
            </button>
          </div>
          <div className="top-posts">
            {topPosts.map((p, i) => (
              <div key={p.id} className="top-post">
                <div className="top-post__head">
                  <span className="top-post__client">{clientName(p.clientId)}</span>
                  <span className="pill">{TYPE_LABEL[p.type]}</span>
                </div>
                <div className="top-post__title">{p.title}</div>
                <div className="top-post__stats">
                  <div className="top-post__stat">
                    <span className="top-post__stat-value numeric">
                      {(MOCK_REACH[i] ?? 3200).toLocaleString('he-IL')}
                    </span>
                    <span className="top-post__stat-label">חשיפות</span>
                  </div>
                  <div className="top-post__stat">
                    <span className="top-post__stat-value numeric">
                      {(MOCK_ENGAGE[i] ?? 210).toLocaleString('he-IL')}
                    </span>
                    <span className="top-post__stat-label">אינטראקציות</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
