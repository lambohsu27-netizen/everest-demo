import React from 'react'
import PropTypes from 'prop-types'

/** Styles by enrollment_status (and legacy member-status labels). */
const STATUS_STYLES = {
  in_progress: {
    dot: 'bg-warning/500',
    pill:
      'border border-warning/200 bg-warning/50 text-warning/800 ring-1 ring-inset ring-warning/100',
  },
  active: {
    dot: 'bg-success/500',
    pill:
      'border border-success/200 bg-success/50 text-success/800 ring-1 ring-inset ring-success/100',
  },
  completed: {
    dot: 'bg-success/500',
    pill:
      'border border-success/200 bg-success/50 text-success/800 ring-1 ring-inset ring-success/100',
  },
  expired: {
    dot: 'bg-gray-light/400',
    pill:
      'border border-gray-light/200 bg-gray-light/50 text-gray-light/800 ring-1 ring-inset ring-gray-light/100',
  },
  rejected: {
    dot: 'bg-error/500',
    pill: 'border border-error/200 bg-error/50 text-error/800 ring-1 ring-inset ring-error/100',
  },
  'Waiting CLIK approval': {
    dot: 'bg-warning/500',
    pill:
      'border border-warning/200 bg-warning/50 text-warning/800 ring-1 ring-inset ring-warning/100',
  },
  'Document submission': {
    dot: 'bg-gray-light/400',
    pill:
      'border border-gray-light/200 bg-gray-light/50 text-gray-light/800 ring-1 ring-inset ring-gray-light/100',
  },
  Active: {
    dot: 'bg-success/500',
    pill:
      'border border-success/200 bg-success/50 text-success/800 ring-1 ring-inset ring-success/100',
  },
  Rejected: {
    dot: 'bg-error/500',
    pill: 'border border-error/200 bg-error/50 text-error/800 ring-1 ring-inset ring-error/100',
  },
}

const FALLBACK = {
  dot: 'bg-gray-light/400',
  pill: 'border border-gray-light/200 bg-gray-light/50 text-gray-light/700',
}

function normalizeKey(status) {
  if (status == null || status === '') return ''
  return String(status)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
}

export function formatEnrollmentStatusLabel(status) {
  if (status == null || status === '') return '—'
  return String(status)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * Enrollment / member status pill (backend: enrollment_status).
 */
export default function MyMemberStatusChip({ status }) {
  const key = normalizeKey(status)
  const styles = STATUS_STYLES[key] ?? STATUS_STYLES[status] ?? FALLBACK
  const label = formatEnrollmentStatusLabel(status)

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles.pill}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${styles.dot}`} aria-hidden />
      <span className="truncate">{label}</span>
    </span>
  )
}

MyMemberStatusChip.propTypes = {
  status: PropTypes.string,
}

MyMemberStatusChip.defaultProps = {
  status: '',
}
