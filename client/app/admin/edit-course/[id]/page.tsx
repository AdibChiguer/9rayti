'use client'
import React from 'react'
import AdminSidebar from '../../../components/Admin/sidebar/AdminSidebar'
import Heading from '../../../utils/Heading'
import CreateCourse from '../../../components/Admin/Course/CreateCourse'
import DashboardHeader from '../../../../app/components/Admin/DashboardHeader'
import EditCourse from '../../../components/Admin/Course/EditCourse'

type Props = {}

function page({params}: any) {
  const id = params?.id();

  return (
    <div className=''>
      <Heading 
        title='9rayti - Edit Course'
        description='Edit course'
        keywords='9rayti, edit course, course'
      />
      <div className='flex'>
        <div className='1500px:w-[16%] w-1/5'>
          <AdminSidebar selectedItem={"Create Course"} />
        </div>
        <div className='w-[85%]'>
          <DashboardHeader />
          <EditCourse id={id}/>
        </div>
      </div>
    </div>
  )
}

export default page