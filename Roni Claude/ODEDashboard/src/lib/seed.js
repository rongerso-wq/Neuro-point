/* ============================================================
   Seed data — realistic Hebrew mock dataset for Oded Creative.
   Mirrors the agency's actual client mix: tech + restaurants.
   ============================================================ */

const now = Date.now()
const days = (n) => now + n * 24 * 60 * 60 * 1000

export const CLIENTS = [
  {
    id: 'cl_nimbus',
    name: 'Nimbus Cloud',
    industry: 'tech',
    industryLabel: 'B2B SaaS · ענן',
    handle: '@nimbus.cloud',
    cadencePerWeek: 3,
    brandVoice: ['מקצועי', 'בטוח', 'נקי'],
    palette: ['#0a0a0a', '#ffffff', '#6b7280'],
    audience: 'מנהלי IT, CTO, ראשי DevOps',
    notes: 'הימנע מ"באזז" שיווקי. עובדה > הבטחה.',
  },
  {
    id: 'cl_mezza',
    name: 'Mezza & Co',
    industry: 'restaurant',
    industryLabel: 'מסעדת שף · ים תיכוני',
    handle: '@mezza.tlv',
    cadencePerWeek: 4,
    brandVoice: ['חם', 'קולינרי', 'אישי'],
    palette: ['#0a0a0a', '#ffffff', '#d4d4d6'],
    audience: 'גילאי 25-45, חובבי אוכל בתל אביב',
    notes: 'תמונות מצלמת אוכל בלבד — אותנטי, לא מבוים.',
  },
  {
    id: 'cl_helios',
    name: 'Helios Labs',
    industry: 'tech',
    industryLabel: 'AI · Developer Tools',
    handle: '@helioslabs',
    cadencePerWeek: 3,
    brandVoice: ['חדשני', 'טכני', 'תמציתי'],
    palette: ['#0a0a0a', '#ffffff', '#9ca3af'],
    audience: 'מפתחים, חוקרי ML, סטארטאפיסטים',
    notes: 'CTA תמיד לדוקומנטציה או דמו, לא ל"דברו איתנו".',
  },
  {
    id: 'cl_olivia',
    name: 'Olivia Bistro',
    industry: 'restaurant',
    industryLabel: 'ביסטרו אירופאי',
    handle: '@olivia.bistro',
    cadencePerWeek: 4,
    brandVoice: ['אלגנטי', 'רומנטי', 'נינוח'],
    palette: ['#0a0a0a', '#ffffff', '#e6e6e8'],
    audience: 'זוגות, חגיגות, גילאי 30-55',
    notes: 'תמיד להזכיר תפריט עונתי. נמנעים מהנחות.',
  },
  {
    id: 'cl_north',
    name: 'NorthBeam',
    industry: 'tech',
    industryLabel: 'Cybersecurity · B2B',
    handle: '@northbeam.sec',
    cadencePerWeek: 2,
    brandVoice: ['סמכותי', 'מדוד', 'אמין'],
    palette: ['#0a0a0a', '#ffffff', '#6b7280'],
    audience: 'CISO, מנהלי אבטחת מידע, רגולטורים',
    notes: 'אסור הגזמות. כל טענה צריכה מקור.',
  },
]

export const POSTS = [
  {
    id: 'p_001', clientId: 'cl_mezza', type: 'reel', status: 'pending',
    title: 'הוצאת מנת היום מהתנור',
    copy: 'שלוש דקות, חצי קילו זנגוויל טרי וריח שלא נגמר. מנת היום שלנו מחכה.',
    cta: 'הזמינו שולחן', scheduledAt: days(1), createdAt: days(-1),
  },
  {
    id: 'p_002', clientId: 'cl_nimbus', type: 'feed', status: 'approved',
    title: 'השקה: ניטור Multi-Region',
    copy: 'תצפית מאוחדת על שלוש יבשות, בהשהיה של מתחת לשנייה.',
    cta: 'קראו במדריך', scheduledAt: days(2), createdAt: days(-2),
  },
  {
    id: 'p_003', clientId: 'cl_helios', type: 'feed', status: 'pending',
    title: 'Inference Latency Benchmark',
    copy: 'הרצנו 12 מודלים על אותו GPU. הנה מה שגילינו על הזיכרון.',
    cta: 'לקראת הדמו', scheduledAt: days(3), createdAt: days(-1),
  },
  {
    id: 'p_004', clientId: 'cl_olivia', type: 'story', status: 'scheduled',
    title: 'סטורי ערב — תפריט הסתיו',
    copy: 'פטריות יער, ארטישוק צלוי, יין לבן מהגליל.',
    cta: 'תפריט מלא בביו', scheduledAt: days(0), createdAt: days(-1),
  },
  {
    id: 'p_005', clientId: 'cl_north', type: 'feed', status: 'inEdit',
    title: 'דוח רבעוני — נוף האיומים',
    copy: 'עלייה של 38% בפישינג מתוחכם. הסעיפים שצריך לעדכן בנהלים.',
    cta: 'הורידו את הדוח', scheduledAt: days(5), createdAt: days(-3),
  },
  {
    id: 'p_006', clientId: 'cl_mezza', type: 'carousel', status: 'published',
    title: 'מנות חדשות בתפריט',
    copy: 'חמש מנות. שבוע של פיתוח. שף יוסי מספר על כל אחת.',
    cta: 'לתפריט המלא', scheduledAt: days(-2), createdAt: days(-5),
  },
]

export const CAMPAIGNS = [
  {
    id: 'cm_01', clientId: 'cl_mezza', name: 'הזמנות שישי',
    objective: 'reservations', status: 'active',
    budget: 1800, spend: 1240, ctr: 3.4, cpc: 1.2, roas: 4.7,
  },
  {
    id: 'cm_02', clientId: 'cl_nimbus', name: 'דמו Q2',
    objective: 'leads', status: 'active',
    budget: 6500, spend: 3200, ctr: 2.1, cpc: 4.8, roas: 6.1,
  },
  {
    id: 'cm_03', clientId: 'cl_helios', name: 'הורדות SDK',
    objective: 'installs', status: 'paused',
    budget: 4200, spend: 4200, ctr: 1.8, cpc: 2.7, roas: 3.2,
  },
]

export const ACTIVITY = [
  { id: 'a1', at: days(-0.1), text: 'אושר פוסט עבור Mezza & Co' },
  { id: 'a2', at: days(-0.3), text: 'נוצר וריאנט חדש עבור Nimbus Cloud' },
  { id: 'a3', at: days(-0.7), text: 'קמפיין "הזמנות שישי" עבר את 1,000 ש"ח' },
  { id: 'a4', at: days(-1.0), text: 'דוח שבועי נשלח ל־Helios Labs' },
]

export const TEAM_MEMBERS = [
  {
    id: 'user-owner',
    name: 'Owner/Agency',
    role: 'owner',
    email: 'owner@agency.example',
    initials: 'AG',
    joinedAt: days(-60),
    status: 'active',
  },
  {
    id: 'user-editor-1',
    name: 'Sarah Chen',
    role: 'editor',
    email: 'sarah@agency.example',
    initials: 'SC',
    joinedAt: days(-45),
    status: 'active',
  },
  {
    id: 'user-editor-2',
    name: 'Yossi Levi',
    role: 'editor',
    email: 'yossi@agency.example',
    initials: 'YL',
    joinedAt: days(-20),
    status: 'active',
  },
  {
    id: 'user-viewer-1',
    name: 'David Marketing',
    role: 'viewer',
    email: 'david@agency.example',
    initials: 'DM',
    joinedAt: days(-10),
    status: 'active',
  },
]

export const SEED = {
  clients: CLIENTS,
  posts: POSTS,
  campaigns: CAMPAIGNS,
  activity: ACTIVITY,
  teamMembers: TEAM_MEMBERS,
  selectedClientId: null, // null = "all clients"
}
