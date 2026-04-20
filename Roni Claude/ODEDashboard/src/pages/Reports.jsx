import { useMemo } from 'react'
import { useAppState } from '../context/ClientContext.jsx'
import { CLIENTS, POSTS, CAMPAIGNS } from '../lib/seed.js'
import PageHeader from '../components/layout/PageHeader.jsx'
import '../styles/reports.css'

export default function Reports() {
  const { selectedClientId } = useAppState()

  // Get current client (or all clients if null)
  const client = selectedClientId
    ? CLIENTS.find((c) => c.id === selectedClientId)
    : null

  // Filter posts by client (or all)
  const clientPosts = useMemo(() => {
    const posts = selectedClientId
      ? POSTS.filter((p) => p.clientId === selectedClientId)
      : POSTS
    return posts.sort((a, b) => b.createdAt - a.createdAt)
  }, [selectedClientId])

  // Filter campaigns by client (or all)
  const clientCampaigns = useMemo(() => {
    const campaigns = selectedClientId
      ? CAMPAIGNS.filter((c) => c.clientId === selectedClientId)
      : CAMPAIGNS
    return campaigns
  }, [selectedClientId])

  // Mock performance metrics
  const metrics = useMemo(() => {
    const reach = selectedClientId ? 8500 : 28400
    const engagement = selectedClientId ? 340 : 1120
    const followers = selectedClientId ? 4200 : 12800
    const topPost = clientPosts[0]
    const avgRoas =
      clientCampaigns.length > 0
        ? (
            clientCampaigns.reduce((sum, c) => sum + c.roas, 0) /
            clientCampaigns.length
          ).toFixed(1)
        : 0

    return {
      reach,
      engagement,
      engagementRate: ((engagement / reach) * 100).toFixed(1),
      followers,
      followerGrowth: selectedClientId ? '+2.3%' : '+5.1%',
      topPost,
      avgRoas,
    }
  }, [selectedClientId, clientPosts, clientCampaigns])

  // Optimization suggestions
  const suggestions = [
    {
      id: 1,
      title: 'הגבר פוסטים ביום שלישי-רביעי',
      description: 'ההשתתפות עולה ב-28% בימים אלה. שקול הזמנה נוספת.',
      impact: 'ריץ' + (selectedClientId ? ' +340' : ' +1,100'),
      action: 'אישור',
    },
    {
      id: 2,
      title: 'השתמש בדפים מרוסטים יותר',
      description: 'תמונות מקרוב מקבלות 45% יותר שיתוף מאשר תנוחות רחבות.',
      impact: 'מעורבות' + (selectedClientId ? ' +8%' : ' +12%'),
      action: 'בדוק',
    },
    {
      id: 3,
      title: 'הוסף CTA ברורה בתואריך',
      description: 'אותו תוכן עם CTA מעורבות גבוה ב-15% בממוצע.',
      impact: 'קליקים' + (selectedClientId ? ' +45' : ' +150'),
      action: 'בדוק',
    },
  ]

  return (
    <div className="page-reports">
      <PageHeader
        title="דוחות"
        subtitle={client ? `ביצועים: ${client.name}` : 'ביצועים: כל הלקוחות'}
      />

      {/* KPI Section */}
      <section className="reports-section">
        <div className="reports-kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">הגעה</div>
            <div className="kpi-value">{metrics.reach.toLocaleString('he')}</div>
            <div className="kpi-meta">פעילויות השבוע</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">מעורבות</div>
            <div className="kpi-value">{metrics.engagement}</div>
            <div className="kpi-meta">{metrics.engagementRate}% של הגעה</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">עוקבים</div>
            <div className="kpi-value">{metrics.followers.toLocaleString('he')}</div>
            <div className="kpi-meta">{metrics.followerGrowth} השבוע</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">ROAS ממוצע</div>
            <div className="kpi-value">{metrics.avgRoas}x</div>
            <div className="kpi-meta">בקמפיינים פעילים</div>
          </div>
        </div>
      </section>

      {/* Top Performing Post */}
      {metrics.topPost && (
        <section className="reports-section">
          <h2 className="section-title">פוסט מובילה</h2>
          <div className="top-post-card">
            <div className="top-post-content">
              <div className="top-post-title">{metrics.topPost.title}</div>
              <div className="top-post-copy">{metrics.topPost.copy}</div>
              <div className="top-post-meta">
                <span className="post-type">{metrics.topPost.type}</span>
                <span className="post-status">
                  {metrics.topPost.status === 'published'
                    ? 'פורסם'
                    : metrics.topPost.status === 'approved'
                      ? 'אושר'
                      : 'קדום'}
                </span>
              </div>
            </div>
            <div className="top-post-stats">
              <div className="stat">
                <span className="stat-label">הגעה</span>
                <span className="stat-value">
                  {(Math.random() * 5000 + 2000).toFixed(0)}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">מעורבות</span>
                <span className="stat-value">
                  {(Math.random() * 200 + 50).toFixed(0)}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">שיתופים</span>
                <span className="stat-value">
                  {(Math.random() * 80 + 10).toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Optimization Suggestions */}
      <section className="reports-section">
        <h2 className="section-title">הצעות שיפור</h2>
        <div className="suggestions-list">
          {suggestions.map((sugg) => (
            <div key={sugg.id} className="suggestion-card">
              <div className="suggestion-content">
                <div className="suggestion-title">{sugg.title}</div>
                <div className="suggestion-desc">{sugg.description}</div>
              </div>
              <div className="suggestion-action">
                <span className="suggestion-impact">{sugg.impact}</span>
                <button className="btn-suggestion">{sugg.action}</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
