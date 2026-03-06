import React, { createContext, useContext } from 'react'
import { myToaster } from '@interstellar-component'
import ProfileService from './service'
import { useApp } from '../../AppContext'

const ProfileContext = createContext()

function ProfileProvider(props) {
  const { getSession } = useApp()

  const getProfile = async () =>
    await ProfileService.getProfile()
      .then((res) => res.data)
      // .then(getSession())
      .catch(myToaster)

  const updateProfile = async (body) => {
    const formData = new FormData()
    if (body.photo instanceof File) {
      formData.append('photo', body.photo)
    }
    if (body.delete_photo) formData.append('delete_photo', body.delete_photo)
    formData.append('name', body.name)
    formData.append('username', body.username)
    formData.append('email', body.email)
    formData.append('whatsapp', body.whatsapp)
    return await ProfileService.updateProfile(formData)
      .then(myToaster)
      .then(getProfile)
      .then(getSession)
      .catch(myToaster)
  }

  return (
    <ProfileContext.Provider value={{ updateProfile, getProfile }}>
      {' '}
      {props.children}
    </ProfileContext.Provider>
  )
}

const useProfile = () => {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}

export { ProfileProvider, useProfile }
