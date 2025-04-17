import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar/Sidebar'

const DashboardLayout = () => {
  return (
    <div className='relative min-h-screen md:flex bg-gray-900'>
      <Sidebar />
      <div className='flex-1  md:ml-64'>
        <div className=''>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
