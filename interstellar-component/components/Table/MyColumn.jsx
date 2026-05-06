import React, { useMemo, useState, useEffect } from 'react'
import {
  ChevronDown,
  ChevronSelectorVertical,
  ChevronUp,
} from '@untitled-ui/icons-react'
import MyCheckbox from '../Checkbox/MyCheckbox' // Assuming this path is correct

// Helper function to safely get nested data
const getDataByField = (data, field) => {
  if (!field) return null // Handle null/undefined field
  const fields = field.split('.')
  return fields.reduce(
    (result, f) =>
      result && typeof result === 'object' && f in result ? result[f] : null,
    data
  )
}

/**
 * MyColumn Component
 * Renders a table header (th) or data cell (td) for MyDataTable.
 * Handles sorting logic for single or multiple fields, checkbox rendering,
 * and custom body rendering.
 */
function MyColumn({
  // --- Cell Identification ---
  index, // Column index (0-based)
  i, // Row index (0-based, only for body cells)
  tag, // 'th' or 'td', automatically passed by MyDataTable

  // --- Header Content ---
  header, // Header text (e.g., "Name", "Nama/NIP") - Used for sorting text
  headerBody, // Optional custom JSX for header content (e.g., tooltip)
  headerBodyExpand, // Optional function for expandable header content within headerBody

  // --- Body Content ---
  body, // Function to render custom body cell content: (value, rowIndex) => JSX

  // --- Data & Sorting ---
  field, // Data field(s) key (e.g., "name", "user.name", "name,nip")
  onSort, // Callback for sorting: ({ sort: string|null, order: 'asc'|'desc'|null }) => void

  // --- Data Source & Row Data ---
  values, // The full dataset object from MyDataTable (contains data, meta, etc.)
  value, // The data object for the current row (only for body cells)

  // --- Selection ---
  selectionMode, // 'multiple', 'single', or undefined
  onChange, // Checkbox change handler for individual rows: (checked, rowValue) => void
  onChangeAll, // Checkbox change handler for header: (checked) => void
  hideCheckBoxHeader, // If true, hides the header checkbox even in multiple selection mode

  // --- Styling & Layout ---
  colSpan = 1, // Standard HTML colSpan attribute
  alignment = 'left', // 'left', 'center', 'right' for text alignment
  width, // CSS width for the column
  padding, // Custom padding class (e.g., 'px-4') overrides default
  isArchived, // Flag to potentially hide checkboxes (e.g., if row is archived)

  // --- Expansion (If used with expandable rows/columns) ---
  isExpandChildren, // Flag indicating if this column is part of an expandable group - Not used in this refactor directly
  onExpand, // Callback to toggle expansion state (passed to headerBodyExpand)
  isExpand, // Current expansion state (passed to headerBodyExpand)

  currentGlobalSortField,
  currentGlobalSortOrder,
}) {
  // State to track the local sort cycle for this column
  const [sortState, setSortState] = useState(null) // null | 'asc' | 'desc' | 'field1_asc' | 'field1_desc' | 'field2_asc' | 'field2_desc'

  // Parse the field(s) prop for sorting
  const sortFields = useMemo(() => {
    if (typeof field !== 'string' || !field || !onSort) return [] // Only parse if sortable
    return field
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean)
  }, [field, onSort])

  const hasMultipleSortFields = sortFields.length > 1
  const canSort = onSort && sortFields.length > 0 // Check if sorting is enabled for this column

  // --- NEW useEffect to synchronize internal sortState with global sort ---
  useEffect(() => {
    // If the global sort field is NOT one of the fields this column can sort by,
    // OR if the global sort is cleared (null field or null order),
    // then reset this column's internal sortState.
    if (
      (currentGlobalSortField &&
        !sortFields.includes(currentGlobalSortField)) ||
      currentGlobalSortField === null ||
      currentGlobalSortOrder === null
    ) {
      setSortState(null)
    } else if (
      currentGlobalSortField &&
      sortFields.includes(currentGlobalSortField)
    ) {
      // If the global sort IS for one of this column's fields,
      // set the internal state to match it.
      if (hasMultipleSortFields) {
        if (currentGlobalSortField === sortFields[0]) {
          setSortState(
            currentGlobalSortOrder === 'asc' ? 'field1_asc' : 'field1_desc'
          )
        } else if (currentGlobalSortField === sortFields[1]) {
          setSortState(
            currentGlobalSortOrder === 'asc' ? 'field2_asc' : 'field2_desc'
          )
        }
      } else {
        // Single sort field
        setSortState(currentGlobalSortOrder) // 'asc' or 'desc'
      }
    }
    // Add dependencies: global sort field, global sort order, and this column's sortable fields
  }, [
    currentGlobalSortField,
    currentGlobalSortOrder,
    sortFields,
    hasMultipleSortFields,
  ])

  // Determine the field actively being sorted *by this column's cycle*
  const currentlySortedField = useMemo(() => {
    if (!sortState || !sortFields.length) return null

    if (hasMultipleSortFields) {
      if (sortState === 'field1_asc' || sortState === 'field1_desc')
        return sortFields[0]
      if (sortState === 'field2_asc' || sortState === 'field2_desc')
        return sortFields[1]
    } else {
      // Single field
      if (sortState === 'asc' || sortState === 'desc') return sortFields[0]
    }
    return null // No active sort field according to this column's state
  }, [sortState, sortFields, hasMultipleSortFields])

  // Determine the current sort order ('asc', 'desc', or null)
  const currentSortOrder = useMemo(() => {
    if (!sortState) return null
    if (sortState.endsWith('_asc') || sortState === 'asc') return 'asc'
    if (sortState.endsWith('_desc') || sortState === 'desc') return 'desc'
    return null
  }, [sortState])

  // --- Styling ---
  const getClassAlignment = useMemo(() => {
    switch (alignment) {
      case 'center':
        return 'justify-center text-center'
      case 'right':
        return 'justify-end text-right'
      case 'left':
      default:
        return 'justify-start text-left'
    }
  }, [alignment])

  const isHeader = useMemo(() => tag === 'th', [tag])
  const Tag = isHeader ? 'th' : 'td'

  // --- Event Handlers ---

  // Handles clicks on the header cell to cycle through sort states
  const handleSort = () => {
    // Guard clauses: Only sort if sorting is enabled
    if (!canSort) return

    let nextSortState = null
    let sortPayloadField = null
    let sortPayloadOrder = null

    if (!hasMultipleSortFields) {
      // --- Simple Sort Cycle (Single Field) ---
      const currentField = sortFields[0]
      if (sortState === null) nextSortState = 'asc'
      else if (sortState === 'asc') nextSortState = 'desc'
      else nextSortState = null // 'desc' -> null

      sortPayloadField = nextSortState !== null ? currentField : null
      sortPayloadOrder = nextSortState // 'asc', 'desc', or null
    } else {
      // --- Multi-Field Sort Cycle ---
      const [field1, field2] = sortFields
      switch (sortState) {
        case null:
          nextSortState = 'field1_asc'
          break
        case 'field1_asc':
          nextSortState = 'field1_desc'
          break
        case 'field1_desc':
          nextSortState = 'field2_asc'
          break
        case 'field2_asc':
          nextSortState = 'field2_desc'
          break
        case 'field2_desc':
        default:
          nextSortState = null
          break
      }

      // Determine payload based on the next state
      if (nextSortState === 'field1_asc' || nextSortState === 'field1_desc') {
        sortPayloadField = field1
        sortPayloadOrder = nextSortState.endsWith('_asc') ? 'asc' : 'desc'
      } else if (
        nextSortState === 'field2_asc' ||
        nextSortState === 'field2_desc'
      ) {
        sortPayloadField = field2
        sortPayloadOrder = nextSortState.endsWith('_asc') ? 'asc' : 'desc'
      } else {
        // nextSortState is null
        sortPayloadField = null
        sortPayloadOrder = null
      }
    }

    // Update local state
    setSortState(nextSortState)

    // Call the parent callback
    onSort({
      sort: sortPayloadField,
      order: sortPayloadOrder,
    })
  }

  // --- Icon Rendering ---

  // Renders the appropriate active sort icon (Up or Down arrow)
  const renderActiveSortIcon = (order) => {
    const Icon = order === 'asc' ? ChevronUp : ChevronDown
    return (
      <Icon
        size={16}
        className={'size-4 text-gray-light/600'}
        stroke={'currentColor'}
      />
    )
  }

  // Renders the hover indicator icon (Selector)
  const renderHoverSortIcon = () => (
    <ChevronSelectorVertical
      size={16}
      // Icon is invisible by default, becomes visible when the parent 'group' (th) is hovered
      className={'invisible size-4 text-gray-light/600 group-hover:visible'}
      stroke={'currentColor'}
    />
  )

  // --- Renders the sortable header text (based on `header` prop) ---
  const renderSortableHeaderText = () => {
    if (!header) return null // No header text to render

    const canSplitHeader =
      hasMultipleSortFields &&
      typeof header === 'string' &&
      (header.includes('/') || header.includes('&'))

    const separator = header?.includes('/') ? '/' : '&'
    const headerParts = canSplitHeader
      ? header.split(separator).map((part) => part.trim())
      : [header ?? '']

    // Ensure the number of parts matches the number of sort fields for split logic
    const useSplitLogic =
      canSplitHeader && headerParts.length === sortFields.length

    // --- Render Split Header Parts ---
    if (useSplitLogic) {
      return headerParts.map((part, idx) => {
        const fieldForThisPart = sortFields[idx]
        const isActiveSort = currentlySortedField === fieldForThisPart
        return (
          <React.Fragment key={idx}>
            <div className="flex items-center gap-0.5">
              {' '}
              {/* Container for text + maybe icon */}
              <p className="text-xs-medium whitespace-nowrap text-gray-light/600">
                {part}
              </p>
              {/* Render ACTIVE icon if this specific part is sorted */}
              {isActiveSort && renderActiveSortIcon(currentSortOrder)}
            </div>
            {/* Render Separator */}
            {idx < headerParts.length - 1 && (
              <span className="text-xs-medium px-1 text-gray-light/600">
                {separator}
              </span>
            )}
          </React.Fragment>
        )
      })
    }

    // --- Render Simple Header Text ---
    const fieldForThisPart = sortFields[0] // Only one field
    const isActiveSort = currentlySortedField === fieldForThisPart
    return (
      <div className="flex items-center gap-0.5">
        <p className="text-xs-medium whitespace-nowrap text-gray-light/600">
          {header}
        </p>
        {/* Render ACTIVE icon if this simple header is sorted */}
        {isActiveSort && renderActiveSortIcon(currentSortOrder)}
      </div>
    )
  }

  const resolvedW =
    width !== undefined
      ? typeof width === 'number'
        ? `${width}px`
        : width
      : undefined

  // --- Component Return ---
  return (
    <Tag // Renders <th> or <td>
      colSpan={colSpan}
      width={width}
      // Add sorting click handler ONLY to header cells and if sortable
      onClick={isHeader && canSort ? handleSort : undefined}
      // Add 'group' class to header for hover icon visibility, make cursor pointer if sortable
      className={`${isHeader && canSort ? 'group cursor-pointer' : ''} ${
        padding || 'px-6'
      } py-${isHeader ? 3 : 4} ${isHeader ? 'sticky top-0 z-10 bg-white' : 'border-b border-gray-light/200'}`}
      style={{
        verticalAlign: 'middle',
        ...(isHeader && { boxShadow: 'inset 0 -1px 0 #EAECF0' }),
        ...(resolvedW && {
          width: resolvedW,
          minWidth: resolvedW,
          maxWidth: resolvedW,
        }),
      }}
    >
      {isHeader ? (
        // --- Header Cell (TH) ---
        <div
          className={`flex h-full w-full items-center gap-3 ${getClassAlignment}`} // Apply text alignment class
        >
          {/* Header Checkbox (if applicable) */}
          {index === 0 && // Only for the first column
            selectionMode === 'multiple' &&
            !hideCheckBoxHeader && (
              <div className={`${isArchived === 1 ? 'invisible' : ''}`}>
                {/* Stop propagation to prevent sorting when clicking checkbox */}
                <div onClick={(e) => e.stopPropagation()}>
                  <MyCheckbox
                    checked={values?.checkedAll ?? false} // Use checkedAll from dataset
                    onChangeForm={({ target: { checked } }) => {
                      onChangeAll && onChangeAll(checked) // Trigger parent handler
                    }}
                  />
                </div>
              </div>
            )}

          {/* Main Header Content Area */}
          <div className="flex flex-grow items-center gap-1">
            {/* gap-1 provides space between text and button if both exist */}
            {/* Sortable Text Area (Left Aligned) */}
            {/* This div will contain the header text and its sort icon. It won't use ml-auto. */}
            <div className="flex items-center gap-1">
              {renderSortableHeaderText()}{' '}
              {/* Renders 'header' prop (e.g., "Task aging") */}
              {/* Render HOVER icon only if it's sortable but NOT currently sorted */}
              {canSort && !currentlySortedField && renderHoverSortIcon()}
            </div>
            {/* Expansion Button (from headerBodyExpand) OR Custom Header Body (from headerBody) */}
            {/* This part will be pushed to the right if header text is present. */}
            {headerBodyExpand ? (
              <div className="ml-auto pl-1">
                {/* ml-auto pushes this to the right of the preceding text block */}
                {headerBodyExpand(onExpand, isExpand)}
              </div>
            ) : headerBody ? (
              <div className="justify-start">
                {/* ml-auto pushes this to the right */}
                {headerBody}
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        // --- Body Cell (TD) ---
        <div
          // Use items-center for body align to match header vertical align
          className={`flex h-full w-full items-center gap-3 ${getClassAlignment}`}
        >
          {/* Row Checkbox (if applicable) */}
          {index === 0 && // Only for the first column
            (selectionMode === 'multiple' || selectionMode === 'single') && (
              <div className={`${isArchived === 1 ? 'invisible' : ''}`}>
                {/* Stop propagation to prevent row onClick handler (if any) */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="input-checkbox" // Added class for potential targeting
                >
                  <MyCheckbox
                    checked={value?.checked ?? false} // Use checked status from row data
                    onChangeForm={({ target: { checked } }) => {
                      // Trigger parent handler with checked status and row data
                      onChange && onChange(checked, value)
                    }}
                  />
                </div>
              </div>
            )}

          {/* Body Content */}
          <div className="flex-grow">
            {/* Allow body content to take available space */}
            {body ? (
              // Render custom body content if 'body' function is provided
              body(value, i) // Pass row data and index to the function
            ) : (
              // Default rendering: display data based on the 'field' prop
              <p className="text-sm-regular whitespace-nowrap text-gray-light/600">
                {/* Use helper to get data, defaults to first field if multiple provided */}
                {field &&
                  getDataByField(
                    value,
                    sortFields[0] || field.split(',')[0].trim() // Fallback if sortFields is empty but field exists
                  )}
              </p>
            )}
          </div>
        </div>
      )}
    </Tag>
  )
}

export default MyColumn
