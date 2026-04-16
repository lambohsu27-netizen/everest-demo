import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useLocation, Outlet } from 'react-router-dom'
import { MyModalSlider, MyChildModalSlider } from '@interstellar-component'
import StackedPageSheet from '@src/components/StackedPageSheet'
import { useWorkforce } from '../../Context'
import { EmployeeDetailsSheetProvider } from './Context'
import NoEmployeeData from './NoEmployeeData'
import RenderEmployeeData from './RenderEmployeeData'
import LoanCategorySlider from '../../Sliders/LoanCategorySlider'
import LoanAccountSlider from '../../Sliders/LoanAccountSlider'

export default function EmployeeDetailsSheet() {
  const { id } = useParams()
  const location = useLocation()
  const { getEmployeeById, fetchWorkforceDetail, workforceDetail, isLoadingWorkforceDetail, sliderStack, handleCurrentSlider } =
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
  return (
    <EmployeeDetailsSheetProvider>
      {/* Loan category → account detail (parent-child slider like Nasabah) */}
      <MyModalSlider
        open={sliderStack.length > 0 && sliderStack[0]?.current === 'loan-category'}
        element={<LoanCategorySlider />}
        onClose={() => handleCurrentSlider(null)}
      >
        <MyChildModalSlider
          open={sliderStack.length > 1 && sliderStack[1]?.current === 'loan-account-detail'}
          width={420}
          element={<LoanAccountSlider />}
        />
      </MyModalSlider>
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
