// Selectors for the new GET /v1/workforce/:id response shape.
// All sections live at the top level of `data` (no more `credit_report` wrapper).
// Each selector returns `null` when the source field is missing so consumers
// can decide whether to render the demo-data fallback.

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// "YYYY-MM" → "MMM YYYY". Returns the raw string when it can't parse.
export function formatMonthLabel(ym) {
  if (!ym) return ''
  const [y, m] = String(ym).split('-')
  const idx = Number(m) - 1
  if (!y || Number.isNaN(idx) || idx < 0 || idx > 11) return String(ym)
  return `${MONTH_LABELS[idx]} ${y}`
}

// "YYYY-MM" → sortable integer (year*12 + month). 0 when unparseable.
export function parseMonthKey(ym) {
  if (!ym) return 0
  const [y, m] = String(ym).split('-')
  const yi = Number(y)
  const mi = Number(m)
  if (!Number.isFinite(yi) || !Number.isFinite(mi)) return 0
  return yi * 12 + (mi - 1)
}

// MyChip color from AI level. `null` falls through to "modern" + dash label.
export function levelToBadge(level) {
  switch (String(level || '').toLowerCase()) {
    case 'low':
      return { badge: 'Low', badgeColor: 'success' }
    case 'medium':
      return { badge: 'Medium', badgeColor: 'warning' }
    case 'high':
      return { badge: 'High', badgeColor: 'error' }
    case 'critical':
      return { badge: 'Critical', badgeColor: 'error' }
    default:
      return { badge: '—', badgeColor: 'modern' }
  }
}

// True when the response carries any of the new top-level sections so the
// detail page is worth rendering. Sections that are still legacy (bare-number
// risk_background_signals, single-row credit_composition, or a credit_utilization
// without level/headline) each handle their own demo fallback at the
// component layer; we only block render when the snapshot is essentially
// empty (no overview, no summary, no composition).
export function isNewReportShape(detail) {
  if (!detail || typeof detail !== 'object') return false
  if (detail.overview && (detail.overview.key_takeaway || detail.overview.risk_assessment_indicators)) return true
  if (detail.credit_summary) return true
  if (detail.credit_overview) return true
  if (Array.isArray(detail.negative_events) && detail.negative_events.length) return true
  return false
}

// True for the strict-new shape where every section already matches the new
// contract (used by section components that need to choose between API value
// and the demo fallback for a single sub-field).
export function hasNewRiskSignalShape(detail) {
  const sample = detail?.risk_background_signals?.phone_numbers
  return Boolean(sample && typeof sample === 'object' && 'count' in sample)
}

export function hasNewCreditCompositionShape(detail) {
  const first = detail?.credit_overview?.credit_composition?.[0]
  return Boolean(first && 'key' in first)
}

export function hasNewCreditUtilizationShape(detail) {
  const u = detail?.credit_overview?.credit_utilization
  return Boolean(u && ('level' in u || 'headline' in u))
}

// ─── Section selectors ─────────────────────────────────────────────────────

export function selectOverview(detail) {
  if (!detail?.overview) return null
  return {
    key_takeaway: detail.overview.key_takeaway ?? null,
    risk_assessment_indicators: detail.overview.risk_assessment_indicators ?? null,
  }
}

export function selectRiskBackgroundSignals(detail) {
  return detail?.risk_background_signals ?? null
}

export function selectCreditSummary(detail) {
  return detail?.credit_summary ?? null
}

export function selectCreditOverview(detail) {
  return detail?.credit_overview ?? null
}

export function selectLoanCategory(detail) {
  return detail?.loan_category ?? null
}

export function selectNegativeEvents(detail) {
  return Array.isArray(detail?.negative_events) ? detail.negative_events : null
}

// Personal-information mode shape: { general_information, attachments, activity }
export function selectPersonal(detail) {
  if (!detail?.general_information) return null
  return {
    general_information: detail.general_information,
    attachments: Array.isArray(detail.attachments) ? detail.attachments : [],
    activity: Array.isArray(detail.activity) ? detail.activity : [],
  }
}
