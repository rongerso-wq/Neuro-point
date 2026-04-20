import { useState, useMemo } from 'react'
import { useAppState } from '../context/ClientContext.jsx'
import { CLIENTS, CAMPAIGNS } from '../lib/seed.js'
import PageHeader from '../components/layout/PageHeader.jsx'
import '../styles/campaigns.css'

const CLICHE_PHRASES = [
  'כל מה שאתה צריך',
  'התחלה קלה',
  'בן זמננו',
  'פתרון חד פעמי',
  'כל סוגי',
  'עבור כל אחד',
]

export default function Campaigns() {
  const { selectedClientId } = useAppState()
  const client = selectedClientId
    ? CLIENTS.find((c) => c.id === selectedClientId)
    : null

  const [showWizard, setShowWizard] = useState(false)
  const [wizardStep, setWizardStep] = useState(1)

  // Wizard form state
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    objective: 'leads',
    audience: new Set(),
    copy: '',
    creative: 'image',
    budget: 1000,
    duration: 30,
  })

  const [clicheWarnings, setClicheWarnings] = useState([])

  const filteredCampaigns = useMemo(() => {
    const camps = selectedClientId
      ? CAMPAIGNS.filter((c) => c.clientId === selectedClientId)
      : CAMPAIGNS
    return camps.sort((a, b) => b.budget - a.budget)
  }, [selectedClientId])

  const audiences = [
    { id: 'a1', label: 'עוקבים קיימים' },
    { id: 'a2', label: 'מעניין בקטגוריה' },
    { id: 'a3', label: 'גילאי 25-40' },
    { id: 'a4', label: 'בתל אביב' },
    { id: 'a5', label: 'פעיל ברשתות חברתיות' },
  ]

  const objectives = [
    { value: 'leads', label: 'הפקת לידים' },
    { value: 'reservations', label: 'הזמנות' },
    { value: 'clicks', label: 'קליקים לאתר' },
    { value: 'installs', label: 'הורדות אפליקציה' },
    { value: 'awareness', label: 'מודעות' },
  ]

  const handleCopyChange = (text) => {
    setCampaignForm({ ...campaignForm, copy: text })

    // Check for clichés
    const warnings = CLICHE_PHRASES.filter((phrase) =>
      text.toLowerCase().includes(phrase)
    )
    setClicheWarnings(warnings)
  }

  const toggleAudience = (id) => {
    const newAudience = new Set(campaignForm.audience)
    if (newAudience.has(id)) {
      newAudience.delete(id)
    } else {
      newAudience.add(id)
    }
    setCampaignForm({ ...campaignForm, audience: newAudience })
  }

  const handleCreateCampaign = () => {
    // Mock campaign creation
    setShowWizard(false)
    setWizardStep(1)
    setCampaignForm({
      name: '',
      objective: 'leads',
      audience: new Set(),
      copy: '',
      creative: 'image',
      budget: 1000,
      duration: 30,
    })
  }

  const canProceedStep = () => {
    if (wizardStep === 1) return campaignForm.name && campaignForm.objective
    if (wizardStep === 2) return campaignForm.audience.size > 0
    if (wizardStep === 3) return campaignForm.copy.length > 10
    if (wizardStep === 4) return campaignForm.creative && campaignForm.budget > 0
    return true
  }

  return (
    <div className="page-campaigns">
      <PageHeader
        title="קמפיינים"
        subtitle={client ? `קמפיינים: ${client.name}` : 'קמפיינים: כל הלקוחות'}
        action={{ label: '+ קמפיין חדש', onClick: () => setShowWizard(true) }}
      />

      {filteredCampaigns.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon" role="img" aria-label="אין קמפיינים">📊</div>
          <div className="empty-title">אין קמפיינים</div>
          <div className="empty-desc">אין קמפיינים בתשלום לאותם פילטרים.</div>
          <button className="btn-create" onClick={() => setShowWizard(true)}>
            צור קמפיין ראשון
          </button>
        </div>
      ) : (
        <div className="campaigns-grid">
          {filteredCampaigns.map((campaign) => (
            <div key={campaign.id} className="campaign-card">
              <div className="campaign-header">
                <h3 className="campaign-name">{campaign.name}</h3>
                <span className={`status-pill status-${campaign.status}`}>
                  {campaign.status === 'active' && 'פעיל'}
                  {campaign.status === 'paused' && 'מושהה'}
                  {campaign.status === 'completed' && 'הסתיים'}
                </span>
              </div>
              <div className="campaign-objective">
                {objectives.find((o) => o.value === campaign.objective)?.label}
              </div>
              <div className="campaign-metrics">
                <div className="metric">
                  <span className="metric-label">תקציב</span>
                  <span className="metric-value">{campaign.budget} ₪</span>
                </div>
                <div className="metric">
                  <span className="metric-label">הוצאה</span>
                  <span className="metric-value">{campaign.spend} ₪</span>
                </div>
                <div className="metric">
                  <span className="metric-label">CTR</span>
                  <span className="metric-value">{campaign.ctr}%</span>
                </div>
              </div>
              <div className="campaign-performance">
                <div className="perf-metric">
                  <span className="perf-label">CPC</span>
                  <span className="perf-value">{campaign.cpc} ₪</span>
                </div>
                <div className="perf-metric">
                  <span className="perf-label">ROAS</span>
                  <span className="perf-value">{campaign.roas}x</span>
                </div>
              </div>
              <div className="campaign-actions">
                <button className="btn-action">ערוך</button>
                <button className="btn-action">עמוד</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Wizard Modal */}
      {showWizard && (
        <div className="wizard-overlay" onClick={() => setShowWizard(false)}>
          <div className="wizard-content" onClick={(e) => e.stopPropagation()}>
            <div className="wizard-header">
              <h2>יצור קמפיין חדש</h2>
              <button className="btn-close" onClick={() => setShowWizard(false)}>
                ✕
              </button>
            </div>

            {/* Progress Indicator */}
            <div
              className="wizard-progress"
              role="progressbar"
              aria-valuenow={wizardStep}
              aria-valuemin={1}
              aria-valuemax={5}
              aria-label="שלבי אשף הקמפיין"
            >
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`progress-step ${wizardStep >= step ? 'active' : ''}`}
                  aria-current={wizardStep === step ? 'step' : undefined}
                >
                  {step}
                </div>
              ))}
            </div>

            {/* Step 1: Basics */}
            {wizardStep === 1 && (
              <div className="wizard-step">
                <h3 className="step-title">שם וקטגוריה</h3>
                <div className="form-group">
                  <label>שם קמפיין</label>
                  <input
                    type="text"
                    value={campaignForm.name}
                    onChange={(e) =>
                      setCampaignForm({ ...campaignForm, name: e.target.value })
                    }
                    placeholder="לדוגמה: קמפיין קיץ"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>מטרת קמפיין</label>
                  <div className="radio-group">
                    {objectives.map((obj) => (
                      <label key={obj.value} htmlFor={`obj-${obj.value}`} className="radio-label">
                        <input
                          id={`obj-${obj.value}`}
                          type="radio"
                          value={obj.value}
                          checked={campaignForm.objective === obj.value}
                          onChange={(e) =>
                            setCampaignForm({
                              ...campaignForm,
                              objective: e.target.value,
                            })
                          }
                        />
                        <span>{obj.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Audience */}
            {wizardStep === 2 && (
              <div className="wizard-step">
                <h3 className="step-title">בחר קהל יעד</h3>
                <div className="audience-list">
                  {audiences.map((aud) => (
                    <label key={aud.id} className="audience-item">
                      <input
                        type="checkbox"
                        checked={campaignForm.audience.has(aud.id)}
                        onChange={() => toggleAudience(aud.id)}
                      />
                      <span className="audience-label">{aud.label}</span>
                    </label>
                  ))}
                </div>
                <div className="selected-count">
                  {campaignForm.audience.size} קהלים נבחרים
                </div>
              </div>
            )}

            {/* Step 3: Copy */}
            {wizardStep === 3 && (
              <div className="wizard-step">
                <h3 className="step-title">כתוב קופי</h3>
                <div className="form-group">
                  <label>טקסט הפרסום</label>
                  <textarea
                    value={campaignForm.copy}
                    onChange={(e) => handleCopyChange(e.target.value)}
                    placeholder="כתוב את הטקסט שלך כאן..."
                    className="form-textarea"
                    rows="5"
                  />
                  <div className="copy-meta">
                    {campaignForm.copy.length} / 300 תווים
                  </div>
                </div>
                {clicheWarnings.length > 0 && (
                  <div className="warnings">
                    <div className="warning-title">⚠️ הערות טון:</div>
                    {clicheWarnings.map((phrase) => (
                      <div key={phrase} className="warning-item">
                        חיסלו את הביטוי: "{phrase}"
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Creative & Budget */}
            {wizardStep === 4 && (
              <div className="wizard-step">
                <h3 className="step-title">יצירתי ותקציב</h3>
                <div className="form-group">
                  <label>סוג חומר יצירתי</label>
                  <div className="radio-group">
                    <label htmlFor="creative-image" className="radio-label">
                      <input
                        id="creative-image"
                        type="radio"
                        value="image"
                        checked={campaignForm.creative === 'image'}
                        onChange={(e) =>
                          setCampaignForm({
                            ...campaignForm,
                            creative: e.target.value,
                          })
                        }
                      />
                      <span>תמונה</span>
                    </label>
                    <label htmlFor="creative-video" className="radio-label">
                      <input
                        id="creative-video"
                        type="radio"
                        value="video"
                        checked={campaignForm.creative === 'video'}
                        onChange={(e) =>
                          setCampaignForm({
                            ...campaignForm,
                            creative: e.target.value,
                          })
                        }
                      />
                      <span>וידאו</span>
                    </label>
                    <label htmlFor="creative-carousel" className="radio-label">
                      <input
                        id="creative-carousel"
                        type="radio"
                        value="carousel"
                        checked={campaignForm.creative === 'carousel'}
                        onChange={(e) =>
                          setCampaignForm({
                            ...campaignForm,
                            creative: e.target.value,
                          })
                        }
                      />
                      <span>קרוסלה</span>
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>תקציב יומי (₪)</label>
                  <input
                    type="number"
                    value={campaignForm.budget}
                    onChange={(e) =>
                      setCampaignForm({
                        ...campaignForm,
                        budget: Number(e.target.value),
                      })
                    }
                    className="form-input"
                    min="100"
                    max="10000"
                  />
                </div>
                <div className="form-group">
                  <label>משך קמפיין (ימים)</label>
                  <input
                    type="number"
                    value={campaignForm.duration}
                    onChange={(e) =>
                      setCampaignForm({
                        ...campaignForm,
                        duration: Number(e.target.value),
                      })
                    }
                    className="form-input"
                    min="1"
                    max="365"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {wizardStep === 5 && (
              <div className="wizard-step">
                <h3 className="step-title">בדוק את הפרטים</h3>
                <div className="review-section">
                  <div className="review-item">
                    <span className="review-label">שם קמפיין:</span>
                    <span className="review-value">{campaignForm.name}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">מטרה:</span>
                    <span className="review-value">
                      {objectives.find((o) => o.value === campaignForm.objective)
                        ?.label}
                    </span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">קהלים:</span>
                    <span className="review-value">
                      {campaignForm.audience.size} קהלים
                    </span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">יצירתי:</span>
                    <span className="review-value">{campaignForm.creative}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">תקציב:</span>
                    <span className="review-value">
                      {campaignForm.budget} ₪ × {campaignForm.duration} ימים
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="wizard-actions">
              <button
                className="btn-secondary"
                onClick={() => setWizardStep(Math.max(1, wizardStep - 1))}
                disabled={wizardStep === 1}
              >
                חזור
              </button>
              {wizardStep < 5 ? (
                <button
                  className="btn-primary"
                  onClick={() => setWizardStep(wizardStep + 1)}
                  disabled={!canProceedStep()}
                >
                  הבא
                </button>
              ) : (
                <button
                  className="btn-primary"
                  onClick={handleCreateCampaign}
                >
                  צור קמפיין
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
