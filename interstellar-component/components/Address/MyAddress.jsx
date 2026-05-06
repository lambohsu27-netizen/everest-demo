// import { default as PActionForm } from "./Form";
import { MyPopper, MyTextField } from '@interstellar-component'
import { Check } from '@untitled-ui/icons-react'
import { debounce } from 'lodash'
import { useEffect, useState } from 'react'
import SimpleBar from 'simplebar-react'

function MyAddress({
  target,
  data,
  tapList = [],
  onChangeTap,
  onChange,
  getOptionLabel,
  getOptionValue,
  asyncFunction,
  getOnRender,
  value,
  errors,
}) {
  if (!asyncFunction) throw new Error('asyncFunction is required')
  const [step, setStep] = useState(0)
  const [isOnChange, setIsOnChange] = useState(false)
  const [optionValue, setOptionValue] = useState(null)
  const [option, setOption] = useState({ loading: true, data: [] })
  const [params, setParams] = useState({ search: '' })
  const [mount, setMount] = useState(false)

  useEffect(() => {
    setOption({ loading: true, data: [] })

    if (getOnRender || mount) {
      console.log('dtep', step)
      asyncFunction(tapList[step], params, optionValue)?.then(setOption)
    }
  }, [params])

  const handleClickValue = (e, handleClose) => {
    if (step >= tapList.length - 1) {
      handleClose()
    } else {
      setStep((value) => value + 1)
    }

    console.log(optionValue, 'optionValue', step)

    const tempValue = {}
    const filterTapList = tapList.slice(0, step + 1)
    console.log('filterTapList', filterTapList)

    const keys = Object.keys(optionValue ?? {})
    for (let i = 0; i < filterTapList.length; i++) {
      if (keys.includes(filterTapList[i])) {
        tempValue[filterTapList[i]] = optionValue[filterTapList[i]]
      }
    }
    tempValue[tapList[step]] = e
    console.log(tempValue)
    setOptionValue(tempValue)
    // asyncFunction(tapList[step + 1], params, tempValue)?.then(setOption)
    setIsOnChange((value) => !value)
    // setParams((value) => ({
    //   ...value,
    //   search: '',
    // }))

    console.log('step', step, 'tapList.length', tapList)
  }
  const handleOnTap = (status, index) => {
    onChangeTap && onChangeTap(status)
    // asyncFunction(status, params, optionValue)?.then(setOption)
    setStep(index)
  }

  useEffect(() => {
    console.log('valuesfser', value)
    setOptionValue(value)
    setMount(true)
  }, [value])

  useEffect(() => {
    setParams((value) => ({
      ...value,
      search: '',
    }))
  }, [step])

  useEffect(() => {
    onChange && onChange(optionValue)
  }, [isOnChange])

  console.log(value)

  return (
    <MyPopper
      target={(e, handleClick) => {
        return (
          <div className="flex flex-col gap-1.5">
            {target(e, handleClick)}
            {errors && (
              <p className="text-sm-medium text-error/600">{errors}</p>
            )}
          </div>
        )
      }}
      placement="bottom-start"
      onOpen={() => {
        const lengthValue = Object.keys(value ?? {}).length
        if (lengthValue === 0) {
          setStep(0)
        } else if (lengthValue === tapList.length) {
          setStep(lengthValue - 1)
        } else {
          setStep(lengthValue)
        }
        // setStep(Object.keys(value ?? {}).length - 1)
        // setParams((value) => ({
        //   ...value,
        //   search: '',
        // }))
        // asyncFunction(tapList[step], params)?.then((value) => {
        //   setOption(value)
        // })
      }}
    >
      {(open, anchorEl, handleOpen, handleClose) => (
        <div className="flex h-max w-max flex-col">
          <div className="flex h-[320px] flex-col rounded-lg">
            <div className="flex">
              {tapList.map((e, i) => {
                return (
                  <button
                    type="button"
                    disabled={Object.keys(optionValue ?? {}).length < i}
                    className={`${Object.keys(optionValue ?? {}).length < i ? 'cursor-not-allowed' : ''}`}
                    onClick={() => handleOnTap(e, i)}
                  >
                    <div
                      className={` ${step >= i ? 'border-b-2 bg-brand/50' : ''} p-3`}
                    >
                      <p
                        className={`text-md-semibold ${step >= i ? 'text-brand/700' : 'text-gray-light/500'}`}
                      >
                        {e}
                      </p>
                    </div>
                  </button>
                )
              })}
              {/* <button
                type="button"
                disabled={step < 0}
                className={`${step < 0 ? 'cursor-not-allowed': ''}`}
                onClick={() => handleOnTap('provinsi', 0)}
              >
                <div
                  className={` ${step >= 0 ? 'border-b-2 bg-brand/50' : ''} p-3`}
                >
                  <p
                    className={`text-md-semibold ${step >= 0 ? 'text-brand/700' : 'text-gray-light/500'}`}
                  >
                    Provinsi
                  </p>
                </div>
              </button>
              <button
                type="button"
                disabled={step < 1}
                className={`${step < 1 ? 'cursor-not-allowed': ''}`}
                onClick={() => handleOnTap('kota', 1)}
              >
                <div
                  className={` ${step >= 1 ? 'border-b-2 bg-brand/50' : ''} p-3`}
                >
                  <p
                    className={`text-md-semibold ${step >= 1 ? 'text-brand/700' : 'text-gray-light/500'}`}
                  >
                    Kota
                  </p>
                </div>
              </button>
              <button
                disabled={step < 2}
                type="button"
                className={`${step < 2 ? 'cursor-not-allowed': ''}`}
                onClick={() => handleOnTap('kecamatan',2)}
              >
                <div
                  className={` ${step >= 2  ? 'border-b-2 bg-brand/50' : ''} p-3`}
                >
                  <p
                    className={`text-md-semibold ${step >= 2  ? 'text-brand/700' : 'text-gray-light/500'}`}
                  >
                    Kecamatan
                  </p>
                </div>
              </button>
              <button
                disabled={step < 3}
                type="button"
                className={`${step < 3 ? 'cursor-not-allowed': ''}`}
                onClick={() => handleOnTap('kode-pos',3)}
              >
                <div
                  className={` ${step >= 3 ? 'border-b-2 bg-brand/50' : ''} p-3`}
                >
                  <p  
                    className={`text-md-semibold ${step >= 3 ? 'text-brand/700' : 'text-gray-light/500'}`}
                  >
                    Kode pos
                  </p>
                </div>
              </button> */}
            </div>
            <div className="flex-1 overflow-hidden">
              <SimpleBar
                forceVisible="y"
                className="flex-1"
                style={{ maxHeight: '100%' }}
              >
                <div className="mt-2 px-2">
                  <MyTextField
                    value={params?.search}
                    onChangeForm={debounce((e) => {
                      return setParams((value) => ({
                        ...value,
                        search: e.target.value,
                      }))
                    }, 1000)}
                  />
                </div>
                <div className="flex flex-col">
                  {(option?.data ?? []).map((e, i) => {
                    return (
                      <button
                        key={i}
                        onClick={() => handleClickValue(e, handleClose)}
                        className="flex w-full items-center justify-between bg-white p-2.5 hover:bg-gray-light/50 focus:bg-gray-light/50"
                      >
                        <div>
                          <p className="text-md-medium text-left text-gray-light/900">
                            {getOptionLabel(e, tapList[step])}
                          </p>
                        </div>
                        <div>
                          {optionValue &&
                            Object.keys(optionValue).length &&
                            getOptionValue(
                              optionValue[tapList[step]],
                              tapList[step]
                            ) == getOptionValue(e, tapList[step]) && (
                              <Check
                                className="text-brand/900"
                                stroke="currentColor"
                              />
                            )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </SimpleBar>
            </div>
          </div>
        </div>
      )}
    </MyPopper>
  )
}

export default MyAddress
