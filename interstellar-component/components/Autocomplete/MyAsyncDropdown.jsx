import { useEffect, useState } from 'react'
import { debounce } from 'lodash'
import MyAutocomplete from './MyAutocomplete'

function MyAsyncDropDown({
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
  asyncFunction,
  extraData = {},
  onInputKeyUp,
  getOnRender = true,
  trigger,
  focusColor,
  focusShadow,
}) {
  const props = {
    groupBy,
    options,
    value,
    inputType,
    name,
    control,
    error,
    removeable,
    disabled,
    multiple,
    isMultipleSmall,
    isTypingValue,
    disableClearable,
    mergeOnChange,
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
    onClearable,
    onInputChange,
    onInputFocus,
    asyncFunction,
    onInputKeyUp,
    focusColor,
    focusShadow,
  }
  if (!props.asyncFunction) throw new Error('asyncFunction is required')
  const [option, setOption] = useState({ loading: true, data: [] })
  const [params, setParams] = useState({ search: '' })
  const [mount, setMount] = useState(false)

  useEffect(() => {
    setOption({ loading: true, data: [] })
    if (getOnRender || mount) asyncFunction(params)?.then(setOption)
  }, [params])

  useEffect(() => {
    setMount(true)
  }, [])

  return (
    <MyAutocomplete
      {...props}
      trigger={trigger}
      loading={option?.loading}
      options={option?.data}
      onChange={(e, value) => {
        onChange && onChange(e, value)
        setParams({ search: '', ...extraData })
        // console.log('nsame', name)
        if (trigger && name) trigger(name)
      }}
      //   onChange={onChange.then(setParams({ search: "", ...extraData }))}
      onInputFocus={(e) => setParams({ search: '', ...extraData })}
      onInputChange={debounce(
        (e) => setParams({ search: e.target.value, ...extraData }),
        500
      )}
    />
  )
}

export default MyAsyncDropDown
