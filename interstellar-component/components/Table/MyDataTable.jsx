import React, { useEffect, useMemo, useState } from 'react'
import SimpleBar from 'simplebar-react'
import { Menu } from '@mui/material'
// Keep other imports like icons, $, etc.
import $ from 'jquery'
import MyPagination from '../Pagination/MyPagination'
import MyDataNotFound from '../NotFound/MyDataNotFound'
import MyLoadingData from '../Loading/MyLoadingData'
import MyMenuItem from './MyMenuItem'

function MyDataTable({
  children,
  values = {},
  paginator = false,
  footerColumnGroup,
  headerColumnGroup,
  onChangePagination,
  selectionMode,
  onSelectionChange,
  onUnselectChange,
  onDeleteAll,
  menuItems = [],
  maxWidthMenu = 240,
  onClick, // Original onClick prop from parent (e.g., for opening sliders)
  onFocusRow, // OPTIONAL: Prop to enable row highlighting and pass the ID
  rowKeyField = 'id', // Field to use as the unique key for rows
  cursorPointer = false, // Automatically set based on onClick or onFocusRow if not provided
  highlightColor = 'bg-gray/100', // Allow customizing highlight color

  currentSortFieldFromParams,
  currentSortOrderFromParams,
}) {
  // --- Determine if Highlighting Feature is Enabled ---
  const isHighlightingEnabled = typeof onFocusRow === 'function'

  // --- State ---
  const style = {
    /* ... style object ... */
  } // Keep your style object
  const [anchorPosition, setAnchorPosition] = useState({ top: 0, left: 0 })
  const [isOpen, setIsOpen] = useState(false)
  const [contextMenuValue, setContextMenuValue] = useState(null)
  const [idToBulkDelete, setIdToBulkDelete] = useState([])
  const [isExpand, setIsExpand] = useState(false)
  const [isSearchData, setIsSearchData] = useState(false)

  // --- Focused Row State (Only used if highlighting is enabled) ---
  // We still declare the state, but its update/read logic is conditional
  const [focusedRowId, setFocusedRowId] = useState(null)

  // --- Determine if cursor should be pointer ---
  // If cursorPointer prop isn't explicitly set, make it pointer if either onClick or onFocusRow is provided
  const actualCursorPointer =
    cursorPointer === undefined
      ? !!onClick || isHighlightingEnabled
      : cursorPointer

  // --- Event Handlers (Keep existing handlers like handleContextMenu, etc.) ---
  const onExpand = () => setIsExpand(!isExpand)

  const handleContextMenu = (event, value) => {
    // Keep your existing context menu logic
    if (!selectionMode || !(values.data ?? []).some((e) => e.checked)) {
      return
    }
    event.preventDefault()
    setAnchorPosition({ top: event.clientY, left: event.clientX })
    setContextMenuValue(value)
    setIsOpen(true)
  }

  const handleCloseMenu = () => {
    setIsOpen(false)
    setTimeout(() => setContextMenuValue(null), 200)
  }

  const onChange = (checked, value) => {
    // Keep your existing checkbox logic (using rowKeyField)
    let isCheckedAll = true
    const updatedList = (values.data ?? []).map((item) => {
      if (item[rowKeyField] === value[rowKeyField]) {
        item.checked = checked
      }
      if (!item.checked) isCheckedAll = false
      return item
    })
    const checkedIds = updatedList
      .filter((e) => e.checked)
      .map((e) => e[rowKeyField])
    setIdToBulkDelete(checkedIds)
    onSelectionChange?.({
      ...values,
      data: updatedList,
      checkedAll: isCheckedAll,
    })
    handleCloseMenu()
  }

  const onChangeAll = (checked) => {
    // Keep your existing select all logic (using rowKeyField)
    const updatedList = (values.data ?? []).map((item) => ({
      ...item,
      checked,
    }))
    const checkedIds = checked
      ? updatedList.map((item) => item[rowKeyField])
      : []
    setIdToBulkDelete(checkedIds)
    onSelectionChange?.({ ...values, data: updatedList, checkedAll: checked })
    handleCloseMenu()
  }

  const onUnselectAll = () => {
    // Keep your existing unselect all logic
    const updatedList = (values.data ?? []).map((item) => ({
      ...item,
      checked: false,
    }))
    setIdToBulkDelete([])
    onSelectionChange?.({ ...values, data: updatedList, checkedAll: false })
    onUnselectChange?.()
    handleCloseMenu() // Close context menu if open
  }

  const handleBulkDelete = (idsToDelete) => {
    // Keep your existing bulk delete logic
    onUnselectAll() // Ensure everything is unselected visually first
    onDeleteAll?.(idsToDelete)
  }

  // --- Effects ---
  // Effect for search state (Keep as is)
  useEffect(() => {
    const input = $('#input-search')
    if (input.length) {
      setIsSearchData(input.val().length > 0)
    } else {
      setIsSearchData(false)
    }
  }, [values]) // Re-check when values change

  // Effect to reset focus ONLY if highlighting is enabled and data changes
  useEffect(() => {
    if (isHighlightingEnabled) {
      // Reset focus if the data array reference changes or highlighting is disabled/enabled
      setFocusedRowId(null)
    }
    // No cleanup function needed here as we're just setting state
  }, [values.data, isHighlightingEnabled]) // Depend on data and the feature flag

  const isColumnVisible = (child) =>
    child &&
    (child.props.headerBodyExpand ||
      !child.props.isExpandChildren ||
      (isExpand && child.props.isExpandChildren))

  const colGroup = useMemo(
    () =>
      React.Children.map(children, (child) => {
        if (!isColumnVisible(child)) return null
        const w = child.props.width
        const style =
          w !== undefined ? { width: typeof w === 'number' ? `${w}px` : w } : {} // auto width if none supplied
        return <col style={style} />
      }),
    [children, isExpand]
  )

  // --- Render Logic ---
  return (
    <>
      {values && !values.loading ? (
        <div className="relative flex flex-1 min-h-0 flex-col">
          <div className="min-w-full flex-1 min-h-0 overflow-auto ">
            <table className="table w-full border-separate border-spacing-0">
              <colGroup>{colGroup}</colGroup>
              {/* --- THEAD (sticky applied per <th> in MyColumn) --- */}
              <thead className="p-0">
                {headerColumnGroup &&
                  React.cloneElement(headerColumnGroup, { tag: 'th' })}
                <tr className="hover:bg-gray-light/25">
                  {children &&
                    React.Children.map(
                      children,
                      (child, index) =>
                        child &&
                        (child.props.headerBodyExpand ||
                          !child.props.isExpandChildren ||
                          (isExpand && child.props.isExpandChildren)) &&
                        React.cloneElement(child, {
                          tag: 'th',
                          values,
                          selectionMode,
                          onChangeAll,
                          index,
                          key: `header-${child.props.field || index}`,
                          onExpand,
                          isExpand,
                          currentGlobalSortField: currentSortFieldFromParams,
                          currentGlobalSortOrder: currentSortOrderFromParams,
                        })
                    )}
                </tr>
              </thead>
              {/* --- TBODY --- */}
              <tbody>
                {children &&
                  values &&
                  (values?.data ?? []).map((value, i) => {
                    const currentId = value?.[rowKeyField]
                    // --- Calculate focus state ONLY if highlighting is enabled ---
                    const isFocused =
                      isHighlightingEnabled &&
                      currentId !== null &&
                      currentId !== undefined &&
                      currentId === focusedRowId

                    return (
                      <tr
                        key={currentId ?? `row-${i}`}
                        onContextMenu={(e) => handleContextMenu(e, value)}
                        onClick={(e) => {
                          if ($(e.target).closest('.input-checkbox').length)
                            return

                          // --- Handle Highlighting and Focus Callback (Conditional) ---
                          if (isHighlightingEnabled) {
                            setFocusedRowId(currentId) // Update internal state for highlight
                            onFocusRow(currentId) // Call the callback provided by parent
                          }

                          // --- Always call the original onClick if provided ---
                          onClick?.(value)
                        }}
                        className={` ${actualCursorPointer ? 'hover:cursor-pointer' : 'cursor-default'} hover:bg-gray-light/50 ${isFocused ? highlightColor : ''} transition-colors duration-150 ease-in-out`}
                      >
                        {/* --- Render Table Cells (TDs) (Keep as is) --- */}
                        {React.Children.map(
                          children,
                          (child, index) =>
                            child &&
                            (child.props.headerBodyExpand ||
                              !child.props.isExpandChildren ||
                              (isExpand && child.props.isExpandChildren)) &&
                            React.cloneElement(child, {
                              tag: 'td',
                              values,
                              value,
                              selectionMode,
                              onChange,
                              index,
                              i,
                              key: `cell-${currentId ?? i}-${child.props.field || index}`,
                            })
                        )}
                      </tr>
                    )
                  })}
                {/* --- Footer Row Group (Keep as is) --- */}
                {footerColumnGroup &&
                  React.cloneElement(footerColumnGroup, { tag: 'td' })}
              </tbody>
            </table>
          </div>

          {/* --- Context Menu (Logic mostly unchanged, ensure it uses idToBulkDelete correctly) --- */}
          {isOpen &&
            contextMenuValue && ( // Check isOpen and contextMenuValue
              <Menu
                anchorReference="anchorPosition"
                anchorPosition={anchorPosition}
                sx={style}
                open={isOpen}
                autoFocus={false}
                onClose={handleCloseMenu}
              >
                <div
                  className="flex h-max flex-col gap-1 py-1"
                  style={{ width: `${maxWidthMenu}px` }}
                >
                  {/* Map through menuItems */}
                  {menuItems &&
                    menuItems.length > 0 &&
                    React.Children.map(menuItems, (child, index) => {
                      if (!child) return null
                      let isShow = true
                      if (child.props.statusShow && contextMenuValue) {
                        isShow = child.props.statusShow(contextMenuValue)
                      }
                      if (isShow) {
                        return (
                          <React.Fragment key={`menu-item-${index}`}>
                            {React.cloneElement(child, {
                              value: contextMenuValue, // Data of the right-clicked row
                              selectedIds: idToBulkDelete, // Array of IDs of all checked rows
                              handleClose: handleCloseMenu,
                              onClick: () => {
                                // Default assumes onClick acts on the selected IDs
                                child.props.onClick(idToBulkDelete)
                                handleCloseMenu()
                              },
                            })}
                            <hr className="border-gray-light/200" />
                          </React.Fragment>
                        )
                      }
                      return null
                    })}

                  {/* Actions for selected items (only if selectionMode is enabled and items are checked) */}
                  {selectionMode && idToBulkDelete.length > 0 && (
                    <>
                      <MyMenuItem
                        onClick={onUnselectAll}
                        handleClose={handleCloseMenu}
                      >
                        <p className="text-sm-medium text-gray-light/700">
                          Unselect all ({idToBulkDelete.length})
                        </p>
                      </MyMenuItem>
                      {onDeleteAll && <hr className="border-gray-light/200" />}
                      {onDeleteAll && (
                        <MyMenuItem
                          onClick={() => handleBulkDelete(idToBulkDelete)}
                          handleClose={handleCloseMenu}
                        >
                          <p className="text-sm-medium text-error/600">
                            Delete selected ({idToBulkDelete.length})
                          </p>
                        </MyMenuItem>
                      )}
                    </>
                  )}
                </div>
              </Menu>
            )}

          {/* --- Pagination and Not Found/Loading (Keep as is) --- */}
          {paginator &&
            !(
              values?.meta?.next_page == null &&
              values?.meta?.current_page === 1
            ) && (
              <MyPagination meta={values?.meta} onChange={onChangePagination} />
            )}

          {/* Uncomment if you want to show "No Data Found" message */}
          {!values.loading &&
            isSearchData &&
            (values?.data ?? []).length === 0 && (
              <div className="my-12 flex flex-1 justify-center py-10">
                <MyDataNotFound isSearch />
              </div>
            )}
          {/* {!values.loading &&
            !isSearchData &&
            (values?.data ?? []).length === 0 && (
              <div className="my-12 flex flex-1 justify-center py-10">
                <MyDataNotFound isSearch={false} />
              </div>
            )} */}
        </div>
      ) : (
        // --- Loading State ---
        <div className="flex h-[605px] w-full items-center justify-center">
          <MyLoadingData />
        </div>
      )}
    </>
  )
}

export default MyDataTable
