import React, { useState, useEffect, useCallback } from 'react'
import { debounce } from 'lodash'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { Paper } from '@mui/material'
import { Check } from '@untitled-ui/icons-react'
import SimpleBar from 'simplebar-react'

function MySuggestionField({
  type = 'text',
  value = null,
  name,
  error,
  trigger,
  disabled = false,
  height,
  placeholder,
  startAdornment,
  endAdornment,
  getOptionLabel,
  getOptionValue,
  isOptionEqualToValue,
  renderOption,
  onChangeInput,
  onKeyDownInput,
  asyncFunction,
  extraData = {},
  loading = false,
  validationRegex,
  isSearchInventory = false,
  showResult = false,
}) {
  if (!asyncFunction) throw 'asyncFunction is required'
  const [options, setOptions] = useState({ loading: true, data: [] })
  const [isInit, setIsInit] = useState(true)
  const [inputValue, setInputValue] = useState('')
  useEffect(() => {
    setInputValue(value ?? '')
  }, [value])
  const [isOpen, setIsOpen] = useState(false)

  const styleTextField = {
    '& input[type=number]': {
      '-moz-appearance': 'textfield',
    },
    '& input[type=number]::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    '& input[type=number]::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    '& .MuiInputBase-root::-webkit-scrollbar': {
      display: 'none',
    },
    '& .MuiInputBase-root': {
      borderRadius: '8px',
      padding: '10px 14px !important',
      height: height ? `${height}px` : '44px',
      overflowY: 'hidden',
      overflowX: 'hidden',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      display: 'flex',
      alignItems: 'center',
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
        border: '1px solid #8ED8F6',
        boxShadow: '0px 0px 0px 4px #72C8EB3D',
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
    '&.MuiPaper-root .MuiAutocomplete-noOptions': {
      padding: 0,
    },
  }

  useEffect(() => {
    if (inputValue.length && options && options.data && options.data.length) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [inputValue, options])

  const ListboxSimpleBar = React.forwardRef((props, ref) => (
    <SimpleBar {...props} role="listbox" scrollableNodeProps={{ ref }} />
  ))
  const isError = error ? Boolean(error) : false

  const debouncedOnInputChange = useCallback(
    debounce((value, extraData, asyncFunction, setOptions) => {
      if (asyncFunction) {
        asyncFunction({ search: value, ...extraData }).then(setOptions)
      }
    }, 500),
    []
  )
  const handleChange = (e) => {
    // eslint-disable-next-line no-shadow
    let { value } = e.target
    if (value.length === 0) setIsInit(true)
    // eliminate value only contain space
    if (value.length === 1) value = value.trim()

    if (validationRegex && value) {
      const regex = new RegExp(validationRegex)
      if (!regex.test(value)) return
    }

    setInputValue(value)
    // eslint-disable-next-line no-unused-expressions
    onChangeInput && onChangeInput(e, value)

    if (value.length <= 1 && isInit) {
      if (asyncFunction) {
        asyncFunction({ search: value, ...extraData }).then(setOptions)
      }
      setIsInit(false)
    } else {
      debouncedOnInputChange(value, extraData, asyncFunction, setOptions)
    }

    // const debounce_fun = debounce(() => {
    //   // eslint-disable-next-line no-unused-expressions

    // }, 500)
  }

  return (
    <div
      id={
        name
          ? `input-${name.replace(/\./gi, '-').replace(/[\[\]]/g, '')}`
          : null
      }
    >
      <Autocomplete
        open={isOpen}
        value={null}
        inputValue={inputValue ?? ''}
        options={options?.data ?? []}
        disabled={Boolean(disabled)}
        fullWidth
        popupIcon={<></>}
        loading={loading}
        noOptionsText=""
        ListboxComponent={ListboxSimpleBar}
        onChange={(e, value, state) => {
          if (getOptionValue) {
            setInputValue(getOptionValue(value))
            onChangeInput && onChangeInput(e, getOptionValue(value), value)
            if (isSearchInventory && state === 'selectOption') {
              setInputValue('')
            }
          }
        }}
        ListboxProps={{ style: { maxHeight: 320 } }}
        // PaperComponent={(props) => <Paper {...props} sx={stylePapper} />}
        PaperComponent={(props) => (
          <Paper {...props} sx={stylePapper}>
            {options?.data?.length > 0 && showResult && (
              <div className="flex flex-col gap-1 px-4 pt-2">
                <p className="text-sm-medium py-2 text-gray-700">Result</p>
                <hr />
              </div>
            )}
            {props.children}
            <hr />
            {/* <div className="flex justify-end">
              <MyButton
                variant="text"
                color="primary"
                onClick={() => alert('asuu')}
              >
                <p className="text-sm-semibold px-4 py-2">Show more</p>
              </MyButton>
            </div> */}
          </Paper>
        )}
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
            selected = isOptionEqualToValue
              ? isOptionEqualToValue(option, value)
              : option?.value === value?.value || option?.id === value?.id
          }

          return (
            <div
              {...props}
              key={props['data-option-index']}
              className={`${
                selected ? 'bg-gray-light/50' : ''
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
                    <p className="text-md-medium whitespace-nowrap px-1 text-gray-light/900">
                      {getOptionLabel
                        ? getOptionLabel(option) ?? ''
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
        filterOptions={(options, state) => {
          function sortOptions(options, value, isOptionEqualToValue) {
            const selectedOptions = []
            let unSelectedOptions = []

            for (let i = 0; i < options.length; i++) {
              const selected =
                value &&
                (isOptionEqualToValue
                  ? isOptionEqualToValue(options[i], value)
                  : options[i]?.value === value?.value ||
                    options[i]?.id === value?.id)

              if (selected) {
                selectedOptions.push(options[i])
              } else {
                unSelectedOptions.push(options[i])
              }
            }

            unSelectedOptions = unSelectedOptions.filter((e) =>
              getOptionLabel
                ? (getOptionLabel(e) ?? '')
                    .trim()
                    .toLowerCase()
                    .includes(state.inputValue.trim().toLowerCase())
                : (e?.label ?? '')
                    .trim()
                    .toLowerCase()
                    .includes(state.inputValue.trim().toLowerCase())
            )

            return [...selectedOptions, ...unSelectedOptions]
          }

          return sortOptions(options, value, isOptionEqualToValue) ?? []
        }}
        renderInput={(params) => {
          const { InputProps } = params

          return (
            <TextField
              {...params}
              type={type}
              error={isError}
              disabled={Boolean(disabled)}
              placeholder={placeholder ?? ''}
              helperText={isError ? error : ''}
              onChange={handleChange}
              onBlur={(e) => {
                setIsOpen(false)
              }}
              onWheel={(e) => {
                e.target.blur()
              }}
              onKeyDown={onKeyDownInput}
              InputProps={{
                ...InputProps,
                startAdornment: startAdornment || InputProps.startAdornment,
                endAdornment: endAdornment || InputProps.startAdornment,
              }}
              sx={styleTextField}
            />
          )
        }}
      />
    </div>
  )
}

export default MySuggestionField
