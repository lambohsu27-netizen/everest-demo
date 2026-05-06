import React from 'react'
import { Check } from '@untitled-ui/icons-react'
import { Controller } from 'react-hook-form'
import { Checkbox } from '@mui/material'

const style = {
  '&.MuiButtonBase-root.MuiCheckbox-root': {
    margin: 0,
    padding: 0,
    borderRadius: '6px',
    '&.Mui-focusVisible.Mui-checked': {
      boxShadow: '0px 0px 0px 4px #72C8EB3D',
    },
    '&.Mui-focusVisible': {
      boxShadow: '0px 0px 0px 4px #98a2b324',
    },
  },
}

const MyCheckbox = ({
  name,
  value,
  checked,
  control,
  disabled,
  onChangeForm,
  isError,
}) => {
  return (
    <>
      <div className={`${disabled ? 'cursor-not-allowed' : ''} input-checkbox`}>
        {control ? (
          <Controller
            name={name}
            control={control}
            render={({ field }) => {
              return (
                <Checkbox
                  name={name}
                  value={value}
                  checked={checked || field?.value === value}
                  disabled={disabled}
                  disableRipple
                  onChange={(e) => {
                    var {
                      target: { checked },
                    } = e
                    field?.onChange && field?.onChange(checked ? value : null)
                    onChangeForm && onChangeForm(e)
                  }}
                  icon={
                    <span
                      className={`${disabled ? 'cursor-not-allowed bg-gray-light/50' : ''} flex h-5 min-h-[20px] w-5 min-w-[20px] items-center justify-center rounded-md border border-gray-light/300`}
                    >
                      {' '}
                    </span>
                  }
                  checkedIcon={
                    <span
                      className={`${disabled ? 'cursor-not-allowed border border-gray-light/300 bg-gray-light/50 text-gray-light/300' : isError ? 'bg-error/600 text-white' : 'bg-brand/900 text-white'} flex h-5 min-h-[20px] w-5 min-w-[20px] items-center justify-center rounded-md`}
                    >
                      <Check
                        // className="size-3.5 stroke-[3.5px]"
                        size={14}
                        stroke="currentColor"
                        strokeWidth={3.5}
                      />
                    </span>
                  }
                  sx={style}
                />
              )
            }}
          />
        ) : (
          <Checkbox
            name={name}
            value={value}
            disabled={disabled}
            disableRipple
            onChange={onChangeForm}
            checked={checked ?? false}
            icon={
              <span
                className={`${disabled ? 'cursor-not-allowed bg-gray-light/50' : ''} flex h-5 min-h-[20px] w-5 min-w-[20px] items-center justify-center rounded-md border border-gray-light/300`}
              >
                {' '}
              </span>
            }
            checkedIcon={
              <span
                className={`${disabled ? 'cursor-not-allowed border border-gray-light/300 bg-gray-light/50 text-gray-light/300' : isError ? 'bg-error/600 text-white' : 'bg-brand/900 text-white'} flex h-5 min-h-[20px] w-5 min-w-[20px] items-center justify-center rounded-md`}
              >
                <Check
                  // className="size-3.5 stroke-[3.5px]"
                  size={14}
                  stroke="currentColor"
                  strokeWidth={3.5}
                />
              </span>
            }
            sx={style}
          />
        )}
      </div>
    </>
  )
}

export default MyCheckbox
