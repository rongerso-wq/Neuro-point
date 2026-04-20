import { useState, useCallback } from 'react'
import { CheckCircle, XCircle, Edit3, Clock, X } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader.jsx'
import PostPreview from '../components/preview/PostPreview.jsx'
import { useAppState } from '../context/ClientContext.jsx'
import './pages.css'

/* ------------------------------------------------------------------ */
/*  Config                                                              */
/* ------------------------------------------------------------------ */

const COLUMNS = [
  { id: 'pending',  label: 'ממתין לאישור', dotClass: 'dot--warn',    actions: ['approve', 'edit', 'reject'] },
  { id: 'inEdit',   label: 'בעריכה',        dotClass: 'dot--info',    actions: ['approve', 'reject'] },
  { id: 'approved', label: 'מאושר',         dotClass: 'dot--success', actions: ['reject'] },
  { id: 'rejected', label: 'נדחה',          dotClass: 'dot--danger',  actions: ['approve'] },
]

const TYPE_LABELS = {
  feed:     'פיד',
  reel:     'ריל',
  story:    'סטורי',
  carousel: 'קרוסלה',
}

function formatDate(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })
}

/* ------------------------------------------------------------------ */
/*  Post card                                                           */
/* ------------------------------------------------------------------ */

function PostCard({ post, client, onApprove, onEdit, onReject, onPreview }) {
  return (
    <div className="approval-card" onClick={() => onPreview(post)}>
      <div className="approval-card__media">
        <span className="approval-card__media-label">
          {TYPE_LABELS[post.type] ?? post.type}
        </span>
      </div>

      <div className="approval-card__body">
        <div className="approval-card__meta">
          <span className="approval-card__client">{client?.name ?? '—'}</span>
          <span className="pill">{TYPE_LABELS[post.type] ?? post.type}</span>
        </div>
        <div className="approval-card__title">{post.title}</div>
        <div className="approval-card__copy">{post.copy}</div>
        <div className="approval-card__date">
          <Clock size={11} />
          {formatDate(post.scheduledAt)}
        </div>
      </div>

      {/* Actions row — stop propagation so click doesn't open preview */}
      <div
        className="approval-card__actions"
        onClick={(e) => e.stopPropagation()}
      >
        {onApprove && (
          <button
            className="approval-action approval-action--approve"
            onClick={() => onApprove(post.id)}
          >
            <CheckCircle size={12} />
            אשר
          </button>
        )}
        {onEdit && (
          <button
            className="approval-action approval-action--edit"
            onClick={() => onEdit(post.id)}
          >
            <Edit3 size={12} />
            עריכה
          </button>
        )}
        {onReject && (
          <button
            className="approval-action approval-action--reject"
            onClick={() => onReject(post.id)}
          >
            <XCircle size={12} />
            דחה
          </button>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Reject modal                                                        */
/* ------------------------------------------------------------------ */

function RejectModal({ post, client, onClose, onConfirm }) {
  const [reason, setReason] = useState('')

  return (
    <div className="drawer__backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <span className="modal__title">דחיית פוסט</span>
          <button className="drawer__close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal__body">
          <p style={{ fontSize: 'var(--fs-13)', color: 'var(--text-muted)', marginBottom: 'var(--sp-4)' }}>
            <strong>{post.title}</strong> · {client?.name}
          </p>
          <div className="field">
            <label className="field__label">סיבת הדחייה (אופציונלי)</label>
            <textarea
              className="field__textarea"
              style={{ minHeight: 72 }}
              placeholder="הסבר קצר לצוות..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <div className="modal__foot">
          <button className="btn btn-secondary" onClick={onClose}>ביטול</button>
          <button
            className="btn"
            style={{
              background: 'transparent',
              color: 'var(--danger)',
              borderColor: 'var(--danger)',
            }}
            onClick={() => onConfirm(post.id, reason)}
          >
            <XCircle size={14} />
            דחה פוסט
          </button>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Approvals page                                                      */
/* ------------------------------------------------------------------ */

export default function Approvals() {
  const { posts, clients, setState } = useAppState()
  const [rejectTargetId, setRejectTargetId] = useState(null)
  const [previewPost, setPreviewPost] = useState(null)

  const getClient = useCallback((id) => clients.find((c) => c.id === id), [clients])

  // Only show posts in the approval workflow (not published/scheduled)
  const approvalPosts = posts.filter(
    (p) => !['scheduled', 'published'].includes(p.status),
  )

  function movePost(postId, newStatus, extra = {}) {
    setState((prev) => ({
      ...prev,
      posts: prev.posts.map((p) =>
        p.id === postId ? { ...p, status: newStatus, ...extra } : p,
      ),
      activity: [
        {
          id: `a_${Date.now()}`,
          at: Date.now(),
          text: `פוסט ${
            newStatus === 'approved'
              ? 'אושר ✓'
              : newStatus === 'rejected'
              ? 'נדחה'
              : 'נשלח לעריכה'
          }`,
        },
        ...prev.activity.slice(0, 9),
      ],
    }))
  }

  const handleApprove = (id) => movePost(id, 'approved')
  const handleEdit    = (id) => movePost(id, 'inEdit')
  const handleRejectConfirm = (id, reason) => {
    movePost(id, 'rejected', reason ? { rejectReason: reason } : {})
    setRejectTargetId(null)
  }

  const rejectPost = rejectTargetId
    ? approvalPosts.find((p) => p.id === rejectTargetId)
    : null

  const pendingCount = approvalPosts.filter((p) => p.status === 'pending').length

  return (
    <>
      <PageHeader
        eyebrow="זרימת עבודה"
        title="אישורים"
        description={
          pendingCount > 0
            ? `${pendingCount} פוסטים ממתינים לאישורך.`
            : 'כל הפוסטים טופלו.'
        }
      />

      <div className="kanban">
        {COLUMNS.map((col) => {
          const items = approvalPosts.filter((p) => p.status === col.id)
          return (
            <div key={col.id} className="kanban__col">
              <div className="kanban__col-head">
                <span className={`dot ${col.dotClass}`} />
                <span className="kanban__col-title">{col.label}</span>
                <span className="kanban__col-count">{items.length}</span>
              </div>

              <div className="kanban__cards">
                {items.length === 0 && (
                  <div className="kanban__empty">אין פוסטים</div>
                )}
                {items.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    client={getClient(post.clientId)}
                    onPreview={setPreviewPost}
                    onApprove={col.actions.includes('approve') ? handleApprove : null}
                    onEdit={col.actions.includes('edit')    ? handleEdit    : null}
                    onReject={col.actions.includes('reject') ? setRejectTargetId : null}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Reject reason modal */}
      {rejectPost && (
        <RejectModal
          post={rejectPost}
          client={getClient(rejectPost.clientId)}
          onClose={() => setRejectTargetId(null)}
          onConfirm={handleRejectConfirm}
        />
      )}

      {/* Post preview modal */}
      {previewPost && (
        <div className="drawer__backdrop" onClick={() => setPreviewPost(null)}>
          <div
            className="preview-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="preview-modal__head">
              <span style={{ fontSize: 'var(--fs-15)', fontWeight: 'var(--fw-semibold)' }}>
                תצוגה מקדימה
              </span>
              <button className="drawer__close" onClick={() => setPreviewPost(null)}>
                <X size={16} />
              </button>
            </div>
            <PostPreview
              post={previewPost}
              client={getClient(previewPost.clientId)}
            />
          </div>
        </div>
      )}
    </>
  )
}
