/* eslint-disable jsx-a11y/label-has-associated-control */

/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useEffect, useMemo, useState } from 'react'
import { Calendar } from 'react-date-range'
import { ChevronLeft, ChevronRight, AlertTriangle } from '@untitled-ui/icons-react'
import { format, isAfter, isBefore, isSameDay, isWithinInterval, parse } from 'date-fns'
import { TimePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { TextField } from '@mui/material'
import MyButton from '../Button/MyButton'
import MyTextField from '../TextField/MyTextField'
import MyPopper from '../Popper/MyPopper'

function MyCalendar({ target, value = null, showTime, minDate, maxDate, onChange, control }) {
  const [isInvalidDate, setIsInvalidDate] = useState(false)
  const [inputDate, setInputDate] = useState(value && format(value, 'MMM d, yyyy'))
  const [date, setDate] = useState()
  const [time, setTime] = useState(dayjs()) // Initialize with some default value

  const isDisabledToday = useMemo(() => {
    let disabled = false

    if (minDate && maxDate) {
      disabled = !isWithinInterval(new Date(), {
        start: minDate,
        end: maxDate,
      })
    } else if (minDate) {
      disabled = !isAfter(new Date(), minDate)
    } else if (maxDate) {
      disabled = !isBefore(new Date(), maxDate)
    }

    return disabled
  }, [minDate, maxDate])

  const timeXs = {
    // Styles for the TextField
    '& .MuiInputBase-root': {
      borderRadius: '8px',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      boxShadow: '0px 1px 2px 0px #1018280D',
      backgroundColor: '#FFFFFF',
      border: '1px solid #D0D5DD',
      '&.Mui-error': { border: '1px solid #FDA29B' },
      '& .MuiInputBase-input::placeholder': {
        fontSize: '16px',
        fontFamily: "'Inter', sans-serif",
        fontWeight: '400',
        lineHeight: '24px',
        wordWrap: 'break-word',
        color: '#667085',
        opacity: 1,
      },
      '&.Mui-focused': {
        // border: '1px solid #8ED8F6',
        // boxShadow: '0px 0px 0px 4px #72C8EB3D',
        boxShadow: `inset 0 0 0 2px #365CC3`,
      },
      '&.Mui-focused.Mui-error': {
        border: '1px solid #FDA29B',
        boxShadow: '0px 0px 0px 4px #F044383D, 0px 1px 2px 0px #1018280D',
      },
      '& .MuiInputBase-input': {
        padding: '0px',
        margin: '10px 14px',
        textAlign: 'left',
        appearance: 'none',
      },
      '&.Mui-disabled': { backgroundColor: '#F9FAFB', cursor: 'not-allowed' },
      '&.Mui-disabled .MuiInputBase-input': {
        WebkitTextFillColor: '#667085',
        color: '#667085',
      },
      '& .MuiInputAdornment-root': {
        height: '100%',
        maxHeight: 'unset',
        paddingTop: '0px',
        paddingBottom: '0px',
        margin: '0px',
      },
      '& fieldset': { padding: 0, border: 'none' },
      '&:hover fieldset': { border: 'none' },
      '&.Mui-focused fieldset': { border: 'none' },
      '&.Mui-disabled fieldset': { border: 'none' },
    },
    // Styles for the FormHelperText
    '& .MuiFormHelperText-root': {
      margin: '0px !important',
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '20px',
      wordWrap: 'break-word',
      color: '#475467',
      '&.Mui-error': { color: '#D92D20' },
    },
  }

  useEffect(() => {
    if (date) {
      setInputDate(format(date, 'MMM d, yyyy'))
      setIsInvalidDate(false)
    }
  }, [date])
  useEffect(() => {
    if (value) {
      setDate(new Date(value))

      showTime && setTime(dayjs(value))
      setInputDate(format(value, 'MMM d, yyyy'))
    }
  }, [value])

  return (
    <MyPopper target={target} placement="bottom-start">
      {(open, anchorEl, show, close) => (
        <div className="flex w-[328px] flex-col">
          <div className="flex flex-col gap-3 px-6 py-5">
            <Calendar
              months={1}
              minDate={minDate}
              maxDate={maxDate}
              onChange={(item) => setDate(item)}
              date={date}
              navigatorRenderer={(focusedDate, changeShownDate, props) => (
                <div className="flex flex-col gap-3 pb-3" onMouseUp={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => changeShownDate(-1, 'monthOffset')}
                      className="flex h-10 w-10 items-center justify-center p-2"
                    >
                      <ChevronLeft className="size-5" stroke="currentColor" />
                    </button>
                    <p className="text-md-semibold text-gray-light/700">
                      {format(focusedDate, 'MMMM yyyy')}
                    </p>
                    <button
                      onClick={() => changeShownDate(+1, 'monthOffset')}
                      className="flex h-10 w-10 items-center justify-center p-2"
                    >
                      <ChevronRight className="size-5" stroke="currentColor" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <MyTextField
                      value={inputDate}
                      isRealtime
                      placeholder="MMM d, yyyy"
                      isError={isInvalidDate}
                      onChangeForm={(e) => setInputDate(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const parsedDate = parse(e.target.value, 'MMM d, yyyy', new Date())

                          let valid = true
                          if (isNaN(parsedDate.getTime())) valid = false

                          if (
                            minDate &&
                            maxDate &&
                            !isSameDay(parsedDate, minDate) &&
                            !isSameDay(parsedDate, maxDate)
                          ) {
                            valid = isWithinInterval(parsedDate, {
                              start: minDate,
                              end: maxDate,
                            })
                          } else if (minDate && !isSameDay(parsedDate, minDate)) {
                            valid = isAfter(parsedDate, minDate)
                          } else if (maxDate && !isSameDay(parsedDate, maxDate)) {
                            valid = isBefore(parsedDate, maxDate)
                          }

                          if (valid) {
                            changeShownDate(parsedDate)
                            setDate(parsedDate)
                          } else {
                            setIsInvalidDate(true)
                          }
                        }
                      }}
                      endAdornment={
                        isInvalidDate && (
                          <AlertTriangle className="size-5 text-error/700" stroke="currentColor" />
                        )
                      }
                    />
                    <MyButton
                      disabled={isDisabledToday}
                      color="secondary"
                      variant="outlined"
                      size="md"
                      onClick={() => {
                        if (!isDisabledToday) {
                          const now = new Date()
                          changeShownDate(now)
                          setDate(now)
                        }
                      }}
                    >
                      <p className="text-sm-semibold">Today</p>
                    </MyButton>
                  </div>
                </div>
              )}
              showMonthAndYearPickers={false}
              weekStartsOn={1}
              weekdayDisplayFormat="EEEEEE"
              rangeColors={['#55B3D9']}
              color="#55B3D9"
            />
            {showTime && (
              <div className="flex w-full justify-center">
                <div className="flex flex-col gap-0.5">
                  <TimePicker
                    value={time}
                    ampm={false}
                    sx={timeXs}
                    slotProps={{
                      textField: {
                        error: false,
                      },
                    }}
                    onChange={(newValue) => {
                      console.log('onChange', newValue)
                      setTime(dayjs(newValue))
                    }}
                  />
                  <div>
                    <label className="text-sm-regular text-[#aeb9bf]">
                      * Format time is 24 hours
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
          <footer className="flex items-center gap-3 border-t border-gray-light/200 p-4">
            <div className="flex-1">
              <MyButton expanded color="secondary" variant="outlined" size="md" onClick={close}>
                <p className="text-sm-semibold">Cancel</p>
              </MyButton>
            </div>
            <div className="flex-1">
              <MyButton
                expanded
                disabled={!date || isInvalidDate}
                color="primary"
                variant="filled"
                size="md"
                onClick={() => {
                  if (date) {
                    const _date = parse(
                      time && showTime ? time.format('HH:mm:ss') : '00:00:00',
                      'HH:mm:ss',
                      date
                    )
                    onChange && onChange(_date)
                    close()
                  }
                }}
              >
                <p className="text-sm-semibold">Apply</p>
              </MyButton>
            </div>
          </footer>
        </div>
      )}
    </MyPopper>
  )
}

export default MyCalendar
