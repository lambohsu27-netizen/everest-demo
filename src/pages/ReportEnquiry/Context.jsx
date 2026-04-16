import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { myToaster } from '@interstellar-component'
import Service from './service'

const ReportEnquiryContext = createContext()

const STATUS_MAP = {
  'All status': null,
  'Awaiting Form': 'awaiting_form',
  Verification: 'verification',
  'Form Revision': 'form_revision',
  'Sent to CLIK': 'sent_to_clik',
  Completed: 'completed',
  Failed: 'failed',
  Canceled: 'canceled',
}

const INITIAL_METRICS = [
  { label: 'All status', key: 'all_status', value: 0, active: true },
  { label: 'Awaiting Form', key: 'awaiting_form', value: 0, active: false },
  { label: 'Verification', key: 'verification', value: 0, active: false },
  { label: 'Form Revision', key: 'form_revision', value: 0, active: false },
  { label: 'Sent to CLIK', key: 'sent_to_clik', value: 0, active: false },
  { label: 'Completed', key: 'completed', value: 0, active: false },
  { label: 'Failed', key: 'failed', value: 0, active: false },
  { label: 'Canceled', key: 'canceled', value: 0, active: false },
]

const STATUS_DISPLAY = {
  awaiting_form: 'Awaiting Form',
  awaiting_admin: 'Awaiting Admin Approval',
  awaiting_consent: 'Awaiting Consent',
  verification: 'Verification',
  form_revision: 'Form Revision',
  sent_to_clik: 'Sent to CLIK',
  completed: 'Completed',
  failed: 'Failed',
  canceled: 'Canceled',
}

function ReportEnquiryProvider({ children }) {
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: '',
    category: '',
    status: '',
    sort: null,
    order: null,
    filter: [],
  })

  const [enquiry, setEnquiry] = useState({
    data: [],
    meta: {},
    filter: [],
  })

  const [metrics, setMetrics] = useState(INITIAL_METRICS)
  const [loading, setLoading] = useState(false)
  const [sliderStack, setSliderStack] = useState([])

  // ── Fetch list ────────────────────────────────────────────────────────
  const getList = useCallback(() => {
    setLoading(true)
    const apiParams = {
      page: params.page,
      limit: params.limit,
    }
    if (params.search) apiParams.search = params.search
    if (params.category) apiParams.category = params.category
    if (params.status) apiParams.status = params.status
    if (params.sort) apiParams.sort = params.sort
    if (params.order) apiParams.order = params.order

    // Apply filters
    if (Array.isArray(params.filter)) {
      params.filter.forEach((f) => {
        const key = f.field || f.name
        if (key && f.value) apiParams[key] = f.value
      })
    }

    Service.getList(apiParams)
      .then((res) => {
        const mappedData = (res.data || []).map((item) => ({
          id: item.id,
          order: item.reference_number,
          orderDate: new Date(item.created_at).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          name: item.workforce?.full_name || '-',
          employeeId: item.workforce?.workforce_code || '-',
          category: item.category === 'employee' ? 'Employee' : 'Candidate',
          entity: item.company?.name || '-',
          slaStatus: STATUS_DISPLAY[item.status] || item.status,
          _raw: item,
        }))

        setEnquiry({
          data: mappedData,
          meta: res.meta || {},
          filter: res.filter || [],
        })

        // Update metrics from response (when BE provides res.metrics)
        if (res.metrics) {
          setMetrics((prev) =>
            prev.map((m) => ({
              ...m,
              value: m.key === null
                ? res.metrics.total ?? 0
                : res.metrics[m.key] ?? 0,
            }))
          )
        }
      })
      .catch(myToaster)
      .finally(() => setLoading(false))
  }, [params])

  useEffect(() => {
    getList()
  }, [getList])

  // ── Metric click ──────────────────────────────────────────────────────
  const handleMetricClick = useCallback((label) => {
    setMetrics((prev) =>
      prev.map((m) => ({ ...m, active: m.label === label }))
    )
    setParams((prev) => ({
      ...prev,
      status: STATUS_MAP[label] || '',
      page: 1,
    }))
  }, [])

  // ── Sort ──────────────────────────────────────────────────────────────
  const handleSort = useCallback(({ sort, order }) => {
    setParams((prev) => ({ ...prev, sort, order, page: 1 }))
  }, [])

  // ── Selection ─────────────────────────────────────────────────────────
  const handleSelectionChange = useCallback((updated) => {
    setEnquiry((prev) => ({ ...prev, data: updated.data }))
  }, [])

  // ── Pagination ────────────────────────────────────────────────────────
  const handlePageChange = useCallback((newPage) => {
    setParams((prev) => ({ ...prev, page: newPage }))
  }, [])

  // ── Search ────────────────────────────────────────────────────────────
  const setSearchTerm = useCallback((value) => {
    setParams((prev) => ({ ...prev, search: value, page: 1 }))
  }, [])

  // ── Category tab ──────────────────────────────────────────────────────
  const setEnquiryCategory = useCallback((value) => {
    setParams((prev) => ({
      ...prev,
      category: value === 'all' ? '' : value,
      page: 1,
    }))
  }, [])

  // ── Filter modal ─────────────────────────────────────────────────────
  const handleFilter = useCallback((filter) => {
    setParams((prev) => ({
      ...prev,
      filter,
      page: 1,
      search: '',
    }))
  }, [])

  // ── Export ────────────────────────────────────────────────────────────
  const downloadExport = useCallback(() => {
    const url = Service.downloadExport(params)
    if (url) window.open(url, '_blank')?.focus()
  }, [params])

  // ── Slider stack ──────────────────────────────────────────────────────
  const pushSlider = useCallback((slider) => {
    setSliderStack((prev) => {
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

  const currentSlider = useMemo(
    () =>
      sliderStack.length > 0
        ? sliderStack[sliderStack.length - 1]
        : null,
    [sliderStack]
  )

  // ── Derived state ─────────────────────────────────────────────────────
  const pagination = useMemo(
    () => ({
      page: enquiry.meta?.current_page ?? params.page,
      limit: params.limit,
      total: enquiry.meta?.total ?? 0,
      total_pages: enquiry.meta?.total_page ?? 1,
    }),
    [enquiry.meta, params.page, params.limit]
  )

  const enquiryCategory = useMemo(
    () => params.category || 'all',
    [params.category]
  )

  const contextValue = useMemo(
    () => ({
      // Data
      enquiries: enquiry.data,
      pagination,
      metrics,
      loading,
      filters: enquiry.filter,

      // Search & filter
      searchTerm: params.search,
      setSearchTerm,
      enquiryCategory,
      setEnquiryCategory,
      handleMetricClick,
      handleFilter,
      downloadExport,

      // Sort
      sortField: params.sort,
      sortOrder: params.order,
      handleSort,

      // Selection
      handleSelectionChange,

      // Pagination
      setPage: handlePageChange,

      // Slider
      sliderStack,
      currentSlider,
      pushSlider,
      popSlider,
      handleCurrentSlider,

      // Refresh
      getList,
    }),
    [
      enquiry.data,
      pagination,
      metrics,
      loading,
      enquiry.filter,
      params.search,
      setSearchTerm,
      enquiryCategory,
      setEnquiryCategory,
      handleMetricClick,
      handleFilter,
      downloadExport,
      params.sort,
      params.order,
      handleSort,
      handleSelectionChange,
      handlePageChange,
      sliderStack,
      currentSlider,
      pushSlider,
      popSlider,
      handleCurrentSlider,
      getList,
    ]
  )

  return (
    <ReportEnquiryContext.Provider value={contextValue}>
      {children}
    </ReportEnquiryContext.Provider>
  )
}

const useReportEnquiry = () => {
  const context = useContext(ReportEnquiryContext)
  if (context === undefined) {
    throw new Error(
      'useReportEnquiry must be used within a ReportEnquiryProvider'
    )
  }
  return context
}

export { ReportEnquiryProvider, useReportEnquiry }
