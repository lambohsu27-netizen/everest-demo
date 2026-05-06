import React, { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { styled } from '@mui/material/styles'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'

const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: '50%',
  width: 16,
  height: 16,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 0 0 1px rgb(16 22 26 / 40%)'
      : 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
  backgroundColor: theme.palette.mode === 'dark' ? '#394b59' : '#f5f8fa',
  backgroundImage:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))'
      : 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
  '.Mui-focusVisible &': {
    outline: '2px auto rgba(19,124,189,.6)',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    backgroundColor: theme.palette.mode === 'dark' ? '#30404d' : '#ebf1f5',
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background:
      theme.palette.mode === 'dark'
        ? 'rgba(57,75,89,.5)'
        : 'rgba(206,217,224,.5)',
  },
}))

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: '#137cbd',
  backgroundImage:
    'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
  '&::before': {
    display: 'block',
    width: 16,
    height: 16,
    backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
    content: '""',
  },
  'input:hover ~ &': {
    backgroundColor: '#106ba3',
  },
})

function BpRadio(props) {
  return (
    <Radio
      disableRipple
      color="default"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      {...props}
    />
  )
}
const RadioButton = ({
  name,
  control,
  asyncFunction,
  optionLabel,
  optionValue,
  error,
  onChange,
  initValue,
}) => {
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOptions = async () => {
      setLoading(true)

      const data = await asyncFunction() // Panggil fungsi async yang diberikan

      if (data.data && Array.isArray(data.data)) {
        // Gunakan fungsi optionLabel dan optionValue untuk memproses data
        const processedOptions = data.data.map((item) => ({
          value: optionValue(item),
          label: optionLabel(item),
        }))
        setOptions(processedOptions)
      }
      setLoading(false)
    }

    if (initValue) {
    }
    loadOptions()
  }, [asyncFunction])

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <Controller
        name={name}
        control={control}
        render={({ field: { value }, fieldState: { error } }) => {
          if (!value && initValue) {
            initValue(options[0].value)
          }
          return (
            <>
              <RadioGroup
                value={value || null}
                onChange={(e) => onChange(e.target.value)}
              >
                {options.map((option) => (
                  <div key={option.value} className="flex items-center">
                    <BpRadio
                      value={option.value}
                      checked={value === option.value}
                    />
                    <span className="text-sm-semibold ml-3 text-gray-light/900">
                      {option.label}
                    </span>
                  </div>
                ))}
              </RadioGroup>
              {/* {error && <p style={{ color: 'red' }}>{error.message}</p>} */}
            </>
          )
        }}
      />
    </div>
  )
}

export default RadioButton
