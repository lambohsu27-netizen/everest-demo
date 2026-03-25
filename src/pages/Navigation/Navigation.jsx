/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link, useLocation } from 'react-router-dom'
import {
  Menu01,
  XClose,
  LogOut04,
  HomeLine,
  BarChartSquare02,
  LayersThree01,
  CheckDone01,
  PieChart03,
  Users01,
  LifeBuoy01,
  Settings01,
  Rows01,
  Building07,
  PackageSearch,
} from '@untitled-ui/icons-react'
import { MyAvatar, MyTooltip, MyConfirmModal, MyButton, MyLogo } from '@interstellar-component'
import { useCookies } from 'react-cookie'
import { useApp } from '../../AppContext'
import { Access } from '../../services/Helper'

function Navigation({ childs }) {
  const { user, accesses, setAccesses } = useApp()
  const [cookies, setCookie, removeCookie] = useCookies(['token-backoffice'])

  const location = useLocation()

  const isAccessAllowed = (accessName) => true // dummy value to allow showing all pages

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLogoutConfirmOpen, setLogoutConfirmOpen] = useState(false)

  useEffect(() => {
    if (user && user.role && user.role.access) {
      const accessNames = user.role.access.map((access) => {
        const permissions = access?.menu_access?.access || []
        return {
          name: access.name,
          view: permissions?.view || false,
          edit_delete: permissions?.edit_delete || false,
          force_change_status: permissions?.fcs || false,
        }
      })
      setAccesses(accessNames)
    }
  }, [user])

  const logout = () => {
    localStorage.removeItem('user_id')
    localStorage.removeItem('email_forget_password')
    localStorage.removeItem('countdown_to_new_otp')
    removeCookie('token-backoffice', { path: '/' })
  }

  function NavItem({ icon, path, label, isAccess }) {
    const isActive = location?.pathname.includes(path)

    if (!isAccessAllowed(isAccess)) return null

    return (
      <Link to={path} onClick={() => setIsMobileMenuOpen(false)}>
        <MyTooltip
          placement="right"
          target={
            <div
              className={`${
                isActive
                  ? 'bg-gray-50 text-gray-700 drop-shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              } flex h-10 w-10 min-w-[40px] cursor-pointer items-center justify-center rounded-md transition-colors`}
            >
              {React.cloneElement(icon, { size: 20 })}
            </div>
          }
        >
          <p className="text-xs font-semibold text-white">{label}</p>
        </MyTooltip>
      </Link>
    )
  }

  return (
    <>
      <MyConfirmModal
        open={isLogoutConfirmOpen}
        title="Konfirmasi keluar"
        onClose={() => setLogoutConfirmOpen(false)}
        onConfirm={() => {
          setLogoutConfirmOpen(false)
          logout()
        }}
        message="Anda yakin ingin logout?"
        icon={<LogOut04 className="text-warning-600" />}
        bgColor="bg-error-100"
      />
      {/* Mobile Top Navigation */}
      <div className="absolute z-50 flex w-full items-center justify-between p-4 md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-500 hover:text-gray-700"
        >
          {isMobileMenuOpen ? <XClose /> : <Menu01 />}
        </button>
        <div className="flex items-center justify-center">
          <MyLogo height={32} width={32} />
        </div>
      </div>

      <main
        className={`fixed z-40 flex h-screen w-20 min-w-[64px] flex-col justify-between py-4 pl-4 pr-0 transition-transform duration-300 ease-in-out md:relative md:overflow-visible ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <section className="flex h-full w-16 flex-col items-center justify-between rounded-xl border border-gray-200 bg-white pt-5 pb-5 drop-shadow-[0_1px_2px_rgba(10,13,18,0.05)]">
          {/* TOP */}
          <div className="flex w-full flex-col items-center gap-y-4">
            <div className="flex items-center justify-center px-4">
              <MyLogo height={32} width={32} />
            </div>

            <div className="flex flex-col gap-0.5 px-3">
              <NavItem
                icon={<BarChartSquare02 />}
                path="/dashboard"
                label="Dashboard"
                isAccess={Access?.USER}
              />
              <NavItem
                icon={<Rows01 />}
                path="/report-enquiry"
                label="Report Enquiry"
                isAccess={Access?.USER}
              />
              <NavItem
                icon={<Users01 />}
                path="/workforce"
                label="Workforce"
                isAccess={Access?.USER}
              />
              <NavItem
                icon={<Building07 />}
                path="/company"
                label="Company"
                isAccess={Access?.APPROVAL}
              />
              <NavItem
                icon={<PackageSearch />}
                path="/audit-trail"
                label="Audit Trail"
                isAccess={Access?.DASHBOARD}
              />
            </div>
          </div>

          {/* BOTTOM */}
          <div className="flex w-full flex-col items-center gap-y-4">
            <div className="flex flex-col gap-0.5 px-3">
              <NavItem
                icon={<LifeBuoy01 />}
                path="/support"
                label="Support"
                isAccess={Access?.USER}
              />
              <NavItem
                icon={<Settings01 />}
                path="/settings"
                label="Settings"
                isAccess={Access?.SETTING}
              />
            </div>

            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
              <MyTooltip
                placement="right"
                target={
                  <div className="relative flex h-10 w-10 cursor-pointer items-center justify-center">
                    <MyAvatar
                      key={user?.photo_url || 'no-photo-avatar'}
                      size={40}
                      iconSize={20}
                      stroke="currentColor"
                      photo={
                        user?.photo_url ? `${user?.photo_url}?time=${new Date().getTime()}` : null
                      }
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#17b26a]" />
                  </div>
                }
              >
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-xs font-semibold text-white">Profile</span>
                  <p
                    className="text-white text-xs-semibold text-center cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault()
                      setLogoutConfirmOpen(true)
                    }}
                  >
                    Log Out
                  </p>
                </div>
              </MyTooltip>
            </Link>
          </div>
        </section>
      </main>
      {childs}
    </>
  )
}

Navigation.propTypes = {
  childs: PropTypes.node,
}

export default Navigation
