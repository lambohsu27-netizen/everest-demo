import React, { useEffect, useState } from 'react'
import { Plus, Trash01, XClose } from '@untitled-ui/icons-react'
import { Eraser } from '@untitled-ui/icons-react'
import { debounce } from 'lodash'
import MyCalendar from '../DatePicker/MyCalendar'
import { format, formatISO, parse, parseISO } from 'date-fns'
import MyBgPatternDecorativeCircle from '../Decorative/MyBgPatternDecorativeCircle'
import MyAutocomplete from '../Autocomplete/MyAutocomplete'
import MyTextField from '../TextField/MyTextField'
import MySwicth from '../Switch/MySwitch'
import { MyPopper, myToaster } from '@interstellar-component'
import { get } from '../../../src/services/NetworkUtils'

const MyFilterReportModal = ({ id, target, currentFilters, onChange }) => {
  const initialFilter = {
    field: null,
    condition: {
      label: 'is',
      value: 'like',
    },
    value: null,
    operator: { label: 'and', value: 'and' },
    filter: null,
  }
  const [options, setOptions] = useState([])
  const [filter, setFilter] = useState([initialFilter])
  const addFilter = () => {
    var data = { field: null, condition: null, value: null, operator: null }
    if (filter.length == 1) data.operator = { label: 'and', value: 'and' }
    if (filter.length >= 2) {
      data.operator = filter[1].operator
    }

    const newFilter = [...filter, data]
    setFilter(newFilter)
  }
  const duplicateFilter = (idx, prev) => {
    var data = {
      field: prev.field,
      condition: {
        label: 'is',
        value: 'like',
      },
      value: null,
      operator: { label: 'and', value: 'and' },
      filter: prev.filter,
    }

    const newFilter = [...filter]
    newFilter.splice(idx + 1, 0, data)

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
    setFilter([initialFilter])
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
    // temp[index].condition = value;
    temp[index].condition = {
      label: 'is',
      value: 'like',
    }

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

    console.log('filter', filter)
  }, [filter])
  useEffect(() => {
    setOptions(currentFilters)
  }, [currentFilters])
  return (
    <>
      <MyPopper
        id={id}
        haveValue={filter.filter((e) => e.value)?.length}
        target={target}
        placement={'bottom-start'}
      >
        {(open, anchorEl, show, close) => (
          <div className="flex w-[666px] flex-col">
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
                      <div className="hidden w-24">
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
                            // value={e?.operator}
                            value="and"
                            placeholder={'-'}
                            onChange={(e, value) =>
                              handleChangeOperator(e, value, i)
                            }
                          />
                        ) : (
                          <div className="px-[14px] py-2">
                            <p className="tex-md-regular text-gray-light/900">
                              {e?.operator?.label}
                            </p>
                          </div>
                        )}
                      </div>
                      <div
                        className={`flex-1 ${i > 0 && filter[i - 1]?.filter?.label == e?.filter?.label ? 'invisible' : ''}`}
                      >
                        <MyAutocomplete
                          disableClearable={true}
                          value={e?.filter}
                          placeholder={'Field'}
                          options={options}
                          isOptionEqualToValue={(option, value) =>
                            option?.name === value?.name
                          }
                          onChange={(e, value) => {
                            handleChangeField(e, value, i)
                            handleChangeCondition(e, value, i)
                          }}
                          onInputFocus={() => {
                            const fltr = filter.map((e) => e?.filter?.label)
                            const fltrd = currentFilters.filter(
                              (e) => !fltr.includes(e?.label)
                            )
                            setOptions(fltrd)
                            // setOptions(currentFilters);
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
                        />
                      </div>
                      <div className="hidden flex-1">
                        {e?.filter?.options && (
                          <MyAutocomplete
                            disableClearable={true}
                            options={e?.filter?.options ?? []}
                            // value={e.condition}
                            value={{
                              label: 'is',
                              value: 'like',
                            }}
                            placeholder={'Condition'}
                            isOptionEqualToValue={(option, value) =>
                              option.value === value.value
                            }
                            onChange={(e, value) =>
                              handleChangeCondition(e, value, i)
                            }
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        {e?.condition && e?.filter && (
                          <FilterInput
                            element={e}
                            filter={filter}
                            onChange={(value) => handleChangeValue(value, i)}
                          />
                        )}
                      </div>
                      <button onClick={(e) => removeFilter(i)} className="p-3">
                        <Trash01
                          size={20}
                          className={'text-gray-light/600'}
                          stroke={'#B42318'}
                        />
                      </button>
                      <button
                        onClick={(x) => duplicateFilter(i, e)}
                        className={`p-3 ${i >= 0 && filter[i + 1]?.filter?.label == e?.filter?.label ? 'invisible' : ''}`}
                      >
                        <Plus
                          size={20}
                          className={'text-gray-light/600'}
                          stroke={'#359BC4'}
                        />
                      </button>
                    </div>
                  )
                })}
              </div>

              <div className="flex items-center justify-between p-6 px-4 pt-8">
                <button onClick={addFilter} className="flex items-center gap-2">
                  <Plus
                    size={20}
                    className={'text-gray-light/600'}
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
                    size={20}
                    className={'text-gray-light/600'}
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
const FilterInput = ({ element, onChange, filter }) => {
  const [options, setOptions] = useState([])
  const getOptions = async ({ search = '' } = {}) => {
    await get(element?.filter.path, { search: search })
      .then((res) => {
        // bingung dari mana tau pake labelnya, buat option
        console.log('res', res)
        let my = filter.map((e) => e.value?.id)
        let data = res.data.filter((e) => !my.includes(e.id))
        setOptions(data)
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
          target={(open, handleClick) => (
            <MyTextField
              readOnly={true}
              isRealtime={true}
              placeholder={'Enter your date'}
              value={
                element.value && format(parseISO(element.value), 'MMM d, yyyy')
              }
              onTapForm={handleClick}
            />
          )}
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

export default MyFilterReportModal
