import React from 'react'
import { Controller } from 'react-hook-form'

function MyTextArea({
  value,
  name,
  placeholder,
  control,
  errors,
  disabled,
  helperText,
  onChangeInput,
  onKeyDown,
  expanded = false,
}) {
  const commonProps = { value, placeholder, disabled, rows: 4, onKeyDown }

  let makeStyle =
    'w-full resize-none py-3 px-4 shadow-shadows/shadow-xs rounded-lg placeholder-gray-light/500 '
  if (disabled) {
    makeStyle += ' bg-gray-light/50 focus:outline-none cursor-not-allowed text-gray-light/500 '
  } else {
    makeStyle += ' bg-white focus:outline-none text-gray-light/700 '
  }

  if (expanded) makeStyle += 'h-full'

  if (errors && name && errors[name]) {
    makeStyle +=
      ' border border-error/300 focus:border-error/300 focus:shadow-focus-rings/ring-error-shadow-xs'
  } else {
    makeStyle +=
      ' border border-gray-light/300 focus:border-brand/300 focus:shadow-focus-rings/ring-brand-shadow-xs'
  }

  const handleChange = (e, callback) => {
    const {
      target: { value },
    } = e
    callback && callback(value ?? '')
    onChangeInput && onChangeInput(e)
  }

  return (
    <>
      {control ? (
        <Controller
          name={name}
          control={control}
          render={(e) => {
            const {
              formState: { errors },
              field: { value, onChange },
            } = e
            const isError = Boolean(errors[name]?.message)
            return (
              <div
                className={`flex flex-col gap-1.5 ${expanded ? 'h-full' : ''}`}
              >
                <textarea
                  {...commonProps}
                  value={e.field.value ?? ''}
                  onChange={(e) => handleChange(e, onChange)}
                  className={`${makeStyle} ${isError ? 'border-red-300' : ''}`}
                />
                {(errors?.[name] || helperText) && (
                  <p
                    className={`text-sm-regular ${errors?.[name] ? 'text-error/600' : 'text-gray-light/600'}`}
                  >
                    {errors?.[name] ? errors?.[name]?.message : helperText}
                  </p>
                )}
              </div>
            )
          }}
        />
      ) : (
        <div className={`flex flex-col gap-1.5 ${expanded ? 'h-full' : ''}`}>
          <textarea
            {...commonProps}
            className={`${makeStyle} ${errors?.[name] ? 'border-red-500' : ''}`}
            onChange={handleChange}
          />
          {helperText && (
            <p className="text-sm-regular text-gray-light/600">{helperText}</p>
          )}
        </div>
      )}
    </>
  )
}

export default MyTextArea
