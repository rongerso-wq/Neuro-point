/* ============================================================
   Hebrew strings — single source of truth.
   Lookup by dotted path: t('boot.title')
   ============================================================ */

const STRINGS = {
  app: {
    name: 'ODEDashboard',
    tagline: 'מרכז הבקרה של אוד קריאייטיב',
  },
  boot: {
    title: 'מפעל התוכן והקמפיינים החכם',
    subtitle:
      'יצירה, אישור, תזמון ופרסום אוטומטי — מותאם אישית לכל לקוח, ב־DNA של המותג שלו.',
    phase: 'שלב 1 · תשתית ומערכת עיצוב',
    stats: {
      clients: 'לקוחות פעילים',
      posts: 'פוסטים בתור',
      campaigns: 'קמפיינים פעילים',
    },
  },
  nav: {
    dashboard: 'דשבורד',
    clients: 'לקוחות',
    contentFactory: 'יצירת תוכן',
    approvals: 'אישורים',
    schedule: 'תור פרסום',
    campaigns: 'קמפיינים',
    photoStudio: 'אולפן צילום',
    videoStudio: 'אולפן וידאו',
    reports: 'דוחות',
    settings: 'הגדרות',
  },
  common: {
    search: 'חיפוש',
    save: 'שמירה',
    cancel: 'ביטול',
    approve: 'אישור',
    reject: 'דחייה',
    edit: 'עריכה',
    delete: 'מחיקה',
    publish: 'פרסום',
    schedule: 'תזמון',
    new: 'חדש',
    all: 'הכל',
    today: 'היום',
    week: 'שבוע',
    month: 'חודש',
    loading: 'טוען…',
  },
  status: {
    pending: 'ממתין לאישור',
    inEdit: 'בעריכה',
    approved: 'מאושר',
    rejected: 'נדחה',
    scheduled: 'מתוזמן',
    published: 'פורסם',
    failed: 'נכשל',
  },
}

/** Resolve dotted path; returns the path itself if missing. */
export function t(path) {
  const parts = String(path).split('.')
  let node = STRINGS
  for (const p of parts) {
    if (node == null) return path
    node = node[p]
  }
  return typeof node === 'string' ? node : path
}

export const STRINGS_TREE = STRINGS
