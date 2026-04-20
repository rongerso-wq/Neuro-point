import { useState } from 'react'
import PageHeader from '../components/layout/PageHeader.jsx'
import '../styles/video-studio.css'

export default function VideoStudio() {
  const [clips, setClips] = useState([
    { id: 1, name: 'קליפ 1', duration: 5, color: '#e5e5e7' },
    { id: 2, name: 'קליפ 2', duration: 4, color: '#d4d4d6' },
    { id: 3, name: 'קליפ 3', duration: 6, color: '#c0c0c2' },
  ])

  const [timeline, setTimeline] = useState([
    { id: 1, name: 'קליפ 1', duration: 5 },
    { id: 2, name: 'קליפ 2', duration: 4 },
    { id: 3, name: 'קליפ 3', duration: 6 },
  ])

  const [showExportModal, setShowExportModal] = useState(false)
  const [exportSettings, setExportSettings] = useState({
    subtitles: true,
    music: 'upbeat',
    logo: true,
    smartCuts: true,
  })

  const [isRendering, setIsRendering] = useState(false)
  const [renderProgress, setRenderProgress] = useState(0)

  const handleAddClip = (clip) => {
    setTimeline([...timeline, clip])
  }

  const handleRemoveClip = (id) => {
    setTimeline(timeline.filter((c) => c.id !== id))
  }

  const handleMoveClip = (id, direction) => {
    const index = timeline.findIndex((c) => c.id === id)
    if (direction === 'up' && index > 0) {
      const newTimeline = [...timeline]
      ;[newTimeline[index], newTimeline[index - 1]] = [
        newTimeline[index - 1],
        newTimeline[index],
      ]
      setTimeline(newTimeline)
    } else if (direction === 'down' && index < timeline.length - 1) {
      const newTimeline = [...timeline]
      ;[newTimeline[index], newTimeline[index + 1]] = [
        newTimeline[index + 1],
        newTimeline[index],
      ]
      setTimeline(newTimeline)
    }
  }

  const totalDuration = timeline.reduce((sum, c) => sum + c.duration, 0)

  const handleRender = async () => {
    setIsRendering(true)
    setRenderProgress(0)

    const interval = setInterval(() => {
      setRenderProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 25
      })
    }, 250)

    setTimeout(() => {
      setIsRendering(false)
      setTimeout(() => setRenderProgress(0), 800)
    }, 2000)
  }

  return (
    <div className="page-video-studio">
      <PageHeader
        title="אולפן וידאו"
        subtitle="הרכבת קליפים לסרטון אחד"
      />

      <div className="studio-grid">
        {/* Available Clips */}
        <section className="studio-panel">
          <h2 className="panel-title">קליפים זמינים</h2>
          <div className="clips-library">
            {clips.map((clip) => (
              <div
                key={clip.id}
                className="clip-card"
                style={{ borderLeftColor: clip.color }}
              >
                <div className="clip-info">
                  <div className="clip-name">{clip.name}</div>
                  <div className="clip-duration">{clip.duration} שנ׳</div>
                </div>
                <button
                  className="btn-add-clip"
                  onClick={() => handleAddClip(clip)}
                >
                  +
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="studio-panel timeline-panel">
          <h2 className="panel-title">
            ציר הזמן — {totalDuration} שנ׳ כולל
          </h2>
          <div className="timeline-container">
            {timeline.length === 0 ? (
              <div className="empty-timeline">
                <div className="empty-icon">📹</div>
                <div className="empty-text">גרור קליפים כאן או לחץ להוספה</div>
              </div>
            ) : (
              <div className="timeline-list">
                {timeline.map((clip, index) => (
                  <div key={clip.id} className="timeline-clip">
                    <div className="clip-position">{index + 1}</div>
                    <div className="clip-bar" style={{ width: `${clip.duration * 20}px` }}>
                      <div className="clip-label">{clip.name}</div>
                    </div>
                    <div className="timeline-controls">
                      <button
                        className="btn-move"
                        onClick={() => handleMoveClip(clip.id, 'up')}
                        disabled={index === 0}
                      >
                        ↑
                      </button>
                      <button
                        className="btn-move"
                        onClick={() => handleMoveClip(clip.id, 'down')}
                        disabled={index === timeline.length - 1}
                      >
                        ↓
                      </button>
                      <button
                        className="btn-remove"
                        onClick={() => handleRemoveClip(clip.id)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Export Options */}
          <div className="export-options">
            <button
              className="btn-export"
              onClick={() => setShowExportModal(true)}
              disabled={timeline.length === 0 || isRendering}
            >
              {isRendering ? 'משדרגת...' : 'צפה בתצוגה מקדימה'}
            </button>
          </div>

          {/* Render Progress */}
          {isRendering && (
            <div className="render-progress">
              <div className="spinner" />
              <div className="progress-text">{Math.round(renderProgress)}%</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${renderProgress}%` }} />
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>ייצוא וידאו</h2>
              <button
                className="btn-close"
                onClick={() => setShowExportModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {/* Preview */}
              <div className="preview-box">
                <div className="preview-placeholder">
                  <div className="preview-icon">▶</div>
                  <div className="preview-text">תצוגה מקדימה — {totalDuration} שנ׳</div>
                </div>
              </div>

              {/* Settings */}
              <div className="export-settings">
                <div className="setting-group">
                  <label className="setting-label">
                    <input
                      type="checkbox"
                      checked={exportSettings.subtitles}
                      onChange={(e) =>
                        setExportSettings({
                          ...exportSettings,
                          subtitles: e.target.checked,
                        })
                      }
                    />
                    <span>כתוביות אוטומטיות</span>
                  </label>
                </div>

                <div className="setting-group">
                  <label className="setting-label">
                    <input
                      type="checkbox"
                      checked={exportSettings.music}
                      onChange={(e) =>
                        setExportSettings({
                          ...exportSettings,
                          music: e.target.checked ? 'upbeat' : false,
                        })
                      }
                    />
                    <span>מוסיקה רקע (פולקלוריים)</span>
                  </label>
                </div>

                <div className="setting-group">
                  <label className="setting-label">
                    <input
                      type="checkbox"
                      checked={exportSettings.logo}
                      onChange={(e) =>
                        setExportSettings({
                          ...exportSettings,
                          logo: e.target.checked,
                        })
                      }
                    />
                    <span>הוסף לוגו בפינה</span>
                  </label>
                </div>

                <div className="setting-group">
                  <label className="setting-label">
                    <input
                      type="checkbox"
                      checked={exportSettings.smartCuts}
                      onChange={(e) =>
                        setExportSettings({
                          ...exportSettings,
                          smartCuts: e.target.checked,
                        })
                      }
                    />
                    <span>חתכים חכמים בקצב המוסיקה</span>
                  </label>
                </div>

                <div className="setting-group">
                  <label className="setting-label">
                    פורמט
                  </label>
                  <select className="format-select">
                    <option>MP4 (1080p)</option>
                    <option>WebM (720p)</option>
                    <option>MOV (4K)</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="modal-actions">
                <button
                  className="btn-cancel"
                  onClick={() => setShowExportModal(false)}
                >
                  ביטול
                </button>
                <button
                  className="btn-render"
                  onClick={handleRender}
                  disabled={isRendering}
                >
                  {isRendering ? 'משדרגת...' : 'הרנדר וייצוא'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
