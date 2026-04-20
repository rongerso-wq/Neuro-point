import { useState, useCallback } from 'react'
import { X, Plus } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader.jsx'
import { useAppState } from '../context/ClientContext.jsx'
import { ClientSchema, validateForm } from '../lib/validation.js'
import './pages.css'

const INDUSTRY_LABEL = {
  tech:       'טכנולוגיה',
  restaurant: 'מסעדנות',
}

function initials(name) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function nextPostDays(cadencePerWeek) {
  // naive: assume even distribution across week
  const daysPerPost = 7 / cadencePerWeek
  return Math.round(daysPerPost)
}

/* ------------------------------------------------------------------ */
/*  Client Profile Drawer                                               */
/* ------------------------------------------------------------------ */

function ClientDrawer({ client, onClose, onSave }) {
  const [form, setForm] = useState({ ...client })
  const [error, setError] = useState(null)

  function set(field, val) {
    setForm((prev) => ({ ...prev, [field]: val }))
    setError(null) // clear error when user starts editing
  }

  function handleVoiceChange(e) {
    set('brandVoice', e.target.value.split(',').map((v) => v.trim()).filter(Boolean))
  }

  function handleSave() {
    const result = validateForm(ClientSchema, form)
    if (!result.success) {
      setError(result.error)
      return
    }
    onSave(result.data)
    onClose()
  }

  return (
    <>
      <div className="drawer__backdrop" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-label={`פרופיל לקוח: ${client.name}`}>
        <div className="drawer__head">
          <div>
            <div className="drawer__title">{client.name}</div>
            <div className="drawer__subtitle">{client.industryLabel} · {client.handle}</div>
          </div>
          <button className="drawer__close" onClick={onClose} aria-label="סגור">
            <X size={16} />
          </button>
        </div>

        <div className="drawer__body">
          {error && (
            <div style={{ padding: 'var(--sp-4)', marginBottom: 'var(--sp-4)', backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: 'var(--r-sm)', color: '#991b1b' }}>
              {error}
            </div>
          )}
          {/* Basic */}
          <div>
            <div className="section__title" style={{ marginBottom: 'var(--sp-4)' }}>פרטים כלליים</div>
            <div className="field__row">
              <div className="field">
                <label className="field__label">שם לקוח</label>
                <input
                  className="field__input"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                />
              </div>
              <div className="field">
                <label className="field__label">כינוי / Handle</label>
                <input
                  className="field__input"
                  value={form.handle}
                  onChange={(e) => set('handle', e.target.value)}
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Brand voice */}
          <div>
            <div className="section__title" style={{ marginBottom: 'var(--sp-4)' }}>Brand Voice</div>
            <div className="field">
              <label className="field__label">תכונות (מופרדות בפסיק)</label>
              <input
                className="field__input"
                value={form.brandVoice.join(', ')}
                onChange={handleVoiceChange}
                placeholder="למשל: מקצועי, חם, ישיר"
              />
              <span className="field__help">
                {form.brandVoice.length > 0 && (
                  <span style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {form.brandVoice.map((v) => (
                      <span key={v} className="pill">{v}</span>
                    ))}
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Audience */}
          <div>
            <div className="section__title" style={{ marginBottom: 'var(--sp-4)' }}>קהל יעד</div>
            <div className="field">
              <label className="field__label">תיאור קהל</label>
              <input
                className="field__input"
                value={form.audience}
                onChange={(e) => set('audience', e.target.value)}
                placeholder="גיל, תפקיד, תחומי עניין..."
              />
            </div>
          </div>

          {/* Content guidelines */}
          <div>
            <div className="section__title" style={{ marginBottom: 'var(--sp-4)' }}>הנחיות תוכן</div>
            <div className="field">
              <label className="field__label">הערות ואיסורים</label>
              <textarea
                className="field__textarea"
                value={form.notes}
                onChange={(e) => set('notes', e.target.value)}
                placeholder="מה לעשות ומה להימנע ממנו..."
              />
            </div>
          </div>

          {/* Cadence */}
          <div>
            <div className="section__title" style={{ marginBottom: 'var(--sp-4)' }}>פרסום</div>
            <div className="field__row">
              <div className="field">
                <label className="field__label">פוסטים בשבוע</label>
                <input
                  type="number"
                  min={1}
                  max={14}
                  className="field__input"
                  value={form.cadencePerWeek}
                  onChange={(e) => set('cadencePerWeek', Number(e.target.value))}
                  dir="ltr"
                />
              </div>
              <div className="field">
                <label className="field__label">תעשייה</label>
                <select
                  className="field__select"
                  value={form.industry}
                  onChange={(e) => set('industry', e.target.value)}
                >
                  <option value="tech">טכנולוגיה</option>
                  <option value="restaurant">מסעדנות</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="drawer__foot">
          <button className="btn btn-secondary" onClick={onClose}>ביטול</button>
          <button className="btn btn-primary" onClick={handleSave}>שמור שינויים</button>
        </div>
      </aside>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Clients page                                                        */
/* ------------------------------------------------------------------ */

export default function Clients() {
  const { clients, posts, setState } = useAppState()
  const [activeClient, setActiveClient] = useState(null)
  const [toast, setToast] = useState(null)

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 2800)
  }

  const saveClient = useCallback((updated) => {
    setState((prev) => ({
      ...prev,
      clients: prev.clients.map((c) => (c.id === updated.id ? updated : c)),
    }))
    showToast(`השינויים עבור ${updated.name} נשמרו`)
  }, [setState])

  function postsForClient(clientId) {
    return posts.filter((p) => p.clientId === clientId)
  }

  function pendingCount(clientId) {
    return posts.filter((p) => p.clientId === clientId && p.status === 'pending').length
  }

  return (
    <>
      <PageHeader
        eyebrow="ניהול לקוחות"
        title="לקוחות"
        description={`${clients.length} לקוחות פעילים — לחצו על כרטיס לעריכת הפרופיל`}
        actions={
          <button className="btn btn-primary">
            <Plus size={15} />
            לקוח חדש
          </button>
        }
      />

      <div className="clients-grid">
        {clients.map((client) => {
          const total = postsForClient(client.id).length
          const pending = pendingCount(client.id)
          return (
            <button
              key={client.id}
              className="client-card"
              onClick={() => setActiveClient(client)}
              aria-label={`פרופיל ${client.name}`}
            >
              <div className="client-card__head">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                  <div className="client-card__avatar">{initials(client.name)}</div>
                  <div>
                    <div className="client-card__name">{client.name}</div>
                    <div className="client-card__handle" dir="ltr">{client.handle}</div>
                  </div>
                </div>
                {pending > 0 && (
                  <span className="pill" style={{ gap: 6 }}>
                    <span className="dot dot--warn" />
                    {pending} ממתין
                  </span>
                )}
              </div>

              <div className="client-card__tags">
                <span className="pill">{client.industryLabel}</span>
                {client.brandVoice.map((v) => (
                  <span key={v} className="pill">{v}</span>
                ))}
              </div>

              <div className="client-card__stats">
                <div>
                  <div className="client-card__stat-label">פוסטים בשבוע</div>
                  <div className="client-card__stat-value numeric">{client.cadencePerWeek}</div>
                </div>
                <div>
                  <div className="client-card__stat-label">פוסט הבא בעוד</div>
                  <div className="client-card__stat-value numeric">
                    {nextPostDays(client.cadencePerWeek)} ימים
                  </div>
                </div>
                <div>
                  <div className="client-card__stat-label">סה״כ פוסטים</div>
                  <div className="client-card__stat-value numeric">{total}</div>
                </div>
                <div>
                  <div className="client-card__stat-label">קהל יעד</div>
                  <div
                    className="client-card__stat-value"
                    style={{
                      fontSize: 'var(--fs-12)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {client.audience}
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {activeClient && (
        <ClientDrawer
          client={activeClient}
          onClose={() => setActiveClient(null)}
          onSave={saveClient}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  )
}
