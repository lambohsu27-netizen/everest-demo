import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const ReportEnquiryContext = createContext()

const INITIAL_METRICS = [
  { label: 'All status', value: '382', active: true },
  { label: 'Awaiting Admin', value: '12', active: false },
  { label: 'Awaiting Consent', value: '8', active: false },
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
    slaStatus: 'Awaiting Admin Approval'
  },
  {
    id: 11,
    order: 'REQ-000039',
    orderDate: '27 Jun 2026 10:00 AM',
    name: 'Drew Cano',
    employeeId: 'ID-00199',
    category: 'Candidate',
    entity: 'PT Annapurna Tinggi Sejahtera',
    slaStatus: 'Awaiting Consent'
  },
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
  const [enquiryCategory, setEnquiryCategory] = useState('all')
  const [page, setPage] = useState(1)
  const [sliderStack, setSliderStack] = useState([])

  const pushSlider = useCallback((slider) => {
    setSliderStack((prev) => {
      // Prevent duplicate sliders of the same type
      if (prev.some((s) => s.current === slider.current)) return prev
      return [...prev, slider]
    })
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

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage)
  }, [])

  // Reset page to 1 when search or filtered category changes
  useEffect(() => {
    setPage(1)
  }, [searchTerm, enquiryCategory])

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

  const filteredEnquiries = useMemo(() => {
    let result = enquiries
    if (enquiryCategory !== 'all') {
      result = result.filter((e) => e.category.toLowerCase() === enquiryCategory)
    }
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase()
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(lowerSearch) ||
          e.order.toLowerCase().includes(lowerSearch) ||
          e.employeeId.toLowerCase().includes(lowerSearch)
      )
    }
    // Note: If you want to filter by active metric, add that logic here
    return result
  }, [enquiries, searchTerm, enquiryCategory])

  const limit = 10
  const paginatedEnquiries = useMemo(() => {
    const start = (page - 1) * limit
    return filteredEnquiries.slice(start, start + limit)
  }, [filteredEnquiries, page])

  const pagination = useMemo(
    () => ({
      page,
      limit,
      total: filteredEnquiries.length,
      total_pages: Math.ceil(filteredEnquiries.length / limit),
    }),
    [filteredEnquiries.length, page]
  )

  const contextValue = useMemo(
    () => ({
      searchTerm,
      setSearchTerm,
      metrics,
      handleMetricClick,
      enquiryCategory,
      setEnquiryCategory,
      enquiries: paginatedEnquiries,
      pagination,
      setPage: handlePageChange,
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
      enquiryCategory,
      setEnquiryCategory,
      paginatedEnquiries,
      pagination,
      handlePageChange,
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
