import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { myToaster } from '@interstellar-component'
import { useApp } from '@src/AppContext'
import { SettingsService } from '../../service'

const EmploymentSettingsContext = createContext()

function buildEmploymentLevelPayload(values) {
  const num = (s) => {
    const n = Number(String(s ?? '').replace(/\D/g, ''))
    return Number.isNaN(n) ? null : n
  }
  let consent = null
  if (values.consent_expiry instanceof Date) {
    consent = values.consent_expiry.toISOString().slice(0, 10)
  } else if (values.consent_expiry) {
    const s = String(values.consent_expiry)
    consent = s.includes('T') ? s.slice(0, 10) : s
  }
  const repeat =
    values.repeat_every && typeof values.repeat_every === 'object' && values.repeat_every.value != null
      ? values.repeat_every.value
      : typeof values.repeat_every === 'string'
        ? values.repeat_every
        : null
  return {
    name: values.name,
    salary_from: num(values.salary_from),
    salary_to: num(values.salary_to),
    currency: values.currency ?? 'IDR',
    consent_expiry: consent,
    repeat_every: repeat,
    is_active: values.is_active !== undefined ? Boolean(values.is_active) : true,
  }
}

function buildEmploymentPositionPayload(values) {
  const name =
    typeof values.name === 'string' ? values.name.trim() : values.name ?? ''
  return { name }
}

function EmploymentSettingsProvider({ children }) {
  const { setSlider } = useApp()

  const [currentSlider, setCurrentSlider] = useState({
    status: false,
    current: null,
    id: null,
  })

  const [positionSlider, setPositionSlider] = useState({
    status: false,
    current: null,
    id: null,
  })

  const [err, setErr] = useState(null)

  const [employmentLevel, setEmploymentLevel] = useState({
    data: [],
    meta: {},
    filter: [],
    loading: false,
  })

  const [employmentLevelDetail, setEmploymentLevelDetail] = useState(null)
  const [isLoadingEmploymentLevelDetail, setIsLoadingEmploymentLevelDetail] = useState(false)

  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: '',
    filter: [],
    sort: null,
    order: null,
  })

  const [employmentPosition, setEmploymentPosition] = useState({
    data: [],
    meta: {},
    filter: [],
    loading: false,
  })

  const [employmentPositionDetail, setEmploymentPositionDetail] = useState(null)
  const [isLoadingEmploymentPositionDetail, setIsLoadingEmploymentPositionDetail] = useState(false)

  const [positionParams, setPositionParams] = useState({
    page: 1,
    limit: 10,
    search: '',
    filter: [],
    sort: null,
    order: null,
  })

  useEffect(() => {
    const levelOpen =
      currentSlider.status &&
      (currentSlider.current === 'form-slider' || currentSlider.current === 'details-slider')
    const positionOpen =
      positionSlider.status &&
      (positionSlider.current === 'form-slider' || positionSlider.current === 'details-slider')
    setSlider(!!(levelOpen || positionOpen))
  }, [currentSlider, positionSlider, setSlider])

  const fetchEmploymentLevelDetail = useCallback(async (id) => {
    if (id == null || id === '') return
    setEmploymentLevelDetail(null)
    setIsLoadingEmploymentLevelDetail(true)
    try {
      const res = await SettingsService.getEmploymentLevelDetail(id)
      const d = res?.data !== undefined ? res.data : res
      setEmploymentLevelDetail(d)
    } catch (e) {
      myToaster(e)
      setEmploymentLevelDetail(null)
    } finally {
      setIsLoadingEmploymentLevelDetail(false)
    }
  }, [])

  const fetchEmploymentPositionDetail = useCallback(async (id) => {
    if (id == null || id === '') return
    setEmploymentPositionDetail(null)
    setIsLoadingEmploymentPositionDetail(true)
    try {
      const res = await SettingsService.getEmploymentPositionDetail(id)
      const d = res?.data !== undefined ? res.data : res
      setEmploymentPositionDetail(d)
    } catch (e) {
      myToaster(e)
      setEmploymentPositionDetail(null)
    } finally {
      setIsLoadingEmploymentPositionDetail(false)
    }
  }, [])

  const handleCurrentSlider = useCallback(
    (slider, id) => {
      if (slider?.current) {
        setCurrentSlider({
          status: true,
          current: slider.current,
          id: id ?? null,
        })
        setErr(null)
        if (slider.current === 'form-slider' && (id == null || id === '')) {
          setEmploymentLevelDetail(null)
        }
        if (
          id != null &&
          id !== '' &&
          (slider.current === 'details-slider' || slider.current === 'form-slider')
        ) {
          fetchEmploymentLevelDetail(id)
        }
      } else {
        setCurrentSlider((v) => ({ ...v, current: null }))
        setTimeout(() => {
          setCurrentSlider({ status: false, current: null, id: null })
          setEmploymentLevelDetail(null)
          setErr(null)
        }, 200)
      }
    },
    [fetchEmploymentLevelDetail]
  )

  const handlePositionSlider = useCallback(
    (slider, id) => {
      if (slider?.current) {
        setPositionSlider({
          status: true,
          current: slider.current,
          id: id ?? null,
        })
        setErr(null)
        if (slider.current === 'form-slider' && (id == null || id === '')) {
          setEmploymentPositionDetail(null)
        }
        if (
          id != null &&
          id !== '' &&
          (slider.current === 'details-slider' || slider.current === 'form-slider')
        ) {
          fetchEmploymentPositionDetail(id)
        }
      } else {
        setPositionSlider((v) => ({ ...v, current: null }))
        setTimeout(() => {
          setPositionSlider({ status: false, current: null, id: null })
          setEmploymentPositionDetail(null)
          setErr(null)
        }, 200)
      }
    },
    [fetchEmploymentPositionDetail]
  )

  const getEmploymentLevel = useCallback(async () => {
    const limit = params.limit ?? 10
    const query = {
      page: params.page,
      limit,
      ...(params.search ? { search: params.search } : {}),
      ...(Array.isArray(params.filter) && params.filter.length > 0 ? { filter: params.filter } : {}),
      ...(params.sort ? { sort: params.sort } : {}),
      ...(params.order ? { order: params.order } : {}),
    }
    setEmploymentLevel((s) => ({ ...s, loading: true }))
    try {
      const res = await SettingsService.getEmploymentLevel(query)
      const rows = Array.isArray(res.data) ? res.data : []
      const rawMeta = res.meta
      const perPageForMeta = Number(rawMeta?.per_page ?? rawMeta?.limit ?? limit) || limit
      const meta =
        rawMeta && typeof rawMeta === 'object' && !Array.isArray(rawMeta)
          ? {
              ...rawMeta,
              total_page:
                rawMeta.total_page ??
                rawMeta.last_page ??
                Math.max(
                  1,
                  Math.ceil(Number(rawMeta.total ?? rows.length) / perPageForMeta)
                ),
            }
          : {
              current_page: 1,
              per_page: limit,
              total: rows.length,
              total_page: 1,
            }
      setEmploymentLevel({
        data: rows,
        meta,
        filter: res.filter ?? [],
        loading: false,
      })
    } catch (e) {
      myToaster(e)
      setEmploymentLevel((s) => ({ ...s, loading: false }))
    }
  }, [params])

  const getEmploymentPosition = useCallback(async () => {
    const limit = positionParams.limit ?? 10
    const query = {
      page: positionParams.page,
      limit,
      ...(positionParams.search ? { search: positionParams.search } : {}),
      ...(Array.isArray(positionParams.filter) && positionParams.filter.length > 0
        ? { filter: positionParams.filter }
        : {}),
      ...(positionParams.sort ? { sort: positionParams.sort } : {}),
      ...(positionParams.order ? { order: positionParams.order } : {}),
    }
    setEmploymentPosition((s) => ({ ...s, loading: true }))
    try {
      const res = await SettingsService.getEmploymentPosition(query)
      const rows = Array.isArray(res.data) ? res.data : []
      const rawMeta = res.meta
      const perPageForMeta = Number(rawMeta?.per_page ?? rawMeta?.limit ?? limit) || limit
      const meta =
        rawMeta && typeof rawMeta === 'object' && !Array.isArray(rawMeta)
          ? {
              ...rawMeta,
              total_page:
                rawMeta.total_page ??
                rawMeta.last_page ??
                Math.max(
                  1,
                  Math.ceil(Number(rawMeta.total ?? rows.length) / perPageForMeta)
                ),
            }
          : {
              current_page: 1,
              per_page: limit,
              total: rows.length,
              total_page: 1,
            }
      setEmploymentPosition({
        data: rows,
        meta,
        filter: res.filter ?? [],
        loading: false,
      })
    } catch (e) {
      myToaster(e)
      setEmploymentPosition((s) => ({ ...s, loading: false }))
    }
  }, [positionParams])

  const handleEmpSort = useCallback(({ sort, order }) => {
    setParams((p) => ({
      ...p,
      page: 1,
      sort: sort ?? null,
      order: order ?? null,
    }))
  }, [])

  const handleEmpFilterChange = useCallback((filter) => {
    const filterArray = filter
      ? Object.values(filter).filter((f) => f.field && f.condition && f.value != null)
      : []
    setParams((p) => ({ ...p, page: 1, filter: filterArray }))
  }, [])

  const handleEmpSelectionChange = useCallback((updated) => {
    setEmploymentLevel((prev) => ({
      ...prev,
      data: updated.data,
    }))
  }, [])

  const handlePositionSort = useCallback(({ sort, order }) => {
    setPositionParams((p) => ({
      ...p,
      page: 1,
      sort: sort ?? null,
      order: order ?? null,
    }))
  }, [])

  const handlePositionFilterChange = useCallback((filter) => {
    const filterArray = filter
      ? Object.values(filter).filter((f) => f.field && f.condition && f.value != null)
      : []
    setPositionParams((p) => ({ ...p, page: 1, filter: filterArray }))
  }, [])

  const handlePositionSelectionChange = useCallback((updated) => {
    setEmploymentPosition((prev) => ({
      ...prev,
      data: updated.data,
    }))
  }, [])

  const deleteEmploymentLevels = useCallback(
    async (ids) => {
      const res = await SettingsService.deleteEmploymentLevel(ids)
      myToaster(res)
      setEmploymentLevelDetail(null)
      setCurrentSlider({ status: false, current: null, id: null })
      await getEmploymentLevel()
    },
    [getEmploymentLevel]
  )

  const deleteEmploymentPositions = useCallback(
    async (ids) => {
      const res = await SettingsService.deleteEmploymentPosition(ids)
      myToaster(res)
      setEmploymentPositionDetail(null)
      setPositionSlider({ status: false, current: null, id: null })
      await getEmploymentPosition()
    },
    [getEmploymentPosition]
  )

  const createEmploymentLevel = useCallback(
    async (values) => {
      setErr(null)
      try {
        const res = await SettingsService.createEmploymentLevel(buildEmploymentLevelPayload(values))
        myToaster(res)
        await getEmploymentLevel()
      } catch (e) {
        setErr(e?.message)
        throw e
      }
    },
    [getEmploymentLevel]
  )

  const updateEmploymentLevel = useCallback(
    async (values) => {
      setErr(null)
      const { id } = currentSlider
      if (id == null || id === '') {
        const missingIdError = new Error('Missing employment level id')
        setErr(missingIdError.message)
        throw missingIdError
      }
      try {
        const res = await SettingsService.updateEmploymentLevel(id, buildEmploymentLevelPayload(values))
        myToaster(res)
        await getEmploymentLevel()
      } catch (e) {
        setErr(e?.message)
        throw e
      }
    },
    [currentSlider, getEmploymentLevel]
  )

  const createEmploymentPosition = useCallback(
    async (values) => {
      setErr(null)
      try {
        const res = await SettingsService.createEmploymentPosition(buildEmploymentPositionPayload(values))
        myToaster(res)
        await getEmploymentPosition()
      } catch (e) {
        setErr(e?.message)
        throw e
      }
    },
    [getEmploymentPosition]
  )

  const updateEmploymentPosition = useCallback(
    async (values) => {
      setErr(null)
      const { id } = positionSlider
      if (id == null || id === '') {
        const missingIdError = new Error('Missing employment position id')
        setErr(missingIdError.message)
        throw missingIdError
      }
      try {
        const res = await SettingsService.updateEmploymentPosition(
          id,
          buildEmploymentPositionPayload(values)
        )
        myToaster(res)
        await getEmploymentPosition()
      } catch (e) {
        setErr(e?.message)
        throw e
      }
    },
    [positionSlider, getEmploymentPosition]
  )

  const value = useMemo(
    () => ({
      err,
      setErr,
      currentSlider,
      setCurrentSlider,
      handleCurrentSlider,
      params,
      setParams,
      employmentLevel,
      setEmploymentLevel,
      getEmploymentLevel,
      handleEmpSort,
      handleEmpFilterChange,
      handleEmpSelectionChange,
      employmentLevelDetail,
      isLoadingEmploymentLevelDetail,
      fetchEmploymentLevelDetail,
      deleteEmploymentLevels,
      createEmploymentLevel,
      updateEmploymentLevel,
      positionSlider,
      setPositionSlider,
      handlePositionSlider,
      positionParams,
      setPositionParams,
      employmentPosition,
      setEmploymentPosition,
      getEmploymentPosition,
      handlePositionSort,
      handlePositionFilterChange,
      handlePositionSelectionChange,
      employmentPositionDetail,
      isLoadingEmploymentPositionDetail,
      fetchEmploymentPositionDetail,
      deleteEmploymentPositions,
      createEmploymentPosition,
      updateEmploymentPosition,
    }),
    [
      err,
      currentSlider,
      handleCurrentSlider,
      params,
      employmentLevel,
      getEmploymentLevel,
      handleEmpSort,
      handleEmpFilterChange,
      handleEmpSelectionChange,
      employmentLevelDetail,
      isLoadingEmploymentLevelDetail,
      fetchEmploymentLevelDetail,
      deleteEmploymentLevels,
      createEmploymentLevel,
      updateEmploymentLevel,
      positionSlider,
      handlePositionSlider,
      positionParams,
      employmentPosition,
      getEmploymentPosition,
      handlePositionSort,
      handlePositionFilterChange,
      handlePositionSelectionChange,
      employmentPositionDetail,
      isLoadingEmploymentPositionDetail,
      fetchEmploymentPositionDetail,
      deleteEmploymentPositions,
      createEmploymentPosition,
      updateEmploymentPosition,
    ]
  )

  return (
    <EmploymentSettingsContext.Provider value={value}>{children}</EmploymentSettingsContext.Provider>
  )
}

const useEmploymentSettings = () => {
  const ctx = useContext(EmploymentSettingsContext)
  if (ctx === undefined) {
    throw new Error('useEmploymentSettings must be used within EmploymentSettingsProvider')
  }
  return ctx
}

export { EmploymentSettingsProvider, useEmploymentSettings }
