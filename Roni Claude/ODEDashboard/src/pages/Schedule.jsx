import { useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader.jsx'
import { useAppState } from '../context/ClientContext.jsx'
import './pages.css'

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

const DAYS_HE    = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']
const MONTHS_HE  = [
  'ינואר','פברואר','מרץ','אפריל','מאי','יוני',
  'יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר',
]

const STATUS_LABELS = {
  pending:   'ממתין',
  inEdit:    'עריכה',
  approved:  'מאושר',
  rejected:  'נדחה',
  scheduled: 'מתוזמן',
  published: 'פורסם',
}

const STATUS_DOT = {
  pending:   'warn',
  inEdit:    'info',
  approved:  'success',
  rejected:  'danger',
  scheduled: 'info',
  published: 'success',
}

const TYPE_LABELS = {
  feed: 'פיד', reel: 'ריל', story: 'סטורי', carousel: 'קרוסלה',
}

function midnight(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

function weekStartOf(date) {
  const d = midnight(date)
  d.setDate(d.getDate() - d.getDay()) // Sunday = 0
  return d
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate()
  )
}

function formatShort(ts) {
  return new Date(ts).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
}

/* ------------------------------------------------------------------ */
/*  Week view                                                           */
/* ------------------------------------------------------------------ */

function WeekView({ posts, clients, weekOffset, setWeekOffset, onReschedule }) {
  const today  = midnight(new Date())
  const start  = addDays(weekStartOf(today), weekOffset * 7)
  const days   = Array.from({ length: 7 }, (_, i) => addDays(start, i))
  const [dragOverIdx, setDragOverIdx] = useState(null)

  const getClient = (id) => clients.find((c) => c.id === id)

  const weekLabel =
    `${formatShort(days[0])} – ${formatShort(days[6])}, ${days[0].getFullYear()}`

  function handleDragStart(e, postId) {
    e.dataTransfer.setData('text/plain', postId)
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(e, idx) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIdx(idx)
  }

  function handleDrop(e, day) {
    e.preventDefault()
    setDragOverIdx(null)
    const postId = e.dataTransfer.getData('text/plain')
    if (postId) onReschedule(postId, day.getTime())
  }

  return (
    <>
      <div className="sched-nav">
        <span className="sched-nav-title">{weekLabel}</span>
        <div className="sched-nav-btns">
          <button
            className="btn btn-secondary"
            style={{ padding: '6px 10px' }}
            onClick={() => setWeekOffset((w) => w - 1)}
          >
            <ChevronRight size={16} />
          </button>
          <button
            className="btn btn-secondary"
            style={{ fontSize: 'var(--fs-12)', padding: '6px 14px' }}
            onClick={() => setWeekOffset(0)}
          >
            השבוע
          </button>
          <button
            className="btn btn-secondary"
            style={{ padding: '6px 10px' }}
            onClick={() => setWeekOffset((w) => w + 1)}
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      </div>

      <div className="week-grid">
        {days.map((day, i) => {
          const isToday    = isSameDay(day, today)
          const dayPosts   = posts.filter((p) => isSameDay(new Date(p.scheduledAt), day))
          const isDragOver = dragOverIdx === i

          return (
            <div
              key={i}
              className={[
                'week-col',
                isToday    ? 'week-col--today'   : '',
                isDragOver ? 'week-col--dragover' : '',
              ].filter(Boolean).join(' ')}
              onDragOver={(e) => handleDragOver(e, i)}
              onDragLeave={() => setDragOverIdx(null)}
              onDrop={(e) => handleDrop(e, day)}
            >
              {/* Day header */}
              <div className="week-col__head">
                <div className="week-col__day">{DAYS_HE[day.getDay()]}</div>
                <div className={`week-col__date${isToday ? ' week-col__date--today' : ''}`}>
                  {day.getDate()}
                </div>
              </div>

              {/* Posts */}
              {dayPosts.map((post) => {
                const client = getClient(post.clientId)
                return (
                  <div
                    key={post.id}
                    className="week-post"
                    draggable
                    onDragStart={(e) => handleDragStart(e, post.id)}
                  >
                    <div className="week-post__client">
                      {client?.name ?? '—'}
                    </div>
                    <div className="week-post__title">{post.title}</div>
                    <div className="week-post__foot">
                      <span className="pill">{TYPE_LABELS[post.type] ?? post.type}</span>
                      <span className={`dot dot--${STATUS_DOT[post.status] ?? 'muted'}`} />
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Month view                                                          */
/* ------------------------------------------------------------------ */

function MonthView({ posts, monthDate, setMonthDate }) {
  const today     = midnight(new Date())
  const year      = monthDate.getFullYear()
  const month     = monthDate.getMonth()
  const firstDay  = new Date(year, month, 1)
  const lastDay   = new Date(year, month + 1, 0)
  const startPad  = firstDay.getDay() // 0=Sun, pad empty cells at start

  // Build calendar cells: [null × pad] + [1..lastDate]
  const cells = [
    ...Array(startPad).fill(null),
    ...Array.from({ length: lastDay.getDate() }, (_, i) => new Date(year, month, i + 1)),
  ]
  // Pad end to complete last row
  while (cells.length % 7 !== 0) cells.push(null)

  const postsOnDay = (day) =>
    day ? posts.filter((p) => isSameDay(new Date(p.scheduledAt), day)) : []

  const monthLabel = `${MONTHS_HE[month]} ${year}`

  return (
    <>
      <div className="sched-nav">
        <span className="sched-nav-title">{monthLabel}</span>
        <div className="sched-nav-btns">
          <button
            className="btn btn-secondary"
            style={{ padding: '6px 10px' }}
            onClick={() => setMonthDate(new Date(year, month - 1, 1))}
          >
            <ChevronRight size={16} />
          </button>
          <button
            className="btn btn-secondary"
            style={{ fontSize: 'var(--fs-12)', padding: '6px 14px' }}
            onClick={() => setMonthDate(new Date())}
          >
            החודש
          </button>
          <button
            className="btn btn-secondary"
            style={{ padding: '6px 10px' }}
            onClick={() => setMonthDate(new Date(year, month + 1, 1))}
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      </div>

      <div className="month-grid">
        {/* Day-name header row */}
        {DAYS_HE.map((d) => (
          <div key={d} className="month-grid__dayname">{d}</div>
        ))}

        {/* Calendar cells */}
        {cells.map((day, i) => {
          const dayPosts = postsOnDay(day)
          const isOther  = !day
          const isToday  = day && isSameDay(day, today)

          return (
            <div
              key={i}
              className={`month-day${isOther ? ' month-day--other' : ''}`}
            >
              {day && (
                <>
                  <div
                    className={`month-day__num${
                      isOther  ? ' month-day__num--other' :
                      isToday  ? ' month-day__num--today'  : ''
                    }`}
                  >
                    {day.getDate()}
                  </div>
                  {dayPosts.slice(0, 3).map((post) => (
                    <div key={post.id} className="month-dot">
                      {post.title}
                    </div>
                  ))}
                  {dayPosts.length > 3 && (
                    <div className="month-dot" style={{ color: 'var(--text-subtle)' }}>
                      +{dayPosts.length - 3} עוד
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Publishing queue view                                               */
/* ------------------------------------------------------------------ */

function QueueView({ posts, clients }) {
  const getClient = (id) => clients.find((c) => c.id === id)

  const sorted = [...posts]
    .filter((p) => p.status !== 'rejected')
    .sort((a, b) => a.scheduledAt - b.scheduledAt)

  if (sorted.length === 0) {
    return (
      <div className="empty">
        <div className="empty__title">תור הפרסום ריק</div>
        <p>צור תוכן מה-AI ואשר פוסטים כדי שיופיעו כאן.</p>
      </div>
    )
  }

  return (
    <div className="queue">
      <div className="queue-header">
        <span className="queue-header-cell">תאריך</span>
        <span className="queue-header-cell">לקוח</span>
        <span className="queue-header-cell">כותרת</span>
        <span className="queue-header-cell">סוג</span>
        <span className="queue-header-cell">סטטוס</span>
      </div>

      {sorted.map((post) => {
        const client = getClient(post.clientId)
        return (
          <div key={post.id} className="queue-row">
            <span className="queue-cell queue-cell--muted">
              {formatShort(post.scheduledAt)}
            </span>
            <span className="queue-cell">{client?.name ?? '—'}</span>
            <span className="queue-cell">{post.title}</span>
            <span className="queue-cell">
              <span className="pill">{TYPE_LABELS[post.type] ?? post.type}</span>
            </span>
            <span className="queue-cell">
              <span className={`status-pill status-pill--${post.status}`}>
                <span className={`dot dot--${STATUS_DOT[post.status] ?? 'muted'}`} />
                {STATUS_LABELS[post.status] ?? post.status}
              </span>
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Schedule page                                                       */
/* ------------------------------------------------------------------ */

const TABS = [
  { id: 'week',  label: 'שבועי' },
  { id: 'month', label: 'חודשי' },
  { id: 'queue', label: 'תור פרסום' },
]

export default function Schedule() {
  const { posts, clients, setState } = useAppState()
  const [activeTab,   setActiveTab]   = useState('week')
  const [weekOffset,  setWeekOffset]  = useState(0)
  const [monthDate,   setMonthDate]   = useState(new Date())

  const handleReschedule = useCallback((postId, newTs) => {
    setState((prev) => ({
      ...prev,
      posts: prev.posts.map((p) =>
        p.id === postId ? { ...p, scheduledAt: newTs } : p,
      ),
    }))
  }, [setState])

  // Queue badge — pending approvals don't count here; count all non-rejected
  const queueCount = posts.filter((p) => p.status !== 'rejected').length

  return (
    <>
      <PageHeader
        eyebrow="לו״ז"
        title="תור פרסום"
        description="תצוגת לוח שנה של כל הפוסטים. גרור ושחרר לשינוי תאריך."
      />

      {/* Tabs */}
      <div className="sched-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`sched-tab${activeTab === tab.id ? ' sched-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.id === 'queue' && queueCount > 0 && (
              <span
                style={{
                  marginInlineStart: 6,
                  fontSize: 'var(--fs-12)',
                  background: 'var(--surface-2)',
                  border: 'var(--hairline)',
                  borderRadius: 'var(--r-pill)',
                  padding: '1px 7px',
                  color: 'var(--text-muted)',
                }}
              >
                {queueCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'week' && (
        <WeekView
          posts={posts}
          clients={clients}
          weekOffset={weekOffset}
          setWeekOffset={setWeekOffset}
          onReschedule={handleReschedule}
        />
      )}

      {activeTab === 'month' && (
        <MonthView
          posts={posts}
          monthDate={monthDate}
          setMonthDate={setMonthDate}
        />
      )}

      {activeTab === 'queue' && (
        <QueueView posts={posts} clients={clients} />
      )}
    </>
  )
}
