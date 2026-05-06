import React, { forwardRef } from 'react'

/**
 * MyContextMenu Component
 *
 * A high-fidelity dropdown menu component following Figma design specifications.
 * - Width: 179px
 * - Border Radius: 8px (outer), 6px (inner content)
 * - Item Height: 38px (36px content + 2px padding)
 * - Shadows: Complex multi-layer drop shadow
 *
 * @param {Array<Array<Object>>} menuButtonGroups - Array of groups, where each group is an array of menu item objects.
 *    Each object contains { icon, label, onClick, disabled }.
 * @param {string} className - Optional container styling.
 */
const MyContextMenu = forwardRef(({ menuButtonGroups = [], className = '' }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col bg-white border border-gray-200 rounded-lg shadow-[0_2px_2px_-1px_rgba(10,13,18,0.04),0_4px_6px_-2px_rgba(10,13,18,0.03),0_12px_16px_-4px_rgba(10,13,18,0.08)] ${className}`}
    style={{ width: 179 }}
  >
    <div className="flex flex-col py-1">
      {menuButtonGroups.map((group, groupIndex) => (
        <React.Fragment key={groupIndex}>
          {groupIndex > 0 && <hr className="mx-0 my-1 border-gray-100" />}
          <div className="flex flex-col px-[6px]">
            {group.map((item, itemIndex) => (
              <button
                key={itemIndex}
                type="button"
                onClick={(e) => {
                  if (item.onClick) item.onClick(e)
                }}
                disabled={item.disabled}
                className="group flex h-9.5 w-full items-center justify-center py-0.25 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex w-full h-[36px] items-center gap-2 rounded-md px-[10px] py-2 transition-colors hover:bg-gray-50 group-active:bg-gray-100">
                  {item.icon && (
                    <div
                      className="flex h-5 w-4 shrink-0 items-center justify-center"
                      style={{ color: item.color || '#414651' }}
                    >
                      <div className="h-4 w-4">
                        {React.cloneElement(item.icon, {
                          className: `${item.icon.props.className || ''} size-4`.trim(),
                          strokeWidth: 2,
                        })}
                      </div>
                    </div>
                  )}
                  <div className="flex-1 overflow-hidden">
                    {typeof item.label === 'string' ? (
                      <p
                        className="text-sm font-semibold truncate text-left leading-5"
                        style={{ color: item.color || '#414651' }}
                      >
                        {item.label}
                      </p>
                    ) : (
                      item.label
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  </div>
))

export default MyContextMenu


