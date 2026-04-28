import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useLocation, Outlet } from 'react-router-dom'
import { MyModalSlider, MyChildModalSlider } from '@interstellar-component'
import StackedPageSheet from '@src/components/StackedPageSheet'
import { useWorkforce } from '../../Context'
import { EmployeeDetailsSheetProvider, useEmployeeDetailsSheet } from './Context'
import NoEmployeeData from './NoEmployeeData'
import RenderEmployeeData from './RenderEmployeeData'
import LoanCategorySlider from '../../Sliders/LoanCategorySlider'
import LoanAccountSlider from '../../Sliders/LoanAccountSlider'

function EmployeeDetailsSheetInner() {
  const { id } = useParams()
  const location = useLocation()
  const {
    getEmployeeById,
    fetchWorkforceDetail,
    workforceDetailReport,
    workforceDetailPersonal,
    isLoadingReport,
    isLoadingPersonal,
    sliderStack,
    handleCurrentSlider,
  } = useWorkforce()
  const { currentTabs } = useEmployeeDetailsSheet()

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

  // Always fetch the report mode on mount/id change so the Report tab is
  // ready, and lazy-fetch the personal_information mode the first time the
  // user opens the Personal tab.
  useEffect(() => {
    if (id) fetchWorkforceDetail(id, 'report')
  }, [id, fetchWorkforceDetail])

  useEffect(() => {
    if (
      id
      && currentTabs.type === 'personal_information'
      && (!workforceDetailPersonal || String(workforceDetailPersonal.id) !== String(id))
    ) {
      fetchWorkforceDetail(id, 'personal_information')
    }
  }, [id, currentTabs.type, workforceDetailPersonal, fetchWorkforceDetail])

  const reportDetail = useMemo(
    () => (workforceDetailReport && String(workforceDetailReport.id) === String(id) ? workforceDetailReport : null),
    [workforceDetailReport, id]
  )
  const personalDetail = useMemo(
    () => (workforceDetailPersonal && String(workforceDetailPersonal.id) === String(id) ? workforceDetailPersonal : null),
    [workforceDetailPersonal, id]
  )

  // The header reads consent + identity from whichever mode is loaded; we
  // merge the row cache (list payload) so the avatar + name show before the
  // detail call resolves.
  const employee = useMemo(() => {
    const merged = { ...(rowCache || {}) }
    if (reportDetail) Object.assign(merged, reportDetail)
    if (personalDetail) Object.assign(merged, personalDetail)
    return merged.id ? merged : null
  }, [reportDetail, personalDetail, rowCache])

  const isLoadingDetail = currentTabs.type === 'personal_information' ? isLoadingPersonal : isLoadingReport

  return (
    <>
      {/* Loan category → account detail (parent-child slider like Nasabah) */}
      <MyModalSlider
        scrim
        open={sliderStack.length > 0 && sliderStack[0]?.current === 'loan-category'}
        element={<LoanCategorySlider />}
        onClose={() => handleCurrentSlider(null)}
      >
        <MyChildModalSlider
          scrim
          open={sliderStack.length > 1 && sliderStack[1]?.current === 'loan-account-detail'}
          width={420}
          element={<LoanAccountSlider />}
        />
      </MyModalSlider>
      <StackedPageSheet backUrl="/workforce" closeUrl="/workforce" isScrollFromTop={false}>
        {employee ? (
          <RenderEmployeeData
            employee={employee}
            reportDetail={reportDetail}
            personalDetail={personalDetail}
            isLoadingDetail={isLoadingDetail}
          />
        ) : isLoadingDetail ? (
          <div className="flex h-full items-center justify-center py-24">
            <p className="text-lg font-medium text-gray-500">Loading…</p>
          </div>
        ) : (
          <NoEmployeeData />
        )}
        <Outlet />
      </StackedPageSheet>
    </>
  )
}

export default function EmployeeDetailsSheet() {
  return (
    <EmployeeDetailsSheetProvider>
      <EmployeeDetailsSheetInner />
    </EmployeeDetailsSheetProvider>
  )
}
