import React from 'react'
import Sidebar from '../common/Sidebar'
import { Outlet } from 'react-router'
import RightPanel from '../common/RightPanel'

function Layout() {
  return (
    <>
      <Sidebar />
      <Outlet />
      <RightPanel/>
    </>
  )
}

export default Layout