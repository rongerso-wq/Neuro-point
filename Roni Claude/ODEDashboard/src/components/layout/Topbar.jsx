import { useEffect, useRef, useState } from 'react'
import { Search, Bell, ChevronDown, Check } from 'lucide-react'
import { useAppState } from '../../context/ClientContext.jsx'
import { t } from '../../lib/i18n.js'

export default function Topbar() {
  const { clients, selectedClientId, setSelectedClientId } = useAppState()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const selected = clients.find((c) => c.id === selectedClientId)
  const label = selected ? selected.name : t('common.all') + ' · כל הלקוחות'

  return (
    <header className="topbar">
      <div className="topbar__client" ref={ref}>
        <button
          type="button"
          className="topbar__client-btn"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="topbar__client-dot" />
          <span className="topbar__client-label">{label}</span>
          <ChevronDown size={14} strokeWidth={1.8} />
        </button>

        {open && (
          <div className="topbar__menu" role="listbox">
            <button
              className="topbar__menu-item"
              onClick={() => { setSelectedClientId(null); setOpen(false) }}
            >
              <span>{t('common.all')} · כל הלקוחות</span>
              {selectedClientId === null && <Check size={14} strokeWidth={2} />}
            </button>
            <div className="topbar__menu-sep" />
            {clients.map((c) => (
              <button
                key={c.id}
                className="topbar__menu-item"
                onClick={() => { setSelectedClientId(c.id); setOpen(false) }}
              >
                <div className="topbar__menu-row">
                  <span className="topbar__menu-name">{c.name}</span>
                  <span className="topbar__menu-meta">{c.industryLabel}</span>
                </div>
                {selectedClientId === c.id && <Check size={14} strokeWidth={2} />}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="topbar__search">
        <Search size={15} strokeWidth={1.8} />
        <input
          type="search"
          placeholder={t('common.search') + '… לקוחות, פוסטים, קמפיינים'}
          aria-label={t('common.search')}
        />
        <kbd className="topbar__kbd">⌘K</kbd>
      </div>

      <div className="topbar__actions">
        <button className="topbar__icon-btn" aria-label="התראות">
          <Bell size={17} strokeWidth={1.6} />
          <span className="topbar__badge" aria-hidden />
        </button>
      </div>
    </header>
  )
}
