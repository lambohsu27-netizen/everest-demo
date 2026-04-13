import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { myToaster } from '@interstellar-component'
import { useApp } from '@src/AppContext'
import { CompanyService } from './service'

const CompanyContext = createContext()

/** Gabungkan field dari `company_information` / `compliance_documents` ke root untuk header & subtitle. */
function enrichCompanyDetailPayload(data) {
  if (!data || typeof data !== 'object') return data
  const ci = data.company_information
  const out = { ...data }
  if (ci && typeof ci === 'object') {
    out.name = out.name ?? ci.name
    out.legal_name = out.legal_name ?? ci.legal_name
    out.email = out.email ?? ci.email
  }
  const cd = data.compliance_documents
  if (cd && typeof cd === 'object') {
    out.nib = out.nib ?? cd.nib
    out.npwp = out.npwp ?? cd.npwp
  }
  return out
}

/**
 * Gabungkan response detail per `type` agar header (nama, NIB, enrollment, dll.) tidak hilang
 * saat pindah tab — response result/billing sering tidak menyertakan `company_information`.
 */
function mergeCompanyDetail(prev, incoming, id) {
  const next = enrichCompanyDetailPayload(incoming)
  if (!next || typeof next !== 'object') return prev
  if (!prev || typeof prev !== 'object' || String(prev.id) !== String(id)) {
    return next
  }

  const ci = next.company_information ?? prev.company_information
  const cd = next.compliance_documents ?? prev.compliance_documents
  const gi =
    next.general_information !== undefined
      ? next.general_information
      : prev.general_information

  return {
    ...prev,
    ...next,
    company_information: ci,
    compliance_documents: cd,
    general_information: gi,
    activity: next.activity !== undefined ? next.activity : prev.activity,
    name: next.name ?? prev.name ?? ci?.name,
    legal_name: next.legal_name ?? prev.legal_name ?? ci?.legal_name,
    company_id: next.company_id ?? prev.company_id,
    enrollment_status: next.enrollment_status ?? prev.enrollment_status,
    enrollment_step: next.enrollment_step ?? prev.enrollment_step,
    nib: next.nib ?? prev.nib ?? cd?.nib,
    npwp: next.npwp ?? prev.npwp ?? cd?.npwp,
    email: next.email ?? prev.email ?? ci?.email,
  }
}

/** Subtitle di slider: NIB / company_id berformat / id. */
export function formatCompanyDetailSubtitle(detail) {
  if (!detail || typeof detail !== 'object') return ''
  const cd = detail.compliance_documents
  const nib = detail.nib ?? cd?.nib
  if (nib != null && String(nib).trim() !== '') return String(nib)
  const cid = detail.company_id
  if (cid != null && String(cid).trim() !== '') {
    const s = String(cid).trim()
    if (/^id[-\s]/i.test(s)) return s
    if (/^\d{10,}$/.test(s)) return s
    const rest = s.replace(/^id-?/i, '').trim()
    return rest ? `ID-${rest}` : ''
  }
  if (detail.id != null && String(detail.id).trim() !== '') return String(detail.id)
  return ''
}

/** Keep API row shape; only merge `checked` for table selection. */
function withSelectionRow(item) {
  if (!item || typeof item !== 'object') return null
  return { ...item, checked: Boolean(item.checked) }
}

/** Samakan dengan label chip: in progress → in_progress */
function normalizeEnrollmentStatusKey(status) {
  if (status == null || status === '') return ''
  return String(status)
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, '_')
}

/** MyColumn `field` → query `sort` param (backend snake_case). */
const SORT_FIELD_TO_API = {
  name: 'name',
  enrollment_status: 'enrollment_status',
  enrollment_step: 'enrollment_step',
}

function CompanyProvider({ children }) {
  const { setSlider } = useApp()

  const [currentSlider, setCurrentSlider] = useState({
    status: false,
    current: null,
    id: null,
  })

  const [company, setCompany] = useState({
    data: [],
    meta: {},
    filter: [],
    loading: false,
  })

  const [companyDetail, setCompanyDetail] = useState(null)
  const [isLoadingCompanyDetail, setIsLoadingCompanyDetail] = useState(false)

  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: '',
    filter: [],
    sort: null,
    order: null,
    status: 'All status',
  })

  useEffect(() => {
    const open = currentSlider.status && currentSlider.current === 'details-slider'
    setSlider(!!open)
  }, [currentSlider, setSlider])

  const fetchCompanyDetail = useCallback(async (id, query = {}) => {
    if (id == null || id === '') return
    setIsLoadingCompanyDetail(true)
    try {
      const res = await CompanyService.getDetailCompany(id, query)
      const d = res?.data !== undefined ? res.data : res
      setCompanyDetail((prev) => mergeCompanyDetail(prev, d, id))
    } catch (e) {
      myToaster(e)
      setCompanyDetail(null)
    } finally {
      setIsLoadingCompanyDetail(false)
    }
  }, [])

  const handleCurrentSlider = useCallback(
    (slider, id, listRow) => {
      if (slider?.current) {
        setCurrentSlider({
          status: true,
          current: slider.current,
          id: id ?? null,
        })
        if (slider.current === 'details-slider' && listRow && typeof listRow === 'object') {
          const resolvedId = id ?? listRow.id
          setCompanyDetail({
            id: resolvedId,
            name: listRow.name,
            legal_name: listRow.legal_name,
            company_id: listRow.company_id,
            enrollment_status: listRow.enrollment_status,
            enrollment_step: listRow.enrollment_step,
          })
        }
      } else {
        setCurrentSlider((v) => ({ ...v, current: null }))
        setTimeout(() => {
          setCurrentSlider({ status: false, current: null, id: null })
          setCompanyDetail(null)
        }, 200)
      }
    },
    []
  )

  const getCompany = useCallback(async () => {
    const limit = params.limit ?? 10
    const sortApi = params.sort ? SORT_FIELD_TO_API[params.sort] ?? params.sort : null
    const query = {
      page: params.page,
      limit,
      ...(params.search ? { search: params.search } : {}),
      ...(Array.isArray(params.filter) && params.filter.length > 0 ? { filter: params.filter } : {}),
      ...(sortApi ? { sort: sortApi } : {}),
      ...(params.order ? { order: params.order } : {}),
      ...(params.status && params.status !== 'All status' ? { enrollment_status: params.status } : {}),
    }
    setCompany((s) => ({ ...s, loading: true }))
    try {
      const res = await CompanyService.getCompany(query)
      const rawRows = Array.isArray(res.data) ? res.data : []
      let rows = rawRows.map((r) => withSelectionRow(r)).filter(Boolean)
      const statusFilter = params.status && params.status !== 'All status' ? params.status : null
      if (statusFilter) {
        const want = normalizeEnrollmentStatusKey(statusFilter)
        rows = rows.filter(
          (r) => normalizeEnrollmentStatusKey(r.enrollment_status) === want
        )
      }
      const rawMeta = res.meta
      const perPageForMeta = Number(rawMeta?.per_page ?? rawMeta?.limit ?? limit) || limit
      const totalForMeta = statusFilter ? rows.length : Number(rawMeta?.total ?? rows.length)
      const meta =
        rawMeta && typeof rawMeta === 'object' && !Array.isArray(rawMeta)
          ? {
              ...rawMeta,
              total: totalForMeta,
              total_page:
                statusFilter
                  ? Math.max(1, Math.ceil(totalForMeta / perPageForMeta))
                  : rawMeta.total_page ??
                    rawMeta.last_page ??
                    Math.max(1, Math.ceil(Number(rawMeta.total ?? rows.length) / perPageForMeta)),
            }
          : {
              current_page: 1,
              per_page: limit,
              total: rows.length,
              total_page: Math.max(1, Math.ceil(rows.length / perPageForMeta)),
            }
      setCompany({
        data: rows,
        meta,
        filter: res.filter ?? [],
        loading: false,
      })
    } catch (e) {
      myToaster(e)
      setCompany((s) => ({ ...s, loading: false }))
    }
  }, [params])

  useEffect(() => {
    getCompany()
  }, [getCompany])

  const handleCompanySort = useCallback(({ sort, order }) => {
    setParams((p) => ({
      ...p,
      page: 1,
      sort: sort ?? null,
      order: order ?? null,
    }))
  }, [])

  const handleCompanySelectionChange = useCallback((updated) => {
    setCompany((prev) => ({
      ...prev,
      data: updated.data,
    }))
  }, [])

  const setPage = useCallback((page) => {
    setParams((p) => ({ ...p, page }))
  }, [])

  const setSearchTerm = useCallback((search) => {
    setParams((p) => ({ ...p, page: 1, search }))
  }, [])

  const setSelectedStatus = useCallback((status) => {
    setParams((p) => ({ ...p, page: 1, status }))
  }, [])

  const companyRows = useMemo(
    () => (Array.isArray(company?.data) ? company.data : []),
    [company?.data]
  )

  const companyMeta = useMemo(() => {
    const m = company?.meta
    if (m && typeof m === 'object' && !Array.isArray(m)) return m
    return {
      current_page: 1,
      per_page: params.limit ?? 10,
      total: companyRows.length,
      total_page: 1,
    }
  }, [company?.meta, companyRows.length, params.limit])

  const contextValue = useMemo(
    () => ({
      params,
      setParams,
      company,
      companyRows,
      companyMeta,
      getCompany,
      handleCompanySort,
      handleCompanySelectionChange,
      companyDetail,
      isLoadingCompanyDetail,
      fetchCompanyDetail,
      currentSlider,
      handleCurrentSlider,
      setPage,
      searchTerm: params.search,
      setSearchTerm,
      selectedStatus: params.status,
      setSelectedStatus,
      sortField: params.sort,
      sortOrder: params.order,
    }),
    [
      params,
      company,
      companyRows,
      companyMeta,
      getCompany,
      handleCompanySort,
      handleCompanySelectionChange,
      companyDetail,
      isLoadingCompanyDetail,
      fetchCompanyDetail,
      currentSlider,
      handleCurrentSlider,
      setPage,
      setSearchTerm,
      setSelectedStatus,
    ]
  )

  return <CompanyContext.Provider value={contextValue}>{children}</CompanyContext.Provider>
}

const useCompany = () => {
  const context = useContext(CompanyContext)
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider')
  }
  return context
}

export { CompanyProvider, useCompany }
