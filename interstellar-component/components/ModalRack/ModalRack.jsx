import { useEffect, useState, useCallback } from 'react'
import {
  XClose,
  Flag05,
  LinkExternal02,
  Package,
  ArrowCircleRight,
  ChevronRight,
  Edit01,
  Trash01,
} from '@untitled-ui/icons-react'
import {
  MyButton,
  MyTextField,
  MyBgPatternDecorativeCircle,
  MyDataTable,
  MyColumn,
  MyCheckbox,
  MyButtonIcon,
  MyModal,
} from '@interstellar-component'
import { id } from 'date-fns/locale'
import SimpleBar from 'simplebar-react'
import MyLoadingData from '../Loading/MyLoadingData'

function ModalRack({
  asyncFunction,
  extraData = null,
  onConfirm,
  children,
  value,
  disabled,
  error,
  expanded = false,
  hideDeleteButton = false,
}) {
  if (!asyncFunction) throw new Error('asyncFunction is required')
  const [isOpen, setIsOpen] = useState(false)
  const [rackManagement, setRackManagement] = useState()
  const [params, setParams] = useState(null)
  const [title, setTitle] = useState('Select rack')
  const [selectedRackManagement, setSelectedRackManagement] = useState(null)
  const [parentRack, setParentRack] = useState([])
  const [mount, setMount] = useState(false)

  useEffect(() => {
    setRackManagement()
    // if (selectedRackManagement.title.length > 0) {
    //   setTitle(selectedRackManagement.title.join(' -> '))
    // } else {
    //   setTitle('Select rack')
    // }
    // console.log(params)
    if (mount) asyncFunction(params).then(setRackManagement)
    // showRackManagementList(currentModal).then((data) => {
    //   setValue('id', data?.id)
    //   setValue('name', data?.category?.type + ' ' + data?.index)
    //   const rackManagementData =
    //     Array.isArray(data) && data.length > 0 ? data : null
    //   setRackManagement({ data: rackManagementData })
    // })
  }, [params])
  // console.log('ini param modal rack', params)

  useEffect(() => {
    // console.log('JALAN RACK')
    setMount(true)
  }, [])

  return (
    <>
      <MyModal
        open={isOpen === true}
        children={
          <div className="relative flex w-[463px] flex-col gap-5 overflow-hidden rounded-lg bg-base-white">
            <header className="relative flex items-start gap-x-4 pt-6">
              <button
                onClick={() => {
                  setIsOpen(false)
                }}
                className="absolute right-[12px] top-[12px] z-10 flex h-11 w-11 items-center justify-center rounded-lg p-2"
              >
                <XClose
                  size={24}
                  className="text-gray-light/400"
                  stroke="currentColor"
                />
              </button>
              <div className="relative z-0 flex w-full flex-col gap-4 px-6">
                <MyBgPatternDecorativeCircle
                  children={
                    <div className="w-fit rounded-xl border p-3">
                      <Package />
                    </div>
                  }
                />
                <div className="z-40 flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-lg-semibold text-gray-light/900">
                      Select rack
                    </p>
                    <p className="text-sm-regular text-gray-light/600">
                      Select a rack and bin to put the iventory on.
                    </p>
                  </div>
                </div>
              </div>
            </header>
            <hr className="border-gray-light/200" />
            <div className="flex flex-1 items-center gap-3 px-6">
              <p
                className={`${rackManagement?.title?.length === 0 || !rackManagement?.title ? 'text-sm-semibold' : 'text-sm-medium'} ${rackManagement?.title?.length === 0 || !rackManagement?.title ? 'text-brand/700' : 'text-gray-light/600'}`}
              >
                Rack and bin
              </p>
              {rackManagement?.title?.length > 2 && (
                <div className="flex items-center gap-3 text-gray-light/600">
                  <ChevronRight className="size-4" stroke="currentColor" />
                  <p className="text-sm-semibold text-gray-light/600">...</p>
                </div>
              )}
              {rackManagement?.title?.slice(-2)?.map((e, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-gray-light/600"
                >
                  <ChevronRight className="size-4" stroke="currentColor" />
                  <p
                    key={i}
                    className={`${
                      rackManagement?.title?.[rackManagement?.title?.length - 1]
                        ?.id === e?.id
                        ? 'text-sm-semibold'
                        : 'text-sm-medium'
                    } ${
                      rackManagement?.title?.[rackManagement?.title?.length - 1]
                        ?.id === e?.id
                        ? 'text-brand/700'
                        : 'text-gray-light/600'
                    }`}
                  >{`${e?.name}`}</p>
                </div>
              ))}
            </div>
            <SimpleBar
              forceVisible="y"
              className="h-max"
              style={{ maxHeight: '250px' }}
            >
              {/* // && !rackManagement?.loading */}
              {rackManagement ? (
                <div className="flex flex-1 flex-col gap-3 px-6">
                  {rackManagement?.items?.map((e, i) => (
                    <div
                      key={i}
                      className="flex w-full items-center gap-3 rounded-xl border border-gray-light/200 p-4"
                    >
                      <div className="rounded-full bg-brand/100 p-2 text-brand/900">
                        <Package stroke="currentColor" className="size-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm-medium text-gray-light/700">
                          {e?.name}
                        </p>
                      </div>
                      {e?.children ? (
                        <MyButtonIcon
                          color="primary"
                          variant="text"
                          size="sm"
                          rounded="md"
                          onClick={() => {
                            // parentRack.push(e)
                            // setParentRack(parentRack)
                            setSelectedRackManagement(null)
                            // setSelectedRackManagement((prevState) => ({
                            //   title: [
                            //     ...prevState.title,
                            //     `${value?.category?.type} ${value?.index}`,
                            //   ],
                            //   selectedValue: value.id,
                            // }))
                            // handleCurrentModal({
                            //   status: true,
                            //   current: 'form-modal',
                            //   parent_id: value.id,
                            // })
                            setParams((value) => ({
                              ...value,
                              current_rack_id: null,
                              parent_id: e?.id,
                            }))
                          }}
                        >
                          <ArrowCircleRight
                            className="size-4"
                            stroke="currentColor"
                          />
                        </MyButtonIcon>
                      ) : (
                        <div className="flex size-10 items-center justify-center">
                          <MyCheckbox
                            // onClick={() => {
                            // try {
                            //   console.log('Current value:', value)
                            // Update the selected rack management state
                            // setSelectedRackManagement((prevState) => ({
                            //   title: [
                            //     ...prevState.title,
                            //     `${value?.category?.type} ${value?.index}`,
                            //   ],
                            //   selectedValue: value.id,
                            // }))
                            // Update the selected value context
                            //   setSelectedValue({
                            //     title: [
                            //       ...selectedRackManagement.title,
                            //       `${value?.category?.type} ${value?.index}`,
                            //     ],
                            //     selectedValue: value.id,
                            //   })
                            //   handleCurrentModal(null)
                            // } catch (error) {
                            //   console.error(
                            //     'Error occurred while handling click:',
                            //     error
                            //   )
                            // }
                            // }}

                            checked={selectedRackManagement?.id === e?.id}
                            onChangeForm={() => {
                              // console.log(e.target.checked)
                              setSelectedRackManagement(e)
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-24">
                  <MyLoadingData />
                </div>
              )}
            </SimpleBar>

            <hr className="border-gray-light/200" />

            <div className="flex flex-col gap-6 px-6">
              {/* Uncomment and use buttons if needed */}
              <div className="mb-6 flex gap-6">
                {rackManagement?.title?.length > 0 ? (
                  <MyButton
                    onClick={() => {
                      if (rackManagement?.title?.length === 1) {
                        setIsOpen(false)
                      }
                      rackManagement?.title.pop()
                      // console.log(rackManagement?.title)
                      // setParentRack(parentRack)
                      setSelectedRackManagement(null)

                      setParams((value) => ({
                        ...value,
                        current_rack_id: null,
                        parent_id:
                          rackManagement?.title?.length === 0
                            ? null
                            : rackManagement?.title?.[
                                rackManagement?.title?.length - 1
                              ]?.id,
                      }))
                    }}
                    expanded
                    color="secondary"
                    variant="outlined"
                    size="lg"
                  >
                    <p className="text-sm-semibold">Back</p>
                  </MyButton>
                ) : (
                  <MyButton
                    onClick={() => {
                      setIsOpen(false)
                    }}
                    expanded
                    color="secondary"
                    variant="outlined"
                    size="lg"
                  >
                    <p className="text-sm-semibold">Cancel</p>
                  </MyButton>
                )}
                <MyButton
                  disabled={!selectedRackManagement}
                  expanded
                  onClick={() => {
                    onConfirm && onConfirm(selectedRackManagement)
                    setIsOpen(false)
                  }}
                  color="primary"
                  variant="filled"
                  size="lg"
                >
                  <p className="text-sm-semibold">Confirm</p>
                </MyButton>
              </div>
            </div>
          </div>
          // <ModalRack
          //   asyncFunction={(e) => showRackManagementList(e)}
          //   extraData={{ id: 'a' }}
          //   onClose={() => {
          //     handleCurrentModal(null)
          //     setSelectedValue(null)
          //   }}
          //   onConfirm={(value) => {
          //     console.log('SETVALUE DISINI YAH BANG ', value)
          //     setValue()
          //     handleCurrentModal(null)
          //   }}
          // />
        }
        onClose={() => {
          setIsOpen(false)
        }}
      />
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex gap-2">
          <MyButton
            expanded={expanded}
            disabled={disabled}
            onClick={() => {
              setIsOpen(true)
              setParams({
                ...extraData,
                current_rack_id: value?.id,
              })
              setSelectedRackManagement(value)
            }}
            color="primary"
            variant="outlined"
            size="lg"
          >
            <div className="flex items-center justify-center gap-1">
              <p className="text-md-semibold whitespace-nowrap">
                {/* {console.log(value)} */}
                {value && Object.keys(value).length > 0
                  ? `${value?.selectedPrefix ?? ''}${value?.prefix ?? ''}${value?.index ?? ''}${value?.categories ?? ''}`
                  : 'Select rack'}
              </p>
              {value && Object.keys(value).length > 0 && (
                <Edit01 stroke="currentColor" />
              )}
            </div>
          </MyButton>
          {!hideDeleteButton && value && Object.keys(value).length > 0 && (
            <MyButton
              disabled={disabled}
              onClick={() => {
                onConfirm && onConfirm(null)
              }}
              color="error"
              variant="text"
              size="sm"
            >
              <Trash01 />
            </MyButton>
          )}
        </div>
      </div>
      {error && <p className="text-sm-medium text-error/600">{error}</p>}
    </>
  )
}

export default ModalRack
