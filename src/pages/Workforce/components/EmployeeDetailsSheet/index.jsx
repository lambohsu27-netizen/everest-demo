import React from 'react'
import { useParams } from 'react-router-dom'
import StackedPageSheet from '@src/components/StackedPageSheet'
import { useWorkforce } from '../../Context'
import NoEmployeeData from './NoEmployeeData'
import RenderEmployeeData from './RenderEmployeeData'

export default function EmployeeDetailsSheet() {
  const { id } = useParams()
  const { getEmployeeById } = useWorkforce()
  const employee = getEmployeeById(id)

  return (
    <StackedPageSheet backUrl="/workforce" closeUrl="/workforce">
      {employee ? <RenderEmployeeData employee={employee} /> : <NoEmployeeData />}
    </StackedPageSheet>
  )
}
