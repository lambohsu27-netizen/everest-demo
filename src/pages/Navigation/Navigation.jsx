/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link, useLocation } from 'react-router-dom'
import {
  Menu01,
  XClose,
  LogOut04,
  BarChartSquare02,
  Users01,
  Settings01,
  Rows01,
  Building07,
  PackageSearch,
  MessageSmileSquare,
  FileLock02,
  User01, // Icon tambahan untuk View Profile
} from '@untitled-ui/icons-react'
import { MyAvatar, MyTooltip, MyConfirmModal, MyLogo } from '@interstellar-component'
import { useCookies } from 'react-cookie'
import { useApp } from '../../AppContext'
import { Access } from '../../services/Helper'

function Navigation() {
  const { user, hasPermission } = useApp()
  const [, , removeCookie] = useCookies(['token-backoffice'])
  const location = useLocation()

  // State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLogoutConfirmOpen, setLogoutConfirmOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false) // State untuk Dropdown Profile

  const isAccessAllowed = (moduleKey) => !moduleKey || hasPermission(moduleKey)

  const hasSettingsAccess =
    hasPermission(Access.GENERAL_SETTINGS) ||
    hasPermission(Access.EMPLOYEE_LEVEL) ||
    hasPermission(Access.USER_MANAGEMENT) ||
    hasPermission(Access.ROLE_ACCESS) ||
    hasPermission(Access.CONSENT_EDITOR)

  const logout = () => {
    localStorage.removeItem('user_id')
    localStorage.removeItem('email_forget_password')
    localStorage.removeItem('countdown_to_new_otp')
    removeCookie('token-backoffice', { path: '/' })
    removeCookie('refresh-token-backoffice', { path: '/' })
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
      {/* Modal Konfirmasi Logout */}
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm transition-opacity">
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
        </div>
      )}

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
          {/* TOP SECTION */}
          <div className="flex w-full flex-col items-center gap-y-4">
            <div className="flex items-center justify-center px-4">
              <MyLogo height={32} width={32} />
            </div>

            <div className="flex flex-col gap-0.5 px-3">
              <NavItem
                icon={<BarChartSquare02 />}
                path="/dashboard"
                label="Dashboard"
                isAccess={Access.DASHBOARD}
              />
              <NavItem
                icon={<Rows01 />}
                path="/report-enquiry"
                label="Report Enquiry"
                isAccess={Access.ENQUIRY}
              />
              <NavItem
                icon={<Users01 />}
                path="/workforce"
                label="Workforce"
                isAccess={Access.WORKFORCE}
              />
              <NavItem
                icon={<Building07 />}
                path="/company"
                label="Company"
                isAccess={Access.COMPANY}
              />
              <NavItem
                icon={<PackageSearch />}
                path="/audit-trail"
                label="Audit Trail"
                isAccess={Access.AUDIT_TRAIL}
              />
            </div>
          </div>

          {/* BOTTOM SECTION */}
          <div className="flex w-full flex-col items-center gap-y-4">
            <div className="flex flex-col gap-0.5 px-3">
              {hasSettingsAccess && (
                <NavItem icon={<Settings01 />} path="/settings" label="Settings" isAccess={null} />
              )}
              <NavItem
                icon={<MessageSmileSquare />}
                path="/contact-us"
                label="Contact us"
                isAccess={null}
              />
              <NavItem icon={<FileLock02 />} path="/legal" label="Legal" isAccess={null} />
            </div>

            {/* PROFILE DROPDOWN */}
            <div className="relative flex flex-col items-center">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="relative flex h-10 w-10 cursor-pointer items-center justify-center outline-none transition-transform active:scale-95"
              >
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
              </button>

              {isProfileOpen && (
                <>
                  {/* Backdrop untuk menutup dropdown saat klik luar area */}
                  <div 
                    className="fixed inset-0 z-10 h-full w-full cursor-default" 
                    onClick={() => setIsProfileOpen(false)} 
                  />
                  
                  {/* Menu Container */}
                  <div className="absolute bottom-0 left-full z-20 ml-4 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white p-1 shadow-xl ring-1 ring-black ring-opacity-5">
                    <Link
                      to="/profile"
                      onClick={() => {
                        setIsProfileOpen(false)
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <User01 size={18} className="text-gray-500" />
                      View profile
                    </Link>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false)
                        setLogoutConfirmOpen(true)
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-error-700 transition-colors hover:bg-error-25"
                    >
                      <LogOut04 size={18} className="text-error-600" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

Navigation.propTypes = {
  childs: PropTypes.node,
}

export default Navigation