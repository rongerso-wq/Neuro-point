import { useState } from 'react'
import PageHeader from '../components/layout/PageHeader.jsx'
import '../styles/settings.css'

export default function Settings() {
  const [agencyName, setAgencyName] = useState('Agency Name')
  const [agencyEmail, setAgencyEmail] = useState('admin@agency.example')
  const [agencyPhone, setAgencyPhone] = useState('+1 (555) 123-4567')

  const [connectedAccounts, setConnectedAccounts] = useState([
    { id: 'ig', platform: 'Instagram', handle: '@agency_handle', connected: true },
    { id: 'fb', platform: 'Facebook', handle: '@agency_page', connected: true },
    { id: 'tiktok', platform: 'TikTok', handle: '@agency_tiktok', connected: false },
    { id: 'yt', platform: 'YouTube', handle: 'Agency Channel', connected: false },
  ])

  const [teamMembers] = useState([
    { id: 'u1', name: 'User One', role: 'Owner', email: 'user1@agency.example' },
    { id: 'u2', name: 'User Two', role: 'Content Creator', email: 'user2@agency.example' },
    { id: 'u3', name: 'User Three', role: 'Campaign Manager', email: 'user3@agency.example' },
  ])

  const [brandKit] = useState({
    primaryColor: '#0a0a0a',
    accentColor: '#ffffff',
    fontFamily: 'Assistant, Heebo, system-ui',
    logoUrl: null,
  })

  const toggleAccount = (id) => {
    setConnectedAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, connected: !acc.connected } : acc))
    )
  }

  return (
    <div className="page-settings">
      <PageHeader title="הגדרות" subtitle="סוכנות, חשבונות וצוות" />

      {/* Agency Profile */}
      <section className="settings-section">
        <h2 className="section-title">פרופיל סוכנות</h2>
        <div className="settings-form">
          <div className="form-group">
            <label htmlFor="agencyName">שם סוכנות</label>
            <input
              id="agencyName"
              type="text"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              className="form-input"
              placeholder="שם הסוכנות"
            />
          </div>
          <div className="form-group">
            <label htmlFor="agencyEmail">דוא״ל</label>
            <input
              id="agencyEmail"
              type="email"
              value={agencyEmail}
              onChange={(e) => setAgencyEmail(e.target.value)}
              className="form-input"
              placeholder="דוא״ל"
            />
          </div>
          <div className="form-group">
            <label htmlFor="agencyPhone">טלפון</label>
            <input
              id="agencyPhone"
              type="tel"
              value={agencyPhone}
              onChange={(e) => setAgencyPhone(e.target.value)}
              className="form-input"
              placeholder="מספר טלפון"
            />
          </div>
          <button className="btn-primary">שמור שינויים</button>
        </div>
      </section>

      {/* Connected Accounts */}
      <section className="settings-section">
        <h2 className="section-title">חשבונות מחוברים</h2>
        <div className="accounts-grid">
          {connectedAccounts.map((acc) => (
            <div key={acc.id} className="account-card">
              <div className="account-header">
                <div>
                  <div className="account-platform">{acc.platform}</div>
                  <div className="account-handle">{acc.handle}</div>
                </div>
                <button
                  className={`toggle-btn ${acc.connected ? 'connected' : ''}`}
                  onClick={() => toggleAccount(acc.id)}
                >
                  {acc.connected ? 'מחובר' : 'חבר'}
                </button>
              </div>
              <div className={`connection-status ${acc.connected ? 'connected' : 'disconnected'}`}>
                {acc.connected ? '✓ מחובר' : '○ לא מחובר'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Members */}
      <section className="settings-section">
        <h2 className="section-title">חברי צוות</h2>
        <div className="team-list">
          {teamMembers.map((member) => (
            <div key={member.id} className="team-member-card">
              <div className="member-avatar">{member.name.charAt(0)}</div>
              <div className="member-info">
                <div className="member-name">{member.name}</div>
                <div className="member-email">{member.email}</div>
              </div>
              <div className="member-role">{member.role}</div>
              <div className="member-actions">
                <button className="btn-icon">⋯</button>
              </div>
            </div>
          ))}
        </div>
        <button className="btn-secondary">הוסף חבר צוות</button>
      </section>

      {/* Brand Kit */}
      <section className="settings-section">
        <h2 className="section-title">ברנד קיט</h2>
        <div className="brand-kit">
          <div className="brand-item">
            <label>צבע ראשי</label>
            <div className="color-preview" style={{ backgroundColor: brandKit.primaryColor }}>
              {brandKit.primaryColor}
            </div>
          </div>
          <div className="brand-item">
            <label>צבע משני</label>
            <div className="color-preview" style={{ backgroundColor: brandKit.accentColor, color: '#000' }}>
              {brandKit.accentColor}
            </div>
          </div>
          <div className="brand-item">
            <label>משפחת גופנים</label>
            <div className="font-preview" style={{ fontFamily: brandKit.fontFamily }}>
              {brandKit.fontFamily}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
