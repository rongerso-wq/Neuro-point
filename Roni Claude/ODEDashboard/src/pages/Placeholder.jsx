import { Construction } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader.jsx'

/**
 * Generic placeholder for pages not yet implemented.
 * Shows page header + a polite "coming in next phase" card.
 */
export default function Placeholder({ title, description, eyebrow, phase }) {
  return (
    <>
      <PageHeader title={title} description={description} eyebrow={eyebrow} />
      <div className="placeholder">
        <div className="placeholder__icon">
          <Construction size={22} strokeWidth={1.6} />
        </div>
        <div className="placeholder__title">המסך הזה ייבנה בשלב {phase}</div>
        <div className="placeholder__hint">
          מבנה הניווט והנתונים מוכנים — התוכן יוטמע בשלב הבא.
        </div>
      </div>
    </>
  )
}
