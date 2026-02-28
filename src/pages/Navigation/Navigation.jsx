/* eslint-disable react-hooks/exhaustive-deps */
import { useState, React, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link, useLocation } from 'react-router-dom'
import {
  LogOut01,
  LogOut04,
  Rows01,
  Settings01,
  User01,
  Menu01,
  XClose,
} from '@untitled-ui/icons-react'
import {
  MyAvatar,
  MyTooltip,
  MyConfirmModal,
  MyPopper,
  MyModalSlider,
} from '@interstellar-component'
// import ProfileSlider from '../Profile/ProfileSlider'
import { useLogin } from '../Login/Context'
import { useApp } from '../../AppContext'
import { Access } from '../../services/Helper'
import bipura_logo from '../../assets/Login/bipura_logo.png'
// import SecurityModal from '../../localComponents/ModalSecurity'

function PAction({ target }) {
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false)
  // const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false)
  const { isProfileSliderOpen, setIsProfileSliderOpen } = useLogin()
  const { logout, shouldChangePassword } = useApp()

  return (
    <>
      {/* <SecurityModal  /> */}
      <MyConfirmModal
        open={isConfirmModalOpen}
        title="Konfirmasi keluar"
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={logout}
        message="Anda ingin keluar dari akun ini. Apakah anda yakin ingin melanjutkan?"
        icon={<LogOut04 className="text-warning-600" />}
        bgColor="bg-error-100"
      />
      {/* <SecurityModal
        open={isSecurityModalOpen}
        title={'Kemanan password'}
        // onClose={() => setIsSecurityModalOpen(false)}
        showCloseButton={false}
        message="Demi keamanan, silakan ganti kata sandi Anda sebelum menggunakan akun ini untuk pertama kali."
        icon={<AlertCircle className="text-warning-600" />}
        actions={
          <MyButton
            expanded
            color="primary"
            variant="filled"
            size="lg"
            onClick={() => {
              setIsSecurityModalOpen(false)
              setIsProfileSliderOpen(true)
            }}
          >
            <p className="text-sm-semibold">Ganti password</p>
          </MyButton>
        }
      /> */}
      {/* <MyModalSlider
        open={isProfileSliderOpen}
        element={<ProfileSlider />}
        onClose={() => {
          if (!shouldChangePassword) setIsProfileSliderOpen(false)
        }}
      /> */}
      <MyPopper target={target} placement="right-start">
        {(open, anchorEl, handleOpen, handleClose) => (
          <div className="flex w-[200px] flex-col rounded-md bg-white shadow-md">
            {/* Container with adjusted width */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 shadow-sm">
              <div className="flex flex-col rounded-xl bg-gray-100 outline outline-1 outline-gray-200">
                {/* View Profile button */}
                <button
                  onClick={() => {
                    setIsProfileSliderOpen(true)
                    handleClose()
                  }}
                  className="flex items-center gap-3 rounded-md px-4 py-2 text-gray-700 transition-colors duration-200 ease-in-out hover:bg-white hover:text-gray-900"
                >
                  <User01 />
                  <p className="text-sm-medium">Lihat profil</p>
                </button>

                {/* Sign out button */}
                <button
                  onClick={() => {
                    setConfirmModalOpen(true)
                    handleClose()
                  }}
                  className="flex items-center gap-3 rounded-md px-4 py-2 pr-[90px] text-red-700 transition-colors duration-200 ease-in-out hover:bg-white hover:text-red-900"
                >
                  <LogOut01 />
                  <p className="text-sm-medium">Keluar</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </MyPopper>
    </>
  )
}

function Navigation({ childs }) {
  const { user, accesses, setAccesses } = useApp()
  const location = useLocation()
  // console.log('accesses', accesses)

  const isAccessAllowed = (accessName) => true // dummy value to allow showing all pages
  // const access = accesses.find((acces) => acces.name === accessName)
  // if (access) {
  //   return access
  // }
  // return accesses.some((acces) => acces.name === 'Semua menu')

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // console.log('user', user)

  useEffect(() => {
    if (user && user.role && user.role.access) {
      const accessNames = user.role.access.map((access) => {
        const permissions = access?.menu_access?.access || []
        // console.log('permissions', permissions)

        return {
          name: access.name,
          view: permissions?.view || false,
          edit_delete: permissions?.edit_delete || false,
          force_change_status: permissions?.fcs || false,
        }
      })
      // console.log('accessNames', accessNames)

      setAccesses(accessNames)
    }
  }, [user])

  return (
    <>
      {/* Mobile Top Navigation */}
      <div className="flex w-full items-center justify-between p-4 md:hidden absolute z-50">
        <div className="flex items-center justify-center">
          <img src={bipura_logo} alt="logomark" width={28} height={14} />
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-light-500 hover:text-gray-700"
        >
          {isMobileMenuOpen ? <XClose /> : <Menu01 />}
        </button>
      </div>

      <main
        className={`fixed md:relative z-40 flex h-screen w-20 min-w-[90px] flex-col justify-between p-2 pt-16 md:pt-2 transition-transform duration-300 ease-in-out bg-white ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <section className="flex h-full w-full flex-col items-center gap-y-6 rounded-xl border border-gray-light-200 pt-5">
          <div className="ml-2 hidden md:flex items-center justify-center">
            <img src={bipura_logo} alt="logomark" width={28} height={14} />
          </div>
          {/* TOP */}
          <div className="flex h-full flex-1 flex-col">
            <Link to="/enquiry" onClick={() => setIsMobileMenuOpen(false)}>
              <MyTooltip
                placement="right"
                target={
                  <div
                    className={`${
                      location?.pathname.includes('/enquiry')
                        ? 'bg-gray-50 text-gray-700 drop-shadow-lg'
                        : 'text-gray-light-500'
                    } flex h-12 w-12 min-w-[48px] cursor-pointer items-center justify-center rounded-md ${
                      isAccessAllowed(Access?.USER) ? '' : 'hidden'
                    }`}
                  >
                    <Rows01 className="text-gray-400" />
                  </div>
                }
              >
                <p className="text-xs-semibold text-white">Application Enquiry</p>
              </MyTooltip>
            </Link>

            {/* <Link to="/dashboard">
              <MyTooltip
                placement="right"
                target={
                  <div
                    className={`${
                      location?.pathname.includes('/dashboard')
                        ? 'bg-gray-50 text-gray-700 drop-shadow-lg'
                        : 'text-gray-light-500'
                    } flex h-12 w-12 min-w-[48px] cursor-pointer items-center justify-center rounded-md ${
                      isAccessAllowed(Access?.DASHBOARD) ? '' : 'hidden'
                    }`}
                  >
                    <PieChart03 size={24} stroke="currentColor" />
                  </div>
                }
              >
                <span className="text-xs-semibold text-white">Dashboard</span>
              </MyTooltip>
            </Link> */}

            {/* <Link to="/customer">
              <MyTooltip
                placement="right"
                target={
                  <div
                    className={`${
                      location?.pathname.includes('/customer')
                        ? 'bg-gray-50 text-gray-700 drop-shadow-lg'
                        : 'text-gray-light-500'
                    } flex h-12 w-12 min-w-[48px] cursor-pointer items-center justify-center rounded-md ${
                      isAccessAllowed(Access?.NASABAH) ? '' : 'hidden'
                    }`}
                  >
                    <img
                      src={Nasabah}
                      alt="customer"
                      height={24}
                      width={24}
                      className={`${
                        location?.pathname.includes('/customer')
                          ? 'brightness-0 contrast-50 saturate-0' // simulate dark effect
                          : ''
                      }`}
                    />
                  </div>
                }
              >
                <span className="text-xs-semibold text-white">Nasabah</span>
              </MyTooltip>
            </Link> */}

            {/* <Link to="/audit-trail">
              <MyTooltip
                placement="right"
                target={
                  <div
                    className={`${
                      location?.pathname.includes('/audit-trail')
                        ? 'bg-gray-50 text-gray-700 drop-shadow-lg'
                        : 'text-gray-light-500'
                    } flex h-12 w-12 min-w-[48px] cursor-pointer items-center justify-center rounded-md ${
                      isAccessAllowed(Access?.AUDIT_TRAIL) ? '' : 'hidden'
                    }`}
                  >
                    <Table size={24} stroke="currentColor" />
                  </div>
                }
              >
                <p className="text-xs-semibold text-white">Audit trail</p>
              </MyTooltip>
            </Link> */}

            {/* <Link to="/approval">
              <MyTooltip
                placement="right"
                target={
                  <div
                    className={`${
                      location?.pathname.includes('/approval')
                        ? 'bg-gray-50 text-gray-700 drop-shadow-lg'
                        : 'text-gray-light-500'
                    } flex h-12 w-12 min-w-[48px] cursor-pointer items-center justify-center rounded-md ${
                      isAccessAllowed(Access?.APPROVAL) ? '' : 'hidden'
                    }`}
                  >
                    <CheckDone01 size={24} stroke="currentColor" />
                  </div>
                }
              >
                <p className="text-xs-semibold text-white">Otorisasi</p>
              </MyTooltip>
            </Link> */}
          </div>

          {/* BOTTOM */}
          <div className="flex w-full flex-col items-center gap-y-6 pb-6">
            <div className="gap-y-2 column">
              {/* <Link to="/enquiry">
                <MyTooltip
                  placement="right"
                  target={
                    <div
                      className={`${
                        location?.pathname.includes('/enquiry')
                          ? 'bg-gray-50 text-gray-700 drop-shadow-lg'
                          : 'text-gray-light-500'
                      } flex h-12 w-12 min-w-[48px] cursor-pointer items-center justify-center rounded-md ${
                        isAccessAllowed(Access?.USER) ? '' : 'hidden'
                      }`}
                    >
                      <Users01 />
                    </div>
                  }
                >
                  <p className="text-xs-semibold text-white">User management</p>
                </MyTooltip>
              </Link> */}
              <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)}>
                <MyTooltip
                  placement="right"
                  target={
                    <div
                      className={`${
                        location?.pathname.includes('/settings')
                          ? 'bg-gray-50 text-gray-700 drop-shadow-lg'
                          : 'text-gray-light-500'
                      } flex h-12 w-12 min-w-[48px] cursor-pointer items-center justify-center rounded-md ${
                        isAccessAllowed(Access?.SETTING) ? '' : 'hidden'
                      }`}
                    >
                      <Settings01 data-test="btn-nav-setting" size={24} stroke="currentColor" />
                    </div>
                  }
                >
                  <span className="text-xs-semibold text-white">Settings</span>
                </MyTooltip>
              </Link>
            </div>
            {/* <PAction
              target={(open, handleOpen) => (
                <MyTooltip
                  placement="right"
                  target={
                    <div
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation() // Prevent event propagation if needed
                        handleOpen(e)
                        // console.log(e)
                      }}
                    >
                      <MyAvatar
                        key={user?.photo_url || 'no-photo-avatar'}
                        size={48}
                        stroke="currentColor"
                        photo={
                          user?.photo_url
                            ? `${user?.photo_url}?time=${new Date().getTime()}`
                            : // user?.photo_url
                              null
                        } // Pass other necessary props to MyAvatar
                      />
                    </div>
                  }
                >
                  <span className="text-xs-semibold text-white">My Profile</span>
                </MyTooltip>
              )}
            /> */}
            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
              <MyTooltip
                placement="right"
                target={
                  <div
                    className={`${
                      location?.pathname.includes('/profile')
                        ? 'bg-gray-50 text-gray-700 drop-shadow-lg'
                        : 'text-gray-light-500'
                    } flex h-12 w-12 min-w-[48px] cursor-pointer items-center justify-center rounded-md ${
                      isAccessAllowed(Access?.SETTING) ? '' : 'hidden'
                    }`}
                  >
                    <MyAvatar
                      key={user?.photo_url || 'no-photo-avatar'}
                      size={48}
                      iconSize={24}
                      stroke="currentColor"
                      photo={
                        user?.photo_url
                          ? `${user?.photo_url}?time=${new Date().getTime()}`
                          : // user?.photo_url
                            null
                      }
                    />
                  </div>
                }
              >
                <span className="text-xs-semibold text-white">Profile</span>
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
