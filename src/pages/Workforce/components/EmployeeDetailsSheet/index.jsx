import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useLocation, Outlet } from 'react-router-dom'
import StackedPageSheet from '@src/components/StackedPageSheet'
import { useWorkforce } from '../../Context'
import { EmployeeDetailsSheetProvider } from './Context'
import NoEmployeeData from './NoEmployeeData'
import RenderEmployeeData from './RenderEmployeeData'

export default function EmployeeDetailsSheet() {
  const { id } = useParams()
  const location = useLocation()
  const { getEmployeeById, fetchWorkforceDetail, workforceDetail, isLoadingWorkforceDetail } =
    useWorkforce()

  const navState = location.state?.row
  const liveRowCache = navState ?? getEmployeeById(id)
  const [rowCache, setRowCache] = useState(liveRowCache)
  const prevIdRef = useRef(id)

  useEffect(() => {
    if (prevIdRef.current !== id) {
      setRowCache(null)
      prevIdRef.current = id
    }
  }, [id])

  useEffect(() => {
    if (liveRowCache && String(liveRowCache.id) === String(id)) {
      setRowCache(liveRowCache)
    }
  }, [liveRowCache, id])

  useEffect(() => {
    if (id) fetchWorkforceDetail(id)
  }, [id, fetchWorkforceDetail])

  const employee = useMemo(() => {
    const detail = workforceDetail && String(workforceDetail.id) === String(id) ? workforceDetail : null
    if (detail) return { ...(rowCache || {}), ...detail }
    return rowCache
  }, [workforceDetail, rowCache, id])
  console.log(employee)
  return (
    <EmployeeDetailsSheetProvider>
      <StackedPageSheet backUrl="/workforce" closeUrl="/workforce" isScrollFromTop={false}>
        {employee ? (
          <RenderEmployeeData employee={employee} isLoadingDetail={isLoadingWorkforceDetail} />
        ) : isLoadingWorkforceDetail ? (
          <div className="flex h-full items-center justify-center py-24">
            <p className="text-lg font-medium text-gray-500">Loading…</p>
          </div>
        ) : (
          <NoEmployeeData />
        )}
        <Outlet />
      </StackedPageSheet>
    </EmployeeDetailsSheetProvider>
  )
}
