import React, { useEffect, useState } from 'react'
import { Plus, Trash01, XClose, Eraser } from '@untitled-ui/icons-react'
import { debounce } from 'lodash'
import { format, formatISO, parse, parseISO } from 'date-fns'
import {
  MyAutocomplete,
  MyBgPatternDecorativeCircle,
  MyCalendar,
  MyPopper,
  MyTextField,
} from '@interstellar-component'
import { get } from '../../../src/services/NetworkUtils'

const MyFilterModal = ({ id, target, currentFilters, onChange }) => {
  const [options, setOptions] = useState([])
  const [filter, setFilter] = useState([])
  const addFilter = () => {
    var data = { field: null, condition: null, value: null, operator: null }
    if (filter.length == 1) data.operator = { label: 'and', value: 'and' }
    if (filter.length >= 2) {
      data.operator = filter[1].operator
    }

    const newFilter = [...filter, data]
    setFilter(newFilter)
  }
  var isObj = function (a) {
    if (!!a && a.constructor === Object) {
      return true
    }
    return false
  }
  var _st = function (z, g) {
    return '' + (g != '' ? '[' : '') + z + (g != '' ? ']' : '')
  }
  var fromObject = function (params, skipobjects, prefix) {
    if (skipobjects === void 0) {
      skipobjects = false
    }
    if (prefix === void 0) {
      prefix = ''
    }
    var result = ''
    if (typeof params != 'object') {
      return prefix + '=' + encodeURIComponent(params) + '&'
    }
    for (var param in params) {
      var c = '' + prefix + _st(param, prefix)
      if (isObj(params[param]) && !skipobjects) {
        result += fromObject(params[param], false, '' + c)
      } else if (Array.isArray(params[param]) && !skipobjects) {
        params[param].forEach(function (item, ind) {
          result += fromObject(item, false, c + '[' + ind + ']')
        })
      } else {
        result += c + '=' + encodeURIComponent(params[param]) + '&'
      }
    }
    return result
  }

  const clearFilter = () => {
    console.log('jalan')
    setFilter([])
  }

  const removeFilter = (index) => {
    if (filter && filter.length) {
      const newFilter = filter.slice()
      newFilter.splice(index, 1)
      setFilter(newFilter)
    }
  }

  const handleChangeOperator = (e, value, index) => {
    const temp = filter.slice()
    temp.map((e) => {
      e.operator = value
    })

    setFilter(temp)
  }
  const handleChangeField = (e, value, index) => {
    const temp = filter.slice()
    temp[index].filter = value
    temp[index].field = value?.name ?? ''
    temp[index].condition = null
    temp[index].value = null

    setFilter(temp)
  }
  const handleChangeCondition = (e, value, index) => {
    const temp = filter.slice()
    temp[index].condition = value

    setFilter(temp)
  }
  const handleChangeValue = (value, index) => {
    const temp = filter.slice()
    temp[index].value = value
    setFilter(temp)
  }

  const handleChange = () => {
    // console.log('INI JALAN')
    onChange && onChange({ ...filter })
  }
  useEffect(() => {
    var valid = true
    filter.map((e) => {
      if (!e.field) valid = false
      if (!e.condition) valid = false
      if (
        e.value == undefined ||
        e.value == null ||
        (e.value == '' && typeof e.value != 'boolean')
      )
        valid = false
      console.log(e.value, e.value == undefined, valid, 'Value <<<<<<')
    })
    if (valid) handleChange()
  }, [filter])
  useEffect(() => {
    setOptions(currentFilters)
  }, [currentFilters])

  // console.log('options', options)
  return (
    <>
      <MyPopper
        id={id}
        haveValue={filter.filter((e) => e.value)?.length}
        target={target}
        placement={'bottom-start'}
      >
        {(open, anchorEl, show, close) => (
          <div className="flex w-[881px] flex-col">
            <div className="z-10 p-6 pb-5">
              <MyBgPatternDecorativeCircle
                originClass={'items-center justify-end'}
              >
                <p className="text-sm-regular text-gray-light/600">
                  In this view, show records.
                </p>
              </MyBgPatternDecorativeCircle>
            </div>
            <div className="z-20 flex flex-col gap-y-4">
              <div className="flex flex-col gap-4 px-4">
                {(filter ?? []).map((e, i) => {
                  return (
                    <div key={i} className="flex w-full items-center gap-4">
                      <div className="w-24">
                        {i === 0 ? (
                          <div className="px-[14px] py-2">
                            <p className="tex-md-regular text-gray-light/900">
                              Where
                            </p>
                          </div>
                        ) : i === 1 ? (
                          <MyAutocomplete
                            disableClearable={true}
                            options={[
                              { label: 'and', value: 'and' },
                              { label: 'or', value: 'or' },
                            ]}
                            isOptionEqualToValue={(option, value) =>
                              option.value === value.value
                            }
                            value={e?.operator}
                            placeholder={'-'}
                            onChange={(e, value) =>
                              handleChangeOperator(e, value, i)
                            }
                            focusColor={'#0A2349'}
                            focusShadow={'#DCE3F1'}
                          />
                        ) : (
                          <div className="px-[14px] py-2">
                            <p className="tex-md-regular text-gray-light/900">
                              {e?.operator?.label}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <MyAutocomplete
                          disableClearable={true}
                          value={e?.filter}
                          placeholder={'Field'}
                          options={options}
                          isOptionEqualToValue={(option, value) =>
                            option?.name === value?.name
                          }
                          onChange={(e, value) =>
                            handleChangeField(e, value, i)
                          }
                          onInputFocus={() => {
                            setOptions(currentFilters)
                          }}
                          onInputChange={(e) => {
                            var text = e?.target?.value
                            setOptions((value) => {
                              if (text)
                                return value.filter((e) =>
                                  e?.label
                                    .toLowerCase()
                                    .includes(text?.toLowerCase())
                                )
                              else return currentFilters
                            })
                          }}
                          focusColor={'#0A2349'}
                          focusShadow={'#DCE3F1'}
                        />
                      </div>
                      <div className="flex-1">
                        {e?.filter?.options && (
                          <MyAutocomplete
                            disableClearable={true}
                            options={e?.filter?.options ?? []}
                            value={e.condition}
                            placeholder={'Condition'}
                            isOptionEqualToValue={(option, value) =>
                              option.value === value.value
                            }
                            onChange={(e, value) =>
                              handleChangeCondition(e, value, i)
                            }
                            focusColor={'#0A2349'}
                            focusShadow={'#DCE3F1'}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        {e?.condition && e?.filter && (
                          <FilterInput
                            element={e}
                            onChange={(value) => handleChangeValue(value, i)}
                          />
                        )}
                      </div>
                      <button onClick={(e) => removeFilter(i)} className="p-3">
                        <Trash01
                          className={'size-5 text-gray-light/600'}
                          stroke={'currentColor'}
                        />
                      </button>
                    </div>
                  )
                })}
              </div>

              <div className="flex items-center justify-between p-6 px-4 pt-8">
                <button onClick={addFilter} className="flex items-center gap-2">
                  <Plus
                    className={'size-5 text-gray-light/600'}
                    stroke={'currentColor'}
                  />
                  <p className="text-md-semibold text-gray-light/600">
                    Add condition
                  </p>
                </button>
                <button
                  onClick={clearFilter}
                  className="flex items-center gap-2"
                >
                  <Eraser
                    className={'size-5 text-gray-light/600'}
                    stroke={'currentColor'}
                  />
                  <p className="text-md-semibold text-gray-light/600">Clear</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </MyPopper>
    </>
  )
}
const FilterInput = ({ element, onChange }) => {
  const [options, setOptions] = useState([])
  const getOptions = async ({ search = '' } = {}) => {
    await get(element?.filter.path, { search: search })
      .then((res) => {
        // bingung dari mana tau pake labelnya, buat option
        console.log(res)
        setOptions(res.data)
      })
      .catch(myToaster)
  }

  const inputComponent = () => {
    if (element?.filter.type === 'string') {
      return (
        <MyTextField
          placeholder={'Enter your value'}
          value={element.value}
          onChangeForm={(e) => {
            onChange && debounce((e) => onChange(e?.target?.value), 1000)(e)
          }}
          focusColor={'#0A2349'}
          focusShadow={'#DCE3F1'}
        />
      )
    } else if (element?.filter.type === 'number') {
      return (
        <MyTextField
          placeholder={'Enter your value'}
          value={element.value}
          type="number"
          onChangeForm={(e) => {
            onChange && debounce((e) => onChange(e?.target?.value), 1000)(e)
          }}
          focusColor={'#0A2349'}
          focusShadow={'#DCE3F1'}
        />
      )
    } else if (element?.filter.type === 'date') {
      // if (element.condition.value === '<' || element.condition.value === '>') {
      //     return <MyDateRange startDate={element.value && element.value.startDate && parseISO(element.value.startDate)} endDate={element.value && element.value.endDate && parseISO(element.value.endDate)}
      //         target={(open, handleClick) => (<MyTextField readOnly={true} isRealtime={true} placeholder={"Enter your date"}
      //             value={(element.value && element.value.startDate && element.value.endDate) ? `${format(parseISO(element.value.startDate), 'MMM d, yyyy')} - ${format(parseISO(element.value.endDate), 'MMM d, yyyy')}` : ''}
      //             onTapForm={handleClick} />)}
      //         onChange={(startDate, endDate) => {
      //             if (startDate && endDate) {
      //                 onChange && onChange([
      //                     formatISO(startDate, { representation: 'complete' }),
      //                     formatISO(endDate, { representation: 'complete' })
      //                 ]);
      //             }
      //         }}
      //     />
      // } else {
      return (
        <MyCalendar
          value={element.value && parseISO(element.value)}
          target={(open, handleClick) => {
            console.log('aaa')

            return (
              <button
                onClick={handleClick}
                type="button"
                className="flex w-full items-center gap-1 rounded-lg border border-gray-light/300 px-3.5 py-2.5 text-gray-light/700 shadow-shadows/shadow-xs"
              >
                {element?.value ? (
                  <p className="text-md-regular px-0.5 text-gray-light/900">
                    {element?.value &&
                      format(parseISO(element?.value), 'MMM d, yyyy')}
                    {/* {moment(date_and_time).format('DD MMM YYYY HH:mm')} */}
                  </p>
                ) : (
                  <p>
                    <p className="text-md-regular px-0.5 text-gray-light/500">
                      Enter your date
                    </p>
                  </p>
                )}
              </button>
              // <MyTextField
              //   readOnly={true}
              //   isRealtime={true}
              //   placeholder={'Enter your date'}
              //   value={

              //   }
              //   onFocusForm={handleClick}
              // />
            )
          }}
          onChange={(date) => {
            if (date) {
              onChange &&
                onChange(formatISO(date, { representation: 'complete' }))
            }
          }}
        />
      )
      // }
    } else if (element?.filter.type === 'select') {
      return (
        <MyAutocomplete
          disableClearable={true}
          placeholder={'Enter your value'}
          value={element?.value}
          options={options}
          onInputFocus={(e) => getOptions()}
          getOptionLabel={
            element.filter.optionLabel
              ? (option) => option[element.filter.optionLabel]
              : null
          }
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onInputChange={({ target: { value } }) => {
            getOptions({ search: value })
          }}
          onChange={(e, value) => {
            onChange && onChange(value)
          }}
          focusColor={'#0A2349'}
          focusShadow={'#DCE3F1'}
        />
      )
    } else if (element?.filter.type === 'multi') {
      if (element?.filter.path) {
        return (
          <MyAutocomplete
            disableClearable={true}
            placeholder={'Enter your value'}
            multiple={true}
            isMultipleSmall={true}
            value={element?.value}
            options={options}
            onInputFocus={(e) => getOptions()}
            onInputChange={({ target: { value } }) => {
              getOptions({ search: value })
            }}
            onChange={(e, value) => {
              onChange && onChange(value.length !== 0 ? value : null)
            }}
            focusColor={'#0A2349'}
            focusShadow={'#DCE3F1'}
          />
        )
      } else {
        // untuk yang typing / tidak ada enpointnya
        return (
          <MyAutocomplete
            disableClearable={true}
            placeholder={'Enter your value'}
            freeSolo={true}
            multiple={true}
            isMultipleSmall={true}
            value={element?.value}
            onChange={(e, value) => {}}
            onInputFocus={(e) => getOptions()}
            focusColor={'#0A2349'}
            focusShadow={'#DCE3F1'}
          />
        )
      }
    } else if (element?.filter.type === 'boolean') {
      return (
        <div className="mx-auto">
          <MySwicth
            value={true}
            onChangeForm={(e) => {
              onChange && onChange(e.target.checked)
            }}
          />
        </div>
      )
    }
  }

  return inputComponent()
}

export default MyFilterModal
