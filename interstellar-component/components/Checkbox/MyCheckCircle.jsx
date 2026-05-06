import React from 'react'
import { Check } from '@untitled-ui/icons-react'
import { Controller } from 'react-hook-form'
import { Checkbox } from '@mui/material'

const style = {
  '&.MuiButtonBase-root.MuiCheckbox-root': {
    margin: 0,
    padding: 0,
    borderRadius: '50%',
    '&.Mui-focusVisible.Mui-checked': {
      boxShadow: '0px 0px 0px 4px #72C8EB3D',
    },
    '&.Mui-focusVisible': {
      boxShadow: '0px 0px 0px 4px #98a2b324',
    },
  },
}

const MyCheckCircle = ({
  name,
  value,
  checked,
  control,
  disabled,
  onChangeForm,
  isError,
}) => {
  return (
    <div className={`${disabled ? 'cursor-not-allowed' : ''} input-checkbox`}>
      {control ? (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
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
                  className={`${
                    disabled ? 'cursor-not-allowed bg-gray-light/50' : ''
                  } flex h-6 w-6 items-center justify-center rounded-full border border-gray-light/300`}
                ></span>
              }
              checkedIcon={
                <span
                  className={`${
                    disabled
                      ? 'cursor-not-allowed border border-gray-light/300 bg-gray-light/50 text-gray-light/300'
                      : isError
                        ? 'bg-error/600 text-white'
                        : 'bg-brand/900 text-white'
                  } flex h-6 w-6 items-center justify-center rounded-full`}
                >
                  {/* <Check size={14} stroke="currentColor" strokeWidth={3.5} /> */}
                  <div className="h-2.5 w-2.5 rounded-full bg-white"></div>
                </span>
              }
              sx={style}
            />
          )}
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
              className={`${
                disabled ? 'cursor-not-allowed bg-gray-light/50' : ''
              } flex h-6 w-6 items-center justify-center rounded-full border border-gray-light/300`}
            ></span>
          }
          checkedIcon={
            <span
              className={`${
                disabled
                  ? 'cursor-not-allowed border border-gray-light/300 bg-gray-light/50 text-gray-light/300'
                  : isError
                    ? 'bg-error/600 text-white'
                    : 'bg-brand/900 text-white'
              } flex h-6 w-6 items-center justify-center rounded-full`}
            >
              <Check size={14} stroke="currentColor" strokeWidth={3.5} />
            </span>
          }
          sx={style}
        />
      )}
    </div>
  )
}

export default MyCheckCircle
