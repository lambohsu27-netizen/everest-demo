import NewEmployeeSlider from '../../Sliders/NewEmployeeSlider'

export default function EditEmployeeSlider({ employee, onClose }) {
  return <NewEmployeeSlider mode="edit" employee={employee} onClose={onClose} />
}
