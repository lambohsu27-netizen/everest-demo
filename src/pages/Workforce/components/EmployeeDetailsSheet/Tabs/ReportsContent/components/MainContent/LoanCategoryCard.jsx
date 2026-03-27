import React from 'react'
import { MyChip, MyFeaturedIconV2 } from '@interstellar-component'
import MyButton from '@interstellar-component/components/Button/MyButton'

export default function LoanCategoryCard({
  kolBadge,
  title,
  accountCount,
  amount,
  color,
  icon,
  onViewDetails,
}) {
  const getKolColor = (badge) => {
    if (badge === 'KOL 5') return 'error'
    if (badge === 'KOL 4' || badge === 'KOL 3') return 'warning'
    return 'primary'
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between overflow-hidden">
      {/* Content area */}
      <div className="p-4 flex flex-col gap-3">
        {/* Header: Icon and Badge */}
        <div className="flex items-center justify-between">
          <MyFeaturedIconV2 icon={icon} size="sm" color={color} /> 

          <MyChip
            label={kolBadge}
            color={getKolColor(kolBadge)}
            variant="filled"
            size="sm"
            rounded="full"
          />
        </div>

        {/* Text Content */}
        <div className="flex flex-col">
          <h4 className="text-sm font-semibold text-[#414651] line-clamp-1" title={title}>
            {title}
          </h4>
          <span className="text-xs font-medium text-[#717680]">{accountCount}</span>
        </div>

        {/* Amount */}
        <div className="text-sm font-semibold text-[#181D27]">{amount}</div>
      </div>

      {/* Action Footer */}
      <div className="border-t border-gray-200 px-2 py-1 flex justify-end items-center bg-gray-25/30">
        <MyButton
          color="primary"
          variant="text"
          size="sm"
          onClick={onViewDetails}
          customClassname="font-semibold text-[#6941C6] hover:bg-transparent p-0 h-auto min-w-0"
        >
          View details
        </MyButton>
      </div>
    </div>
  )
}
