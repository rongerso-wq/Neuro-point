import '../../pages/pages.css'

function initials(name = '') {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?'
}

/**
 * Instagram-style mock frame.
 * Props:
 *   post   — { copy, cta, type }
 *   client — { name, handle }
 */
export default function PostPreview({ post, client }) {
  const handle = client?.handle ?? '@handle'
  const clientName = client?.name ?? 'לקוח'

  return (
    <div className="ig-frame">
      {/* Header */}
      <div className="ig-header">
        <div className="ig-avatar">{initials(clientName)}</div>
        <div className="ig-header-info">
          <div className="ig-username">{handle}</div>
          <div className="ig-sublabel">ספונסר</div>
        </div>
        <span className="ig-more">•••</span>
      </div>

      {/* Image placeholder */}
      <div className="ig-image">
        <span>תמונה</span>
      </div>

      {/* Actions */}
      <div className="ig-actions">
        <div className="ig-action-group">
          <button className="ig-btn" aria-label="לייק">♡</button>
          <button className="ig-btn" aria-label="תגובה">💬</button>
          <button className="ig-btn" aria-label="שתף">↗</button>
        </div>
        <button className="ig-btn" aria-label="שמור">🔖</button>
      </div>

      {/* Likes */}
      <div className="ig-likes">142 לייקים</div>

      {/* Caption */}
      <div className="ig-caption">
        <span className="ig-caption-user">{handle} </span>
        {post?.copy ?? ''}
      </div>

      {/* CTA */}
      {post?.cta && (
        <div className="ig-cta-line">{post.cta} ←</div>
      )}

      {/* Timestamp */}
      <div className="ig-time">לפני שעה</div>
    </div>
  )
}
