import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ReportEnquiryContext = createContext()

const INITIAL_METRICS = [
  { label: 'All status', value: '382', active: true },
  { label: 'Awaiting Form', value: '1.201', active: false },
  { label: 'Verification', value: '382', active: false },
  { label: 'Form Revision', value: '2.201', active: false },
  { label: 'Sent to CLIK', value: '334', active: false },
  { label: 'Completed', value: '8.921', active: false },
  { label: 'Failed', value: '74', active: false },
  { label: 'Canceled', value: '43', active: false },
]

const INITIAL_ENQUIRIES = [
  {
    id: 1,
    order: 'REQ-000038',
    orderDate: '26 Jun 2026 17:00 PM',
    name: 'Phoenix Baker',
    employeeId: 'ID-00192',
    category: 'Employee',
    entity: 'PT Everest Maju Bersama',
    slaStatus: 'Sent to CLIK'
  },
  {
    id: 2,
    order: 'REQ-000037',
    orderDate: '26 Jun 2026 17:00 PM',
    name: 'Lisa Steiner',
    employeeId: 'ID-00193',
    category: 'Candidate',
    entity: 'PT Annapurna Tinggi Sejahtera',
    slaStatus: 'Awaiting Form'
  },
  {
    id: 3,
    order: 'REQ-000036',
    orderDate: '26 Jun 2026 17:00 PM',
    name: 'Drew Cano',
    employeeId: 'ID-00194',
    category: 'Candidate',
    entity: 'PT Annapurna Tinggi Sejahtera',
    slaStatus: 'Awaiting Form'
  },
  {
    id: 4,
    order: 'REQ-000035',
    orderDate: '26 Jun 2026 17:00 PM',
    name: 'Candace Wu',
    employeeId: 'ID-00195',
    category: 'Candidate',
    entity: 'PT Annapurna Tinggi Sejahtera',
    slaStatus: 'Form Revision'
  },
  {
    id: 5,
    order: 'REQ-000034',
    orderDate: '26 Jun 2026 17:00 PM',
    name: 'Andi Lane',
    employeeId: 'ID-00196',
    category: 'Candidate',
    entity: 'PT Annapurna Tinggi Sejahtera',
    slaStatus: 'Canceled'
  },
  {
    id: 6,
    order: 'REQ-000033',
    orderDate: '26 Jun 2026 17:00 PM',
    name: 'Natali Craig',
    employeeId: 'ID-00197',
    category: 'Candidate',
    entity: 'PT Annapurna Tinggi Sejahtera',
    slaStatus: 'Failed'
  },
  {
    id: 7,
    order: 'REQ-000032',
    orderDate: '26 Jun 2026 17:00 PM',
    name: 'Demi Wilkinson',
    employeeId: 'ID-00198',
    category: 'Candidate',
    entity: 'PT Annapurna Tinggi Sejahtera',
    slaStatus: 'Completed'
  },
]

function ReportEnquiryProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [metrics, setMetrics] = useState(INITIAL_METRICS)
  const [enquiries, setEnquiries] = useState(INITIAL_ENQUIRIES)
  const [sortField, setSortField] = useState(null)
  const [sortOrder, setSortOrder] = useState(null)
  const [sliderStack, setSliderStack] = useState([])

  const pushSlider = useCallback((slider) => {
    setSliderStack((prev) => [...prev, slider])
  }, [])

  const popSlider = useCallback(() => {
    setSliderStack((prev) => prev.slice(0, -1))
  }, [])

  const handleCurrentSlider = useCallback((value) => {
    if (value === null) {
      setSliderStack([])
    } else {
      setSliderStack([value])
    }
  }, [])

  const currentSlider = useMemo(
    () => (sliderStack.length > 0 ? sliderStack[sliderStack.length - 1] : null),
    [sliderStack]
  )

  const handleMetricClick = useCallback((label) => {
    setMetrics((prev) =>
      prev.map((m) => ({
        ...m,
        active: m.label === label,
      }))
    )
  }, [])

  const handleSort = useCallback(
    ({ sort, order }) => {
      setSortField(sort)
      setSortOrder(order)

      if (!sort || !order) {
        setEnquiries(INITIAL_ENQUIRIES)
        return
      }

      const sortedData = [...enquiries].sort((a, b) => {
        const valA = a[sort] || ''
        const valB = b[sort] || ''

        if (valA < valB) return order === 'asc' ? -1 : 1
        if (valA > valB) return order === 'asc' ? 1 : -1
        return 0
      })

      setEnquiries(sortedData)
    },
    [enquiries]
  )

  const handleSelectionChange = useCallback((updated) => {
    setEnquiries(updated.data)
  }, [])

  const contextValue = useMemo(
    () => ({
      searchTerm,
      setSearchTerm,
      metrics,
      handleMetricClick,
      enquiries,
      handleSort,
      handleSelectionChange,
      sortField,
      sortOrder,
      sliderStack,
      currentSlider,
      pushSlider,
      popSlider,
      handleCurrentSlider,
    }),
    [
      searchTerm,
      metrics,
      handleMetricClick,
      enquiries,
      handleSort,
      handleSelectionChange,
      sortField,
      sortOrder,
      sliderStack,
      currentSlider,
      pushSlider,
      popSlider,
      handleCurrentSlider,
    ]
  )

  return <ReportEnquiryContext.Provider value={contextValue}>{children}</ReportEnquiryContext.Provider>
}

const useReportEnquiry = () => {
  const context = useContext(ReportEnquiryContext)
  if (context === undefined) {
    throw new Error('useReportEnquiry must be used within a ReportEnquiryProvider')
  }
  return context
}

export { ReportEnquiryProvider, useReportEnquiry }
