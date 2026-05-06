import React, { useState, useRef, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { InputAdornment, Paper } from '@mui/material'
import { Check, XClose, ChevronDown, ChevronUp } from '@untitled-ui/icons-react'

import { styled, lighten, darken, fontWeight } from '@mui/system'
import SimpleBar from 'simplebar-react'
import MyChip from '../Chip/MyChip'

function MyAutocomplete({
  groupBy,
  options = [],
  value,
  inputType = 'text',
  name,
  control,
  error,
  removeable = true,
  disabled = false,
  multiple = false,
  isMultipleSmall = false,
  isTypingValue = false,
  disableClearable = false,
  mergeOnChange = true,
  height,
  placeholder,
  startAdornment,
  endAdornment,
  filterOptions,
  getOptionLabel,
  isOptionEqualToValue,
  renderOption,
  renderTag,
  onClick,
  onChange,
  onClearable,
  onInputChange,
  onInputFocus,
  onInputKeyUp,
  freeSolo = false,
  loading = false,
  trigger,
  focusColor,
  focusShadow,
}) {
  const styleTextField = {
    '& .MuiInputBase-root::-webkit-scrollbar': {
      display: 'none',
    },
    '& .MuiInputBase-root': {
      borderRadius: '8px',
      padding:
        multiple && !isMultipleSmall
          ? '12px !important'
          : '10px 14px !important',
      height: height
        ? `${height}px`
        : multiple && !isMultipleSmall
          ? '130px'
          : '44px',
      overflowY: multiple ? 'scroll' : 'hidden',
      overflowX: multiple ? 'scroll' : 'hidden',
      // scrollbarWidth: 'none',
      // msOverflowStyle: 'none',
      '&::-webkit-scrollbar': {
        width: '8px !important',
        height: '8px !important',
      },
      display: 'flex',
      alignItems: multiple ? 'flex-start' : 'center',
      alignContent: 'flex-start',
      rowGap: '6px !important',
      columnGap: '8px !important',
      boxShadow: '0px 1px 2px 0px #1018280D',
      border: '1px solid #D0D5DD',
      '&.Mui-error': { border: '1px solid #FDA29B' },
      backgroundColor: 'white',
      '& .MuiInputBase-input::placeholder': {
        fontSize: '16px',
        fontFamily: "'Inter', sans-serif",
        fontWeight: '400',
        lineHeight: '24px',
        wordWrap: 'break-word',
        color: '#667085',
        opacity: 1,
      },
      '& .MuiInputAdornment-root.MuiInputAdornment-positionEnd': {
        position: 'absolute',
        right: '14px',
      },
      '&.Mui-focused': {
        // border: `1px solid ${focusColor ?? '#8ED8F6'}`,
        // boxShadow: `0px 0px 0px 4px ${focusShadow ?? '#72C8EB3D'}`,
        boxShadow: `inset 0 0 0 2px ${focusShadow ?? '#365CC3'}`,
      },
      '&.Mui-focused.Mui-error': {
        border: '1px solid #FDA29B',
        boxShadow: '0px 0px 0px 4px #F044383D, 0px 1px 2px 0px #1018280D',
      },
      '& .MuiInputBase-input': { padding: '0px 4px' },
      '&.Mui-disabled': { backgroundColor: '#F9FAFB', cursor: 'not-allowed' },
      '&.Mui-disabled .MuiInputBase-input': {
        WebkitTextFillColor: '#667085',
        color: '#667085',
      },
      '& .MuiInputAdornment-root': { marginRight: '0px', marginLeft: '0px' },
      '& fieldset': { padding: 0, border: 'none' },
      '&:hover fieldset': { border: 'none' },
      '&.Mui-focused fieldset': { border: 'none' },
      '&.Mui-disabled fieldset': { border: 'none' },
    },
    '& .MuiFormHelperText-root': {
      paddingTop: '4px',
      margin: '0px !important',
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '20px',
      wordWrap: 'break-word',
      color: '#475467',
      '&.Mui-error': { color: '#D92D20' },
    },
  }

  const stylePapper = {
    '&.MuiPaper-root': {
      marginTop: '4px',
      border: (options && options.length) || value ? '1px solid #EAECF0' : '',
      borderRadius: '8px',
      boxShadow:
        (options && options.length) || value
          ? '0px 4px 6px -2px #10182808'
          : '',
    },
    '&.MuiPaper-root .MuiAutocomplete-listbox': { padding: '4px 0px' },
  }

  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const textFieldRef = useRef()
  useEffect(() => {
    if (!multiple) {
      if (isOpen) {
        textFieldRef.current.style.display = 'flex'
        textFieldRef.current.focus()
      } else {
        textFieldRef.current.style.display = 'none'
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (!multiple) {
      textFieldRef.current.style.display = 'none'
    }
  }, [value])

  const ListboxSimpleBar = React.forwardRef((props, ref) => (
    <SimpleBar {...props} role="listbox" scrollableNodeProps={{ ref }} />
  ))
  const isError = error ? Boolean(error) : false

  const handleClearValue = (e) => {
    setInputValue('')
    if (mergeOnChange) {
      onChange && onChange(e, null)
      onClearable && onClearable(e, null)
    } else {
      onClearable && onClearable(e, null)
    }
    if (trigger && name) trigger(name)
    console.log('teest', trigger)
  }

  const GroupHeader = styled('div')(({ theme }) => ({
    position: 'sticky',
    top: '-4px',
    padding: '4px 10px',
    color: 'gray-light/900',
    fontWeight: 'bold',
    backgroundColor: 'white',
    //   theme.palette.mode === 'light'
    //     ? lighten(theme.palette.primary.light, 0.85)
    //     : darken(theme.palette.primary.main, 0.8),
  }))

  const GroupItems = styled('ul')({
    padding: 0,
  })

  return (
    <div
      id={
        name
          ? `input-${name.replace(/\./gi, '-').replace(/[\[\]]/g, '')}`
          : null
      }
    >
      <Autocomplete
        inputValue={inputValue}
        loading={loading}
        open={disabled ? false : isOpen}
        freeSolo={freeSolo}
        popupIcon={<></>}
        multiple={multiple}
        options={options ?? []}
        value={multiple ? (value ?? []) : (value ?? null)}
        disabled={Boolean(disabled)}
        fullWidth
        groupBy={groupBy}
        onOpen={(e) => setIsOpen(true)}
        onClose={(e) => setIsOpen(false)}
        ListboxComponent={ListboxSimpleBar}
        onChange={(e, value, state) => {
          if (multiple) {
            setInputValue('')
          } else if (value) {
            if (getOptionLabel) {
              setInputValue(getOptionLabel(value))
            } else {
              setInputValue(value.label ?? '')
            }
          }

          if (multiple && isTypingValue) {
            const tempValue = value.map((e) => {
              if (typeof e === 'string') {
                return { label: e.trim() }
              }
              return e
            })

            const uniqueData = tempValue.filter((obj, index, self) => {
              if (
                obj.label &&
                index === self.findIndex((o) => o.label === obj.label)
              ) {
                return true
              }
              return false
            })

            onChange && onChange(e, uniqueData)
          } else {
            onChange && onChange(e, value)
          }
        }}
        disableClearable={!!multiple}
        ListboxProps={{ style: { maxHeight: 320 } }}
        PaperComponent={(props) => <Paper {...props} sx={stylePapper} />}
        isOptionEqualToValue={(option, value) =>
          isOptionEqualToValue
            ? isOptionEqualToValue(option, value)
            : option.label === value.label
        }
        getOptionLabel={(option) =>
          getOptionLabel ? getOptionLabel(option) : option.label
        }
        renderOption={(props, option, ownerState) => {
          let selected = false
          if (value) {
            if (multiple) {
              selected = value.some((e) =>
                isOptionEqualToValue
                  ? isOptionEqualToValue(option, e)
                  : option?.value === e?.value || option?.id === e?.id
              )
            } else {
              selected = isOptionEqualToValue
                ? isOptionEqualToValue(option, value)
                : option?.value === value?.value || option?.id === value?.id
            }
          }

          return (
            <div
              {...props}
              id="my-modal-children"
              key={props['data-option-index']}
              className={`${selected ? 'bg-gray-light/50' : ''
                } py w-full cursor-pointer px-1.5 hover:bg-gray-light/50`}
            >
              <div className="flex w-full items-center gap-x-2 py-2.5 pl-2 pr-2.5">
                <div className="flex-1 overflow-hidden">
                  {renderOption ? (
                    renderOption(option, {
                      isOption: true,
                      isOptionValue: false,
                    })
                  ) : (
                    <p className="text-md-regular whitespace-nowrap px-1 text-gray-light/900">
                      {getOptionLabel
                        ? (getOptionLabel(option) ?? '')
                        : option?.label}
                    </p>
                  )}
                </div>
                {value && (
                  <span className="h-5 min-h-[20px] w-5 min-w-[20px] text-brand/900">
                    {selected && (
                      <Check className="size-5" stroke="currentColor" />
                    )}
                  </span>
                )}
              </div>
            </div>
          )
        }}
        renderTags={(options, getTagProps, ownerState) =>
          options.map((option, index) => {
            const { onDelete } = getTagProps({ index })

            return (
              <div
                key={index}
                onClick={() => onClick && onClick(option.label)}
                className="h-max w-max"
              >
                {renderTag ? (
                  renderTag(option, index, onDelete)
                ) : (
                  <MyChip
                    label={
                      getOptionLabel
                        ? (getOptionLabel(option) ?? '')
                        : option.label
                    }
                    rounded="md"
                    color="modern"
                    variant="outlined"
                    size="md"
                    endAdornment={
                      removeable && (
                        <button
                          disabled={disabled}
                          type="button"
                          onClick={onDelete}
                        >
                          <XClose
                            className="size-4 text-gray-light/400"
                            size={14}
                            strokeWidth={3}
                            stroke="currentColor"
                          />
                        </button>
                      )
                    }
                  />
                )}
              </div>
            )
          })
        }
        filterOptions={(options, state) => {
          function sortOptions(options, value, isOptionEqualToValue) {
            if (multiple) {
              const selectedOptions = []
              const unSelectedOptions = []

              for (let i = 0; i < options.length; i++) {
                const selected = value.some((e) =>
                  isOptionEqualToValue
                    ? isOptionEqualToValue(options[i], e)
                    : options[i]?.value === e?.value || options[i]?.id === e?.id
                )

                if (selected) {
                  selectedOptions.push(options[i])
                } else {
                  unSelectedOptions.push(options[i])
                }
              }

              return [...selectedOptions, ...unSelectedOptions]
            }
            const selectedOptions = []
            const unSelectedOptions = []

            for (let i = 0; i < options.length; i++) {
              const selected = isOptionEqualToValue
                ? isOptionEqualToValue(options[i], value)
                : options[i]?.value === value?.value ||
                options[i]?.id === value?.id

              if (selected) {
                selectedOptions.push(options[i])
              } else {
                unSelectedOptions.push(options[i])
              }
            }

            return [...selectedOptions, ...unSelectedOptions]
          }

          if (value) {
            return sortOptions(options, value, isOptionEqualToValue) ?? []
          }
          return options ?? []
        }}
        renderGroup={(params) => (
          <li key={params.key}>
            <GroupHeader>{params.group}</GroupHeader>
            <GroupItems>{params.children}</GroupItems>
          </li>
        )}
        renderInput={(params) => {
          const { InputProps } = params
          return (
            <TextField
              {...params}
              control={control}
              inputRef={textFieldRef}
              type={inputType}
              error={isError}
              disabled={disabled}
              placeholder={
                (
                  multiple
                    ? Boolean(value) && Boolean(value.length !== 0)
                    : Boolean(value)
                )
                  ? ''
                  : placeholder
              }
              helperText={isError ? error : ''}
              onChange={(e) => {
                setInputValue(e.target.value)
                onInputChange && onInputChange(e)
              }}
              onKeyUp={onInputKeyUp}
              onFocus={(e) => {
                setInputValue('')
                onInputFocus && onInputFocus(e)
              }}
              onBlur={(e) => {
                setIsOpen(false)
              }}
              InputProps={{
                ...InputProps,
                startAdornment: (
                  <>
                    {startAdornment && (
                      <InputAdornment position="start">
                        {startAdornment}
                      </InputAdornment>
                    )}
                    {multiple ? (
                      InputProps.startAdornment
                    ) : !isOpen ? (
                      value ? (
                        <div
                          className="flex-1 overflow-hidden pl-1 pr-8"
                          onClick={(e) => !disabled && setIsOpen(true)}
                        >
                          {renderOption ? (
                            renderOption(value, {
                              isOption: false,
                              isOptionValue: true,
                            })
                          ) : (
                            <p className="text-md-regular line-clamp-2 break-all text-gray-light/900">
                              {getOptionLabel
                                ? getOptionLabel(value)
                                : value.label}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div
                          className="flex-1 overflow-hidden pl-1 pr-8"
                          onClick={(e) => !disabled && setIsOpen(true)}
                        >
                          <div className="w-full overflow-hidden">
                            <p className="text-md-regular text-gray-light/500">
                              {placeholder}
                            </p>
                          </div>
                        </div>
                      )
                    ) : null}
                  </>
                ),
                endAdornment: multiple ? (
                  <></>
                ) : !disableClearable && value && !isOpen && !disabled ? (
                  <InputAdornment position="end">
                    <button
                      type="button"
                      className="flex h-7 w-7 items-center justify-center rounded-full text-center hover:bg-gray-light/50"
                      onClick={handleClearValue}
                    >
                      <span>
                        <XClose className="size-5" stroke="currentColor" />
                      </span>
                    </button>
                  </InputAdornment>
                ) : (
                  <InputAdornment position="end">
                    {endAdornment ||
                      (!disabled && (
                        <div>
                          {isOpen ? (
                            <button
                              onClick={(e) => setIsOpen(false)}
                              type="button"
                              className="flex h-7 w-7 items-center justify-center rounded-full text-center hover:bg-gray-light/50"
                            >
                              <ChevronUp
                                className="size-5"
                                stroke="currentColor"
                              />
                            </button>
                          ) : (
                            <button
                              onClick={(e) => setIsOpen(true)}
                              type="button"
                              className="flex h-7 w-7 items-center justify-center rounded-full text-center hover:bg-gray-light/50"
                            >
                              <ChevronDown
                                className="size-5"
                                stroke="currentColor"
                              />
                            </button>
                          )}
                        </div>
                      ))}
                  </InputAdornment>
                ),
              }}
              sx={styleTextField}
            />
          )
        }}
      />
    </div>
  )
}

export default MyAutocomplete
