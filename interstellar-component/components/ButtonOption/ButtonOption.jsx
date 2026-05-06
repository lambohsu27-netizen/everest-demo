import { MyCheckbox } from '@interstellar-component'
import React, { useEffect, useState } from 'react'

function ButtonOption({ onChange, value, label1, label2, disabled }) {
  return (
    <div className="flex w-full gap-5">
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          onChange && onChange(value === false ? null : false)
        }}
        className={`flex flex-1 items-center gap-2 rounded-lg border ${disabled ? 'border-gray-light/300' : value === false ? 'border-error/300' : 'border-gray-light/300'} px-2.5 py-2 shadow-shadows/shadow-xs`}
      >
        <p
          className={`text-sm-semibold flex-1 text-start ${disabled ? 'text-gray-light/400' : value === false ? 'text-error/600' : 'text-gray-light/600'}`}
        >
          {label1 ?? 'dummy'}
        </p>
        <MyCheckbox disabled={disabled} isError checked={value === false} />
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          onChange && onChange(value === true ? null : true)
        }}
        className={`flex flex-1 items-center gap-2 rounded-lg border ${disabled ? 'border-gray-light/300' : value === true ? 'border-brand/300' : 'border-gray-light/300'} px-2.5 py-2 shadow-shadows/shadow-xs`}
      >
        <p
          className={`text-sm-semibold flex-1 text-start ${disabled ? 'text-gray-light/400' : value === true ? 'text-brand/900' : 'text-gray-light/600'}`}
        >
          {label2 ?? 'dummy'}
        </p>
        <MyCheckbox disabled={disabled} checked={value === true} />
      </button>
    </div>
  )
}
export default ButtonOption
